Bubblicious.Bubble.State = function(bubble, location, opts) {
  var opts;
  this.bubble = bubble;
  this.location = location;
  if (!opts) opts = {}
  if (opts.velocity) {
    this.velocity = opts.velocity;
  } else {
    this.velocity = new Bubblicious.Velocity(0,0);
  }
  if (opts.size) {
    this.size = opts.size
  } else {
    this.size = 1
  }
  this.locked = opts.locked;
  this.target = opts.target;
  this.antiTarget = opts.antiTarget
  Object.freeze(this);
}

Bubblicious.Bubble.State.prototype = {
  acceleration: function(interval, gravity) {
    if (this.target) {
      return this.gravitationalAcceleration(
        this.location, this.target, interval, gravity
      )
    }
  },

  advanced: function(interval, gravity, cheatThreshold) {
    if (this.locked) {
      return this;
    } else {
      if (this.isCloseEnoughToTarget(cheatThreshold)) {
        return this.advancedLockedToTarget()
      } else {
        return this.advancedAndMoved(interval, gravity)
      }
    }
  },

  advancedAndMoved: function(interval, gravity) {
    var velocity = this.advancedVelocity(interval, gravity)
    var location = this.advancedLocation(velocity, interval);
    var enteringScreen = this.advancedEnteringScreen(location);
    return this.modifiedCopy(
      {
      location: location, 
      velocity: velocity, 
      enteringScreen: enteringScreen
    }
    );
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
        locked: true,
        target: null
      }
    )
  },

  advancedVelocity: function(interval, gravity) {
    velocity = this.velocity
    acceleration = this.acceleration(interval, gravity);
    if (acceleration) velocity = velocity.add(acceleration);
    return velocity
  },

  bubblePDiameter: function() {
    return Bubblicious.bubblePDiameter() * this.size
  },

  bubblePx: function() {
    return this.location.px();
  },

  bubblePy: function() {
    return this.location.py();
  },

  charPx: function() {
    return this.location.px() - (3 * this.size)
  },

  charPy: function() {
    return this.location.py() + (4 * this.size)
  },

  fontSize: function() {
    return 10 * this.size
  },

  gravitationalAcceleration: function(source, dest, interval, gravity) {
    vector = source.vectorTo(dest);
    magnitude = gravity / Math.pow(vector.modulus(), 2) * interval
    return vector.x(magnitude);
  },

  isCloseEnoughToTarget: function(cheatThreshold) {
    return (
      this.location && 
      this.target && 
      (this.location.vectorTo(this.target).modulus() <= cheatThreshold)
    ) 
  },

  isFullyOffscreen: function() {
    return !Bubblicious.boundingBox().partiallyContains(this);
  },

  isOnscreen: function() {
    return Bubblicious.boundingBox().partiallyContains(this);
  },

  mass: function() {
    if (this.locked) {
      return 1000000;
    } else {
      return 1
    }
  },

  modifiedCopy: function(newAttrs) {
    var location = newAttrs.location || this.location;
    opts = {
      velocity: this.velocity, locked: this.locked, target: this.target,
      antiTarget: this.antiTarget, size: this.size
    }
    opts = _(opts).extend(newAttrs);
    return new Bubblicious.Bubble.State(this.bubble, location, opts)
  },

  overlapDistance: function(otherBubble) {
    overlapDistance = 1 - this.vectorTo(otherBubble).modulus();
    overlapDistance = Math.max(overlapDistance, 0);
    return overlapDistance;
  },

  overlaps: function(otherBubble) {
    if (
      (Math.abs(this.location.x - otherBubble.location.x) <= 1) || 
      (Math.abs(this.location.y - otherBubble.location.y) <= 1)
    ) {
      return this.location.vectorTo(otherBubble.location).modulus() < 1;
    } else {
      return false
    }
  },

  randomAcceleration: function() {
    var scale = 100
    var dx = (Math.random() * scale * 2) - scale
    var dy = (Math.random() * scale * 2) - scale
    return $V([dx, dy])
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
