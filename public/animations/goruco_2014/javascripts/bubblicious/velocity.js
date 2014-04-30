Bubblicious.Velocity = function(first, second) {
  if (typeof second === 'undefined') {
    this._vector = first;
  } else {
    this._vector = Vector.create([first, second]);
  }
};

Bubblicious.Velocity.prototype = {
}
