import { motion } from 'framer-motion';
import { LikertScale } from './LikertScale';
import { Button } from './Button';
import type { SurveyState, PodId, LikertValue } from '../types';
import { PODS, POD_IDS } from '../config/pods';

interface DetailedQuestionsProps {
  state: SurveyState;
  onUpdate: (podId: PodId, questionIndex: number, value: LikertValue) => void;
  onNext: () => void;
  onBack: () => void;
}

export function DetailedQuestions({ state, onUpdate, onNext, onBack }: DetailedQuestionsProps) {
  // Get areas that need detailed questions (interest >= 3)
  const eligibleAreas = POD_IDS.filter(
    (podId) => (state.topLevelInterest[podId] || 0) >= 3
  );

  // Check if all required questions are answered
  const isComplete = eligibleAreas.every((podId) => {
    const area = PODS[podId];
    const answers = state.detailedAnswers[podId] || [];
    return answers.length === area.detailedQuestions.length &&
      answers.every((answer) => answer !== null);
  });

  // If no areas are eligible, skip this step
  if (eligibleAreas.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto"
      >
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            No Detailed Questions
          </h2>
          <p className="text-slate-600 mb-6">
            Based on your initial ratings (all below 3), there are no detailed questions to answer.
          </p>
          <div className="flex justify-between">
            <Button variant="secondary" onClick={onBack}>
              Back
            </Button>
            <Button onClick={onNext}>
              Continue
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto"
    >
      <div className="card">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Detailed Questions
          </h2>
          <p className="text-slate-600">
            Rate your interest in specific activities for the areas you're interested in.
          </p>
        </div>

        <div className="space-y-8">
          {eligibleAreas.map((podId) => {
            const area = PODS[podId];
            const answers = state.detailedAnswers[podId] || [];

            return (
              <motion.div
                key={podId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-primary-50 to-blue-50 p-6 rounded-lg border border-primary-100"
              >
                <div className="mb-5">
                  <h3 className="text-xl font-bold text-slate-800">
                    {area.areaLabel}: {area.areaName}
                  </h3>
                </div>

                <div className="space-y-4">
                  {area.detailedQuestions.map((question, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg">
                      <LikertScale
                        label={question}
                        value={answers[index] || null}
                        onChange={(value) => onUpdate(podId, index, value)}
                        required
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-between mt-8">
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext} disabled={!isComplete}>
            Continue
          </Button>
        </div>

        {!isComplete && (
          <p className="text-sm text-amber-600 text-center mt-4">
            Please answer all questions to continue
          </p>
        )}
      </div>
    </motion.div>
  );
}
