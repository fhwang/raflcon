Bubblicious.Collision.TwoBubble = function(bubbles) {
  this.bubbles = bubbles
}

Bubblicious.Collision.TwoBubble.prototype = _.extend({
  corrections: function() {
    return this.locationCorrections();
  },

  locationCorrections: function() {
    return new Bubblicious.Collision.TwoBubble.LocationCorrector(
      this
    ).run()
  },

  normalVector: function() {
    if (!this._normalVector) {
      this._normalVector = this.bubbles[0].vectorTo(this.bubbles[1]);
    }
    return this._normalVector;
  },

  overlapDistance: function() {
    if (!this._overlapDistance) {
      this._overlapDistance = this.bubbles[0].overlapDistance(this.bubbles[1]);
    }
    return this._overlapDistance
  }
}, Bubblicious.Collision.prototype);

Bubblicious.Collision.TwoBubble.LocationCorrector = function(collision) {
  this.collision = collision
}

Bubblicious.Collision.TwoBubble.LocationCorrector.prototype = {
  correction: function(i, normal) {
    if (i === 0) {
      otherIdx = 1;
      multiplier = -0.5;
    } else {
      otherIdx = 0;
      multiplier = 0.5;
    }
    if (this.collision.bubbles[otherIdx].locked) {
      multiplier = multiplier * 2
    }
    vector = normal.x(multiplier); 
    return new Bubblicious.Collision.LocationCorrection(
      this.collision.bubbles[i], vector
    )
  },

  ratioOfTotalSpeed: function(i) {
    var totalSpeed = _(this.collision.bubbles).reduce(function(memo, body) {
      return memo + body.speed();
    }, 0);
    return this.collision.bubbles[i].speed() / totalSpeed;
  },

  run: function() {
    var self = this,
        result = []
    overlapDistance = Math.max(this.collision.overlapDistance(), 0.001)
    vectorBetween = this.collision.normalVector();
    normal = vectorBetween.toUnitVector().x(overlapDistance)
    _([0,1]).each(function(i) {
      if (!self.collision.bubbles[i].locked) { 
        result.push(self.correction(i, normal))
      }
    });
    return result
  }
}
