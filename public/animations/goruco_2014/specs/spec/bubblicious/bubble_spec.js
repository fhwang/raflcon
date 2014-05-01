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
      expect(bubble.overlaps(bubble2)).toBeTrue
      expect(bubble2.overlaps(bubble)).toBeTrue
      bubble3 = new Bubblicious.Bubble('c', new Bubblicious.Location(1, 1));
      expect(bubble.overlaps(bubble3)).toBeFalsy();
      expect(bubble3.overlaps(bubble)).toBeFalsy();
      expect(bubble2.overlaps(bubble3)).toBeTruthy();
      expect(bubble3.overlaps(bubble2)).toBeTruthy();
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
  });
});
