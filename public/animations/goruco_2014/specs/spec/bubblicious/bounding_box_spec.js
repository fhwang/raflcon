describe('Bubblicious.BoundingBox', function() {
  var boundingBox;

  describe('.fullyContains', function() {
    it('returns true if no part of the bubble is into any boundary', function() {
      Bubblicious.rect = [3,2];
      Bubblicious.canvasWidth = 500;
      Bubblicious.canvasHeight = 400;
      Bubblicious.padding = 3;
      boundingBox = new Bubblicious.BoundingBox();
      bubble = {location: {x: -2.9, y: 0}}
      expect(boundingBox.fullyContains(bubble)).toBeTruthy();
    });

    it('returns false if the bubble is even partway into a boundary', function() {
      Bubblicious.rect = [3,2];
      Bubblicious.canvasWidth = 500;
      Bubblicious.canvasHeight = 400;
      Bubblicious.padding = 3;
      boundingBox = new Bubblicious.BoundingBox();
      bubble = {location: {x: -3.5, y: 0}}
      expect(boundingBox.fullyContains(bubble)).toBeFalsy();
    });
  });
});

describe('Bubblicious.BoundingBox.Axis', function() {
  var axis;

  describe('.normal', function() {
    it('returns a straight line away into the edge of the axis', function() {
      axis = new Bubblicious.BoundingBox.Axis(0);
      velocity = Vector.create([-1, 1]);
      normal = axis.normal(velocity)
      expect(normal).toBeCloseToElements([-1, 0], 0.01);
    });
  });
});
