import { useEffect, useRef, useState } from "react";
import { Plus, X, Copy, Check } from "lucide-react";
import Btn from "./Btn.jsx";
import Field, { inputClass } from "./Field.jsx";
import Pagination from "./Pagination.jsx";
import { safeImageSrc } from "../lib/sanitize.js";
import { useResponsiveValue } from "../lib/useViewport.js";

export default function StickerSheet({ stickers, setStickers, authed }) {
  const [formOpen, setFormOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [page, setPage] = useState(1);
  const fileRef = useRef(null);
  const PAGE_SIZE = useResponsiveValue({ mobile: 6, tablet: 8, desktop: 10 });

  const totalPages = Math.max(1, Math.ceil(stickers.length / PAGE_SIZE));
  const pageItems = stickers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);

  function reset() {
    setCaption(""); setImageUrl(""); setError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleSubmit(e) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    const commit = (image) => {
      const clean = safeImageSrc(image);
      if (!clean) { setError("That doesn't look like a usable image."); return; }
      setStickers((list) => [{ id: Date.now().toString(36), image: clean, caption: caption.trim() }, ...list]);
      reset();
      setFormOpen(false);
      setPage(1);
    };
    if (file) {
      const reader = new FileReader();
      reader.onload = () => commit(reader.result);
      reader.readAsDataURL(file);
    } else if (imageUrl.trim()) {
      commit(imageUrl.trim());
    } else {
      setError("Add an image URL or upload a file.");
    }
  }

  async function copyImage(sticker) {
    const img = safeImageSrc(sticker.image);
    if (!img) return;
    try {
      await navigator.clipboard.writeText(img);
      setCopiedId(sticker.id);
      setTimeout(() => setCopiedId((id) => (id === sticker.id ? null : id)), 1500);
    } catch {
      /* clipboard permission denied — silently ignore, the button just won't confirm */
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-end gap-4 flex-wrap mb-4">
        <div>
          <div className="font-mono font-semibold text-sm text-cyan">Sticker sheet</div>
          <p className="font-mono text-xs text-txd mt-1">
            Grab the image link for forum replies, loading screens, wherever.
          </p>
        </div>
        {authed && (
          <Btn variant="primary" className="!px-3 !py-2 !text-[11px]" onClick={() => setFormOpen((o) => !o)}>
            <Plus size={14} /> Add sticker
          </Btn>
        )}
      </div>

      {authed && formOpen && (
        <form onSubmit={handleSubmit} className="rounded-lg p-5 mb-6 bg-void border border-line">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Image URL">
              <input className={inputClass} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" />
            </Field>
            <Field label="…or upload">
              <input ref={fileRef} type="file" accept="image/*" className={inputClass} />
            </Field>
          </div>
          <Field label="Caption (optional)">
            <input className={inputClass} value={caption} onChange={(e) => setCaption(e.target.value)} />
          </Field>
          {error && <p className="font-mono text-xs mb-3 text-mag">{error}</p>}
          <div className="flex gap-3">
            <Btn variant="primary" type="submit">Save sticker</Btn>
            <Btn variant="ghost" type="button" onClick={() => { reset(); setFormOpen(false); }}>Cancel</Btn>
          </div>
        </form>
      )}

      {stickers.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-center py-12 rounded border border-dashed border-lineb text-txd font-mono text-sm">
          No stickers yet.
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            {pageItems.map((s) => {
              const img = safeImageSrc(s.image);
              return (
                <div key={s.id} className="relative rounded-lg overflow-hidden bg-raised border border-line group">
                  {authed && (
                    <button
                      onClick={() => setStickers((all) => all.filter((x) => x.id !== s.id))}
                      className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded border border-lineb bg-void/80 backdrop-blur text-txf hover:text-mag hover:border-mag flex items-center justify-center"
                      aria-label="Remove sticker"
                    >
                      <X size={10} />
                    </button>
                  )}
                  <div className="aspect-square flex items-center justify-center p-2 bg-void">
                    {img && <img src={img} alt={s.caption || "sticker"} className="w-full h-full object-contain" draggable={false} />}
                  </div>
                  <button
                    onClick={() => copyImage(s)}
                    className="w-full flex items-center justify-center gap-1 px-1 py-1.5 font-mono text-[9px] uppercase text-txd hover:text-gray-100 border-t border-line"
                  >
                    {copiedId === s.id ? (<><Check size={10} /> Copied</>) : (<><Copy size={10} /> Copy</>)}
                  </button>
                </div>
              );
            })}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      )}
    </div>
  );
}
