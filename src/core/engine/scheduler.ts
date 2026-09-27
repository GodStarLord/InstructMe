import { SessionConfig, SessionPhase, StrokeDepth, StrokeState, StrokeTechnique } from '../../types';
import { NextSegment, StrokeRandomizer } from './randomizer';
import { audioEngine } from '../audio/audioEngine';
import { hapticsEngine } from '../haptics/hapticsEngine';

export interface SchedulerCallbacks {
  onStrokeStateUpdate: (state: StrokeState, secondsElapsed: number, phase: SessionPhase, cue: string) => void;
  onEdgeCountUpdate: (edges: number) => void;
  onSessionComplete: (durationSeconds: number, edges: number, climax: boolean) => void;
}

export class SessionScheduler {
  private config: SessionConfig;
  private randomizer: StrokeRandomizer;
  private callbacks: SchedulerCallbacks;

  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private animationFrameId: number | null = null;

  private sessionStartTime: number = 0;
  private totalElapsedSeconds: number = 0;
  private currentPhase: SessionPhase = 'idle';
  private edgeCount: number = 0;

  // Segment tracking
  private currentSegment: NextSegment | null = null;
  private segmentStartTime: number = 0;

  // Beat tracking
  private strokeCycleDuration: number = 1.0; // Seconds per full stroke (1/SPS)
  private lastStrokeBeatPhase: number = -1; // 0 for down, 1 for up

  // Panic / Breathing tracking
  private panicSecondsRemaining: number = 0;

  constructor(config: SessionConfig, callbacks: SchedulerCallbacks) {
    this.config = config;
    this.randomizer = new StrokeRandomizer(config);
    this.callbacks = callbacks;
  }

  public start() {
    this.isRunning = true;
    this.isPaused = false;
    this.sessionStartTime = performance.now();
    this.totalElapsedSeconds = 0;
    this.edgeCount = 0;

    // Set initial phase according to starting arousal
    if (this.config.startingArousal === 'flaccid') {
      this.currentPhase = 'warmup';
    } else if (this.config.startingArousal === 'mid') {
      this.currentPhase = 'escalation';
    } else {
      this.currentPhase = 'edge_plateau';
    }

    this.randomizer.setPhase(this.currentPhase);
    this.loadNextSegment();
    this.tick(performance.now());
  }

  public pause() {
    this.isPaused = true;
  }

  public resume() {
    this.isPaused = false;
  }

  public stop(reachedClimax: boolean = false) {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.callbacks.onSessionComplete(Math.round(this.totalElapsedSeconds), this.edgeCount, reachedClimax);
  }

  /**
   * User pressed Panic button
   */
  public triggerPanic() {
    this.currentPhase = 'panic_recovery';
    this.panicSecondsRemaining = 24; // 24 seconds of 4-7-8 breathing
    hapticsEngine.triggerPanic();
    audioEngine.playCalmChime();
  }

  /**
   * User resumes from Panic
   */
  public resumeFromPanic() {
    this.currentPhase = 'escalation';
    this.randomizer.setPhase(this.currentPhase);
    this.loadNextSegment();
  }

  /**
   * User pressed "I'm Close / Edge"
   */
  public triggerEdge() {
    this.edgeCount++;
    this.callbacks.onEdgeCountUpdate(this.edgeCount);
    hapticsEngine.triggerEdgeLogged();

    // Shift to edge plateau mode with high unpredictability
    this.currentPhase = 'edge_plateau';
    this.randomizer.setPhase(this.currentPhase);
    this.loadNextSegment();
  }

  /**
   * User triggers final climax sprint
   */
  public triggerClimaxSprint() {
    this.currentPhase = 'climax_sprint';
    this.randomizer.setPhase(this.currentPhase);
    this.loadNextSegment();
  }

  private loadNextSegment() {
    this.currentSegment = this.randomizer.getNextSegment(this.totalElapsedSeconds, this.edgeCount);
    this.segmentStartTime = performance.now();
    this.strokeCycleDuration = this.currentSegment.sps > 0 ? (1 / this.currentSegment.sps) : 9999;
    this.lastStrokeBeatPhase = -1;

    if (this.currentSegment.technique === 'squeeze') {
      hapticsEngine.triggerSqueezePrompt();
    }
  }

  private tick = (timestamp: number) => {
    if (!this.isRunning) return;

    if (!this.isPaused) {
      this.totalElapsedSeconds += 1 / 60;

      // Handle Panic Recovery state
      if (this.currentPhase === 'panic_recovery') {
        this.panicSecondsRemaining -= 1 / 60;
        if (this.panicSecondsRemaining <= 0) {
          this.resumeFromPanic();
        } else {
          this.callbacks.onStrokeStateUpdate(
            {
              sps: 0,
              depth: 'shallow',
              technique: 'breathe',
              isUpstroke: false,
              beatProgress: 0,
              remainingHoldSec: Math.ceil(this.panicSecondsRemaining),
            },
            Math.round(this.totalElapsedSeconds),
            this.currentPhase,
            `Recovery Breathe (${Math.ceil(this.panicSecondsRemaining)}s)`
          );
        }
      } else {
        // Normal session or hold/squeeze
        const segmentElapsed = (timestamp - this.segmentStartTime) / 1000;

        // Check phase transitions
        if (this.currentPhase === 'warmup' && this.totalElapsedSeconds >= 180) {
          this.currentPhase = 'escalation';
          this.randomizer.setPhase(this.currentPhase);
        }

        // Check if segment has expired
        if (this.currentSegment && segmentElapsed >= this.currentSegment.durationSeconds) {
          this.loadNextSegment();
        }

        if (this.currentSegment) {
          const isHolding = this.currentSegment.technique === 'hold' || this.currentSegment.technique === 'squeeze';
          const remainingHold = isHolding 
            ? Math.max(0, Math.ceil(this.currentSegment.durationSeconds - segmentElapsed))
            : 0;

          let isUpstroke = false;
          let beatProgress = 0;

          if (!isHolding && this.currentSegment.sps > 0) {
            const cycleTime = (segmentElapsed % this.strokeCycleDuration) / this.strokeCycleDuration;
            beatProgress = cycleTime; // 0 to 1
            isUpstroke = cycleTime >= 0.5;

            // Audio & Haptic beat trigger at downstroke (0) and upstroke (0.5)
            const currentBeatPhase = cycleTime < 0.5 ? 0 : 1;
            if (currentBeatPhase !== this.lastStrokeBeatPhase) {
              this.lastStrokeBeatPhase = currentBeatPhase;
              const upstroke = currentBeatPhase === 1;
              audioEngine.playStrokeBeat(upstroke, this.currentSegment.depth);
              hapticsEngine.triggerStroke(upstroke, this.currentSegment.depth);
            }
          }

          const strokeState: StrokeState = {
            sps: this.currentSegment.sps,
            depth: this.currentSegment.depth,
            technique: this.currentSegment.technique,
            isUpstroke,
            beatProgress,
            remainingHoldSec: remainingHold,
          };

          this.callbacks.onStrokeStateUpdate(
            strokeState,
            Math.round(this.totalElapsedSeconds),
            this.currentPhase,
            this.currentSegment.cueMessage
          );
        }
      }
    }

    this.animationFrameId = requestAnimationFrame(this.tick);
  };
}
