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
      bubble = newBubble('a', -10, 0, {velocity: [-1,0]});
      bubble.target = new Bubblicious.Location(0,0);
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
      bubble = newBubble('a', -4, -5, {velocity: [-1,-1]});
      bubble.target = new Bubblicious.Location(0,0);
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
      bubble = newBubble('a', -3.5, 0, {velocity: [-1,0]});
      bubble.target = new Bubblicious.Location(0,0);
      frame = new Bubblicious.TransitionState.Frame([bubble]);
      frame.resolveAllCollisions();
    });

    it("handles a collision with a boundary at an angle", function() {
      Bubblicious.padding = 3;
      bubble = newBubble('a', -3.5, 0, {velocity: [-1,-1]});
      bubble.target = new Bubblicious.Location(0,0);
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
      bubble = newBubble('a', 100, 0, {velocity: [100, 0]})
      bubble.target = new Bubblicious.Location(0,0);
      frame = new Bubblicious.TransitionState.Frame([bubble]);
      frame.resolveAllCollisions();
      bubble = frame.bubbles[0]
      expect(bubble).toHaveLocation(1.6,0);
      expect(bubble.velocity).toBeCloseToElements([65.609,0], 0.01);
    });
  });
});
