import React, { useEffect, useState } from 'react';

interface BreathingRingProps {
  remainingSeconds: number;
}

export const BreathingRing: React.FC<BreathingRingProps> = ({ remainingSeconds }) => {
  const [breathStage, setBreathStage] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [stageSecLeft, setStageSecLeft] = useState<number>(4);

  useEffect(() => {
    // 4-7-8 pattern: Inhale 4s -> Hold 7s -> Exhale 8s (19s cycle)
    const cyclePos = (24 - remainingSeconds) % 19;
    if (cyclePos < 4) {
      setBreathStage('Inhale');
      setStageSecLeft(4 - Math.floor(cyclePos));
    } else if (cyclePos < 11) {
      setBreathStage('Hold');
      setStageSecLeft(11 - Math.floor(cyclePos));
    } else {
      setBreathStage('Exhale');
      setStageSecLeft(19 - Math.floor(cyclePos));
    }
  }, [remainingSeconds]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      gap: '16px',
    }}>
      <div style={{
        position: 'relative',
        width: '200px',
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(13, 148, 136, 0.25) 0%, rgba(10, 10, 14, 0.9) 70%)',
        border: '2px solid rgba(45, 212, 191, 0.5)',
        boxShadow: '0 0 40px rgba(45, 212, 191, 0.3), inset 0 0 20px rgba(45, 212, 191, 0.2)',
        transform: breathStage === 'Inhale' ? 'scale(1.12)' : breathStage === 'Hold' ? 'scale(1.12)' : 'scale(0.85)',
        transition: 'transform 3.5s ease-in-out',
      }}>
        <span style={{
          fontSize: '28px',
          fontWeight: 700,
          color: '#fff',
          textShadow: '0 0 16px rgba(45, 212, 191, 0.8)',
          letterSpacing: '1px',
        }}>
          {breathStage}
        </span>
        <span style={{
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--accent-cyan)',
          marginTop: '4px',
        }}>
          {stageSecLeft}s
        </span>
      </div>

      <div style={{
        textAlign: 'center',
        maxWidth: '280px',
      }}>
        <div style={{
          fontSize: '16px',
          fontWeight: 600,
          color: 'var(--accent-cyan)',
          marginBottom: '4px',
        }}>
          4-7-8 Deep Recovery Breath
        </div>
        <div style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: 1.4,
        }}>
          Relax your pelvic muscles completely. Drop your shoulders and let arousal settle down.
        </div>
      </div>
    </div>
  );
};
