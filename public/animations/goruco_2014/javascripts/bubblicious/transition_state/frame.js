Bubblicious.TransitionState.Frame = function(bubbles, previousTime, transitionStart) {
  this.bubbles = bubbles;
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
    if (!this._gravity) {
      var base = 10,
          scaleFactor = 400;
      this._gravity = base * (1 + (this.transitionTimeElapsed() * scaleFactor))
    }
    return this._gravity
  },

  leftSuccessfully: function(bubble) {
    return bubble.antiTarget && bubble.isFullyOffscreen();
  },

  resolveAllCollisions: function() {
    var resolver = new Bubblicious.TransitionState.Frame.CollisionResolver(
      this.bubbles
    )
    this.bubbles = resolver.run();
  },

  run: function() {
    var self = this;
    this.bubbles = _(this.bubbles).map(function(bubble) {
      advanced = bubble.advanced(
        self.timeIncrement(), self.gravity(), self.cheatThreshold()
      );
      return advanced
    });
    this.resolveAllCollisions();
    this.bubbles = _(this.bubbles).reject(function(bubble) {
      return self.leftSuccessfully(bubble);
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
