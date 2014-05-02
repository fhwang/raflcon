Bubblicious.TransitionState = function(startBubbles, endBubbles) {
  this.promise = $.Deferred();
  startFrame = new Bubblicious.TransitionState.StartFrame(
    startBubbles, endBubbles
  );
  this.bubbles = startFrame.bubbles();
  this.startedAt = new Date();
  this.updatedAt = this.startedAt;
};

Bubblicious.TransitionState.prototype = {
  advanceBubbles: function() {
    frame = new Bubblicious.TransitionState.Frame(
      this.bubbles, this.updatedAt, this.startedAt
    );
    this.updatedAt = frame.timestamp;
    frame.run();
    this.bubbles = frame.bubbles;
    if (_(this.bubbles).every(function(bubble) { return bubble.locked })) {
      this.promise.resolve()
    }
    return this.bubbles;
  },
}
