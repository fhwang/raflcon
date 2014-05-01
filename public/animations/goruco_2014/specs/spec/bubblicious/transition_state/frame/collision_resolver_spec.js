describe('Bubblicious.TransitionState.Frame.CollisionResolver', function() {
  var resolverClass = Bubblicious.TransitionState.Frame.CollisionResolver;

  beforeEach(function() {
    Bubblicious.Collision.enableJitter = false
  });

  describe(".run", function() {
    it("should handle simple single-axis collision", function() {
      bubble1 = newBubble('a', 0.1, 0, {velocity: [1,0], target: [2,0]});
      bubble2 = newBubble('b', 1, 0, {velocity: [0,0], target: [0,0]});
      resolver = new resolverClass([bubble1, bubble2]);
      newBubbles = resolver.run()
      bubble1Prime = _(newBubbles).detect(function(b) {
        return b.char === 'a'
      });
      bubble2Prime = _(newBubbles).detect(function(b) {
        return b.char === 'b'
      });
      expect(bubble1Prime).toHaveLocation(0,0);
      expect(bubble1Prime.velocity).toBeCloseToElements([0,0], 0.01);
      expect(bubble2Prime).toHaveLocation(1,0);
      expect(bubble2Prime.velocity).toBeCloseToElements([0.9, 0], 0.01);
    });
  });
});
