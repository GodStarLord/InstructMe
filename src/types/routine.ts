import { StrokeDepth, StrokeTechnique, SessionPhase } from './session';

export interface RoutineStep {
  id: string;
  name: string;
  phase: SessionPhase;
  durationSeconds: number;
  minSps: number;
  maxSps: number;
  allowedDepths: StrokeDepth[];
  allowedTechniques: StrokeTechnique[];
  instructions?: string;
}

export interface Routine {
  id: string;
  title: string;
  description: string;
  category: 'beginner' | 'endurance' | 'edge_mastery' | 'intense';
  isCustom?: boolean;
  totalDurationSeconds: number;
  steps: RoutineStep[];
}
