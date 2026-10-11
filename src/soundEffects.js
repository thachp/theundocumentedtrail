const RECIPES = {
  tap: [
    { frequency: 420, endFrequency: 330, duration: 0.065, volume: 0.035, type: "sine" },
  ],
  choice: [
    { frequency: 300, endFrequency: 440, duration: 0.11, volume: 0.042, type: "triangle" },
    { frequency: 600, endFrequency: 680, duration: 0.08, volume: 0.018, type: "sine", delay: 0.035 },
  ],
  confirm: [
    { frequency: 440, endFrequency: 500, duration: 0.12, volume: 0.035, type: "sine" },
    { frequency: 660, endFrequency: 720, duration: 0.15, volume: 0.026, type: "sine", delay: 0.055 },
  ],
  dismiss: [
    { frequency: 350, endFrequency: 220, duration: 0.09, volume: 0.03, type: "sine" },
  ],
  warning: [
    { frequency: 230, endFrequency: 165, duration: 0.15, volume: 0.04, type: "triangle" },
    { frequency: 180, endFrequency: 145, duration: 0.17, volume: 0.022, type: "sine", delay: 0.045 },
  ],
};

export const INTERACTION_SOUND_GAIN = 2.6;

function scheduleTone(context, destination, tone) {
  const now = context.currentTime + (tone.delay ?? 0);
  const oscillator = context.createOscillator();
  const envelope = context.createGain();

  oscillator.type = tone.type;
  oscillator.frequency.setValueAtTime(tone.frequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(tone.endFrequency, now + tone.duration);
  envelope.gain.setValueAtTime(0.0001, now);
  envelope.gain.exponentialRampToValueAtTime(tone.volume, now + 0.008);
  envelope.gain.exponentialRampToValueAtTime(0.0001, now + tone.duration);
  oscillator.connect(envelope);
  envelope.connect(destination);
  oscillator.start(now);
  oscillator.stop(now + tone.duration + 0.02);
  oscillator.addEventListener("ended", () => {
    oscillator.disconnect();
    envelope.disconnect();
  }, { once: true });
}

export function createInteractionSounds() {
  let context = null;
  let output = null;

  const initialise = () => {
    if (context) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    context = new AudioContextClass();
    output = context.createGain();
    output.gain.value = INTERACTION_SOUND_GAIN;
    output.connect(context.destination);
  };

  return {
    async play(kind = "tap") {
      try {
        initialise();
        if (!context || !output) return;
        if (context.state === "suspended") await context.resume();
        const recipe = RECIPES[kind] ?? RECIPES.tap;
        recipe.forEach((tone) => scheduleTone(context, output, tone));
      } catch {
        // Sound feedback should never stop the interface from responding.
      }
    },

    dispose() {
      if (context && context.state !== "closed") context.close();
      context = null;
      output = null;
    },
  };
}
