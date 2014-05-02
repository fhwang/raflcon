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

  boundingBoxCollisions: function() {
    var self = this;
    return _(this.bubbles).chain().collect(function(bubble) {
      return self.boundingBoxCollision(bubble);
    }).compact().value();
  },

  collisions: function() {
    return this.boundingBoxCollisions().concat(this.twoBubbleCollisions());
  },

  run: function() {
    var collisions = this.collisions();
    var attempts = 0
    while (collisions.length > 0) {
      resolutionAttempt = 
        new Bubblicious.TransitionState.Frame.CollisionResolver.Attempt(
          this.bubbles, collisions
        )
      attempts += 1
      if (attempts > 10) debugger
      this.bubbles = resolutionAttempt.result();
      collisions = this.collisions();
    }
    return this.bubbles;
  },

  twoBubbleCollisions: function() {
    var self = this,
        bubble1, bubble2;
    result = [];
    for (var i = 0; i < this.bubbles.length; i++) {
      for (var j = i + 1; j < this.bubbles.length; j++) {
        bubble1 = this.bubbles[i];
        bubble2 = this.bubbles[j];
        if (bubble1.overlaps(bubble2) && bubble1.isOnscreen() &&
            bubble2.isOnscreen()) {
          result.push(
            new Bubblicious.Collision.TwoBubble([bubble1, bubble2])
          );
        }
      }
    }
    return result
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

