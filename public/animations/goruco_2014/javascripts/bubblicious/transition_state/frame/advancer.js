Bubblicious.TransitionState.Frame.Advancer = function(
  bubbleState, interval, targetGravity, antiTargetGravity, cheatThreshold
) {
  this.bubbleState = bubbleState
  this.interval = interval
  this.targetGravity = targetGravity;
  this.antiTargetGravity = antiTargetGravity
  this.cheatThreshold = cheatThreshold
}

Bubblicious.TransitionState.Frame.Advancer.prototype = {
  acceleration: function() {
    if (this.bubbleState.target) {
      return this.gravitationalAcceleration(
        this.bubbleState.location, this.bubbleState.target, this.targetGravity
      )
    } else if (this.bubbleState.antiTarget && this.antiTargetGravity) {
      if (this.bubbleState.antiTarget.eql(this.bubbleState.location)) {
        return this.randomAcceleration();
      } else {
        return this.gravitationalAcceleration(
          this.bubbleState.antiTarget, 
          this.bubbleState.location, 
          this.antiTargetGravity
        );
      }
    }
  },

  closeEnoughToTarget: function() {
    if (this.bubbleState.location && this.bubbleState.target) {
      vector = this.bubbleState.location.vectorTo(this.bubbleState.target)
      return vector.modulus() <= this.cheatThreshold
    }
  },

  enteringScreen: function(location) {
    return (
      this.bubbleState.enteringScreen && 
      !Bubblicious.boundingBox().fullyContains(location)
    );
  },

  gravitationalAcceleration: function(source, dest, gravity) {
    vector = source.vectorTo(dest);
    magnitude = gravity / Math.pow(vector.modulus(), 2) * this.interval
    return vector.x(magnitude);
  },

  location: function(velocity) {
    if (velocity.elements()[0] === 0 && velocity.elements()[1] === 0) {
      return this.bubbleState.location
    } else {
      move = velocity.x(this.interval);
      return new Bubblicious.Location(
        this.bubbleState.location.x + move.elements()[0], 
        this.bubbleState.location.y + move.elements()[1]
      )
    }
  },

  lockedToTarget: function() {
    return this.bubbleState.modifiedCopy(
      { 
        location: this.bubbleState.target, 
        velocity: new Bubblicious.Velocity(0,0), 
        enteringScreen: false, 
        locked: true,
        target: null
      }
    )
  },

  moved: function() {
    var velocity = this.velocity()
    var location = this.location(velocity);
    var enteringScreen = this.enteringScreen(location);
    return this.bubbleState.modifiedCopy(
      {
      location: location, 
      velocity: velocity, 
      enteringScreen: enteringScreen
    }
    );
  },

  randomAcceleration: function() {
    var scale = 100
    var dx = (Math.random() * scale * 2) - scale
    var dy = (Math.random() * scale * 2) - scale
    return $V([dx, dy])
  },

  result: function() {
    if (this.bubbleState.locked) {
      return this.bubbleState;
    } else {
      if (this.closeEnoughToTarget()) {
        return this.lockedToTarget()
      } else {
        return this.moved()
      }
    }
  },

  velocity: function() {
    velocity = this.bubbleState.velocity
    acceleration = this.acceleration();
    if (acceleration) velocity = velocity.add(acceleration);
    return velocity;
  },
}
