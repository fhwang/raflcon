Bubblicious.TransitionState.Frame.CollisionFinder = function(bubbleStates) {
  this.bubbleStates = bubbleStates;
};

Bubblicious.TransitionState.Frame.CollisionFinder.prototype = {
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

  emptyComparisonBoxes: function() {
    var divisor = 4, 
        result = [];
    boundingBox = Bubblicious.boundingBox();
    xAxis = boundingBox.axis(0);
    yAxis = boundingBox.axis(1);
    width = xAxis.magnitude() / divisor;
    height = yAxis.magnitude() / divisor;
    for (i = 0; i < divisor; i++) {
      for (j = 0; j < divisor; j++) {
        x0 = xAxis.bounds[0] + i * width;
        x1 = xAxis.bounds[0] + (i + 1) * width + 1;
        y0 = yAxis.bounds[0] + j * height;
        y1 = yAxis.bounds[0] + (j + 1) * height + 1;
        box = new Bubblicious.TransitionState.Frame.CollisionFinder.ComparisonBox(
          [x0, x1], [y0, y1]
        )
        result.push(box)
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

Bubblicious.TransitionState.Frame.CollisionFinder.ComparisonBox = function(xBounds, yBounds) {
  this.xBounds = xBounds;
  this.yBounds = yBounds;
  this.bubbleStates = []
}

Bubblicious.TransitionState.Frame.CollisionFinder.ComparisonBox.prototype = {
  add: function(bubbleState) {
    this.bubbleStates.push(bubbleState)
  },

  collisions: function() {
    var self = this,
        bubbleState1, bubbleState2;
    result = [];
    for (var i = 0; i < this.bubbleStates.length; i++) {
      bubbleState1 = this.bubbleStates[i];
      if (bubbleState1.isOnscreen()) {
        for (var j = i + 1; j < this.bubbleStates.length; j++) {
          bubbleState2 = this.bubbleStates[j];
          if (!bubbleState1.locked || !bubbleState2.locked) {
            if (bubbleState2.isOnscreen()) {
              if (bubbleState1.overlaps(bubbleState2)) {
                result.push(
                  new Bubblicious.Collision.TwoBubble(
                    [bubbleState1, bubbleState2]
                  )
                );
              }
            }
          }
        }
      }
    }
    return result
  },

  shouldContain: function(bubbleState) {
    var location = bubbleState.location
    return (
      this.xBounds[0] <= location.x && this.xBounds[1] > location.x &&
      this.yBounds[0] <= location.y && this.yBounds[1] > location.y
    )
  }
}
