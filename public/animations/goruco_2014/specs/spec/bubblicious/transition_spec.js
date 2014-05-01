describe('Bubblicious.Transition', function() {
  var transition;

  beforeEach(function() {
    Bubblicious.Collision.enableJitter = false
  });
  
  describe(".resolveAllCollisions", function() {
    it("does not change the velocity of a locked bubble even when jitter is on", function() {
      Bubblicious.Collision.enableJitter = true;
      bubble0 = newBubble('a', 0.1, 0, {velocity: [1,0]});
      bubble1 = newBubble('b', 1, 0, {velocity: [0,0], isMovable: false});
      transition = new Bubblicious.Transition([bubble0, bubble1]);
      transition.resolveAllCollisions();
      expect(bubble1.velocity.elements()).toEqual([0,0]);
    });

    it("knows how to resolve a collision where both bubbles end up at the exact same location", function() {
      Bubblicious.Collision.enableJitter = false;
      bubble0 = newBubble('a', 1, 0, {velocity: [1,0]});
      bubble1 = newBubble('b', 1, 0, {velocity: [0,0], isMovable: false});
      transition = new Bubblicious.Transition([bubble0, bubble1]);
      transition.resolveAllCollisions();
      expect(bubble0.vectorTo(bubble1).modulus()).toBeGreaterThanOrEqualTo(1);
    });

    it("resolves multiple collisions involving the same bubble", function() {
      // bubble0 and bubble1 are hitting bubble2 from the left and below
      bubble0 = newBubble('a', 0.1, 1, {velocity: [1,0]});
      bubble1 = newBubble('b', 1, 0.1, {velocity: [0,1]});
      bubble2 = newBubble('c', 1, 1, {velocity: [0,0]});
      bubbles = [bubble0, bubble1, bubble2]
      transition = new Bubblicious.Transition(bubbles)
      transition.resolveAllCollisions()
      expect(bubble0).toHaveLocation(0, 1);
      expect(bubble0.velocity).toBeCloseToElements([0, 0], 0.001);
      expect(bubble1).toHaveLocation(1, 0);
      expect(bubble1.velocity).toBeCloseToElements([0, 0], 0.001);
      expect(bubble2).toHaveLocation(1, 1);
      expect(bubble2.velocity).toBeCloseToElements([0.9, 0.9], 0.001);
    });
  });
 
  describe(".update", function() {
    it("should handle collision", function() {
      Bubblicious.rect = [2,1];
      bubbles = new Bubblicious.Layout(["ab"]).bubbles;
      bubbleA = _(bubbles).find(function(bubble) {
        return bubble.char === 'a'
      });
      bubbleA.velocity = new Bubblicious.Velocity(1,0);
      bubbleB = _(bubbles).find(function(bubble) {
        return bubble.char === 'b'
      });
      bubbleB.location.x = 1
      transition = new Bubblicious.Transition(bubbles, ["xb"]);
      transition.start()
      transition.update(0.01);
      expect(bubbleA.vectorTo(bubbleB).modulus()).toBeGreaterThanOrEqualTo(1)
    });
  });
});
