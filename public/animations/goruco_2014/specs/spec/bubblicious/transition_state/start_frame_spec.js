describe('Bubblicious.TransitionState.StartFrame', function() {
  describe(".bubbles", function() {
    it("sets an initial inbound velocity for offscreen bubbles", function() {
      endBubbleState = newBubbleState('a', 0, 0)
      startFrame = new Bubblicious.TransitionState.StartFrame([], [endBubbleState])
      bubble = startFrame.bubbleStates()[0]
      expect(bubble.location.x === 0 && bubble.location.y === 0).toBeFalsy
      expect(bubble.velocity.modulus()).toBeClose(50, 0.001);
    });

    it("sets locked to false for any bubble", function() {
      startBubbleState1 = newBubbleState('a', 0, 0, {locked: true});
      startBubbleState2 = newBubbleState('b', 1, 1);
      endBubbleState1 = newBubbleState('c', 2, 2);
      endBubbleState2 = newBubbleState('d', 3, 3);
      startFrame = new Bubblicious.TransitionState.StartFrame(
        [startBubbleState1, startBubbleState2], [endBubbleState1, endBubbleState2]
      )
      bubble = _(startFrame.bubbleStates()).find(function(b) {
        return b.bubble.char === 'a'
      });
      expect(bubble.locked).toBeFalsy()
    });

    describe("with duplicate letters, some already onscreen", function() {
      var startFrame; 

      beforeEach(function() {
        startBubbleStates = []
        startBubbleStates.push(newBubbleState('A', 0, 0))
        startBubbleStates.push(newBubbleState('L', 1, 0))
        startBubbleStates.push(newBubbleState('L', 1, 1))
        startBubbleStates.push(newBubbleState('I', 2, 1))
        endBubbleStates = []
        endBubbleStates.push(newBubbleState('A', 1, 0))
        endBubbleStates.push(newBubbleState('L', 2, 0))
        endBubbleStates.push(newBubbleState('J', 0, 1))
        endBubbleStates.push(newBubbleState('J', 1, 1))
        startFrame = new Bubblicious.TransitionState.StartFrame(
          startBubbleStates, endBubbleStates
        )
      });

      it("generates onscreen bubbles", function() {
        onscreenBubbleStates = startFrame.onscreenBubbleStates();
        expect(onscreenBubbleStates.length).toEqual(4)
        bubbleA = firstBubbleStateMatch(onscreenBubbleStates, 'A');
        expect(bubbleA.target.coords()).toEqual([1,0])
        expect(bubbleA.antiTarget).toBeFalsy()
        bubblesL = _(onscreenBubbleStates).select(function(b) { 
          return b.bubble.char === 'L'
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
        bubbleI = firstBubbleStateMatch(onscreenBubbleStates, 'I');
        expect(bubbleI.target).toBeFalsy()
        expect(bubbleI.antiTarget).toBeTruthy()
      });

      it("generates offscreen bubbles", function() {
        offscreenBubbleStates = startFrame.offscreenBubbleStates()
        expect(offscreenBubbleStates.length).toEqual(2)
        allJ = _(offscreenBubbleStates).every(function(b) {
          return b.bubble.char === 'J'
        })
        expect(allJ).toBeTruthy()
        bubbleJ0 = _(offscreenBubbleStates).detect(function(b) {
          return _(b.target.coords()).isEqual([0,1])
        });
        expect(bubbleJ0).toBeTruthy()
        bubbleJ1 = _(offscreenBubbleStates).detect(function(b) {
          return _(b.target.coords()).isEqual([1,1])
        });
        expect(bubbleJ1).toBeTruthy()
      });
    });
  });
});
