import type { SubmissionRecord } from '../types';

export function groupCounts<T>(
  items: T[],
  keyFn: (item: T) => string
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = keyFn(item);
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

export function timeSeriesCounts(
  submissions: SubmissionRecord[],
  days: number
): Array<{ date: string; count: number }> {
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - days + 1);
  cutoff.setHours(0, 0, 0, 0);

  // Build day map
  const dayMap: Record<string, number> = {};
  for (let i = 0; i < days; i++) {
    const d = new Date(cutoff);
    d.setDate(d.getDate() + i);
    dayMap[formatDate(d)] = 0;
  }

  // Count submissions per day
  for (const s of submissions) {
    const dateStr = s.computed.submittedAt ?? s.createdAt;
    const day = formatDate(new Date(dateStr));
    if (day in dayMap) {
      dayMap[day]++;
    }
  }

  return Object.entries(dayMap).map(([date, count]) => ({ date, count }));
}

function formatDate(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${m}/${day}`;
}

export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function filterByDateRange(
  submissions: SubmissionRecord[],
  days: number
): SubmissionRecord[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  cutoff.setHours(0, 0, 0, 0);
  return submissions.filter((s) => {
    const d = new Date(s.computed.submittedAt ?? s.createdAt);
    return d >= cutoff;
  });
}

export function filterByRegion(
  submissions: SubmissionRecord[],
  region: string
): SubmissionRecord[] {
  if (!region) return submissions;
  return submissions.filter((s) => s.region === region);
}
