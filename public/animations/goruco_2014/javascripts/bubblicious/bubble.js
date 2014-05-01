Bubblicious.Bubble = function(char, location, opts) {
  var opts;
  this.char = char;
  this.location = location;
  if (!opts) opts = {}
  if (opts.velocity) {
    this.velocity = opts.velocity;
  } else {
    this.velocity = new Bubblicious.Velocity(0,0);
  }
  this.locked = opts.locked;
  this.target = opts.target;
  this.antiTarget = opts.antiTarget
  Object.freeze(this);
};

Bubblicious.Bubble.isCloseEnoughToTarget = function(location, target, cheatThreshold) {
  return (
    location && 
    target && 
    (location.vectorTo(target).modulus() <= cheatThreshold)
  ) 
};

Bubblicious.Bubble.prototype = {
  acceleration: function(interval, gravity) {
    if (this.target) {
      return this.gravitationalAcceleration(
        this.location, this.target, interval, gravity
      )
    } else if (this.antiTarget) {
      return this.gravitationalAcceleration(
        this.antiTarget, this.location, interval, gravity
      );
    }
  },

  advanced: function(interval, gravity, cheatThreshold) {
    if (this.locked) {
      return this;
    } else {
      var velocity = this.advancedVelocity(interval, gravity)
      var location = this.advancedLocation(velocity, interval);
      if (Bubblicious.Bubble.isCloseEnoughToTarget(location, this.target, cheatThreshold)) {
        return this.advancedLockedToTarget()
      } else {
        var enteringScreen = this.advancedEnteringScreen(location);
        return this.modifiedCopy(
          {
            location: location, 
            velocity: velocity, 
            enteringScreen: enteringScreen
          }
        );
      }
    }
  },

  advancedEnteringScreen: function(location) {
    return (
      this.enteringScreen && !Bubblicious.boundingBox().fullyContains(location)
    );
  },

  advancedLocation: function(velocity, interval) {
    move = velocity.x(interval);
    return new Bubblicious.Location(
      this.location.x + move.elements()[0], 
      this.location.y + move.elements()[1]
    )
  },

  advancedLockedToTarget: function() {
    return this.modifiedCopy(
      { 
        location: this.target, 
        velocity: new Bubblicious.Velocity(0,0), 
        enteringScreen: false, 
        locked: true
      }
    )
  },

  advancedVelocity: function(interval, gravity) {
    velocity = this.velocity
    acceleration = this.acceleration(interval, gravity);
    if (acceleration) velocity = velocity.add(acceleration);
    return velocity
  },

  gravitationalAcceleration: function(source, dest, interval, gravity) {
    vector = source.vectorTo(dest);
    magnitude = gravity / Math.pow(vector.modulus(), 2) * interval
    return vector.x(magnitude);
  },

  isOnscreen: function() {
    return Bubblicious.boundingBox().partiallyContains(this);
  },

  modifiedCopy: function(newAttrs) {
    var location = newAttrs.location || this.location;
    opts = {
      velocity: this.velocity, locked: this.locked, target: this.target,
      antiTarget: this.antiTarget
    }
    opts = _(opts).extend(newAttrs);
    return new Bubblicious.Bubble(this.char, location, opts)
  },

  overlapDistance: function(otherBubble) {
    overlapDistance = 1 - this.vectorTo(otherBubble).modulus();
    overlapDistance = Math.max(overlapDistance, 0);
    return overlapDistance;
  },

  overlaps: function(otherBubble) {
    return this.location.vectorTo(otherBubble.location).modulus() < 1;
  },

  speed: function() {
    return this.velocity.modulus();
  },

  vectorTo: function(arg) {
    var otherLocation;
    if (arg.location) {
      otherLocation = arg.location;
    } else {
      otherLocation = arg;
    }
    return this.location.vectorTo(otherLocation);
  },
}
