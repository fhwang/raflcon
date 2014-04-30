describe('Bubblicious.LocationFunctions', function() {
  var location;

  describe(".vector", function() {
    it("should return a zeroed distance if the two locations are the same", function() {
      location = {x: 5, y: 5}
      var difference = Bubblicious.LocationFunctions.vector(
        location, location
      );
      expect(difference.elements).toEqual([0,0]);
    });

    it("should return a non-zero array of elements if the two locations are different", function() {
      source = {x: 3, y: 4}
      dest = {x: 0, y: 0};
      var difference = Bubblicious.LocationFunctions.vector(source, dest);
      expect(difference.elements).toEqual([-3,-4]);
    });
  });
});
