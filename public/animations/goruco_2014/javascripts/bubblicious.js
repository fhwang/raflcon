Bubblicious = function(lines) {
  var canvas = $('canvas')[0];
  this.setSteadyState(new Bubblicious.Layout(lines).bubbleStates);
  this.processingWrapper = new Bubblicious.ProcessingWrapper(this, canvas);
}

_(function() {
  this.rect = [25,10];
  this.canvasWidth = 1000;
  this.padding = 7;
  this.spacing = 2.1; 

  this.boundingBox = function() {
    if (!this._boundingBox) {
      this._boundingBox = new Bubblicious.BoundingBox();
    }
    return this._boundingBox;
  };

  this.bubblePDiameter = function() {
    if (!this._bubblePDiameter) {
      this._bubblePDiameter = Math.floor(
        this.canvasWidth / (this.maxDimensions()[0] + this.padding)
      )
    }
    return this._bubblePDiameter
  };

  this.canvasHeight = function() {
    if (!this._canvasHeight) {
      this._canvasHeight = 
        this.bubblePDiameter() * (this.maxDimensions()[1] + this.padding)
    }
    return this._canvasHeight
  };

  this.firstRandomElt = function(array) {
    return _(array).sortBy(function() { return Math.random() })[0];
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
    this._bubblePDiameter = null;
    this._canvasHeight = null;
    this._maxDimensions = null;
    this._minDimensions = null;
  }
}).bind(Bubblicious)();

Bubblicious.prototype = {
  advanceBubbleStates: function() {
    return this.state.advanceBubbleStates();
  },

  setSteadyState: function(bubbleStates) {
    this.state = new Bubblicious.SteadyState(bubbleStates)
  },

  transitionTo: function(lines) {
    //var self = this,
        //startBubbleStates = this.state.bubbleStates,
        //endBubbleStates = new Bubblicious.Layout(lines).bubbleStates;
    this.state = new Bubblicious.ShrinkingState(this.state.bubbleStates)
  }

    //this.state = new Bubblicious.TransitionState(
      //startBubbleStates, endBubbleStates
    //);
    //this.state.promise.done(function() {
      //self.setSteadyState(self.state.bubbleStates);
    //});
  //}
}

Bubblicious.SteadyState = function(bubbleStates) {
  var size = 1 + Bubblicious.spacing
  this.bubbleStates = []
  for (var i = 0; i < bubbleStates.length; i++) {
    bubbleState = bubbleStates[i].modifiedCopy({size: size})
    this.bubbleStates.push(bubbleState)
  }
}

Bubblicious.SteadyState.prototype = {
  advanceBubbleStates: function() {
    return this.bubbleStates;
  }
}

Bubblicious.ShrinkingState = function(bubbleStates) {
  var stateStart = new Date(),
      phaseTime = 0.11,
      phase = 0;
  this.bubbleStates = []
  bubbleStates = _(bubbleStates).sortBy(function() { return Math.random() });
  while (bubbleStates.length > 0) {
    bubblesToMark = 2 * phase
    phaseStart = new Date(stateStart.getTime() + (phase * phaseTime * 1000))
    for (i = 0; i < bubblesToMark; i++) {
      if (bubbleStates.length > 0) {
        bubbleState = bubbleStates.shift().modifiedCopy({shrinkStart: phaseStart})
        this.bubbleStates.push(bubbleState)
      }
    }
    phase += 1;
  }
}

Bubblicious.ShrinkingState.prototype = {
  endSize: 1,
  shrinkTime: 0.2,
  startSize: 1 + Bubblicious.spacing,

  advanceBubbleStates: function() {
    var newBubbleStates = []
    var timestamp = new Date()
    for (var i = 0; i < this.bubbleStates.length; i++) {
      bubbleState = this.bubbleStates[i]
      if (bubbleState.size === this.endSize || bubbleState.shrinkStart >= timestamp) {
        newBubbleStates.push(bubbleState)
      } else if (bubbleState.shrinkStart <= timestamp) {
        var timeElapsed = (timestamp - bubbleState.shrinkStart) / 1000
        if (timeElapsed < this.shrinkTime) {
          size = 
            this.startSize - 
            (
              (this.startSize - this.endSize) *
              Math.pow((timeElapsed / this.shrinkTime), 2)
            );
        } else {
          size = this.endSize;
        }
        newBubbleState = bubbleState.modifiedCopy({size: size})
        newBubbleStates.push(newBubbleState)
      }
    }
    this.bubbleStates = newBubbleStates;
    return this.bubbleStates;
  }
}
