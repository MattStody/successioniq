-- Fix handle_new_user trigger to respect the role chosen at sign-up.
-- signInWithOtp({ options: { data: { role } } }) stores role in raw_user_meta_data
-- at user-creation time. The original trigger ignored this field and always
-- inserted the default 'seller' role.
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'seller')
  );
  return new;
end;
$$ language plpgsql security definer;
