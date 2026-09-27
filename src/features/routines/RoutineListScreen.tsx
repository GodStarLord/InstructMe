import React, { useState } from 'react';
import { Routine } from '../../types';
import { formatTime } from '../../utils/formatters';
import { Sparkles, Zap, Flame, ShieldAlert, Plus, Play, Clock, ArrowLeft } from 'lucide-react';

interface RoutineListScreenProps {
  onSelectRoutine: (routine: Routine) => void;
  onBack: () => void;
}

export const PRESET_ROUTINES: Routine[] = [
  {
    id: 'routine_stamina_builder',
    title: 'The Stamina Architect',
    description: 'Structured endurance ladder starting with shallow steady rhythm, moving into deep base pacing and edge waves.',
    category: 'endurance',
    totalDurationSeconds: 900, // 15 mins
    steps: [
      {
        id: 's1',
        name: 'Gentle Arousal Warmup',
        phase: 'warmup',
        durationSeconds: 180,
        minSps: 0.6,
        maxSps: 1.0,
        allowedDepths: ['tip', 'shallow'],
        allowedTechniques: ['continuous'],
      },
      {
        id: 's2',
        name: 'Mid-Shaft Escalation',
        phase: 'escalation',
        durationSeconds: 300,
        minSps: 1.0,
        maxSps: 1.8,
        allowedDepths: ['mid', 'shallow'],
        allowedTechniques: ['continuous', 'push_stop'],
      },
      {
        id: 's3',
        name: 'Edge Retention Waves',
        phase: 'edge_plateau',
        durationSeconds: 420,
        minSps: 0.8,
        maxSps: 2.6,
        allowedDepths: ['tip', 'mid', 'deep', 'full'],
        allowedTechniques: ['continuous', 'pull_stop', 'squeeze'],
      },
    ],
  },
  {
    id: 'routine_edge_mastery',
    title: 'Edge Wave Mastery',
    description: 'Designed for advanced arousal control: rapid tip stimulation alternating with abrupt freezes and pelvic squeezes.',
    category: 'edge_mastery',
    totalDurationSeconds: 1200, // 20 mins
    steps: [
      {
        id: 'em1',
        name: 'Preparation & Calibration',
        phase: 'warmup',
        durationSeconds: 240,
        minSps: 0.8,
        maxSps: 1.2,
        allowedDepths: ['shallow', 'mid'],
        allowedTechniques: ['continuous'],
      },
      {
        id: 'em2',
        name: 'Unpredictable Plateau Waves',
        phase: 'edge_plateau',
        durationSeconds: 960,
        minSps: 0.5,
        maxSps: 3.2,
        allowedDepths: ['tip', 'shallow', 'mid', 'deep', 'full'],
        allowedTechniques: ['continuous', 'hold', 'squeeze', 'pull_stop'],
      },
    ],
  },
  {
    id: 'routine_quick_random',
    title: 'Quick Randomizer',
    description: 'Fast-paced 10-minute session featuring continuous randomized depth and cadence switches.',
    category: 'beginner',
    totalDurationSeconds: 600, // 10 mins
    steps: [
      {
        id: 'qr1',
        name: 'Dynamic Random Flow',
        phase: 'escalation',
        durationSeconds: 600,
        minSps: 0.8,
        maxSps: 2.4,
        allowedDepths: ['shallow', 'mid', 'deep'],
        allowedTechniques: ['continuous', 'push_stop'],
      },
    ],
  },
];

export const RoutineListScreen: React.FC<RoutineListScreenProps> = ({
  onSelectRoutine,
  onBack,
}) => {
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
            Training Routines
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Curated programs to train endurance and control
          </p>
        </div>
      </div>

      {/* Routine Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {PRESET_ROUTINES.map(routine => {
          const isEdge = routine.category === 'edge_mastery';
          const isEndurance = routine.category === 'endurance';

          return (
            <div
              key={routine.id}
              className="glass-card"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                border: isEdge 
                  ? '1px solid rgba(139, 92, 246, 0.4)'
                  : isEndurance
                  ? '1px solid rgba(224, 168, 153, 0.4)'
                  : '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 8px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    marginBottom: '6px',
                    background: isEdge ? 'rgba(139, 92, 246, 0.15)' : 'rgba(224, 168, 153, 0.15)',
                    color: isEdge ? 'var(--accent-violet)' : 'var(--accent-rose)',
                  }}>
                    {isEdge ? <Zap size={12} /> : <Flame size={12} />}
                    <span>{routine.category.replace('_', ' ')}</span>
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fff' }}>
                    {routine.title}
                  </h3>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '13px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent-amber)',
                  fontWeight: 600,
                }}>
                  <Clock size={14} />
                  <span>{Math.round(routine.totalDurationSeconds / 60)}m</span>
                </div>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                {routine.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {routine.steps.length} structured phases
                </span>

                <button
                  className="btn-tactile btn-primary"
                  onClick={() => onSelectRoutine(routine)}
                  style={{ minHeight: '38px', padding: '8px 16px', fontSize: '13px' }}
                >
                  <Play size={15} fill="#fff" />
                  <span>Start Routine</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
