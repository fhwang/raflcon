GiveawayAttemptView = function(attendees) {
  this.attendees = attendees;
};

GiveawayAttemptView.prototype = {
  height: 683,
  width: 1100,
  
  baseTileHeight: function() {
    return Math.round(this.height / this.attendees.length);
  },
  
  baseTileWidth: function() {
    return Math.round(this.width / this.maxNameLength());
  },
  
  draw: function() {
    this.columns = [];
    left_paddings = [];
    for (i = 0; i < this.names().length; i++) {
      name = this.names()[i];
      left_padding = randomInt(this.maxNameLength() - name.length);
      left_paddings[i] = left_padding;
    }
    for (i = 0; i < this.maxNameLength(); i++) {
      letters = []
      for (j = 0; j < this.names().length; j++) {
        left_padding = left_paddings[j];
        if (left_padding > i) {
          letters.push('')
        } else {
          letter = this.names()[j][i-left_padding];
          if (!letter) { letter = '' }
          letters.push(letter);
        }
      }
      this.columns.push(new GiveawayAttemptView.Column(this, i, letters));
    }
    this.drawColumn();
  },
  
  drawColumn: function() {
    notCurrentlyDrawing = _.reject(
      this.columns, function(c) { return c.isDrawing() }
    );
    if (column = notCurrentlyDrawing[randomInt(notCurrentlyDrawing.length)]) {
      column.draw();
    }
  },
  
  maxNameLength: function() {
    return _.max(this.names(), function(n) { return n.length }).length;
  },
  
  names: function() {
    return _.map(this.attendees, function(attendee) { return attendee.name });
  },
  
  tileHeight: function() {
    if (this.baseTileHeight() / this.baseTileWidth() > 1.5) {
      return this.baseTileWidth() * 1.5;
    } else {
      return this.baseTileHeight();
    }
  },
  
  tileWidth: function() {
    if (this.baseTileWidth() / this.baseTileHeight() > 1.5) {
      return this.baseTileHeight() * 1.5;
    } else {
      return this.baseTileWidth();
    }
  },
  
  undraw: function() {
    _.each(this.columns, function(c) { c.undraw() })
  },
  
  vPadding: function() {
    return (this.height - (this.tileHeight() * this.attendees.length)) / 2;
  }
};

GiveawayAttemptView.Column = function(view, columnNumber, letters) {
  this.view =         view;
  this.columnNumber = columnNumber;
  this.letters =      letters;
  this.drawing = false;
  this.initialize();
};

GiveawayAttemptView.Column.prototype = {
  tileDrawGapBase: 600,
  
  initialize: function() {
    this.letterTiles = [];
    for (rowNumber = 0; rowNumber < this.letters.length; rowNumber++) {
      letter = this.letters[rowNumber];
      letterTile = new GiveawayAttemptView.Column.LetterTile(
        this, rowNumber, letter
      );
      this.letterTiles.push(letterTile);
    }
  },
  
  draw: function() {
    this.drawing = true;
    this.letterTiles[this.letterTiles.length-1].draw();
  },
  
  isDrawing: function() {
    return this.drawing;
  },
  
  notifyTileDrawn: function(rowNumber) {
    nextRowNumber = rowNumber - 1;
    if (tile = this.letterTiles[nextRowNumber]) {
      var timeout =
        this.tileDrawGapBase / (Math.pow(1.5, this.letters.length - nextRowNumber));
      setTimeout(_.bind(function() { this.draw() }, tile), timeout);
    }
    thresholdToFireOtherColumnDraws =
      Math.floor(this.letterTiles.length * 0.90);
    if (rowNumber == thresholdToFireOtherColumnDraws) {
      _(3).times(_.bind(
        function() {
          interval = randomInt(750);
          setTimeout(
            _.bind(function() { this.drawColumn() }, this.view), interval
          )
        },
        this
      ));
    }
  },
  
  tileHeight: function() {
    return this.view.tileHeight();
  },
  
  tileWidth: function() {
    return this.view.tileWidth();
  },
  
  undraw: function() {
    _.each(this.letterTiles, function(t) { t.undraw() });
  },
  
  x: function() {
    return this.columnNumber * this.view.tileWidth();
  },
  
  vPadding: function() {
    return this.view.vPadding();
  }
};

GiveawayAttemptView.Column.LetterTile = function(column, rowNumber, letter) {
  this.column =     column;
  this.rowNumber =  rowNumber;
  this.letter =     letter;
};

GiveawayAttemptView.Column.LetterTile.prototype = {
  divId: function() {
    return "tile_" + this.column.columnNumber + "_" + this.rowNumber;
  },
  
  draw: function() {
    var positionTop =
      this.rowNumber * this.tileHeight() + this.column.vPadding();
    style = "position: absolute; "
    style = style + "top: -" + (this.tileHeight() * 1.5) + "px; ";
    style = style + "left: " + this.column.x() + "px; ";
    style = style + "width: " + this.column.tileWidth() + "px; ";
    style = style + "height: " + this.tileHeight() + "px; ";
    style = style + "line-height: " + this.tileHeight() + "px; ";
    if (this.letter.trim() == "") {
//      style = style + "border: 1px solid #444; ";
    } else {
      style =
        style + "background-image: url(/frontends/goruco_2012/images/torch.jpg); ";
      style =
        style + "background-position: -" + this.column.x() + "px -" +
        positionTop + "px; ";
      style = style + "border: 1px solid #111; ";
    }
    console.log(style);
    html =
      "<div style='" + style + "' class='letter_tile' id='" + this.divId() +
      "'>" + this.letter + "</div>"
    $('#giveaway_attempt_view').append(html);
    $("#" + this.divId()).animate(
      {top: positionTop + "px"},
      75,
      'linear',
      _.bind(function() { this.column.notifyTileDrawn(this.rowNumber) }, this)
    );
  },
  
  tileHeight: function() {
    return this.column.tileHeight();
  },
  
  undraw: function() {
    $("#" + this.divId()).remove();
  }
};
