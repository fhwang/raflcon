beforeEach(function() {
  jasmine.addMatchers({
    toBeCloseToElements: function() {
      return {
        compare: function(actual, expected, delta) {
          if (typeof delta === 'undefined') {
            throw "toBeCloseToElements: delta must be defined"
          }
          var actualElements;
          if (actual.elements) {
            if (typeof actual.elements === 'function') {
              actualElements = actual.elements();
            } else {
              actualElements = actual.elements
            }
          } else {
            actualElements = actual
          }
          return {
            pass: (
              Math.abs(actualElements[0]-expected[0]) < delta &&
              Math.abs(actualElements[1]-expected[1]) < delta
            )
          }
        }
      }
    },

    toBeGreaterThanOrEqualTo: function() {
      return {
        compare: function(actual, expected) {
          return {pass: (actual >= expected)};
        }
      }
    },

    toHaveLocation: function() {
      return {
        compare: function(actual, expectedX, expectedY, delta) {
          var location = actual.location;
          if (typeof delta === 'undefined') delta = 0.0001;
          var result = {}
          return {
            pass: (
              Math.abs(location.x-expectedX) < delta &&
              Math.abs(location.y-expectedY) < delta
            )
          }
        }
      }
    }
  });

});

window.newBubble = function(char, x, y, opts) {
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
