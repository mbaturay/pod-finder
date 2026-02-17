import { motion } from 'framer-motion';
import { Button } from './Button';
import type { PodId } from '../types';
import { PODS, POD_IDS } from '../config/pods';

interface TopTwoPrioritiesProps {
  firstChoice: PodId | null;
  secondChoice: PodId | null;
  onFirstChange: (value: PodId | null) => void;
  onSecondChange: (value: PodId | null) => void;
  onNext: () => void;
  onBack: () => void;
}

export function TopTwoPriorities({
  firstChoice,
  secondChoice,
  onFirstChange,
  onSecondChange,
  onNext,
  onBack,
}: TopTwoPrioritiesProps) {
  const isComplete = firstChoice !== null && secondChoice !== null;

  // Available options for second choice (exclude first choice)
  const secondChoiceOptions = POD_IDS.filter((podId) => podId !== firstChoice);

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
            Your Top 2 Priorities
          </h2>
          <p className="text-slate-600">
            Choose the two areas you most want to contribute to, in order of preference.
          </p>
        </div>

        <div className="space-y-8">
          {/* First Choice */}
          <div>
            <label className="block text-lg font-semibold text-slate-800 mb-4">
              First Choice
              <span className="text-red-500 ml-1">*</span>
            </label>

            <div className="grid sm:grid-cols-2 gap-3">
              {POD_IDS.map((podId) => {
                const area = PODS[podId];
                const isSelected = firstChoice === podId;
                const isDisabled = secondChoice === podId;

                return (
                  <motion.button
                    key={podId}
                    type="button"
                    onClick={() => onFirstChange(podId)}
                    disabled={isDisabled}
                    className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                      isSelected
                        ? 'border-primary-600 bg-primary-50 shadow-md'
                        : isDisabled
                        ? 'border-slate-200 bg-slate-100 opacity-50 cursor-not-allowed'
                        : 'border-slate-300 bg-white hover:border-primary-400'
                    }`}
                    whileHover={!isDisabled ? { scale: 1.02 } : {}}
                    whileTap={!isDisabled ? { scale: 0.98 } : {}}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800">
                          {area.areaLabel}: {area.areaName}
                        </h3>
                      </div>
                      {isSelected && (
                        <div className="ml-2 bg-primary-600 text-white rounded-full px-2 py-1 text-xs font-medium">
                          1st
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Second Choice */}
          <div>
            <label className="block text-lg font-semibold text-slate-800 mb-4">
              Second Choice
              <span className="text-red-500 ml-1">*</span>
            </label>

            <div className="grid sm:grid-cols-2 gap-3">
              {secondChoiceOptions.map((podId) => {
                const area = PODS[podId];
                const isSelected = secondChoice === podId;

                return (
                  <motion.button
                    key={podId}
                    type="button"
                    onClick={() => onSecondChange(podId)}
                    className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                      isSelected
                        ? 'border-primary-600 bg-primary-50 shadow-md'
                        : 'border-slate-300 bg-white hover:border-primary-400'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800">
                          {area.areaLabel}: {area.areaName}
                        </h3>
                      </div>
                      {isSelected && (
                        <div className="ml-2 bg-primary-500 text-white rounded-full px-2 py-1 text-xs font-medium">
                          2nd
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-8">
          <p className="text-sm text-slate-700">
            <strong>Note:</strong> Your #1 choice receives a higher priority bonus in the final scoring.
            Choose wisely!
          </p>
        </div>

        <div className="flex justify-between">
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext} disabled={!isComplete}>
            See Results
          </Button>
        </div>

        {!isComplete && (
          <p className="text-sm text-amber-600 text-center mt-4">
            Please select both your first and second choices to continue
          </p>
        )}
      </div>
    </motion.div>
  );
}
