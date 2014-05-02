results = 
[[" JOE ", " COOK", " JOE ", " AMAL"],
 ["ADAM ", "HOY  ", " KATZ", "MARX "],
 ["LEE  ", "NG LI", " AMIN", "VENU "],
 ["ADAM ", "DAN  ", " COOK", "GABE "],
 [" ITO ", " MACH", "  JOE", "BOB  "]]
  
var animate = function(winners) {
  bubblicious.transitionTo(results.shift());
};

$(function() {
  bubblicious = new Bubblicious(results.shift());
});
 
