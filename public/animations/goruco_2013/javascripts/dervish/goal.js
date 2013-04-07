Dervish.Goal = function(lines) {
  this.initialize(lines);
};

Dervish.Goal.prototype = {
  initialize: function(lines) {
    this.letterGrid = [], this.connections = [];
    var self = this;
    if (lines) {
      this.buildLetterGrid(lines)
      _(this.letterGrid).each(function(letterGridLine, y) {
        _(letterGridLine).each(function(letter, x) {
          if (x < Dervish.rect[0] - 1) {
            self.connections.push(
              new Dervish.Connection(letter, letterGridLine[x+1])
            )
          }
          if (y < lines.length - 1) {
            self.connections.push(
              new Dervish.Connection(letter, self.letterGrid[y+1][x])
            )
          }
        });
      });
    }
  },

  buildLetterGrid: function(lines) {
    var self = this;
    for (y = 0; y < lines.length; y++) {
      var line = lines[(lines.length - 1 - y)];
      while (line.length < Dervish.rect[0]) {
        if (Math.random() < 0.5) {
          line = " " + line
        } else {
          line = line + ' '
        }
      }
      var letterGridLine = [];
      this.letterGrid.push(letterGridLine);
      for (x = 0; x < Dervish.rect[0]; x++) {
        var char = line.charAt(x);
        var letter = new Dervish.Letter(char, x, y)
        letterGridLine.push(letter);
      }
    }
  },

  letters: function() {
    return _(this.letterGrid).flatten();
  }

};
