import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import type { InfoState, Region } from '../types';
import { normalizePersonKey, checkPersonKeyExists } from '../utils/storage';

interface InfoStepProps {
  info: InfoState;
  onUpdate: (payload: Partial<InfoState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const REGIONS: Region[] = ['East', 'Central', 'West'];

export function InfoStep({ info, onUpdate, onNext, onBack }: InfoStepProps) {
  const [duplicateError, setDuplicateError] = useState(false);

  const isValid =
    info.firstName.trim().length >= 2 &&
    info.lastName.trim().length >= 2 &&
    info.region !== null;

  const handleContinue = () => {
    if (!isValid || !info.region) return;

    const personKey = normalizePersonKey(info.firstName, info.lastName, info.region);
    if (checkPersonKeyExists(personKey)) {
      setDuplicateError(true);
      return;
    }

    setDuplicateError(false);
    onNext();
  };

  // Clear duplicate error when fields change
  const handleUpdate = (payload: Partial<InfoState>) => {
    setDuplicateError(false);
    onUpdate(payload);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto"
    >
      <div className="card">
        {duplicateError && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-destructive font-medium">
              It looks like you've already completed this survey.
              If something needs to change, please contact your administrator.
            </p>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Your Information
          </h2>
          <p className="text-muted-foreground">
            Tell us a bit about yourself so we can save your results.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
              First Name <span className="text-destructive">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              value={info.firstName}
              onChange={(e) => handleUpdate({ firstName: e.target.value })}
              placeholder="Enter your first name"
              className="w-full px-4 py-3 rounded-lg border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
            />
            {info.firstName.length > 0 && info.firstName.trim().length < 2 && (
              <p className="text-sm text-destructive mt-1">Name must be at least 2 characters</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
              Last Name <span className="text-destructive">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              value={info.lastName}
              onChange={(e) => handleUpdate({ lastName: e.target.value })}
              placeholder="Enter your last name"
              className="w-full px-4 py-3 rounded-lg border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
            />
            {info.lastName.length > 0 && info.lastName.trim().length < 2 && (
              <p className="text-sm text-destructive mt-1">Name must be at least 2 characters</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Region <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {REGIONS.map((region) => (
                <motion.button
                  key={region}
                  type="button"
                  onClick={() => handleUpdate({ region })}
                  className={`px-4 py-3 rounded-lg border-2 font-medium transition-all duration-200 ${
                    info.region === region
                      ? 'border-primary bg-primary-soft text-foreground shadow-md'
                      : 'border-border bg-card text-foreground hover:border-primary'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {region}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button onClick={handleContinue} disabled={!isValid}>
            Continue
          </Button>
        </div>

        {!isValid && !duplicateError && (
          <p className="text-sm text-warning text-center mt-4">
            Please fill in all fields to continue
          </p>
        )}
      </div>
    </motion.div>
  );
}
