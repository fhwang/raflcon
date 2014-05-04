Bubblicious.CollisionFinder.ComparisonBox = function(xBounds, yBounds) {
  this.xBounds = xBounds;
  this.yBounds = yBounds;
  this.bubbleStates = []
}

Bubblicious.CollisionFinder.ComparisonBox.prototype = {
  add: function(bubbleState) {
    this.bubbleStates.push(bubbleState)
  },

  colliding: function(bubbleState1, bubbleState2) {
    return (!bubbleState1.locked || !bubbleState2.locked) && 
      (bubbleState1.overlaps(bubbleState2))
  },

  collision: function(bubbleState1, bubbleState2) {
    return new Bubblicious.Collision.TwoBubble([bubbleState1, bubbleState2])
  },

  collisions: function() {
    var self = this,
        bubbleState1, bubbleState2;
    result = [];
    for (var i = 0; i < this.bubbleStates.length; i++) {
      bubbleState1 = this.bubbleStates[i];
      for (var j = i + 1; j < this.bubbleStates.length; j++) {
        bubbleState2 = this.bubbleStates[j];
        if (this.colliding(bubbleState1, bubbleState2)) {
          result.push(this.collision(bubbleState1, bubbleState2))
        }
      }
    }
    return result
  },
}
