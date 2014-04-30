describe('Bubblicious.Location', function() {
  var location;

  describe(".vectorTo", function() {
    it("should return a zeroed distance if the two locations are the same", function() {
      location = new Bubblicious.Location(5,5);
      var difference = location.vectorTo(location);
      expect(difference.elements).toEqual([0,0]);
    });

    it("should return a non-zero array of elements if the two locations are different", function() {
      sourceLocation = new Bubblicious.Location(3,4);
      destLocation = new Bubblicious.Location(0,0);
      var difference = sourceLocation.vectorTo(destLocation);
      expect(difference.elements).toEqual([-3,-4]);
    });
  });
});
