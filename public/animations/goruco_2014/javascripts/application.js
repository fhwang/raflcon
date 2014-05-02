results = 
[[" VAN", " BOB", "BOB "],
 [" HOY", "KEN ", " JOE"],
 [" AMY", "  WU", " ITO"],
 ["LAR ", " AL ", " DER"],
 [" ITO", " LI ", "FOX "]]

  
var animate = function(winners) {
  bubblicious.transitionTo(results.shift());
};

$(function() {
  bubblicious = new Bubblicious(results.shift());
});
 
