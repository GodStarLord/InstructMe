import React, { useState } from 'react';
import { SessionRecord } from '../../types';
import { Sparkles, Brain, Lightbulb, RefreshCw } from 'lucide-react';
import { storage } from '../../core/db/storage';

interface AiAdviceCardProps {
  sessions: SessionRecord[];
}

export const AiAdviceCard: React.FC<AiAdviceCardProps> = ({ sessions }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [advice, setAdvice] = useState<string | null>(null);

  const generateAdvice = async () => {
    setLoading(true);
    const settings = storage.getSettings();
    const apiKey = settings.geminiApiKey;

    if (sessions.length === 0) {
      setAdvice('Complete your first session to unlock personalized stamina insights and pacing recommendations.');
      setLoading(false);
      return;
    }

    const totalEdges = sessions.reduce((acc, s) => acc + s.edgesCount, 0);
    const avgDurationMin = (sessions.reduce((acc, s) => acc + s.durationSeconds, 0) / sessions.length / 60).toFixed(1);
    const climaxCount = sessions.filter(s => s.climaxReached).length;

    if (apiKey) {
      try {
        const prompt = `You are InstructMe AI Stamina Coach. Analyze these male sexual stamina training metrics: Total sessions: ${sessions.length}, Average duration: ${avgDurationMin} minutes, Total edges held: ${totalEdges}, Successful climax releases: ${climaxCount}. Provide 2-3 concise, actionable, encouraging recommendations to improve endurance, edge plateau control, and pleasure. Keep tone clinical, sophisticated, and motivating. Under 80 words.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            setAdvice(text);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Gemini API call error, falling back to heuristic engine:', err);
      }
    }

    // Heuristic analysis engine (works 100% offline!)
    setTimeout(() => {
      let insight = '';
      const avgEdges = totalEdges / sessions.length;

      if (avgEdges < 2) {
        insight = `Your average session is ${avgDurationMin} min. Focus on engaging the Panic / Hold button earlier (at 7/10 arousal instead of 9/10). Incorporate more Reverse Kegels to relax your pelvic floor before involuntary contractions trigger.`;
      } else if (avgEdges >= 2 && avgEdges <= 4) {
        insight = `Great plateau control! You are holding an average of ${avgEdges.toFixed(1)} edges per session. To build further stamina, increase the duration of shallow tip teasing while keeping your breathing slow and diaphragmatic.`;
      } else {
        insight = `Exceptional mastery! Logging ${avgEdges.toFixed(1)} edges demonstrates advanced arousal regulation. Try varying stroke speeds between 0.5 SPS and 3.0 SPS to train your nervous system under high dopamine spikes.`;
      }

      setAdvice(insight);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="glass-card" style={{
      padding: '20px',
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(20, 20, 28, 0.8) 100%)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(139, 92, 246, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-violet)',
          }}>
            <Brain size={18} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>
              AI Stamina Coach
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Self-learning endurance analysis
            </div>
          </div>
        </div>

        <button
          onClick={generateAdvice}
          disabled={loading}
          className="btn-tactile btn-secondary"
          style={{ padding: '6px 12px', minHeight: '34px', fontSize: '12px', gap: '6px' }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>{advice ? 'Refresh' : 'Analyze'}</span>
        </button>
      </div>

      {advice ? (
        <div style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          padding: '12px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '12px',
          borderLeft: '3px solid var(--accent-violet)',
        }}>
          {advice}
        </div>
      ) : (
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
          Tap <strong>Analyze</strong> to evaluate your edge retention habits, pacing distribution, and get custom recommendations.
        </p>
      )}
    </div>
  );
};
