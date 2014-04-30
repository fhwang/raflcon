Bubblicious.Collision = {
  elasticity: 0.9
};

Bubblicious.Collision.Correction = function(bubbleKey, locationDelta, velocityDelta) {
  // bubbleKey is only used so clients can match corrections to a specific key
  // in isMatch below
  this.bubbleKey = bubbleKey
  this.locationDelta = locationDelta;
  this.velocityDelta = velocityDelta;
}

Bubblicious.Collision.Correction.prototype = {
  apply: function(bubble) {
    var location = bubble.location.add(this.locationDelta);
    velocity = bubble.velocity.add(this.velocityDelta);
    return bubble.modifiedCopy(
      { location: location, velocity: velocity }
    )
  },

  isFieldMatch: function(bubble, field) {
    return (!bubble[field] && !this.bubbleKey[field]) || (
      bubble[field].x == this.bubbleKey[field].x &&
      bubble[field].y == this.bubbleKey[field].y
    )
  },

  isMatch: function(bubble) {
    return this.isFieldMatch(bubble, 'target') && 
      this.isFieldMatch(bubble, 'antiTarget');
  }
}

