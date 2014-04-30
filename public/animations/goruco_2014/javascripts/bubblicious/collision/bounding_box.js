Bubblicious.Collision.BoundingBox = function(bubble) {
  this.bubble = bubble;
}

Bubblicious.Collision.BoundingBox.prototype = _.extend({
  bounceOnce: function() {
    var self = this;
    _([0,1]).each(function(axisNumber) {
      axis = Bubblicious.boundingBox().axis(axisNumber);
      if (!axis.fullyContains(self.newLocation)) {
        direction = axis.outOfBoundsDirection(self.newLocation)
        if (axis.number === 0) {
          coords = [direction * -2, 0]
        } else {
          coords = [0, direction * -2]
        }
        self.newLocation = self.newLocation.add(coords)
        normal = axis.normal(self.newVelocity);
        vector = normal.x(-2)
        self.newVelocity = self.newVelocity.add(vector);
        self.axisBounces += 1
      }
    });
  },

  bounceUntilPartiallyVisible: function() {
    var self = this,
        axis, bounds, point, newPoint;
    if (!Bubblicious.boundingBox().partiallyContains(this.newLocation)) { 
      _([0,1]).each(function(axisNumber) {
        axis = Bubblicious.boundingBox().axis(axisNumber);
        bounds = axis.bounds
        boundsRange = bounds[1] - bounds[0];
        points = self.newLocation.coords[axisNumber]
        if (point < bounds[0] || point > bounds[1]) {
          self.bounceWithinAxisBounds(point, bounds, axis, axisNumber);
        }
      })
    }
  },

  bounceWithinAxisBounds: function(point, bounds, axis, axisNumber) {
    if (point < bounds[0]) {
      distanceToCorrect = bounds[0] - point;
      mostRecentlyBouncedBoundIdx = 0;
    } else {
      distanceToCorrect = point - bounds[1];
      mostRecentlyBouncedBoundIdx = 1;
    }
    numRangeTraversals = Math.floor(distanceToCorrect / boundsRange);
    numBounces = Math.ceil(distanceToCorrect / boundsRange);
    if (numRangeTraversals >= 2) {
      traversalsToCompact = Math.floor(numRangeTraversals / 2) * 2
      distanceToCorrect -= (boundsRange * traversalsToCompact)
      numRangeTraversals -= traversalsToCompact;
      numBounces -= traversalsToCompact;
      this.axisBounces += traversalsToCompact;
    }
    if (numRangeTraversals === 1) {
      if (mostRecentlyBouncedBoundIdx === 0) {
        mostRecentlyBouncedBoundIdx = 1
      } else {
        mostRecentlyBouncedBoundIdx = 0;
      }
      distanceToCorrect -= boundsRange;
    }
    if (mostRecentlyBouncedBoundIdx === 0) {
      newPoint = bounds[0] + distanceToCorrect;
    } else {
      newPoint = bounds[1] - distanceToCorrect;
    }
    if (axisNumber === 0) {
      x = newPoint;
      y = this.newLocation.y;
    } else {
      x = this.newLocation.x;
      y = newPoint;
    }
    this.newLocation = {x: x, y: y}
    if (numBounces === 1) {
      normal = axis.normal(this.newVelocity);
      vector = normal.x(-2)
      this.newVelocity = this.newVelocity.add(vector);
    }
    this.axisBounces += numBounces;
  },

  buildNewVelocity: function() {
    var newVelocity = this.newVelocity.x(
      Math.pow(Bubblicious.Collision.elasticity, this.axisBounces)
    );
    if (Bubblicious.Collision.enableJitter) {
      newVelocity = this.newVelocity.add(
        this.summedJitterVelocities(this.axisBounces)
      );
    }
    return newVelocity;
  },

  corrections: function() {
    if (!this._corrections) {
      var self = this;
      this.newLocation = this.bubble.location;
      this.newVelocity = this.bubble.velocity;
      this.axisBounces = 0;
      this.bounceUntilPartiallyVisible()
      if (!Bubblicious.boundingBox().fullyContains(this.newLocation)) {
        this.bounceOnce()
      }
      this.newVelocity = this.buildNewVelocity();
      this._corrections = [
        new Bubblicious.Collision.Correction(
          this.bubble,
          this.bubble.location.vectorTo(this.newLocation),
          this.newVelocity.subtract(this.bubble.velocity)
        )
      ]
    }
    return this._corrections;
  }
}, Bubblicious.Collision.prototype);