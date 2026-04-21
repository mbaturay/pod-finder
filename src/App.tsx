import { useReducer, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import type {
  SurveyState,
  SurveyAction,
  PodId,
  LikertValue,
  GrowthFocusArea,
} from './types';
import { calculateScores, determineAssignedPod } from './utils/scoring';
import { normalizePersonKey, saveSubmission } from './utils/storage';

import { ProgressBar } from './components/ProgressBar';
import { IntroScreen } from './components/IntroScreen';
import { InfoStep } from './components/InfoStep';
import { TopLevelInterest } from './components/TopLevelInterest';
import { DetailedQuestions } from './components/DetailedQuestions';
import { TopTwoPriorities } from './components/TopTwoPriorities';
import { GrowthStep } from './components/GrowthStep';
import { ReviewStep } from './components/ReviewStep';
import { ThankYouStep } from './components/ThankYouStep';

/*
 * Wizard steps:
 * 0 = Intro
 * 1 = Info (name + region)
 * 2 = Interest
 * 3 = Details (conditional)
 * 4 = Priorities
 * 5 = Growth
 * 6 = Review
 * 7 = Thank You
 */

const initialState: SurveyState = {
  info: { firstName: '', lastName: '', region: null },
  topLevelInterest: { pod1: null, pod2: null, pod3: null, pod4: null },
  detailedAnswers: { pod1: [], pod2: [], pod3: [], pod4: [] },
  firstChoice: null,
  secondChoice: null,
  growth: { focusAreas: [] },
  currentStep: 0,
  returnToStep: null,
  startedAt: null,
  submitError: null,
};

function surveyReducer(state: SurveyState, action: SurveyAction): SurveyState {
  switch (action.type) {
    case 'SET_INFO':
      return { ...state, info: { ...state.info, ...action.payload } };

    case 'SET_TOP_LEVEL_INTEREST':
      return {
        ...state,
        topLevelInterest: { ...state.topLevelInterest, [action.podId]: action.value },
      };

    case 'SET_DETAILED_ANSWER': {
      const currentAnswers = state.detailedAnswers[action.podId] || [];
      const newAnswers = [...currentAnswers];
      newAnswers[action.questionIndex] = action.value;
      return {
        ...state,
        detailedAnswers: { ...state.detailedAnswers, [action.podId]: newAnswers },
      };
    }

    case 'SET_FIRST_CHOICE':
      return {
        ...state,
        firstChoice: action.value,
        secondChoice: state.secondChoice === action.value ? null : state.secondChoice,
      };

    case 'SET_SECOND_CHOICE':
      return { ...state, secondChoice: action.value };

    case 'TOGGLE_GROWTH_FOCUS': {
      const current = state.growth.focusAreas;
      const next = current.includes(action.area)
        ? current.filter((a) => a !== action.area)
        : [...current, action.area];
      return { ...state, growth: { ...state.growth, focusAreas: next } };
    }

    case 'NEXT_STEP': {
      if (state.returnToStep !== null) {
        return { ...state, currentStep: state.returnToStep, returnToStep: null };
      }
      const startedAt =
        state.currentStep === 0 && !state.startedAt
          ? new Date().toISOString()
          : state.startedAt;
      return { ...state, currentStep: state.currentStep + 1, startedAt };
    }

    case 'PREV_STEP':
      if (state.returnToStep !== null) {
        return { ...state, currentStep: state.returnToStep, returnToStep: null };
      }
      return { ...state, currentStep: Math.max(0, state.currentStep - 1) };

    case 'GO_TO_STEP':
      return {
        ...state,
        currentStep: action.step,
        returnToStep: action.returnTo ?? null,
      };

    case 'SET_SUBMIT_ERROR':
      return { ...state, submitError: action.error };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(surveyReducer, initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const scores = calculateScores(state);
    const assignment = determineAssignedPod(scores, state);

    const personKey = normalizePersonKey(
      state.info.firstName,
      state.info.lastName,
      state.info.region!
    );

    const submittedAt = new Date().toISOString();
    const durationMinutes = state.startedAt
      ? (new Date(submittedAt).getTime() - new Date(state.startedAt).getTime()) / 60000
      : undefined;

    const record = {
      id: crypto.randomUUID(),
      createdAt: submittedAt,
      firstName: state.info.firstName.trim(),
      lastName: state.info.lastName.trim(),
      region: state.info.region!,
      personKey,
      answers: {
        topLevelInterest: state.topLevelInterest,
        detailedAnswers: state.detailedAnswers,
        firstChoice: state.firstChoice,
        secondChoice: state.secondChoice,
        growth: state.growth,
      },
      computed: {
        areaScores: scores,
        winningAreaId: assignment.primary.podId,
        winningAreaName: assignment.primary.areaName,
        winningPodName: assignment.primary.podName,
        isMultiFit: assignment.isMultiFit,
        secondaryAreaId: assignment.secondary?.podId,
        secondaryPodName: assignment.secondary?.podName,
        finalScore: assignment.primary.finalScore,
        submittedAt,
        durationMinutes,
      },
      version: 'v1' as const,
    };

    const result = await saveSubmission(record);
    setIsSubmitting(false);

    if (result.ok) {
      dispatch({ type: 'SET_SUBMIT_ERROR', error: null });
      dispatch({ type: 'NEXT_STEP' });
      return;
    }

    if (result.reason === 'duplicate') {
      dispatch({ type: 'SET_SUBMIT_ERROR', error: 'duplicate' });
      dispatch({ type: 'GO_TO_STEP', step: 1 });
      return;
    }

    dispatch({ type: 'SET_SUBMIT_ERROR', error: 'error' });
  };

  const handleEdit = (step: number) => {
    dispatch({ type: 'GO_TO_STEP', step, returnTo: 6 });
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Progress bar: visible for steps 1-6 */}
        {state.currentStep >= 1 && state.currentStep <= 6 && (
          <ProgressBar currentStep={state.currentStep} totalSteps={7} />
        )}

        <AnimatePresence mode="wait">
          {state.currentStep === 0 && (
            <IntroScreen key="intro" onStart={() => dispatch({ type: 'NEXT_STEP' })} />
          )}

          {state.currentStep === 1 && (
            <InfoStep
              key="info"
              info={state.info}
              submitError={state.submitError}
              onClearSubmitError={() =>
                dispatch({ type: 'SET_SUBMIT_ERROR', error: null })
              }
              onUpdate={(payload) => dispatch({ type: 'SET_INFO', payload })}
              onNext={() => dispatch({ type: 'NEXT_STEP' })}
              onBack={() => dispatch({ type: 'PREV_STEP' })}
            />
          )}

          {state.currentStep === 2 && (
            <TopLevelInterest
              key="top-level"
              state={state}
              onUpdate={(podId: PodId, value: LikertValue) =>
                dispatch({ type: 'SET_TOP_LEVEL_INTEREST', podId, value })
              }
              onNext={() => dispatch({ type: 'NEXT_STEP' })}
              onBack={() => dispatch({ type: 'PREV_STEP' })}
            />
          )}

          {state.currentStep === 3 && (
            <DetailedQuestions
              key="detailed"
              state={state}
              onUpdate={(podId: PodId, questionIndex: number, value: LikertValue) =>
                dispatch({ type: 'SET_DETAILED_ANSWER', podId, questionIndex, value })
              }
              onNext={() => dispatch({ type: 'NEXT_STEP' })}
              onBack={() => dispatch({ type: 'PREV_STEP' })}
            />
          )}

          {state.currentStep === 4 && (
            <TopTwoPriorities
              key="priorities"
              firstChoice={state.firstChoice}
              secondChoice={state.secondChoice}
              onFirstChange={(value: PodId | null) =>
                dispatch({ type: 'SET_FIRST_CHOICE', value })
              }
              onSecondChange={(value: PodId | null) =>
                dispatch({ type: 'SET_SECOND_CHOICE', value })
              }
              onNext={() => dispatch({ type: 'NEXT_STEP' })}
              onBack={() => dispatch({ type: 'PREV_STEP' })}
            />
          )}

          {state.currentStep === 5 && (
            <GrowthStep
              key="growth"
              growth={state.growth}
              onToggleFocus={(area: GrowthFocusArea) =>
                dispatch({ type: 'TOGGLE_GROWTH_FOCUS', area })
              }
              onNext={() => dispatch({ type: 'NEXT_STEP' })}
              onBack={() => dispatch({ type: 'PREV_STEP' })}
            />
          )}

          {state.currentStep === 6 && (
            <ReviewStep
              key="review"
              state={state}
              isSubmitting={isSubmitting}
              submitError={state.submitError}
              onEdit={handleEdit}
              onSubmit={handleSubmit}
              onBack={() => dispatch({ type: 'PREV_STEP' })}
            />
          )}

          {state.currentStep === 7 && (
            <ThankYouStep
              key="thanks"
              onFinish={() => dispatch({ type: 'RESET' })}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
