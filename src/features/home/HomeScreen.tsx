import React, { useState } from 'react';
import { SessionConfig, SessionRecord } from '../../types';
import { formatCadence, formatTime } from '../../utils/formatters';
import { Play, Sliders, BookOpen, BarChart3, Zap, Flame, Sparkles, Shield, Clock } from 'lucide-react';

interface HomeScreenProps {
  config: SessionConfig;
  onOpenPreSession: () => void;
  onOpenConfig: () => void;
  onNavigate: (screen: 'routines' | 'wiki' | 'stats' | 'settings') => void;
  recentSession: SessionRecord | null;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  config,
  onOpenPreSession,
  onOpenConfig,
  onNavigate,
  recentSession,
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      padding: '20px',
      paddingBottom: 'calc(var(--safe-bottom) + 80px)',
      background: 'var(--bg-primary)',
      gap: '20px',
    }}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 'calc(var(--safe-top) + 8px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--accent-coral) 0%, var(--accent-violet) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px var(--accent-coral-glow)',
          }}>
            <Flame size={22} color="#fff" />
          </div>
          <div>
            <span style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px' }} className="text-gradient-rose">
              InstructMe
            </span>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Adaptive Cadence & Control
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate('settings')}
          className="btn-tactile btn-secondary"
          style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%' }}
          title="Settings & Privacy"
        >
          <Sliders size={18} />
        </button>
      </div>

      {/* Hero Quick Launch Card */}
      <div className="glass-panel" style={{
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse 90% 70% at 50% 0%, rgba(244, 63, 94, 0.16), rgba(19, 19, 26, 0.95))',
        border: '1px solid rgba(244, 63, 94, 0.25)',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '14px',
          background: 'rgba(244, 63, 94, 0.15)',
          color: 'var(--accent-rose)',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: '12px',
        }}>
          <Sparkles size={13} />
          <span>Randomized Pacing Engine</span>
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', lineHeight: 1.25 }}>
          Master Your Edge & Stamina
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.45 }}>
          Dynamic randomized strokes per second, depths, and guided 4-7-8 panic recovery for peak control.
        </p>

        {/* Current Config Badges */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '16px',
          padding: '12px 14px',
          background: 'rgba(0, 0, 0, 0.35)',
          borderRadius: '14px',
          border: '1px solid var(--border-subtle)',
        }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Speed Range
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)' }}>
              {config.minSps} – {config.maxSps} SPS
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              ({formatCadence(config.maxSps)})
            </div>
          </div>

          <button
            onClick={onOpenConfig}
            className="btn-tactile btn-secondary"
            style={{ minHeight: '34px', padding: '6px 12px', fontSize: '12px' }}
          >
            <Sliders size={13} />
            <span>Customize</span>
          </button>
        </div>

        {/* Big Tactile Start Button */}
        <button
          className="btn-tactile btn-primary"
          onClick={onOpenPreSession}
          style={{ width: '100%', height: '54px', fontSize: '16px', marginTop: '16px' }}
        >
          <Play size={20} fill="#fff" />
          <span>Start Pacing Session</span>
        </button>
      </div>

      {/* Recent Session Insight Banner */}
      {recentSession && (
        <div
          onClick={() => onNavigate('stats')}
          className="glass-card"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            cursor: 'pointer',
            border: '1px solid rgba(224, 168, 153, 0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(224, 168, 153, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-rose)',
            }}>
              <Clock size={18} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                Last Session: {formatTime(recentSession.durationSeconds)}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {recentSession.edgesCount} edges held • {recentSession.climaxReached ? 'Release' : 'Edged'}
              </div>
            </div>
          </div>

          <span style={{ fontSize: '12px', color: 'var(--accent-rose)', fontWeight: 600 }}>
            View Stats →
          </span>
        </div>
      )}

      {/* Quick Access Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {/* Curated Routines Card */}
        <div
          onClick={() => onNavigate('routines')}
          className="glass-card"
          style={{
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            cursor: 'pointer',
          }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(139, 92, 246, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-violet)',
          }}>
            <Zap size={20} />
          </div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>
            Programs & Routines
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
            Stamina builder, Edge mastery & custom ladders
          </div>
        </div>

        {/* Wiki / Terminology Card */}
        <div
          onClick={() => onNavigate('wiki')}
          className="glass-card"
          style={{
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            cursor: 'pointer',
          }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(56, 189, 248, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--depth-tip)',
          }}>
            <BookOpen size={20} />
          </div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>
            Technique Wiki
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
            Tip, Shallow, Mid, Deep diagrams & cadence demo
          </div>
        </div>
      </div>
    </div>
  );
};
