Bubblicious = function(lines) {
  var canvas = $('canvas')[0];
  this.setSteadyState(new Bubblicious.Layout(lines).bubbles);
  this.processingWrapper = new Bubblicious.ProcessingWrapper(this, canvas);
}

_(function() {
  this.rect = [3,2];
  this.canvasWidth = 850;
  this.padding = 7;
  this.spacing = 2.1; 

  this.boundingBox = function() {
    if (!this._boundingBox) {
      this._boundingBox = new Bubblicious.BoundingBox();
    }
    return this._boundingBox;
  };

  this.bubbleDiameter = function() {
    if (!this._bubbleDiameter) {
      this._bubbleDiameter = Math.floor(
        this.canvasWidth / (this.maxDimensions()[0] + this.padding)
      )
    }
    return this._bubbleDiameter
  };

  this.canvasHeight = function() {
    if (!this._canvasHeight) {
      this._canvasHeight = 
        this.bubbleDiameter() * (this.maxDimensions()[1] + this.padding)
    }
    return this._canvasHeight
  };

  this.maxDimensions = function() {
    if (!this._maxDimensions) {
      this._maxDimensions = [
        this.rect[0] + ((this.rect[0]-1) * this.spacing) + this.padding,
        this.rect[1] + ((this.rect[1]-1) * this.spacing) + this.padding
      ]
    }
    return this._maxDimensions
  };

  this.minDimensions = function() {
    if (!this._minDimensions) {
      this._minDimensions = [-this.padding, -this.padding];
    }
    return this._minDimensions
  };

  this.resetConstants = function() {
    this._boundingBox = null;
    this._bubbleDiameter = null;
    this._canvasHeight = null;
    this._maxDimensions = null;
    this._minDimensions = null;
  }
}).bind(Bubblicious)();

Bubblicious.prototype = {
  advanceBubbles: function() {
    return this.state.advanceBubbles();
  },

  setSteadyState: function(bubbles) {
    this.state = new Bubblicious.SteadyState(bubbles)
  },

  transitionTo: function(lines) {
    var self = this,
        startBubbles = this.state.bubbles,
        endBubbles = new Bubblicious.Layout(lines).bubbles;
    this.state = new Bubblicious.TransitionState(startBubbles, endBubbles);
    this.state.promise.done(function() {
      self.setSteadyState(self.state.bubbles);
    });
  }
}

Bubblicious.SteadyState = function(bubbles) {
  this.bubbles = bubbles;
}

Bubblicious.SteadyState.prototype = {
  advanceBubbles: function() {
    return this.bubbles;
  }
}

