import { GENRE_FILTERS } from "../lib/genres.js";

export default function GenreFilterBar({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {GENRE_FILTERS.map((g) => (
        <button
          key={g}
          onClick={() => onChange(g)}
          className={`font-mono text-xs uppercase tracking-wide px-3 py-1.5 rounded-full border transition ${
            value === g
              ? "border-cyan text-gray-100 bg-raised shadow-glow-cyan"
              : "border-lineb text-txd hover:text-gray-100 hover:border-cyan"
          }`}
        >
          {g}
        </button>
      ))}
    </div>
  );
}
