Bubblicious.Location = function(x, y) {
  this.x = x;
  this.y = y;
};

Bubblicious.Location.prototype = {
  vectorTo: function(otherLoc) {
    if (typeof otherLoc.x !== 'number' || typeof otherLoc.y !== 'number') {
      return otherLoc.vectorTo().x(-1);
    } else {
      return Vector.create([otherLoc.x - this.x, otherLoc.y - this.y]);
    }
  }
}
