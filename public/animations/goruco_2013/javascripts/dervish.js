Array.prototype.sortRandom = function() {
  return _(this).sortBy(function() { return Math.random() });
}

Dervish = function() {
  this.initialize();
};

_(function() {
  this.rect = [30,10];
  this.boxPadding = 2;
  this.letterMargin = 0.5;

  this.boundingBox = function() {
    if (!this._boundingBox) {
      this._boundingBox = new Dervish.BoundingBox()
    }
    return this._boundingBox;
  };

  this.letterDiameter = function() {
    if (!this._letterDiameter) {
      unitsWide = (this.boxPadding * 2) + this.rect[0] + 
                  (this.rect[0] - 1) * this.letterMargin
      fromWidth = Math.floor(this.canvasWidth / unitsWide)
      unitsHigh = (this.boxPadding * 2) + this.rect[1] + 
                  (this.rect[1] - 1) * this.letterMargin
      fromHeight = Math.floor(this.canvasHeight / unitsHigh)
      this._letterDiameter = _([fromWidth, fromHeight]).min()
    }
    return this._letterDiameter;
  };

  this.maxDimensions = function() {
    if (!this._maxDimensions) {
      this._maxDimensions = [
        this.rect[0] + ((this.rect[0]-1) * this.letterMargin) + this.boxPadding,
        this.rect[1] + ((this.rect[1]-1) * this.letterMargin) + this.boxPadding
      ]
    }
    return this._maxDimensions;
  };

  this.minDimensions = function() {
    if (!this._minDimensions) {
      this._minDimensions = [-this.boxPadding, -this.boxPadding];
    }
    return this._minDimensions;
  };

}).bind(Dervish)();

Dervish.prototype = {
  initialize: function() {
    this.letters = []
  },

  draw: function(pjs) {
    pjs.colorMode('RGB');
    pjs.background(172, 17, 28);
    _(this.letters).each(function(letter) { letter.draw(pjs) });
  },

  start: function() {
    var canvas = $('canvas')[0];
    var pjs = new Processing(canvas);
    pjs.setup = function() {
      pjs.size(Dervish.canvasWidth, Dervish.canvasHeight);
      var font = pjs.loadFont('Courier New');
      pjs.textFont(font, Dervish.fontSize);
      pjs.loop();
    };
    pjs.draw = function() {
      dervish.update();
      dervish.draw(pjs);
    };
    pjs.setup();
  },

  transitionTo: function(nextLines) {
    this.transition = new Dervish.Transition(this, nextLines);
    this.transition.start();
  },

  update: function() {
    if (this.transition) {
      this.transition.update();
      if (this.transition.isFinished) {
        this.transition = null;
      }
    }
  }
};

Dervish.Connection = function(letter1, letter2) {
  this.initialize(letter1, letter2);
};

Dervish.Connection.prototype = {
  initialize: function(letter1, letter2) {
    this.letters = [letter1, letter2];
  },

  accelerateLettersTogether: function(timeIncrement, timeElapsed) {
    elasticConstant = 100 * Math.pow(timeElapsed, 2);
    distance = this.letters[0].vectorTo(this.letters[1]).modulus();
    lengthAtRest = Dervish.letterMargin + 1;
    stretchedLength = distance - lengthAtRest;
    if (stretchedLength > 0) {
      forceOverTime = elasticConstant * stretchedLength * timeIncrement;
      if (this.letters[0].isLocked()) {
        this.letters[1].accelerateTo(this.letters[0].location, forceOverTime);
      } else if (this.letters[1].isLocked()) {
        this.letters[0].accelerateTo(this.letters[1].location, forceOverTime);
      } else {
        this.letters[0].accelerateTo(this.letters[1].location, forceOverTime / 2)
        this.letters[1].accelerateTo(this.letters[0].location, forceOverTime / 2)
      } 
    }
  }
};

Dervish.Location = function(x, y) {
  this.initialize(x, y);
};

Dervish.Location.prototype = {
  initialize: function(x, y) {
    this.x = x;
    this.y = y;
  },

  px: function() {
    var rectWidthInUnits = 
      Dervish.rect[0] + ((Dervish.rect[0] - 1) * Dervish.letterMargin);
    var rectWidthInPx = rectWidthInUnits * Dervish.letterDiameter()
    var horizontalPadding = (Dervish.canvasWidth - rectWidthInPx) / 2;
    var units = (1 + Dervish.letterMargin) * this.x;
    return horizontalPadding + (units * Dervish.letterDiameter());
  },

  py: function() {
    var rectHeightInUnits = 
      Dervish.rect[1] + ((Dervish.rect[1] - 1) * Dervish.letterMargin);
    var rectHeightInPx = rectHeightInUnits * Dervish.letterDiameter()
    var verticalPadding = (Dervish.canvasHeight - rectHeightInPx) / 2;
    var units = (1 + Dervish.letterMargin) * this.y;
    return Dervish.canvasHeight - verticalPadding - 
           (units * Dervish.letterDiameter());
  },

  vectorTo: function(otherLoc) {
    return Vector.create([otherLoc.x - this.x, otherLoc.y - this.y]);
  }
};

Dervish.Rect = function(x, y, width, height) {
  this.initialize(x, y, width, height);
}

Dervish.Rect.prototype = {
  initialize: function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  },

  allCorners: function() {
    return [
      new Dervish.Location(this.x, this.y), 
      new Dervish.Location(this.x, this.y + this.height),
      new Dervish.Location(this.x + this.width, this.y + this.height),
      new Dervish.Location(this.x + this.width, this.y)
    ]
  }
}

Dervish.Velocity = function(first, second) {
  if (typeof second === 'undefined') {
    vector = first;
  } else {
    vector = Vector.create([first, second]);
  }
  this.initialize(vector);
}

Dervish.Velocity.prototype = {
  initialize: function(vector) {
    this.vector = vector
  },

  add: function(arg) {
    vector = arg.vector ? arg.vector : arg;
    newVector = this.vector.add(vector)
    return new Dervish.Velocity(newVector);
  },

  computeMove: function(timeIncrement) {
    return this.vector.x(timeIncrement);
  }
}
