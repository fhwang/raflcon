Bubblicious.TransitionState.Frame.CollisionResolver = function(bubbles) {
  this.bubbles = bubbles;
};

Bubblicious.TransitionState.Frame.CollisionResolver.prototype = {
  boundingBoxCollision: function(bubble) {
    if (bubble.target && !bubble.enteringScreen) {
      if (!Bubblicious.boundingBox().fullyContains(bubble)) {
        return new Bubblicious.Collision.BoundingBox(bubble);
      }
    }
  },

  collisions: function() {
    var self = this;
    boundingBoxCollisions = _(this.bubbles).chain().collect(function(bubble) {
      return self.boundingBoxCollision(bubble);
    }).compact().value();
    return boundingBoxCollisions;
  },

  run: function() {
    var collisions = this.collisions();
    while (collisions.length > 0) {
      resolutionAttempt = 
        new Bubblicious.TransitionState.Frame.CollisionResolver.Attempt(
          this.bubbles, collisions
        )
      this.bubbles = resolutionAttempt.result();
      collisions = this.collisions();
    }
    return this.bubbles;
  }
}

Bubblicious.TransitionState.Frame.CollisionResolver.Attempt = function(bubbles, collisions) {
  this.bubbles = bubbles;
  this.collisions = collisions;
}

Bubblicious.TransitionState.Frame.CollisionResolver.Attempt.prototype = {
  corrections: function() {
    return _(this.collisions).chain().map(function(collision) {
      return collision.corrections()
    }).flatten().value();
  },

  result: function() {
    var self = this;
    return _(this.bubbles).map(function(bubble) {
      corrections = _(self.corrections()).select(function(correction) {
        return correction.isMatch(bubble)
      });
      _(corrections).each(function(correction) {
        bubble = correction.apply(bubble);
      });
      return bubble;
    });
  }
}

