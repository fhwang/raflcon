Bubblicious.TransitionState.Frame = function(
  bubbleStates, previousTime, transitionStart
) {
  this.bubbleStates = bubbleStates;
  this.previousTime = previousTime;
  this.transitionStart = transitionStart;
  this.timestamp = new Date();
};

Bubblicious.TransitionState.Frame.prototype = {
  antiTargetGravity: function() {
    if (typeof this._antiTargetGravity === 'undefined') {
      lag = 1;
      if (this.transitionTimeElapsed() > lag) {
        this._antiTargetGravity = this.gravity(
          this.transitionTimeElapsed() - lag
        )
      } else {
        this._antiTargetGravity = 0
      }
    }
    return this._antiTargetGravity;
  },

  cheatThreshold: function() {
    if (!this._cheatThreshold) {
      var base = 0.05,
          scaleFactor = 20;
      this._cheatThreshold = 
        base * (1 + (this.transitionTimeElapsed() * scaleFactor))
    }
    return this._cheatThreshold
  },

  gravity: function(timeElapsed) {
    var base = 12500,
        scaleFactor = 2.5;
    return base * (1 + (timeElapsed * scaleFactor))
  },

  leftSuccessfully: function(bubbleState) {
    return bubbleState.antiTarget && bubbleState.isFullyOffscreen();
  },

  resolveAllCollisions: function() {
    var resolver = new Bubblicious.CollisionResolver(this.bubbleStates)
    this.bubbleStates = resolver.run();
  },

  run: function() {
    var self = this;
    this.bubbleStates = _(this.bubbleStates).map(function(bubbleState) {
      advancer = new Bubblicious.TransitionState.Frame.Advancer(
        bubbleState, 
        self.timeIncrement(), 
        self.targetGravity(),
        self.antiTargetGravity(),
        self.cheatThreshold()
      )
      return advancer.result()
    });
    this.resolveAllCollisions();
    this.bubbleStates = _(this.bubbleStates).reject(function(bubbleState) {
      return self.leftSuccessfully(bubbleState);
    });
  },

  targetGravity: function() {
    if (!this._targetGravity) {
      this._targetGravity = this.gravity(this.transitionTimeElapsed());
    }
    return this._targetGravity
  },

  transitionTimeElapsed: function() {
    if (!this._transitionTimeElapsed) {
      this._transitionTimeElapsed = 
        (this.timestamp - this.transitionStart) / 1000;
    }
    return this._transitionTimeElapsed;
  },

  timeIncrement: function() {
    if (!this._timeIncrement) {
      this._timeIncrement = (this.timestamp - this.previousTime) / 1000;
    }
    return this._timeIncrement
  }
}
