Bubblicious.Collision.TwoBubble.VelocityCorrector = function(collision) {
  this.collision = collision;
}

Bubblicious.Collision.TwoBubble.VelocityCorrector.prototype = {
  collisionUnitNormal: function() {
    var normal = this.collision.bubbleStates[0].vectorTo(this.collision.bubbleStates[1]);
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
        this.collision.bubbleStates[i].velocity.elements()
      ),
      tangent: this.collisionUnitTangent().dot(
        this.collision.bubbleStates[i].velocity.elements()
      )
    }
  },

  newNormalSpeed: function(i) {
    if (i === 0) {
      otherIndex = 1;
    } else {
      otherIndex = 0;
    }
    bubbleState = this.collision.bubbleStates[i]
    otherBubbleState = this.collision.bubbleStates[otherIndex]
    speed = this.decomposedCollisionSpeed(i);
    otherSpeed = this.decomposedCollisionSpeed(otherIndex);
    return (
      (speed.normal * (bubbleState.mass() - otherBubbleState.mass())) +
      (2 * otherBubbleState.mass() * otherSpeed.normal)
    ) / (bubbleState.mass() + otherBubbleState.mass())
  },

  jitterCorrections: function() {
    var self = this,
        result = [];
    _([0,1]).each(function(i) { 
      if (!self.collision.bubbleStates[i].locked) {
        result.push(
          new Bubblicious.Collision.VelocityJitter(
            self.collision.bubbleStates[i].bubble
          )
        )
      }
    }); 
    return result;
  },

  newCorrection: function(i) {
    var bubbleState = this.collision.bubbleStates[i]
    if (!bubbleState.locked) {
      var velocityDiff = this.newVelocity(i).subtract(bubbleState.velocity)
      return new Bubblicious.Collision.VelocityCorrection(
        bubbleState.bubble, velocityDiff
      )
    }
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
      if (correction = self.newCorrection(i)) result.push(correction);
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
