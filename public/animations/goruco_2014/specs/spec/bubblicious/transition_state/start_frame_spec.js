describe('Bubblicious.TransitionState.StartFrame', function() {
  describe(".setTarget", function() {
    it("turns on the isMovable flag", function() {
      bubble = newBubble('a', 0, 0, {isMovable: false, target: [1,1]});
      expect(bubble.isMovable).toBeTruthy()
    });
  });
});
