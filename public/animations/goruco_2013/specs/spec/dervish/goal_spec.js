describe('Dervish.Goal', function() {
  var goal;

  describe(".connections", function() {
    beforeEach(function() {
      Dervish.rect = [3,2]
    });

    it("returns connections for all letters", function() {
      goal = new Dervish.Goal(['AMY', 'FOX']);
      connections = goal.connections;
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
    });
  });

  describe(".letterGrid", function() {
    beforeEach(function() {
      Dervish.rect = [10,3]
    });

    it("randomly pads lines to meet the max", function() {
      lines = [
        "JOHN DOE", "BILL JONES", "A B"
      ]
      goal = new Dervish.Goal(lines)
      leadingSpaces = _(goal.letterGrid).select(function(line) {
        return (line[0].char === ' ');
      });
      expect(leadingSpaces.length).toBeGreaterThan(0)
    });
  });
});
