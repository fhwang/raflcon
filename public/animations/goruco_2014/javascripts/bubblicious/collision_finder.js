Bubblicious.CollisionFinder = function(bubbleStates) {
  this.bubbleStates = bubbleStates;
};

Bubblicious.CollisionFinder.comparisonBoxDivisor = 20;

Bubblicious.CollisionFinder.prototype = {
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

  comparisonBoxGrid: function() {
    return new Bubblicious.CollisionFinder.ComparisonBoxGrid(this.bubbleStates)
  },

  result: function() {
    return this.boundingBoxCollisions().concat(this.twoBubbleCollisions());
  },

  twoBubbleCollisions: function() {
    return this.comparisonBoxGrid().collisions();
  }
}
