// Processing can't be descended from, so we wrap it instead.
Bubblicious.ProcessingWrapper = function(bubblicious, canvas) {
  _.bindAll(this, 'draw', 'drawBubbleState');
  this.processing = new Processing(canvas);
  this.bubblicious = bubblicious;
  this.setup();
}

Bubblicious.ProcessingWrapper.prototype = _.extend({
  draw: function() {
    var bubbleStates = this.bubblicious.advanceBubbleStates();
    this.processing.colorMode('RGB')
    this.processing.background(255,255,255)
    for (var i = 0; i < bubbleStates.length; i++) {
      this.drawBubbleState(bubbleStates[i]);
    }
  },

  drawBubbleState: function(bubbleState) {
    this.processing.noStroke();
    this.processing.fill(255,224,224);
    this.processing.ellipse(
      bubbleState.bubblePx(),
      bubbleState.bubblePy(),
      bubbleState.bubblePDiameter(),
      bubbleState.bubblePDiameter()
    );
    this.processing.fill(0,0,0);
    this.processing.text(
      bubbleState.bubble.char, 
      bubbleState.charPx(),
      bubbleState.charPy()
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
