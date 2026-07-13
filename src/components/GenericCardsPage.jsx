import { useRef, useState } from "react";
import { Plus, X, ExternalLink } from "lucide-react";
import Btn from "./Btn.jsx";
import Field, { inputClass } from "./Field.jsx";
import { safeImageSrc, safeHref } from "../lib/sanitize.js";

export default function GenericCardsPage({
  eyebrow = "// Collection",
  title = "Items",
  subtitle = "",
  emptyText = "Nothing here yet.",
  items,
  setItems,
  authed,
  badge = null,
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");
  const [link, setLink] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  function reset() {
    setName(""); setImageUrl(""); setPrice(""); setLink(""); setDesc(""); setError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) { setError("Give it a name."); return; }
    const file = fileRef.current?.files?.[0];
    const commit = (image) => {
      setItems((list) => [
        { id: Date.now().toString(36), name: name.trim(), image: image || "", price: price.trim(), link: link.trim(), desc: desc.trim() },
        ...list,
      ]);
      reset();
      setFormOpen(false);
    };
    if (file) {
      const reader = new FileReader();
      reader.onload = () => commit(reader.result);
      reader.readAsDataURL(file);
    } else {
      commit(imageUrl.trim());
    }
  }

  return (
    <>
      <header className="px-5 sm:px-8 md:px-10 pt-8 sm:pt-10 md:pt-14 pb-5 md:pb-6 border-b border-line">
        <div className="flex justify-between items-end gap-4 flex-wrap">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-cyan">{eyebrow}</span>
            <h1 className="font-display text-lg mt-2 mb-2 flex items-center gap-3">
              {title}
              {badge && (
                <span className="font-mono text-[10px] px-2 py-1 rounded-full border border-gold text-gold align-middle">{badge}</span>
              )}
            </h1>
            {subtitle && <p className="font-mono text-sm text-txd">{subtitle}</p>}
          </div>
          {authed && (
            <Btn variant="primary" onClick={() => setFormOpen((o) => !o)}>
              <Plus size={16} /> Add item
            </Btn>
          )}
        </div>
      </header>

      <section className="px-5 sm:px-8 md:px-10 py-6 md:py-8">
        {authed && formOpen && (
          <form onSubmit={handleSubmit} className="rounded-lg p-6 mb-9 bg-panel border border-line">
            <div className="font-mono font-semibold text-sm mb-4 text-cyan">New item</div>
            <Field label="Name">
              <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Vin_Redeemer Hoodie" />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Image URL">
                <input className={inputClass} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" />
              </Field>
              <Field label="…or upload an image">
                <input ref={fileRef} type="file" accept="image/*" className={inputClass} />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Price (optional)">
                <input className={inputClass} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="$25" />
              </Field>
              <Field label="Buy / view link (optional)">
                <input className={inputClass} value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://…" />
              </Field>
            </div>
            <Field label="Description">
              <textarea className={`${inputClass} min-h-[70px] resize-y`} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What is it…" />
            </Field>
            {error && <p className="font-mono text-xs mb-3 text-mag">{error}</p>}
            <div className="flex gap-3">
              <Btn variant="primary" type="submit">Save item</Btn>
              <Btn variant="ghost" type="button" onClick={() => { reset(); setFormOpen(false); }}>Cancel</Btn>
            </div>
          </form>
        )}

        {items.length === 0 ? (
          <div className="text-center py-16 rounded border border-dashed border-lineb text-txd font-mono text-sm">{emptyText}</div>
        ) : (
          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))" }}>
            {items.map((it) => {
              const img = safeImageSrc(it.image);
              const href = safeHref(it.link);
              return (
                <div key={it.id} className="rounded overflow-hidden flex flex-col bg-panel border border-line transition hover:border-cyan hover:-translate-y-1 hover:shadow-glow-cyan">
                  <div className="aspect-video flex items-center justify-center overflow-hidden bg-raised border-b border-line">
                    {img ? (
                      <img src={img} alt={it.name} className="w-full h-full object-cover" onContextMenu={(e) => e.preventDefault()} />
                    ) : (
                      <span className="font-mono text-xs text-txf">NO IMAGE</span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <div className="font-mono font-semibold">{it.name}</div>
                      {authed && (
                        <button onClick={() => setItems((all) => all.filter((x) => x.id !== it.id))} className="w-7 h-7 rounded border border-lineb text-txf hover:text-mag hover:border-mag flex items-center justify-center shrink-0" aria-label="Remove item">
                          <X size={13} />
                        </button>
                      )}
                    </div>
                    <p className="text-sm flex-1 text-txd">{it.desc}</p>
                    <div className="flex justify-between items-center mt-1">
                      {it.price ? <span className="font-mono text-sm text-gold">{it.price}</span> : <span />}
                      {href && (
                        <a href={href} target="_blank" rel="noopener noreferrer">
                          <Btn variant="watch" className="!px-3 !py-1.5 !text-[11px]"><ExternalLink size={12} /> View</Btn>
                        </a>
                      )}
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
