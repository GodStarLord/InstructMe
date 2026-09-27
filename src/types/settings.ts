export type SoundTone = 'woodblock' | 'click' | 'sub_synth';

export interface AppSettings {
  audioEnabled: boolean;
  audioVolume: number;         // 0.0 to 1.0
  soundTone: SoundTone;
  hapticsEnabled: boolean;
  hapticIntensity: 'subtle' | 'medium' | 'strong';
  screenWakeLockEnabled: boolean;
  geminiApiKey: string;
  discreetModeEnabled: boolean;
  discreetPin: string;
  defaultStartingArousal: 'flaccid' | 'mid' | 'hard';
}

export const DEFAULT_SETTINGS: AppSettings = {
  audioEnabled: true,
  audioVolume: 0.8,
  soundTone: 'woodblock',
  hapticsEnabled: true,
  hapticIntensity: 'medium',
  screenWakeLockEnabled: true,
  geminiApiKey: '',
  discreetModeEnabled: false,
  discreetPin: '',
  defaultStartingArousal: 'flaccid',
};
