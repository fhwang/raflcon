describe('Dervish.Letter', function() {
  var letter;

  beforeEach(function() {
    Dervish.rect = [3,2]
  });

  describe('.checkForLock', function() {
    it('stops a letter with an antitarget if is no longer visible', function() {
      letter = new Dervish.Letter('A', -10, -10)
      letter.startMovingAwayFrom(new Dervish.Location(0,0))
      expect(letter.isLocked()).toBeFalsy()
      letter.checkForLock()
      expect(letter.isLocked()).toBeTruthy()
    });
  });
});
