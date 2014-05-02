Bubblicious.TransitionState.Frame.CollisionResolver = function(bubbleStates) {
  this.bubbleStates = bubbleStates;
};

Bubblicious.TransitionState.Frame.CollisionResolver.prototype = {
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

  collisions: function() {
    return this.boundingBoxCollisions().concat(this.twoBubbleCollisions());
  },

  run: function() {
    var collisions = this.collisions();
    var attempts = 0
    while (collisions.length > 0) {
      resolutionAttempt = 
        new Bubblicious.TransitionState.Frame.CollisionResolver.Attempt(
          this.bubbleStates, collisions
        )
      attempts += 1
      if (attempts > 20) debugger
      this.bubbleStates = resolutionAttempt.result();
      collisions = this.collisions();
    }
    return this.bubbleStates;
  },

  twoBubbleCollisions: function() {
    var self = this,
        bubbleState1, bubbleState2;
    result = [];
    for (var i = 0; i < this.bubbleStates.length; i++) {
      for (var j = i + 1; j < this.bubbleStates.length; j++) {
        bubbleState1 = this.bubbleStates[i];
        bubbleState2 = this.bubbleStates[j];
        if (bubbleState1.overlaps(bubbleState2) && bubbleState1.isOnscreen() &&
            bubbleState2.isOnscreen()) {
          result.push(
            new Bubblicious.Collision.TwoBubble([bubbleState1, bubbleState2])
          );
        }
      }
    }
    return result
  }
}

Bubblicious.TransitionState.Frame.CollisionResolver.Attempt = function(bubbleStates, collisions) {
  this.bubbleStates = bubbleStates;
  this.collisions = collisions;
}

Bubblicious.TransitionState.Frame.CollisionResolver.Attempt.prototype = {
  corrections: function() {
    if (!this._corrections) {
      this._corrections = _(this.collisions).chain().map(function(collision) {
        return collision.corrections()
      }).flatten().value();
    }
    return this._corrections
  },

  result: function() {
    var self = this;
    return _(this.bubbleStates).map(function(bubbleState) {
      corrections = _(self.corrections()).select(function(correction) {
        return correction.bubble === bubbleState.bubble
      });
      _(corrections).each(function(correction) {
        bubbleState = correction.apply(bubbleState);
      });
      return bubbleState;
    });
  }
}

