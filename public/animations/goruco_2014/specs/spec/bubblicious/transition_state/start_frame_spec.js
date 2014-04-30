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

  describe(".bubbles", function() {
    it("sets locked to false", function() {
      startBubble1 = newBubble('a', 0, 0);
      startBubble2 = newBubble('b', 1, 1);
      endBubble1 = newBubble('c', 2, 2);
      endBubble2 = newBubble('d', 3, 3);
      startFrame = new Bubblicious.TransitionState.StartFrame(
        [startBubble1, startBubble2], [endBubble1, endBubble2]
      )
      bubble = _(startFrame.bubbles()).find(function(b) {
        return b.char === 'a'
      });
      expect(bubble.locked).toBeFalsy()
    });
  });
});
