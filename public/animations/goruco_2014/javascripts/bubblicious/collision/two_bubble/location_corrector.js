Bubblicious.Collision.TwoBubble.LocationCorrector = function(collision) {
  this.collision = collision
}

Bubblicious.Collision.TwoBubble.LocationCorrector.prototype = {
  correction: function(i, normal) {
    var multiplier = this.ratioOfTotalSpeed(i);
    if (i === 0) {
      otherIdx = 1;
      multiplier *= -1;
    } else {
      otherIdx = 0;
    }
    if (this.collision.bubbleStates[otherIdx].locked) multiplier *= 2
    vector = normal.x(multiplier); 
    return new Bubblicious.Collision.LocationCorrection(
      this.collision.bubbleStates[i].bubble, vector
    )
  },

  nonZeroDistanceCorrections: function(vectorBetween) {
    var self = this,
        result = []
    overlapDistance = Math.max(this.collision.overlapDistance(), 0.001)
    normal = vectorBetween.toUnitVector().x(overlapDistance)
    _([0,1]).each(function(i) {
      if (!self.collision.bubbleStates[i].locked) { 
        result.push(self.correction(i, normal))
      }
    });
    return result
  },

  ratioOfTotalSpeed: function(i) {
    var totalSpeed = _(this.collision.bubbleStates).reduce(function(memo, bubbleState) {
      return memo + bubbleState.speed();
    }, 0);
    return this.collision.bubbleStates[i].speed() / totalSpeed;
  },

  run: function() {
    var vectorBetween = this.collision.normalVector();
    if (vectorBetween.modulus() > 0) {
      return this.nonZeroDistanceCorrections(vectorBetween)
    } else {
      return this.zeroDistanceCorrections();
    }
  },

  // When the bodies are at the exact same location, we push back the fastest
  // one and call it a day
  zeroDistanceCorrections: function() {
    var fastestBubbleState, originalVelocity;
    fastestBubbleState = this.collision.fastestBubbleState();
    unitVector = fastestBubbleState.velocity.vector().toUnitVector();
    if (unitVector.modulus() === 0) {
      var x = (Math.random() * 2) - 1
      var y = (Math.random() * 2) - 1
      unitVector = $V([x, y]).toUnitVector();
    }
    vector = unitVector.x(-1);
    return [new Bubblicious.Collision.LocationCorrection(
      fastestBubbleState.bubble, vector
    )];
  }
}
