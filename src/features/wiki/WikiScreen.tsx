import React, { useState, useEffect } from 'react';
import { DepthDiagram } from './DepthDiagram';
import { audioEngine } from '../../core/audio/audioEngine';
import { hapticsEngine } from '../../core/haptics/hapticsEngine';
import { formatCadence } from '../../utils/formatters';
import { ArrowLeft, BookOpen, Volume2, Shield, HeartHandshake, Play, Pause } from 'lucide-react';

interface WikiScreenProps {
  onBack: () => void;
}

export const WikiScreen: React.FC<WikiScreenProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'depths' | 'cadence' | 'kegel' | 'breathing'>('depths');
  
  // Cadence test ticker state
  const [testSps, setTestSps] = useState<number>(2.5);
  const [isTestingCadence, setIsTestingCadence] = useState<boolean>(false);

  useEffect(() => {
    let intervalId: number | null = null;
    let upstroke = false;

    if (isTestingCadence && testSps > 0) {
      const intervalMs = (1000 / testSps) / 2; // Tick for each half stroke
      intervalId = window.setInterval(() => {
        audioEngine.playStrokeBeat(upstroke, 'mid');
        hapticsEngine.triggerStroke(upstroke, 'mid');
        upstroke = !upstroke;
      }, intervalMs);
    }

    return () => {
      if (intervalId !== null) clearInterval(intervalId);
    };
  }, [isTestingCadence, testSps]);

  const testCadenceSamples = [
    { sps: 0.5, label: '0.5 SPS (1 stroke every 2s)', desc: 'Slow, sensory edging & control' },
    { sps: 1.0, label: '1.0 SPS (1 stroke per sec)', desc: 'Standard steady escalation' },
    { sps: 2.0, label: '2.0 SPS (2 strokes per sec)', desc: 'Fast rhythmic pacing' },
    { sps: 2.5, label: '2.5 SPS (5 strokes in 2s)', desc: 'Rapid teasing edge bursts' },
    { sps: 3.5, label: '3.5 SPS (7 strokes in 2s)', desc: 'Sprint intensity for climax' },
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      padding: '20px',
      paddingBottom: 'calc(var(--safe-bottom) + 24px)',
      background: 'var(--bg-primary)',
      gap: '16px',
    }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={() => {
            setIsTestingCadence(false);
            onBack();
          }}
          className="btn-tactile btn-secondary"
          style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%' }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800 }} className="text-gradient-rose">
            Technique Guide & Wiki
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Mastering depth, speed, pelvic floor & edge control
          </p>
        </div>
      </div>

      {/* Navigation Pills */}
      <div style={{
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        padding: '4px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '12px',
      }}>
        {[
          { id: 'depths', label: 'Stroke Depths' },
          { id: 'cadence', label: 'SPS & Speed' },
          { id: 'kegel', label: 'Kegels & PC' },
          { id: 'breathing', label: '4-7-8 Breathing' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setIsTestingCadence(false);
              setActiveTab(tab.id as typeof activeTab);
            }}
            className="btn-tactile"
            style={{
              flex: 1,
              minHeight: '36px',
              padding: '6px 12px',
              fontSize: '12px',
              borderRadius: '10px',
              whiteSpace: 'nowrap',
              background: activeTab === tab.id ? 'var(--accent-coral)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
              border: 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Depths */}
      {activeTab === 'depths' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <DepthDiagram />
          <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-rose)' }}>
              Why Depth Variation Matters
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Continuous full strokes cause sensory saturation and rapid involuntary ejaculation.
              By randomizing depth between <strong>Tip</strong>, <strong>Mid</strong>, and <strong>Deep</strong>, you engage different nerve pathways, keeping pleasure high while delaying the point of no return.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Cadence & SPS Interactive Demonstration */}
      {activeTab === 'cadence' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Interactive Pacing Demonstration
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              <strong>SPS (Strokes Per Second)</strong> measures the rhythm frequency. Test each cadence below to hear and feel the exact tempo.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {testCadenceSamples.map(sample => (
                <div
                  key={sample.sps}
                  onClick={() => {
                    setTestSps(sample.sps);
                    setIsTestingCadence(true);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: testSps === sample.sps && isTestingCadence ? 'rgba(244, 63, 94, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    border: testSps === sample.sps && isTestingCadence ? '1.5px solid var(--accent-coral)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>
                      {sample.label}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {sample.desc}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-tactile btn-secondary"
                    style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%' }}
                  >
                    {testSps === sample.sps && isTestingCadence ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                </div>
              ))}
            </div>

            {isTestingCadence && (
              <button
                className="btn-tactile btn-secondary"
                onClick={() => setIsTestingCadence(false)}
                style={{ width: '100%', height: '42px', marginTop: '6px' }}
              >
                Stop Cadence Audio
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Kegels & Pelvic Floor */}
      {activeTab === 'kegel' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--accent-violet)' }}>
              Pelvic Floor (PC Muscle) Control
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              The <strong>pubococcygeus (PC) muscle</strong> wraps around the base of your pelvis. It is responsible for involuntary spasms during ejaculation.
            </p>

            <div style={{ padding: '12px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-violet)' }}>
                How to Locate the Muscle:
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Next time you urinate, stop the stream mid-flow. That muscle you flexed is your PC muscle.
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
              <div>
                <strong style={{ color: '#fff', fontSize: '13px' }}>1. The Active Squeeze (Kegel)</strong>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Contracting builds erection hardness, strengthens muscular endurance, and increases blood engorgement.
                </p>
              </div>

              <div>
                <strong style={{ color: 'var(--accent-cyan)', fontSize: '13px' }}>2. The Reverse Kegel (Release)</strong>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  When approaching the edge, do NOT clench. Instead, consciously push gently downward and outward, like releasing a breath. This physically stops involuntary pelvic spasms!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: 4-7-8 Breathing */}
      {activeTab === 'breathing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--accent-cyan)' }}>
              The 4-7-8 Edge Reset Method
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              When arousal climbs toward 9/10, your sympathetic nervous system triggers elevated heart rate and muscle tension. The <strong>Panic / Hold</strong> mode activates the parasympathetic relaxation response.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '8px 0' }}>
              <div style={{ padding: '10px', background: 'rgba(45, 212, 191, 0.1)', borderRadius: '10px' }}>
                <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>Inhale (4s): </span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Deep breath through the nose into the lower belly.</span>
              </div>
              <div style={{ padding: '10px', background: 'rgba(45, 212, 191, 0.1)', borderRadius: '10px' }}>
                <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>Hold (7s): </span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Retain breath calmly, releasing all pelvic tension.</span>
              </div>
              <div style={{ padding: '10px', background: 'rgba(45, 212, 191, 0.1)', borderRadius: '10px' }}>
                <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>Exhale (8s): </span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Slow, steady release through pursed lips.</span>
              </div>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Running one 24-second cycle drops your arousal score from a critical 9 down to a controllable 5, allowing you to sustain the edge much longer.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
