results = 
[["MONTE T.",
  "ARI MACH",
  " JOHN WU",
  " WERBELL",
  "JASON T.",
  "ARI ABEL",
  "AMAL BOB"],
 ["MARK DER",
  " WERNER ",
  "  SOLANO",
  "  AUSTEN",
  "  OUYANG",
  " GUELPA ",
  " MATTHEW"],
 ["LAR DALE",
  "DARRYL  ",
  "PERRY NG",
  "MAREK AL",
  "GOULD T.",
  "T.J. DER",
  "FOX TODD"],
 ["SAM NORA",
  "  BAXTER",
  " KAREEM ",
  " DIGITAL",
  "STEFANO ",
  "DAVID T.",
  "LEO AMIN"],
 ["HARIS AL",
  " NATHAN ",
  " COOK LI",
  " DUNCAN ",
  "PERRY T.",
  "ANAND JJ",
  "ROSS LIN"]]
  
var animate = function(winners) {
  bubblicious.transitionTo(results.shift());
};

$(function() {
  bubblicious = new Bubblicious(results.shift());
});
 
