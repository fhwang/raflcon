describe('Bubblicious.Bubble', function() {
  var bubble;

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

  describe(".setTarget", function() {
    it("turns on the isMovable flag", function() {
      bubble = newBubble('a', 0, 0, {isMovable: false, target: [1,1]});
      expect(bubble.isMovable).toBeTruthy()
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
