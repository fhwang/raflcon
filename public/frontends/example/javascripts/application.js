function choose_giveaway_round() {
  var giveaway_round_id = $('giveaway_round_select').value;
  if (giveaway_round_id) {
    var url = '/giveaway_rounds/show/' + giveaway_round_id + '.json';
    new EJS(
      {url: "/frontends/example/ejs/giveaway_round.ejs"}
    ).update('giveaway_round', url);
  }
};

function choose_giveaway(giveaway_id) {
  var url = '/giveaways/show/' + giveaway_id + '.json';
  $$('.giveaway').each(function(elt) {
    elt.hide();
  });
  new EJS(
    {url: "/frontends/example/ejs/giveaway.ejs"}
  ).update('giveaway_' + giveaway_id, url);
  $('giveaway_' + giveaway_id).show();
};

function close_giveaway(giveaway_id) {
  new Ajax.Request(
    '/giveaways/update/' + giveaway_id,
    {
      asynchronous:true,
      evalScripts:true,
      parameters:{"giveaway[active]":0},
      onSuccess: function(transport) {
        var giveaway = transport.responseText.evalJSON().giveaway;
        var giveaway_round = giveaway.giveaway_round;
        if (giveaway_round.active_giveaways == 0) {
          $("giveaway_round_option_" + giveaway_round.id).hide();
          $('giveaway_round_select').options[0].selected = true;
        }
      }
    }
  );
  $('giveaway_' + giveaway_id).hide();
};

function init_control_panel() {
  new EJS(
    {url: "/frontends/example/ejs/control_panel.ejs"}
  ).update(
    'control_panel', "/giveaway_rounds"
  );
}

function new_giveaway_attempt(giveaway_attempt) {
  $('giveaway_form').hide();
  winners = "<ul>";
  for (i = 0; i < giveaway_attempt.attendees.length; i++) {
    attendee = giveaway_attempt.attendees[i];
    winners = winners +  "<li>"+ attendee.name + "</li>";
  }
  winners = winners + "</ul>";
  $('newest_giveaway_attempt').innerHTML = winners;
}

// Only works for UTC, which is fine because that's what we're returning by
// default
function parse_w3cdtf(time_str) {
  var matches = 
    /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z/(time_str);
  return new Date(
    Date.UTC(
      matches[1], matches[2]-1, matches[3], matches[4], matches[5], matches[6]
    )
  );
}
