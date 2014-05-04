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
    this.processing.background(255, 0, 0);
    for (var i = 0; i < bubbleStates.length; i++) {
      this.drawBubbleState(bubbleStates[i]);
    }
  },

  drawBubbleState: function(bubbleState) {
    this.processing.noStroke();
    this.processing.fill('#ffffff');
    this.processing.ellipse(
      bubbleState.location.px(),
      bubbleState.location.py(),
      Bubblicious.bubbleDiameter(),
      Bubblicious.bubbleDiameter()
    );
    this.processing.fill(0,0,0);
    this.processing.text(
      bubbleState.bubble.char, 
      bubbleState.location.px() - 5,
      bubbleState.location.py() + 5 
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
