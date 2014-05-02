// Processing can't be descended from, so we wrap it instead.
Bubblicious.ProcessingWrapper = function(bubblicious, canvas) {
  _.bindAll(this, 'draw', 'drawBubble');
  this.processing = new Processing(canvas);
  this.bubblicious = bubblicious;
  this.setup();
}

Bubblicious.ProcessingWrapper.prototype = _.extend({
  draw: function() {
    var bubbles = this.bubblicious.advanceBubbles(),
        self = this;
    this.processing.colorMode('RGB')
    this.processing.background(255, 0, 0);
    _(bubbles).each(this.drawBubble)
  },

  drawBubble: function(bubble) {
    this.processing.noStroke();
    this.processing.fill('#ffffff');
    this.processing.ellipse(
      bubble.location.px(),
      bubble.location.py(),
      Bubblicious.bubbleDiameter(),
      Bubblicious.bubbleDiameter()
    );
    this.processing.fill(0,0,0);
    this.processing.text(
      bubble.char, 
      bubble.location.px() - 5,
      bubble.location.py() + 5 
    );
  },

  setup: function() {
    this.processing.draw = this.draw;
    this.processing.size(Bubblicious.canvasWidth, Bubblicious.canvasHeight());
    var font = this.processing.loadFont('Verdana');
    this.processing.textFont(font, 12);
    this.processing.loop();
  }
}, Processing.prototype);
