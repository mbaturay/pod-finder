import { motion } from 'framer-motion';
import type { LikertValue } from '../types';

interface LikertScaleProps {
  label: string;
  value: LikertValue;
  onChange: (value: LikertValue) => void;
  required?: boolean;
}

export function LikertScale({ label, value, onChange, required = false }: LikertScaleProps) {
  const options: { value: LikertValue; label: string }[] = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
  ];

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-slate-700 mb-3">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 hidden sm:inline">Not at all like me</span>

        <div className="flex gap-2 flex-1 justify-center">
          {options.map((option) => {
            const isSelected = value === option.value;

            return (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 ${
                  isSelected
                    ? 'bg-primary-600 text-white shadow-lg scale-110'
                    : 'bg-white border-2 border-slate-300 text-slate-700 hover:border-primary-400'
                }`}
                whileHover={{ scale: isSelected ? 1.1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Rate ${option.value} out of 5`}
              >
                {option.label}
              </motion.button>
            );
          })}
        </div>

        <span className="text-xs text-slate-500 hidden sm:inline">Very much like me</span>
      </div>

      {/* Mobile labels */}
      <div className="flex justify-between mt-2 text-xs text-slate-500 sm:hidden">
        <span>Not at all like me</span>
        <span>Very much like me</span>
      </div>
    </div>
  );
}
