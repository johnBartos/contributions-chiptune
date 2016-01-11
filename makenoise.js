//#EEEEEE - 0 (min)
//#D6E685 - 1
//#8CC665 - 2
//#44A340 - 3
//#1E6823 - 4 (max)

((audioContext, freq, speed) => {
  'use strict';
  const levels = {"#eeeeee": freq, "#d6e685": freq * (3/2), "#8cc665": freq * (3/2) * 2, "#44a340": freq * (3/2) * 3, "#1e6823": freq * (3/2) * 4};
  const oscillatorsPerWeek = ([].slice.call(document.getElementsByTagName('g'))).slice(1).map((week) => {
    return ([].slice.call(week.getElementsByClassName('day'))).map((day) => {
      return levels[day.attributes.fill.nodeValue];
    });
  }).map((bar) => {
      return createOscillators(audioContext, bar);
    });

  let i = 0;
  for (let oscillators of oscillatorsPerWeek) {
    ((j) => {
      setTimeout(() => {
        for (let oscillator of oscillators) {
          oscillator.start(0);
          setTimeout(() => {
            oscillator.stop();
          }, speed / 2);
        }
      }, speed * j);
    })(i += 1);
  }

  function createOscillators(context, levels) {
    return levels.map((freq) => {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      gainNode.gain.value = 0.1;
      oscillator.type = 'sawtooth';
      oscillator.frequency.value = freq;
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      return oscillator;
    });
  };

})(new AudioContext, 50, 200);
