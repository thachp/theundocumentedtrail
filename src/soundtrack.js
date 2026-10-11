export const SOUNDTRACK_THEMES = Object.freeze({
  hopeful: {
    id: "hopeful",
    label: "Sad journey theme",
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
    label: "Sad journey theme",
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
    label: "Sad journey theme",
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

export const SOUNDTRACK_TRACK = Object.freeze({
  src: "/assets/andriig-sad-sad-music-566795.mp3",
  label: "Sad journey theme",
  artist: "AndriiG",
  source: "Pixabay",
  sourceUrl: "https://cdn.pixabay.com/download/audio/2026/07/13/audio_6490245f9f.mp3?filename=andriig-sad-sad-music-566795.mp3",
});

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

export function createJourneySoundtrack() {
  let audio = null;
  let mood = { stress: 50, exposure: 40, progress: 0, averageHealth: 70, outcomeTone: null, status: "playing" };
  let theme = selectSoundtrackTheme(mood);

  const initialise = () => {
    if (audio) return;
    if (typeof Audio === "undefined") throw new Error("Audio playback is not supported in this browser.");
    audio = new Audio(SOUNDTRACK_TRACK.src);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.34;
  };

  return {
    async play() {
      initialise();
      await audio.play();
    },

    pause() {
      if (!audio) return;
      audio.pause();
    },

    setMood(nextMood) {
      mood = { ...mood, ...nextMood };
      theme = selectSoundtrackTheme(mood);
      return theme;
    },

    getTheme() {
      return theme;
    },

    dispose() {
      if (!audio) return;
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audio = null;
    },
  };
}
