Bubblicious.Collision.TwoBubble = function(bubbles) {
  this.bubbles = bubbles
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
      this._normalVector = this.bubbles[0].vectorTo(this.bubbles[1]);
    }
    return this._normalVector;
  },

  overlapDistance: function() {
    if (!this._overlapDistance) {
      this._overlapDistance = this.bubbles[0].overlapDistance(this.bubbles[1]);
    }
    return this._overlapDistance
  },

  velocityCorrections: function() {
    return new Bubblicious.Collision.TwoBubble.VelocityCorrector(this).run();
  }
}, Bubblicious.Collision.prototype);
