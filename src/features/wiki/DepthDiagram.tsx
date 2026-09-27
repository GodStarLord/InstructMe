import React, { useState } from 'react';
import { StrokeDepth } from '../../types';
import { getDepthColor, getDepthLabel } from '../../utils/formatters';

export const DepthDiagram: React.FC = () => {
  const [selectedDepth, setSelectedDepth] = useState<StrokeDepth>('mid');

  const depthDescriptions: Record<StrokeDepth, { title: string; range: string; desc: string; tip: string }> = {
    tip: {
      title: 'Tip (Glans & Coronal Ridge)',
      range: 'Top 10–15% of the stroke',
      desc: 'Focuses entirely on the most nerve-dense region: the glans, coronal ridge, and frenulum. Highly stimulating with rapid sensations.',
      tip: 'Use for quick teasing or during the escalation phase to build arousal rapidly without heavy friction.',
    },
    shallow: {
      title: 'Shallow (Upper 1/3)',
      range: 'Upper 33% of the shaft down from the head',
      desc: 'Covers the glans and upper third of the shaft. Provides intense, focused stimulation with manageable arousal buildup.',
      tip: 'Great for maintaining the edge without pushing past the point of no return.',
    },
    mid: {
      title: 'Mid (Central Shaft)',
      range: 'Middle 50% of the shaft',
      desc: 'Stimulates the corpus cavernosum without high-friction pressure on the sensitive tip. Ideal for steady endurance pacing.',
      tip: 'Use this zone to maintain steady stamina for 10+ minutes without overstimulating the sensitive head.',
    },
    deep: {
      title: 'Deep (Lower Base)',
      range: 'Bottom 2/3 of shaft toward the pelvic base',
      desc: 'Pressure concentrated at the base and root of the penis. Tones the bulbocavernosus muscle and encourages blood retention.',
      tip: 'Excellent for pairing with pelvic floor squeezes and deep belly breathing to calm excessive urgency.',
    },
    full: {
      title: 'Full (Base to Tip)',
      range: '100% full stroke coverage from root to tip',
      desc: 'The complete physical movement engaging the full shaft and head across every stroke cycle. Highest continuous sensation.',
      tip: 'Best reserved for final sprint builds or powerful rhythmic release waves.',
    },
  };

  const current = depthDescriptions[selectedDepth];
  const activeColor = getDepthColor(selectedDepth);

  return (
    <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
        Stroke Depth Anatomical Guide
      </h3>

      {/* Interactive Selection Tabs */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
        {(['tip', 'shallow', 'mid', 'deep', 'full'] as StrokeDepth[]).map(depth => (
          <button
            key={depth}
            type="button"
            onClick={() => setSelectedDepth(depth)}
            className="btn-tactile"
            style={{
              padding: '6px 12px',
              minHeight: '34px',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              borderRadius: '10px',
              background: selectedDepth === depth ? getDepthColor(depth) : 'rgba(255, 255, 255, 0.05)',
              color: selectedDepth === depth ? (depth === 'tip' ? '#000' : '#fff') : 'var(--text-secondary)',
              border: `1px solid ${selectedDepth === depth ? getDepthColor(depth) : 'var(--border-subtle)'}`,
            }}
          >
            {depth}
          </button>
        ))}
      </div>

      {/* Visual Diagram Representation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        padding: '16px',
        background: 'rgba(0, 0, 0, 0.4)',
        borderRadius: '14px',
        border: '1px solid var(--border-subtle)',
      }}>
        {/* Anatomical Shaft Representation Bar */}
        <div style={{
          position: 'relative',
          width: '32px',
          height: '180px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1.5px solid rgba(255, 255, 255, 0.1)',
        }}>
          {/* Tip */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '20%',
            background: selectedDepth === 'tip' || selectedDepth === 'full' ? 'var(--depth-tip)' : 'transparent',
            borderBottom: '1px dashed rgba(255,255,255,0.2)',
            transition: 'background 0.2s',
          }} />

          {/* Shallow */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: 0,
            right: 0,
            height: '20%',
            background: selectedDepth === 'shallow' || selectedDepth === 'full' ? 'var(--depth-shallow)' : 'transparent',
            borderBottom: '1px dashed rgba(255,255,255,0.2)',
            transition: 'background 0.2s',
          }} />

          {/* Mid */}
          <div style={{
            position: 'absolute',
            top: '40%',
            left: 0,
            right: 0,
            height: '30%',
            background: selectedDepth === 'mid' || selectedDepth === 'full' ? 'var(--depth-mid)' : 'transparent',
            borderBottom: '1px dashed rgba(255,255,255,0.2)',
            transition: 'background 0.2s',
          }} />

          {/* Deep / Base */}
          <div style={{
            position: 'absolute',
            top: '70%',
            left: 0,
            right: 0,
            bottom: 0,
            background: selectedDepth === 'deep' || selectedDepth === 'full' ? 'var(--depth-deep)' : 'transparent',
            transition: 'background 0.2s',
          }} />
        </div>

        {/* Selected Depth Description Card */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '17px', fontWeight: 700, color: activeColor }}>
            {current.title}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-amber)', marginTop: '2px' }}>
            {current.range}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.45 }}>
            {current.desc}
          </div>
          <div style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            marginTop: '8px',
            fontStyle: 'italic',
            borderLeft: `2px solid ${activeColor}`,
            paddingLeft: '8px',
          }}>
            💡 {current.tip}
          </div>
        </div>
      </div>
    </div>
  );
};
