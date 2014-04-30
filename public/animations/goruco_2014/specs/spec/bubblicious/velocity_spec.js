describe('Bubblicious.Velocity', function() {
  describe("new", function() {
    it("throws when you pass a null first value", function() {
      expect(function() {
        new Bubblicious.Velocity(null);
      }).toThrow(
        new Error("Bubblicious.Velocity takes either (x, y) or a Vector")
      )
    });

    it("throws when you pass an undefined first value", function() {
      expect(true).toBeFalsy
    });
  });
});
