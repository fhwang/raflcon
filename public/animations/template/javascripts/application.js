var animate = function(winners) {
  window.parent.console.log('animate', winners);
  $('.content').html(winners.join("<br />"));
}
