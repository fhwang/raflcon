describe('Bubblicious.Bubble.State', function() {
  var bubble;

  describe(".advanced", function() {
    it("returns a copy with an update location when there's a velocity", function() {
      bubble = new Bubblicious.Bubble('a')
      bubbleState = bubble.state(
        new Bubblicious.Location(0, 0),
        {velocity: new Bubblicious.Velocity(1, 1)}
      )
      bubbleStatePrime = bubbleState.advanced(0.1, 10);
      expect(bubbleStatePrime.location.coords()).toEqual([0.1, 0.1]);
      expect(bubbleStatePrime.bubble).toEqual(bubble);
    });

    it("accelerates towards a target if there is one", function() {
      bubble = new Bubblicious.Bubble('a')
      bubbleState = bubble.state(
        new Bubblicious.Location(0, 0),
        {target: new Bubblicious.Location(1, 0)}
      )
      bubbleStatePrime = bubbleState.advanced(0.1, 10);
      expect(bubbleStatePrime.location.coords()).toEqual([0.1, 0]);
    });

    it("locks to target if it is already close enough", function() {
      bubble = new Bubblicious.Bubble('a')
      bubbleState = bubble.state(
        new Bubblicious.Location(0, 0),
        {target: new Bubblicious.Location(0, 0)}
      )
      var interval = 0.31;
      var gravity = 10;
      var cheatThreshold = 0.1
      bubbleStatePrime = bubbleState.advanced(
        interval, gravity, cheatThreshold
      )
      expect(bubbleStatePrime.location.coords()).toEqual([0,0]);
      expect(bubbleStatePrime.velocity.elements()).toEqual([0,0]);
      expect(bubbleStatePrime.locked).toBeTruthy()
      expect(bubbleStatePrime.target).toBeNull()
    });
  });

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
