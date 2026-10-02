-- Design boards: sets of design images that are shown to a client and discussed on the spot.
CREATE TABLE boards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  link TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE board_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  board_id INTEGER NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  group_name TEXT,
  image TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  -- '' | 'favorite' | 'maybe' | 'out'
  status TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  -- JSON array of { id, x, y, text, done }; x and y in percent of the image
  pins TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX board_items_board ON board_items (board_id, position, id);
