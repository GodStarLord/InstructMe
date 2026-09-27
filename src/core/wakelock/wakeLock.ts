class ScreenWakeLockManager {
  private sentinel: WakeLockSentinel | null = null;
  private isEnabled: boolean = true;

  constructor() {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && this.isEnabled && !this.sentinel) {
          this.request();
        }
      });
    }
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.release();
    } else {
      this.request();
    }
  }

  public async request() {
    if (!this.isEnabled) return;
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      try {
        this.sentinel = await navigator.wakeLock.request('screen');
        this.sentinel.addEventListener('release', () => {
          this.sentinel = null;
        });
      } catch (err) {
        console.warn('Screen WakeLock request failed:', err);
      }
    }
  }

  public async release() {
    if (this.sentinel) {
      try {
        await this.sentinel.release();
        this.sentinel = null;
      } catch (err) {
        console.warn('Screen WakeLock release failed:', err);
      }
    }
  }
}

export const screenWakeLock = new ScreenWakeLockManager();
