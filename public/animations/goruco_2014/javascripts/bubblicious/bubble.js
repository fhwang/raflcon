Bubblicious.Bubble = function(char, x, y, velocity) {
  this.char = char;
  if (typeof y === 'undefined') {
    this.location = x;
  } else {
    this.location = new Bubblicious.Location(x, y)
  }
  if (velocity) {
    this.velocity = velocity;
  } else {
    this.velocity = new Bubblicious.Velocity(0,0);
  }
};

Bubblicious.Bubble.prototype = {
  overlaps: function(otherBubble) {
    return this.location.vectorTo(otherBubble.location).modulus() < 1;
  },
}
