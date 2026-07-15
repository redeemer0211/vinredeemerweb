import { useEffect, useState } from "react";
import { Plus, X, Youtube, Pencil } from "lucide-react";
import Btn from "./Btn.jsx";
import Field, { inputClass } from "./Field.jsx";
import Pagination from "./Pagination.jsx";
import GenreFilterBar from "./GenreFilterBar.jsx";
import { parseYouTubeId } from "../lib/youtube.js";
import { safeHref } from "../lib/sanitize.js";
import { matchesGenre } from "../lib/genres.js";
import { useResponsiveValue } from "../lib/useViewport.js";

const DEFAULT_CHANNEL_URL = "https://www.youtube.com/@vin_redeemer"; // ← edit to your channel

function emptyDraft() {
  return { title: "", url: "", tag: "", desc: "", genres: [], genreInput: "" };
}

export default function VideosPage({
  videos, setVideos, activeTag, clearTag, authed,
  title = "Videos",
  emptyText = 'No videos yet. Hit "+ Add video" to post your first one.',
  channelUrl = DEFAULT_CHANNEL_URL,
  showChannelLink = true,
  games = [],
  showGenreFilter = true,
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(emptyDraft());
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [genreFilter, setGenreFilter] = useState("Any");
  const PAGE_SIZE = useResponsiveValue({ mobile: 4, tablet: 6, desktop: 10 });

  // A video's genres are its own tags, plus whatever genres are tagged on
  // the game it's linked to (matched by title) — so you can tag a video
  // directly, or just tag the game once and let its videos inherit it.
  const genresByGameName = new Map(
    games.map((g) => [(g.tag || g.title || "").toLowerCase(), g.genres || []])
  );
  function effectiveGenres(v) {
    const inherited = genresByGameName.get((v.tag || "").toLowerCase()) || [];
    return [...new Set([...(v.genres || []), ...inherited])];
  }

  const tagFiltered = activeTag
    ? videos.filter((v) => (v.tag || "").toLowerCase() === activeTag.toLowerCase())
    : videos;

  const visible = showGenreFilter
    ? tagFiltered.filter((v) => matchesGenre(effectiveGenres(v), genreFilter))
    : tagFiltered;

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const pageItems = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); setGenreFilter("Any"); }, [activeTag]);
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);

  function openAddForm() {
    setEditingId(null);
    setDraft(emptyDraft());
    setError("");
    setFormOpen(true);
  }

  function openEditForm(v) {
    setEditingId(v.id);
    setDraft({ title: v.title, url: v.url, tag: v.tag || "", desc: v.desc || "", genres: v.genres || [], genreInput: "" });
    setError("");
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setDraft(emptyDraft());
    setError("");
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
    if (!draft.title.trim() || !draft.url.trim()) {
      setError("A title and a YouTube link are both required.");
      return;
    }
    if (!parseYouTubeId(draft.url.trim())) {
      setError("That doesn't look like an embeddable YouTube link.");
      return;
    }
    if (editingId) {
      setVideos((all) => all.map((v) => (
        v.id === editingId
          ? { ...v, title: draft.title.trim(), url: draft.url.trim(), tag: draft.tag.trim(), desc: draft.desc.trim(), genres: draft.genres }
          : v
      )));
    } else {
      setVideos((v) => [
        { id: Date.now().toString(36), title: draft.title.trim(), url: draft.url.trim(), tag: draft.tag.trim(), desc: draft.desc.trim(), genres: draft.genres },
        ...v,
      ]);
    }
    closeForm();
    setPage(1);
  }

  return (
    <>
      <header className="px-5 sm:px-8 md:px-10 pt-8 sm:pt-10 md:pt-14 pb-5 md:pb-6 border-b border-line">
        <div className="flex justify-between items-end gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-lg mb-2">{title}</h1>
            <p className="font-mono text-sm text-txd">
              {activeTag ? `Showing videos tagged "${activeTag}".` : "Gameplay, clips, and full uploads from my channel."}
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {showChannelLink && (
              <a href={channelUrl} target="_blank" rel="noopener noreferrer">
                <Btn variant="ghost" className="!px-3 !py-2 !text-[11px]">
                  <Youtube size={14} /> Visit my channel
                </Btn>
              </a>
            )}
            {authed && (
              <Btn variant="primary" onClick={openAddForm}>
                <Plus size={16} /> Add video
              </Btn>
            )}
          </div>
        </div>
        {activeTag && (
          <button onClick={clearTag} className="font-mono text-xs mt-3 underline text-txd">
            ✕ Clear filter
          </button>
        )}
      </header>

      <section className="px-5 sm:px-8 md:px-10 py-6 md:py-8">
        {authed && formOpen && (
          <form onSubmit={handleSubmit} className="rounded-lg p-6 mb-9 bg-panel border border-line">
            <div className="font-mono font-semibold text-sm mb-4 text-cyan">{editingId ? "Edit video" : "New video"}</div>
            <Field label="Video title">
              <input className={inputClass} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="e.g. Malenia, no summons — finally" />
            </Field>
            <Field label="YouTube link">
              <input className={inputClass} value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} placeholder="https://www.youtube.com/watch?v=…" />
            </Field>
            <Field label="Game tag (optional)" hint="Match a game title exactly to link it from the Games page — and inherit its genre tags.">
              <input className={inputClass} value={draft.tag} onChange={(e) => setDraft({ ...draft, tag: e.target.value })} placeholder="e.g. Elden Ring" />
            </Field>
            <Field label="Description">
              <textarea className={`${inputClass} min-h-[70px] resize-y`} value={draft.desc} onChange={(e) => setDraft({ ...draft, desc: e.target.value })} placeholder="What's happening in this one…" />
            </Field>

            <Field label="Tags / genres" hint="e.g. Soulslike, FPS, RPG — press Enter or Add after each one. Optional if the game tag above already covers it.">
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
              <Btn variant="primary" type="submit">{editingId ? "Save changes" : "Save video"}</Btn>
              <Btn variant="ghost" type="button" onClick={closeForm}>Cancel</Btn>
            </div>
          </form>
        )}

        {showGenreFilter && videos.length > 0 && (
          <GenreFilterBar value={genreFilter} onChange={setGenreFilter} />
        )}

        {visible.length === 0 ? (
          <div className="text-center py-16 rounded border border-dashed border-lineb text-txd font-mono text-sm">
            {activeTag && genreFilter !== "Any"
              ? `No videos tagged "${activeTag}" match "${genreFilter}".`
              : activeTag
              ? `No videos tagged "${activeTag}" yet.`
              : genreFilter !== "Any"
              ? `No videos tagged "${genreFilter}" yet.`
              : emptyText}
          </div>
        ) : (
          <>
            <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))" }}>
              {pageItems.map((v) => {
                const id = parseYouTubeId(v.url);
                const watchHref = id ? `https://www.youtube.com/watch?v=${id}` : safeHref(v.url);
                return (
                  <div key={v.id} className="rounded overflow-hidden flex flex-col bg-panel border border-line">
                    <div className="relative aspect-video bg-black border-b border-line">
                      {id ? (
                        <iframe
                          className="absolute inset-0 w-full h-full"
                          src={`https://www.youtube-nocookie.com/embed/${id}`}
                          title={v.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-txf">
                          Couldn't read that link
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col gap-2 flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <div className="font-mono font-semibold">{v.title}</div>
                        {authed && (
                          <div className="flex gap-1 shrink-0">
                            <button onClick={() => openEditForm(v)} className="w-7 h-7 rounded border border-lineb text-txf hover:text-cyan hover:border-cyan flex items-center justify-center" aria-label="Edit video">
                              <Pencil size={12} />
                            </button>
                            <button onClick={() => setVideos((all) => all.filter((x) => x.id !== v.id))} className="w-7 h-7 rounded border border-lineb text-txf hover:text-mag hover:border-mag flex items-center justify-center" aria-label="Remove video">
                              <X size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-sm flex-1 text-txd">{v.desc}</p>
                      {v.genres && v.genres.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {v.genres.map((genre) => (
                            <span key={genre} className="font-mono text-[9px] px-2 py-0.5 rounded-full border border-mag-dim text-mag">{genre}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex justify-between items-center mt-1">
                        {v.tag ? (
                          <span className="font-mono text-[10px] px-2 py-1 rounded-full border border-cyan-dim text-cyan">{v.tag}</span>
                        ) : <span />}
                        {watchHref ? (
                          <a href={watchHref} target="_blank" rel="noopener noreferrer">
                            <Btn variant="watch" className="!px-3 !py-1.5 !text-[11px]">
                              <Youtube size={12} /> Watch
                            </Btn>
                          </a>
                        ) : (
                          <Btn variant="ghost" className="!px-3 !py-1.5 !text-[11px] opacity-50 cursor-not-allowed" disabled title="This link isn't a valid http(s) URL">
                            <Youtube size={12} /> Unavailable
                          </Btn>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </section>
    </>
  );
}
