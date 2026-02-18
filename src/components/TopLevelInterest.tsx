import { motion } from 'framer-motion';
import { LikertScale } from './LikertScale';
import { Button } from './Button';
import type { SurveyState, PodId, LikertValue } from '../types';
import { PODS, POD_IDS } from '../config/pods';

interface TopLevelInterestProps {
  state: SurveyState;
  onUpdate: (podId: PodId, value: LikertValue) => void;
  onNext: () => void;
  onBack: () => void;
}

export function TopLevelInterest({ state, onUpdate, onNext, onBack }: TopLevelInterestProps) {
  const isComplete = POD_IDS.every((podId) => state.topLevelInterest[podId] !== null);

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
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Rate Your Interest
          </h2>
          <p className="text-muted-foreground">
            For each area, rate how interested you are in contributing to these types of activities.
          </p>
        </div>

        <div className="space-y-6">
          {POD_IDS.map((podId) => {
            const area = PODS[podId];

            return (
              <motion.div
                key={podId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: parseInt(podId.slice(-1)) * 0.1 }}
                className="bg-muted p-5 rounded-lg border border-border"
              >
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-foreground">
                    {area.areaLabel} — {area.areaName}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {area.areaDescription}
                  </p>
                </div>

                <LikertScale
                  label="How interested are you in contributing to this kind of work?"
                  value={state.topLevelInterest[podId]}
                  onChange={(value) => onUpdate(podId, value)}
                  required
                />
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
          <p className="text-sm text-warning text-center mt-4">
            Please rate all areas to continue
          </p>
        )}
      </div>
    </motion.div>
  );
}
