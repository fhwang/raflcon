Bubblicious.CollisionResolver = function(bubbleStates) {
  this.bubbleStates = bubbleStates;
};

Bubblicious.CollisionResolver.prototype = {
  collisions: function() {
    finder = new Bubblicious.CollisionFinder(this.bubbleStates)
    return finder.result();
  },

  run: function() {
    var collisions = this.collisions();
    while (collisions.length > 0) {
      resolutionAttempt = new Bubblicious.CollisionResolver.Attempt(
        this.bubbleStates, collisions
      )
      this.bubbleStates = resolutionAttempt.result();
      collisions = this.collisions();
    }
    return this.bubbleStates;
  },
}

Bubblicious.CollisionResolver.Attempt = function(bubbleStates, collisions) {
  this.bubbleStates = bubbleStates;
  this.collisions = collisions;
}

Bubblicious.CollisionResolver.Attempt.prototype = {
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

