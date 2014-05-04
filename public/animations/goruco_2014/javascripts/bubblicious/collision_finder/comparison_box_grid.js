Bubblicious.CollisionFinder.ComparisonBoxGrid = function(bubbleStates) {
  this.bubbleStates = bubbleStates
  this.comparisonBoxDivisor = Bubblicious.CollisionFinder.comparisonBoxDivisor
}

Bubblicious.CollisionFinder.ComparisonBoxGrid.prototype = {
  bounds: function(axisNumber, i) {
    var boundingBox = Bubblicious.boundingBox();
    if (!this._boxDimensions) {
      this._origin = [
        boundingBox.axis(0).bounds[0], boundingBox.axis(1).bounds[0]
      ]
      this._boxDimensions = [
        boundingBox.axis(0).magnitude() / this.comparisonBoxDivisor,
        boundingBox.axis(1).magnitude() / this.comparisonBoxDivisor
      ]
    }
    min = this._origin[axisNumber] + i * this._boxDimensions[axisNumber];
    max = this._origin[axisNumber] + (i + 1) * this._boxDimensions[axisNumber] + 1;
    return [min, max]
  },

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
    return new Bubblicious.CollisionFinder.ComparisonBox(
      this.bounds(0, i), this.bounds(1, j)
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
