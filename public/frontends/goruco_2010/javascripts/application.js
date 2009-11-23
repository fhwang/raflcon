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
        if (giveaway_round.active_giveaways > 0) {
          $('giveaway_option_' + giveaway.id).remove();
          $('giveaway_select').options[0].selected = true;
          load_giveaway_form();
        } else {
          $("giveaway_round_option_" + giveaway_round.id).remove();
          $('giveaway_round_select').options[0].selected = true;
          load_giveaway_round();
        }
      }
    }
  );
};

function init() {
  new EJS(
    {url: "/frontends/goruco_2010/ejs/giveaway_rounds.ejs"}
  ).update(
    'giveaway_rounds', "/giveaway_rounds"
  );
  setTimeout("try_load_giveaway_round()", 25);
}

function load_giveaway_form() {
  var giveaway_id = $('giveaway_select').value;
  new EJS(
    {url: "/frontends/goruco_2010/ejs/giveaway.ejs"}
  ).update('giveaway_form', '/giveaways/show/' + giveaway_id + '.json');
}

function load_giveaway_round() {
  var giveaway_round_id = $('giveaway_round_select').value;
  if (giveaway_round_id) {
    $('giveaway_round').innerHTML = '';
    $('giveaway_form').innerHTML = '';
    var url = '/giveaway_rounds/show/' + giveaway_round_id + '.json';
    new EJS(
      {url: "/frontends/goruco_2010/ejs/giveaway_round.ejs"}
    ).update('giveaway_round', url);
  }
  setTimeout("try_load_giveaway_form()", 25);
};

/*
function new_giveaway_attempt(giveaway_attempt) {
  $$('.giveaway_form').each(function(elt) { elt.disable();});
  setTimeout(
    "$$('.giveaway_form').each(function(elt) { elt.enable();});", 2000
  );
  winners = "<ul>";
  for (i = 0; i < giveaway_attempt.attendees.length; i++) {
    attendee = giveaway_attempt.attendees[i];
    winners = winners +  "<li>"+ attendee.name + "</li>";
  }
  winners = winners + "</ul>";
  $('newest_giveaway_attempt').innerHTML = winners;
}
*/

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


function try_load_giveaway_form() {
  if ($('giveaway_select')) {
    load_giveaway_form();
  } else {
    setTimeout("try_load_giveaway_form()", 25);
  }
}

function try_load_giveaway_round() {
  if ($('giveaway_round_select')) {
    load_giveaway_round();
  } else {
    setTimeout("try_load_giveaway_round()", 25);
  }
}
