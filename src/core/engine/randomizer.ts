import { SessionConfig, SessionPhase, StrokeDepth, StrokeTechnique } from '../../types';

export interface NextSegment {
  durationSeconds: number;
  sps: number;
  depth: StrokeDepth;
  technique: StrokeTechnique;
  cueMessage: string;
}

export class StrokeRandomizer {
  private config: SessionConfig;
  private currentPhase: SessionPhase = 'warmup';
  private consecutiveHoldCount: number = 0;
  private lastDepth: StrokeDepth = 'mid';

  constructor(config: SessionConfig) {
    this.config = config;
  }

  public updateConfig(config: SessionConfig) {
    this.config = config;
  }

  public setPhase(phase: SessionPhase) {
    this.currentPhase = phase;
  }

  private getRandomDepth(): StrokeDepth {
    const depths = this.config.allowDepths && this.config.allowDepths.length > 0 
      ? this.config.allowDepths 
      : (['shallow', 'mid', 'deep', 'full'] as StrokeDepth[]);

    // 70% chance to change depth, 30% chance to maintain
    if (Math.random() > 0.3 && depths.length > 1) {
      const candidates = depths.filter(d => d !== this.lastDepth);
      const chosen = candidates[Math.floor(Math.random() * candidates.length)];
      this.lastDepth = chosen;
      return chosen;
    }
    return this.lastDepth;
  }

  /**
   * Generates the next randomized stroke segment based on phase and arousal
   */
  public getNextSegment(sessionSecondsElapsed: number, edgeCount: number): NextSegment {
    const { minSps, maxSps, allowSqueeze, allowPauses } = this.config;

    // Check special pauses/holds (10-15% chance if permitted and not consecutive)
    if (allowPauses && this.consecutiveHoldCount === 0 && Math.random() < 0.12 && sessionSecondsElapsed > 30) {
      this.consecutiveHoldCount++;
      const holdDuration = Math.floor(Math.random() * 5) + 4; // 4 to 8s
      return {
        durationSeconds: holdDuration,
        sps: 0,
        depth: this.lastDepth,
        technique: 'hold',
        cueMessage: `Hold & breathe deep (${holdDuration}s)`,
      };
    }

    // Check pelvic floor squeeze (8-12% chance if enabled)
    if (allowSqueeze && this.consecutiveHoldCount === 0 && Math.random() < 0.12 && sessionSecondsElapsed > 45) {
      this.consecutiveHoldCount++;
      const squeezeSec = Math.floor(Math.random() * 4) + 3; // 3 to 6s
      return {
        durationSeconds: squeezeSec,
        sps: 0,
        depth: this.lastDepth,
        technique: 'squeeze',
        cueMessage: `Squeeze pelvic floor / Kegel (${squeezeSec}s)`,
      };
    }

    this.consecutiveHoldCount = 0;

    // Phase-specific pacing calculation
    let targetSps = 1.0;
    let targetDepth = this.getRandomDepth();
    let technique: StrokeTechnique = 'continuous';
    let durationSeconds = Math.floor(Math.random() * 12) + 8; // 8 to 20s

    switch (this.currentPhase) {
      case 'warmup': {
        // Slow, steady, shallow to mid strokes
        targetSps = Math.max(minSps, Math.min(1.2, minSps + 0.3 * Math.random()));
        if (Math.random() < 0.6) {
          targetDepth = Math.random() < 0.5 ? 'shallow' : 'tip';
        }
        durationSeconds = 12 + Math.floor(Math.random() * 8);
        break;
      }

      case 'escalation': {
        // Gradual increase in speed and depth
        const progressFactor = Math.min(1, sessionSecondsElapsed / (this.config.targetDurationMinutes * 60));
        const spsSpread = maxSps - minSps;
        targetSps = minSps + spsSpread * (0.3 + 0.6 * progressFactor) + (Math.random() * 0.4 - 0.2);
        targetSps = Math.max(minSps, Math.min(maxSps, targetSps));

        // Mixed techniques
        const rand = Math.random();
        if (rand < 0.25) technique = 'push_stop';
        else if (rand < 0.5) technique = 'pull_stop';
        else technique = 'continuous';
        break;
      }

      case 'edge_plateau': {
        // Unpredictable bursts: rapid teasing alternating with sudden slow deep strokes
        const isTeaseBurst = Math.random() < 0.5;
        if (isTeaseBurst) {
          targetSps = Math.min(maxSps, Math.max(2.2, minSps + (maxSps - minSps) * 0.8));
          targetDepth = Math.random() < 0.6 ? 'shallow' : 'tip';
          durationSeconds = 6 + Math.floor(Math.random() * 6); // Short high-intensity burst
        } else {
          targetSps = Math.max(minSps, 0.6 + Math.random() * 0.6);
          targetDepth = Math.random() < 0.5 ? 'deep' : 'full';
          durationSeconds = 10 + Math.floor(Math.random() * 8); // Slow deep anchor
        }
        break;
      }

      case 'climax_sprint': {
        // High speed, maximum depth, continuous rhythm for release
        targetSps = Math.min(4.5, Math.max(2.5, maxSps));
        targetDepth = Math.random() < 0.5 ? 'full' : 'deep';
        technique = 'continuous';
        durationSeconds = 25;
        break;
      }

      default:
        targetSps = 1.0;
        break;
    }

    // Round SPS to 1 decimal place
    targetSps = Math.round(targetSps * 10) / 10;
    if (targetSps < 0.2) targetSps = 0.2;

    const cueMessage = technique === 'push_stop' 
      ? 'Push deep and pause momentarily'
      : technique === 'pull_stop'
      ? 'Pull back to tip and pause'
      : `${targetDepth.toUpperCase()} • Steady rhythm`;

    return {
      durationSeconds,
      sps: targetSps,
      depth: targetDepth,
      technique,
      cueMessage,
    };
  }
}
