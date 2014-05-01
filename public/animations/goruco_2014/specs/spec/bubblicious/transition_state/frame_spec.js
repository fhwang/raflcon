describe('Bubblicious.TransitionState.Frame', function() {
  var transition;

  beforeEach(function() {
    Bubblicious.Collision.enableJitter = false
  });
  
  describe(".resolveAllCollisions", function() {
    it("handles a collision with a boundary once", function() {
      Bubblicious.padding = 3;
      bubble = newBubble('a', -3.5, 0, {velocity: [-1,0], target: [0,0]});
      frame = new Bubblicious.TransitionState.Frame([bubble]);
      frame.resolveAllCollisions();
      bubble = frame.bubbles[0]
      expect(bubble).toHaveLocation(-2.5,0);
      expect(bubble.velocity).toBeCloseToElements([0.9, 0], 0.01);
    });

    it("handles a collision with a boundary twice", function() {
      Bubblicious.resetConstants();
      Bubblicious.rect = [1,1]
      Bubblicious.padding = 3;
      bubble = newBubble('a', -10, 0, {velocity: [-1,0], target: [0,0]});
      frame = new Bubblicious.TransitionState.Frame([bubble]);
      frame.resolveAllCollisions();
      bubble = frame.bubbles[0]
      expect(bubble).toHaveLocation(2,0);
      expect(bubble.velocity).toBeCloseToElements([-0.81, 0], 0.01);
    });

    it("handles a collision with two axes of the boundary at once", function() {
      Bubblicious.resetConstants();
      Bubblicious.rect = [1,1]
      Bubblicious.padding = 3;
      bubble = newBubble('a', -4, -5, {velocity: [-1,-1], target: [0,0]});
      frame = new Bubblicious.TransitionState.Frame([bubble]);
      frame.resolveAllCollisions();
      bubble = frame.bubbles[0]
      expect(bubble).toHaveLocation(-2,-1);
      expect(bubble.velocity).toBeCloseToElements([0.81, 0.81], 0.01);
    });

    it("handles multiple diagonal collisions", function() {
      Bubblicious.resetConstants();
      Bubblicious.rect = [1,1]
      Bubblicious.padding = 3;
      bubble = newBubble('a', -10, -11, {velocity: [-1,-1], target: [0,0]});
      frame = new Bubblicious.TransitionState.Frame([bubble]);
      frame.resolveAllCollisions();
      bubble = frame.bubbles[0]
      expect(bubble).toHaveLocation(2,1);
      expect(bubble.velocity).toBeCloseToElements([-0.656, -0.656], 0.01);
    });

    it("handles a collision with a boundary when the jitter is on", function() {
      Bubblicious.Collision.enableJitter = true;
      Bubblicious.padding = 3;
      bubble = newBubble('a', -3.5, 0, {velocity: [-1,0], target: [0,0]});
      frame = new Bubblicious.TransitionState.Frame([bubble]);
      frame.resolveAllCollisions();
    });

    it("handles a collision with a boundary at an angle", function() {
      Bubblicious.padding = 3;
      bubble = newBubble('a', -3.5, 0, {velocity: [-1,-1], target: [0,0]});
      frame = new Bubblicious.TransitionState.Frame([bubble]);
      frame.resolveAllCollisions();
      bubble = frame.bubbles[0]
      expect(bubble).toHaveLocation(-2.5,0);
      expect(bubble.velocity).toBeCloseToElements([0.9, -0.9], 0.01);
    });

    it("handles a collision so far out of the bounding box that it has to bounce a few times before coming into view", function() {
      Bubblicious.resetConstants();
      Bubblicious.rect = [7,7];
      Bubblicious.padding = 3;
      Bubblicious.spacing = 2.1;
      bubble = newBubble('a', 100, 0, {velocity: [100, 0], target: [0,0]})
      frame = new Bubblicious.TransitionState.Frame([bubble]);
      frame.resolveAllCollisions();
      bubble = frame.bubbles[0]
      expect(bubble).toHaveLocation(1.6,0);
      expect(bubble.velocity).toBeCloseToElements([65.609,0], 0.01);
    });

    it("handles the collision when one of the bubbles is locked on its target", function() {
      bubble0 = newBubble('a', 0.1, 0, {velocity: [1,0], target: [1,1]});
      bubble1 = newBubble(
        'b', 1, 0, {velocity: [0,0], locked: true, target: [0,0]}
      );
      frame = new Bubblicious.TransitionState.Frame([bubble0, bubble1]);
      frame.resolveAllCollisions();
      bubble0Prime = _(frame.bubbles).detect(function(b) {
        return b.char === 'a'
      });
      bubble1Prime = _(frame.bubbles).detect(function(b) {
        return b.char === 'b'
      });
      expect(bubble0Prime).toHaveLocation(-0.1,0);
      expect(bubble0Prime.velocity).toBeCloseToElements([-0.9, 0], 0.01);
      expect(bubble1Prime.char).toEqual('b');
      expect(bubble1Prime).toHaveLocation(1,0);
      expect(bubble1Prime.velocity).toBeCloseToElements([0, 0], 0.01);
    });
  });
});
