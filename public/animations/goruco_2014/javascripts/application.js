results = 
[[" MELIA JJ",
  "NATCHEV  ",
  "YOUNG JIM",
  "WONG R.T.",
  " TODD T. ",
  "JOSE MACH",
  "VENU BETH",
  "COLON HOY"],
 ["HALES ARI",
  "LUIS JOHN",
  " JJ COLON",
  "DAVIS ARI",
  "BRIAN ITO",
  "JIM BRETT",
  "PITTS WU ",
  "  GALARZA"],
 ["ENSARI T.",
  "GURUNG WU",
  "JAROS LAR",
  "HALES BOB",
  "  STEWART",
  "LECHOW AL",
  "LARS MACH",
  "ROGISH WU"],
 ["MACH MARX",
  " JONES T.",
  "ENSARI NG",
  "  LEITGEB",
  "CODY NOAH",
  "LARS TODD",
  "JASON T. ",
  " STEWART "],
 ["  SYKULEV",
  "DISHA KEN",
  " MONTE NG",
  " SANTIAGO",
  "JARED BOB",
  " SINCLAIR",
  " WERBELL ",
  "GARBER JJ"]]
  
var animate = function(winners) {
  bubblicious.transitionTo(results.shift());
};

$(function() {
  bubblicious = new Bubblicious(results.shift());
});
 
