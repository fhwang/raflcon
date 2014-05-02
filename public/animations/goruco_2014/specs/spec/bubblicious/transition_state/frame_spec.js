describe('Bubblicious.TransitionState.Frame', function() {
  var transition;

  beforeEach(function() {
    Bubblicious.Collision.enableJitter = false
  });
  
  describe(".resolveAllCollisions", function() {
    it("handles a collision with a boundary once", function() {
      Bubblicious.padding = 3;
      bubbleState = newBubbleState('a', -3.5, 0, {velocity: [-1,0], target: [0,0]});
      frame = new Bubblicious.TransitionState.Frame([bubbleState]);
      frame.resolveAllCollisions();
      bubbleState = frame.bubbleStates[0]
      expect(bubbleState).toHaveLocation(-2.5,0);
      expect(bubbleState.velocity).toBeCloseToElements([0.9, 0], 0.01);
    });

    it("handles a collision with a boundary twice", function() {
      Bubblicious.resetConstants();
      Bubblicious.rect = [1,1]
      Bubblicious.padding = 3;
      bubbleState = newBubbleState('a', -10, 0, {velocity: [-1,0], target: [0,0]});
      frame = new Bubblicious.TransitionState.Frame([bubbleState]);
      frame.resolveAllCollisions();
      bubbleState = frame.bubbleStates[0]
      expect(bubbleState).toHaveLocation(2,0);
      expect(bubbleState.velocity).toBeCloseToElements([-0.81, 0], 0.01);
    });

    it("handles a collision with two axes of the boundary at once", function() {
      Bubblicious.resetConstants();
      Bubblicious.rect = [1,1]
      Bubblicious.padding = 3;
      bubbleState = newBubbleState('a', -4, -5, {velocity: [-1,-1], target: [0,0]});
      frame = new Bubblicious.TransitionState.Frame([bubbleState]);
      frame.resolveAllCollisions();
      bubbleState = frame.bubbleStates[0]
      expect(bubbleState).toHaveLocation(-2,-1);
      expect(bubbleState.velocity).toBeCloseToElements([0.81, 0.81], 0.01);
    });

    it("handles multiple diagonal collisions", function() {
      Bubblicious.resetConstants();
      Bubblicious.rect = [1,1]
      Bubblicious.padding = 3;
      bubbleState = newBubbleState('a', -10, -11, {velocity: [-1,-1], target: [0,0]});
      frame = new Bubblicious.TransitionState.Frame([bubbleState]);
      frame.resolveAllCollisions();
      bubbleState = frame.bubbleStates[0]
      expect(bubbleState).toHaveLocation(2,1);
      expect(bubbleState.velocity).toBeCloseToElements([-0.656, -0.656], 0.01);
    });

    it("handles a collision with a boundary when the jitter is on", function() {
      Bubblicious.Collision.enableJitter = true;
      Bubblicious.padding = 3;
      bubbleState = newBubbleState('a', -3.5, 0, {velocity: [-1,0], target: [0,0]});
      frame = new Bubblicious.TransitionState.Frame([bubbleState]);
      frame.resolveAllCollisions();
    });

    it("handles a collision with a boundary at an angle", function() {
      Bubblicious.padding = 3;
      bubbleState = newBubbleState('a', -3.5, 0, {velocity: [-1,-1], target: [0,0]});
      frame = new Bubblicious.TransitionState.Frame([bubbleState]);
      frame.resolveAllCollisions();
      bubbleState = frame.bubbleStates[0]
      expect(bubbleState).toHaveLocation(-2.5,0);
      expect(bubbleState.velocity).toBeCloseToElements([0.9, -0.9], 0.01);
    });

    it("handles a collision so far out of the bounding box that it has to bounce a few times before coming into view", function() {
      Bubblicious.resetConstants();
      Bubblicious.rect = [7,7];
      Bubblicious.padding = 3;
      Bubblicious.spacing = 2.1;
      bubbleState = newBubbleState('a', 100, 0, {velocity: [100, 0], target: [0,0]})
      frame = new Bubblicious.TransitionState.Frame([bubbleState]);
      frame.resolveAllCollisions();
      bubbleState = frame.bubbleStates[0]
      expect(bubbleState).toHaveLocation(1.6,0);
      expect(bubbleState.velocity).toBeCloseToElements([65.609,0], 0.01);
    });

    it("handles the collision when one of the bubbleStates is locked on its target", function() {
      bubbleState0 = newBubbleState('a', 0.1, 0, {velocity: [1,0], target: [1,1]});
      bubbleState1 = newBubbleState(
        'b', 1, 0, {velocity: [0,0], locked: true}
      );
      frame = new Bubblicious.TransitionState.Frame([bubbleState0, bubbleState1]);
      frame.resolveAllCollisions();
      bubbleState0Prime = _(frame.bubbleStates).detect(function(b) {
        return b.bubble.char === 'a'
      });
      bubbleState1Prime = _(frame.bubbleStates).detect(function(b) {
        return b.bubble.char === 'b'
      });
      expect(bubbleState0Prime).toHaveLocation(-0.1,0);
      expect(bubbleState0Prime.velocity).toBeCloseToElements([-0.9, 0], 0.01);
      expect(bubbleState1Prime.bubble.char).toEqual('b');
      expect(bubbleState1Prime).toHaveLocation(1,0);
      expect(bubbleState1Prime.velocity).toBeCloseToElements([0, 0], 0.01);
    });

    it("does not change the velocity of a locked bubbleState even when jitter is on", function() {
      Bubblicious.Collision.enableJitter = true;
      bubbleState0 = newBubbleState('a', 0.1, 0, {velocity: [1,0], target: [1,1]});
      bubbleState1 = newBubbleState(
        'b', 1, 0, {velocity: [0,0], locked: true}
      );
      frame = new Bubblicious.TransitionState.Frame([bubbleState0, bubbleState1]);
      frame.resolveAllCollisions();
      bubbleState1Prime = _(frame.bubbleStates).detect(function(b) {
        return b.bubble.char === 'b'
      });
      expect(bubbleState1Prime.velocity.elements()).toEqual([0,0]);
    });

    it("knows how to resolve a collision where both bubbleStates end up at the exact same location", function() {
      bubbleState0 = newBubbleState('a', 1, 0, {velocity: [1,0], target: [1,1]});
      bubbleState1 = newBubbleState('b', 1, 0, {velocity: [0,0], locked: true});
      frame = new Bubblicious.TransitionState.Frame([bubbleState0, bubbleState1]);
      frame.resolveAllCollisions();
      bubbleState0Prime = _(frame.bubbleStates).detect(function(b) {
        return b.bubble.char === 'a'
      });
      bubbleState1Prime = _(frame.bubbleStates).detect(function(b) {
        return b.bubble.char === 'b'
      });
      vector = bubbleState0Prime.vectorTo(bubbleState1Prime)
      expect(vector.modulus()).toBeGreaterThanOrEqualTo(1);
    });

    it("resolves multiple collisions involving the same bubbleState", function() {
      // bubbleState0 and bubbleState1 are hitting bubbleState2 from the left and below
      bubbleState0 = newBubbleState('a', 0.1, 1, {velocity: [1,0], target: [1, 0]});
      bubbleState1 = newBubbleState('b', 1, 0.1, {velocity: [0,1], target: [1, 2]});
      bubbleState2 = newBubbleState('c', 1, 1, {velocity: [0,0], target: [2, 2]});
      bubbleStates = [bubbleState0, bubbleState1, bubbleState2]
      frame = new Bubblicious.TransitionState.Frame(bubbleStates);
      frame.resolveAllCollisions();
      bubbleState0Prime = _(frame.bubbleStates).detect(function(b) {
        return b.bubble.char === 'a'
      });
      bubbleState1Prime = _(frame.bubbleStates).detect(function(b) {
        return b.bubble.char === 'b'
      });
      bubbleState2Prime = _(frame.bubbleStates).detect(function(b) {
        return b.bubble.char === 'c'
      });
      expect(bubbleState0Prime).toHaveLocation(0, 1);
      expect(bubbleState0Prime.velocity).toBeCloseToElements([0, 0], 0.001);
      expect(bubbleState1Prime).toHaveLocation(1, 0);
      expect(bubbleState1Prime.velocity).toBeCloseToElements([0, 0], 0.001);
      expect(bubbleState2Prime).toHaveLocation(1, 1);
      expect(bubbleState2Prime.velocity).toBeCloseToElements([0.9, 0.9], 0.001);
    });
  });

  describe(".run", function() {
    it("removes bubbleStates with anti targets that have left successfully", function() {
      bubbleState = newBubbleState(
        'a', 100, 100, {velocity: [100, 100], antiTarget: [0, 0]}
      );
      frame = new Bubblicious.TransitionState.Frame(
        [bubbleState], new Date() - 1, new Date() - 10
      );
      frame.run()
      expect(frame.bubbleStates.length).toEqual(0)
    });
  });
});
