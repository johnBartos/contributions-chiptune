//#EEEEEE - 0 (min)
//#D6E685 - 1
//#8CC665 - 2
//#44A340 - 3
//#1E6823 - 4 (max)

((audioContext, freq, delay, waveform) => {
  'use strict';
  const levels = { '#eeeeee': freq, '#d6e685': freq * (3 / 2), '#8cc665': freq * (3 / 2) * 2, '#44a340': freq * (3 / 2) * 3, '#1e6823': freq * (3 / 2) * 4 };

  const createOscillator = () => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.1;
    oscillator.type = waveform;
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    return {
      play: color => {
        oscillator.frequency.value = levels[color];
      },
      start: () => oscillator.start(0),
      stop: () => oscillator.stop()
    };
  };

  const createNotes = (week, oscillator) => {
    return week.map((day) => {
      const fillNodeValue = day.attributes.fill.nodeValue;
      // const oscillator = createOscillator(fillNodeValue);

      return {
        play: () => {
          day.attributes.fill.nodeValue = 'red';
          oscillator.play(fillNodeValue);
        },
        stop: () => {
          day.attributes.fill.nodeValue = fillNodeValue;
          oscillator.stop();
        }
      };
    });
  };

  const delayPlay = (noteBar) => {
    return (iter) => {
      setTimeout(() => {
        for (let note of noteBar) {
          note.play();
          // setTimeout(() => {
          //   note.stop();
          // }, delay / 2);
        }
      }, delay * iter);
    };
  };

  const oscillator = createOscillator();
  oscillator.start();

  const noteBars = ([].slice.call(document.getElementsByTagName('g'))).slice(1).map((week) => {
    return createNotes([].slice.call(week.getElementsByClassName('day')), oscillator);
  }).map((day) => {
    return delayPlay(day);
  });

  let i = 0;
  for (let noteBar of noteBars) {
    noteBar(i += 1);
  }
  setTimeout(() => { oscillator.stop(); }, delay * i);
})(new AudioContext, 440, 110, 'sawtooth');
