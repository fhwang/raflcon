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

Bubblicious.Collision.Correction = {}

Bubblicious.Collision.Correction.prototype = {
  initialize: function(bubbleKey) {
    if (!bubbleKey.target && !bubbleKey.antiTarget) {
      throw "bubbleKey needs either a target or an antiTarget"
    }
    this.bubbleKey = bubbleKey;
  },

  isFieldMatch: function(bubble, field) {
    return (!bubble[field] && !this.bubbleKey[field]) || (
      bubble[field] && this.bubbleKey[field] && 
      bubble[field].x == this.bubbleKey[field].x &&
      bubble[field].y == this.bubbleKey[field].y
    )
  },

  isMatch: function(bubble) {
    return this.isFieldMatch(bubble, 'target') && 
      this.isFieldMatch(bubble, 'antiTarget');
  }
}

Bubblicious.Collision.LocationCorrection = function(bubbleKey, delta) {
  this.initialize(bubbleKey);
  this.delta = delta;
}

Bubblicious.Collision.LocationCorrection.prototype = _.extend({
  apply: function(bubble) {
    var location = bubble.location.add(this.delta);
    return bubble.modifiedCopy({location: location})
  },
}, Bubblicious.Collision.Correction.prototype);

Bubblicious.Collision.VelocityCorrection = function(bubbleKey, delta) {
  this.initialize(bubbleKey);
  this.delta = delta;
}

Bubblicious.Collision.VelocityCorrection.prototype = _.extend({
  apply: function(bubble) {
    velocity = bubble.velocity.add(this.delta);
    return bubble.modifiedCopy({velocity: velocity})
  },
}, Bubblicious.Collision.Correction.prototype);
