Bubblicious.Collision = {
  elasticity: 0.9,
  enableJitter: true
};

Bubblicious.Collision.prototype = {
  jitterMagnitude: function() {
    var jitterMax = 0.1;
    return (Math.random() * jitterMax * 2) - jitterMax
  },

  summedJitterVelocities: function(num) {
    var self = this,
        dx = 0,
        dy = 0;
    _(num).times(function() {
      dx += self.jitterMagnitude();
      dy += self.jitterMagnitude();
    });
    return new Bubblicious.Velocity(dx, dy);
  }
};

Bubblicious.Collision.Correction = function(bubbleKey, locationDelta, velocityDelta) {
  // bubbleKey is only used so clients can match corrections to a specific key
  // in isMatch below
  this.bubbleKey = bubbleKey
  this.locationDelta = locationDelta;
  this.velocityDelta = velocityDelta;
}

Bubblicious.Collision.Correction.prototype = {
  apply: function(bubble) {
    var location = bubble.location.add(this.locationDelta);
    velocity = bubble.velocity.add(this.velocityDelta);
    return bubble.modifiedCopy(
      { location: location, velocity: velocity }
    )
  },

  isFieldMatch: function(bubble, field) {
    return (!bubble[field] && !this.bubbleKey[field]) || (
      bubble[field].x == this.bubbleKey[field].x &&
      bubble[field].y == this.bubbleKey[field].y
    )
  },

  isMatch: function(bubble) {
    return this.isFieldMatch(bubble, 'target') && 
      this.isFieldMatch(bubble, 'antiTarget');
  }
}

