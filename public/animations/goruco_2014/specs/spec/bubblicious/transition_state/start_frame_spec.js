describe('Bubblicious.TransitionState.StartFrame', function() {
  describe(".advanced", function() {
    it('resets velocity to aim at the target if it has a target and is offscreen', function() {
      gravity = 20;
      bubble = newBubble(
        'a', -20, 0, 
        {velocity: [-10, -10], target: [0,0], enteringScreen: true}
      )
      expect(bubble.isOnscreen()).toBeFalsy();
      bubblePrime = bubble.advanced(0.1, gravity)
      expect(bubblePrime).toHaveLocation(-18, 0);
      expect(bubblePrime.velocity).toBeCloseToElements([20, 0], 0.001);

      /*
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
     */
      expect(true).toBeFalsy
    });
  });

  describe(".setTarget", function() {
    it("turns on the isMovable flag", function() {
      bubble = newBubble('a', 0, 0, {isMovable: false, target: [1,1]});
      expect(bubble.isMovable).toBeTruthy()
    });
  });
});
