import { useRef, useState } from "react";
import { Pencil, Check, X as XIcon, Youtube, Music2, Link2, Plus, Trash2, Camera, User, LayoutGrid } from "lucide-react";
import Btn from "./Btn.jsx";
import Field, { inputClass } from "./Field.jsx";
import StickerSheet from "./StickerSheet.jsx";
import { safeHref, safeImageSrc } from "../lib/sanitize.js";
import { stats } from "../data/seed.js";

function PlayerProfileCard({ profileImage, setProfileImage, heroDesc, setHeroDesc, authed }) {
  const [editingPhoto, setEditingPhoto] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [editingDesc, setEditingDesc] = useState(false);
  const [descDraft, setDescDraft] = useState(heroDesc);
  const fileRef = useRef(null);
  const cleanImage = safeImageSrc(profileImage);

  function commitUrl() {
    const clean = safeImageSrc(urlInput.trim());
    if (clean) setProfileImage(clean);
    setUrlInput("");
    setEditingPhoto(false);
  }
  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setProfileImage(reader.result); setEditingPhoto(false); };
    reader.readAsDataURL(file);
  }
  function saveDesc() { setHeroDesc(descDraft.trim() || heroDesc); setEditingDesc(false); }

  return (
    <div className="rounded-lg p-6 bg-panel border border-line">
      <div className="font-mono font-semibold text-sm mb-5 text-cyan">Player Profile</div>
      <div className="grid sm:grid-cols-[160px_1fr] gap-6">
        <div>
          <div className="relative w-full aspect-square rounded-full overflow-hidden bg-raised border border-lineb">
            {cleanImage ? (
              <img src={cleanImage} alt="Profile" className="w-full h-full object-cover" onContextMenu={(e) => e.preventDefault()} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-dim/30 to-mag-dim/30">
                <User size={32} className="text-txf" />
              </div>
            )}
          </div>
          {authed && (
            <button onClick={() => setEditingPhoto((o) => !o)} className="mt-3 w-full flex items-center justify-center gap-1.5 font-mono text-[11px] uppercase px-3 py-2 rounded border border-lineb hover:border-cyan">
              <Camera size={12} /> Change photo
            </button>
          )}
          {authed && editingPhoto && (
            <div className="mt-3 p-3 rounded bg-raised border border-line">
              <label className="block font-mono text-[10px] uppercase tracking-wide text-txd mb-1.5">Image URL</label>
              <div className="flex gap-2 mb-2">
                <input className={`${inputClass} !py-1.5 !text-sm`} value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="https://…" />
                <Btn variant="primary" className="!px-2 !py-1.5 !text-[10px]" onClick={commitUrl}>Set</Btn>
              </div>
              <label className="block font-mono text-[10px] uppercase tracking-wide text-txd mb-1.5">…or upload</label>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className={`${inputClass} !py-1.5 !text-sm`} />
            </div>
          )}
        </div>

        <div>
          <label className="block font-mono text-xs uppercase tracking-wide text-txd mb-2">Hero description</label>
          {editingDesc ? (
            <div>
              <textarea className={`${inputClass} min-h-[100px] resize-y`} value={descDraft} onChange={(e) => setDescDraft(e.target.value)} />
              <div className="flex gap-2 mt-2">
                <Btn variant="primary" className="!px-3 !py-2 !text-[11px]" onClick={saveDesc}><Check size={13} /> Save</Btn>
                <Btn variant="ghost" className="!px-3 !py-2 !text-[11px]" onClick={() => { setDescDraft(heroDesc); setEditingDesc(false); }}><XIcon size={13} /> Cancel</Btn>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-base text-txd">{heroDesc}</p>
              {authed && (
                <button onClick={() => { setDescDraft(heroDesc); setEditingDesc(true); }} className="mt-2 flex items-center gap-1.5 font-mono text-[11px] uppercase text-txf hover:text-cyan">
                  <Pencil size={11} /> Edit description
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PagesCard({ customPages, onNewPage, onDeleteCustomPage }) {
  return (
    <div className="rounded-lg p-6 bg-panel border border-line">
      <div className="flex justify-between items-center mb-5">
        <div>
          <div className="font-mono font-semibold text-sm text-cyan">Pages</div>
          <p className="font-mono text-xs text-txd mt-1">Add more pages to the site from a template.</p>
        </div>
        <Btn variant="primary" className="!px-3 !py-2 !text-[11px]" onClick={onNewPage}>
          <Plus size={14} /> New page
        </Btn>
      </div>

      {customPages.length === 0 ? (
        <div className="text-center py-8 rounded border border-dashed border-lineb text-txd font-mono text-xs">
          No custom pages yet — Games, Videos, Merch and Profile are always there; anything else you add shows up here.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {customPages.map((p) => (
            <div key={p.id} className="flex items-center justify-between px-4 py-3 rounded bg-raised border border-line">
              <div className="flex items-center gap-2 font-mono text-sm">
                {p.template === "videos" ? <Youtube size={13} className="text-txf" /> : <LayoutGrid size={13} className="text-txf" />}
                {p.label}
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full border border-lineb text-txf uppercase">{p.template}</span>
              </div>
              <button onClick={() => onDeleteCustomPage(p.id)} className="w-7 h-7 rounded border border-lineb text-txf hover:text-mag hover:border-mag flex items-center justify-center" aria-label={`Delete ${p.label}`}>
                <XIcon size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CreatorStatsCard({ stat }) {
  return (
    <div className="grid grid-cols-[200px] gap-6">
    <div className="rounded-lg p-6 bg-panel border border-line">
      <div className="font-mono font-semibold text-sm text-cyan mb-5">
        Creator Stats
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span>YouTube</span>
          <span>{stats.youtube}</span>
        </div>

        <div className="flex justify-between">
          <span>Facebook</span>
          <span>{stats.facebook}</span>
        </div>

        <div className="flex justify-between">
          <span>TikTok</span>
          <span>{stats.tiktok}</span>
        </div>

        <div className="flex justify-between">
          <span>GitHub</span>
          <span>{stats.githubRepos}</span>
        </div>
      </div>
    </div>
    </div>
  );
}


export default function ProfilePage({
  profile,
  setProfile,
  profileImage,
  setProfileImage,
  heroDesc,
  setHeroDesc,
  stickers,
  setStickers,
  customPages,
  onNewPage,
  onDeleteCustomPage,
  authed,
  stats,
  setStats,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [draftStats, setDraftStats] = useState(stats);

  function startEdit() { setDraft(profile); setEditing(true); }
function save() {
  setProfile({
    ...draft,
    links: draft.links.filter((l) => l.label.trim() && l.url.trim())
  });

  setStats(draftStats);

  setEditing(false);
}
  function addLink() { setDraft((d) => ({ ...d, links: [...d.links, { id: Date.now().toString(36), label: "", url: "" }] })); }
  function updateLink(id, field, value) { setDraft((d) => ({ ...d, links: d.links.map((l) => (l.id === id ? { ...l, [field]: value } : l)) })); }
  function removeLink(id) { setDraft((d) => ({ ...d, links: d.links.filter((l) => l.id !== id) })); }

  return (
    <>
      <header className="px-6 md:px-10 pt-14 pb-6 border-b border-line">
        <div className="flex justify-between items-end gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-lg mb-2">Profile</h1>
            <p className="font-mono text-sm text-txd">Who's actually behind the cartridges.</p>
          </div>
          {authed && !editing && (
            <Btn variant="primary" onClick={startEdit}>
              <Pencil size={14} /> Edit about me
            </Btn>
          )}
        </div>
      </header>

      <section className="px-6 md:px-10 py-10 w-full">
        <div className="grid lg:grid-cols-[500px_3fr_500px] gap-6 items-start">
          <div className="flex flex-col gap-6">
            <PlayerProfileCard
              profileImage={profileImage}
              setProfileImage={setProfileImage}
              heroDesc={heroDesc}
              setHeroDesc={setHeroDesc}
              authed={authed}
            />

            {editing ? (
              <div className="rounded-lg p-6 bg-panel border border-line">
                <div className="font-mono font-semibold text-sm mb-5 text-cyan">About me</div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Nickname">
                    <input className={inputClass} value={draft.nickname} onChange={(e) => setDraft({ ...draft, nickname: e.target.value })} placeholder="Vin" />
                  </Field>
                  <Field label="Alias">
                    <input className={inputClass} value={draft.alias} onChange={(e) => setDraft({ ...draft, alias: e.target.value })} placeholder="Vin Redeemer" />
                  </Field>
                </div>
                <Field label="About me">
                  <textarea className={`${inputClass} min-h-[110px] resize-y`} value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} placeholder="A few lines about who you are…" />
                </Field>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="YouTube URL">
                    <input className={inputClass} value={draft.youtube} onChange={(e) => setDraft({ ...draft, youtube: e.target.value })} placeholder="https://youtube.com/@…" />
                  </Field>
                  <Field label="TikTok URL">
                    <input className={inputClass} value={draft.tiktok} onChange={(e) => setDraft({ ...draft, tiktok: e.target.value })} placeholder="https://tiktok.com/@…" />
                  </Field>
                </div>

                <div className="mt-6">
  <div className="font-mono font-semibold text-sm mb-4 text-cyan">
    Creator Stats
  </div>

  <div className="grid sm:grid-cols-2 gap-4">

    <Field label="YouTube Subscribers">
      <input
        className={inputClass}
        value={draftStats.youtube}
        onChange={(e)=>
          setDraftStats({
            ...draftStats,
            youtube: e.target.value
          })
        }
      />
    </Field>

    <Field label="Facebook Followers">
      <input
        className={inputClass}
        value={draftStats.facebook}
        onChange={(e)=>
          setDraftStats({
            ...draftStats,
            facebook: e.target.value
          })
        }
      />
    </Field>

    <Field label="TikTok Followers">
      <input
        className={inputClass}
        value={draftStats.tiktok}
        onChange={(e)=>
          setDraftStats({
            ...draftStats,
            tiktok: e.target.value
          })
        }
      />
    </Field>

    <Field label="GitHub Repositories">
      <input
        className={inputClass}
        value={draftStats.githubRepos}
        onChange={(e)=>
          setDraftStats({
            ...draftStats,
            githubRepos: e.target.value
          })
        }
      />
    </Field>

  </div>
</div>

                <div className="mt-2 mb-3 font-mono text-xs uppercase tracking-wide text-txd">Other webapps / links</div>
                {draft.links.map((l) => (
                  <div key={l.id} className="flex gap-2 mb-2">
                    <input className={inputClass} value={l.label} onChange={(e) => updateLink(l.id, "label", e.target.value)} placeholder="Label, e.g. Discord" />
                    <input className={inputClass} value={l.url} onChange={(e) => updateLink(l.id, "url", e.target.value)} placeholder="https://…" />
                    <button onClick={() => removeLink(l.id)} className="w-10 h-10 shrink-0 rounded border border-lineb text-txf hover:text-mag hover:border-mag flex items-center justify-center" aria-label="Remove link">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button onClick={addLink} className="flex items-center gap-1.5 font-mono text-xs text-cyan mt-1 mb-6">
                  <Plus size={13} /> Add link
                </button>

                <div className="flex gap-3">
                  <Btn variant="primary" onClick={save}><Check size={14} /> Save profile</Btn>
                  <Btn variant="ghost" onClick={() => setEditing(false)}><XIcon size={14} /> Cancel</Btn>
                </div>
              </div>
            ) : (
              <div className="rounded-lg p-6 bg-panel border border-line">


                <p className="text-lg text-txd mb-6 whitespace-pre-wrap">
                  {profile.bio || (authed ? 'No bio yet — click "Edit about me" to add one.' : "")}
                </p>

                <div className="flex flex-wrap gap-3 mb-6">
                  {safeHref(profile.youtube) && (
                    <a href={safeHref(profile.youtube)} target="_blank" rel="noopener noreferrer">
                      <Btn variant="watch" className="!px-3 !py-2 !text-[11px]"><Youtube size={14} /> YouTube</Btn>
                    </a>
                  )}
                  {safeHref(profile.tiktok) && (
                    <a href={safeHref(profile.tiktok)} target="_blank" rel="noopener noreferrer">
                      <Btn variant="ghost" className="!px-3 !py-2 !text-[11px]"><Music2 size={14} /> TikTok</Btn>
                    </a>
                  )}
                </div>

                {profile.links.length > 0 && (
                  <div>
                    <div className="font-mono text-xs uppercase tracking-wide text-txd mb-3">Elsewhere</div>
                    <div className="flex flex-wrap gap-3">
                      {profile.links.map((l) =>
                        safeHref(l.url) ? (
                          <a key={l.id} href={safeHref(l.url)} target="_blank" rel="noopener noreferrer">
                            <Btn variant="ghost" className="!px-3 !py-2 !text-[11px]"><Link2 size={13} /> {l.label}</Btn>
                          </a>
                        ) : null
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

<div className="grid grid-cols-[705px_3fr_500px] gap-6">
          <div className="rounded-lg p-6 bg-panel border border-line">
            <StickerSheet stickers={stickers} setStickers={setStickers} authed={authed} />
          </div>

          <CreatorStatsCard stats={stats} />

        </div>
        </div>

        {authed && (
          <div className="mt-6">
            <PagesCard customPages={customPages} onNewPage={onNewPage} onDeleteCustomPage={onDeleteCustomPage} />
          </div>
        )}
      </section>
    </>
  );
}
