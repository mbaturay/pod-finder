import type { SubmissionRecord } from '../types';

const STORAGE_KEY = 'podFinder_submissions_v1';

export function normalizePersonKey(firstName: string, lastName: string, region: string): string {
  const normalize = (s: string) => s.trim().replace(/\s+/g, ' ').toLowerCase();
  return `${normalize(firstName)}|${normalize(lastName)}|${region}`;
}

export function loadSubmissions(): SubmissionRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveSubmission(record: SubmissionRecord): { success: boolean; error?: string } {
  const submissions = loadSubmissions();
  const existing = submissions.find(s => s.personKey === record.personKey);
  if (existing) {
    return {
      success: false,
      error: `It looks like you've already completed this survey for ${record.region}. If you need changes, contact an admin.`,
    };
  }
  submissions.push(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  return { success: true };
}

export function deleteSubmission(id: string): void {
  const submissions = loadSubmissions().filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
}
