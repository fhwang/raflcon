describe('Bubblicious.Collision.TwoBubble', function() {
  var twoBubble;

  beforeEach(function() {
    Bubblicious.Collision.enableJitter = false
  });

  describe(".locationCorrections", function() {
    it("should handle simple single-axis collision", function() {
      bubble1 = newBubbleState('a', 0.1, 0, {velocity: [1,0], target: [2, 0]});
      bubble2 = newBubbleState('b', 1, 0, {velocity: [0,0], target: [0, 0]});
      twoBubble = new Bubblicious.Collision.TwoBubble([bubble1, bubble2]);
      locationCorrections = twoBubble.locationCorrections();
      correction1 = _(locationCorrections).detect(function(c) {
        return c.bubble === bubble1.bubble
      });
      correction2 = _(locationCorrections).detect(function(c) {
        return c.bubble === bubble2.bubble
      });
      expect(correction1.delta).toBeCloseToElements([-0.1, 0])
      expect(correction2.delta).toBeCloseToElements([0, 0])
    });

    it("should return a random unit vector if the bubbles are in the same location with zero velocity", function() {
      bubble1 = newBubbleState('a', 0, 0, {velocity: [1,1], target: [0,0]})
      bubble2 = newBubbleState('b', 0, 0, {velocity: [1,1], target: [2,2]})
      twoBubble = new Bubblicious.Collision.TwoBubble([bubble1, bubble2]);
      locationCorrections = twoBubble.locationCorrections();
      expect(locationCorrections.length).toEqual(1);
      expect(locationCorrections[0].delta.modulus()).toBeCloseTo(1, 0.01);
    })
  })

  describe(".velocityCorrections", function() {
    it("should handle simple single-axis collision", function() {
      bubble1 = newBubbleState('a', 0.1, 0, {velocity: [1,0], target: [2, 0]});
      bubble2 = newBubbleState('b', 1, 0, {velocity: [0,0], target: [0, 0]});
      twoBubble = new Bubblicious.Collision.TwoBubble([bubble1, bubble2]);
      velocityCorrections = twoBubble.velocityCorrections();
      correction1 = _(velocityCorrections).detect(function(c) {
        return c.bubble === bubble1.bubble
      });
      correction2 = _(velocityCorrections).detect(function(c) {
        return c.bubble === bubble2.bubble
      });
      expect(correction1.delta).toBeCloseToElements([-1,0])
      expect(correction2.delta).toBeCloseToElements([0.9,0])
    });
  });
});
