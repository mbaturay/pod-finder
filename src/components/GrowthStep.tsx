import { motion } from 'framer-motion';
import { Button } from './Button';
import type { GrowthFocusArea, GrowthState } from '../types';
import { GROWTH_FOCUS_OPTIONS } from '../config/pods';

interface GrowthStepProps {
  growth: GrowthState;
  onToggleFocus: (area: GrowthFocusArea) => void;
  onNext: () => void;
  onBack: () => void;
}

export function GrowthStep({
  growth,
  onToggleFocus,
  onNext,
  onBack,
}: GrowthStepProps) {
  const isComplete = growth.focusAreas.length >= 1;

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
            Growth Interests
          </h2>
          <p className="text-muted-foreground">
            Select the areas you'd like to grow in. Choose at least one.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {GROWTH_FOCUS_OPTIONS.map((area) => {
            const isSelected = growth.focusAreas.includes(area);
            return (
              <motion.button
                key={area}
                type="button"
                onClick={() => onToggleFocus(area)}
                className={`px-4 py-3 rounded-lg border-2 text-left text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? 'border-primary bg-primary-soft text-foreground shadow-md'
                    : 'border-border bg-card text-foreground hover:border-primary'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center gap-2">
                  <span className={`inline-flex items-center justify-center w-5 h-5 rounded border-2 text-xs transition-colors ${
                    isSelected
                      ? 'bg-cta border-cta text-primary-foreground'
                      : 'border-border'
                  }`}>
                    {isSelected && '\u2713'}
                  </span>
                  {area}
                </span>
              </motion.button>
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
            Please select at least one growth area to continue
          </p>
        )}
      </div>
    </motion.div>
  );
}
