import React from 'react';
import { ShieldAlert, Zap, Flame, Pause, Play, Volume2, VolumeX, HelpCircle } from 'lucide-react';
import { SessionPhase } from '../../types';

interface ControlsBarProps {
  phase: SessionPhase;
  isPaused: boolean;
  isMuted: boolean;
  edgeCount: number;
  onPanic: () => void;
  onResumeFromPanic: () => void;
  onEdge: () => void;
  onClimaxSprint: () => void;
  onTogglePause: () => void;
  onToggleMute: () => void;
  onOpenWiki: () => void;
  onEndSession: () => void;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  phase,
  isPaused,
  isMuted,
  edgeCount,
  onPanic,
  onResumeFromPanic,
  onEdge,
  onClimaxSprint,
  onTogglePause,
  onToggleMute,
  onOpenWiki,
  onEndSession,
}) => {
  const isPanicState = phase === 'panic_recovery';
  const isClimaxState = phase === 'climax_sprint';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      padding: '16px 20px',
      paddingBottom: 'calc(var(--safe-bottom) + 12px)',
      background: 'linear-gradient(to top, rgba(10, 10, 14, 0.98) 0%, rgba(10, 10, 14, 0.85) 85%, transparent 100%)',
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid var(--border-subtle)',
      width: '100%',
    }}>
      {/* Prime Lower-Third Thumb-Zone: Large Action Triggers */}
      {isPanicState ? (
        <button
          className="btn-tactile btn-panic"
          onClick={onResumeFromPanic}
          style={{ width: '100%', height: '56px', fontSize: '17px' }}
        >
          <Play size={22} fill="#fff" />
          <span>I'm Ready • Resume Session</span>
        </button>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {/* Panic / Breathe Button */}
          <button
            className="btn-tactile btn-panic"
            onClick={onPanic}
            style={{ height: '56px', fontSize: '15px' }}
            title="Instant halt to regain control"
          >
            <ShieldAlert size={20} />
            <span>PANIC / HOLD</span>
          </button>

          {/* I'm Close / Edge Button */}
          <button
            className="btn-tactile btn-edge"
            onClick={onEdge}
            style={{ height: '56px', fontSize: '15px' }}
            title="Log an edge and sustain plateau"
          >
            <Zap size={20} />
            <span>I'M CLOSE ({edgeCount})</span>
          </button>
        </div>
      )}

      {/* Climax Sprint & Secondary Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
      }}>
        {/* Climax Sprint Trigger */}
        {!isPanicState && !isClimaxState ? (
          <button
            className="btn-tactile"
            onClick={onClimaxSprint}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.25) 0%, rgba(225, 29, 72, 0.35) 100%)',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              color: 'var(--accent-rose)',
              height: '44px',
              fontSize: '14px',
            }}
          >
            <Flame size={18} />
            <span>Ready for Climax?</span>
          </button>
        ) : isClimaxState ? (
          <button
            className="btn-tactile btn-primary"
            onClick={() => onEndSession()}
            style={{ flex: 1, height: '44px', fontSize: '14px' }}
          >
            <Flame size={18} />
            <span>Complete & Celebrate Release 🎉</span>
          </button>
        ) : null}

        {/* Quick Icon Utilities */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className="btn-tactile btn-secondary"
            onClick={onTogglePause}
            style={{ width: '44px', height: '44px', padding: 0 }}
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play size={18} /> : <Pause size={18} />}
          </button>

          <button
            className="btn-tactile btn-secondary"
            onClick={onToggleMute}
            style={{ width: '44px', height: '44px', padding: 0 }}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <button
            className="btn-tactile btn-secondary"
            onClick={onOpenWiki}
            style={{ width: '44px', height: '44px', padding: 0 }}
            title="Terminology Guide & Wiki"
          >
            <HelpCircle size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
