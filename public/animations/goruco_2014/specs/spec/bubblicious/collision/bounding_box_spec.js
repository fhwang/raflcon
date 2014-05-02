describe('Bubblicious.Collision.BoundingBox', function() {
  var twoBubble;

  beforeEach(function() {
    Bubblicious.Collision.enableJitter = false
  });

  describe(".corrections", function() {
    it("should handle a bubble far outside of bounds", function() {
      bubble = newBubbleState('a', 1000000, 0, {target: [1,1]})
      expect(bubble.isFullyOffscreen()).toBeTruthy()
      collision = new Bubblicious.Collision.BoundingBox(bubble)
      bubblePrime = collision.corrections()[0].apply(bubble)
      expect(bubblePrime.isOnscreen()).toBeTruthy()
    });
  });
});
