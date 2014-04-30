beforeEach(function() {
  this.addMatchers({
    toBeCloseToElements: function(expected, delta) {
      if (typeof delta === 'undefined') {
        throw "toBeCloseToElements: delta must be defined"
      }
      var actualElements;
      if (this.actual.elements) {
        if (typeof this.actual.elements === 'function') {
          actualElements = this.actual.elements();
        } else {
          actualElements = this.actual.elements
        }
      } else {
        actualElements = this.actual
      }
      return Math.abs(actualElements[0]-expected[0]) < delta &&
             Math.abs(actualElements[1]-expected[1]) < delta
    },

    toBeGreaterThanOrEqualTo: function(expected) {
      return (this.actual >= expected);
    },

    toHaveLocation: function(expectedX, expectedY, delta) {
      var location = this.actual.location;
      if (typeof delta === 'undefined') delta = 0.0001;
      return Math.abs(location.x-expectedX) < delta &&
             Math.abs(location.y-expectedY) < delta;
    }
  });

  newBubble = function(char, x, y, opts) {
    if (!opts) opts = {};
    var velocity, locked, target;
    if (elements = opts.velocity) velocity = Vector.create(elements)
    if (typeof opts.locked !== 'undefined') locked = opts.locked;
    if (coords = opts.target) {
      target = new Bubblicious.Location(coords[0], coords[1])
    }
    return new Bubblicious.Bubble(
      char, 
      new Bubblicious.Location(x, y), 
      {velocity: velocity, locked: locked, target: target}
    )
  }
});

