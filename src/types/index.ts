export type PodId = 'pod1' | 'pod2' | 'pod3' | 'pod4';

export interface Pod {
  id: PodId;
  areaLabel: string;
  areaName: string;
  areaDescription: string;
  podName: string;
  podDescription: string;
  detailedQuestions: string[];
}

export type LikertValue = 1 | 2 | 3 | 4 | 5 | null;

export type Region = 'East' | 'Central' | 'West';

export interface InfoState {
  firstName: string;
  lastName: string;
  region: Region | null;
}

export type GrowthFocusArea =
  | 'Technical Depth'
  | 'Leadership Skills'
  | 'Cross-Functional Exposure'
  | 'Client-Facing Skills'
  | 'Mentoring & Coaching'
  | 'Process Improvement'
  | 'Innovation & Experimentation'
  | 'Community Building';

export interface GrowthState {
  focusAreas: GrowthFocusArea[];
}

export type SubmitErrorKind = 'duplicate' | 'error';

export interface SurveyState {
  info: InfoState;
  topLevelInterest: Record<PodId, LikertValue>;
  detailedAnswers: Record<PodId, LikertValue[]>;
  firstChoice: PodId | null;
  secondChoice: PodId | null;
  growth: GrowthState;
  currentStep: number;
  returnToStep: number | null;
  startedAt: string | null;
  submitError: SubmitErrorKind | null;
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
  growthBonus: number;
  coreScore: number;
  finalScore: number;
  topDrivers: Array<{ question: string; rating: number }>;
}

export interface AssignmentResult {
  primary: ScoreBreakdown;
  isMultiFit: boolean;
  secondary?: ScoreBreakdown;
  tiedAreas?: ScoreBreakdown[];
}

export interface SubmissionRecord {
  id: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  region: Region;
  personKey: string;
  answers: {
    topLevelInterest: Record<PodId, LikertValue>;
    detailedAnswers: Record<PodId, LikertValue[]>;
    firstChoice: PodId | null;
    secondChoice: PodId | null;
    growth: GrowthState;
  };
  computed: {
    areaScores: ScoreBreakdown[];
    winningAreaId: PodId;
    winningAreaName: string;
    winningPodName: string;
    isMultiFit: boolean;
    secondaryAreaId?: PodId;
    secondaryPodName?: string;
    finalScore: number;
    submittedAt?: string;
    durationMinutes?: number;
  };
  version: 'v1';
}

export type SurveyAction =
  | { type: 'SET_TOP_LEVEL_INTEREST'; podId: PodId; value: LikertValue }
  | { type: 'SET_DETAILED_ANSWER'; podId: PodId; questionIndex: number; value: LikertValue }
  | { type: 'SET_FIRST_CHOICE'; value: PodId | null }
  | { type: 'SET_SECOND_CHOICE'; value: PodId | null }
  | { type: 'SET_INFO'; payload: Partial<InfoState> }
  | { type: 'TOGGLE_GROWTH_FOCUS'; area: GrowthFocusArea }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; step: number; returnTo?: number }
  | { type: 'SET_SUBMIT_ERROR'; error: SubmitErrorKind | null }
  | { type: 'RESET' };
