// Synthesized Web Audio FX engine for CiberKids games (zero external dependencies)

type SoundKind = 'tap' | 'correct' | 'wrong' | 'combo' | 'win' | 'tick';

let muted = false;
let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (Ctx) {
      audioCtx = new Ctx();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isGameAudioMuted(): boolean {
  return muted;
}

export function setGameAudioMuted(next: boolean): void {
  muted = next;
}

export function toggleGameAudioMuted(): boolean {
  muted = !muted;
  return muted;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  gainPeak = 0.08,
  delay = 0
) {
  const ctx = getCtx();
  if (!ctx || muted) return;

  try {
    const start = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(gainPeak, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  } catch {
    // Ignore audio context restrictions
  }
}

export function playGameSound(kind: SoundKind): void {
  if (muted) return;
  switch (kind) {
    case 'tap':
      playTone(540, 0.06, 'sine', 0.05);
      break;
    case 'tick':
      playTone(720, 0.04, 'triangle', 0.03);
      break;
    case 'correct':
      playTone(523.25, 0.12, 'triangle', 0.09, 0);
      playTone(659.25, 0.16, 'triangle', 0.09, 0.07);
      break;
    case 'combo':
      playTone(587.33, 0.1, 'triangle', 0.09, 0);
      playTone(783.99, 0.12, 'triangle', 0.1, 0.06);
      playTone(1046.5, 0.18, 'sine', 0.1, 0.12);
      break;
    case 'wrong':
      playTone(240, 0.14, 'sawtooth', 0.05, 0);
      playTone(185, 0.18, 'sawtooth', 0.04, 0.09);
      break;
    case 'win':
      playTone(523.25, 0.14, 'triangle', 0.1, 0);
      playTone(659.25, 0.14, 'triangle', 0.1, 0.09);
      playTone(783.99, 0.16, 'triangle', 0.1, 0.18);
      playTone(1046.5, 0.34, 'sine', 0.12, 0.27);
      break;
  }
}
