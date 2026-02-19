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

export function checkPersonKeyExists(personKey: string): boolean {
  return loadSubmissions().some(s => s.personKey === personKey);
}

export function saveSubmission(record: SubmissionRecord): void {
  const submissions = loadSubmissions();
  submissions.push(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
}

export function deleteSubmission(id: string): void {
  const submissions = loadSubmissions().filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
}
