-- LX Studio: the private admin area of lxclouds.com

CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  pass_hash TEXT NOT NULL,
  pass_salt TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE sessions (
  token_hash TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_agent TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL
);

CREATE TABLE login_attempts (
  id INTEGER PRIMARY KEY,
  ip TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX login_attempts_ip ON login_attempts(ip, created_at);

-- status: lead | contact | offer | won | lost
CREATE TABLE clients (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  industry TEXT,
  city TEXT,
  status TEXT NOT NULL DEFAULT 'lead',
  value INTEGER,
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- kind: note | call | meeting | email | system
CREATE TABLE activities (
  id INTEGER PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  kind TEXT NOT NULL DEFAULT 'note',
  text TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX activities_client ON activities(client_id, created_at);

CREATE TABLE tasks (
  id INTEGER PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  due TEXT,
  done INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  done_at TEXT
);

-- doc: the whole demo website as JSON (see src/demo/types.ts)
CREATE TABLE demos (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  template TEXT,
  doc TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  shared INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE demo_versions (
  id INTEGER PRIMARY KEY,
  demo_id INTEGER NOT NULL REFERENCES demos(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  doc TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- own templates; the built-in ones live in the code (src/demo/templates.ts)
CREATE TABLE templates (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT,
  doc TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- status: idea | building | live | paused
CREATE TABLE projects (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL,
  url TEXT,
  repo TEXT,
  hosting TEXT,
  status TEXT NOT NULL DEFAULT 'live',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- status: new | read | done
CREATE TABLE inquiries (
  id INTEGER PRIMARY KEY,
  name TEXT,
  email TEXT,
  message TEXT NOT NULL,
  lang TEXT,
  page TEXT,
  ip TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE media (
  key TEXT PRIMARY KEY,
  name TEXT,
  type TEXT,
  size INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO projects (name, url, repo, hosting, status) VALUES
  ('ZgjedhPlus', 'https://zgjedhplus.com', NULL, 'Hetzner + Cloudflare', 'live'),
  ('FrameNotion', 'https://framenotion.com', NULL, 'Hetzner', 'live'),
  ('RRON Rent a Car', 'https://rentacarron.com', NULL, 'Cloudflare Pages', 'live'),
  ('SubToAPI', 'https://subtoapi.app', 'leonitxhini/subtoapi', 'Cloudflare Pages', 'live'),
  ('lxclouds.com', 'https://lxclouds.com', 'leonitxhini/lxclouds', 'Cloudflare Pages', 'live');
