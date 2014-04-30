Bubblicious.Location = function(x, y) {
  this.x = x;
  this.y = y;
};

Bubblicious.Location.prototype = {
  add: function(otherLoc) {
    if (otherLoc[0]) {
      elements = otherLoc
    } else {
      elements = otherLoc.elements
    }
    return new Bubblicious.Location(
      this.x + elements[0], this.y + elements[1]
    );
  },

  coords: function(location) {
    return [location.x, location.y]
  },

  vectorTo: function(otherLoc) {
    if (typeof otherLoc.x !== 'number' || typeof otherLoc.y !== 'number') {
      return otherLoc.vectorTo().x(-1);
    } else {
      return Vector.create([otherLoc.x - this.x, otherLoc.y - this.y]);
    }
  }
}
