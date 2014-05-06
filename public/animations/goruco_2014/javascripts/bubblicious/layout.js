Bubblicious.Layout = function(lines) {
  this.bubbleStates = [];
  if (lines) {
    var self = this;
    maxTopPadding = Bubblicious.rect[1] - lines.length
    topPadding = Math.round(Math.random() * maxTopPadding)
    for (y = 0; y < Bubblicious.rect[1]; y++) {
      var line = lines[(Bubblicious.rect[1] - 1 - y)];
      if (line) {
        maxLeftPadding = Bubblicious.rect[0] - line.length
        leftPadding = Math.round(Math.random() * maxLeftPadding)
        for (x = 0; x < Bubblicious.rect[0]; x++) {
          var char = line.charAt(x).toUpperCase();
          if (char && char !== ' ') {
            self.addBubbleState(char, x + leftPadding, y - topPadding);
          }
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
