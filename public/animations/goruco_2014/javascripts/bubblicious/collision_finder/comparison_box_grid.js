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
      containers = this.containingComparisonBoxes(result, bubbleState.location)
      for (var j = 0; j < containers.length; j++) {
        var container = containers[j];
        container.add(bubbleState);
      }
    }
    return _(result).flatten();
  },

  containingComparisonBoxes: function(allBoxes, location) {
    var boxXArray = [],
        boxYArray = []
    var topRow = this.bounds[0];
    for (var x = 0; x < topRow.length; x++) {
      xBounds = topRow[x][0]
      if (xBounds[0] <= location.x && xBounds[1] > location.x) {
        boxXArray.push(x)
      }
    }
    for (var y = 0; y < this.bounds.length; y++) {
      yBounds = this.bounds[y][0][1]
      if (yBounds[0] <= location.y && yBounds[1] > location.y) {
        boxYArray.push(y)
      }
    }
    var result = []
    for (var xIdx = 0; xIdx < boxXArray.length; xIdx++) {
      for (var yIdx = 0; yIdx < boxYArray.length; yIdx++) {
        var x = boxXArray[xIdx]
        var y = boxYArray[yIdx]
        result.push(allBoxes[x][y])
      }
    }
    return result
  },

  emptyComparisonBox: function(i,j) {
    var xBounds = this.bounds[i][j][0]
    var yBounds = this.bounds[i][j][1]
    return new Bubblicious.CollisionFinder.ComparisonBox(xBounds, yBounds)
  },
 
  emptyComparisonBoxes: function() {
    var result = [];
    for (j = 0; j < this.comparisonBoxDivisor; j++) {
      row = []
      result.push(row);
      for (i = 0; i < this.comparisonBoxDivisor; i++) {
        row.push(this.emptyComparisonBox(i,j))
      }
    }
    return result;
  },
}
