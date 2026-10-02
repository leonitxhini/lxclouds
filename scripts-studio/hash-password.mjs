// Prints the SQL that creates (or resets) the Studio login.
// usage: node scripts-studio/hash-password.mjs <email> <name> <password>
import { pbkdf2Sync, randomBytes } from "node:crypto";

const [email, name, password] = process.argv.slice(2);
if (!email || !name || !password) {
  console.error("usage: node scripts-studio/hash-password.mjs <email> <name> <password>");
  process.exit(1);
}
const salt = randomBytes(16);
const hash = pbkdf2Sync(password, salt, 100_000, 32, "sha256").toString("hex");
const q = (s) => `'${s.replace(/'/g, "''")}'`;
console.log(
  `INSERT INTO users (email, name, pass_hash, pass_salt) VALUES (${q(email.toLowerCase())}, ${q(name)}, '${hash}', '${salt.toString("hex")}') ` +
    `ON CONFLICT(email) DO UPDATE SET pass_hash = excluded.pass_hash, pass_salt = excluded.pass_salt, name = excluded.name;`,
);
