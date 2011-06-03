// Only works for UTC, which is fine because that's what we're returning by
// default
function parseW3cdtf(time_str) {
  var matches = 
    /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z/(time_str);
  return new Date(
    Date.UTC(
      matches[1], matches[2]-1, matches[3], matches[4], matches[5], matches[6]
    )
  );
}

// Returns a random integer from 0 to i-1.
function randomInt(i) {
  return Math.floor(Math.random() * i);
}

$(document).ready(function() {
    $.get("/giveaway_rounds", function(data) {
        rounds_with_active_giveaways = _.select(
          _.map(data, function(h) { return h.giveaway_round }),
          function(h) { return (h.active_giveaways > 0) }
        );
        _.each(
          rounds_with_active_giveaways,
          function(round) {
            var gr_time = parseW3cdtf(round.time);
            round.time_str = gr_time.strftime("%a %b %d %I:%M %p");
          }
        );
        $('#giveaway_round_option').tmpl(rounds_with_active_giveaways).
          appendTo('#giveaway_rounds');
        $('#giveaway_rounds').change();
    });
    
    $('#giveaway_rounds').live('change', function(evt) {
        $("#giveaway_rounds option:selected").each(function () {
            giveaway_round_id = $(this).attr('value');
            url = "/giveaway_rounds/show/" + giveaway_round_id + ".json";
            $.get(url, function(data) {
                $('#giveaways').html('');
                giveaways = _.select(
                  data.giveaway_round.giveaways,
                  function(giveaway) { return giveaway.active; }
                );
                $('#giveaway_option').tmpl(giveaways).appendTo('#giveaways');
                $('#giveaways').change();
            });
        });
    });
    
    $('#giveaways').live('change', function(evt) {
        $("#giveaways option:selected").each(function () {
            giveaway_id = $(this).attr('value');
            url = "/giveaways/show/" + giveaway_id + ".json";
            $.get(url, function(data) {
                $('#create_giveaway_attempt').html('');
                $('#giveaway_attempt_form_fields').tmpl(data.giveaway).
                  appendTo('#create_giveaway_attempt');
            });
        });
    });        
    
    // test mode
    $('#create_giveaway_attempt').live('submit', function(evt) {
        evt.preventDefault();

        attendees = []
        rawNames = [
          "Ari Kudria",
          "Sebastian Liu",
          "Aman Nakajima",
          "Kevin Olson",
          "Allen Menard",
          "Peter Liu",
          "Michael Maher",
          "Lee Nussbaum",
          "Brad Ngo",
          "Tim Jaros",
          "Clifford Moreno",
          "Chris Maximov",
          "Allen Khattri",
          "Tom Maher",
          "Sebastian Mill",
          "Dan Maximov",
          "Sean McNamara",
          "Courtenay Moreno",
          "Clifford Ocampo-Gooding",
          "Dave Mango",
          "Allen Hodel",
          "Chad Lade",
          "Matthew Kudria",
          "Clifford Muldoon",
          "Clifford Mango",
          "Alex Menard",
          "Dan Ocampo-Gooding",
          "Brad Menard",
          "Elliott Maher",
          "Nicholas Bergson-Shilcock"
        ]
        size = randomInt(10) + 1;
        while (attendees.length < size) {
          name = rawNames[randomInt(rawNames.length)];
          attendees.push({'name':name});
        }
        view = new GiveawayAttemptView(attendees);
        view.draw();
    });

    // real mode
    /*
    $('#create_giveaway_attempt').live('submit', function(evt) {
        evt.preventDefault();
        url = $(this).attr('action');
        data = $(this).serialize();
        $.post(url, data, function(response_data) {
            view = new GiveawayAttemptView(
              response_data.giveaway_attempt.attendees
            );
            view.draw();
        });
    });
    */
});

GiveawayAttemptView = function(attendees) {
  this.attendees = attendees;
};

GiveawayAttemptView.prototype = {
  baseTileHeight: function() {
    return Math.round(675 / this.attendees.length);
  },
  
  baseTileWidth: function() {
    return Math.round(1100 / this.maxNameLength());
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
  
  x: function() {
    return this.columnNumber * this.view.tileWidth();
  }
};

GiveawayAttemptView.Column.LetterTile = function(column, rowNumber, letter) {
  this.column =     column;
  this.rowNumber =  rowNumber;
  this.letter =     letter;
};

GiveawayAttemptView.Column.LetterTile.prototype = {
  draw: function() {
    var positionTop = this.rowNumber * this.tileHeight();
    style = "position: absolute; "
    style = style + "top: -" + (this.tileHeight() * 1.5) + "px; ";
    style = style + "left: " + this.column.x() + "px; ";
    style = style + "width: " + this.column.tileWidth() + "px; ";
    style = style + "height: " + this.tileHeight() + "px; ";
    style = style + "line-height: " + this.tileHeight() + "px; ";
    divId = "tile_" + this.column.columnNumber + "_" + this.rowNumber;
    html =
      "<div style='" + style + "' class='letter_tile' id='" + divId + "'>" +
      this.letter + "</div>"
    $('#giveaway_attempt_view').append(html);
    $("#" + divId).animate(
      {top: positionTop + "px"},
      75,
      'linear',
      _.bind(function() { this.column.notifyTileDrawn(this.rowNumber) }, this)
    );
  },
  
  tileHeight: function() {
    return this.column.tileHeight();
  }
};
