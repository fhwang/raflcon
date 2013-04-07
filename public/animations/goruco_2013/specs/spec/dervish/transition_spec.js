describe('Dervish.Transition', function() {
  var transition;

  beforeEach(function() {
    Dervish.rect = [3,2]
  });

  describe(".start in a basic situation", function() {
    beforeEach(function() {
      sourceLetters = new Dervish.Goal(["SAM", "KEN"]).letters();
      dervish = {letters: sourceLetters}
      transition = new Dervish.Transition(dervish, ["AMY", "FOX"])
      transition.start();
    });

    it("copies over connections from the end state", function() {
      connections = transition.connections;
      expect(connections.length).toEqual(7)
      links = ['AM', 'MY', 'AF', 'MO', 'YX', 'FO', 'OX'];
      _(links).each(function(link) {
        matchingConnection = _(connections).find(function(conn) {
          return (
            (conn.letters[0].char === link[0] &&
             conn.letters[1].char === link[1]) ||
             (conn.letters[1].char === link[0] &&
              conn.letters[0].char === link[1])
          )
        });
        expect(matchingConnection).toBeDefined(
          "Can't find connection for '" + link + "'"
        )
      });
      _(connections).each(function(connection) {
        _(connection.letters).each(function(letter) {
          expect(dervish.letters).toContain(letter);
        });
      });
    });

    it('assigns anti-targets to letters that should leave', function() {
      letterS = _(dervish.letters).find(function(l) { return l.char === 'S' });
      expect(letterS).toBeDefined();
      expect(letterS.antiTarget).toBeDefined();
      expect(letterS.isLocked()).toBeFalsy();
    });
  });

  it(".start only assigns an existing letter to another location at most once", function() {
    sourceLetters = new Dervish.Goal(['JIM', 'JOE']).letters();
    dervish = {letters: sourceLetters}
    transition = new Dervish.Transition(dervish, ['JIM', 'JIM'])
    transition.start();
    letters = dervish.letters
    startingLocation_1_0 = _(letters).filter(function(letter) {
      return (letter.location.x === 1 && letter.location.y === 1);
    });
    expect(startingLocation_1_0.length).toEqual(1);
  }); 
});
