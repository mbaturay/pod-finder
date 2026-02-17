import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const percentage = (currentStep / totalSteps) * 100;

  const steps = [
    'Intro',
    'Interest',
    'Details',
    'Priorities',
    'Results',
  ];

  return (
    <div className="mb-8">
      {/* Progress bar */}
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
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
                    ? 'bg-primary-600 text-white scale-110'
                    : isCompleted
                    ? 'bg-primary-200 text-primary-700'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`text-xs mt-1 hidden md:block ${
                  isActive ? 'text-primary-700 font-medium' : 'text-slate-500'
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
