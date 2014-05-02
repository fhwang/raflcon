Bubblicious.TransitionState.StartFrame = function(startBubbles, endBubbles) {
  this.startBubbles = startBubbles;
  this.endBubbles = _(endBubbles).clone();
}

Bubblicious.TransitionState.StartFrame.prototype = {
  bubbles: function() {
    return this.onscreenBubbles().concat(this.offscreenBubbles());
  },

  endBubblesWithout: function(location) {
    return _(this.endBubbles).reject(function(bubble) {
      return (bubble.location === location);
    });
  },

  firstRandomElt: function(array) {
    return _(array).sortBy(function() { 
      return Math.random()
    })[0];
  },

  offscreenBubble: function(endBubble) {
    var newBubbleStartingSpeed = 50;
    var location = this.randomAvailableOffscreenLocation();
    var target = endBubble.location;
    var vectorToTarget = location.vectorTo(target);
    var velocity = new Bubblicious.Velocity(
      vectorToTarget.toUnitVector().x(newBubbleStartingSpeed)
    )
    return new Bubblicious.Bubble(
      endBubble.char, location,
      { target: target, enteringScreen: true, velocity: velocity }
    )
  },

  offscreenBubbles: function() {
    // This can't be done without first calling onscreen bubbles, which might
    // claim some of the end bubbles for some of the start bubbles.
    this.onscreenBubbles(); 
    var self = this;
    this._offscreenBubbles = []
    _(this.endBubbles).each(function(endBubble) {
      self._offscreenBubbles.push(self.offscreenBubble(endBubble));
    });
    return this._offscreenBubbles;
  },

  onscreenBubbles: function() {
    if (!this._onscreenBubbles) {
      var self = this;
      this._onscreenBubbles = _(this.startBubbles).map(function(bubble) {
        var newAttrs = {locked: false};
        var target = self.randomEndLocation(bubble.char);
        if (target) {
          newAttrs.target = target;
          self.endBubbles = self.endBubblesWithout(target);
        } else {
          newAttrs.antiTarget = self.randomAntiTarget(bubble.location);
        }
        return bubble.modifiedCopy(newAttrs);
      });
    }
    return this._onscreenBubbles
  },

  randomAntiTarget: function(excludeLocation) {
    var usableStartBubbles = _(this.startBubbles).reject(function(bubble) {
      return (bubble.location === excludeLocation);
    });
    var randomStartBubble = this.firstRandomElt(usableStartBubbles);
    return randomStartBubble.location
  },

  randomAvailableOffscreenLocation: function() {
    var clearSpaceFound = false,
        x, y;
    while (!clearSpaceFound) {
      x = this.randomOffscreenAxisPoint(0);
      y = this.randomOffscreenAxisPoint(1);
      clearSpaceFound = _(this._offscreenBubbles).all(function(b) {
        return (b.location.x !== x || b.location.y !== y)
      });
    }
    return new Bubblicious.Location(x, y);
  },

  randomEndLocation: function(char) {
    var matchingEndBubbles = _(this.endBubbles).select(function(bubble) {
      return (bubble.char === char);
    });
    var randomEndBubble = this.firstRandomElt(matchingEndBubbles);
    if (randomEndBubble) { return randomEndBubble.location }
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
