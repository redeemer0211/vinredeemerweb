// Handles three cases: a fresh install (already correct shape), data saved
// under the old Hobbies/Games/Free-time schema, and anything partially
// missing a field. Always returns a fully-shaped object so components can
// safely read .tags/.description/.media without extra guards.
export function normalizeAboutMe(raw) {
  if (!raw || typeof raw !== "object") {
    return { tags: [], description: "", media: [] };
  }
  const tags = Array.isArray(raw.tags)
    ? raw.tags
    : [...(Array.isArray(raw.hobbies) ? raw.hobbies : []), ...(Array.isArray(raw.games) ? raw.games : [])];

  const description =
    typeof raw.description === "string" && raw.description
      ? raw.description
      : typeof raw.freeTime === "string"
      ? raw.freeTime
      : "";

  const media = Array.isArray(raw.media) ? raw.media : [];

  return { tags, description, media };
}
