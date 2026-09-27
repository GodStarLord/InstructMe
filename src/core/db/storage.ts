import { AppSettings, DEFAULT_SETTINGS } from '../../types/settings';
import { SessionRecord } from '../../types/session';
import { Routine } from '../../types/routine';

const SETTINGS_KEY = 'instructme_settings_v1';
const SESSIONS_KEY = 'instructme_sessions_v1';
const ROUTINES_KEY = 'instructme_routines_v1';

class StorageManager {
  private memorySettings: AppSettings = { ...DEFAULT_SETTINGS };

  constructor() {
    this.loadSettings();
  }

  // Settings
  public getSettings(): AppSettings {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        this.memorySettings = { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
      }
    } catch (e) {
      console.warn('Failed to read settings from localStorage:', e);
    }
    return this.memorySettings;
  }

  public saveSettings(settings: Partial<AppSettings>): AppSettings {
    this.memorySettings = { ...this.getSettings(), ...settings };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.memorySettings));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
    return this.memorySettings;
  }

  // Sessions
  public getSessions(): SessionRecord[] {
    try {
      const raw = localStorage.getItem(SESSIONS_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to read sessions:', e);
    }
    return [];
  }

  public saveSession(record: SessionRecord): void {
    const list = this.getSessions();
    list.unshift(record);
    try {
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to persist session:', e);
    }
  }

  public clearAllSessions(): void {
    try {
      localStorage.removeItem(SESSIONS_KEY);
    } catch (e) {
      console.warn('Failed to clear sessions:', e);
    }
  }

  // Routines
  public getRoutines(): Routine[] {
    try {
      const raw = localStorage.getItem(ROUTINES_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to read custom routines:', e);
    }
    return [];
  }

  public saveCustomRoutine(routine: Routine): void {
    const list = this.getRoutines().filter(r => r.id !== routine.id);
    list.unshift(routine);
    try {
      localStorage.setItem(ROUTINES_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to persist routine:', e);
    }
  }

  public deleteCustomRoutine(id: string): void {
    const list = this.getRoutines().filter(r => r.id !== id);
    try {
      localStorage.setItem(ROUTINES_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to delete routine:', e);
    }
  }

  // Export / Import
  public exportBackupJson(): string {
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      settings: this.getSettings(),
      sessions: this.getSessions(),
      routines: this.getRoutines(),
    };
    return JSON.stringify(backup, null, 2);
  }

  public importBackupJson(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.settings) this.saveSettings(parsed.settings);
      if (Array.isArray(parsed.sessions)) {
        localStorage.setItem(SESSIONS_KEY, JSON.stringify(parsed.sessions));
      }
      if (Array.isArray(parsed.routines)) {
        localStorage.setItem(ROUTINES_KEY, JSON.stringify(parsed.routines));
      }
      return true;
    } catch (e) {
      console.error('Failed to import backup:', e);
      return false;
    }
  }

  private loadSettings() {
    this.getSettings();
  }
}

export const storage = new StorageManager();
