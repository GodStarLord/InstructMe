import React from 'react';
import { StrokeDepth, StrokeTechnique } from '../../types';
import { getDepthColor, getDepthLabel } from '../../utils/formatters';

interface StrokeRodVisualizerProps {
  depth: StrokeDepth;
  technique: StrokeTechnique;
  isUpstroke: boolean;
  beatProgress: number; // 0 to 1
  sps: number;
}

export const StrokeRodVisualizer: React.FC<StrokeRodVisualizerProps> = ({
  depth,
  technique,
  isUpstroke,
  beatProgress,
  sps,
}) => {
  // Map depths to percentage height on the rod (0% is base, 100% is tip)
  // When stroking:
  // Downstroke (push): moves from tip (100%) down to target depth
  // Upstroke (pull): moves from target depth back up toward tip
  const depthPercentages: Record<StrokeDepth, number> = {
    tip: 85,
    shallow: 70,
    mid: 50,
    deep: 25,
    full: 5,
  };

  const targetPercentage = depthPercentages[depth];

  // Calculate current cursor position (0 = base, 100 = tip)
  let currentPosition = targetPercentage;
  if (sps > 0 && technique !== 'hold' && technique !== 'squeeze') {
    if (beatProgress < 0.5) {
      // Downstroke (0 to 0.5): moves from 95% down to targetPercentage
      const p = beatProgress * 2; // 0 to 1
      currentPosition = 95 - p * (95 - targetPercentage);
    } else {
      // Upstroke (0.5 to 1.0): moves from targetPercentage back up to 95%
      const p = (beatProgress - 0.5) * 2; // 0 to 1
      currentPosition = targetPercentage + p * (95 - targetPercentage);
    }
  }

  const activeColor = getDepthColor(depth);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
      padding: '16px 20px',
      width: '100%',
    }}>
      {/* Dynamic Stroke Cylinder Bar */}
      <div style={{
        position: 'relative',
        width: '42px',
        height: '240px',
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1.5px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 16px rgba(0, 0, 0, 0.8)',
      }}>
        {/* Depth Zone Dividers */}
        <div style={{ position: 'absolute', top: '15%', left: 0, right: 0, height: '1px', background: 'rgba(56, 189, 248, 0.25)' }} />
        <div style={{ position: 'absolute', top: '30%', left: 0, right: 0, height: '1px', background: 'rgba(167, 139, 250, 0.25)' }} />
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(224, 168, 153, 0.25)' }} />
        <div style={{ position: 'absolute', top: '75%', left: 0, right: 0, height: '1px', background: 'rgba(251, 146, 60, 0.25)' }} />

        {/* Active Target Zone Highlight Fill */}
        <div style={{
          position: 'absolute',
          top: `${100 - targetPercentage}%`,
          bottom: 0,
          left: 0,
          right: 0,
          background: `linear-gradient(to top, ${activeColor}33, ${activeColor}11)`,
          transition: 'top 0.3s ease-out, background 0.3s ease-out',
        }} />

        {/* Moving Stroke Ring Cursor */}
        <div style={{
          position: 'absolute',
          bottom: `${currentPosition}%`,
          left: '3px',
          right: '3px',
          height: '14px',
          background: activeColor,
          borderRadius: '7px',
          transform: 'translateY(50%)',
          boxShadow: `0 0 16px ${activeColor}, 0 0 4px #fff`,
          border: '1.5px solid #fff',
          transition: sps > 0 ? 'none' : 'bottom 0.2s ease',
        }} />
      </div>

      {/* Depth Level Markers & Direction Guide */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '240px',
        padding: '6px 0',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          opacity: depth === 'tip' ? 1 : 0.4,
          transition: 'all 0.2s',
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--depth-tip)' }} />
          <span style={{ fontSize: '13px', fontWeight: depth === 'tip' ? 700 : 500, color: depth === 'tip' ? 'var(--depth-tip)' : 'var(--text-secondary)' }}>
            Tip (Glans)
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          opacity: depth === 'shallow' ? 1 : 0.4,
          transition: 'all 0.2s',
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--depth-shallow)' }} />
          <span style={{ fontSize: '13px', fontWeight: depth === 'shallow' ? 700 : 500, color: depth === 'shallow' ? 'var(--depth-shallow)' : 'var(--text-secondary)' }}>
            Shallow (Upper 1/3)
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          opacity: depth === 'mid' ? 1 : 0.4,
          transition: 'all 0.2s',
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--depth-mid)' }} />
          <span style={{ fontSize: '13px', fontWeight: depth === 'mid' ? 700 : 500, color: depth === 'mid' ? 'var(--depth-mid)' : 'var(--text-secondary)' }}>
            Mid (Center Shaft)
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          opacity: depth === 'deep' ? 1 : 0.4,
          transition: 'all 0.2s',
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--depth-deep)' }} />
          <span style={{ fontSize: '13px', fontWeight: depth === 'deep' ? 700 : 500, color: depth === 'deep' ? 'var(--depth-deep)' : 'var(--text-secondary)' }}>
            Deep (Lower 2/3)
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          opacity: depth === 'full' ? 1 : 0.4,
          transition: 'all 0.2s',
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--depth-full)' }} />
          <span style={{ fontSize: '13px', fontWeight: depth === 'full' ? 700 : 500, color: depth === 'full' ? 'var(--depth-full)' : 'var(--text-secondary)' }}>
            Full (Base to Tip)
          </span>
        </div>
      </div>

      {/* Real-time Movement Direction Tag */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '55px',
        padding: '10px 8px',
        background: 'rgba(255, 255, 255, 0.04)',
        borderRadius: '12px',
        border: '1px solid var(--border-subtle)',
      }}>
        {sps > 0 && technique !== 'hold' && technique !== 'squeeze' ? (
          <>
            <span style={{
              fontSize: '20px',
              color: isUpstroke ? 'var(--accent-rose)' : 'var(--accent-coral)',
              transform: isUpstroke ? 'translateY(-2px)' : 'translateY(2px)',
              transition: 'transform 0.1s',
            }}>
              {isUpstroke ? '▲' : '▼'}
            </span>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginTop: '4px',
              color: isUpstroke ? 'var(--accent-rose)' : 'var(--accent-coral)',
            }}>
              {isUpstroke ? 'Pull' : 'Push'}
            </span>
          </>
        ) : (
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
            HOLD
          </span>
        )}
      </div>
    </div>
  );
};
