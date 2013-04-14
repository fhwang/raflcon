Raflcon = function() {
  this.initialize();
};

Raflcon.prototype = {
  initialize: function() {
    _(this).bindAll(
      'giveawayRoundsChanged', 'giveawaysChanged', 'giveawayClosed',
      'giveawayAttemptCreate', 'loadControlPanel', 'tryDrawingIframe'
    )
    $('#giveaway_rounds').on('change', this.giveawayRoundsChanged)
    $('#giveaways').on('change', this.giveawaysChanged)
    $('#create_giveaway_attempt').on('click', '.close', this.giveawayClosed)
    $('#create_giveaway_attempt').on('submit', this.giveawayAttemptCreate)
    this.tryDrawingIframe();
    this.loadControlPanel();
  },

  animate: function(winners) {
    $('#animation')[0].contentWindow.animate(winners);
  },
  
  giveawayAttemptCreate: function(e) {
    var self = this;
    e.preventDefault();
    url = $(e.target).attr('action');
    data = $(e.target).serialize();
    $.post(url, data, function(response_data) {
      var winnerNames = _(response_data.attendees).map(function(attendee) {
        return attendee.name
      });
      self.animate(winnerNames)
    });
  },

  giveawaysChanged: function() {
    var self = this;
    $("#giveaways option:selected").each(function () {
      giveaway_id = $(this).attr('value');
      url = "/giveaways/show/" + giveaway_id + ".json";
      $.get(url, function(data) {
        $('#create_giveaway_attempt').html('');
        $('#create_giveaway_attempt').html(
          self.templateResult('#giveaway_attempt_form_fields', data)
        )
      });
    });
  },

  giveawayClosed: function() {
    giveawayId = 
      $('#create_giveaway_attempt input[type=hidden]').attr('value');
    url = "/giveaways/update/" + giveawayId;
    $.post(url, {"giveaway[active]":0}, this.loadControlPanel);
  },

  giveawayRoundsChanged: function() {
    var self = this;
    $("#giveaway_rounds option:selected").each(function () {
      giveaway_round_id = $(this).attr('value');
      url = "/giveaway_rounds/show/" + giveaway_round_id + ".json";
      $.get(url, function(data) {
        giveaways = _.select(
          data.giveaways,
          function(giveaway) { return giveaway.active; }
        );
        $('#giveaways').html(self.templateResult('#giveaway_option', giveaways))
        $('#giveaways').change();
      });
    });
  },

  loadControlPanel: function() {
    var self = this;
    $.get("/giveaway_rounds", function(data) {
      rounds_with_active_giveaways = _.select(
        data, function(h) { return (h.active_giveaways > 0) }
      );
      _.each(
        rounds_with_active_giveaways,
        function(round) {
          var gr_time = self.parseW3cdtf(round.time);
          round.time_str = gr_time.strftime("%a %b %d %I:%M %p");
        }
      );
      $('#giveaway_rounds').html(
        self.templateResult(
          '#giveaway_round_option', rounds_with_active_giveaways
        )
      )
      $('#giveaway_rounds').change();
    });
  },

  // Only works for UTC, which is fine because that's what we're returning by
  // default
  parseW3cdtf: function(time_str) {
    var matches = 
      /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z/.exec(time_str);
    return new Date(
      Date.UTC(
        matches[1], matches[2]-1, matches[3], matches[4], matches[5], 
        matches[6]
      )
    );
  },

  templateResult: function(templateContainer, context) {
    var self = this;
    if ($.isArray(context)) {
      return _(context).map(function(element) {
        return self.templateResult(templateContainer, element);
      }).join();
    } else {
      return _($(templateContainer).html()).template(context)
    }
  },

  tryDrawingIframe: function() {
    var width = $(window).width() - $('#control_panel').outerWidth();
    var height = $(window).height();
    if (width > 0 && height > 0) {
      var html = this.templateResult(
        '#iframe_tmpl', {width: width, height: height}
      );
      $('body').append(html);
    } else {
      _(this.tryDrawingIframe).delay(10);
    }
  }
}

$(function() {
  var raflcon = new Raflcon();
});
