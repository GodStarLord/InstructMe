import { StrokeDepth, StrokeTechnique } from '../types/session';

/**
 * Converts Strokes Per Second (SPS) into an intuitive, human-relatable cadence description.
 * e.g. 2.5 SPS -> "5 strokes in 2s"
 *      1.0 SPS -> "1 stroke per sec"
 *      0.5 SPS -> "1 stroke every 2s"
 */
export function formatCadence(sps: number): string {
  if (sps <= 0) return 'Paused / Hold';
  
  const rounded = Math.round(sps * 10) / 10;
  
  if (rounded === 0.25) return '1 stroke every 4s';
  if (rounded === 0.33 || rounded === 0.3) return '1 stroke every 3s';
  if (rounded === 0.5) return '1 stroke every 2s';
  if (rounded === 0.75 || rounded === 0.7 || rounded === 0.8) return '3 strokes in 4s';
  if (rounded === 1.0) return '1 stroke per sec';
  if (rounded === 1.5) return '3 strokes in 2s';
  if (rounded === 2.0) return '2 strokes per sec';
  if (rounded === 2.5) return '5 strokes in 2s';
  if (rounded === 3.0) return '3 strokes per sec';
  if (rounded === 3.5) return '7 strokes in 2s';
  if (rounded === 4.0) return '4 strokes per sec';
  
  // For fractional speeds, simplify fraction
  if (rounded < 1.0) {
    const secPerStroke = Math.round(1 / sps);
    return `1 stroke every ${secPerStroke}s`;
  }
  
  // Try 2s denominator
  const strokesIn2 = Math.round(sps * 2);
  if (Math.abs(strokesIn2 / 2 - sps) < 0.1) {
    return `${strokesIn2} strokes in 2s`;
  }

  return `${rounded} strokes / sec`;
}

/**
 * Formats seconds into mm:ss or hh:mm:ss string
 */
export function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getDepthLabel(depth: StrokeDepth): string {
  switch (depth) {
    case 'tip': return 'Tip (Glans)';
    case 'shallow': return 'Shallow (Upper 1/3)';
    case 'mid': return 'Mid (Central)';
    case 'deep': return 'Deep (Base)';
    case 'full': return 'Full (Base to Tip)';
  }
}

export function getDepthColor(depth: StrokeDepth): string {
  switch (depth) {
    case 'tip': return 'var(--depth-tip)';
    case 'shallow': return 'var(--depth-shallow)';
    case 'mid': return 'var(--depth-mid)';
    case 'deep': return 'var(--depth-deep)';
    case 'full': return 'var(--depth-full)';
  }
}

export function getTechniqueLabel(tech: StrokeTechnique): string {
  switch (tech) {
    case 'continuous': return 'Continuous Rhythm';
    case 'push_stop': return 'Push & Stop';
    case 'pull_stop': return 'Pull & Stop';
    case 'hold': return 'Hold & Freeze';
    case 'squeeze': return 'Squeeze Pelvic Floor';
    case 'breathe': return 'Deep Breath & Relax';
  }
}
