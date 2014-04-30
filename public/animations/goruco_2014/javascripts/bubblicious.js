Bubblicious = function(lines) {
}

_(function() {
  this.rect = [3,2];
  this.canvasWidth = 850;
  this.padding = 7;
  this.spacing = 2.1; 

  this.boundingBox = function() {
    if (!this._boundingBox) {
      this._boundingBox = new Bubblicious.BoundingBox();
    }
    return this._boundingBox;
  };

  this.maxDimensions = function() {
    if (!this._maxDimensions) {
      this._maxDimensions = [
        this.rect[0] + ((this.rect[0]-1) * this.spacing) + this.padding,
        this.rect[1] + ((this.rect[1]-1) * this.spacing) + this.padding
      ]
    }
    return this._maxDimensions
  }
  
}).bind(Bubblicious)();
