/**
 * API of LX Studio, the private admin area of lxclouds.com (Cloudflare Pages Function).
 *
 * Everything needs a session except /api/auth/login and /api/public/*.
 * Data lives in D1 (binding DB, schema in /migrations), uploaded images in R2 (binding MEDIA).
 */

const COOKIE = "lx_studio";
const SESSION_DAYS = 30;
const MAX_BODY = 900_000; // a demo document with all its text is far below this
const MAX_UPLOAD = 8 * 1024 * 1024;
const IMAGE_TYPES = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif", "image/svg+xml": "svg", "image/avif": "avif" };

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers },
  });

async function readJson(request) {
  const text = await request.text();
  if (text.length > MAX_BODY) throw new HttpError(413, "Zu viele Daten auf einmal.");
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new HttpError(400, "Ungültige Anfrage.");
  }
}

// ---------- crypto ----------
const hex = (buffer) => [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
const randomHex = (bytes) => hex(crypto.getRandomValues(new Uint8Array(bytes)));
const sha256 = async (text) => hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)));

async function hashPassword(password, saltHex) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const salt = new Uint8Array(saltHex.match(/../g).map((h) => parseInt(h, 16)));
  return hex(await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" }, key, 256));
}

function sameString(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// ---------- helpers ----------
const str = (value, max = 400) => (value === undefined || value === null ? null : String(value).trim().slice(0, max) || null);
const int = (value) => (value === undefined || value === null || value === "" ? null : Number.isFinite(Number(value)) ? Math.round(Number(value)) : null);
const now = () => new Date().toISOString().slice(0, 19).replace("T", " ");

function slugify(text) {
  return (
    String(text)
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/ß/g, "ss")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 32) || "demo"
  );
}

/** Builds "UPDATE … SET" from the allowed fields that are present in the body. */
function patch(body, fields) {
  const sets = [];
  const values = [];
  for (const [field, convert] of Object.entries(fields)) {
    if (!(field in body)) continue;
    sets.push(`${field} = ?`);
    values.push(convert(body[field]));
  }
  return { sets, values };
}

function parseDoc(value) {
  if (!value || typeof value !== "object" || !Array.isArray(value.blocks)) throw new HttpError(400, "Die Demo ist beschädigt.");
  return JSON.stringify(value);
}

// ---------- auth ----------
async function sessionUser(request, env) {
  const token = /(?:^|;\s*)lx_studio=([a-f0-9]{64})/.exec(request.headers.get("Cookie") ?? "")?.[1];
  if (!token) return null;
  return env.DB.prepare(
    `SELECT u.id, u.email, u.name FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ? AND s.expires_at > datetime('now')`,
  )
    .bind(await sha256(token))
    .first();
}

const sessionCookie = (token, maxAge) => `${COOKIE}=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict`;

async function login(request, env) {
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const recent = await env.DB.prepare("SELECT count(*) AS n FROM login_attempts WHERE ip = ? AND created_at > datetime('now', '-15 minutes')").bind(ip).first();
  if (recent.n >= 8) throw new HttpError(429, "Zu viele Versuche. Bitte in 15 Minuten erneut probieren.");

  const body = await readJson(request);
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
  const hash = user ? await hashPassword(password, user.pass_salt) : await hashPassword(password, "00".repeat(16));
  if (!user || !sameString(hash, user.pass_hash)) {
    await env.DB.prepare("INSERT INTO login_attempts (ip) VALUES (?)").bind(ip).run();
    throw new HttpError(401, "E-Mail oder Passwort stimmt nicht.");
  }

  const token = randomHex(32);
  await env.DB.batch([
    env.DB.prepare("INSERT INTO sessions (token_hash, user_id, user_agent, expires_at) VALUES (?, ?, ?, datetime('now', ?))").bind(
      await sha256(token),
      user.id,
      str(request.headers.get("User-Agent"), 300),
      `+${SESSION_DAYS} days`,
    ),
    env.DB.prepare("DELETE FROM sessions WHERE expires_at < datetime('now')"),
    env.DB.prepare("DELETE FROM login_attempts WHERE created_at < datetime('now', '-1 day')"),
  ]);
  return json({ user: { id: user.id, email: user.email, name: user.name } }, 200, { "Set-Cookie": sessionCookie(token, SESSION_DAYS * 86400) });
}

async function logout(request, env) {
  const token = /(?:^|;\s*)lx_studio=([a-f0-9]{64})/.exec(request.headers.get("Cookie") ?? "")?.[1];
  if (token) await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(await sha256(token)).run();
  return json({ ok: true }, 200, { "Set-Cookie": sessionCookie("", 0) });
}

async function changePassword(request, env, user) {
  const body = await readJson(request);
  const next = String(body.next ?? "");
  if (next.length < 10) throw new HttpError(400, "Das neue Passwort braucht mindestens 10 Zeichen.");
  const row = await env.DB.prepare("SELECT pass_hash, pass_salt FROM users WHERE id = ?").bind(user.id).first();
  if (!sameString(await hashPassword(String(body.current ?? ""), row.pass_salt), row.pass_hash)) throw new HttpError(403, "Das aktuelle Passwort stimmt nicht.");
  const salt = randomHex(16);
  await env.DB.prepare("UPDATE users SET pass_hash = ?, pass_salt = ? WHERE id = ?").bind(await hashPassword(next, salt), salt, user.id).run();
  return json({ ok: true });
}

// ---------- overview ----------
async function overview(env) {
  const [counts, pipeline, activities, tasks, inquiries, demos] = await env.DB.batch([
    env.DB.prepare(
      `SELECT (SELECT count(*) FROM clients) AS clients,
              (SELECT count(*) FROM clients WHERE status IN ('lead','contact','offer')) AS open_leads,
              (SELECT count(*) FROM clients WHERE status = 'won') AS customers,
              (SELECT count(*) FROM demos) AS demos,
              (SELECT count(*) FROM tasks WHERE done = 0) AS open_tasks,
              (SELECT count(*) FROM inquiries WHERE status = 'new') AS new_inquiries,
              (SELECT coalesce(sum(value), 0) FROM clients WHERE status IN ('lead','contact','offer')) AS pipeline_value`,
    ),
    env.DB.prepare("SELECT status, count(*) AS n, coalesce(sum(value), 0) AS value FROM clients GROUP BY status"),
    env.DB.prepare(
      `SELECT a.id, a.kind, a.text, a.created_at, a.client_id, c.name AS client_name
       FROM activities a LEFT JOIN clients c ON c.id = a.client_id ORDER BY a.created_at DESC, a.id DESC LIMIT 8`,
    ),
    env.DB.prepare(
      `SELECT t.id, t.title, t.due, t.client_id, c.name AS client_name FROM tasks t LEFT JOIN clients c ON c.id = t.client_id
       WHERE t.done = 0 ORDER BY t.due IS NULL, t.due, t.id LIMIT 6`,
    ),
    env.DB.prepare("SELECT id, name, email, message, created_at, status FROM inquiries ORDER BY created_at DESC, id DESC LIMIT 4"),
    env.DB.prepare(
      `SELECT d.id, d.slug, d.title, d.shared, d.updated_at, d.client_id, c.name AS client_name FROM demos d
       LEFT JOIN clients c ON c.id = d.client_id ORDER BY d.updated_at DESC LIMIT 4`,
    ),
  ]);
  return json({
    counts: counts.results[0],
    pipeline: pipeline.results,
    activities: activities.results,
    tasks: tasks.results,
    inquiries: inquiries.results,
    demos: demos.results,
  });
}

// ---------- clients ----------
const CLIENT_FIELDS = {
  name: (v) => str(v, 160) ?? "Ohne Namen",
  contact: (v) => str(v, 160),
  email: (v) => str(v, 200),
  phone: (v) => str(v, 60),
  website: (v) => str(v, 200),
  industry: (v) => str(v, 80),
  city: (v) => str(v, 80),
  status: (v) => (["lead", "contact", "offer", "won", "lost"].includes(v) ? v : "lead"),
  value: int,
  notes: (v) => String(v ?? "").slice(0, 20_000),
};

async function listClients(env) {
  const { results } = await env.DB.prepare(
    `SELECT c.*, (SELECT count(*) FROM demos d WHERE d.client_id = c.id) AS demo_count,
            (SELECT count(*) FROM tasks t WHERE t.client_id = c.id AND t.done = 0) AS open_tasks
     FROM clients c ORDER BY c.updated_at DESC, c.id DESC`,
  ).all();
  return json({ clients: results });
}

async function createClient(request, env) {
  const body = await readJson(request);
  const c = Object.fromEntries(Object.entries(CLIENT_FIELDS).map(([k, convert]) => [k, convert(body[k])]));
  const result = await env.DB.prepare(
    "INSERT INTO clients (name, contact, email, phone, website, industry, city, status, value, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
  )
    .bind(c.name, c.contact, c.email, c.phone, c.website, c.industry, c.city, c.status, c.value, c.notes)
    .run();
  const id = result.meta.last_row_id;
  await env.DB.prepare("INSERT INTO activities (client_id, kind, text) VALUES (?, 'system', 'Kunde angelegt')").bind(id).run();
  return json({ id }, 201);
}

async function getClient(env, id) {
  const [client, activities, tasks, demos, projects, boards] = await env.DB.batch([
    env.DB.prepare("SELECT * FROM clients WHERE id = ?").bind(id),
    env.DB.prepare("SELECT * FROM activities WHERE client_id = ? ORDER BY created_at DESC, id DESC").bind(id),
    env.DB.prepare("SELECT * FROM tasks WHERE client_id = ? ORDER BY done, due IS NULL, due, id").bind(id),
    env.DB.prepare("SELECT id, slug, title, shared, updated_at, template FROM demos WHERE client_id = ? ORDER BY updated_at DESC").bind(id),
    env.DB.prepare("SELECT * FROM projects WHERE client_id = ? ORDER BY id").bind(id),
    env.DB.prepare("SELECT b.id, b.title, b.updated_at, (SELECT count(*) FROM board_items i WHERE i.board_id = b.id) AS items FROM boards b WHERE b.client_id = ? ORDER BY b.updated_at DESC").bind(id),
  ]);
  if (!client.results[0]) throw new HttpError(404, "Diesen Kunden gibt es nicht.");
  return json({ client: client.results[0], activities: activities.results, tasks: tasks.results, demos: demos.results, projects: projects.results, boards: boards.results });
}

async function updateClient(request, env, id) {
  const body = await readJson(request);
  const { sets, values } = patch(body, CLIENT_FIELDS);
  if (!sets.length) return json({ ok: true });
  const statements = [env.DB.prepare(`UPDATE clients SET ${sets.join(", ")}, updated_at = datetime('now') WHERE id = ?`).bind(...values, id)];
  if ("status" in body) {
    const before = await env.DB.prepare("SELECT status FROM clients WHERE id = ?").bind(id).first();
    const after = CLIENT_FIELDS.status(body.status);
    if (before && before.status !== after) {
      statements.push(env.DB.prepare("INSERT INTO activities (client_id, kind, text) VALUES (?, 'system', ?)").bind(id, `Status: ${before.status} → ${after}`));
    }
  }
  await env.DB.batch(statements);
  return json({ ok: true });
}

// ---------- demos ----------
async function listDemos(env) {
  const { results } = await env.DB.prepare(
    `SELECT d.id, d.slug, d.title, d.template, d.shared, d.client_id, d.created_at, d.updated_at, c.name AS client_name,
            json_extract(d.doc, '$.theme') AS theme, json_extract(d.doc, '$.meta') AS meta
     FROM demos d LEFT JOIN clients c ON c.id = d.client_id ORDER BY d.updated_at DESC, d.id DESC`,
  ).all();
  return json({ demos: results.map((d) => ({ ...d, theme: JSON.parse(d.theme ?? "null"), meta: JSON.parse(d.meta ?? "null") })) });
}

async function createDemo(request, env) {
  const body = await readJson(request);
  const title = str(body.title, 160) ?? "Neue Demo";
  const doc = parseDoc(body.doc);
  const clientId = int(body.client_id);
  const slug = `${slugify(title)}-${randomHex(3)}`;
  const result = await env.DB.prepare("INSERT INTO demos (slug, client_id, title, template, doc) VALUES (?, ?, ?, ?, ?)")
    .bind(slug, clientId, title, str(body.template, 80), doc)
    .run();
  if (clientId) await env.DB.prepare("INSERT INTO activities (client_id, kind, text) VALUES (?, 'system', ?)").bind(clientId, `Demo erstellt: ${title}`).run();
  return json({ id: result.meta.last_row_id, slug }, 201);
}

async function getDemo(env, id) {
  const demo = await env.DB.prepare("SELECT d.*, c.name AS client_name FROM demos d LEFT JOIN clients c ON c.id = d.client_id WHERE d.id = ?").bind(id).first();
  if (!demo) throw new HttpError(404, "Diese Demo gibt es nicht.");
  const versions = await env.DB.prepare("SELECT id, label, created_at FROM demo_versions WHERE demo_id = ? ORDER BY id DESC").bind(id).all();
  return json({ demo: { ...demo, doc: JSON.parse(demo.doc) }, versions: versions.results });
}

async function updateDemo(request, env, id) {
  const body = await readJson(request);
  const { sets, values } = patch(body, {
    title: (v) => str(v, 160) ?? "Demo",
    doc: parseDoc,
    notes: (v) => String(v ?? "").slice(0, 40_000),
    shared: (v) => (v ? 1 : 0),
    client_id: int,
  });
  if (!sets.length) return json({ ok: true });
  const result = await env.DB.prepare(`UPDATE demos SET ${sets.join(", ")}, updated_at = datetime('now') WHERE id = ?`).bind(...values, id).run();
  if (!result.meta.changes) throw new HttpError(404, "Diese Demo gibt es nicht.");
  return json({ ok: true, saved_at: now() });
}

async function duplicateDemo(env, id) {
  const demo = await env.DB.prepare("SELECT * FROM demos WHERE id = ?").bind(id).first();
  if (!demo) throw new HttpError(404, "Diese Demo gibt es nicht.");
  const title = `${demo.title} (Kopie)`;
  const slug = `${slugify(demo.title)}-${randomHex(3)}`;
  const result = await env.DB.prepare("INSERT INTO demos (slug, client_id, title, template, doc, notes) VALUES (?, ?, ?, ?, ?, ?)")
    .bind(slug, demo.client_id, title, demo.template, demo.doc, demo.notes)
    .run();
  return json({ id: result.meta.last_row_id, slug }, 201);
}

async function createVersion(request, env, id) {
  const body = await readJson(request);
  const demo = await env.DB.prepare("SELECT doc FROM demos WHERE id = ?").bind(id).first();
  if (!demo) throw new HttpError(404, "Diese Demo gibt es nicht.");
  const result = await env.DB.prepare("INSERT INTO demo_versions (demo_id, label, doc) VALUES (?, ?, ?)")
    .bind(id, str(body.label, 80) ?? "Stand", demo.doc)
    .run();
  return json({ id: result.meta.last_row_id }, 201);
}

async function getVersion(env, id) {
  const version = await env.DB.prepare("SELECT * FROM demo_versions WHERE id = ?").bind(id).first();
  if (!version) throw new HttpError(404, "Diesen Stand gibt es nicht.");
  return json({ version: { ...version, doc: JSON.parse(version.doc) } });
}

// ---------- uploads ----------
async function upload(request, env) {
  const type = (request.headers.get("Content-Type") ?? "").split(";")[0].trim();
  const extension = IMAGE_TYPES[type];
  if (!extension) throw new HttpError(415, "Nur Bilder (PNG, JPG, WebP, GIF, SVG, AVIF).");
  const data = await request.arrayBuffer();
  if (data.byteLength > MAX_UPLOAD) throw new HttpError(413, "Das Bild ist größer als 8 MB.");
  if (!data.byteLength) throw new HttpError(400, "Die Datei ist leer.");
  const key = `${randomHex(12)}.${extension}`;
  await env.MEDIA.put(key, data, { httpMetadata: { contentType: type } });
  await env.DB.prepare("INSERT INTO media (key, name, type, size) VALUES (?, ?, ?, ?)")
    .bind(key, str(decodeURIComponent(request.headers.get("X-File-Name") ?? ""), 160), type, data.byteLength)
    .run();
  return json({ url: `/media/${key}` }, 201);
}

// ---------- design boards ----------
const BOARD_FIELDS = { title: (v) => str(v, 160) ?? "Entwürfe", client_id: int, notes: (v) => String(v ?? "").slice(0, 20000), link: (v) => str(v, 300) };

function parsePins(value) {
  if (!Array.isArray(value)) return "[]";
  const clamp = (n) => Math.min(100, Math.max(0, Math.round(Number(n) * 10) / 10 || 0));
  return JSON.stringify(
    value.slice(0, 80).map((pin) => ({ id: str(pin?.id, 24) ?? randomHex(4), x: clamp(pin?.x), y: clamp(pin?.y), text: String(pin?.text ?? "").slice(0, 1500), done: !!pin?.done })),
  );
}

const ITEM_FIELDS = {
  title: (v) => str(v, 160) ?? "Entwurf",
  group_name: (v) => str(v, 80),
  image: (v) => {
    const url = str(v, 400);
    if (!url || !/^(\/media\/|\/|https:\/\/)/.test(url)) throw new HttpError(400, "Bild fehlt.");
    return url;
  },
  width: int,
  height: int,
  status: (v) => (["favorite", "maybe", "out"].includes(v) ? v : ""),
  notes: (v) => String(v ?? "").slice(0, 20000),
  pins: parsePins,
  position: (v) => int(v) ?? 0,
};

const boardItem = (row) => ({ ...row, pins: JSON.parse(row.pins || "[]") });

async function listBoards(env) {
  const { results } = await env.DB.prepare(
    `SELECT b.id, b.title, b.client_id, b.updated_at, c.name AS client_name,
            (SELECT count(*) FROM board_items i WHERE i.board_id = b.id) AS items,
            (SELECT count(*) FROM board_items i WHERE i.board_id = b.id AND i.status = 'favorite') AS favorites,
            (SELECT image FROM board_items i WHERE i.board_id = b.id ORDER BY (i.status = 'favorite') DESC, i.position, i.id LIMIT 1) AS cover
     FROM boards b LEFT JOIN clients c ON c.id = b.client_id ORDER BY b.updated_at DESC`,
  ).all();
  return json({ boards: results });
}

async function getBoard(env, id) {
  const [board, items] = await env.DB.batch([
    env.DB.prepare("SELECT b.*, c.name AS client_name FROM boards b LEFT JOIN clients c ON c.id = b.client_id WHERE b.id = ?").bind(id),
    env.DB.prepare("SELECT * FROM board_items WHERE board_id = ? ORDER BY position, id").bind(id),
  ]);
  if (!board.results[0]) throw new HttpError(404, "Diese Entwürfe gibt es nicht.");
  return json({ board: board.results[0], items: items.results.map(boardItem) });
}

async function createBoard(request, env) {
  const body = await readJson(request);
  const clientId = int(body.client_id);
  const title = BOARD_FIELDS.title(body.title);
  const result = await env.DB.prepare("INSERT INTO boards (title, client_id, link) VALUES (?, ?, ?)").bind(title, clientId, BOARD_FIELDS.link(body.link)).run();
  if (clientId) await env.DB.prepare("INSERT INTO activities (client_id, kind, text) VALUES (?, 'system', ?)").bind(clientId, `Entwürfe angelegt: ${title}`).run();
  return json({ id: result.meta.last_row_id }, 201);
}

async function updateBoard(request, env, id) {
  const { sets, values } = patch(await readJson(request), BOARD_FIELDS);
  if (sets.length) await env.DB.prepare(`UPDATE boards SET ${sets.join(", ")}, updated_at = datetime('now') WHERE id = ?`).bind(...values, id).run();
  return json({ ok: true });
}

async function createBoardItem(request, env, boardId) {
  const body = await readJson(request);
  const board = await env.DB.prepare("SELECT id FROM boards WHERE id = ?").bind(boardId).first();
  if (!board) throw new HttpError(404, "Diese Entwürfe gibt es nicht.");
  const last = await env.DB.prepare("SELECT coalesce(max(position), 0) AS p FROM board_items WHERE board_id = ?").bind(boardId).first();
  const result = await env.DB.prepare("INSERT INTO board_items (board_id, position, title, group_name, image, width, height) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .bind(boardId, last.p + 1, ITEM_FIELDS.title(body.title), ITEM_FIELDS.group_name(body.group_name), ITEM_FIELDS.image(body.image), int(body.width), int(body.height))
    .run();
  await env.DB.prepare("UPDATE boards SET updated_at = datetime('now') WHERE id = ?").bind(boardId).run();
  return json({ id: result.meta.last_row_id }, 201);
}

async function updateBoardItem(request, env, id) {
  const { sets, values } = patch(await readJson(request), ITEM_FIELDS);
  if (!sets.length) return json({ ok: true });
  await env.DB.batch([
    env.DB.prepare(`UPDATE board_items SET ${sets.join(", ")}, updated_at = datetime('now') WHERE id = ?`).bind(...values, id),
    env.DB.prepare("UPDATE boards SET updated_at = datetime('now') WHERE id = (SELECT board_id FROM board_items WHERE id = ?)").bind(id),
  ]);
  return json({ ok: true });
}

// ---------- public ----------
async function publicDemo(env, slug) {
  const demo = await env.DB.prepare("SELECT title, doc FROM demos WHERE slug = ? AND shared = 1").bind(slug).first();
  if (!demo) throw new HttpError(404, "Diese Demo ist nicht freigegeben.");
  return json({ title: demo.title, doc: JSON.parse(demo.doc) });
}

async function publicInquiry(request, env) {
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const recent = await env.DB.prepare("SELECT count(*) AS n FROM inquiries WHERE ip = ? AND created_at > datetime('now', '-1 hour')").bind(ip).first();
  if (recent.n >= 5) throw new HttpError(429, "Too many messages.");
  const body = await readJson(request);
  if (body.botcheck) return json({ ok: true }); // honeypot
  const message = str(body.message, 6000);
  if (!message) throw new HttpError(400, "Message missing.");
  await env.DB.prepare("INSERT INTO inquiries (name, email, message, lang, page, ip) VALUES (?, ?, ?, ?, ?, ?)")
    .bind(str(body.name, 160), str(body.email, 200), message, str(body.lang, 8), str(body.page, 200), ip)
    .run();
  return json({ ok: true }, 201);
}

// ---------- generic tables ----------
const TABLES = {
  tasks: {
    fields: { title: (v) => str(v, 300) ?? "Aufgabe", due: (v) => str(v, 10), client_id: int, done: (v) => (v ? 1 : 0) },
    list: `SELECT t.*, c.name AS client_name FROM tasks t LEFT JOIN clients c ON c.id = t.client_id ORDER BY t.done, t.due IS NULL, t.due, t.id DESC`,
  },
  projects: {
    fields: {
      name: (v) => str(v, 160) ?? "Projekt",
      url: (v) => str(v, 300),
      repo: (v) => str(v, 300),
      hosting: (v) => str(v, 160),
      status: (v) => (["idea", "building", "live", "paused"].includes(v) ? v : "live"),
      notes: (v) => String(v ?? "").slice(0, 20_000),
      client_id: int,
    },
    list: `SELECT p.*, c.name AS client_name FROM projects p LEFT JOIN clients c ON c.id = p.client_id ORDER BY p.id`,
    touch: true,
  },
  templates: {
    fields: { name: (v) => str(v, 160) ?? "Vorlage", industry: (v) => str(v, 80), doc: parseDoc },
    list: `SELECT id, name, industry, doc, created_at, updated_at FROM templates ORDER BY updated_at DESC`,
    touch: true,
    parse: (row) => ({ ...row, doc: JSON.parse(row.doc) }),
  },
  inquiries: {
    fields: { status: (v) => (["new", "read", "done"].includes(v) ? v : "read") },
    list: `SELECT id, name, email, message, lang, page, status, created_at FROM inquiries ORDER BY created_at DESC, id DESC`,
    noCreate: true,
  },
  activities: {
    fields: { client_id: int, kind: (v) => (["note", "call", "meeting", "email"].includes(v) ? v : "note"), text: (v) => str(v, 6000) ?? "–" },
    list: `SELECT * FROM activities ORDER BY created_at DESC LIMIT 200`,
  },
};

async function tableRoute(method, table, id, request, env) {
  const config = TABLES[table];
  if (method === "GET" && !id) {
    const { results } = await env.DB.prepare(config.list).all();
    return json({ [table]: config.parse ? results.map(config.parse) : results });
  }
  if (method === "POST" && !id && !config.noCreate) {
    const body = await readJson(request);
    const columns = Object.keys(config.fields).filter((f) => f in body || f === "title" || f === "name" || f === "text");
    const values = columns.map((f) => config.fields[f](body[f]));
    const result = await env.DB.prepare(`INSERT INTO ${table} (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`)
      .bind(...values)
      .run();
    if (table === "activities" && body.client_id) await env.DB.prepare("UPDATE clients SET updated_at = datetime('now') WHERE id = ?").bind(int(body.client_id)).run();
    return json({ id: result.meta.last_row_id }, 201);
  }
  if (method === "PATCH" && id) {
    const body = await readJson(request);
    const { sets, values } = patch(body, config.fields);
    if (table === "tasks" && "done" in body) sets.push(body.done ? "done_at = datetime('now')" : "done_at = NULL");
    if (config.touch) sets.push("updated_at = datetime('now')");
    if (sets.length) await env.DB.prepare(`UPDATE ${table} SET ${sets.join(", ")} WHERE id = ?`).bind(...values, id).run();
    return json({ ok: true });
  }
  if (method === "DELETE" && id) {
    await env.DB.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(id).run();
    return json({ ok: true });
  }
  throw new HttpError(405, "Nicht erlaubt.");
}

async function exportAll(env) {
  const names = ["clients", "activities", "tasks", "demos", "demo_versions", "templates", "projects", "inquiries", "media", "boards", "board_items"];
  const results = await env.DB.batch(names.map((n) => env.DB.prepare(`SELECT * FROM ${n}`)));
  return json(Object.fromEntries(names.map((n, i) => [n, results[i].results])), 200, {
    "Content-Disposition": `attachment; filename="lx-studio-${new Date().toISOString().slice(0, 10)}.json"`,
  });
}

// ---------- router ----------
async function route(request, env) {
  const url = new URL(request.url);
  const method = request.method;
  const parts = url.pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean);
  const [a, b, c] = parts;

  // writes must come from our own pages: a custom header cannot be sent cross-site without a preflight
  if (method !== "GET" && method !== "HEAD") {
    const origin = request.headers.get("Origin");
    if (origin && new URL(origin).host !== url.host) throw new HttpError(403, "Fremde Herkunft.");
    if (request.headers.get("X-Studio") !== "1") throw new HttpError(403, "Kopfzeile fehlt.");
  }

  if (a === "public") {
    if (method === "GET" && b === "demos" && c) return publicDemo(env, c);
    if (method === "POST" && b === "inquiries") return publicInquiry(request, env);
    throw new HttpError(404, "Not found.");
  }
  if (a === "auth" && b === "login" && method === "POST") return login(request, env);

  const user = await sessionUser(request, env);
  if (!user) throw new HttpError(401, "Bitte anmelden.");

  if (a === "auth") {
    if (b === "me" && method === "GET") return json({ user });
    if (b === "logout" && method === "POST") return logout(request, env);
    if (b === "password" && method === "POST") return changePassword(request, env, user);
  }
  if (a === "overview" && method === "GET") return overview(env);
  if (a === "export" && method === "GET") return exportAll(env);
  if (a === "media" && method === "POST") return upload(request, env);

  if (a === "clients") {
    const id = int(b);
    if (!b && method === "GET") return listClients(env);
    if (!b && method === "POST") return createClient(request, env);
    if (id && method === "GET") return getClient(env, id);
    if (id && method === "PATCH") return updateClient(request, env, id);
    if (id && method === "DELETE") {
      await env.DB.prepare("DELETE FROM clients WHERE id = ?").bind(id).run();
      return json({ ok: true });
    }
  }

  if (a === "demos") {
    const id = int(b);
    if (!b && method === "GET") return listDemos(env);
    if (!b && method === "POST") return createDemo(request, env);
    if (id && !c && method === "GET") return getDemo(env, id);
    if (id && !c && method === "PATCH") return updateDemo(request, env, id);
    if (id && !c && method === "DELETE") {
      await env.DB.prepare("DELETE FROM demos WHERE id = ?").bind(id).run();
      return json({ ok: true });
    }
    if (id && c === "duplicate" && method === "POST") return duplicateDemo(env, id);
    if (id && c === "versions" && method === "POST") return createVersion(request, env, id);
  }
  if (a === "versions") {
    const id = int(b);
    if (id && method === "GET") return getVersion(env, id);
    if (id && method === "DELETE") {
      await env.DB.prepare("DELETE FROM demo_versions WHERE id = ?").bind(id).run();
      return json({ ok: true });
    }
  }

  if (a === "boards") {
    const id = int(b);
    if (!b && method === "GET") return listBoards(env);
    if (!b && method === "POST") return createBoard(request, env);
    if (id && !c && method === "GET") return getBoard(env, id);
    if (id && !c && method === "PATCH") return updateBoard(request, env, id);
    if (id && !c && method === "DELETE") {
      await env.DB.prepare("DELETE FROM boards WHERE id = ?").bind(id).run();
      return json({ ok: true });
    }
    if (id && c === "items" && method === "POST") return createBoardItem(request, env, id);
  }
  if (a === "board-items") {
    const id = int(b);
    if (id && method === "PATCH") return updateBoardItem(request, env, id);
    if (id && method === "DELETE") {
      await env.DB.prepare("DELETE FROM board_items WHERE id = ?").bind(id).run();
      return json({ ok: true });
    }
  }

  if (a in TABLES) return tableRoute(method, a, int(b), request, env);
  throw new HttpError(404, "Diese Adresse gibt es nicht.");
}

export async function onRequest({ request, env }) {
  try {
    if (!env.DB) throw new HttpError(503, "Die Datenbank ist nicht verbunden.");
    return await route(request, env);
  } catch (error) {
    if (error instanceof HttpError) return json({ error: error.message }, error.status);
    console.error(error);
    return json({ error: "Da ist etwas schiefgelaufen." }, 500);
  }
}
