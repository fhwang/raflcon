Bubblicious.CollisionFinder.ComparisonBoxGrid = function(bubbleStates) {
  this.bubbleStates = bubbleStates
  this.comparisonBoxDivisor = Bubblicious.CollisionFinder.comparisonBoxDivisor
  this.bounds = this.buildBounds()
}

Bubblicious.CollisionFinder.ComparisonBoxGrid.prototype = {
  buildBounds: function() {
    var result = []
    var boundingBox = Bubblicious.boundingBox();
    var origin = [
      boundingBox.axis(0).bounds[0], boundingBox.axis(1).bounds[0]
    ]
    var boxDimensions = [
      boundingBox.axis(0).magnitude() / this.comparisonBoxDivisor,
      boundingBox.axis(1).magnitude() / this.comparisonBoxDivisor
    ]
    for (j = 0; j < this.comparisonBoxDivisor; j++) {
      var row = []
      result.push(row);
      for (i = 0; i < this.comparisonBoxDivisor; i++) {
        var coords = [i,j]
        var bounds = []
        for (var axisNumber = 0; axisNumber < 2; axisNumber++) {
          min = origin[axisNumber] + coords[axisNumber] * 
            boxDimensions[axisNumber];
          max = origin[axisNumber] + (coords[axisNumber] + 1) * 
            boxDimensions[axisNumber] + 1;
          bounds.push([min, max])
        }
        row.push(bounds)
      }
    }
    return result;
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
    var xBounds = this.bounds[i][j][0]
    var yBounds = this.bounds[i][j][1]
    return new Bubblicious.CollisionFinder.ComparisonBox(xBounds, yBounds)
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
