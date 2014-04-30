beforeEach(function() {
  jasmine.addMatchers({
    toBeClose: function() {
      return {
        compare: function(actual, expected, delta) {
          if (typeof delta === 'undefined') delta = 0.0001;
          return {
            pass: Math.abs(actual - expected) < delta
          }
        }
      }
    },

    toBeCloseToElements: function() {
      return {
        compare: function(actual, expected, delta) {
          if (typeof delta === 'undefined') delta = 0.0001;
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

window.firstBubbleStateMatch = function(bubbleStates, char) {
  return _(bubbleStates).find(function(b) { return b.bubble.char === char });
};

window.newBubbleState = function(char, x, y, opts) {
  if (!opts) opts = {};
  var velocity, locked, target, antiTarget;
  if (elements = opts.velocity) {
    velocity = new Bubblicious.Velocity(elements[0], elements[1]);
  }
  if (typeof opts.locked !== 'undefined') locked = opts.locked;
  if (coords = opts.target) {
    target = new Bubblicious.Location(coords[0], coords[1])
  }
  if (coords = opts.antiTarget) {
    antiTarget = new Bubblicious.Location(coords[0], coords[1])
  }
  bubble = new Bubblicious.Bubble(char)
  return bubble.state(
    new Bubblicious.Location(x, y), 
    {
      velocity: velocity,
      locked: locked,
      target: target,
      antiTarget: antiTarget
    }
  )
}
