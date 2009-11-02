function choose_giveaway_round() {
  var giveaway_round_id = $('giveaway_round_select').value;
  if (giveaway_round_id) {
    $('giveaway').innerHTML = '';
    var url = '/giveaway_rounds/show/' + giveaway_round_id + '.json';
    new EJS({url: "/ejs/giveaway_round.ejs"}).update('giveaway_round', url);
  }
};

function choose_giveaway(giveaway_id) {
  var url = '/giveaways/show/' + giveaway_id + '.json';
  new EJS({url: "/ejs/giveaway.ejs"}).update('giveaway', url);
};
