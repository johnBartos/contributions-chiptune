//#EEEEEE - 0 (min)
//#D6E685 - 1
//#8CC665 - 2
//#44A340 - 3
//#1E6823 - 4 (max)

((audioContext, freq, delay) => {
  'use strict';
  const levels = {"#eeeeee": freq, "#d6e685": freq * (3/2), "#8cc665": freq * (3/2) * 2, "#44a340": freq * (3/2) * 3, "#1e6823": freq * (3/2) * 4};
  const noteBars = ([].slice.call(document.getElementsByTagName('g'))).slice(1).map((week) => {
    return createOscillators(audioContext, [].slice.call(week.getElementsByClassName('day')));
  });

  let i = 0;
  for (let noteBar of noteBars) {
    ((j) => {
      setTimeout(() => {
        for (let node of noteBar) {
          const initColor = node.fill.nodeValue;
          node.fill.nodeValue = 'red';
          node.oscillator.start(0);
          setTimeout(() => {
            node.fill.nodeValue = initColor;
            node.oscillator.stop();
          }, delay / 2);
        }
      }, delay * j);
    })(i += 1);
}

  function createOscillators(context, week) {
    return week.map((day) => {
      const freq = levels[day.attributes.fill.nodeValue];
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      gainNode.gain.value = 0.1;
      oscillator.type = 'sawtooth';
      oscillator.frequency.value = freq;
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      return {
        oscillator,
        fill: day.attributes.fill
      };
    });
  };

})(new AudioContext, 440, 100);
