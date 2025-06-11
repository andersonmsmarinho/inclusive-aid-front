export function playBeep(frequency: number = 440, duration = 0.1) {
  if (typeof window === 'undefined') return;

  const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext);
  if (!AudioCtx) return; // Browser unsupported

  const ctx = new AudioCtx();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start();
  gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  oscillator.stop(ctx.currentTime + duration);

  // Close context after sound ends to free resources
  oscillator.onended = () => ctx.close();
} 