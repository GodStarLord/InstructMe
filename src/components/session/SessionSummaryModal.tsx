import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { SessionRecord, StartingArousal } from '../../types';
import { formatTime } from '../../utils/formatters';
import { storage } from '../../core/db/storage';
import { audioEngine } from '../../core/audio/audioEngine';
import { Star, Trophy, Clock, Zap, CheckCircle2, ChevronRight } from 'lucide-react';

interface SessionSummaryModalProps {
  isOpen: boolean;
  durationSeconds: number;
  edgesCount: number;
  climaxReached: boolean;
  startingArousal: StartingArousal;
  onFinish: () => void;
}

export const SessionSummaryModal: React.FC<SessionSummaryModalProps> = ({
  isOpen,
  durationSeconds,
  edgesCount,
  climaxReached,
  startingArousal,
  onFinish,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [notes, setNotes] = useState<string>('');
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      if (climaxReached) {
        audioEngine.playClimaxFanfare();
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f43f5e', '#e0a899', '#8b5cf6', '#e5a95d'],
          });
        } catch {}
      }
    }
  }, [isOpen, climaxReached]);

  if (!isOpen) return null;

  const handleSave = () => {
    const record: SessionRecord = {
      id: 'sess_' + Date.now(),
      timestamp: Date.now(),
      durationSeconds,
      edgesCount,
      avgSps: 1.6,
      climaxReached,
      pleasureRating: rating,
      startingArousal,
      notes,
      depthStats: { tip: 20, shallow: 30, mid: 25, deep: 15, full: 10 },
    };

    storage.saveSession(record);
    setSaved(true);
    setTimeout(() => {
      onFinish();
    }, 400);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 110,
      background: 'rgba(5, 5, 8, 0.92)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            padding: '12px',
            borderRadius: '50%',
            background: climaxReached ? 'rgba(244, 63, 94, 0.15)' : 'rgba(45, 212, 191, 0.15)',
            color: climaxReached ? 'var(--accent-coral)' : 'var(--accent-cyan)',
            marginBottom: '10px',
          }}>
            {climaxReached ? <Trophy size={32} /> : <CheckCircle2 size={32} />}
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800 }} className="text-gradient-rose">
            {climaxReached ? 'Powerful Release!' : 'Session Complete'}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {climaxReached ? 'Congratulations on mastering your endurance.' : 'Great stamina discipline logged.'}
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
            <div style={{ color: 'var(--accent-amber)' }}><Clock size={22} /></div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Duration</div>
              <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{formatTime(durationSeconds)}</div>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
            <div style={{ color: 'var(--accent-violet)' }}><Zap size={22} /></div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Edges Held</div>
              <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{edgesCount}</div>
            </div>
          </div>
        </div>

        {/* Pleasure Rating */}
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Pleasure & Control Rating
          </label>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: star <= rating ? 'var(--accent-amber)' : 'rgba(255, 255, 255, 0.15)',
                  transition: 'transform 0.1s',
                }}
              >
                <Star size={30} fill={star <= rating ? 'var(--accent-amber)' : 'none'} />
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Personal Notes (Private)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did your control feel? Any techniques that worked best?"
            style={{
              width: '100%',
              height: '65px',
              marginTop: '6px',
              padding: '10px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              fontSize: '13px',
              fontFamily: 'var(--font-sans)',
              resize: 'none',
              outline: 'none',
            }}
          />
        </div>

        {/* Save & Finish Button */}
        <button
          className="btn-tactile btn-primary"
          onClick={handleSave}
          disabled={saved}
          style={{ width: '100%', height: '50px', fontSize: '16px' }}
        >
          <span>{saved ? 'Saved!' : 'Save & View Summary'}</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
