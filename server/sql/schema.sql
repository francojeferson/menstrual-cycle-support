CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  public_key TEXT
);

CREATE TABLE cycles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  start_date DATE,
  end_date DATE,
  notes TEXT
);

CREATE TABLE invitations (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  primary_user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE relationships (
  id SERIAL PRIMARY KEY,
  primary_user_id INTEGER REFERENCES users(id),
  partner_user_id INTEGER REFERENCES users(id),
  status TEXT DEFAULT 'pending'
);
