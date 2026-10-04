-- Client conversations: one sheet per meeting, filled in together with the client
-- (what he does, what the website should bring, what he wants on it, what he thinks of the drafts, next steps).
CREATE TABLE talks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  doc TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
