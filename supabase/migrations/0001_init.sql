create table submissions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  first_name  text not null,
  last_name   text not null,
  region      text not null check (region in ('East','Central','West')),
  person_key  text not null unique,
  answers     jsonb not null,
  computed    jsonb not null,
  version     text not null default 'v1'
);

create index submissions_created_at_idx on submissions(created_at desc);

-- RLS
alter table submissions enable row level security;

-- Anon can INSERT (survey takers) and SELECT (admin dashboard reads client-side).
-- This is intentionally permissive because admin auth is still a hardcoded password.
-- TODO: when admin migrates to Supabase Auth, restrict SELECT/DELETE to authenticated users.
create policy "anon_insert" on submissions for insert to anon with check (true);
create policy "anon_select" on submissions for select to anon using (true);
create policy "anon_delete" on submissions for delete to anon using (true);
