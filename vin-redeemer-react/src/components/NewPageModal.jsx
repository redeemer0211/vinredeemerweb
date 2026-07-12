import { useState } from "react";
import { X, LayoutGrid, Youtube } from "lucide-react";
import Btn from "./Btn.jsx";
import Field, { inputClass } from "./Field.jsx";

export default function NewPageModal({ onClose, onCreate }) {
  const [label, setLabel] = useState("");
  const [template, setTemplate] = useState("cards");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!label.trim()) { setError("Give the page a name."); return; }
    onCreate({ label: label.trim(), template });
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-6 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-[420px] rounded-lg overflow-hidden bg-panel border border-lineb shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2 px-4 py-2.5 font-mono text-xs text-txd bg-raised border-b border-line">
          <span>new_page.exe</span>
          <button onClick={onClose} className="ml-auto text-txd hover:text-gray-100" aria-label="Close"><X size={14} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="font-mono font-semibold text-sm mb-4 text-cyan">Create a page</div>

          <Field label="Page name" hint="Shows up in the navbar exactly like this.">
            <input className={inputClass} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Merchandise" autoFocus />
          </Field>

          <div className="mb-5">
            <label className="block font-mono text-xs uppercase tracking-wide text-txd mb-2">Template</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTemplate("cards")}
                className={`flex flex-col items-center gap-2 p-4 rounded border font-mono text-xs ${template === "cards" ? "border-cyan text-gray-100" : "border-lineb text-txd"}`}
              >
                <LayoutGrid size={20} />
                Cards
                <span className="text-[10px] text-txf">like Games / Merch</span>
              </button>
              <button
                type="button"
                onClick={() => setTemplate("videos")}
                className={`flex flex-col items-center gap-2 p-4 rounded border font-mono text-xs ${template === "videos" ? "border-cyan text-gray-100" : "border-lineb text-txd"}`}
              >
                <Youtube size={20} />
                Videos
                <span className="text-[10px] text-txf">like Videos</span>
              </button>
            </div>
          </div>

          {error && <p className="font-mono text-xs mb-3 text-mag">{error}</p>}

          <div className="flex gap-3">
            <Btn variant="primary" type="submit">Create page</Btn>
            <Btn variant="ghost" type="button" onClick={onClose}>Cancel</Btn>
          </div>
        </form>
      </div>
    </div>
  );
}
