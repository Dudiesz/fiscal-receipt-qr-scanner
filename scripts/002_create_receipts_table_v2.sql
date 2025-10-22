-- Drop the old table if it exists
drop table if exists public.receipts cascade;

-- Create new receipts table with simplified structure
create table public.receipts (
  identificador uuid primary key default gen_random_uuid(),
  chave_de_acesso text not null unique,
  data_e_hora_do_scan timestamptz not null default now()
);

-- Create index for faster queries on scan date
create index receipts_data_e_hora_do_scan_idx on public.receipts(data_e_hora_do_scan desc);

-- Create index for faster lookups by access key
create index receipts_chave_de_acesso_idx on public.receipts(chave_de_acesso);

-- Enable RLS for security
alter table public.receipts enable row level security;

-- Allow anyone to insert, select, and delete receipts
create policy "Allow all operations for all users"
  on public.receipts
  for all
  using (true)
  with check (true);
