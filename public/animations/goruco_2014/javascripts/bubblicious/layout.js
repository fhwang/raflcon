Bubblicious.Layout = function(lines) {
  this.bubbles = [];
  if (lines) {
    var self = this;
    for (y = 0; y < Bubblicious.rect[1]; y++) {
      var line = lines[(Bubblicious.rect[1] - 1 - y)];
      for (x = 0; x < Bubblicious.rect[0]; x++) {
        var char = line.charAt(x);
        if (char !== ' ') {
          self.addBubble(char, x, y);
        }
      }
    }
  }
}

Bubblicious.Layout.prototype = {
  addBubble: function(char, x, y) {
    this.bubbles.push(
      new Bubblicious.Bubble(
        char,
        new Bubblicious.Location(
          x * (1 + Bubblicious.spacing), 
          y * (1 + Bubblicious.spacing)
        )
      )
    );
  },
};
