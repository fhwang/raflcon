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
};

Bubblicious.Bubble.prototype = {
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
