CREATE TABLE IF NOT EXISTS t_p58262826_telegram_like_messen.users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p58262826_telegram_like_messen.sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES t_p58262826_telegram_like_messen.users(id),
  token VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL
);
