// Web Audio API sound effects - no external files needed
const AudioCtx =
  typeof window !== "undefined"
    ? window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    : null;

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (!AudioCtx) return null;
  if (!ctx) ctx = new AudioCtx();
  return ctx;
}

function playTone(freq: number, duration: number, type: OscillatorType = "sine", vol = 0.3) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = vol;
  gain.gain.exponentialRampToValueAtTime(0.01, c.currentTime + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + duration);
}

export function playCorrect() {
  const c = getCtx();
  if (!c) return;
  // Happy ascending two-note chime
  playTone(523, 0.15, "sine", 0.25); // C5
  setTimeout(() => playTone(659, 0.3, "sine", 0.25), 100); // E5
}

export function playWrong() {
  const c = getCtx();
  if (!c) return;
  // Sad descending buzz
  playTone(300, 0.15, "square", 0.15);
  setTimeout(() => playTone(200, 0.3, "square", 0.15), 120);
}

export function playWin() {
  const c = getCtx();
  if (!c) return;
  // Triumphant fanfare
  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.3, "sine", 0.2), i * 150);
  });
}

export function playClick() {
  playTone(800, 0.05, "sine", 0.1);
}

export function playStart() {
  const c = getCtx();
  if (!c) return;
  // Quick "ready go" ascending
  playTone(440, 0.1, "sine", 0.15);
  setTimeout(() => playTone(554, 0.1, "sine", 0.15), 100);
  setTimeout(() => playTone(659, 0.2, "sine", 0.2), 200);
}
