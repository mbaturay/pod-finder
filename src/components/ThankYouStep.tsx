import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import type { AssignmentResult, ScoreBreakdown, ContributionLevel } from '../types';

interface ThankYouStepProps {
  assignedPod: AssignmentResult;
  allScores: ScoreBreakdown[];
  contributionLevel: ContributionLevel;
  onFinish: () => void;
}

export function ThankYouStep({
  assignedPod,
  allScores,
  contributionLevel,
  onFinish,
}: ThankYouStepProps) {
  const [showDetails, setShowDetails] = useState(false);
  const sortedScores = [...allScores].sort((a, b) => b.finalScore - a.finalScore);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      {/* Confirmation */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="card mb-6 text-center"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Submission Saved
          </h2>
          <p className="text-muted-foreground mb-6">
            Thank you for completing the survey! Here's your match.
          </p>

          {/* Primary recommendation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
            className="my-6"
          >
            <p className="text-sm font-medium text-muted-foreground mb-2">Your recommended area:</p>
            <div className="inline-block bg-gradient-to-r from-cta to-navy-light text-primary-foreground px-8 py-5 rounded-2xl shadow-lg">
              <h1 className="text-2xl sm:text-4xl font-bold">{assignedPod.primary.podName}</h1>
            </div>
            <p className="text-base text-muted-foreground mt-3">
              {assignedPod.primary.areaName}
            </p>
          </motion.div>

          {/* Secondary if multi-fit */}
          {assignedPod.isMultiFit && assignedPod.secondary && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mb-6"
            >
              <p className="text-sm font-medium text-muted-foreground mb-2">Strong secondary match:</p>
              <div className="inline-block bg-gradient-to-r from-navy-light to-navy text-primary-foreground px-6 py-3 rounded-xl shadow-lg">
                <h2 className="text-xl sm:text-2xl font-bold">{assignedPod.secondary.podName}</h2>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {assignedPod.secondary.areaName}
              </p>
            </motion.div>
          )}

          {/* Contribution Level */}
          <div className="inline-flex items-center gap-2 bg-primary-soft border border-primary-border rounded-lg px-4 py-2 mt-2">
            <span className="text-sm text-muted-foreground">Contribution Level:</span>
            <span className="font-semibold text-primary">{contributionLevel}</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Collapsible score details */}
      <div className="card mb-6">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between text-left"
        >
          <span className="font-semibold text-foreground">See score details</span>
          <span className={`text-muted-foreground transition-transform ${showDetails ? 'rotate-180' : ''}`}>
            &#9660;
          </span>
        </button>

        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-3"
          >
            {sortedScores.map((score, index) => {
              const isWinner = score.podId === assignedPod.primary.podId;
              return (
                <div
                  key={score.podId}
                  className={`p-3 rounded-lg border ${
                    isWinner
                      ? 'border-primary bg-primary-soft'
                      : 'border-border bg-muted'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-muted-foreground">#{index + 1}</span>
                      <span className="font-semibold text-foreground">{score.areaName}</span>
                      {isWinner && (
                        <span className="text-xs bg-cta text-primary-foreground px-2 py-0.5 rounded-full">Match</span>
                      )}
                    </div>
                    <span className="font-bold text-foreground">{score.finalScore.toFixed(1)}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
                    <div>Base: {score.baseScore.toFixed(1)}</div>
                    <div>Detail: {score.detailScore.toFixed(1)}</div>
                    <div>Priority: +{score.priorityBonus.toFixed(1)}</div>
                    <div>Growth: +{score.growthBonus.toFixed(2)}</div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Finish */}
      <div className="text-center">
        <Button onClick={onFinish} className="px-8 py-3">
          Finish
        </Button>
      </div>
    </motion.div>
  );
}
