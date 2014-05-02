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
    if (this.collision.bubbles[otherIdx].locked) multiplier *= 2
    vector = normal.x(multiplier); 
    return new Bubblicious.Collision.LocationCorrection(
      this.collision.bubbles[i], vector
    )
  },

  nonZeroDistanceCorrections: function(vectorBetween) {
    var self = this,
        result = []
    overlapDistance = Math.max(this.collision.overlapDistance(), 0.001)
    normal = vectorBetween.toUnitVector().x(overlapDistance)
    _([0,1]).each(function(i) {
      if (!self.collision.bubbles[i].locked) { 
        result.push(self.correction(i, normal))
      }
    });
    return result
  },

  ratioOfTotalSpeed: function(i) {
    var totalSpeed = _(this.collision.bubbles).reduce(function(memo, bubble) {
      return memo + bubble.speed();
    }, 0);
    return this.collision.bubbles[i].speed() / totalSpeed;
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
    var fastestBubble, originalVelocity;
    fastestBubble = this.collision.fastestBubble();
    unitVector = fastestBubble.velocity.vector().toUnitVector();
    if (unitVector.modulus() === 0) {
      var x = (Math.random() * 2) - 1
      var y = (Math.random() * 2) - 1
      unitVector = $V([x, y]).toUnitVector();
    }
    vector = unitVector.x(-1);
    return [new Bubblicious.Collision.LocationCorrection(
      fastestBubble, vector
    )];
  }
}
