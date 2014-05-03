Bubblicious.Bubble = function(char) {
  this.char = char;
  Object.freeze(this);
}

Bubblicious.Bubble.prototype = {
  state: function(location, opts) {
    return new Bubblicious.Bubble.State(this, location, opts);
  }
}
