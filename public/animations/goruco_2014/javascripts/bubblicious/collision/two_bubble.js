Bubblicious.Collision.TwoBubble = function(bubbleStates) {
  this.bubbleStates = bubbleStates
}

Bubblicious.Collision.TwoBubble.prototype = _.extend({
  corrections: function() {
    return this.locationCorrections().concat(this.velocityCorrections());
  },

  locationCorrections: function() {
    return new Bubblicious.Collision.TwoBubble.LocationCorrector(
      this
    ).run()
  },

  normalVector: function() {
    if (!this._normalVector) {
      this._normalVector = this.bubbleStates[0].vectorTo(this.bubbleStates[1]);
    }
    return this._normalVector;
  },

  overlapDistance: function() {
    if (!this._overlapDistance) {
      this._overlapDistance = this.bubbleStates[0].overlapDistance(
        this.bubbleStates[1]
      );
    }
    return this._overlapDistance
  },

  velocityCorrections: function() {
    return new Bubblicious.Collision.TwoBubble.VelocityCorrector(this).run();
  }
}, Bubblicious.Collision.prototype);
