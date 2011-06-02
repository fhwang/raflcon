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
    
    $('#create_giveaway_attempt').live('submit', function(evt) {
        evt.preventDefault();

        response_data =
        {"giveaway_attempt":{"created_at":"2011-06-02T14:25:43Z","updated_at":"2011-06-02T14:25:43Z","id":7,"giveaway_id":1,"attendees":[{"name":"Meibell Maher","created_at":"2011-05-30T19:22:00Z","updated_at":"2011-06-02T14:25:43Z","giveaway_attempt_id":7,"id":20},{"name":"Ari James","created_at":"2011-05-30T19:22:00Z","updated_at":"2011-06-02T14:25:43Z","giveaway_attempt_id":7,"id":35},{"name":"Alex Michael","created_at":"2011-05-30T19:22:00Z","updated_at":"2011-06-02T14:25:43Z","giveaway_attempt_id":7,"id":68},{"name":"Brian Mueller","created_at":"2011-05-30T19:22:00Z","updated_at":"2011-06-02T14:25:43Z","giveaway_attempt_id":7,"id":50},{"name":"Lee Moreno","created_at":"2011-05-30T19:21:59Z","updated_at":"2011-06-02T14:25:43Z","giveaway_attempt_id":7,"id":6},{"name":"Nicholas Bergson-Shilcock","created_at":"2011-05-30T19:22:00Z","updated_at":"2011-06-02T14:25:43Z","giveaway_attempt_id":7,"id":81},{"name":"Mike Hodel","created_at":"2011-05-30T19:22:00Z","updated_at":"2011-06-02T14:25:43Z","giveaway_attempt_id":7,"id":41},{"name":"Wilson Ocampo-Gooding","created_at":"2011-05-30T19:22:00Z","updated_at":"2011-06-02T14:25:43Z","giveaway_attempt_id":7,"id":62},{"name":"Gary Katz","created_at":"2011-05-30T19:22:00Z","updated_at":"2011-06-02T14:25:43Z","giveaway_attempt_id":7,"id":34},{"name":"Kevin Kaffenberger","created_at":"2011-05-30T19:22:00Z","updated_at":"2011-06-02T14:25:43Z","giveaway_attempt_id":7,"id":61}]}};
        view = new GiveawayAttemptView(
          response_data.giveaway_attempt.attendees
        );
        view.draw();

        
        /*,
        url = $(this).attr('action');
        data = $(this).serialize();
        $.post(url, data, function(response_data) {
            view = new GiveawayAttemptView(
              response_data.giveaway_attempt.attendees
            );
            view.draw();
        });
        */
    });
});

GiveawayAttemptView = function(attendees) {
  this.attendees = attendees;
};

GiveawayAttemptView.prototype = {
  draw: function() {
    console.log('GiveawayAttemptView.draw 0');
    names = _.map(this.attendees, function(attendee) { return attendee.name });
    console.log(names);
    this.columns = [];
    max_length = _.max(names, function(n) { return n.length }).length;
    console.log(max_length);
    left_paddings = [];
    for (i = 0; i < names.length; i++) {
      name = names[i];
      left_padding = randomInt(max_length - name.length);
      left_paddings[i] = left_padding;
    }
    for (i = 0; i < max_length; i++) {
      letters = []
      for (j = 0; j < names.length; j++) {
        left_padding = left_paddings[j];
        if (left_padding > i) {
          letters.push('')
        } else {
          letter = names[j][i-left_padding];
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
  tileDrawGapBase: 1750,
  tileWidth: 50,
  
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
        this.tileDrawGapBase / (Math.pow(1.75, this.letters.length - nextRowNumber));
      setTimeout(_.bind(function() { this.draw() }, tile), timeout);
    }
    thresholdToFireOtherColumnDraws =
      Math.floor(this.letterTiles.length * 0.66);
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

  width: function() {
    return this.tileWidth;
  },
  
  x: function() {
    return this.columnNumber * this.tileWidth;
  }
};

GiveawayAttemptView.Column.LetterTile = function(column, rowNumber, letter) {
  this.column =     column;
  this.rowNumber =  rowNumber;
  this.letter =     letter;
};

GiveawayAttemptView.Column.LetterTile.prototype = {
  tileHeight: 50,

  draw: function() {
    var positionTop = this.rowNumber * this.tileHeight;
    style = "position: absolute; "
    style = style + "top: -" + (this.tileHeight * 1.5) + "px; ";
    style = style + "left: " + this.column.x() + "px; ";
    style = style + "width: " + this.column.width() + "px; ";
    style = style + "height: " + this.tileHeight + "px; ";
    style = style + "line-height: " + this.tileHeight + "px; ";
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
  }
};
