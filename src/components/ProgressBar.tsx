import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const STEP_LABELS = [
  'Intro',
  'Info',
  'Interest',
  'Details',
  'Priorities',
  'Growth',
  'Review',
  'Done',
];

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-full bg-cta"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between items-center">
        {STEP_LABELS.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div
              key={step}
              className={`flex flex-col items-center ${
                index > 0 ? 'hidden sm:flex' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-cta text-primary-foreground scale-110'
                    : isCompleted
                    ? 'bg-primary-muted text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`text-xs mt-1 hidden md:block ${
                  isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
