Bubblicious.BoundingBox = function() {
  this.initialize();
};

Bubblicious.BoundingBox.prototype = {
  initialize: function() { },

  axes: function() {
    if (!this._axes) {
      this._axes = [
        new Bubblicious.BoundingBox.Axis(0),
        new Bubblicious.BoundingBox.Axis(1)
      ]
    }
    return this._axes;
  },

  axis: function(number) {
    return this.axes()[number];
  },

  fullyContains: function(bubble) {
    return _(this.axes()).all(function(axis) {
      return axis.fullyContains(bubble);
    });
  },

  partiallyContains: function(bubble) {
    return _(this.axes()).all(function(axis) {
      return axis.partiallyContains(bubble);
    });
  }
};

// Axis 0 is X, axis 1 is Y
Bubblicious.BoundingBox.Axis = function(number) {
  this.initialize(number);
};

Bubblicious.BoundingBox.Axis.prototype = {
  initialize: function(number) {
    this.number = number;
    this.bounds = [
      0 - Bubblicious.padding[number], Bubblicious.maxDimensions()[number] - 1
    ];
  },

  fullyContains: function(bubbleOrLocation) {
    return this.outOfBoundsDirection(bubbleOrLocation) === null
  },

  magnitude: function() {
    return this.bounds[1] - this.bounds[0];
  },

  normal: function(velocity) {
    if (this.number === 0) {
      return $V([velocity.elements()[0], 0])
    } else {
      return $V([0, velocity.elements()[1]])
    }
  },

  outOfBoundsDirection: function(bubbleOrLocation) {
    var point = this.pointFromBubble(bubbleOrLocation);
    if (point < this.bounds[0]) {
      return point - this.bounds[0]
    } else if (point > this.bounds[1]) {
      return point - this.bounds[1]
    } else {
      return null;
    }
  },

  partiallyContains: function(bubbleOrLocation) {
    return Math.abs(this.outOfBoundsDirection(bubbleOrLocation)) < 1;
  },

  pointFromBubble: function(bubbleOrLocation) {
    var point, location;
    if (bubbleOrLocation.location) {
      location = bubbleOrLocation.location
    } else {
      location = bubbleOrLocation;
    }
    if (this.number === 0) {
      return location.x;
    } else {
      return location.y;
    }
  },

  tangent: function(velocity) {
    var vector = velocity.vector();
    if (this.number === 0) {
      return $V([0, vector.elements[1]])
    } else {
      return $V([vector.elements[0], 0])
    }
  }
};
