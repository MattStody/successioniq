-- Always assign 'seller' on signup. Role promotion must happen via a
-- server-side admin action — never trust client-supplied raw_user_meta_data,
-- which any caller can set arbitrarily via the anon key.
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, role)
  values (new.id, new.email, 'seller');
  return new;
end;
$$ language plpgsql security definer;
