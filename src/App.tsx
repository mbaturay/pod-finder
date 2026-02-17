import { useReducer } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { SurveyState, SurveyAction, PodId, LikertValue } from './types';
import { calculateScores, determineAssignedPod } from './utils/scoring';

import { ProgressBar } from './components/ProgressBar';
import { IntroScreen } from './components/IntroScreen';
import { TopLevelInterest } from './components/TopLevelInterest';
import { DetailedQuestions } from './components/DetailedQuestions';
import { TopTwoPriorities } from './components/TopTwoPriorities';
import { Results } from './components/Results';

const initialState: SurveyState = {
  topLevelInterest: {
    pod1: null,
    pod2: null,
    pod3: null,
    pod4: null,
  },
  detailedAnswers: {
    pod1: [],
    pod2: [],
    pod3: [],
    pod4: [],
  },
  firstChoice: null,
  secondChoice: null,
  currentStep: 0,
};

function surveyReducer(state: SurveyState, action: SurveyAction): SurveyState {
  switch (action.type) {
    case 'SET_TOP_LEVEL_INTEREST':
      return {
        ...state,
        topLevelInterest: {
          ...state.topLevelInterest,
          [action.podId]: action.value,
        },
      };

    case 'SET_DETAILED_ANSWER': {
      const currentAnswers = state.detailedAnswers[action.podId] || [];
      const newAnswers = [...currentAnswers];
      newAnswers[action.questionIndex] = action.value;

      return {
        ...state,
        detailedAnswers: {
          ...state.detailedAnswers,
          [action.podId]: newAnswers,
        },
      };
    }

    case 'SET_FIRST_CHOICE':
      return {
        ...state,
        firstChoice: action.value,
        // Clear second choice if it's the same as new first choice
        secondChoice: state.secondChoice === action.value ? null : state.secondChoice,
      };

    case 'SET_SECOND_CHOICE':
      return {
        ...state,
        secondChoice: action.value,
      };

    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: state.currentStep + 1,
      };

    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(0, state.currentStep - 1),
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(surveyReducer, initialState);

  const handleTopLevelInterest = (podId: PodId, value: LikertValue) => {
    dispatch({ type: 'SET_TOP_LEVEL_INTEREST', podId, value });
  };

  const handleDetailedAnswer = (podId: PodId, questionIndex: number, value: LikertValue) => {
    dispatch({ type: 'SET_DETAILED_ANSWER', podId, questionIndex, value });
  };

  const handleFirstChoice = (value: PodId | null) => {
    dispatch({ type: 'SET_FIRST_CHOICE', value });
  };

  const handleSecondChoice = (value: PodId | null) => {
    dispatch({ type: 'SET_SECOND_CHOICE', value });
  };

  const handleNext = () => {
    dispatch({ type: 'NEXT_STEP' });
  };

  const handleBack = () => {
    dispatch({ type: 'PREV_STEP' });
  };

  const handleReset = () => {
    dispatch({ type: 'RESET' });
  };

  // Calculate results for the results screen
  const allScores = calculateScores(state);
  const assignedPod = determineAssignedPod(allScores, state);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Progress bar - hide on intro and results */}
        {state.currentStep > 0 && state.currentStep < 4 && (
          <ProgressBar currentStep={state.currentStep} totalSteps={4} />
        )}

        {/* Survey Steps */}
        <AnimatePresence mode="wait">
          {state.currentStep === 0 && (
            <IntroScreen key="intro" onStart={handleNext} />
          )}

          {state.currentStep === 1 && (
            <TopLevelInterest
              key="top-level"
              state={state}
              onUpdate={handleTopLevelInterest}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {state.currentStep === 2 && (
            <DetailedQuestions
              key="detailed"
              state={state}
              onUpdate={handleDetailedAnswer}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {state.currentStep === 3 && (
            <TopTwoPriorities
              key="priorities"
              firstChoice={state.firstChoice}
              secondChoice={state.secondChoice}
              onFirstChange={handleFirstChoice}
              onSecondChange={handleSecondChoice}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {state.currentStep === 4 && (
            <Results
              key="results"
              assignedPod={assignedPod}
              allScores={allScores}
              state={state}
              onReset={handleReset}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
