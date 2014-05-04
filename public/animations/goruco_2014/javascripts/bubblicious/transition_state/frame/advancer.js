Bubblicious.TransitionState.Frame.Advancer = function(
  bubbleState, interval, gravity, cheatThreshold
) {
  this.bubbleState = bubbleState
  this.interval = interval
  this.gravity = gravity
  this.cheatThreshold = cheatThreshold
}

Bubblicious.TransitionState.Frame.Advancer.prototype = {
  acceleration: function() {
    if (this.bubbleState.target) {
      return this.gravitationalAcceleration(
        this.bubbleState.location, this.bubbleState.target
      )
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

  gravitationalAcceleration: function(source, dest) {
    vector = source.vectorTo(dest);
    magnitude = this.gravity / Math.pow(vector.modulus(), 2) * this.interval
    return vector.x(magnitude);
  },

  location: function(velocity) {
    move = velocity.x(this.interval);
    return new Bubblicious.Location(
      this.bubbleState.location.x + move.elements()[0], 
      this.bubbleState.location.y + move.elements()[1]
    )
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
