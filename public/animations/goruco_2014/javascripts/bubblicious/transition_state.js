Bubblicious.TransitionState = function(startBubbleStates, endBubbleStates) {
  this.promise = $.Deferred();
  startFrame = new Bubblicious.TransitionState.StartFrame(
    startBubbleStates, endBubbleStates
  );
  this.bubbleStates = startFrame.bubbleStates();
  this.startedAt = new Date();
  this.updatedAt = this.startedAt;
};

Bubblicious.TransitionState.prototype = {
  advanceBubbleStates: function() {
    frame = new Bubblicious.TransitionState.Frame(
      this.bubbleStates, this.updatedAt, this.startedAt
    );
    this.updatedAt = frame.timestamp;
    frame.run();
    this.bubbleStates = frame.bubbleStates;
    if (_(this.bubbleStates).every(function(bubbleState) { return bubbleState.locked })) {
      this.promise.resolve()
    }
    return this.bubbleStates;
  },
}
