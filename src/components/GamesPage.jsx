import { useRef, useState } from "react";
import { Plus, X, ChevronRight, Pencil } from "lucide-react";
import Btn from "./Btn.jsx";
import Field, { inputClass } from "./Field.jsx";
import GenreFilterBar from "./GenreFilterBar.jsx";
import { safeImageSrc } from "../lib/sanitize.js";
import { matchesGenre } from "../lib/genres.js";

function emptyDraft() {
  return { title: "", imageUrl: "", desc: "", genres: [], genreInput: "" };
}

export default function GamesPage({ games, setGames, gotoVideosForTag, authed }) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(emptyDraft());
  const [error, setError] = useState("");
  const [genreFilter, setGenreFilter] = useState("Any");
  const fileRef = useRef(null);
  const filteredGames = games.filter((g) => matchesGenre(g.genres, genreFilter));

  function openAddForm() {
    setEditingId(null);
    setDraft(emptyDraft());
    setError("");
    setFormOpen(true);
  }

  function openEditForm(g) {
    setEditingId(g.id);
    setDraft({ title: g.title, imageUrl: g.image || "", desc: g.desc || "", genres: g.genres || [], genreInput: "" });
    setError("");
    setFormOpen(true);
    if (fileRef.current) fileRef.current.value = "";
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setDraft(emptyDraft());
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  function addGenre() {
    const g = draft.genreInput.trim();
    if (!g) return;
    if (draft.genres.some((x) => x.toLowerCase() === g.toLowerCase())) { setDraft((d) => ({ ...d, genreInput: "" })); return; }
    setDraft((d) => ({ ...d, genres: [...d.genres, g], genreInput: "" }));
  }
  function removeGenre(g) {
    setDraft((d) => ({ ...d, genres: d.genres.filter((x) => x !== g) }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!draft.title.trim()) { setError("Give the game a title."); return; }
    const file = fileRef.current?.files?.[0];

    const commit = (image) => {
      if (editingId) {
        setGames((all) => all.map((g) => (
          g.id === editingId
            ? { ...g, title: draft.title.trim(), image: image ?? g.image, tag: draft.title.trim(), desc: draft.desc.trim(), genres: draft.genres }
            : g
        )));
      } else {
        setGames((g) => [
          { id: Date.now().toString(36), title: draft.title.trim(), image: image || "", tag: draft.title.trim(), desc: draft.desc.trim(), genres: draft.genres },
          ...g,
        ]);
      }
      closeForm();
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = () => commit(reader.result);
      reader.readAsDataURL(file);
    } else {
      commit(draft.imageUrl.trim() || undefined);
    }
  }

  return (
    <>
      <header className="px-5 sm:px-8 md:px-10 pt-8 sm:pt-10 md:pt-14 pb-5 md:pb-6 border-b border-line">
        <div className="flex justify-between items-end gap-4 flex-wrap">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-cyan">// Library</span>
            <h1 className="font-display text-lg mt-2 mb-2">Games</h1>
            <p className="font-mono text-sm text-txd">Everything I'm currently playing. Click a cartridge to jump to its videos.</p>
          </div>
          {authed && <Btn variant="primary" onClick={openAddForm}><Plus size={16} /> Add game</Btn>}
        </div>
      </header>

      <section className="px-5 sm:px-8 md:px-10 py-6 md:py-8">
        {authed && formOpen && (
          <form onSubmit={handleSubmit} className="rounded-lg p-6 mb-9 bg-panel border border-line">
            <div className="font-mono font-semibold text-sm mb-4 text-cyan">{editingId ? "Edit cartridge" : "New cartridge"}</div>
            <Field label="Game title">
              <input className={inputClass} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="e.g. Elden Ring" />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Cover image URL">
                <input className={inputClass} value={draft.imageUrl} onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })} placeholder="https://…" />
              </Field>
              <Field label="…or upload an image">
                <input ref={fileRef} type="file" accept="image/*" className={inputClass} />
              </Field>
            </div>
            <p className="font-mono text-[11px] mb-4 text-txf">
              {editingId ? "Leave both blank to keep the current image." : "If you upload a file it's used instead of the URL."}
            </p>
            <Field label="Description">
              <textarea className={`${inputClass} min-h-[70px] resize-y`} value={draft.desc} onChange={(e) => setDraft({ ...draft, desc: e.target.value })} placeholder="What this game is, what you're doing in it right now…" />
            </Field>

            <Field label="Tags / genres" hint="e.g. Soulslike, FPS, Co-op — press Enter or Add after each one.">
              <div className="flex gap-2">
                <input
                  className={inputClass}
                  value={draft.genreInput}
                  onChange={(e) => setDraft({ ...draft, genreInput: e.target.value })}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addGenre(); } }}
                  placeholder="Soulslike"
                />
                <Btn type="button" variant="ghost" className="!px-3 !py-2 !text-[11px]" onClick={addGenre}>Add</Btn>
              </div>
              {draft.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {draft.genres.map((g) => (
                    <span key={g} className="inline-flex items-center gap-1.5 font-mono text-[10px] px-2 py-1 rounded-full border border-mag-dim text-mag">
                      {g}
                      <button type="button" onClick={() => removeGenre(g)} aria-label={`Remove ${g}`}><X size={10} /></button>
                    </span>
                  ))}
                </div>
              )}
            </Field>

            {error && <p className="font-mono text-xs mb-3 text-mag">{error}</p>}
            <div className="flex gap-3">
              <Btn variant="primary" type="submit">{editingId ? "Save changes" : "Save game"}</Btn>
              <Btn variant="ghost" type="button" onClick={closeForm}>Cancel</Btn>
            </div>
          </form>
        )}

        {games.length > 0 && <GenreFilterBar value={genreFilter} onChange={setGenreFilter} />}

        {games.length === 0 ? (
          <div className="text-center py-16 rounded border border-dashed border-lineb text-txd font-mono text-sm">
            No games yet. Hit "+ Add game" to load your first cartridge.
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="text-center py-16 rounded border border-dashed border-lineb text-txd font-mono text-sm">
            No games tagged "{genreFilter}" yet.
          </div>
        ) : (
          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
            {filteredGames.map((g) => {
              const img = safeImageSrc(g.image);
              return (
                <div key={g.id} className="group relative rounded overflow-hidden flex flex-col bg-panel border border-line transition hover:border-cyan hover:-translate-y-1 hover:shadow-glow-cyan">
                  <div className="absolute top-0 right-4 w-7 h-2.5 rounded-b bg-void border border-line border-t-0" />
                  <button onClick={() => gotoVideosForTag(g.tag)} className="aspect-video flex items-center justify-center overflow-hidden bg-raised border-b border-line">
                    {img ? (
                      <img src={img} alt={g.title} className="w-full h-full object-cover" onContextMenu={(e) => e.preventDefault()} />
                    ) : (
                      <span className="font-mono text-xs text-txf">NO COVER ART</span>
                    )}
                  </button>
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <button onClick={() => gotoVideosForTag(g.tag)} className="font-mono font-semibold text-left hover:underline">
                        {g.title}
                      </button>
                      {authed && (
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => openEditForm(g)} className="w-7 h-7 rounded border border-lineb text-txf hover:text-cyan hover:border-cyan flex items-center justify-center" aria-label="Edit game">
                            <Pencil size={12} />
                          </button>
                          <button onClick={() => setGames((all) => all.filter((x) => x.id !== g.id))} className="w-7 h-7 rounded border border-lineb text-txf hover:text-mag hover:border-mag flex items-center justify-center" aria-label="Remove game">
                            <X size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm flex-1 text-txd">{g.desc || "No description yet."}</p>
                    {g.genres && g.genres.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {g.genres.map((genre) => (
                          <span key={genre} className="font-mono text-[9px] px-2 py-0.5 rounded-full border border-mag-dim text-mag">{genre}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-mono text-[10px] px-2 py-1 rounded-full border border-cyan-dim text-cyan">CARTRIDGE</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
