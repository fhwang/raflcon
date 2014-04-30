describe('Bubblicious.Collision.TwoBubble', function() {
  var twoBubble;

  describe(".locationCorrections", function() {
    it("should return a random unit vector if the bubbles are in the same location with zero velocity", function() {
      bubble1 = newBubble('a', 0, 0, {velocity: [0,0]})
      bubble2 = newBubble('b', 0, 0, {velocity: [0,0]})
      twoBubble = new Bubblicious.Collision.TwoBubble(bubble1, bubble2);
      locationCorrections = twoBubble.locationCorrections();
      expect(locationCorrections.length).toEqual(1);
      expect(locationCorrections[0].vector.modulus()).toBeCloseTo(1, 0.01);
    })
  })
});
