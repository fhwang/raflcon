Bubblicious.TransitionState.StartFrame = function(
  startBubbleStates, endBubbleStates
) {
  this.startBubbleStates = startBubbleStates;
  this.endBubbleStates = _(endBubbleStates).clone();
}

Bubblicious.TransitionState.StartFrame.prototype = {
  bubbleStates: function() {
    return this.onscreenBubbleStates().concat(this.offscreenBubbleStates());
  },

  endBubbleStatesWithout: function(location) {
    return _(this.endBubbleStates).reject(function(bubble) {
      return (bubble.location === location);
    });
  },

  offscreenBubbleState: function(endBubbleState) {
    var newBubbleStateStartingSpeed = 50;
    var location = this.randomAvailableOffscreenLocation();
    var target = endBubbleState.location;
    var vectorToTarget = location.vectorTo(target);
    var velocity = new Bubblicious.Velocity(
      vectorToTarget.toUnitVector().x(newBubbleStateStartingSpeed)
    )
    return endBubbleState.bubble.state(
      location, { target: target, enteringScreen: true, velocity: velocity }
    )
  },

  offscreenBubbleStates: function() {
    // This can't be done without first calling onscreen bubbles, which might
    // claim some of the end bubbles for some of the start bubbles.
    this.onscreenBubbleStates(); 
    this._offscreenBubbleStates = []
    for (var i = 0; i < this.endBubbleStates.length; i++) {
      var endBubbleState = this.endBubbleStates[i];
      this._offscreenBubbleStates.push(
        this.offscreenBubbleState(endBubbleState)
      );
    }
    return this._offscreenBubbleStates;
  },

  onscreenBubbleStates: function() {
    if (!this._onscreenBubbleStates) {
      var self = this;
      this._onscreenBubbleStates = _(this.startBubbleStates).map(
        function(bubbleState) {
          var newAttrs = self.onscreenBubbleStateAttrs(bubbleState)
          return bubbleState.modifiedCopy(newAttrs);
        }
      );
    }
    return this._onscreenBubbleStates
  },

  onscreenBubbleStateAttrs: function(bubbleState) {
    var newAttrs = {locked: false};
    var target = this.randomEndLocation(bubbleState.bubble.char);
    if (target) {
      newAttrs.target = target;
      this.endBubbleStates = this.endBubbleStatesWithout(target);
    } else {
      newAttrs.antiTarget = this.randomAntiTarget(bubbleState.location);
    }
    return newAttrs;
  },

  randomAntiTarget: function(excludeLocation) {
    var usableStartBubbleStates = _(this.startBubbleStates).reject(
      function(bubble) {
        return (bubble.location === excludeLocation);
      }
    );
    var randomStartBubbleState = Bubblicious.firstRandomElt(
      usableStartBubbleStates
    );
    return randomStartBubbleState.location
  },

  randomAvailableOffscreenLocation: function() {
    var clearSpaceFound = false,
        x, y;
    while (!clearSpaceFound) {
      x = this.randomOffscreenAxisPoint(0);
      y = this.randomOffscreenAxisPoint(1);
      clearSpaceFound = _(this._offscreenBubbleStates).all(function(b) {
        return (b.location.x !== x || b.location.y !== y)
      });
    }
    return new Bubblicious.Location(x, y);
  },

  randomEndLocation: function(char) {
    var matchingEndBubbleStates = []
    for (var i = 0; i < this.endBubbleStates.length; i++) {
      var bubbleState = this.endBubbleStates[i]
      if (bubbleState.bubble.char === char) {
        matchingEndBubbleStates.push(bubbleState)
      }
    }
    var randomEndBubbleState = Bubblicious.firstRandomElt(
      matchingEndBubbleStates
    );
    if (randomEndBubbleState) { return randomEndBubbleState.location }
  },

  randomOffscreenAxisPoint: function(axis) {
    randAmount = Bubblicious.padding * Math.random() * 10; 
    if (Math.random() < 0.5) {
      return Bubblicious.minDimensions()[axis] - randAmount;
    } else {
      return Bubblicious.maxDimensions()[axis] + randAmount;
    }
  },
}
