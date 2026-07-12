import { useEffect, useRef, useState } from "react";
import { LogOut, Menu, Lock, ShieldCheck, Plus, X, Settings, User } from "lucide-react";

const BUILTIN_LINKS = [
  { id: "home", label: "Home" },
  { id: "games", label: "Games" },
  { id: "videos", label: "Videos" },
  { id: "merch", label: "Merch", badge: "BETA" },
];

export default function Navbar({ page, setPage, authed, onLoginClick, onLogout, customPages, onNewPage, onDeleteCustomPage }) {
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef(null);
  const links = [...BUILTIN_LINKS, ...customPages.map((p) => ({ id: p.id, label: p.label, custom: true }))];

  useEffect(() => {
    function onClickOutside(e) {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) setSettingsOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 grid grid-cols-[auto_1fr_auto] items-center gap-4 px-6 md:px-10 py-4 bg-void/85 backdrop-blur border-b border-line">
      <button onClick={() => setPage("home")} className="font-display text-sm shrink-0 justify-self-start">
        VIN<span className="text-mag">_</span>REDEEMER
      </button>

      <ul className="hidden md:flex items-center gap-6 flex-wrap justify-self-center">
        {links.map((l) => (
          <li key={l.id} className="flex items-center gap-1">
            <button
              onClick={() => setPage(l.id)}
              className={`nav-link font-mono text-sm uppercase tracking-wide pb-1 flex items-center gap-1.5 ${
                page === l.id ? "active text-gray-100" : "text-txd hover:text-gray-100"
              }`}
            >
              {l.label}
              {l.badge && <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full border border-gold text-gold">{l.badge}</span>}
            </button>
            {authed && l.custom && (
              <button onClick={() => onDeleteCustomPage(l.id)} className="text-txf hover:text-mag" aria-label={`Delete ${l.label} page`}>
                <X size={11} />
              </button>
            )}
          </li>
        ))}
        {authed && (
          <li>
            <button onClick={onNewPage} className="flex items-center gap-1 font-mono text-sm uppercase tracking-wide text-cyan">
              <Plus size={14} /> Page
            </button>
          </li>
        )}
      </ul>

      <div className="hidden md:flex items-center justify-self-end shrink-0">
        {authed ? (
          <div className="flex items-center gap-3 pl-5 border-l border-line">
            <div className="relative" ref={settingsRef}>
              <button
                onClick={() => setSettingsOpen((o) => !o)}
                className="p-2 rounded border border-lineb text-txd hover:text-gray-100 hover:border-cyan"
                aria-label="Settings"
              >
                <Settings size={15} />
              </button>
              {settingsOpen && (
                <div className="absolute left-0 top-full mt-2 w-40 rounded border border-line bg-panel shadow-lg overflow-hidden">
                  <button
                    onClick={() => { setPage("profile"); setSettingsOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-3 font-mono text-xs uppercase text-left text-txd hover:text-gray-100 hover:bg-raised"
                  >
                    <User size={13} /> Profile
                  </button>
                </div>
              )}
            </div>

            <span className="flex items-center gap-1.5 font-mono text-xs text-cyan">
              <ShieldCheck size={14} /> Admin
            </span>

            <button onClick={onLogout} className="font-mono text-sm uppercase tracking-wide text-txd hover:text-gray-100 flex items-center gap-1">
              <LogOut size={14} /> Log out
            </button>
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide px-4 py-2 rounded border border-lineb text-gray-100 hover:border-cyan hover:shadow-glow-cyan transition"
          >
            <Lock size={13} /> Login
          </button>
        )}
      </div>

      <div className="md:hidden col-start-3 flex items-center gap-3 justify-self-end">
        {authed ? (
          <span className="flex items-center gap-1 font-mono text-[11px] text-cyan">
            <ShieldCheck size={13} /> Admin
          </span>
        ) : (
          <button
            onClick={onLoginClick}
            className="flex items-center gap-1.5 font-mono text-[11px] uppercase px-3 py-1.5 rounded border border-lineb text-gray-100"
          >
            <Lock size={12} /> Login
          </button>
        )}
        <button className="p-2 rounded border border-lineb" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          <Menu size={18} />
        </button>
      </div>

      {open && (
        <ul className="md:hidden col-span-3 absolute top-full left-0 right-0 flex flex-col bg-panel border-b border-line max-h-[70vh] overflow-y-auto">
          {links.map((l) => (
            <li key={l.id} className="flex items-center">
              <button
                onClick={() => { setPage(l.id); setOpen(false); }}
                className={`flex-1 text-left px-6 py-4 font-mono text-sm uppercase flex items-center gap-2 ${page === l.id ? "text-gray-100" : "text-txd"}`}
              >
                {l.label}
                {l.badge && <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full border border-gold text-gold">{l.badge}</span>}
              </button>
              {authed && l.custom && (
                <button onClick={() => onDeleteCustomPage(l.id)} className="px-4 text-txf hover:text-mag" aria-label={`Delete ${l.label} page`}>
                  <X size={14} />
                </button>
              )}
            </li>
          ))}
          {authed && (
            <li>
              <button onClick={() => { onNewPage(); setOpen(false); }} className="w-full text-left px-6 py-4 font-mono text-sm uppercase text-cyan flex items-center gap-2">
                <Plus size={14} /> New page
              </button>
            </li>
          )}
          {authed && (
            <li>
              <button onClick={() => { setPage("profile"); setOpen(false); }} className="w-full text-left px-6 py-4 font-mono text-sm uppercase text-txd flex items-center gap-2">
                <Settings size={14} /> Profile settings
              </button>
            </li>
          )}
          {authed && (
            <li>
              <button onClick={onLogout} className="w-full text-left px-6 py-4 font-mono text-sm uppercase text-txd flex items-center gap-2">
                <LogOut size={14} /> Log out
              </button>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
}
