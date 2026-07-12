/*
  Anything that ends up as an <a href> or <img src> needs to be checked
  before rendering — otherwise a value like "javascript:alert(document.cookie)"
  stored as a "video URL" or "image URL" could execute when clicked/loaded.
  React already escapes text content automatically, but it does NOT
  validate that a string used as a URL is actually a safe URL — that's
  on us to check.
*/

// Only allow http/https links. Returns null if the URL is missing, malformed,
// or uses a disallowed scheme (javascript:, data:, vbscript:, etc.)
export function safeHref(url) {
  if (!url) return null;
  try {
    const u = new URL(url, window.location.origin);
    if (u.protocol === "http:" || u.protocol === "https:") return u.href;
  } catch {
    /* falls through to null */
  }
  return null;
}

// Images can legitimately be http(s) links OR base64 data: URIs (from the
// file upload field), so this allows both — but nothing else.
export function safeImageSrc(url) {
  if (!url) return null;
  try {
    const u = new URL(url, window.location.origin);
    if (u.protocol === "http:" || u.protocol === "https:") return u.href;
  } catch {
    /* not a full URL — check for a data: image URI instead */
  }
  if (/^data:image\/(png|jpe?g|gif|webp|svg\+xml);base64,/i.test(url)) {
    return url;
  }
  return null;
}
