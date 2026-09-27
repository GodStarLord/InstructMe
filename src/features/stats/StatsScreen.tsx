import React, { useState, useEffect } from 'react';
import { SessionRecord } from '../../types';
import { storage } from '../../core/db/storage';
import { formatTime } from '../../utils/formatters';
import { AiAdviceCard } from './AiAdviceCard';
import { BarChart3, Clock, Zap, Flame, Trophy, Trash2, ArrowLeft } from 'lucide-react';

interface StatsScreenProps {
  onBack: () => void;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({ onBack }) => {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);

  useEffect(() => {
    setSessions(storage.getSessions());
  }, []);

  const totalSessions = sessions.length;
  const totalSeconds = sessions.reduce((acc, s) => acc + s.durationSeconds, 0);
  const totalEdges = sessions.reduce((acc, s) => acc + s.edgesCount, 0);
  const avgRating = totalSessions > 0 
    ? (sessions.reduce((acc, s) => acc + s.pleasureRating, 0) / totalSessions).toFixed(1)
    : '5.0';

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your local session history?')) {
      storage.clearAllSessions();
      setSessions([]);
    }
  };

  // Recent 7 sessions for visual SVG chart
  const recentSessions = [...sessions].reverse().slice(-7);
  const maxDuration = Math.max(...recentSessions.map(s => s.durationSeconds), 60);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      padding: '20px',
      paddingBottom: 'calc(var(--safe-bottom) + 24px)',
      background: 'var(--bg-primary)',
      gap: '18px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onBack}
            className="btn-tactile btn-secondary"
            style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%' }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800 }} className="text-gradient-rose">
              Endurance & Analytics
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Track stamina growth, edges & control
            </p>
          </div>
        </div>

        {totalSessions > 0 && (
          <button
            onClick={handleClearHistory}
            className="btn-tactile btn-secondary"
            style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%', color: 'var(--accent-coral)' }}
            title="Clear History"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="glass-card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)' }}>
            <Clock size={18} />
            <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>Total Time</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-mono)', marginTop: '6px' }}>
            {formatTime(totalSeconds)}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-violet)' }}>
            <Zap size={18} />
            <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>Edges Held</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-mono)', marginTop: '6px' }}>
            {totalEdges}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-coral)' }}>
            <Flame size={18} />
            <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>Sessions</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-mono)', marginTop: '6px' }}>
            {totalSessions}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-rose)' }}>
            <Trophy size={18} />
            <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>Avg Rating</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-mono)', marginTop: '6px' }}>
            {avgRating} ★
          </div>
        </div>
      </div>

      {/* AI Stamina Coach Section */}
      <AiAdviceCard sessions={sessions} />

      {/* Visual Chart: Session Durations */}
      {recentSessions.length > 0 && (
        <div className="glass-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <BarChart3 size={18} color="var(--accent-rose)" />
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>
              Recent Endurance Progression
            </h3>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            height: '130px',
            paddingTop: '20px',
            gap: '8px',
          }}>
            {recentSessions.map((sess, idx) => {
              const heightPct = Math.max(15, (sess.durationSeconds / maxDuration) * 100);
              return (
                <div key={sess.id || idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {formatTime(sess.durationSeconds)}
                  </span>
                  <div style={{
                    width: '100%',
                    maxWidth: '28px',
                    height: `${heightPct}%`,
                    background: sess.climaxReached 
                      ? 'linear-gradient(to top, var(--accent-coral), var(--accent-rose))'
                      : 'linear-gradient(to top, var(--accent-violet), var(--depth-tip))',
                    borderRadius: '6px 6px 2px 2px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                  }} />
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                    #{totalSessions - recentSessions.length + idx + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Session Logs List */}
      <div>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '10px' }}>
          Session History
        </h3>

        {sessions.length === 0 ? (
          <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              No sessions recorded yet. Start your first session to begin logging stamina data!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sessions.map(s => (
              <div key={s.id} className="glass-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      background: s.climaxReached ? 'rgba(244, 63, 94, 0.2)' : 'rgba(45, 212, 191, 0.2)',
                      color: s.climaxReached ? 'var(--accent-coral)' : 'var(--accent-cyan)',
                    }}>
                      {s.climaxReached ? 'Release' : 'Edged'}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff', fontFamily: 'var(--font-mono)' }}>
                      {formatTime(s.durationSeconds)}
                    </span>
                  </div>

                  <span style={{ fontSize: '12px', color: 'var(--accent-violet)', fontWeight: 600 }}>
                    {s.edgesCount} Edges
                  </span>
                </div>

                {s.notes && (
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '2px' }}>
                    "{s.notes}"
                  </p>
                )}

                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {new Date(s.timestamp).toLocaleDateString()} at {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
