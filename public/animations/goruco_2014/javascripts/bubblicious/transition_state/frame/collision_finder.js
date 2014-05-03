Bubblicious.TransitionState.Frame.CollisionFinder = function(bubbleStates) {
  this.bubbleStates = bubbleStates;
};

Bubblicious.TransitionState.Frame.CollisionFinder.prototype = {
  boundingBoxCollision: function(bubbleState) {
    if (bubbleState.target && !bubbleState.enteringScreen) {
      if (!Bubblicious.boundingBox().fullyContains(bubbleState)) {
        return new Bubblicious.Collision.BoundingBox(bubbleState);
      }
    }
  },

  boundingBoxCollisions: function() {
    var self = this;
    return _(this.bubbleStates).chain().collect(function(bubbleState) {
      return self.boundingBoxCollision(bubbleState);
    }).compact().value();
  },

  result: function() {
    return this.boundingBoxCollisions().concat(this.twoBubbleCollisions());
  },

  twoBubbleCollisions: function() {
    var self = this,
        bubbleState1, bubbleState2;
    result = [];
    for (var i = 0; i < this.bubbleStates.length; i++) {
      bubbleState1 = this.bubbleStates[i];
      if (bubbleState1.isOnscreen()) {
        for (var j = i + 1; j < this.bubbleStates.length; j++) {
          bubbleState2 = this.bubbleStates[j];
          if (!bubbleState1.locked || !bubbleState2.locked) {
            if (bubbleState2.isOnscreen()) {
              if (bubbleState1.overlaps(bubbleState2)) {
                result.push(
                  new Bubblicious.Collision.TwoBubble(
                    [bubbleState1, bubbleState2]
                  )
                );
              }
            }
          }
        }
      }
    }
    return result
  }
}
