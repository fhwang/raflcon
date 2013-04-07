Dervish.BoundingBox = function() {
  this.initialize();
};

Dervish.BoundingBox.prototype = {
  initialize: function() { },

  axes: function() {
    if (!this._axes) {
      this._axes = [
        new Dervish.BoundingBox.Axis(0),
        new Dervish.BoundingBox.Axis(1)
      ]
    }
    return this._axes;
  },

  partiallyContains: function(locationOrRect) {
    var self = this;
    if (locationOrRect.allCorners) {
      rect = locationOrRect
      return _(rect.allCorners()).any(function(corner) {
        return self.partiallyContains(corner)
      });
    } else {
      _location = locationOrRect
      return _(this.axes()).all(function(axis) {
        return axis.contains(_location);
      });
    }
  }
}

// Axis 0 is X, axis 1 is Y
Dervish.BoundingBox.Axis = function(number) {
  this.initialize(number);
};

Dervish.BoundingBox.Axis.prototype = {
  initialize: function(number) {
    this.number = number;
    this.bounds = [
      0 - Dervish.boxPadding, Dervish.maxDimensions()[number] - 1
    ];
  },

  outOfBoundsDirection: function(location) {
    var point = this.pointFrom(location);
    if (point < this.bounds[0]) {
      return point - this.bounds[0]
    } else if (point > this.bounds[1]) {
      return point - this.bounds[1]
    } else {
      return null;
    }
  },

  contains: function(location) {
    return Math.abs(this.outOfBoundsDirection(location)) < 1;
  },

  pointFrom: function(location) {
    var point, location;
    if (this.number === 0) {
      return location.x;
    } else {
      return location.y;
    }
  },
}
