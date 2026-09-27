import React, { useState } from 'react';
import { CheckSquare, Lock, Unlock, EyeOff } from 'lucide-react';

interface DiscreetOverlayProps {
  isOpen: boolean;
  pin: string;
  onExitDiscreet: () => void;
}

export const DiscreetOverlay: React.FC<DiscreetOverlayProps> = ({
  isOpen,
  pin,
  onExitDiscreet,
}) => {
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [showPinInput, setShowPinInput] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleUnlock = () => {
    if (!pin) {
      onExitDiscreet();
      return;
    }
    if (enteredPin === pin) {
      setEnteredPin('');
      setError(false);
      onExitDiscreet();
    } else {
      setError(true);
      setEnteredPin('');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: '#121214',
      color: '#d4d4d8',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '24px',
      overflowY: 'auto',
    }}>
      {/* Discreet Mock Productivity App Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #27272a',
        paddingBottom: '16px',
        marginBottom: '20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckSquare size={22} color="#3b82f6" />
          <span style={{ fontSize: '18px', fontWeight: 600, color: '#f4f4f5' }}>
            WorkFlow Notes
          </span>
        </div>

        {/* Camouflaged Exit Button */}
        <button
          onClick={() => {
            if (pin) setShowPinInput(true);
            else onExitDiscreet();
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#52525b',
            cursor: 'pointer',
            padding: '8px',
          }}
          title="Toggle view"
        >
          <Lock size={16} />
        </button>
      </div>

      {showPinInput ? (
        <div style={{
          maxWidth: '320px',
          margin: '40px auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}>
          <div style={{ fontSize: '15px', color: '#f4f4f5', fontWeight: 600 }}>Enter Access PIN</div>
          <input
            type="password"
            autoFocus
            maxLength={6}
            value={enteredPin}
            onChange={(e) => {
              setEnteredPin(e.target.value);
              setError(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleUnlock();
            }}
            placeholder="••••"
            style={{
              width: '140px',
              margin: '0 auto',
              padding: '10px',
              textAlign: 'center',
              fontSize: '22px',
              letterSpacing: '6px',
              borderRadius: '8px',
              background: '#27272a',
              border: error ? '1px solid #ef4444' : '1px solid #3f3f46',
              color: '#fff',
              outline: 'none',
            }}
          />
          {error && <span style={{ color: '#ef4444', fontSize: '12px' }}>Incorrect PIN</span>}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button
              onClick={() => setShowPinInput(false)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                background: '#27272a',
                color: '#a1a1aa',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleUnlock}
              style={{
                padding: '8px 20px',
                borderRadius: '6px',
                background: '#3b82f6',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Unlock
            </button>
          </div>
        </div>
      ) : (
        /* Innocent Mock Notes Content */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '15px', color: '#f4f4f5', fontWeight: 600, marginBottom: '6px' }}>
              Q3 Sprint Backlog & Objectives
            </h3>
            <p style={{ fontSize: '13px', color: '#a1a1aa', lineHeight: 1.5 }}>
              Review architecture milestones with backend engineering team. Align on performance benchmarking and asset optimization before production release.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#71717a' }}>
              <input type="checkbox" defaultChecked disabled />
              <span style={{ textDecoration: 'line-through' }}>Audit state container memory allocation</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#e4e4e7' }}>
              <input type="checkbox" defaultChecked={false} readOnly />
              <span>Verify static page deployment and responsive layouts</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#e4e4e7' }}>
              <input type="checkbox" defaultChecked={false} readOnly />
              <span>Draft release documentation and change logs</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
