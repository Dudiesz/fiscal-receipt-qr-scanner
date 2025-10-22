-- Create receipts table for storing scanned QR codes
create table if not exists public.receipts (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  access_key text not null,
  original_url text not null,
  scanned_at timestamptz not null default now(),
  
  -- Create index for faster queries by session_id
  constraint receipts_access_key_session_unique unique (access_key, session_id)
);

-- Create index for faster lookups
create index if not exists receipts_session_id_idx on public.receipts(session_id);
create index if not exists receipts_scanned_at_idx on public.receipts(scanned_at desc);

-- Enable RLS for security
alter table public.receipts enable row level security;

-- Allow anyone to insert and read their own session's receipts
create policy "Allow insert for all users"
  on public.receipts for insert
  with check (true);

create policy "Allow select for all users"
  on public.receipts for select
  using (true);

create policy "Allow delete for all users"
  on public.receipts for delete
  using (true);
