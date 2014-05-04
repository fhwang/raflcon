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
