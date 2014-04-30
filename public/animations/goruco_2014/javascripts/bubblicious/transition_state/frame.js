Bubblicious.TransitionState.Frame = function(bubbles, previousTime, transitionStart) {
  this.bubbles = bubbles;
  this.previousTime = previousTime;
  this.transitionStart = transitionStart;
  this.timestamp = new Date();
};

Bubblicious.TransitionState.Frame.prototype = {
  resolveAllCollisions: function() {
    var resolver = new Bubblicious.TransitionState.Frame.CollisionResolver(
      this.bubbles
    )
    this.bubbles = resolver.run();
  },
}
