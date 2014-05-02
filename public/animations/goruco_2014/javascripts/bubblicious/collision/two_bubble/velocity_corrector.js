Bubblicious.Collision.TwoBubble.VelocityCorrector = function(collision) {
  this.collision = collision;
}

Bubblicious.Collision.TwoBubble.VelocityCorrector.prototype = {
  collisionUnitNormal: function() {
    var normal = this.collision.bubbles[0].vectorTo(this.collision.bubbles[1]);
    return normal.toUnitVector();
  },
  
  collisionUnitTangent: function() {
    return $V([
      -this.collisionUnitNormal().elements[1],
      this.collisionUnitNormal().elements[0]
    ]);
  },

  decomposedCollisionSpeed: function(i) {
    return {
      normal: this.collisionUnitNormal().dot(
        this.collision.bubbles[i].velocity.elements()
      ),
      tangent: this.collisionUnitTangent().dot(
        this.collision.bubbles[i].velocity.elements()
      )
    }
  },

  newNormalSpeed: function(i) {
    if (i === 0) {
      otherIndex = 1;
    } else {
      otherIndex = 0;
    }
    bubble = this.collision.bubbles[i]
    otherBubble = this.collision.bubbles[otherIndex]
    speed = this.decomposedCollisionSpeed(i);
    otherSpeed = this.decomposedCollisionSpeed(otherIndex);
    return (
      (speed.normal * (bubble.mass() - otherBubble.mass())) +
      (2 * otherBubble.mass() * otherSpeed.normal)
    ) / (bubble.mass() + otherBubble.mass())
  },

  jitterMagnitude: function() {
    var jitterMax = 0.1;
    return (Math.random() * jitterMax * 2) - jitterMax
  },

  jitterVelocity: function() {
    return new Bubblicious.Velocity(
      this.jitterMagnitude(), this.jitterMagnitude()
    );
  },

  jitterCorrections: function() {
    var self = this,
        result = [];
    _([0,1]).each(function(i) { 
      if (!self.collision.bubbles[i].locked) {
        result.push(
          new Bubblicious.Collision.VelocityCorrection(
            self.collision.bubbles[i], self.jitterVelocity()
          )
        )
      }
    }); 
    return result;
  },

  newVelocity: function(i) {
    return new Bubblicious.Velocity(
      this.velocityPrime(i).normal
        .add(this.velocityPrime(i).tangent)
        .x(Bubblicious.Collision.elasticity)
    )
  },

  run: function() {
    var result = [],
        self = this;
    _([0,1]).each(function(i) {
      var bubble = self.collision.bubbles[i]
      if (!bubble.locked) {
        var velocityDiff = self.newVelocity(i).subtract(bubble.velocity)
        result.push(
          new Bubblicious.Collision.VelocityCorrection(bubble, velocityDiff)
        );
      }
    });
    if (Bubblicious.Collision.enableJitter) {
      result = result.concat(this.jitterCorrections());
    }
    return result;
  },

  speedPrime: function(i) {
    return {
      tangent: this.decomposedCollisionSpeed(i).tangent,
      normal: this.newNormalSpeed(i)
    }
  },

  velocityPrime: function(i) {
    return {
      normal: this.collisionUnitNormal().x(this.speedPrime(i).normal),
      tangent: this.collisionUnitTangent().x(this.speedPrime(i).tangent)
    }
  }
}
