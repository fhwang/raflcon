Bubblicious.TransitionState.StartFrame = function(startBubbles, endBubbles) {
  this.startBubbles = startBubbles;
  this.endBubbles = _(endBubbles).clone();
}

Bubblicious.TransitionState.StartFrame.prototype = {
  bubbles: function() {
    return this.onscreenBubbles().concat(this.offscreenBubbles());
  },

  deleteEndBubbleWithLocation: function(location) {
    this.endBubbles = _(this.endBubbles).reject(function(bubble) {
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
    var self = this;
    this._offscreenBubbles = []
    _(this.endBubbles).each(function(endBubble) {
      self._offscreenBubbles.push(self.offscreenBubble(endBubble));
    });
    return this._offscreenBubbles;
  },

  onscreenBubbles: function() {
    var self = this, 
        newAttrs = {};
    return _(this.startBubbles).map(function(bubble) {
      var target = self.randomEndLocation(bubble.char);
      if (target) {
        newAttrs.target = target;
        self.deleteEndBubbleWithLocation(target);
      } else {
        newAttrs.antiTarget = self.randomAntiTarget(bubble.location);
      }
      return bubble.modifiedCopy(newAttrs);
    });
  },

  randomAntiTarget: function(excludeLocation) {
    var usableStartBubbles = _(this.startBubbles).reject(function(bubble) {
      return (bubble.location === excludeLocation);
    });
    var randomStartBubble = this.firstRandomElt(usableStartBubbles);
    return { x: randomStartBubble.location.x, y: randomStartBubble.location.y }
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
    if (randomEndBubble) {
      return { x: randomEndBubble.location.x, y: randomEndBubble.location.y }
    }
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
