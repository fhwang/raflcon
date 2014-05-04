describe('Bubblicious.Bubble.State', function() {
  var bubble;

  describe(".modifiedCopy", function() {
    it("copies all relevant fields", function() {
      bubble = new Bubblicious.Bubble('a')
      bubbleState = bubble.state(
        new Bubblicious.Location(0, 0),
        {antiTarget: new Bubblicious.Location(1, 1)}
      )
      expect(bubbleState.antiTarget.coords()).toEqual([1,1]);
      bubbleStatePrime = bubbleState.modifiedCopy({})
      expect(bubbleStatePrime.antiTarget.coords()).toEqual([1,1]);
    });
  });

  describe(".overlaps", function() {
    it("should return true if the centers are less than one unit apart", function() {
      bubble = new Bubblicious.Bubble('a')
      bubbleState = bubble.state(new Bubblicious.Location(0, 0));
      bubble2 = new Bubblicious.Bubble('b')
      bubbleState2 = bubble2.state(new Bubblicious.Location(0.5, 0.5));
      expect(bubbleState.overlaps(bubbleState2)).toBeTruthy()
      expect(bubbleState2.overlaps(bubbleState)).toBeTruthy()
      bubble3 = new Bubblicious.Bubble('c')
      bubbleState3 = bubble3.state(new Bubblicious.Location(1, 1));
      expect(bubbleState.overlaps(bubbleState3)).toBeFalsy();
      expect(bubbleState3.overlaps(bubbleState)).toBeFalsy();
      expect(bubbleState2.overlaps(bubbleState3)).toBeTruthy();
      expect(bubbleState3.overlaps(bubbleState2)).toBeTruthy();
    });
  });
});
