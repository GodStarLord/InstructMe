import React, { useState } from 'react';
import { StartingArousal, SessionConfig } from '../../types';
import { Sparkles, Activity, Flame, Clock, Play, X } from 'lucide-react';

interface PreSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSession: (config: SessionConfig) => void;
  baseConfig: SessionConfig;
}

export const PreSessionModal: React.FC<PreSessionModalProps> = ({
  isOpen,
  onClose,
  onStartSession,
  baseConfig,
}) => {
  const [arousal, setArousal] = useState<StartingArousal>(baseConfig.startingArousal);
  const [durationMin, setDurationMin] = useState<number>(baseConfig.targetDurationMinutes || 15);

  if (!isOpen) return null;

  const handleLaunch = () => {
    onStartSession({
      ...baseConfig,
      startingArousal: arousal,
      targetDurationMinutes: durationMin,
    });
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(5, 5, 8, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700 }} className="text-gradient-rose">
              Session Check-In
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Tailoring your initial pacing and warmup
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn-tactile btn-secondary"
            style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Question: Current Starting State */}
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            What is your current state?
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
            {/* Flaccid Option */}
            <button
              type="button"
              onClick={() => setArousal('flaccid')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px',
                borderRadius: '14px',
                background: arousal === 'flaccid' ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                border: arousal === 'flaccid' ? '1.5px solid var(--depth-tip)' : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: arousal === 'flaccid' ? 'var(--depth-tip)' : 'rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: arousal === 'flaccid' ? '#000' : 'var(--text-secondary)',
              }}>
                <Sparkles size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>
                  Flaccid / Soft
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Gentle 3–5 min warmup (0.5–1.0 SPS) & shallow strokes
                </div>
              </div>
            </button>

            {/* Mid / Semi Option */}
            <button
              type="button"
              onClick={() => setArousal('mid')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px',
                borderRadius: '14px',
                background: arousal === 'mid' ? 'rgba(224, 168, 153, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                border: arousal === 'mid' ? '1.5px solid var(--accent-rose)' : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: arousal === 'mid' ? 'var(--accent-rose)' : 'rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: arousal === 'mid' ? '#000' : 'var(--text-secondary)',
              }}>
                <Activity size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>
                  Semi / Mid Arousal
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Balanced escalation (1.2–2.0 SPS) with mixed depths
                </div>
              </div>
            </button>

            {/* Fully Hard Option */}
            <button
              type="button"
              onClick={() => setArousal('hard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px',
                borderRadius: '14px',
                background: arousal === 'hard' ? 'rgba(244, 63, 94, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                border: arousal === 'hard' ? '1.5px solid var(--accent-coral)' : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: arousal === 'hard' ? 'var(--accent-coral)' : 'rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: arousal === 'hard' ? '#fff' : 'var(--text-secondary)',
              }}>
                <Flame size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>
                  Erect & Ready
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Skip warmup straight to stamina waves & edge plateaus
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Target Session Duration */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Target Duration
            </span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-amber)' }}>
              {durationMin} minutes
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[10, 15, 20, 30].map(mins => (
              <button
                key={mins}
                type="button"
                onClick={() => setDurationMin(mins)}
                className={`btn-tactile ${durationMin === mins ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, minHeight: '38px', padding: '8px', fontSize: '13px' }}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>

        {/* Launch Button */}
        <button
          className="btn-tactile btn-primary"
          onClick={handleLaunch}
          style={{ width: '100%', height: '52px', fontSize: '16px', marginTop: '8px' }}
        >
          <Play size={20} fill="#fff" />
          <span>Begin Experience</span>
        </button>
      </div>
    </div>
  );
};
