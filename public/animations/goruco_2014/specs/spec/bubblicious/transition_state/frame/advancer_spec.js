describe('Bubblicious.TransitionState.Frame.Advancer', function() {
  var bubble;

  describe(".result", function() {
    it("returns a copy with an update location when there's a velocity", function() {
      bubble = new Bubblicious.Bubble('a')
      bubbleState = bubble.state(
        new Bubblicious.Location(0, 0),
        {velocity: new Bubblicious.Velocity(1, 1)}
      )
      advancer = new Bubblicious.TransitionState.Frame.Advancer(
        bubbleState, 0.1, 10
      )
      bubbleStatePrime = advancer.result();
      expect(bubbleStatePrime.location.coords()).toEqual([0.1, 0.1]);
      expect(bubbleStatePrime.bubble).toEqual(bubble);
    });

    it("accelerates towards a target if there is one", function() {
      bubble = new Bubblicious.Bubble('a')
      bubbleState = bubble.state(
        new Bubblicious.Location(0, 0),
        {target: new Bubblicious.Location(1, 0)}
      )
      advancer = new Bubblicious.TransitionState.Frame.Advancer(
        bubbleState, 0.1, 10
      )
      bubbleStatePrime = advancer.result();
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
      advancer = new Bubblicious.TransitionState.Frame.Advancer(
        bubbleState, interval, gravity, cheatThreshold
      )
      bubbleStatePrime = advancer.result();
      expect(bubbleStatePrime.location.coords()).toEqual([0,0]);
      expect(bubbleStatePrime.velocity.elements()).toEqual([0,0]);
      expect(bubbleStatePrime.locked).toBeTruthy()
      expect(bubbleStatePrime.target).toBeNull()
    });
  });
});
