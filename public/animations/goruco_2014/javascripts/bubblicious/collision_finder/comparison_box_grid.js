Bubblicious.CollisionFinder.ComparisonBoxGrid = function(bubbleStates) {
  this.bubbleStates = bubbleStates
  this.comparisonBoxDivisor = Bubblicious.CollisionFinder.comparisonBoxDivisor
}

Bubblicious.CollisionFinder.ComparisonBoxGrid.prototype = {
  collisions: function() {
    return _(this.comparisonBoxes()).chain().collect(function(comparisonBox) {
      return comparisonBox.collisions()
    }).flatten().value();
  },

  comparisonBoxes: function() {
    result = this.emptyComparisonBoxes();
    for (var i = 0; i < this.bubbleStates.length; i++) {
      var bubbleState = this.bubbleStates[i];
      for (var j = 0; j < result.length; j++) {
        var comparisonBox = result[j];
        if (comparisonBox.shouldContain(bubbleState)) {
          comparisonBox.add(bubbleState);
        }
      }
    }
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
}
