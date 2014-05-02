Bubblicious.Layout = function(lines) {
  this.bubbleStates = [];
  if (lines) {
    var self = this;
    for (y = 0; y < Bubblicious.rect[1]; y++) {
      var line = lines[(Bubblicious.rect[1] - 1 - y)];
      for (x = 0; x < Bubblicious.rect[0]; x++) {
        var char = line.charAt(x);
        if (char !== ' ') {
          self.addBubbleState(char, x, y);
        }
      }
    }
  }
}

Bubblicious.Layout.prototype = {
  addBubbleState: function(char, x, y) {
    bubble = new Bubblicious.Bubble(char)
    this.bubbleStates.push(
      bubble.state(
        new Bubblicious.Location(
          x * (1 + Bubblicious.spacing), 
          y * (1 + Bubblicious.spacing)
        )
      )
    );
  },
};
