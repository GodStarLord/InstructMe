import React from 'react';

interface MusclePromptProps {
  remainingSec: number;
}

export const MusclePrompt: React.FC<MusclePromptProps> = ({ remainingSec }) => {
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
        width: '180px',
        height: '180px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(10, 10, 14, 0.9) 70%)',
        border: '2px solid rgba(139, 92, 246, 0.6)',
        boxShadow: '0 0 35px rgba(139, 92, 246, 0.35)',
        animation: 'pulse-ring 1.5s infinite ease-in-out',
      }}>
        <span style={{
          fontSize: '26px',
          fontWeight: 800,
          color: '#fff',
          textShadow: '0 0 16px rgba(139, 92, 246, 0.9)',
          letterSpacing: '1px',
          textTransform: 'uppercase',
        }}>
          SQUEEZE
        </span>
        <span style={{
          fontSize: '18px',
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
          color: 'var(--accent-violet)',
          marginTop: '6px',
        }}>
          {remainingSec}s
        </span>
      </div>

      <div style={{
        textAlign: 'center',
        maxWidth: '280px',
      }}>
        <div style={{
          fontSize: '15px',
          fontWeight: 600,
          color: 'var(--accent-violet)',
          marginBottom: '4px',
        }}>
          Kegel / Pelvic Floor Flex
        </div>
        <div style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: 1.4,
        }}>
          Contract the same muscle used to stop urine flow. Hold tight without holding your breath.
        </div>
      </div>
    </div>
  );
};
