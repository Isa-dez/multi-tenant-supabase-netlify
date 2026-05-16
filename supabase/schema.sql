-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Organizations (tenants)
create table public.organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  created_at timestamptz default now()
);

-- Profiles (one per auth user)
create table public.profiles (
  id uuid primary key, -- matches auth.users.id
  email text not null,
  created_at timestamptz default now()
);

-- User ↔ Organization membership
create table public.user_organizations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  role text not null default 'member', -- 'owner' | 'admin' | 'member'
  created_at timestamptz default now(),
  unique (user_id, organization_id)
);

-- Example tenant-scoped data: projects
create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.organizations enable row level security;
alter table public.user_organizations enable row level security;
alter table public.projects enable row level security;

-- RLS policies

-- Profiles: each user sees only their own profile
create policy "Profiles: user can view own profile"
  on public.profiles
  for select
  using (id = auth.uid());

create policy "Profiles: user can insert self"
  on public.profiles
  for insert
  with check (id = auth.uid());

-- Organizations: user can see orgs they belong to
create policy "Orgs: members can select"
  on public.organizations
  for select
  using (
    exists (
      select 1 from public.user_organizations uo
      where uo.organization_id = organizations.id
        and uo.user_id = auth.uid()
    )
  );

-- User_organizations: user sees their memberships
create policy "UserOrgs: user can select own memberships"
  on public.user_organizations
  for select
  using (user_id = auth.uid());

-- Projects: only members of org can see/modify
create policy "Projects: members can select"
  on public.projects
  for select
  using (
    exists (
      select 1 from public.user_organizations uo
      where uo.organization_id = projects.organization_id
        and uo.user_id = auth.uid()
    )
  );

create policy "Projects: members can insert"
  on public.projects
  for insert
  with check (
    exists (
      select 1 from public.user_organizations uo
      where uo.organization_id = projects.organization_id
        and uo.user_id = auth.uid()
    )
  );

create policy "Projects: members can update"
  on public.projects
  for update
  using (
    exists (
      select 1 from public.user_organizations uo
      where uo.organization_id = projects.organization_id
        and uo.user_id = auth.uid()
    )
  );

create policy "Projects: members can delete"
  on public.projects
  for delete
  using (
    exists (
      select 1 from public.user_organizations uo
      where uo.organization_id = projects.organization_id
        and uo.user_id = auth.uid()
    )
  );
