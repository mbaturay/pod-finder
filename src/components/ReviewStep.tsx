import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import type { SurveyState, ScoreBreakdown, AssignmentResult } from '../types';
import { PODS, POD_IDS } from '../config/pods';
import { computeContributionLevel } from '../utils/scoring';

interface ReviewStepProps {
  state: SurveyState;
  allScores: ScoreBreakdown[];
  assignedPod: AssignmentResult;
  onEdit: (step: number) => void;
  onSubmit: () => { success: boolean; error?: string };
  onBack: () => void;
}

export function ReviewStep({
  state,
  allScores,
  assignedPod,
  onEdit,
  onSubmit,
  onBack,
}: ReviewStepProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const sortedScores = [...allScores].sort((a, b) => b.finalScore - a.finalScore);
  const contributionLevel = computeContributionLevel(
    state.growth.capacity,
    state.growth.leadership
  );

  const handleSubmit = () => {
    const result = onSubmit();
    if (!result.success) {
      setSubmitError(result.error || 'Submission failed.');
    }
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

          {/* Growth */}
          <Section title="Growth & Availability" onEdit={() => onEdit(5)}>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Focus Areas</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {state.growth.focusAreas.map((area) => (
                    <span
                      key={area}
                      className="bg-primary-soft border border-primary-border text-foreground px-2 py-1 rounded-md text-xs font-medium"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground">Capacity</span>
                  <p className="font-medium text-foreground">{state.growth.capacity ?? '—'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Leadership</span>
                  <p className="font-medium text-foreground">{state.growth.leadership ?? '—'}</p>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Contribution Level</span>
                <p className="font-medium text-primary">{contributionLevel}</p>
              </div>
            </div>
          </Section>

          {/* Score Preview */}
          <div className="bg-primary-soft border border-primary-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-3">Score Preview</h3>
            <div className="mb-3">
              <span className="text-sm text-muted-foreground">Best Match:</span>
              <span className="ml-2 font-bold text-primary">
                {assignedPod.primary.areaName}
              </span>
              <span className="ml-1 text-sm text-muted-foreground">
                ({assignedPod.primary.finalScore.toFixed(1)} pts)
              </span>
            </div>
            <div className="space-y-2">
              {sortedScores.map((score) => {
                const isWinner = score.podId === assignedPod.primary.podId;
                return (
                  <div
                    key={score.podId}
                    className={`flex items-center justify-between text-sm rounded px-3 py-1.5 ${
                      isWinner ? 'bg-cta text-primary-foreground font-medium' : 'text-foreground'
                    }`}
                  >
                    <span>{score.areaName}</span>
                    <span>{score.finalScore.toFixed(1)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {submitError && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mt-6">
            <p className="text-sm text-destructive font-medium">{submitError}</p>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button onClick={handleSubmit}>
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
