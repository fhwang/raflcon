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
  Object.freeze(this);
};

Bubblicious.Bubble.prototype = {
  acceleration: function(bubble, interval, gravity) {
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

  advanced: function(bubble, interval, gravity) {
    if (this.locked) {
      return this;
    } else {
      var enteringScreen = this.enteringScreen;
      acceleration = this.acceleration(bubble, interval, gravity);
      velocity = this.velocity.add(acceleration);
      var location = this.advancedLocation(bubble, velocity, interval);
      if (enteringScreen && this.isFullyOnscreen(bubble)) {
        enteringScreen = false
      }
      return this.modifiedCopy(
        bubble, 
        {
          location: location, 
          velocity: velocity, 
          enteringScreen: enteringScreen
        }
      );
    }
  },

  advancedLocation: function(bubble, velocity, interval) {
    move = velocity.x(interval);
    return {
      x: this.location.x + move.elements[0], 
      y: this.location.y + move.elements[1]
    }
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
      velocity: this.velocity, locked: this.locked, target: this.target
    }
    opts = _(opts).extend(newAttrs);
    return new Bubblicious.Bubble(this.char, location, opts)
  },

  overlaps: function(otherBubble) {
    return this.location.vectorTo(otherBubble.location).modulus() < 1;
  },
}
