function choose_giveaway_round() {
  var giveaway_round_id = $('giveaway_round_select').value;
  if (giveaway_round_id) {
    var url = '/giveaway_rounds/show/' + giveaway_round_id + '.json';
    new EJS({url: "/ejs/giveaway_round.ejs"}).update('giveaway_round', url);
  }
};

function choose_giveaway(giveaway_id) {
  var url = '/giveaways/show/' + giveaway_id + '.json';
  $$('.giveaway').each(function(elt) {
    elt.hide();
  });
  new EJS({url: "/ejs/giveaway.ejs"}).update('giveaway_' + giveaway_id, url);
  $('giveaway_' + giveaway_id).show();
};
