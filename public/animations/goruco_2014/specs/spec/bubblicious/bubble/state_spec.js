describe('Bubblicious.Layout', function() {
  var layout;

  describe(".bubbleStates", function() {
    var bubbleStates;

    beforeEach(function() {
      Bubblicious.rect = [10, 10]
      lines = ["Jane Doe"]
      layout = new Bubblicious.Layout(lines)
      bubbleStates = layout.bubbleStates
    });

    it("upcases all names", function() {
      letters = ['J', 'A', 'N', 'E', 'D', 'O', 'E']
      _(letters).each(function(letter) {
        found = _(bubbleStates).any(function(bubbleState) {
          return bubbleState.bubble.char === letter
        });
        expect(found).toBeTruthy()
      });
    });

    it("doesn't create empty bubbles", function() {
      emptyBubble = _(bubbleStates).any(function(bubbleState) {
        return !bubbleState.bubble.char
      });
      expect(emptyBubble).toBeFalsy()
    });
  });
});
