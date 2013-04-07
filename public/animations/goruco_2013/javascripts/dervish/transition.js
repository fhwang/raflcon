Dervish.Transition = function(dervish, nextLines) {
  this.initialize(dervish, nextLines);
};

Dervish.Transition.prototype = {
  initialize: function(dervish, nextLines) {
    this.dervish = dervish;
    this.goal = new Dervish.Goal(nextLines)
  },

  newLetterForTarget: function(sourceLetters, newLetter) {
    var self = this, target = newLetter.location
    var lettersStartingOnscreen = _(sourceLetters).filter(function(sourceLetter) {
      unclaimed = _(self.newLetters).every(function(l) { 
        return l.location != sourceLetter.location
      })
      return sourceLetter.char == newLetter.char && unclaimed
    });
    if (lettersStartingOnscreen.length > 0) {
      letter = lettersStartingOnscreen.sortRandom()[0];
      newLetter.location = letter.location
    } else {
      offscreenLocation = this.randomAvailableOffscreenLocation(sourceLetters);
      newLetter.location = offscreenLocation;
    }
    newLetter.startMoving(target)
    return newLetter;
  },

  randomAvailableOffscreenLocation: function(letters) {
    var clearSpaceFound = false,
        x, y;
    while (!clearSpaceFound) {
      x = this.randomOffscreenAxisPoint(0);
      y = this.randomOffscreenAxisPoint(1);
      clearSpaceFound = _(letters).all(function(b) {
        return (b.location.x !== x || b.location.y !== y)
      });
    }
    return new Dervish.Location(x, y);
  },

  randomOffscreenAxisPoint: function(axis) {
    randAmount = Dervish.boxPadding * Math.random(); 
    if (Math.random() < 0.5) {
      return Dervish.minDimensions()[axis] - randAmount;
    } else {
      return Dervish.maxDimensions()[axis] + randAmount;
    }
  },

  start: function() {
    var self = this, sourceLetters = this.dervish.letters;
    this.newLetters = []
    this.startedAt = new Date();
    this.updatedAt = new Date();
    _(this.goal.letters()).each(function(targetLetter) {
      self.newLetters.push(
        self.newLetterForTarget(sourceLetters, targetLetter)
      );
    });
    var leaving = _(this.dervish.letters).select(function(sourceLetter) {
      return _(self.newLetters).all(function(newLetter) {
        return newLetter.location != sourceLetter.location
      });
    });
    _(leaving).each(function(letter) {
      var x = Math.random() * Dervish.rect[0]
      var y = Math.random() * Dervish.rect[1]
      antiTarget = new Dervish.Location(x,y);
      letter.startMovingAwayFrom(antiTarget);
    });
    this.dervish.letters = _(this.newLetters).compact().concat(leaving);
    this.connections = this.goal.connections
  },

  update: function() {
    var frame = new Dervish.Transition.Frame(
      this.dervish.letters, this.connections, this.updatedAt, this.startedAt
    );
    frame.run()
    this.updatedAt = frame.time;
    this.dervish.letters = frame.letters;
  },
};

Dervish.Transition.Frame = function(letters, connections, lastUpdatedAt, startedAt) {
  this.initialize(letters, connections, lastUpdatedAt, startedAt);
};

Dervish.Transition.Frame.prototype = {
  initialize: function(letters, connections, lastUpdatedAt, startedAt) {
    this.letters = letters;
    this.connections = connections;
    this.time = new Date()
    this.timeIncrement = (this.time / lastUpdatedAt) / 1000;
    this.timeElapsed = (this.time - startedAt) / 1000;
  },

  gravitateLetterFromAntiTarget: function(letter) {
    letter.accelerateFrom(
      letter.antiTarget,
      this.gravityMagnitude(letter.location, letter.antiTarget)
    )
  },

  gravitateLetterToTarget: function(letter) {
    letter.accelerateTo(
      letter.target, 
      this.gravityMagnitude(letter.location, letter.target)
    )
  },

  gravityMagnitude: function(point1, point2) {
    var gravity = 1000 * Math.pow(this.timeElapsed, 2)
    return gravity * 
           Math.pow(point1.vectorTo(point2).modulus(), 2) * 
           this.timeIncrement;
  },

  repelLettersAwayFromEachOther: function(letter1, letter2, distance) {
    if (distance < 1) {
      forceOverTime = this.repulsionConstant() * (1 - distance) * this.timeIncrement
      if (letter1.isLocked()) {
        letter2.accelerateFrom(letter1.location, forceOverTime);
      } else if (letter2.isLocked()) {
        letter1.accelerateFrom(letter2.location, forceOverTime);
      } else {
        letter1.accelerateFrom(letter2.location, forceOverTime / 2)
        letter2.accelerateFrom(letter1.location, forceOverTime / 2)
      } 
    }
  },

  repulsionConstant: function() {
    if (!this._repulsionConstant) {
      this._repulsionConstant = 100000 / Math.pow(this.timeElapsed, 0.5)
    }
    return this._repulsionConstant
  },

  run: function() {
    var self = this;
    _(this.letters).each(function(letter) {
      if (!letter.isLocked()) {
        if (letter.target) {
          self.gravitateLetterToTarget(letter);
        } else {
          self.gravitateLetterFromAntiTarget(letter);
        }
      }
    });
    _(this.connections).each(function(connection) {
      connection.accelerateLettersTogether(self.timeIncrement, self.timeElapsed);
    });
    for (var i = 0; i < this.letters.length; i++) {
      for (var j = i + 1; j < this.letters.length; j++) {
        letter1 = this.letters[i]
        letter2 = this.letters[j]
        distance = letter1.vectorTo(letter2).modulus()
        if (distance < 1 && distance != 0) {
          this.repelLettersAwayFromEachOther(letter1, letter2, distance)
        }
      }
    }
    _(this.letters).each(function(letter) {
      letter.computeMove(self.timeIncrement);
    });
    _(this.letters).each(function(letter) {
      if (!letter.isLocked()) letter.checkForLock(self.timeElapsed);
    });
    this.letters = _(this.letters).reject(function(letter) {
      return (letter.antiTarget && letter.isLocked());
    });
  }
}
