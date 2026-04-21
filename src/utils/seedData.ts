// NOTE: this module still writes to localStorage. Real submissions now live in
// Supabase (see src/utils/storage.ts). This seed path is out of sync with the
// real data source and is effectively dead code — the admin dashboard reads
// from Supabase and will not show records inserted here. Kept in place for
// future rework. Do not rely on it for demo data.
import type { SubmissionRecord, PodId, LikertValue, Region, GrowthFocusArea, ScoreBreakdown } from '../types';
import { PODS, POD_IDS, GROWTH_AREA_MAPPING } from '../config/pods';

const STORAGE_KEY = 'podFinder_submissions_v1';

// 48 fake people: 16 per region, 12 per pod
const FAKE_PEOPLE: Array<{ first: string; last: string; region: Region; targetPod: PodId }> = [
  // === POD 1 - Training Programs (12 people, 4 per region) ===
  { first: 'Maya', last: 'Chen', region: 'East', targetPod: 'pod1' },
  { first: 'Devon', last: 'Brooks', region: 'East', targetPod: 'pod1' },
  { first: 'Priya', last: 'Nair', region: 'East', targetPod: 'pod1' },
  { first: 'Jordan', last: 'Ellis', region: 'East', targetPod: 'pod1' },
  { first: 'Lucia', last: 'Fernandez', region: 'Central', targetPod: 'pod1' },
  { first: 'Marcus', last: 'Holt', region: 'Central', targetPod: 'pod1' },
  { first: 'Aisha', last: 'Rahman', region: 'Central', targetPod: 'pod1' },
  { first: 'Tyler', last: 'Nakamura', region: 'Central', targetPod: 'pod1' },
  { first: 'Soren', last: 'Lindqvist', region: 'West', targetPod: 'pod1' },
  { first: 'Nina', last: 'Okafor', region: 'West', targetPod: 'pod1' },
  { first: 'Kai', last: 'Reeves', region: 'West', targetPod: 'pod1' },
  { first: 'Elena', last: 'Vasquez', region: 'West', targetPod: 'pod1' },

  // === POD 2 - Pursuit / Sales GTM Support (12 people, 4 per region) ===
  { first: 'Raj', last: 'Patel', region: 'East', targetPod: 'pod2' },
  { first: 'Samantha', last: 'Kim', region: 'East', targetPod: 'pod2' },
  { first: 'Omar', last: 'Hassan', region: 'East', targetPod: 'pod2' },
  { first: 'Claire', last: 'Dubois', region: 'East', targetPod: 'pod2' },
  { first: 'Diego', last: 'Morales', region: 'Central', targetPod: 'pod2' },
  { first: 'Fiona', last: 'Chang', region: 'Central', targetPod: 'pod2' },
  { first: 'Liam', last: 'O\'Brien', region: 'Central', targetPod: 'pod2' },
  { first: 'Zara', last: 'Hussain', region: 'Central', targetPod: 'pod2' },
  { first: 'Bennett', last: 'Park', region: 'West', targetPod: 'pod2' },
  { first: 'Isla', last: 'McTavish', region: 'West', targetPod: 'pod2' },
  { first: 'Andre', last: 'Williams', region: 'West', targetPod: 'pod2' },
  { first: 'Mei', last: 'Zhang', region: 'West', targetPod: 'pod2' },

  // === POD 3 - Culture & Community (12 people, 4 per region) ===
  { first: 'Ava', last: 'Thompson', region: 'East', targetPod: 'pod3' },
  { first: 'Kwame', last: 'Asante', region: 'East', targetPod: 'pod3' },
  { first: 'Harper', last: 'Reed', region: 'East', targetPod: 'pod3' },
  { first: 'Yuki', last: 'Tanaka', region: 'East', targetPod: 'pod3' },
  { first: 'Carmen', last: 'Reyes', region: 'Central', targetPod: 'pod3' },
  { first: 'Elijah', last: 'Foster', region: 'Central', targetPod: 'pod3' },
  { first: 'Nadia', last: 'Kozlov', region: 'Central', targetPod: 'pod3' },
  { first: 'Rowan', last: 'Sinclair', region: 'Central', targetPod: 'pod3' },
  { first: 'Amara', last: 'Diallo', region: 'West', targetPod: 'pod3' },
  { first: 'Jesse', last: 'Nguyen', region: 'West', targetPod: 'pod3' },
  { first: 'Talia', last: 'Rivera', region: 'West', targetPod: 'pod3' },
  { first: 'Oscar', last: 'Bergman', region: 'West', targetPod: 'pod3' },

  // === POD 4 - Delivery Support & Enablement (12 people, 4 per region) ===
  { first: 'Dana', last: 'Sullivan', region: 'East', targetPod: 'pod4' },
  { first: 'Ravi', last: 'Sharma', region: 'East', targetPod: 'pod4' },
  { first: 'Chloe', last: 'Martin', region: 'East', targetPod: 'pod4' },
  { first: 'Nolan', last: 'Fischer', region: 'East', targetPod: 'pod4' },
  { first: 'Ingrid', last: 'Svensson', region: 'Central', targetPod: 'pod4' },
  { first: 'Leo', last: 'Gutierrez', region: 'Central', targetPod: 'pod4' },
  { first: 'Vera', last: 'Popov', region: 'Central', targetPod: 'pod4' },
  { first: 'Miles', last: 'Adebayo', region: 'Central', targetPod: 'pod4' },
  { first: 'Quinn', last: 'Johansson', region: 'West', targetPod: 'pod4' },
  { first: 'Sienna', last: 'Lee', region: 'West', targetPod: 'pod4' },
  { first: 'Felix', last: 'Romero', region: 'West', targetPod: 'pod4' },
  { first: 'Aria', last: 'Whitfield', region: 'West', targetPod: 'pod4' },
];

// Growth areas that map to each pod
const GROWTH_BY_POD: Record<PodId, GrowthFocusArea[]> = {
  pod1: ['Technical Depth', 'Leadership Skills', 'Mentoring & Coaching', 'Innovation & Experimentation'],
  pod2: ['Cross-Functional Exposure', 'Client-Facing Skills'],
  pod3: ['Leadership Skills', 'Mentoring & Coaching', 'Community Building'],
  pod4: ['Technical Depth', 'Cross-Functional Exposure', 'Process Improvement', 'Innovation & Experimentation'],
};

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function likert(base: number, rng: () => number): LikertValue {
  const jitter = Math.floor(rng() * 3) - 1; // -1, 0, or 1
  return Math.max(1, Math.min(5, base + jitter)) as LikertValue;
}

function generateSubmission(person: typeof FAKE_PEOPLE[0], index: number): SubmissionRecord {
  const rng = seededRandom(index * 7919 + 42);
  const { first, last, region, targetPod } = person;

  // Top-level interest: high for target pod, moderate-low for others
  const topLevelInterest: Record<PodId, LikertValue> = {} as Record<PodId, LikertValue>;
  for (const podId of POD_IDS) {
    if (podId === targetPod) {
      topLevelInterest[podId] = likert(5, rng); // 4 or 5
    } else {
      topLevelInterest[podId] = likert(2, rng); // 1-3
    }
  }

  // Detailed answers: only for pods rated >= 3
  const detailedAnswers: Record<PodId, LikertValue[]> = {} as Record<PodId, LikertValue[]>;
  for (const podId of POD_IDS) {
    const rating = topLevelInterest[podId] ?? 0;
    if (rating >= 3) {
      detailedAnswers[podId] = [
        likert(podId === targetPod ? 5 : 3, rng),
        likert(podId === targetPod ? 4 : 3, rng),
        likert(podId === targetPod ? 5 : 2, rng),
        likert(podId === targetPod ? 4 : 3, rng),
      ];
    } else {
      detailedAnswers[podId] = [];
    }
  }

  // First and second choice
  const firstChoice: PodId = targetPod;
  const otherPods = POD_IDS.filter(p => p !== targetPod);
  const secondChoice: PodId = pick(otherPods, rng);

  // Growth areas: pick 2-3 from the target pod's matching areas + maybe 1 random
  const podGrowth = GROWTH_BY_POD[targetPod];
  const growthCount = 2 + Math.floor(rng() * 2); // 2-3
  const selectedGrowth = new Set<GrowthFocusArea>();
  for (let i = 0; i < growthCount && i < podGrowth.length; i++) {
    selectedGrowth.add(podGrowth[i % podGrowth.length]);
  }
  // Sometimes add a random one
  if (rng() > 0.5) {
    const allGrowth: GrowthFocusArea[] = [
      'Technical Depth', 'Leadership Skills', 'Cross-Functional Exposure',
      'Client-Facing Skills', 'Mentoring & Coaching', 'Process Improvement',
      'Innovation & Experimentation', 'Community Building',
    ];
    selectedGrowth.add(pick(allGrowth, rng));
  }
  const focusAreas = Array.from(selectedGrowth);

  // Build a fake SurveyState to compute scores properly
  const surveyState = {
    info: { firstName: first, lastName: last, region },
    topLevelInterest,
    detailedAnswers,
    firstChoice,
    secondChoice,
    growth: { focusAreas },
    currentStep: 7,
    returnToStep: null,
    startedAt: null,
  };

  // Compute scores using the same algorithm
  const areaScores = computeScores(surveyState, focusAreas);
  const assignment = determineWinner(areaScores, surveyState);

  // Spread submissions over the last 30 days
  const daysAgo = Math.floor(rng() * 30);
  const hoursOffset = Math.floor(rng() * 12) + 8; // 8am - 8pm
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hoursOffset, Math.floor(rng() * 60), 0, 0);
  const createdAt = date.toISOString();

  const id = crypto.randomUUID ? crypto.randomUUID() : `seed-${index}-${Date.now()}`;

  return {
    id,
    createdAt,
    firstName: first,
    lastName: last,
    region,
    personKey: `${first.toLowerCase()}|${last.toLowerCase()}|${region}`,
    answers: {
      topLevelInterest,
      detailedAnswers,
      firstChoice,
      secondChoice,
      growth: { focusAreas },
    },
    computed: {
      areaScores,
      winningAreaId: assignment.primaryId,
      winningAreaName: PODS[assignment.primaryId].areaName,
      winningPodName: PODS[assignment.primaryId].podName,
      isMultiFit: assignment.isMultiFit,
      ...(assignment.secondaryId ? {
        secondaryAreaId: assignment.secondaryId,
        secondaryPodName: PODS[assignment.secondaryId].podName,
      } : {}),
      finalScore: assignment.finalScore,
      submittedAt: createdAt,
      durationMinutes: 3 + Math.floor(Math.random() * 8), // 3-10 min
    },
    version: 'v1' as const,
  };
}

// Inline score computation (mirrors scoring.ts logic)
function computeScores(
  state: { topLevelInterest: Record<PodId, LikertValue>; detailedAnswers: Record<PodId, LikertValue[]>; firstChoice: PodId | null; secondChoice: PodId | null; growth: { focusAreas: GrowthFocusArea[] } },
  _focusAreas: GrowthFocusArea[]
): ScoreBreakdown[] {
  return POD_IDS.map((podId) => {
    const pod = PODS[podId];
    const topLevel = state.topLevelInterest[podId] || 0;
    const baseScore = topLevel * 2;

    const detailed = (state.detailedAnswers[podId] || [])
      .filter((v): v is NonNullable<LikertValue> => v !== null);

    let detailScore = 0;
    if (detailed.length > 0) {
      const avg = detailed.reduce((a, b) => a + b, 0) / detailed.length;
      detailScore = avg * 3;
    }

    let priorityWeight = 0;
    if (state.firstChoice === podId) priorityWeight = 6;
    else if (state.secondChoice === podId) priorityWeight = 4;
    const priorityBonus = priorityWeight * (topLevel / 5);

    const coreScore = baseScore + detailScore + priorityBonus;

    // Growth bonus
    const hits = state.growth.focusAreas.filter(area =>
      GROWTH_AREA_MAPPING[area]?.includes(podId)
    ).length;
    const growthBonus = state.growth.focusAreas.length > 0
      ? (hits / state.growth.focusAreas.length) * 0.25
      : 0;

    const finalScore = coreScore + growthBonus;

    const topDrivers = detailed
      .map((rating, i) => ({ question: pod.detailedQuestions[i] || '', rating }))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 2);

    return {
      podId,
      areaLabel: pod.areaLabel,
      areaName: pod.areaName,
      podName: pod.podName,
      topLevelInterest: topLevel,
      baseScore,
      detailedAnswers: detailed,
      detailScore,
      priorityBonus,
      growthBonus,
      coreScore,
      finalScore,
      topDrivers,
    };
  });
}

function determineWinner(
  scores: ScoreBreakdown[],
  state: { firstChoice: PodId | null; secondChoice: PodId | null }
): { primaryId: PodId; isMultiFit: boolean; secondaryId?: PodId; finalScore: number } {
  const EPSILON = 1e-9;
  const maxScore = Math.max(...scores.map(s => s.finalScore));
  const topTies = scores.filter(s => Math.abs(s.finalScore - maxScore) < EPSILON);

  if (topTies.length === 1) {
    return { primaryId: topTies[0].podId, isMultiFit: false, finalScore: maxScore };
  }

  const fc = topTies.find(s => s.podId === state.firstChoice);
  if (fc) return { primaryId: fc.podId, isMultiFit: false, finalScore: maxScore };

  const sc = topTies.find(s => s.podId === state.secondChoice);
  if (sc) return { primaryId: sc.podId, isMultiFit: false, finalScore: maxScore };

  const maxTop = Math.max(...topTies.map(s => s.topLevelInterest));
  const topLevel = topTies.filter(s => s.topLevelInterest === maxTop);
  if (topLevel.length === 1) return { primaryId: topLevel[0].podId, isMultiFit: false, finalScore: maxScore };

  const maxDetail = Math.max(...topLevel.map(s => s.detailScore));
  const detailTies = topLevel.filter(s => s.detailScore === maxDetail);
  if (detailTies.length === 1) return { primaryId: detailTies[0].podId, isMultiFit: false, finalScore: maxScore };

  const sorted = [...detailTies].sort((a, b) => a.podId.localeCompare(b.podId));
  return {
    primaryId: sorted[0].podId,
    isMultiFit: true,
    secondaryId: sorted[1]?.podId,
    finalScore: maxScore,
  };
}

export function generateSeedData(): SubmissionRecord[] {
  return FAKE_PEOPLE.map((person, i) => generateSubmission(person, i));
}

export function loadSeedData(): number {
  const existing = localStorage.getItem(STORAGE_KEY);
  const submissions: SubmissionRecord[] = existing ? JSON.parse(existing) : [];
  const seedRecords = generateSeedData();

  // Avoid duplicates by personKey
  const existingKeys = new Set(submissions.map(s => s.personKey));
  const newRecords = seedRecords.filter(r => !existingKeys.has(r.personKey));

  if (newRecords.length === 0) return 0;

  const merged = [...submissions, ...newRecords];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  return newRecords.length;
}

export function clearAllSubmissions(): void {
  localStorage.removeItem(STORAGE_KEY);
}
