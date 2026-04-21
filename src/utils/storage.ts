import type { SubmissionRecord } from '../types';
import { supabase } from './supabaseClient';

export function normalizePersonKey(firstName: string, lastName: string, region: string): string {
  const normalize = (s: string) => s.trim().replace(/\s+/g, ' ').toLowerCase();
  return `${normalize(firstName)}|${normalize(lastName)}|${region}`;
}

type SubmissionRow = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  region: SubmissionRecord['region'];
  person_key: string;
  answers: SubmissionRecord['answers'];
  computed: SubmissionRecord['computed'];
  version: SubmissionRecord['version'];
};

function fromRow(row: SubmissionRow): SubmissionRecord {
  return {
    id: row.id,
    createdAt: row.created_at,
    firstName: row.first_name,
    lastName: row.last_name,
    region: row.region,
    personKey: row.person_key,
    answers: row.answers,
    computed: row.computed,
    version: row.version,
  };
}

function toRow(record: SubmissionRecord): SubmissionRow {
  return {
    id: record.id,
    created_at: record.createdAt,
    first_name: record.firstName,
    last_name: record.lastName,
    region: record.region,
    person_key: record.personKey,
    answers: record.answers,
    computed: record.computed,
    version: record.version,
  };
}

export async function loadSubmissions(): Promise<SubmissionRecord[]> {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('loadSubmissions failed:', error.message);
    return [];
  }
  return (data ?? []).map((row) => fromRow(row as SubmissionRow));
}

export async function checkPersonKeyExists(personKey: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('submissions')
    .select('id')
    .eq('person_key', personKey)
    .limit(1);

  if (error) {
    console.error('checkPersonKeyExists failed:', error.message);
    return false;
  }
  return (data?.length ?? 0) > 0;
}

export type SaveResult =
  | { ok: true }
  | { ok: false; reason: 'duplicate' | 'error'; error?: unknown };

export async function saveSubmission(record: SubmissionRecord): Promise<SaveResult> {
  const { error } = await supabase.from('submissions').insert(toRow(record));

  if (!error) return { ok: true };

  // Postgres unique_violation
  if ((error as { code?: string }).code === '23505') {
    return { ok: false, reason: 'duplicate' };
  }

  console.error('saveSubmission failed:', error.message);
  return { ok: false, reason: 'error', error };
}

export async function deleteSubmission(id: string): Promise<void> {
  const { error } = await supabase.from('submissions').delete().eq('id', id);
  if (error) {
    console.error('deleteSubmission failed:', error.message);
    throw error;
  }
}
