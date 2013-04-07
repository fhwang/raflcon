describe('Dervish', function() {
  describe('.letterDiameter', function() {
    beforeEach(function() {
      Dervish._letterDiameter = null;
      Dervish.rect = [3,2]
      Dervish.boxPadding = 2;
      Dervish.letterMargin = 0.5;
    });

    it("works width-constrained", function() {
      Dervish.canvasHeight = 1000;
      Dervish.canvasWidth = 1000;
      expect(Dervish.letterDiameter()).toEqual(125)
    });

    it("works height-constrained", function() {
      Dervish.canvasHeight = 500;
      Dervish.canvasWidth = 1000;
      expect(Dervish.letterDiameter()).toEqual(76);
    });
  });
});

describe('Dervish.BoundingBox', function() {
  var boundingBox;

  describe('4x3, padding 7, spacing 2.1', function() {
    beforeEach(function() {
      Dervish.rect = [4,3]
      Dervish.boxPadding = 7;
      Dervish.letterMargin = 2.1
      boundingBox = new Dervish.BoundingBox();
    });

    it("doesn't think a 1-unit wide rect centered on -7.8, -6.0 is partially contained", function() {
      rect = new Dervish.Rect(-8.3, -6.5, 1, 1);
      expect(boundingBox.partiallyContains(rect)).toBeTruthy()
    });
  });
});

describe('Dervish.Connection', function() {
  var connection;

  describe('#accelerateLettersTogether', function() {
    beforeEach(function() {
      Dervish.letterMargin = 2.1
    });

    it("splits the magnitude between two moving letters", function() {
      letter1 = new Dervish.Letter('S', 0, 0)
      letter1.lockedAt = null;
      expect(letter1.velocity.vector.modulus()).toEqual(0)
      letter2 = new Dervish.Letter('A', 4.1, 0)
      letter2.lockedAt = null;
      expect(letter2.velocity.vector.modulus()).toEqual(0)
      connection = new Dervish.Connection(letter1, letter2)
      connection.accelerateLettersTogether(1, 1)
      elements1 = letter1.velocity.vector.elements;
      expect(elements1[0]).toBeCloseTo(50);
      expect(elements1[1]).toBeCloseTo(0);
      elements2 = letter2.velocity.vector.elements;
      expect(elements2[0]).toBeCloseTo(-50);
      expect(elements2[1]).toBeCloseTo(0);
    });

    it("assigns the magnitude to one if the other is locked", function() {
      letter1 = new Dervish.Letter('S', 0, 0)
      expect(letter1.velocity.vector.modulus()).toEqual(0)
      letter2 = new Dervish.Letter('A', 4.1, 0)
      letter2.lockedAt = null;
      expect(letter2.velocity.vector.modulus()).toEqual(0)
      connection = new Dervish.Connection(letter1, letter2)
      connection.accelerateLettersTogether(1, 1)
      elements1 = letter1.velocity.vector.elements;
      expect(elements1[0]).toBeCloseTo(0);
      expect(elements1[1]).toBeCloseTo(0);
      elements2 = letter2.velocity.vector.elements;
      expect(elements2[0]).toBeCloseTo(-100);
      expect(elements2[1]).toBeCloseTo(0);
    });

    it("exerts no force if the distance is less than the length at rest", function() {
      letter1 = new Dervish.Letter('S', 0, 0)
      letter1.lockedAt = null;
      expect(letter1.velocity.vector.modulus()).toEqual(0)
      letter2 = new Dervish.Letter('A', 3.1, 0)
      letter2.lockedAt = null;
      expect(letter2.velocity.vector.modulus()).toEqual(0)
      connection = new Dervish.Connection(letter1, letter2)
      connection.accelerateLettersTogether(1, 1)
      elements1 = letter1.velocity.vector.elements;
      expect(elements1[0]).toBeCloseTo(0);
      expect(elements1[1]).toBeCloseTo(0);
      elements2 = letter2.velocity.vector.elements;
      expect(elements2[0]).toBeCloseTo(0);
      expect(elements2[1]).toBeCloseTo(0);
    });
  });
});

describe('Dervish.Location', function() {
  var location;

  describe('px', function() {
    beforeEach(function() {
      Dervish.canvasWidth = 1000
      Dervish.rect = [3,2]
      Dervish.letterMargin = 0.5;
      Dervish.boxPadding = 2;
      Dervish._letterDiameter = 50;
    })

    it('horizontally centers for x = 0', function() {
      location = new Dervish.Location(0,0);
      expect(location.px()).toEqual(400)
    });

    it('horizontally centers for x = 1', function() {
      location = new Dervish.Location(1,1);
      expect(location.px()).toEqual(475)
    });

    it('horizontally centers for x = 2', function() {
      location = new Dervish.Location(2,2);
      expect(location.px()).toEqual(550)
    });
  });

  describe('py', function() {
    beforeEach(function() {
      Dervish.canvasHeight = 1000
      Dervish.rect = [3,2]
      Dervish.letterMargin = 0.5;
      Dervish.boxPadding = 2;
      Dervish._letterDiameter = 50;
    })

    it('vertically centers for y = 0', function() {
      location = new Dervish.Location(0,0)
      expect(location.py()).toEqual(562.5)
    });

    it('vertically centers for y = 1', function() {
      location = new Dervish.Location(1,1)
      expect(location.py()).toEqual(487.5)
    });
  });
});

describe('Dervish.Rect', function() {
  var rect;

  describe('allCorners', function() {
    it("returns four corners", function() {
      rect = new Dervish.Rect(-9.3, -6.5, 1, 1);
      corners = rect.allCorners()
      expect(corners.length).toEqual(4)
      expectedPairs = [[-9.3, -6.5], [-9.3, -5.5], [-8.3, -6.5], [-8.3, -5.5]]
      _(expectedPairs).each(function(expectedPair) {
        match = _(corners).find(function(corner) {
          return corner.x === expectedPair[0] && corner.y === expectedPair[1]
        });
        expect(match).toBeDefined()
      });
    });
  });
});

