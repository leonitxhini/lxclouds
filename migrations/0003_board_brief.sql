-- Design boards as a sales tool: which design wins per aspect, an offer and the client's sign-off.
-- picks:   JSON object { logo | colours | type | images | layout | name: board_items.id }
-- offer:   JSON array of { id, title, text, price, unit: "once" | "month" }
-- signoff: JSON object { name, date, signature (PNG data URL) } once the client has approved, else NULL
ALTER TABLE boards ADD COLUMN picks TEXT NOT NULL DEFAULT '{}';
ALTER TABLE boards ADD COLUMN offer TEXT NOT NULL DEFAULT '[]';
ALTER TABLE boards ADD COLUMN signoff TEXT;
