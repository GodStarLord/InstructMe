import React, { useState, useEffect, useRef } from 'react';
import { SessionConfig, SessionPhase, StrokeState } from '../../types';
import { SessionScheduler } from '../../core/engine/scheduler';
import { audioEngine } from '../../core/audio/audioEngine';
import { hapticsEngine } from '../../core/haptics/hapticsEngine';
import { screenWakeLock } from '../../core/wakelock/wakeLock';
import { StrokeRodVisualizer } from '../../components/visualizer/StrokeRodVisualizer';
import { StrokeGauge } from '../../components/visualizer/StrokeGauge';
import { BreathingRing } from '../../components/visualizer/BreathingRing';
import { MusclePrompt } from '../../components/visualizer/MusclePrompt';
import { ControlsBar } from '../../components/session/ControlsBar';
import { SessionSummaryModal } from '../../components/session/SessionSummaryModal';
import { formatTime } from '../../utils/formatters';
import { X, ShieldAlert, Zap, Flame, Clock } from 'lucide-react';

interface SessionScreenProps {
  config: SessionConfig;
  onExit: () => void;
  onOpenWiki: () => void;
}

export const SessionScreen: React.FC<SessionScreenProps> = ({
  config,
  onExit,
  onOpenWiki,
}) => {
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [currentPhase, setCurrentPhase] = useState<SessionPhase>('warmup');
  const [cueMessage, setCueMessage] = useState<string>('Preparing rhythm...');
  const [edgeCount, setEdgeCount] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Live stroke state
  const [strokeState, setStrokeState] = useState<StrokeState>({
    sps: 1.0,
    depth: 'mid',
    technique: 'continuous',
    isUpstroke: false,
    beatProgress: 0,
    remainingHoldSec: 0,
  });

  // Summary modal state
  const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);
  const [climaxAchieved, setClimaxAchieved] = useState<boolean>(false);

  const schedulerRef = useRef<SessionScheduler | null>(null);

  useEffect(() => {
    // Request Screen Wake Lock so screen does not dim
    screenWakeLock.request();
    audioEngine.unlock();

    const scheduler = new SessionScheduler(config, {
      onStrokeStateUpdate: (state, elapsed, phase, cue) => {
        setStrokeState(state);
        setSecondsElapsed(elapsed);
        setCurrentPhase(phase);
        setCueMessage(cue);
      },
      onEdgeCountUpdate: (edges) => {
        setEdgeCount(edges);
      },
      onSessionComplete: (duration, edges, climax) => {
        setClimaxAchieved(climax);
        setIsSummaryOpen(true);
      },
    });

    schedulerRef.current = scheduler;
    scheduler.start();

    return () => {
      scheduler.stop();
      screenWakeLock.release();
    };
  }, [config]);

  const handlePanic = () => {
    schedulerRef.current?.triggerPanic();
  };

  const handleResumeFromPanic = () => {
    schedulerRef.current?.resumeFromPanic();
  };

  const handleEdge = () => {
    schedulerRef.current?.triggerEdge();
  };

  const handleClimaxSprint = () => {
    schedulerRef.current?.triggerClimaxSprint();
  };

  const handleTogglePause = () => {
    if (isPaused) {
      schedulerRef.current?.resume();
      setIsPaused(false);
    } else {
      schedulerRef.current?.pause();
      setIsPaused(true);
    }
    hapticsEngine.triggerTap();
  };

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    audioEngine.setMuted(nextMute);
    hapticsEngine.triggerTap();
  };

  const handleEndEarly = () => {
    schedulerRef.current?.stop(false);
  };

  const getPhaseBadge = () => {
    switch (currentPhase) {
      case 'warmup':
        return { label: 'Warmup Wave', bg: 'rgba(56, 189, 248, 0.15)', color: 'var(--depth-tip)' };
      case 'escalation':
        return { label: 'Pacing Escalation', bg: 'rgba(224, 168, 153, 0.15)', color: 'var(--accent-rose)' };
      case 'edge_plateau':
        return { label: 'Edge Plateau', bg: 'rgba(139, 92, 246, 0.2)', color: 'var(--accent-violet)' };
      case 'panic_recovery':
        return { label: 'Panic Recovery', bg: 'rgba(45, 212, 191, 0.2)', color: 'var(--accent-cyan)' };
      case 'climax_sprint':
        return { label: 'Climax Sprint', bg: 'rgba(244, 63, 94, 0.25)', color: 'var(--accent-coral)' };
      default:
        return { label: 'Active Rhythm', bg: 'rgba(255, 255, 255, 0.1)', color: '#fff' };
    }
  };

  const badge = getPhaseBadge();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        paddingTop: 'calc(var(--safe-top) + 12px)',
        zIndex: 10,
      }}>
        {/* Phase Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '20px',
          background: badge.bg,
          border: `1px solid ${badge.color}44`,
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: badge.color }} />
          <span style={{ fontSize: '12px', fontWeight: 700, color: badge.color, textTransform: 'uppercase' }}>
            {badge.label}
          </span>
        </div>

        {/* Center Live Session Timer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: 'var(--font-mono)',
          fontSize: '15px',
          fontWeight: 600,
          color: 'var(--text-secondary)',
        }}>
          <Clock size={16} />
          <span>{formatTime(secondsElapsed)}</span>
        </div>

        {/* Quit Button */}
        <button
          onClick={handleEndEarly}
          className="btn-tactile btn-secondary"
          style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%' }}
          title="Exit Session"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main Interactive Stage */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 16px',
      }}>
        {currentPhase === 'panic_recovery' ? (
          <BreathingRing remainingSeconds={strokeState.remainingHoldSec} />
        ) : strokeState.technique === 'squeeze' ? (
          <MusclePrompt remainingSec={strokeState.remainingHoldSec} />
        ) : (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <StrokeGauge
              sps={strokeState.sps}
              depth={strokeState.depth}
              technique={strokeState.technique}
              beatProgress={strokeState.beatProgress}
              cueMessage={cueMessage}
            />

            <StrokeRodVisualizer
              depth={strokeState.depth}
              technique={strokeState.technique}
              isUpstroke={strokeState.isUpstroke}
              beatProgress={strokeState.beatProgress}
              sps={strokeState.sps}
            />
          </div>
        )}
      </div>

      {/* Thumb-Zone Controls Bar */}
      <ControlsBar
        phase={currentPhase}
        isPaused={isPaused}
        isMuted={isMuted}
        edgeCount={edgeCount}
        onPanic={handlePanic}
        onResumeFromPanic={handleResumeFromPanic}
        onEdge={handleEdge}
        onClimaxSprint={handleClimaxSprint}
        onTogglePause={handleTogglePause}
        onToggleMute={handleToggleMute}
        onOpenWiki={onOpenWiki}
        onEndSession={() => schedulerRef.current?.stop(true)}
      />

      {/* Post-Session Summary & Rating Modal */}
      <SessionSummaryModal
        isOpen={isSummaryOpen}
        durationSeconds={secondsElapsed}
        edgesCount={edgeCount}
        climaxReached={climaxAchieved}
        startingArousal={config.startingArousal}
        onFinish={() => {
          setIsSummaryOpen(false);
          onExit();
        }}
      />
    </div>
  );
};
