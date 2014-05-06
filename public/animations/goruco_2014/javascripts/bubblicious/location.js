Bubblicious.Location = function(x, y) {
  if (isNaN(x) || x === null) {
    throw "Bubblicious.Location received invalid x: " + x;
  }
  if (isNaN(y) || y === null) {
    throw "Bubblicious.Location received invalid y: " + y;
  }
  this.x = x;
  this.y = y;
  Object.freeze(this);
};

Bubblicious.Location.prototype = {
  add: function(otherLoc) {
    if (typeof otherLoc[0] === 'number') {
      elements = otherLoc
    } else {
      elements = otherLoc.elements
    }
    return new Bubblicious.Location(
      this.x + elements[0], this.y + elements[1]
    );
  },

  coords: function() {
    return [this.x, this.y]
  },

  eql: function(otherLoc) {
    return this.x === otherLoc.x && this.y === otherLoc.y
  },

  px: function() {
    return (this.x + Bubblicious.padding[0] + 0.5) * Bubblicious.bubblePDiameter();
  },

  py: function() {
    return(
      Bubblicious.canvasHeight() -
      ((this.y + Bubblicious.padding[1] + 0.5) * Bubblicious.bubblePDiameter())
    )
  },

  vectorTo: function(otherLoc) {
    if (typeof otherLoc.x !== 'number' || typeof otherLoc.y !== 'number') {
      return otherLoc.vectorTo().x(-1);
    } else {
      return Vector.create([otherLoc.x - this.x, otherLoc.y - this.y]);
    }
  }
}
