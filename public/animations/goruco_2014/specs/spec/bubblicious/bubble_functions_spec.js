describe('Bubblicious.BubbleFunctions', function() {
  var bubble;

  describe(".overlapping", function() {
    it("should return true if the centers are less than one unit apart", function() {
      bubble = {location: {x: 0, y: 0}}
      bubble2 = {location: {x: 0.5, y: 0.5}}
      expect(Bubblicious.BubbleFunctions.overlapping(bubble, bubble2)).toBeTrue
      expect(Bubblicious.BubbleFunctions.overlapping(bubble2, bubble)).toBeTrue
      bubble3 = {location: {x: 1, y: 1}};
      expect(Bubblicious.BubbleFunctions.overlapping(bubble, bubble3)).toBeFalsy();
      expect(Bubblicious.BubbleFunctions.overlapping(bubble3, bubble)).toBeFalsy();
      expect(Bubblicious.BubbleFunctions.overlapping(bubble2, bubble3)).toBeTruthy()
      expect(Bubblicious.BubbleFunctions.overlapping(bubble3, bubble2)).toBeTruthy();
    });
  });

  describe(".update", function() {
    it("locks to the target if close enough", function() {
      transition = {
        gravity: function() { return 20; },
        cheatThreshold: function() { return 0.05; }
      }
      bubble = newBubble('a', 0.001, 0, {target: [0,0]});
      target = bubble.target;
      bubble.transition = transition;
      bubble.update(1);
      expect(bubble.location).toEqual(target);
      expect(bubble.velocity.elements()).toBeCloseToElements([0, 0], 0.01);
      expect(bubble.isMovable).toBeFalsy();
    });

    it('resets velocity to aim at the target if it has a target and is offscreen', function() {
      transition = {
        gravity: function() { return 20; },
        cheatThreshold: function() { return 0.05; }
      }
      Bubblicious.Bubble.newBubbleStartingSpeed = 20;
      bubble = newBubble('a', -20, 0, {velocity: [-10, -10], target: [0,0]})
      bubble.transition = transition;
      bubble.startedOffscreen = true;
      expect(bubble.isOnscreen()).toBeFalsy();
      bubble.update(0.1)
      expect(bubble).toHaveLocation(-18, 0);
      expect(bubble.velocity).toBeCloseToElements([20, 0], 0.001);
    });
  });
});
