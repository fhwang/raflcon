var dervish;

var animate = function(winners) {
  dervish.transitionTo(winners);
}

$(function() {
  var width = $(window).width();
  var height = $(window).height();
  $('canvas').attr({'width': width, 'height': height})
  Dervish.canvasWidth = width;
  Dervish.canvasHeight = height;
  remainingAttendeeNameMax = parseInt(
    window.location.search.match(/remaining_attendee_name_max=(\d+)/)[1]
  )
  Dervish.fontSize = width / remainingAttendeeNameMax / 1.5
  Dervish.rect[0] = remainingAttendeeNameMax
  dervish = new Dervish();
  dervish.start();
});

