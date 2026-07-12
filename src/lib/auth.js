/*
  Client-side auth for a static/SPA site — read this before trusting it
  with anything sensitive.

  The password itself is never stored here — only a salted, peppered
  SHA-256 hash of it. But because this all runs in the visitor's browser,
  someone determined could still read this file, see the hash (and the
  salt, and the pepper), and try to crack it offline, or just delete the
  check and rebuild. That's true of any client-side-only login, not just
  this one.

  What salt and pepper actually buy you here, honestly:
  - SALT defeats generic precomputed rainbow tables (the kind built for
    plain "email:password" combos). An attacker targeting this specific
    site still has to brute-force against this specific salted hash —
    they can't just look it up. That's a real, standard improvement.
  - PEPPER is usually a *secret* value kept somewhere the attacker can't
    reach (a server, an environment variable) — that's what makes it a
    pepper rather than a second salt. There's no such hiding place in a
    static site: this file ships to every visitor's browser, so PEPPER
    is exactly as visible as everything else here. It still changes the
    hash and makes this site's hash different from a plain salted hash
    computed elsewhere, but it is NOT a secret, and claiming otherwise
    would be misleading. Treat it as a second, fixed salt.

  This is a reasonable "keep it off Google, keep casual visitors out"
  gate for a personal site. It is NOT real security. For that you'd need
  an actual backend or an auth provider (Netlify Identity, Firebase Auth,
  Cloudflare Access, etc.) sitting in front of this app — only a server
  can hold a value the client never sees.
*/

// Change these if you regenerate your credential hash (see README).
export const SALT = "f3a9c1e7b2d84f6a9c0e1b7d3a5f8c2e";
export const PEPPER = "VIN_REDEEMER_PEPPER_2026";

// SHA-256(SALT + ":" + "redeemer0211@gmail.com" + ":" + "Vinzman0211!!!!!" + ":" + PEPPER)
export const CRED_HASH =
  "1b48c735520627a5f812f93fe6141b359d7a2e0eab26e700b7c31409ef28e9ca";

export async function sha256Hex(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function checkCredentials(email, password) {
  const combo = SALT + ":" + String(email).trim().toLowerCase() + ":" + String(password) + ":" + PEPPER;
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
