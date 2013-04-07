Dervish.Letter = function(char, x, y) {
  if (typeof y === 'undefined') {
    _location = x;
  } else {
    _location = new Dervish.Location(x, y)
  }
  this.initialize(char, _location);
}

Dervish.Letter.prototype = {
  initialize: function(char, location) {
    this.lockInPlace();
    this.char = char;
    this.location = location;
  },
  
  accelerateFrom: function(location, magnitude) {
    acceleration = new Dervish.Velocity(
      location.vectorTo(this.location).toUnitVector().x(magnitude)
    )
    this.velocity = this.velocity.add(acceleration);
  },
  
  accelerateTo: function(location, magnitude) {
    acceleration = new Dervish.Velocity(
      this.vectorTo(location).toUnitVector().x(magnitude)
    )
    this.velocity = this.velocity.add(acceleration);
  },
  
  checkForLock: function(timeElapsed) {
    cheatThreshold = 0.5 * Math.pow(timeElapsed, 2);
    if (this.target) {
      if (this.vectorToTarget().modulus() <= cheatThreshold) {
        this.location = this.target;
        this.target = null;
        this.lockInPlace()
      }
    } else if (this.antiTarget) {
      var myRect = new Dervish.Rect(this.location.x, this.location.y, 1, 1)
      if (!Dervish.boundingBox().partiallyContains(myRect)) {
        this.lockInPlace();
      };
    }
  },

  computeMove: function(timeIncrement) {
    if (!this.lockedAt) {
      move = this.velocity.computeMove(timeIncrement);
      newX = this.location.x + move.elements[0];
      newY = this.location.y + move.elements[1];
      this.location = new Dervish.Location(newX, newY);
    }
  },

  draw: function(pjs) {
    var movingColor = [214,136,142]
    pjs.noStroke();
    if (this.isLocked()) {
      var msSinceLock = new Date() - this.lockedAt
      var fullEasingTime = 500
      var color
      if (msSinceLock < fullEasingTime) {
        var ratio = msSinceLock / fullEasingTime
        color = [
          movingColor[0] + ((255 - movingColor[0]) * ratio),
          movingColor[1] + ((255 - movingColor[1]) * ratio),
          movingColor[2] + ((255 - movingColor[2]) * ratio)
        ]
      } else {
        color = [255,255,255]
      }
      pjs.fill(color[0], color[1], color[2], 255);
    } else {
      pjs.fill(movingColor[0], movingColor[1], movingColor[2], 255);
    }
    pjs.text(this.char, this.location.px(), this.location.py());
  },

  isLocked: function() {
    return this.lockedAt;
  },

  lockInPlace: function() {
    this.lockedAt = new Date()
    this.velocity = new Dervish.Velocity(0,0);
  },

  startMoving: function(target) {
    this.target = target;
    var vectorToTarget = this.vectorToTarget();
    magnitude = Math.random() + Math.random() * 750
    perpendicularVector = $V(
      [vectorToTarget.elements[1] * -1, vectorToTarget.elements[0]]
    ).toUnitVector().x(magnitude)
    startVelocity = new Dervish.Velocity(perpendicularVector);
    this.velocity = startVelocity;
    this.lockedAt = null
  },

  startMovingAwayFrom: function(antiTarget) {
    this.antiTarget = antiTarget;
    this.lockedAt = null
  },

  vectorTo: function(arg) {
    var otherLocation;
    if (arg.location) {
      otherLocation = arg.location;
    } else {
      otherLocation = arg;
    }
    return this.location.vectorTo(otherLocation);
  },

  vectorToTarget: function() {
    return this.vectorTo(this.target)
  }
};
