import React, { useState } from 'react';
import { SessionConfig, StrokeDepth } from '../../types';
import { Sliders, X, Check, CheckSquare, Square } from 'lucide-react';
import { getDepthColor, getDepthLabel } from '../../utils/formatters';

interface SessionConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SessionConfig;
  onSaveConfig: (newConfig: SessionConfig) => void;
}

export const SessionConfigModal: React.FC<SessionConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [minSps, setMinSps] = useState<number>(config.minSps);
  const [maxSps, setMaxSps] = useState<number>(config.maxSps);
  const [allowDepths, setAllowDepths] = useState<StrokeDepth[]>(config.allowDepths);
  const [allowSqueeze, setAllowSqueeze] = useState<boolean>(config.allowSqueeze);
  const [allowPauses, setAllowPauses] = useState<boolean>(config.allowPauses);
  const [unpredictability, setUnpredictability] = useState<'low' | 'medium' | 'high'>(config.unpredictability);

  if (!isOpen) return null;

  const toggleDepth = (depth: StrokeDepth) => {
    if (allowDepths.includes(depth)) {
      if (allowDepths.length > 1) {
        setAllowDepths(allowDepths.filter(d => d !== depth));
      }
    } else {
      setAllowDepths([...allowDepths, depth]);
    }
  };

  const handleSave = () => {
    onSaveConfig({
      ...config,
      minSps,
      maxSps: Math.max(minSps + 0.2, maxSps),
      allowDepths,
      allowSqueeze,
      allowPauses,
      unpredictability,
    });
    onClose();
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
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={20} color="var(--accent-rose)" />
            <h2 style={{ fontSize: '18px', fontWeight: 700 }} className="text-gradient-rose">
              Randomizer Parameters
            </h2>
          </div>
          <button
            onClick={onClose}
            className="btn-tactile btn-secondary"
            style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* SPS Speed Range Sliders */}
        <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Minimum SPS</span>
              <span style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                {minSps.toFixed(1)} SPS
              </span>
            </div>
            <input
              type="range"
              min="0.3"
              max="2.0"
              step="0.1"
              value={minSps}
              onChange={(e) => setMinSps(parseFloat(e.target.value))}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Maximum SPS</span>
              <span style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-coral)' }}>
                {maxSps.toFixed(1)} SPS
              </span>
            </div>
            <input
              type="range"
              min="1.5"
              max="4.5"
              step="0.1"
              value={maxSps}
              onChange={(e) => setMaxSps(parseFloat(e.target.value))}
            />
          </div>
        </div>

        {/* Allowed Depths Inclusion */}
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Included Stroke Depths
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
            {(['tip', 'shallow', 'mid', 'deep', 'full'] as StrokeDepth[]).map(depth => {
              const isChecked = allowDepths.includes(depth);
              return (
                <button
                  key={depth}
                  type="button"
                  onClick={() => toggleDepth(depth)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    background: isChecked ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${isChecked ? getDepthColor(depth) : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: getDepthColor(depth) }} />
                  <span style={{ fontSize: '12px', fontWeight: isChecked ? 700 : 500, color: isChecked ? '#fff' : 'var(--text-muted)' }}>
                    {getDepthLabel(depth)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="glass-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>Pelvic Squeeze / Kegel Prompts</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Random contract & hold cues</div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={allowSqueeze}
                onChange={(e) => setAllowSqueeze(e.target.checked)}
              />
              <span className="slider-switch" />
            </label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>Sudden Pause & Freeze Holds</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Unpredictable stops for edge control</div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={allowPauses}
                onChange={(e) => setAllowPauses(e.target.checked)}
              />
              <span className="slider-switch" />
            </label>
          </div>
        </div>

        {/* Unpredictability Level */}
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Randomizer Unpredictability
          </label>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            {(['low', 'medium', 'high'] as const).map(lvl => (
              <button
                key={lvl}
                type="button"
                onClick={() => setUnpredictability(lvl)}
                className={`btn-tactile ${unpredictability === lvl ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, minHeight: '38px', padding: '6px', fontSize: '12px', textTransform: 'capitalize' }}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          className="btn-tactile btn-primary"
          onClick={handleSave}
          style={{ width: '100%', height: '48px', fontSize: '15px' }}
        >
          <Check size={18} />
          <span>Apply Parameters</span>
        </button>
      </div>
    </div>
  );
};
