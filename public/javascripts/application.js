function giveaway_round_changed() {
  var giveaway_round_id = $('giveaway_round_select').value;
  if (giveaway_round_id) {
    var url = '/giveaway_rounds/show/' + giveaway_round_id + '.json';
    new EJS({url: "/ejs/giveaway_round.ejs"}).update('giveaway_round', url);
  }
};
