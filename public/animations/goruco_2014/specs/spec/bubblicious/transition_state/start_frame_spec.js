describe('Bubblicious.TransitionState.StartFrame', function() {
  describe(".bubbles", function() {
    it("sets an initial inbound velocity for offscreen bubbles", function() {
      endBubble = newBubble('a', 0, 0)
      startFrame = new Bubblicious.TransitionState.StartFrame([], [endBubble])
      bubble = startFrame.bubbles()[0]
      expect(bubble.location.x === 0 && bubble.location.y === 0).toBeFalsy
      expect(bubble.velocity.modulus()).toBeClose(50, 0.001);
    });

    it("sets locked to false for any bubble", function() {
      startBubble1 = newBubble('a', 0, 0, {locked: true});
      startBubble2 = newBubble('b', 1, 1);
      endBubble1 = newBubble('c', 2, 2);
      endBubble2 = newBubble('d', 3, 3);
      startFrame = new Bubblicious.TransitionState.StartFrame(
        [startBubble1, startBubble2], [endBubble1, endBubble2]
      )
      bubble = _(startFrame.bubbles()).find(function(b) {
        return b.char === 'a'
      });
      expect(bubble.locked).toBeFalsy()
    });

    describe("with duplicate letters, some already onscreen", function() {
      var startFrame; 

      beforeEach(function() {
        startBubbles = []
        startBubbles.push(newBubble('A', 0, 0))
        startBubbles.push(newBubble('L', 1, 0))
        startBubbles.push(newBubble('L', 1, 1))
        startBubbles.push(newBubble('I', 2, 1))
        endBubbles = []
        endBubbles.push(newBubble('A', 1, 0))
        endBubbles.push(newBubble('L', 2, 0))
        endBubbles.push(newBubble('J', 0, 1))
        endBubbles.push(newBubble('J', 1, 1))
        startFrame = new Bubblicious.TransitionState.StartFrame(
          startBubbles, endBubbles
        )
      });

      it("generates onscreen bubbles", function() {
        onscreenBubbles = startFrame.onscreenBubbles();
        expect(onscreenBubbles.length).toEqual(4)
        bubbleA = firstBubbleMatch(onscreenBubbles, 'A');
        expect(bubbleA.target.coords()).toEqual([1,0])
        expect(bubbleA.antiTarget).toBeFalsy()
        bubblesL = _(onscreenBubbles).select(function(b) { 
          return b.char === 'L'
        })
        expect(bubblesL.length).toEqual(2)
        bubbleLWithTarget = _(bubblesL).detect(function(b) { return b.target });
        expect(bubbleLWithTarget.target.coords()).toEqual([2,0]);
        expect(bubbleLWithTarget.antiTarget).toBeFalsy()
        bubbleLWithoutTarget = _(bubblesL).detect(function(b) { 
          return !b.target
        });
        expect(bubbleLWithoutTarget.target).toBeFalsy()
        expect(bubbleLWithoutTarget.antiTarget).toBeTruthy()
        bubbleI = firstBubbleMatch(onscreenBubbles, 'I');
        expect(bubbleI.target).toBeFalsy()
        expect(bubbleI.antiTarget).toBeTruthy()
      });

      it("generates offscreen bubbles", function() {
        offscreenBubbles = startFrame.offscreenBubbles()
        expect(offscreenBubbles.length).toEqual(2)
        allJ = _(offscreenBubbles).every(function(b) {
          return b.char === 'J'
        })
        expect(allJ).toBeTruthy()
        bubbleJ0 = _(offscreenBubbles).detect(function(b) {
          return _(b.target.coords()).isEqual([0,1])
        });
        expect(bubbleJ0).toBeTruthy()
        bubbleJ1 = _(offscreenBubbles).detect(function(b) {
          return _(b.target.coords()).isEqual([1,1])
        });
        expect(bubbleJ1).toBeTruthy()
      });
    });
  });
});
