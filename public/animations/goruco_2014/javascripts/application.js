results = [
  ["WU ", " WU"],
  [" JJ", " NG"],
  [" LI", "AL "],
  ["JJ ", " AL"],
  ["JJ ", "NG "]
]
  
var animate = function(winners) {
  bubblicious.transitionTo(results.shift());
};

$(function() {
  bubblicious = new Bubblicious(results.shift());
});
 
