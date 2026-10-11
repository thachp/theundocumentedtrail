export const SOUNDTRACK_THEMES = Object.freeze({
  hopeful: {
    id: "hopeful",
    label: "Hopeful theme",
    chords: [[48, 55, 64], [53, 60, 69], [55, 62, 71], [48, 55, 60]],
    melody: [72, 76, 79, 76, 74, 77, 81, 79],
    chordEvery: 9000,
    phraseEvery: 5900,
    phraseStep: 0.44,
    noteDuration: 1.8,
    melodyVolume: 0.034,
    filter: 1520,
    noise: 0.004,
    pulseRate: 0.05,
    pulseDepth: 0.055,
    glide: 2.8,
  },
  sorrowful: {
    id: "sorrowful",
    label: "Reflective theme",
    chords: [[45, 52, 57], [41, 48, 57], [48, 55, 59], [43, 50, 55]],
    melody: [69, 67, 64, 60, 62, 60, 57, 55],
    chordEvery: 11500,
    phraseEvery: 7800,
    phraseStep: 0.72,
    noteDuration: 2.5,
    melodyVolume: 0.029,
    filter: 920,
    noise: 0.008,
    pulseRate: 0.075,
    pulseDepth: 0.075,
    glide: 4.2,
  },
  difficulty: {
    id: "difficulty",
    label: "Difficulty theme",
    chords: [[40, 46, 52], [41, 47, 53], [38, 44, 50], [43, 49, 54]],
    melody: [64, 65, 61, 64, 58, 59, 55, 58],
    chordEvery: 6400,
    phraseEvery: 3900,
    phraseStep: 0.28,
    noteDuration: 0.75,
    melodyVolume: 0.026,
    filter: 700,
    noise: 0.016,
    pulseRate: 0.19,
    pulseDepth: 0.12,
    glide: 1.7,
    rhythmEvery: 920,
  },
});

const midiToFrequency = (note) => 440 * (2 ** ((note - 69) / 12));
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function selectSoundtrackTheme({
  stress = 50,
  exposure = 40,
  progress = 0,
  averageHealth = 70,
  outcomeTone = null,
  status = "playing",
} = {}) {
  const danger = Math.max(stress, exposure);

  if (status === "won") return SOUNDTRACK_THEMES.hopeful;
  if (status === "stopped") return SOUNDTRACK_THEMES.sorrowful;
  if (outcomeTone === "danger" || danger >= 78 || averageHealth <= 42) {
    return SOUNDTRACK_THEMES.difficulty;
  }
  if (outcomeTone === "trusted" || (progress >= 55 && danger < 70 && averageHealth >= 55)) {
    return SOUNDTRACK_THEMES.hopeful;
  }
  return SOUNDTRACK_THEMES.sorrowful;
}

function makeNoiseBuffer(context, seconds = 4) {
  const frameCount = Math.floor(context.sampleRate * seconds);
  const buffer = context.createBuffer(1, frameCount, context.sampleRate);
  const channel = buffer.getChannelData(0);
  let previous = 0;

  for (let index = 0; index < frameCount; index += 1) {
    const white = Math.random() * 2 - 1;
    previous = (previous + (0.025 * white)) / 1.025;
    channel[index] = previous * 2.8;
  }

  return buffer;
}

export function createJourneySoundtrack() {
  let context = null;
  let master = null;
  let toneFilter = null;
  let noiseGain = null;
  let pulse = null;
  let pulseDepth = null;
  let noise = null;
  let chordTimer = null;
  let melodyTimer = null;
  let rhythmTimer = null;
  let cueTimer = null;
  let chordIndex = 0;
  let melodyIndex = 0;
  let beatIndex = 0;
  let playing = false;
  let mood = { stress: 50, exposure: 40, progress: 0, averageHealth: 70, outcomeTone: null, status: "playing" };
  let theme = selectSoundtrackTheme(mood);
  const voices = [];

  const stopTimers = () => {
    if (chordTimer) window.clearInterval(chordTimer);
    if (melodyTimer) window.clearInterval(melodyTimer);
    if (rhythmTimer) window.clearInterval(rhythmTimer);
    if (cueTimer) window.clearTimeout(cueTimer);
    chordTimer = null;
    melodyTimer = null;
    rhythmTimer = null;
    cueTimer = null;
  };

  const applyMood = () => {
    if (!context || !toneFilter || !noiseGain || !pulse || !pulseDepth) return;
    const now = context.currentTime;
    const tension = clamp(Math.max(mood.stress, mood.exposure) / 100, 0, 1);
    const openness = clamp(mood.progress / 100, 0, 1);

    toneFilter.frequency.setTargetAtTime(theme.filter + (openness * 180) - (tension * 90), now, 2.2);
    noiseGain.gain.setTargetAtTime(theme.noise, now, 2);
    pulse.frequency.setTargetAtTime(theme.pulseRate, now, 2);
    pulseDepth.gain.setTargetAtTime(theme.pulseDepth, now, 2);
  };

  const changeChord = () => {
    if (!context) return;
    const chord = theme.chords[chordIndex % theme.chords.length];
    const now = context.currentTime;

    voices.forEach(({ oscillator }, index) => {
      oscillator.frequency.cancelScheduledValues(now);
      oscillator.frequency.setValueAtTime(Math.max(oscillator.frequency.value, 1), now);
      oscillator.frequency.exponentialRampToValueAtTime(midiToFrequency(chord[index]), now + theme.glide);
    });
    chordIndex += 1;
  };

  const playNote = (note, start, duration, volume, type = "sine") => {
    if (!context || !master) return;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(midiToFrequency(note), start);
    envelope.gain.setValueAtTime(0.0001, start);
    envelope.gain.exponentialRampToValueAtTime(volume, start + Math.min(0.16, duration * 0.22));
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(envelope);
    envelope.connect(master);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
    oscillator.addEventListener("ended", () => {
      oscillator.disconnect();
      envelope.disconnect();
    }, { once: true });
  };

  const playMelodyPhrase = () => {
    if (!context || !master || !playing) return;
    const now = context.currentTime + 0.05;
    const instrument = theme.id === "hopeful" ? "triangle" : "sine";

    for (let step = 0; step < 4; step += 1) {
      const note = theme.melody[(melodyIndex + step) % theme.melody.length];
      playNote(note, now + (step * theme.phraseStep), theme.noteDuration, theme.melodyVolume, instrument);
    }
    melodyIndex = (melodyIndex + 4) % theme.melody.length;
  };

  const playDifficultyBeat = () => {
    if (!context || !master || !playing || theme.id !== "difficulty") return;
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const accented = beatIndex % 4 === 0;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(accented ? 86 : 68, now);
    oscillator.frequency.exponentialRampToValueAtTime(42, now + 0.2);
    envelope.gain.setValueAtTime(accented ? 0.048 : 0.028, now);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
    oscillator.connect(envelope);
    envelope.connect(master);
    oscillator.start(now);
    oscillator.stop(now + 0.25);
    oscillator.addEventListener("ended", () => {
      oscillator.disconnect();
      envelope.disconnect();
    }, { once: true });
    beatIndex += 1;
  };

  const startTimers = () => {
    stopTimers();
    chordTimer = window.setInterval(changeChord, theme.chordEvery);
    melodyTimer = window.setInterval(playMelodyPhrase, theme.phraseEvery);
    if (theme.rhythmEvery) rhythmTimer = window.setInterval(playDifficultyBeat, theme.rhythmEvery);
  };

  const initialise = () => {
    if (context) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) throw new Error("Web Audio is not supported in this browser.");

    context = new AudioContextClass();
    master = context.createGain();
    const compressor = context.createDynamicsCompressor();
    const toneBus = context.createGain();
    toneFilter = context.createBiquadFilter();
    const delay = context.createDelay(2);
    const feedback = context.createGain();
    const wet = context.createGain();

    master.gain.setValueAtTime(0.0001, context.currentTime);
    toneBus.gain.value = 0.7;
    toneFilter.type = "lowpass";
    toneFilter.frequency.value = theme.filter;
    toneFilter.Q.value = 0.5;
    delay.delayTime.value = 0.56;
    feedback.gain.value = 0.18;
    wet.gain.value = 0.18;
    compressor.threshold.value = -22;
    compressor.knee.value = 18;
    compressor.ratio.value = 3;
    compressor.attack.value = 0.08;
    compressor.release.value = 0.7;

    toneBus.connect(toneFilter);
    toneFilter.connect(master);
    toneFilter.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(master);
    master.connect(compressor);
    compressor.connect(context.destination);

    ["sine", "triangle", "sine"].forEach((type, index) => {
      const oscillator = context.createOscillator();
      const voiceGain = context.createGain();
      oscillator.type = type;
      oscillator.frequency.value = midiToFrequency(theme.chords[0][index]);
      voiceGain.gain.value = index === 1 ? 0.034 : 0.044;
      oscillator.connect(voiceGain);
      voiceGain.connect(toneBus);
      oscillator.start();
      voices.push({ oscillator, voiceGain });
    });

    pulse = context.createOscillator();
    pulseDepth = context.createGain();
    pulse.type = "sine";
    pulse.frequency.value = theme.pulseRate;
    pulseDepth.gain.value = theme.pulseDepth;
    pulse.connect(pulseDepth);
    pulseDepth.connect(toneBus.gain);
    pulse.start();

    noise = context.createBufferSource();
    const noiseFilter = context.createBiquadFilter();
    noiseGain = context.createGain();
    noise.buffer = makeNoiseBuffer(context);
    noise.loop = true;
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.value = 620;
    noiseFilter.Q.value = 0.25;
    noiseGain.gain.value = theme.noise;
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);
    noise.start();
    applyMood();
  };

  return {
    async play() {
      initialise();
      await context.resume();
      playing = true;
      const now = context.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
      master.gain.exponentialRampToValueAtTime(0.38, now + 1.4);
      changeChord();
      cueTimer = window.setTimeout(playMelodyPhrase, 900);
      startTimers();
    },

    pause() {
      if (!context || !master) return;
      playing = false;
      stopTimers();
      const now = context.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      window.setTimeout(() => {
        if (!playing && context?.state === "running") context.suspend();
      }, 900);
    },

    setMood(nextMood) {
      const previousTheme = theme.id;
      mood = { ...mood, ...nextMood };
      theme = selectSoundtrackTheme(mood);
      applyMood();

      if (playing && previousTheme !== theme.id) {
        chordIndex = 0;
        melodyIndex = 0;
        changeChord();
        startTimers();
        cueTimer = window.setTimeout(playMelodyPhrase, 850);
      }
      return theme;
    },

    getTheme() {
      return theme;
    },

    dispose() {
      playing = false;
      stopTimers();
      voices.forEach(({ oscillator }) => oscillator.stop());
      if (pulse) pulse.stop();
      if (noise) noise.stop();
      if (context && context.state !== "closed") context.close();
      context = null;
    },
  };
}
