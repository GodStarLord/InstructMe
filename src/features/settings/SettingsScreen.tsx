import React, { useState } from 'react';
import { AppSettings, SoundTone } from '../../types';
import { storage } from '../../core/db/storage';
import { audioEngine } from '../../core/audio/audioEngine';
import { hapticsEngine } from '../../core/haptics/hapticsEngine';
import { screenWakeLock } from '../../core/wakelock/wakeLock';
import { ArrowLeft, Volume2, Smartphone, Sun, Key, Shield, Download, Upload, Check } from 'lucide-react';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const [settings, setSettings] = useState<AppSettings>(storage.getSettings());
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const updated = storage.saveSettings({ [key]: value });
    setSettings(updated);

    // Apply live effects
    if (key === 'audioVolume') audioEngine.setVolume(value as number);
    if (key === 'audioEnabled') audioEngine.setMuted(!(value as boolean));
    if (key === 'soundTone') audioEngine.setTone(value as SoundTone);
    if (key === 'hapticsEnabled') hapticsEngine.setEnabled(value as boolean);
    if (key === 'hapticIntensity') hapticsEngine.setIntensity(value as 'subtle' | 'medium' | 'strong');
    if (key === 'screenWakeLockEnabled') screenWakeLock.setEnabled(value as boolean);

    hapticsEngine.triggerTap();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1500);
  };

  const handleExport = () => {
    const jsonStr = storage.exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `instructme-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content && storage.importBackupJson(content)) {
          setSettings(storage.getSettings());
          alert('Backup restored successfully!');
        } else {
          alert('Failed to import invalid backup JSON.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      padding: '20px',
      paddingBottom: 'calc(var(--safe-bottom) + 24px)',
      background: 'var(--bg-primary)',
      gap: '20px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onBack}
            className="btn-tactile btn-secondary"
            style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%' }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800 }} className="text-gradient-rose">
              Settings & Privacy
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Sensory preferences, keys & privacy
            </p>
          </div>
        </div>

        {savedNotice && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            color: 'var(--accent-cyan)',
            fontSize: '12px',
            fontWeight: 600,
          }}>
            <Check size={14} />
            <span>Saved</span>
          </div>
        )}
      </div>

      {/* 1. Sensory Audio Section */}
      <div className="glass-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Volume2 size={18} color="var(--accent-amber)" />
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>Audio & Metronome</h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>Audible Beat Metronome</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Synthesized stroke clicks & chimes</div>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.audioEnabled}
              onChange={(e) => updateSetting('audioEnabled', e.target.checked)}
            />
            <span className="slider-switch" />
          </label>
        </div>

        {settings.audioEnabled && (
          <>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Sound Volume</span>
                <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}>{Math.round(settings.audioVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.audioVolume}
                onChange={(e) => updateSetting('audioVolume', parseFloat(e.target.value))}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Tone Timbre
              </label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                {(['woodblock', 'click', 'sub_synth'] as SoundTone[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      updateSetting('soundTone', t);
                      audioEngine.setTone(t);
                      audioEngine.playStrokeBeat(false, 'mid');
                    }}
                    className={`btn-tactile ${settings.soundTone === t ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1, minHeight: '36px', padding: '6px', fontSize: '12px', textTransform: 'capitalize' }}
                  >
                    {t.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 2. Web Haptics Section */}
      <div className="glass-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Smartphone size={18} color="var(--accent-coral)" />
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>Tactile Mobile Haptics</h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>Haptic Guided Strokes</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Vibrates on downstrokes, depths & edges</div>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.hapticsEnabled}
              onChange={(e) => updateSetting('hapticsEnabled', e.target.checked)}
            />
            <span className="slider-switch" />
          </label>
        </div>

        {settings.hapticsEnabled && (
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Vibration Strength
            </label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              {(['subtle', 'medium', 'strong'] as const).map((intensity) => (
                <button
                  key={intensity}
                  type="button"
                  onClick={() => {
                    updateSetting('hapticIntensity', intensity);
                    hapticsEngine.setIntensity(intensity);
                    hapticsEngine.triggerStroke(false, 'full');
                  }}
                  className={`btn-tactile ${settings.hapticIntensity === intensity ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1, minHeight: '36px', padding: '6px', fontSize: '12px', textTransform: 'capitalize' }}
                >
                  {intensity}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Screen Wake Lock */}
      <div className="glass-card" style={{ padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sun size={18} color="var(--accent-amber)" />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>Keep Screen Awake</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Prevents display sleep during sessions</div>
          </div>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={settings.screenWakeLockEnabled}
            onChange={(e) => updateSetting('screenWakeLockEnabled', e.target.checked)}
          />
          <span className="slider-switch" />
        </label>
      </div>

      {/* 4. AI Key (Optional) */}
      <div className="glass-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Key size={18} color="var(--accent-violet)" />
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>Google Gemini AI Key (Optional)</h3>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          Enter a free Gemini API key to activate deep stamina trend analysis. Stored strictly locally in your browser. If empty, InstructMe uses its built-in offline heuristic coach.
        </p>
        <input
          type="password"
          placeholder="AIzaSy..."
          value={settings.geminiApiKey}
          onChange={(e) => updateSetting('geminiApiKey', e.target.value.trim())}
          style={{
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            color: '#fff',
            fontSize: '13px',
            outline: 'none',
          }}
        />
      </div>

      {/* 5. Discreet Boss Key & PIN */}
      <div className="glass-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={18} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>Privacy & Boss Key</h3>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          Press <kbd style={{ padding: '2px 6px', background: '#222', borderRadius: '4px', border: '1px solid #444' }}>Esc</kbd> anytime or tap the stealth icon to instantly camouflage InstructMe into a mock notes dashboard.
        </p>

        <div>
          <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Optional Unlock PIN (4 digits):</label>
          <input
            type="password"
            maxLength={4}
            placeholder="e.g. 1234 (Leave empty for no PIN)"
            value={settings.discreetPin}
            onChange={(e) => updateSetting('discreetPin', e.target.value.replace(/\D/g, ''))}
            style={{
              width: '100%',
              marginTop: '6px',
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              fontSize: '13px',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* 6. Data Backup & Restore */}
      <div className="glass-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>Backup & Data Portability</h3>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          100% client-side privacy. Export your encrypted sessions or transfer them to another device.
        </p>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn-tactile btn-secondary"
            onClick={handleExport}
            style={{ flex: 1, minHeight: '40px', fontSize: '13px', gap: '6px' }}
          >
            <Download size={16} />
            <span>Export JSON</span>
          </button>

          <label
            className="btn-tactile btn-secondary"
            style={{ flex: 1, minHeight: '40px', fontSize: '13px', gap: '6px', cursor: 'pointer' }}
          >
            <Upload size={16} />
            <span>Import JSON</span>
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </label>
        </div>
      </div>
    </div>
  );
};
