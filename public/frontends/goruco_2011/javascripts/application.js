function loadControlPanel() {
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
}

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
    loadControlPanel();
    var giveawayAttemptView = null;
    
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
    
    $('#create_giveaway_attempt .close').live('click', function(evt) {
        giveawayId = 
          $('#create_giveaway_attempt input[type=hidden]').attr('value');
        url = "/giveaways/update/" + giveawayId;
        $.post(url, function(data) {
            
        });
    });
    
    $('#create_giveaway_attempt').live('submit', function(evt) {
        evt.preventDefault();
        if (giveawayAttemptView) {
          giveawayAttemptView.undraw();
        }

        /*==================================================================*/
        // test mode
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
        giveawayAttemptView = new GiveawayAttemptView(attendees);
        giveawayAttemptView.draw();

        /*==================================================================* /
        // real mode
        url = $(this).attr('action');
        data = $(this).serialize();
        $.post(url, data, function(response_data) {
            view = new GiveawayAttemptView(
              response_data.giveaway_attempt.attendees
            );
            view.draw();
        });
        /*==================================================================*/
    });
});


