/*
  Client-side auth for a static/SPA site — read this before trusting it
  with anything sensitive.

  The password itself is never stored here — only a SHA-256 hash of
  "email:password". But because this all runs in the visitor's browser,
  someone determined could still read this file, see the hash, and try
  to crack it offline, or just delete the check and rebuild. That's true
  of any client-side-only login, not just this one.

  This is a reasonable "keep it off Google, keep casual visitors out"
  gate for a personal site. It is NOT real security. For that you'd need
  an actual backend or an auth provider (Netlify Identity, Firebase Auth,
  Cloudflare Access, etc.) sitting in front of this app.
*/

// SHA-256("redeemer0211@gmail.com:Vinzman0211!!!!!") — email lowercased+trimmed, joined with ":"
export const CRED_HASH =
  "0282cf019722fe85fec3e3a8df56c2e5f8e230e0bceb55975de60358fb2b3a20";

export async function sha256Hex(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function checkCredentials(email, password) {
  const combo = String(email).trim().toLowerCase() + ":" + String(password);
  const hash = await sha256Hex(combo);
  return hash === CRED_HASH;
}

const SESSION_KEY = "vr_session";
const SESSION_MAX_AGE_MS = 12 * 60 * 60 * 1000; // 12 hours

export function setSession() {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ok: true, ts: Date.now() }));
}

export function isAuthed() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!data?.ok) return false;
    if (Date.now() - data.ts > SESSION_MAX_AGE_MS) {
      sessionStorage.removeItem(SESSION_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}
