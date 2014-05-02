describe('Bubblicious.Bubble', function() {
  var bubble;

  describe(".advanced", function() {
    it("returns a copy with an update location when there's a velocity", function() {
      bubble = new Bubblicious.Bubble(
        'a', new Bubblicious.Location(0, 0),
        {velocity: new Bubblicious.Velocity(1, 1)}
      )
      advanced = bubble.advanced(0.1, 10);
      expect(advanced.location.coords()).toEqual([0.1, 0.1]);
    });

    it("accelerates towards a target if there is one", function() {
      bubble = new Bubblicious.Bubble(
        'a', new Bubblicious.Location(0, 0),
        {target: new Bubblicious.Location(1, 0)}
      )
      advanced = bubble.advanced(0.1, 10);
      expect(advanced.location.coords()).toEqual([0.1, 0]);
    });

    it("locks to the target if close enough", function() {
      bubble = new Bubblicious.Bubble(
        'a', new Bubblicious.Location(0, 0),
        {target: new Bubblicious.Location(1, 0)}
      )
      var interval = 0.31;
      var gravity = 10;
      var cheatThreshold = 0.1
      advanced = bubble.advanced(interval, gravity, cheatThreshold)
      expect(advanced.location.coords()).toEqual([1,0]);
      expect(advanced.velocity.elements()).toEqual([0,0]);
      expect(advanced.locked).toBeTruthy()
      expect(advanced.target).toBeNull()
    });
  });

  describe(".modifiedCopy", function() {
    it("copies all relevant fields", function() {
      bubble = new Bubblicious.Bubble(
        'a', new Bubblicious.Location(0, 0),
        {antiTarget: new Bubblicious.Location(1, 1)}
      )
      expect(bubble.antiTarget.coords()).toEqual([1,1]);
      bubblePrime = bubble.modifiedCopy({})
      expect(bubblePrime.antiTarget.coords()).toEqual([1,1]);
    });
  });

  describe(".overlaps", function() {
    it("should return true if the centers are less than one unit apart", function() {
      bubble = new Bubblicious.Bubble('a', new Bubblicious.Location(0, 0));
      bubble2 = new Bubblicious.Bubble('b', new Bubblicious.Location(0.5, 0.5));
      expect(bubble.overlaps(bubble2)).toBeTruthy()
      expect(bubble2.overlaps(bubble)).toBeTruthy()
      bubble3 = new Bubblicious.Bubble('c', new Bubblicious.Location(1, 1));
      expect(bubble.overlaps(bubble3)).toBeFalsy();
      expect(bubble3.overlaps(bubble)).toBeFalsy();
      expect(bubble2.overlaps(bubble3)).toBeTruthy();
      expect(bubble3.overlaps(bubble2)).toBeTruthy();
    });
  });
});
