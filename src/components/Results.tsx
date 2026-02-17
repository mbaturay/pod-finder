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
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-700 mb-2">
                You're a strong fit for multiple PODs
              </h2>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                className="my-8"
              >
                <div className="mb-4">
                  <p className="text-sm font-medium text-slate-600 mb-2">Primary recommendation:</p>
                  <div className="inline-block bg-gradient-to-r from-primary-600 to-blue-600 text-white px-8 py-6 rounded-2xl shadow-2xl">
                    <h1 className="text-3xl sm:text-5xl font-bold">{pod.podName}</h1>
                  </div>
                  <p className="text-base text-slate-600 mt-2">
                    ({assignedPod.primary.areaLabel}: {assignedPod.primary.areaName})
                  </p>
                </div>

                {secondaryPod && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-slate-600 mb-2">Strong secondary:</p>
                    <div className="inline-block bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-4 rounded-xl shadow-lg">
                      <h2 className="text-2xl sm:text-3xl font-bold">{secondaryPod.podName}</h2>
                    </div>
                    <p className="text-base text-slate-600 mt-2">
                      ({assignedPod.secondary!.areaLabel}: {assignedPod.secondary!.areaName})
                    </p>
                  </div>
                )}
              </motion.div>

              {assignedPod.tiedAreas && assignedPod.tiedAreas.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-slate-700 mb-2">
                    Tied areas with equal scores:
                  </p>
                  <ul className="text-sm text-slate-600 space-y-1">
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
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-700 mb-2">
                You are best aligned with
              </h2>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                className="my-8"
              >
                <div className="inline-block bg-gradient-to-r from-primary-600 to-blue-600 text-white px-8 py-6 rounded-2xl shadow-2xl">
                  <h1 className="text-3xl sm:text-5xl font-bold">{pod.podName}</h1>
                </div>
                <p className="text-base text-slate-600 mt-4">
                  ({assignedPod.primary.areaLabel}: {assignedPod.primary.areaName})
                </p>
              </motion.div>
            </>
          )}

          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-4">
            {pod.podDescription}
          </p>

          <div className="mt-6 inline-block bg-primary-50 border border-primary-200 rounded-lg px-6 py-3">
            <div className="text-sm text-slate-600">Final Score</div>
            <div className="text-3xl font-bold text-primary-700">
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
          <h3 className="text-xl font-bold text-slate-800 mb-4">
            Strongest Signals
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Your highest-rated statements in {assignedPod.primary.areaName}:
          </p>
          <div className="space-y-3">
            {assignedPod.primary.topDrivers.map((driver, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="flex items-start gap-4 bg-gradient-to-r from-primary-50 to-blue-50 p-4 rounded-lg border border-primary-100"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-slate-800 font-medium">{driver.question}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-2xl font-bold text-primary-700">
                    {driver.rating}
                  </div>
                  <div className="text-xs text-slate-500">/ 5</div>
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
        <h3 className="text-xl font-bold text-slate-800 mb-4">Your Top Priorities</h3>
        <div className="flex gap-4">
          <div className="flex-1 bg-primary-50 border border-primary-200 rounded-lg p-4">
            <div className="text-sm font-medium text-primary-700 mb-1">1st Choice</div>
            <div className="font-semibold text-slate-800">
              {state.firstChoice ? PODS[state.firstChoice].areaLabel : 'N/A'}
            </div>
            <div className="text-sm text-slate-600 mt-1">
              {state.firstChoice ? PODS[state.firstChoice].podName : ''}
            </div>
          </div>
          <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm font-medium text-blue-700 mb-1">2nd Choice</div>
            <div className="font-semibold text-slate-800">
              {state.secondChoice ? PODS[state.secondChoice].areaLabel : 'N/A'}
            </div>
            <div className="text-sm text-slate-600 mt-1">
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
        <h3 className="text-xl font-bold text-slate-800 mb-4">All Area Scores</h3>
        <p className="text-sm text-slate-600 mb-4">
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
                    ? 'border-primary-600 bg-primary-50'
                    : isSecondary
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-slate-400">#{index + 1}</span>
                    <div>
                      <h4 className="font-bold text-slate-800">
                        {score.areaLabel}: {score.areaName}
                      </h4>
                      <p className="text-sm text-slate-600">{score.podName}</p>
                      {isAssigned && (
                        <span className="text-xs font-medium text-primary-600">
                          ← Primary Assignment
                        </span>
                      )}
                      {isSecondary && (
                        <span className="text-xs font-medium text-blue-600">
                          ← Secondary Assignment
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-800">
                      {score.finalScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-slate-500">Final Score</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                  <div className="bg-white rounded p-2">
                    <div className="text-xs text-slate-500">Base Score</div>
                    <div className="font-semibold text-slate-700">
                      {score.baseScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-slate-400">
                      Interest: {score.topLevelInterest}/5
                    </div>
                  </div>

                  <div className="bg-white rounded p-2">
                    <div className="text-xs text-slate-500">Detail Score</div>
                    <div className="font-semibold text-slate-700">
                      {score.detailScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-slate-400">
                      {score.detailedAnswers.length > 0
                        ? `${score.detailedAnswers.length} answers`
                        : 'Skipped'}
                    </div>
                  </div>

                  <div className="bg-white rounded p-2">
                    <div className="text-xs text-slate-500">Priority Bonus</div>
                    <div className="font-semibold text-slate-700">
                      +{score.priorityBonus.toFixed(1)}
                    </div>
                    <div className="text-xs text-slate-400">
                      {score.priorityBonus > 0
                        ? state.firstChoice === score.podId
                          ? '1st choice (scaled)'
                          : '2nd choice (scaled)'
                        : 'Not selected'}
                    </div>
                    {score.priorityBonus > 0 && (
                      <div className="text-xs text-slate-400 mt-1">
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
