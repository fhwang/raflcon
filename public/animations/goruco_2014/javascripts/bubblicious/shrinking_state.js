Bubblicious.ShrinkingState = function(bubbleStates) {
  this.promise = $.Deferred();
  this.bubbleStates = this.bubbleStatesStartingInPhases(bubbleStates)
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
      newBubbleStates.push(this.advancedBubbleState(i, timestamp))
    }
    this.bubbleStates = newBubbleStates;
    if (_(this.bubbleStates).every(
      function(bubbleState) { return bubbleState.size === self.endSize }
    )) {
      this.promise.resolve()
    }
    return this.bubbleStates;
  },

  advancedBubbleState: function(i, timestamp) {
    bubbleState = this.bubbleStates[i]
    if (this.bubbleStateNeedsModification(bubbleState, timestamp)) {
      var timeElapsed = (timestamp - bubbleState.shrinkStart) / 1000
      size = this.size(timeElapsed) 
      bubbleState = bubbleState.modifiedCopy({size: size})
    }
    return bubbleState
  },

  bubbleStateNeedsModification: function(bubbleState, timestamp) {
    return (
      bubbleState.size !== this.endSize && bubbleState.shrinkStart <= timestamp
    )
  },

  bubbleStatesStartingInPhases: function(bubbleStates) {
    var stateStart = new Date(),
        phaseTime = 0.081,
        phase = 0,
        result = []
    bubbleStates = _(bubbleStates).sortBy(function() { return Math.random() });
    while (bubbleStates.length > 0) {
      bubblesToMark = 2 * phase
      phaseStart = new Date(stateStart.getTime() + (phase * phaseTime * 1000))
      for (i = 0; i < bubblesToMark; i++) {
        if (bubbleStates.length > 0) {
          bubbleState = bubbleStates.shift().modifiedCopy({shrinkStart: phaseStart})
          result.push(bubbleState)
        }
      }
      phase += 1;
    }
    return result;
  },
  
  size: function(timeElapsed) {
    if (timeElapsed < this.shrinkTime) {
      return (
        this.startSize - 
        (
          (this.startSize - this.endSize) *
          Math.pow((timeElapsed / this.shrinkTime), 2)
        )
      );
    } else {
      return this.endSize;
    }
  },
}
