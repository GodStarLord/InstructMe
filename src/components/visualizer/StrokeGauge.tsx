import React from 'react';
import { StrokeDepth, StrokeTechnique } from '../../types';
import { formatCadence, getDepthColor, getTechniqueLabel } from '../../utils/formatters';

interface StrokeGaugeProps {
  sps: number;
  depth: StrokeDepth;
  technique: StrokeTechnique;
  beatProgress: number; // 0 to 1
  cueMessage: string;
}

export const StrokeGauge: React.FC<StrokeGaugeProps> = ({
  sps,
  depth,
  technique,
  beatProgress,
  cueMessage,
}) => {
  const depthColor = getDepthColor(depth);
  const cadenceText = formatCadence(sps);
  
  // Calculate pulse scale based on beatProgress
  const pulseScale = sps > 0 ? 1 + 0.08 * Math.sin(beatProgress * Math.PI) : 1;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px 16px',
      position: 'relative',
    }}>
      {/* Halo Pulsing Glow Ring */}
      <div style={{
        position: 'relative',
        width: '180px',
        height: '180px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(20, 20, 28, 0.9) 0%, rgba(10, 10, 14, 0.95) 70%)',
        border: `2px solid ${depthColor}55`,
        boxShadow: `0 0 ${sps > 0 ? 30 : 10}px ${depthColor}33, inset 0 0 20px rgba(0, 0, 0, 0.8)`,
        transform: `scale(${pulseScale})`,
        transition: sps > 0 ? 'none' : 'transform 0.3s ease',
      }}>
        {/* SPS Numerical Value */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '4px',
        }}>
          <span style={{
            fontSize: '52px',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            color: '#fff',
            lineHeight: 1,
            letterSpacing: '-1px',
            textShadow: `0 0 20px ${depthColor}`,
          }}>
            {sps > 0 ? sps.toFixed(1) : '0.0'}
          </span>
          <span style={{
            fontSize: '14px',
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
          }}>
            SPS
          </span>
        </div>

        {/* Human Intuitive Cadence (e.g. 5 strokes in 2s) */}
        <div style={{
          marginTop: '6px',
          padding: '4px 10px',
          background: 'rgba(255, 255, 255, 0.06)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <span style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--accent-rose)',
            letterSpacing: '0.2px',
          }}>
            {cadenceText}
          </span>
        </div>
      </div>

      {/* Technique & Cue Banner */}
      <div style={{
        marginTop: '16px',
        textAlign: 'center',
        maxWidth: '300px',
      }}>
        <div style={{
          fontSize: '13px',
          fontWeight: 700,
          color: depthColor,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '2px',
        }}>
          {getTechniqueLabel(technique)}
        </div>
        <div style={{
          fontSize: '15px',
          fontWeight: 500,
          color: 'var(--text-primary)',
          opacity: 0.9,
        }}>
          {cueMessage}
        </div>
      </div>
    </div>
  );
};
