Bubblicious.Velocity = function(first, second) {
  if (first === null) {
    throw "Bubblicious.Velocity takes either (x, y) or a Vector"
  }
  if (typeof second === 'undefined') {
    this._vector = first;
  } else {
    this._vector = Vector.create([first, second]);
  }
  Object.freeze(this);
};

Bubblicious.Velocity.prototype = {
  add: function(arg) {
    vector = arg.vector ? arg.vector() : arg;
    newVector = this._vector.add(vector)
    return new Bubblicious.Velocity(newVector);
  },

  elements: function() {
    return this._vector.elements;
  },

  subtract: function(arg) {
    vector = arg.vector ? arg.vector() : arg
    newVector = this._vector.subtract(vector)
    return new Bubblicious.Velocity(newVector);
  },

  vector: function() {
    return this._vector;
  },

  x: function(k) {
    return new Bubblicious.Velocity(this._vector.x(k));
  }
}
