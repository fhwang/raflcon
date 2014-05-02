describe('Bubblicious.Collision.LocationCorrection', function() {
  var twoBubble;

  describe(".isMatch", function() {
    it("says it's not a match if there are different bubbles", function() {
      bubble = newBubble('a', 0, 0, {target: [1,1]})
      correction = new Bubblicious.Collision.LocationCorrection(bubble)
      differentBubble = newBubble('b', 10, 10, {antiTarget: [11, 11]})
      expect(correction.isMatch(differentBubble)).toBeFalsy()
    });
  });
});
