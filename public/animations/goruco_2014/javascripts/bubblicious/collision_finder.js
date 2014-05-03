Bubblicious.CollisionFinder = function(bubbleStates) {
  this.bubbleStates = bubbleStates;
};

Bubblicious.CollisionFinder.prototype = {
  comparisonBoxDivisor: 4,

  boundingBoxCollision: function(bubbleState) {
    if (bubbleState.target && !bubbleState.enteringScreen) {
      if (!Bubblicious.boundingBox().fullyContains(bubbleState)) {
        return new Bubblicious.Collision.BoundingBox(bubbleState);
      }
    }
  },

  boundingBoxCollisions: function() {
    var self = this;
    return _(this.bubbleStates).chain().collect(function(bubbleState) {
      return self.boundingBoxCollision(bubbleState);
    }).compact().value();
  },

  comparisonBoxes: function() {
    result = this.emptyComparisonBoxes();
    _(this.bubbleStates).each(function(bubbleState) {
      _(result).each(function(comparisonBox) {
        if (comparisonBox.shouldContain(bubbleState)) {
          comparisonBox.add(bubbleState);
        }
      });
    });
    return result;
  },

  emptyComparisonBox: function(i,j) {
    if (!this._xAxis) {
      boundingBox = Bubblicious.boundingBox();
      this._xAxis = boundingBox.axis(0);
      this._yAxis = boundingBox.axis(1);
      this._width = this._xAxis.magnitude() / this.comparisonBoxDivisor;
      this._height = this._yAxis.magnitude() / this.comparisonBoxDivisor;
    }
    x0 = this._xAxis.bounds[0] + i * this._width;
    x1 = this._xAxis.bounds[0] + (i + 1) * this._width + 1;
    y0 = this._yAxis.bounds[0] + j * this._height;
    y1 = this._yAxis.bounds[0] + (j + 1) * this._height + 1;
    return new Bubblicious.CollisionFinder.ComparisonBox(
      [x0, x1], [y0, y1]
    )
  },

  emptyComparisonBoxes: function() {
    var result = [];
    for (i = 0; i < this.comparisonBoxDivisor; i++) {
      for (j = 0; j < this.comparisonBoxDivisor; j++) {
        result.push(this.emptyComparisonBox(i,j))
      }
    }
    return result;
  },

  result: function() {
    return this.boundingBoxCollisions().concat(this.twoBubbleCollisions());
  },

  twoBubbleCollisions: function() {
    comparisonBoxes = this.comparisonBoxes();
    return _(comparisonBoxes).chain().collect(function(comparisonBox) {
      return comparisonBox.collisions()
    }).flatten().value();
  }
}
