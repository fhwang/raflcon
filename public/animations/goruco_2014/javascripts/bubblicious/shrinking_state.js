Bubblicious.ShrinkingState = function(bubbleStates) {
  var stateStart = new Date(),
      phaseTime = 0.081,
      phase = 0;
  this.promise = $.Deferred();
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
  shrinkTime: 0.15,
  startSize: 1 + Bubblicious.spacing,

  advanceBubbleStates: function() {
    var self = this,
        newBubbleStates = [],
        timestamp = new Date()
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
    if (_(this.bubbleStates).every(
      function(bubbleState) { return bubbleState.size === self.endSize }
    )) {
      this.promise.resolve()
    }
    return this.bubbleStates;
  }
}
