describe('Bubblicious.TransitionState.StartFrame', function() {
  describe(".bubbles", function() {
    it("sets an initial inbound velocity for offscreen bubbles", function() {
      endBubble = newBubble('a', 0, 0)
      startFrame = new Bubblicious.TransitionState.StartFrame([], [endBubble])
      bubble = startFrame.bubbles()[0]
      expect(bubble.location.x === 0 && bubble.location.y === 0).toBeFalsy
      expect(bubble.velocity.modulus()).toBeClose(50, 0.001);
    });

    it("sets locked to false for any bubble", function() {
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
