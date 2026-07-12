export const GENRE_FILTERS = ["Any", "Soulslike", "FPS", "RPG"];

export function matchesGenre(genres, filter) {
  if (filter === "Any") return true;
  if (!genres || genres.length === 0) return false;
  return genres.some((g) => g.toLowerCase() === filter.toLowerCase());
}
