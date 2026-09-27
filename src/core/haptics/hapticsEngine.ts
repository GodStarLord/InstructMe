import { StrokeDepth } from '../../types';

class HapticsEngine {
  private enabled: boolean = true;
  private intensity: 'subtle' | 'medium' | 'strong' = 'medium';

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public setIntensity(intensity: 'subtle' | 'medium' | 'strong') {
    this.intensity = intensity;
  }

  private canVibrate(): boolean {
    return this.enabled && typeof window !== 'undefined' && 'vibrate' in navigator;
  }

  private scaleDuration(ms: number): number {
    if (this.intensity === 'subtle') return Math.max(5, Math.round(ms * 0.6));
    if (this.intensity === 'strong') return Math.round(ms * 1.4);
    return ms;
  }

  /**
   * Tactile feedback for every stroke
   */
  public triggerStroke(isUpstroke: boolean, depth: StrokeDepth) {
    if (!this.canVibrate()) return;

    try {
      if (depth === 'full' || depth === 'deep') {
        // Multi-pulse sensation for deep/full penetration
        const d1 = this.scaleDuration(15);
        const pause = 10;
        const d2 = this.scaleDuration(25);
        navigator.vibrate([d1, pause, d2]);
      } else {
        const duration = isUpstroke ? this.scaleDuration(10) : this.scaleDuration(22);
        navigator.vibrate(duration);
      }
    } catch {
      // Ignore vibration error in restricted sandboxes
    }
  }

  /**
   * Pelvic floor squeeze cue vibration
   */
  public triggerSqueezePrompt() {
    if (!this.canVibrate()) return;
    try {
      navigator.vibrate([this.scaleDuration(35), 25, this.scaleDuration(35)]);
    } catch {}
  }

  /**
   * Panic button halt vibration
   */
  public triggerPanic() {
    if (!this.canVibrate()) return;
    try {
      navigator.vibrate([this.scaleDuration(70), 40, this.scaleDuration(70)]);
    } catch {}
  }

  /**
   * Edge reached vibration pattern
   */
  public triggerEdgeLogged() {
    if (!this.canVibrate()) return;
    try {
      navigator.vibrate([25, 20, 25, 20, 40]);
    } catch {}
  }

  /**
   * Subtle UI click feedback
   */
  public triggerTap() {
    if (!this.canVibrate()) return;
    try {
      navigator.vibrate(10);
    } catch {}
  }
}

export const hapticsEngine = new HapticsEngine();
