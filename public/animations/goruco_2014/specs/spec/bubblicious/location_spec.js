describe('Bubblicious.Location', function() {
  var location;

  describe("new", function() {
    it("should throw an error if it receives an invalid x", function() {
      expect(function() {
        new Bubblicious.Location(NaN, NaN);
      }).toThrow(
        "Bubblicious.Location received invalid x: NaN"
      )
    });
  });

  describe(".add", function() {
    it("should handle a vector", function() {
      location = new Bubblicious.Location(-3.5, 0);
      location2 = location.add($V([1,0]))
      expect(location2.x).toEqual(-2.5);
      expect(location2.y).toEqual(0);
    });

    it("should handle a two element array", function() {
      location = new Bubblicious.Location(-3.5, 0);
      location2 = location.add([1,0])
      expect(location2.x).toEqual(-2.5);
      expect(location2.y).toEqual(0);
      location3 = location.add([0,1])
      expect(location3.x).toEqual(-3.5);
      expect(location3.y).toEqual(1);
    });
  });

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
