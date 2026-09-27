export type StrokeDepth = 'tip' | 'shallow' | 'mid' | 'deep' | 'full';

export type StrokeTechnique = 
  | 'continuous'
  | 'push_stop'
  | 'pull_stop'
  | 'hold'
  | 'squeeze'
  | 'breathe';

export type SessionPhase = 
  | 'idle'
  | 'warmup'
  | 'escalation'
  | 'edge_plateau'
  | 'panic_recovery'
  | 'climax_sprint'
  | 'summary';

export type StartingArousal = 'flaccid' | 'mid' | 'hard';

export interface StrokeState {
  sps: number;              // Strokes Per Second (0.2 to 4.5)
  depth: StrokeDepth;
  technique: StrokeTechnique;
  isUpstroke: boolean;       // Current cycle direction
  beatProgress: number;      // 0 to 1 progress inside single stroke cycle
  remainingHoldSec: number;  // If hold or squeeze is active
}

export interface SessionConfig {
  startingArousal: StartingArousal;
  minSps: number;
  maxSps: number;
  allowDepths: StrokeDepth[];
  allowSqueeze: boolean;
  allowPauses: boolean;
  targetDurationMinutes: number;
  unpredictability: 'low' | 'medium' | 'high';
}

export interface SessionRecord {
  id: string;
  timestamp: number;
  durationSeconds: number;
  edgesCount: number;
  avgSps: number;
  climaxReached: boolean;
  pleasureRating: number;   // 1 to 5
  startingArousal: StartingArousal;
  notes: string;
  depthStats: Record<StrokeDepth, number>; // Percentage or seconds spent
}
