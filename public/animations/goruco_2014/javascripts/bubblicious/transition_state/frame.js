Bubblicious.TransitionState.Frame = function(
  bubbleStates, previousTime, transitionStart
) {
  this.bubbleStates = bubbleStates;
  this.previousTime = previousTime;
  this.transitionStart = transitionStart;
  this.timestamp = new Date();
};

Bubblicious.TransitionState.Frame.prototype = {
  cheatThreshold: function() {
    if (!this._cheatThreshold) {
      var base = 0.05,
          scaleFactor = 20;
      this._cheatThreshold = 
        base * (1 + (this.transitionTimeElapsed() * scaleFactor))
    }
    return this._cheatThreshold
  },

  gravity: function() {
    var base = 12500,
        scaleFactor = 2.5;
    return base * (1 + (this.transitionTimeElapsed() * scaleFactor))
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
        self.gravity(),
        self.cheatThreshold()
      )
      return advancer.result()
    });
    this.resolveAllCollisions();
    this.bubbleStates = _(this.bubbleStates).reject(function(bubbleState) {
      return self.leftSuccessfully(bubbleState);
    });
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
