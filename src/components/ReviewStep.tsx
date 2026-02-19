import { motion } from 'framer-motion';
import { Button } from './Button';
import type { SurveyState } from '../types';
import { PODS, POD_IDS } from '../config/pods';

interface ReviewStepProps {
  state: SurveyState;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export function ReviewStep({
  state,
  onEdit,
  onSubmit,
  onBack,
}: ReviewStepProps) {
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
            Review & Submit
          </h2>
          <p className="text-muted-foreground">
            Review your responses before submitting. Click "Edit" to make changes.
          </p>
        </div>

        <div className="space-y-6">
          {/* Info Section */}
          <Section title="Your Information" onEdit={() => onEdit(1)}>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">First Name</span>
                <p className="font-medium text-foreground">{state.info.firstName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Last Name</span>
                <p className="font-medium text-foreground">{state.info.lastName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Region</span>
                <p className="font-medium text-foreground">{state.info.region}</p>
              </div>
            </div>
          </Section>

          {/* Interest Ratings */}
          <Section title="Interest Ratings" onEdit={() => onEdit(2)}>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {POD_IDS.map((podId) => (
                <div key={podId} className="flex justify-between items-center bg-muted rounded-lg px-3 py-2">
                  <span className="text-foreground">{PODS[podId].areaName}</span>
                  <span className="font-bold text-primary">
                    {state.topLevelInterest[podId] ?? '—'}/5
                  </span>
                </div>
              ))}
            </div>
          </Section>

          {/* Priorities */}
          <Section title="Priorities" onEdit={() => onEdit(4)}>
            <div className="flex gap-4 text-sm">
              <div className="flex-1 bg-primary-soft border border-primary-border rounded-lg p-3">
                <span className="text-xs text-muted-foreground">1st Choice</span>
                <p className="font-medium text-foreground">
                  {state.firstChoice ? PODS[state.firstChoice].areaName : '—'}
                </p>
              </div>
              <div className="flex-1 bg-muted border border-border rounded-lg p-3">
                <span className="text-xs text-muted-foreground">2nd Choice</span>
                <p className="font-medium text-foreground">
                  {state.secondChoice ? PODS[state.secondChoice].areaName : '—'}
                </p>
              </div>
            </div>
          </Section>

          {/* Growth Interests */}
          <Section title="Growth Interests" onEdit={() => onEdit(5)}>
            <div className="flex flex-wrap gap-2 text-sm">
              {state.growth.focusAreas.map((area) => (
                <span
                  key={area}
                  className="bg-primary-soft border border-primary-border text-foreground px-2 py-1 rounded-md text-xs font-medium"
                >
                  {area}
                </span>
              ))}
            </div>
          </Section>
        </div>

        <div className="flex justify-between mt-8">
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function Section({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="text-sm text-primary hover:underline font-medium"
        >
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}
