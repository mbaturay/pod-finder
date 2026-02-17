export type PodId = 'pod1' | 'pod2' | 'pod3' | 'pod4';

export interface Pod {
  id: PodId;
  areaLabel: string; // Neutral label (Area A, B, C, D)
  areaName: string; // Neutral description
  areaDescription: string; // Short one-sentence description
  podName: string; // Real POD name (revealed at results)
  podDescription: string; // Real POD description
  detailedQuestions: string[];
}

export type LikertValue = 1 | 2 | 3 | 4 | 5 | null;

export interface SurveyState {
  // Section A: Top-level interest
  topLevelInterest: Record<PodId, LikertValue>;

  // Section B: Detailed questions (only for areas with interest >= 3)
  detailedAnswers: Record<PodId, LikertValue[]>;

  // Section C: Top 2 priorities
  firstChoice: PodId | null;
  secondChoice: PodId | null;

  // UI state
  currentStep: number;
}

export interface ScoreBreakdown {
  podId: PodId;
  areaLabel: string;
  areaName: string;
  podName: string;
  topLevelInterest: number;
  baseScore: number;
  detailedAnswers: number[];
  detailScore: number;
  priorityBonus: number;
  finalScore: number;
  topDrivers: Array<{ question: string; rating: number }>;
}

export interface AssignmentResult {
  primary: ScoreBreakdown;
  isMultiFit: boolean;
  secondary?: ScoreBreakdown;
  tiedAreas?: ScoreBreakdown[];
}

export type SurveyAction =
  | { type: 'SET_TOP_LEVEL_INTEREST'; podId: PodId; value: LikertValue }
  | { type: 'SET_DETAILED_ANSWER'; podId: PodId; questionIndex: number; value: LikertValue }
  | { type: 'SET_FIRST_CHOICE'; value: PodId | null }
  | { type: 'SET_SECOND_CHOICE'; value: PodId | null }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'RESET' };
