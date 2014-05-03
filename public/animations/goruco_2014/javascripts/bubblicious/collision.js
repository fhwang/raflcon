Bubblicious.Collision = {
  elasticity: 0.25,
  enableJitter: true
};

Bubblicious.Collision.prototype = {
  fastestBubbleState: function() {
    if (!this._fastestBubbleState) {
      if (this.bubbleStates[0].speed() > this.bubbleStates[1].speed()) {
        this._fastestBubbleState = this.bubbleStates[0];
      } else {
        this._fastestBubbleState = this.bubbleStates[1];
      }
    }
    return this._fastestBubbleState
  },

  jitterMagnitude: function() {
    var jitterMax = 0.1;
    return (Math.random() * jitterMax * 2) - jitterMax
  },
};

Bubblicious.Collision.Correction = {}

Bubblicious.Collision.Correction.prototype = {
}

Bubblicious.Collision.LocationCorrection = function(bubble, delta) {
  this.bubble = bubble;
  this.delta = delta;
}

Bubblicious.Collision.LocationCorrection.prototype = _.extend({
  apply: function(bubble) {
    var location = bubble.location.add(this.delta);
    return bubble.modifiedCopy({location: location})
  },
}, Bubblicious.Collision.Correction.prototype);

Bubblicious.Collision.VelocityCorrection = function(bubble, delta) {
  this.bubble = bubble;
  this.delta = delta;
}

Bubblicious.Collision.VelocityCorrection.prototype = _.extend({
  apply: function(bubble) {
    velocity = bubble.velocity.add(this.delta);
    return bubble.modifiedCopy({velocity: velocity})
  },
}, Bubblicious.Collision.Correction.prototype);

Bubblicious.Collision.VelocityJitter = function(bubble) {
  this.bubble = bubble;
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
