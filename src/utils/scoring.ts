import type { SurveyState, ScoreBreakdown, PodId, AssignmentResult } from '../types';
import { PODS, POD_IDS } from '../config/pods';

function getScaledPriorityBonus(
  podId: PodId,
  topLevelInterest: number,
  state: SurveyState
): number {
  let priorityWeight = 0;
  if (state.firstChoice === podId) priorityWeight = 6;
  else if (state.secondChoice === podId) priorityWeight = 4;

  // Scale the priority weight by the area's TopLevelInterest
  const scaledBonus = priorityWeight * (topLevelInterest / 5);
  return scaledBonus;
}

function calculateDetailScore(answers: number[]): number {
  if (answers.length === 0) return 0;
  const sum = answers.reduce((acc, val) => acc + val, 0);
  const average = sum / answers.length;
  return average * 3;
}

function getTopDrivers(
  answers: number[],
  questions: string[]
): Array<{ question: string; rating: number }> {
  const drivers = answers
    .map((rating, index) => ({
      question: questions[index],
      rating,
    }))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 2);

  return drivers;
}

export function calculateScores(state: SurveyState): ScoreBreakdown[] {
  return POD_IDS.map((podId) => {
    const pod = PODS[podId];
    const topLevelInterest = state.topLevelInterest[podId] || 0;
    const baseScore = topLevelInterest * 2;

    // Get detailed answers (filter out nulls)
    const detailedAnswers: number[] = (state.detailedAnswers[podId] || [])
      .filter((val) => val !== null) as number[];

    const detailScore = calculateDetailScore(detailedAnswers);
    const priorityBonus = getScaledPriorityBonus(podId, topLevelInterest, state);

    const finalScore = baseScore + detailScore + priorityBonus;

    const topDrivers = getTopDrivers(detailedAnswers, pod.detailedQuestions);

    return {
      podId,
      areaLabel: pod.areaLabel,
      areaName: pod.areaName,
      podName: pod.podName,
      topLevelInterest,
      baseScore,
      detailedAnswers,
      detailScore,
      priorityBonus,
      finalScore,
      topDrivers,
    };
  });
}

/**
 * Determines the assigned POD based on FinalScore and tie-breaking rules.
 *
 * CRITICAL: Preferences (First/Second Choice) are ONLY used as tie-breakers
 * among areas with the HIGHEST FinalScore. They NEVER override higher scores.
 *
 * Example scenario:
 * - Area 3 FinalScore = 4.0, Area 4 FinalScore = 4.0
 * - Area 1 FinalScore = 3.2 (First Choice), Area 2 FinalScore = 2.8
 * - Winner MUST be Area 3 or 4 (tied at max score), NOT Area 1
 */
export function determineAssignedPod(
  breakdowns: ScoreBreakdown[],
  state: SurveyState
): AssignmentResult {
  // Find the maximum FinalScore
  const maxScore = Math.max(...breakdowns.map((b) => b.finalScore));

  // Find all areas with the maximum FinalScore (exact equality)
  const topTies = breakdowns.filter((b) => b.finalScore === maxScore);

  // If only one area has the max score, it's the clear winner
  if (topTies.length === 1) {
    return {
      primary: topTies[0],
      isMultiFit: false,
    };
  }

  // Multiple areas tied for max score - apply tie-breakers ONLY within topTies

  // Tie-breaker 1: If First Choice is in topTies, it wins
  const firstChoiceWinner = topTies.find((b) => b.podId === state.firstChoice);
  if (firstChoiceWinner) {
    return {
      primary: firstChoiceWinner,
      isMultiFit: false,
    };
  }

  // Tie-breaker 2: If Second Choice is in topTies, it wins
  const secondChoiceWinner = topTies.find((b) => b.podId === state.secondChoice);
  if (secondChoiceWinner) {
    return {
      primary: secondChoiceWinner,
      isMultiFit: false,
    };
  }

  // Tie-breaker 3: Highest TopLevelInterest among topTies
  const maxTopLevel = Math.max(...topTies.map((b) => b.topLevelInterest));
  const topLevelTies = topTies.filter((b) => b.topLevelInterest === maxTopLevel);

  if (topLevelTies.length === 1) {
    return {
      primary: topLevelTies[0],
      isMultiFit: false,
    };
  }

  // Tie-breaker 4: Highest DetailScore among remaining ties
  const maxDetail = Math.max(...topLevelTies.map((b) => b.detailScore));
  const detailTies = topLevelTies.filter((b) => b.detailScore === maxDetail);

  if (detailTies.length === 1) {
    return {
      primary: detailTies[0],
      isMultiFit: false,
    };
  }

  // True tie after all tie-breakers - Multi-fit state
  // Select Primary and Secondary from the tied max-score areas (detailTies)
  // Use deterministic ordering (pod1 -> pod2 -> pod3 -> pod4)
  const multiFitAreas = [...detailTies].sort((a, b) =>
    a.podId.localeCompare(b.podId)
  );

  return {
    primary: multiFitAreas[0],
    isMultiFit: true,
    secondary: multiFitAreas[1],
    tiedAreas: multiFitAreas,
  };
}
