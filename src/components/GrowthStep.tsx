import { motion } from 'framer-motion';
import { Button } from './Button';
import type { GrowthState, GrowthFocusArea, CapacityLevel, LeadershipReadiness } from '../types';
import { GROWTH_FOCUS_OPTIONS } from '../config/pods';

interface GrowthStepProps {
  growth: GrowthState;
  onToggleFocus: (area: GrowthFocusArea) => void;
  onSetCapacity: (value: CapacityLevel) => void;
  onSetLeadership: (value: LeadershipReadiness) => void;
  onNext: () => void;
  onBack: () => void;
}

const CAPACITY_OPTIONS: CapacityLevel[] = [
  '<1 hr/wk',
  '1\u20132 hrs/wk',
  '2\u20134 hrs/wk',
  '4+ hrs/wk',
];

const LEADERSHIP_OPTIONS: LeadershipReadiness[] = [
  'Not right now',
  'Open to it',
  'Ready now',
];

export function GrowthStep({
  growth,
  onToggleFocus,
  onSetCapacity,
  onSetLeadership,
  onNext,
  onBack,
}: GrowthStepProps) {
  const isComplete =
    growth.focusAreas.length >= 1 &&
    growth.capacity !== null &&
    growth.leadership !== null;

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
            Growth, Availability & Leadership
          </h2>
          <p className="text-muted-foreground">
            Help us understand your development goals and how much you can contribute.
          </p>
        </div>

        <div className="space-y-8">
          {/* Growth Focus Areas */}
          <div>
            <label className="block text-lg font-semibold text-foreground mb-2">
              Growth Focus Areas
              <span className="text-destructive ml-1">*</span>
            </label>
            <p className="text-sm text-muted-foreground mb-4">
              Select at least one area you'd like to grow in.
            </p>

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
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-lg font-semibold text-foreground mb-2">
              Weekly Capacity
              <span className="text-destructive ml-1">*</span>
            </label>
            <p className="text-sm text-muted-foreground mb-4">
              How much time can you dedicate to this work each week?
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CAPACITY_OPTIONS.map((option) => (
                <motion.button
                  key={option}
                  type="button"
                  onClick={() => onSetCapacity(option)}
                  className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                    growth.capacity === option
                      ? 'border-primary bg-primary-soft text-foreground shadow-md'
                      : 'border-border bg-card text-foreground hover:border-primary'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Leadership Readiness */}
          <div>
            <label className="block text-lg font-semibold text-foreground mb-2">
              Leadership Readiness
              <span className="text-destructive ml-1">*</span>
            </label>
            <p className="text-sm text-muted-foreground mb-4">
              Are you open to taking on a leadership role within a pod?
            </p>

            <div className="grid grid-cols-3 gap-3">
              {LEADERSHIP_OPTIONS.map((option) => (
                <motion.button
                  key={option}
                  type="button"
                  onClick={() => onSetLeadership(option)}
                  className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                    growth.leadership === option
                      ? 'border-primary bg-primary-soft text-foreground shadow-md'
                      : 'border-border bg-card text-foreground hover:border-primary'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </div>
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
            Please complete all sections to continue
          </p>
        )}
      </div>
    </motion.div>
  );
}
