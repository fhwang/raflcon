describe('Bubblicious.CollisionResolver', function() {
  beforeEach(function() {
    Bubblicious.rect = [9,8]
    Bubblicious.resetConstants()
    Bubblicious.Collision.enableJitter = false
    Bubblicious.Collision.elasticity = 0.9
  });

  describe(".run", function() {
    it("should handle simple single-axis collision", function() {
      bubble1 = newBubbleState('a', 0.1, 0, {velocity: [1,0], target: [2,0]});
      bubble2 = newBubbleState('b', 1, 0, {velocity: [0,0], target: [0,0]});
      resolver = new Bubblicious.CollisionResolver([bubble1, bubble2]);
      newBubbleStates = resolver.run()
      bubble1Prime = _(newBubbleStates).detect(function(b) {
        return b.bubble.char === 'a'
      });
      bubble2Prime = _(newBubbleStates).detect(function(b) {
        return b.bubble.char === 'b'
      });
      expect(bubble1Prime).toHaveLocation(0,0);
      expect(bubble1Prime.velocity).toBeCloseToElements([0,0], 0.01);
      expect(bubble2Prime).toHaveLocation(1,0);
      expect(bubble2Prime.velocity).toBeCloseToElements([0.9, 0], 0.01);
    });
  });
});
