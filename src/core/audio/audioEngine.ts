import { SoundTone, StrokeDepth } from '../../types';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private currentVolume: number = 0.8;
  private tone: SoundTone = 'woodblock';

  private initContext() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.currentVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.currentVolume, this.ctx.currentTime);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.currentVolume, this.ctx.currentTime);
    }
  }

  public setTone(tone: SoundTone) {
    this.tone = tone;
  }

  public unlock() {
    this.initContext();
  }

  /**
   * Play stroke beat synchronized with downstroke / upstroke
   */
  public playStrokeBeat(isUpstroke: boolean, depth: StrokeDepth) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain);

    if (this.tone === 'woodblock') {
      // Warm woodblock tick
      const baseFreq = isUpstroke ? 780 : 880;
      const pitchMod = depth === 'full' ? -120 : depth === 'deep' ? -80 : 0;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq + pitchMod, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.045);

      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.start(now);
      osc.stop(now + 0.045);
    } else if (this.tone === 'click') {
      // Crisp digital click
      const freq = isUpstroke ? 1200 : 1600;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

      osc.start(now);
      osc.stop(now + 0.02);
    } else {
      // Sub synth pulse with warm harmonic
      const freq = isUpstroke ? 80 : 60;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.start(now);
      osc.stop(now + 0.08);
    }
  }

  /**
   * Soothing bell chime for panic or hold state
   */
  public playCalmChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    [432, 648, 864].forEach((freq, i) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);

      gain.gain.setValueAtTime(0.2, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + i * 0.06);
      osc.stop(now + 1.2);
    });
  }

  /**
   * Climax celebration fanfare
   */
  public playClimaxFanfare() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0.3, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.6);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.6);
    });
  }
}

export const audioEngine = new AudioEngine();
