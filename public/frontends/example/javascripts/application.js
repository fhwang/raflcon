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

function init_control_panel() {
  new EJS(
    {url: "/frontends/example/ejs/control_panel.ejs"}
  ).update(
    'control_panel', "/giveaway_rounds"
  );
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
