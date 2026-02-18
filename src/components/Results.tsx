import { motion } from 'framer-motion';
import { Button } from './Button';
import type { AssignmentResult, ScoreBreakdown, SurveyState } from '../types';
import { PODS } from '../config/pods';

interface ResultsProps {
  assignedPod: AssignmentResult;
  allScores: ScoreBreakdown[];
  state: SurveyState;
  onReset: () => void;
}

export function Results({ assignedPod, allScores, state, onReset }: ResultsProps) {
  const pod = PODS[assignedPod.primary.podId];
  const secondaryPod = assignedPod.secondary ? PODS[assignedPod.secondary.podId] : null;

  // Sort scores for display (highest first)
  const sortedScores = [...allScores].sort((a, b) => b.finalScore - a.finalScore);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      {/* Main Result Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
        className="card mb-8 text-center"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {assignedPod.isMultiFit ? (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                You're a strong fit for multiple areas
              </h2>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                className="my-8"
              >
                <div className="mb-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Primary recommendation:</p>
                  <div className="inline-block bg-gradient-to-r from-cta to-navy-light text-primary-foreground px-8 py-6 rounded-2xl shadow-lg">
                    <h1 className="text-3xl sm:text-5xl font-bold">{pod.podName}</h1>
                  </div>
                  <p className="text-base text-muted-foreground mt-2">
                    ({assignedPod.primary.areaLabel}: {assignedPod.primary.areaName})
                  </p>
                </div>

                {secondaryPod && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Strong secondary:</p>
                    <div className="inline-block bg-gradient-to-r from-navy-light to-navy text-primary-foreground px-6 py-4 rounded-xl shadow-lg">
                      <h2 className="text-2xl sm:text-3xl font-bold">{secondaryPod.podName}</h2>
                    </div>
                    <p className="text-base text-muted-foreground mt-2">
                      ({assignedPod.secondary!.areaLabel}: {assignedPod.secondary!.areaName})
                    </p>
                  </div>
                )}
              </motion.div>

              {assignedPod.tiedAreas && assignedPod.tiedAreas.length > 0 && (
                <div className="bg-primary-soft border border-primary-border rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-foreground mb-2">
                    Tied areas with equal scores:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {assignedPod.tiedAreas.map((area) => (
                      <li key={area.podId}>
                        {area.areaLabel}: {area.areaName} - Score: {area.finalScore.toFixed(1)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                You are best aligned with
              </h2>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                className="my-8"
              >
                <div className="inline-block bg-gradient-to-r from-cta to-navy-light text-primary-foreground px-8 py-6 rounded-2xl shadow-lg">
                  <h1 className="text-3xl sm:text-5xl font-bold">{pod.podName}</h1>
                </div>
                <p className="text-base text-muted-foreground mt-4">
                  ({assignedPod.primary.areaLabel}: {assignedPod.primary.areaName})
                </p>
              </motion.div>
            </>
          )}

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            {pod.podDescription}
          </p>

          <div className="mt-6 inline-block bg-primary-soft border border-primary-border rounded-lg px-6 py-3">
            <div className="text-sm text-muted-foreground">Final Score</div>
            <div className="text-3xl font-bold text-primary">
              {assignedPod.primary.finalScore.toFixed(1)}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Strongest Signals */}
      {assignedPod.primary.topDrivers.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="card mb-8"
        >
          <h3 className="text-xl font-bold text-foreground mb-4">
            Strongest Signals
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Your highest-rated statements in {assignedPod.primary.areaName}:
          </p>
          <div className="space-y-3">
            {assignedPod.primary.topDrivers.map((driver, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="flex items-start gap-4 bg-primary-soft p-4 rounded-lg border border-primary-border"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-cta text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-foreground font-medium">{driver.question}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-2xl font-bold text-primary">
                    {driver.rating}
                  </div>
                  <div className="text-xs text-muted-foreground">/ 5</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Your Priorities */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="card mb-8"
      >
        <h3 className="text-xl font-bold text-foreground mb-4">Your Top Priorities</h3>
        <div className="flex gap-4">
          <div className="flex-1 bg-primary-soft border border-primary-border rounded-lg p-4">
            <div className="text-sm font-medium text-primary mb-1">1st Choice</div>
            <div className="font-semibold text-foreground">
              {state.firstChoice ? PODS[state.firstChoice].areaLabel : 'N/A'}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {state.firstChoice ? PODS[state.firstChoice].podName : ''}
            </div>
          </div>
          <div className="flex-1 bg-secondary border border-border rounded-lg p-4">
            <div className="text-sm font-medium text-primary mb-1">2nd Choice</div>
            <div className="font-semibold text-foreground">
              {state.secondChoice ? PODS[state.secondChoice].areaLabel : 'N/A'}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {state.secondChoice ? PODS[state.secondChoice].podName : ''}
            </div>
          </div>
        </div>
      </motion.div>

      {/* All Area Scores */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="card mb-8"
      >
        <h3 className="text-xl font-bold text-foreground mb-4">All Area Scores</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Here's how you scored across all areas:
        </p>

        <div className="space-y-4">
          {sortedScores.map((score, index) => {
            const isAssigned = score.podId === assignedPod.primary.podId;
            const isSecondary = assignedPod.secondary && score.podId === assignedPod.secondary.podId;

            return (
              <motion.div
                key={score.podId}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.3 + index * 0.1 }}
                className={`p-4 rounded-lg border-2 ${
                  isAssigned
                    ? 'border-primary bg-primary-soft'
                    : isSecondary
                    ? 'border-primary bg-secondary'
                    : 'border-border bg-muted'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-muted-foreground">#{index + 1}</span>
                    <div>
                      <h4 className="font-bold text-foreground">
                        {score.areaLabel}: {score.areaName}
                      </h4>
                      <p className="text-sm text-muted-foreground">{score.podName}</p>
                      {isAssigned && (
                        <span className="text-xs font-medium text-primary">
                          &larr; Primary Assignment
                        </span>
                      )}
                      {isSecondary && (
                        <span className="text-xs font-medium text-primary">
                          &larr; Secondary Assignment
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">
                      {score.finalScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">Final Score</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                  <div className="bg-card rounded p-2">
                    <div className="text-xs text-muted-foreground">Base Score</div>
                    <div className="font-semibold text-foreground">
                      {score.baseScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Interest: {score.topLevelInterest}/5
                    </div>
                  </div>

                  <div className="bg-card rounded p-2">
                    <div className="text-xs text-muted-foreground">Detail Score</div>
                    <div className="font-semibold text-foreground">
                      {score.detailScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {score.detailedAnswers.length > 0
                        ? `${score.detailedAnswers.length} answers`
                        : 'Skipped'}
                    </div>
                  </div>

                  <div className="bg-card rounded p-2">
                    <div className="text-xs text-muted-foreground">Priority Bonus</div>
                    <div className="font-semibold text-foreground">
                      +{score.priorityBonus.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {score.priorityBonus > 0
                        ? state.firstChoice === score.podId
                          ? '1st choice (scaled)'
                          : '2nd choice (scaled)'
                        : 'Not selected'}
                    </div>
                    {score.priorityBonus > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Scaled by interest
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="text-center"
      >
        <Button onClick={onReset} className="px-8 py-3">
          Start Over
        </Button>
      </motion.div>
    </motion.div>
  );
}
