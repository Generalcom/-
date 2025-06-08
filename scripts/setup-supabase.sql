-- Create a table for public profiles
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text,
  email text unique, -- Added email for easier querying if needed, ensure it's kept in sync
  -- Add any other profile fields you need
  constraint username_length check (char_length(full_name) >= 3)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.email -- Store the email from auth.users
  );
  return new;
end;
$$;

-- Drop existing trigger if it exists, to avoid errors on re-run
drop trigger if exists on_auth_user_created on auth.users;

-- Create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Optional: Function to update profile email if auth email changes
create or replace function public.handle_user_email_update()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.profiles
  set email = new.email, updated_at = now()
  where id = new.id;
  return new;
end;
$$;

-- Drop existing trigger if it exists
drop trigger if exists on_auth_user_email_updated on auth.users;

-- Create the trigger for email updates
create trigger on_auth_user_email_updated
  after update of email on auth.users
  for each row execute procedure public.handle_user_email_update();

-- Enable storage for user avatars (optional)
-- insert into storage.buckets (id, name, public)
-- values ('avatars', 'avatars', true)
-- on conflict (id) do nothing;

-- create policy "Avatar images are publicly accessible."
--   on storage.objects for select
--   using ( bucket_id = 'avatars' );

-- create policy "Anyone can upload an avatar."
--   on storage.objects for insert
--   with check ( bucket_id = 'avatars' );

-- create policy "Users can update their own avatar."
--   on storage.objects for update
--   using ( auth.uid() = owner )
--   with check ( bucket_id = 'avatars' );

-- create policy "Users can delete their own avatar."
--   on storage.objects for delete
--   using ( auth.uid() = owner );

-- Seed some example data (optional, for testing)
-- Make sure to replace with actual user UUIDs if you have existing users
-- INSERT INTO profiles (id, full_name, email)
-- VALUES
--   ('your-user-uuid-1', 'Test User One', 'test1@example.com'),
--   ('your-user-uuid-2', 'Test User Two', 'test2@example.com')
-- ON CONFLICT (id) DO NOTHING;

-- Grant usage on schema public to postgres and anon, authenticated roles
grant usage on schema public to postgres;
grant usage on schema public to anon;
grant usage on schema public to authenticated;

-- Grant all privileges on all tables in schema public to postgres
grant all privileges on all tables in schema public to postgres;
grant all privileges on all tables in schema public to service_role;


-- Grant select, insert, update, delete on specific tables to anon and authenticated roles as needed
grant select, insert, update, delete on public.profiles to anon;
grant select, insert, update, delete on public.profiles to authenticated;

-- Note: Adjust grants based on your RLS policies. If RLS handles it, direct grants might not be needed or could be more restrictive.
