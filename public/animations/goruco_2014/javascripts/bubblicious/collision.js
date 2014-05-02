Bubblicious.Collision = {
  elasticity: 0.9,
  enableJitter: true
};

Bubblicious.Collision.prototype = {
  fastestBubble: function() {
    if (!this._fastestBubble) {
      if (this.bubbles[0].speed() > this.bubbles[1].speed()) {
        this._fastestBubble = this.bubbles[0];
      } else {
        this._fastestBubble = this.bubbles[1];
      }
    }
    return this._fastestBubble
  },

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
  setBubbleKey: function(bubbleKey) {
    if (!bubbleKey.target && !bubbleKey.antiTarget) {
      debugger
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
  this.setBubbleKey(bubbleKey);
  this.delta = delta;
}

Bubblicious.Collision.LocationCorrection.prototype = _.extend({
  apply: function(bubble) {
    var location = bubble.location.add(this.delta);
    return bubble.modifiedCopy({location: location})
  },
}, Bubblicious.Collision.Correction.prototype);

Bubblicious.Collision.VelocityCorrection = function(bubbleKey, delta) {
  this.setBubbleKey(bubbleKey);
  this.delta = delta;
}

Bubblicious.Collision.VelocityCorrection.prototype = _.extend({
  apply: function(bubble) {
    velocity = bubble.velocity.add(this.delta);
    return bubble.modifiedCopy({velocity: velocity})
  },
}, Bubblicious.Collision.Correction.prototype);

Bubblicious.Collision.VelocityJitter = function(bubbleKey) {
  this.setBubbleKey(bubbleKey);
  this.delta = this.jitterVelocity()
}

Bubblicious.Collision.VelocityJitter.prototype = _.extend({
  jitterMagnitude: function() {
    var jitterMax = 0.1;
    return (Math.random() * jitterMax * 2) - jitterMax
  },

  jitterVelocity: function() {
    return new Bubblicious.Velocity(
      this.jitterMagnitude(), this.jitterMagnitude()
    );
  },
}, Bubblicious.Collision.VelocityCorrection.prototype)
