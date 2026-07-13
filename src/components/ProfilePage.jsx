import { useRef, useState } from "react";
import {
  Pencil, Check, X as XIcon, Youtube, Music2, Facebook, Plus,
  Camera, User, LayoutGrid, ExternalLink,
} from "lucide-react";
import Btn from "./Btn.jsx";
import Field, { inputClass } from "./Field.jsx";
import StickerSheet from "./StickerSheet.jsx";
import { safeHref, safeImageSrc } from "../lib/sanitize.js";

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
    <div className="rounded-lg p-6 bg-panel border border-line h-full flex flex-col">
      <div className="font-mono font-semibold text-sm mb-5 text-cyan">Player Profile</div>
      <div className="relative w-28 aspect-square rounded-full overflow-hidden bg-raised border border-lineb mx-auto">
        {cleanImage ? (
          <img src={cleanImage} alt="Profile" className="w-full h-full object-cover" onContextMenu={(e) => e.preventDefault()} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-dim/30 to-mag-dim/30">
            <User size={28} className="text-txf" />
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

      <div className="mt-5 flex-1">
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
            <p className="text-sm text-txd">{heroDesc}</p>
            {authed && (
              <button onClick={() => { setDescDraft(heroDesc); setEditingDesc(true); }} className="mt-2 flex items-center gap-1.5 font-mono text-[11px] uppercase text-txf hover:text-cyan">
                <Pencil size={11} /> Edit description
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const SOCIAL_PLATFORMS = [
  { key: "youtube", followersKey: "youtubeFollowers", label: "YouTube", Icon: Youtube, variant: "watch" },
  { key: "tiktok", followersKey: "tiktokFollowers", label: "TikTok", Icon: Music2, variant: "ghost" },
  { key: "facebook", followersKey: "facebookFollowers", label: "Facebook", Icon: Facebook, variant: "ghost" },
];

function SocialsCard({ profile, setProfile, authed }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);

  function startEdit() { setDraft(profile); setEditing(true); }
  function save() { setProfile({ ...profile, ...draft }); setEditing(false); }

  const activePlatforms = SOCIAL_PLATFORMS.filter((p) => safeHref(profile[p.key]));

  return (
    <div className="rounded-lg p-6 bg-panel border border-line h-full flex flex-col sm:col-span-2 lg:col-span-1">
      <div className="flex justify-between items-start mb-5">
        <div className="font-mono font-semibold text-sm text-cyan">Socials</div>
        {authed && !editing && (
          <button onClick={startEdit} className="w-7 h-7 rounded border border-lineb text-txf hover:text-cyan hover:border-cyan flex items-center justify-center" aria-label="Edit socials">
            <Pencil size={12} />
          </button>
        )}
      </div>

      {editing ? (
        <div className="flex-1 flex flex-col gap-4">
          {SOCIAL_PLATFORMS.map((p) => (
            <div key={p.key}>
              <label className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-txd mb-1.5">
                <p.Icon size={12} /> {p.label}
              </label>
              <input
                className={`${inputClass} !py-2 !text-sm mb-1.5`}
                value={draft[p.key] || ""}
                onChange={(e) => setDraft({ ...draft, [p.key]: e.target.value })}
                placeholder="https://…"
              />
              <input
                className={`${inputClass} !py-2 !text-sm`}
                value={draft[p.followersKey] || ""}
                onChange={(e) => setDraft({ ...draft, [p.followersKey]: e.target.value })}
                placeholder="Followers, e.g. 12.4K"
              />
            </div>
          ))}
          <div className="flex gap-3 mt-1">
            <Btn variant="primary" className="!px-3 !py-2 !text-[11px]" onClick={save}><Check size={13} /> Save</Btn>
            <Btn variant="ghost" className="!px-3 !py-2 !text-[11px]" onClick={() => setEditing(false)}><XIcon size={13} /> Cancel</Btn>
          </div>
        </div>
      ) : activePlatforms.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-center py-8 rounded border border-dashed border-lineb text-txd font-mono text-xs">
          {authed ? 'No socials yet — click the pencil to add them.' : 'Nothing here yet.'}
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-3">
          {activePlatforms.map((p) => (
            <div key={p.key} className="flex items-center justify-between px-4 py-3 rounded bg-raised border border-line">
              <div className="flex items-center gap-2.5">
                <p.Icon size={15} className="text-txd" />
                <div>
                  <div className="font-mono text-xs">{p.label}</div>
                  {profile[p.followersKey] && (
                    <div className="font-mono text-[10px] text-txf">{profile[p.followersKey]} following</div>
                  )}
                </div>
              </div>
              <a href={safeHref(profile[p.key])} target="_blank" rel="noopener noreferrer">
                <Btn variant={p.variant} className="!px-2.5 !py-1.5 !text-[10px]"><ExternalLink size={11} /> Visit</Btn>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AboutMePageCard({ aboutMe, setAboutMe, authed }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(aboutMe);
  const [hobbyInput, setHobbyInput] = useState("");
  const [gameInput, setGameInput] = useState("");

  function startEdit() { setDraft(aboutMe); setEditing(true); }
  function save() { setAboutMe(draft); setEditing(false); }

  function addTag(field, input, setInput) {
    const v = input.trim();
    if (!v) return;
    if (draft[field].some((x) => x.toLowerCase() === v.toLowerCase())) { setInput(""); return; }
    setDraft((d) => ({ ...d, [field]: [...d[field], v] }));
    setInput("");
  }
  function removeTag(field, v) {
    setDraft((d) => ({ ...d, [field]: d[field].filter((x) => x !== v) }));
  }

  return (
    <div className="rounded-lg p-6 bg-panel border border-line">
      <div className="flex justify-between items-center mb-5">
        <div>
          <div className="font-mono font-semibold text-sm text-cyan">About Me page</div>
          <p className="font-mono text-xs text-txd mt-1">Hobbies, games you play, and what you do in your free time — shown on the public About page.</p>
        </div>
        {authed && !editing && (
          <Btn variant="primary" className="!px-3 !py-2 !text-[11px]" onClick={startEdit}>
            <Pencil size={13} /> Edit
          </Btn>
        )}
      </div>

      {editing ? (
        <div>
          <Field label="Hobbies" hint="Press Enter or Add after each one.">
            <div className="flex gap-2">
              <input
                className={inputClass}
                value={hobbyInput}
                onChange={(e) => setHobbyInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag("hobbies", hobbyInput, setHobbyInput); } }}
                placeholder="Photography"
              />
              <Btn type="button" variant="ghost" className="!px-3 !py-2 !text-[11px]" onClick={() => addTag("hobbies", hobbyInput, setHobbyInput)}>Add</Btn>
            </div>
            {draft.hobbies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {draft.hobbies.map((h) => (
                  <span key={h} className="inline-flex items-center gap-1.5 font-mono text-[10px] px-2 py-1 rounded-full border border-cyan-dim text-cyan">
                    {h}
                    <button type="button" onClick={() => removeTag("hobbies", h)} aria-label={`Remove ${h}`}><XIcon size={10} /></button>
                  </span>
                ))}
              </div>
            )}
          </Field>

          <Field label="Games I play" hint="Press Enter or Add after each one.">
            <div className="flex gap-2">
              <input
                className={inputClass}
                value={gameInput}
                onChange={(e) => setGameInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag("games", gameInput, setGameInput); } }}
                placeholder="Elden Ring"
              />
              <Btn type="button" variant="ghost" className="!px-3 !py-2 !text-[11px]" onClick={() => addTag("games", gameInput, setGameInput)}>Add</Btn>
            </div>
            {draft.games.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {draft.games.map((g) => (
                  <span key={g} className="inline-flex items-center gap-1.5 font-mono text-[10px] px-2 py-1 rounded-full border border-mag-dim text-mag">
                    {g}
                    <button type="button" onClick={() => removeTag("games", g)} aria-label={`Remove ${g}`}><XIcon size={10} /></button>
                  </span>
                ))}
              </div>
            )}
          </Field>

          <Field label="What I do in my free time">
            <textarea className={`${inputClass} min-h-[100px] resize-y`} value={draft.freeTime} onChange={(e) => setDraft({ ...draft, freeTime: e.target.value })} />
          </Field>

          <div className="flex gap-3">
            <Btn variant="primary" onClick={save}><Check size={14} /> Save</Btn>
            <Btn variant="ghost" onClick={() => setEditing(false)}><XIcon size={14} /> Cancel</Btn>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wide text-txf mb-2">Hobbies</div>
            <p className="text-sm text-txd">{aboutMe.hobbies.length ? aboutMe.hobbies.join(", ") : "—"}</p>
          </div>
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wide text-txf mb-2">Games</div>
            <p className="text-sm text-txd">{aboutMe.games.length ? aboutMe.games.join(", ") : "—"}</p>
          </div>
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wide text-txf mb-2">Free time</div>
            <p className="text-sm text-txd">{aboutMe.freeTime || "—"}</p>
          </div>
        </div>
      )}
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
          No custom pages yet — Games, Videos, Merch, About and Profile are always there; anything else you add shows up here.
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

export default function ProfilePage({
  profile, setProfile, profileImage, setProfileImage, heroDesc, setHeroDesc,
  stickers, setStickers, aboutMe, setAboutMe,
  customPages, onNewPage, onDeleteCustomPage, authed,
}) {
  return (
    <>
      <header className="px-5 sm:px-8 md:px-10 pt-8 sm:pt-10 md:pt-14 pb-5 md:pb-6 border-b border-line">
        <h1 className="font-display text-lg mb-2">Profile</h1>
        <p className="font-mono text-sm text-txd">Who's actually behind the cartridges.</p>
      </header>

      <section className="px-5 sm:px-8 md:px-10 py-6 md:py-10 max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-1.5 items-stretch mb-6">
          <PlayerProfileCard
            profileImage={profileImage}
            setProfileImage={setProfileImage}
            heroDesc={heroDesc}
            setHeroDesc={setHeroDesc}
            authed={authed}
          />
          <div className="rounded-lg p-6 bg-panel border border-line h-full">
            <StickerSheet stickers={stickers} setStickers={setStickers} authed={authed} />
          </div>
          <SocialsCard profile={profile} setProfile={setProfile} authed={authed} />
        </div>

        <div className="mb-6">
          <AboutMePageCard aboutMe={aboutMe} setAboutMe={setAboutMe} authed={authed} />
        </div>

        {authed && (
          <PagesCard customPages={customPages} onNewPage={onNewPage} onDeleteCustomPage={onDeleteCustomPage} />
        )}
      </section>
    </>
  );
}
