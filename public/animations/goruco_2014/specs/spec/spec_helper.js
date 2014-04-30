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
    bubble = { char: char, location: {x: x, y: y} }
    if (elements = opts.velocity) {
      bubble.velocity = Vector.create(elements)
    }
    if (typeof opts.locked !== 'undefined') {
      bubble.locked = opts.locked;
    }
    if (coords = opts.target) {
      bubble.target = {x: coords[0], y: coords[1]}
    }
    return bubble;
  }
});

