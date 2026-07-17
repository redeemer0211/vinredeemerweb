import { useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Hero from "./components/Hero.jsx";
import GamesPage from "./components/GamesPage.jsx";
import VideosPage from "./components/VideosPage.jsx";
import GenericCardsPage from "./components/GenericCardsPage.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import AboutMePage from "./components/AboutMePage.jsx";
import LoginModal from "./components/LoginModal.jsx";
import NewPageModal from "./components/NewPageModal.jsx";
import { isAuthed, clearSession } from "./lib/auth.js";
import { loadList, saveList, loadValue, saveValue } from "./lib/storage.js";
import { seedGames, seedVideos, seedMerch, seedStickers, defaultProfile, defaultHeroDesc, defaultAboutMe } from "./data/seed.js";
import { normalizeAboutMe } from "./lib/aboutMe.js";

const BUILTIN_PAGE_IDS = ["home", "games", "videos", "merch", "about", "profile"];

export default function App() {
  const [authed, setAuthed] = useState(isAuthed());
  const [loginOpen, setLoginOpen] = useState(false);
  const [newPageOpen, setNewPageOpen] = useState(false);
  const [page, setPage] = useState("home");
  const [activeTag, setActiveTag] = useState(null);

  const [games, setGames] = useState(() => { const s = loadList("vr_games"); return s.length ? s : seedGames; });
  const [videos, setVideos] = useState(() => { const s = loadList("vr_videos"); return s.length ? s : seedVideos; });
  const [merch, setMerch] = useState(() => { const s = loadList("vr_merch"); return s.length ? s : seedMerch; });
  const [stickers, setStickers] = useState(() => { const s = loadList("vr_stickers"); return s.length ? s : seedStickers; });
  const [profile, setProfile] = useState(() => loadValue("vr_profile", defaultProfile));
  const [profileImage, setProfileImage] = useState(() => loadValue("vr_profile_image", ""));
  const [heroDesc, setHeroDesc] = useState(() => loadValue("vr_hero_desc", defaultHeroDesc));
  const [aboutMe, setAboutMe] = useState(() => normalizeAboutMe(loadValue("vr_about_me", defaultAboutMe)));
  const [customPages, setCustomPages] = useState(() => loadList("vr_custom_pages"));
  const [customData, setCustomData] = useState(() => loadValue("vr_custom_pages_data", {}));

  useEffect(() => saveList("vr_games", games), [games]);
  useEffect(() => saveList("vr_videos", videos), [videos]);
  useEffect(() => saveList("vr_merch", merch), [merch]);
  useEffect(() => saveList("vr_stickers", stickers), [stickers]);
  useEffect(() => saveValue("vr_profile", profile), [profile]);
  useEffect(() => saveValue("vr_profile_image", profileImage), [profileImage]);
  useEffect(() => saveValue("vr_hero_desc", heroDesc), [heroDesc]);
  useEffect(() => saveValue("vr_about_me", aboutMe), [aboutMe]);
  useEffect(() => saveList("vr_custom_pages", customPages), [customPages]);
  useEffect(() => saveValue("vr_custom_pages_data", customData), [customData]);

  // Light deterrent only — does NOT hide page code or stop DevTools; see README.
  useEffect(() => {
    function blockContextMenu(e) { if (e.target.closest("img")) e.preventDefault(); }
    document.addEventListener("contextmenu", blockContextMenu);
    return () => document.removeEventListener("contextmenu", blockContextMenu);
  }, []);

  function gotoVideosForTag(tag) { setActiveTag(tag); setPage("videos"); }
  function goto(p) { if (p !== "videos") setActiveTag(null); setPage(p); }
  function logout() { clearSession(); setAuthed(false); }

  function createCustomPage({ label, template }) {
    const id = "c_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    setCustomPages((list) => [...list, { id, label, template }]);
    setCustomData((d) => ({ ...d, [id]: [] }));
    setNewPageOpen(false);
    setPage(id);
  }

  function deleteCustomPage(id) {
    setCustomPages((list) => list.filter((p) => p.id !== id));
    setCustomData((d) => { const next = { ...d }; delete next[id]; return next; });
    if (page === id) setPage("home");
  }

  function setCustomItems(id) {
    return (updater) =>
      setCustomData((d) => ({ ...d, [id]: typeof updater === "function" ? updater(d[id] || []) : updater }));
  }

  const activeCustomPage = customPages.find((p) => p.id === page);

  return (
    <div className="min-h-screen w-full">
      <Navbar
        page={page}
        setPage={goto}
        authed={authed}
        onLoginClick={() => setLoginOpen(true)}
        onLogout={logout}
        customPages={customPages}
      />

      {page === "home" && (
        <Hero setPage={goto} profileImage={profileImage} heroDesc={heroDesc} profile={profile} />
      )}
      {page !== "home" && (
        <div className="screen-fit flex flex-col">
          {page === "games" && (
            <GamesPage games={games} setGames={setGames} gotoVideosForTag={gotoVideosForTag} authed={authed} />
          )}
          {page === "videos" && (
            <VideosPage videos={videos} setVideos={setVideos} activeTag={activeTag} clearTag={() => setActiveTag(null)} authed={authed} games={games} />
          )}
          {page === "merch" && (
            <GenericCardsPage
              eyebrow="// Shop"
              title="Merchandise"
              subtitle="Everything here is a placeholder until you add the real stuff."
              emptyText='No merch yet. Hit "+ Add item" to list your first piece.'
              items={merch}
              setItems={setMerch}
              authed={authed}
              badge="BETA"
            />
          )}
          {page === "about" && <AboutMePage aboutMe={aboutMe} profileImage={profileImage} />}
          {page === "profile" && (
            <ProfilePage
              profile={profile}
              setProfile={setProfile}
              profileImage={profileImage}
              setProfileImage={setProfileImage}
              heroDesc={heroDesc}
              setHeroDesc={setHeroDesc}
              stickers={stickers}
              setStickers={setStickers}
              aboutMe={aboutMe}
              setAboutMe={setAboutMe}
              videos={videos}
              setVideos={setVideos}
              customPages={customPages}
              onNewPage={() => setNewPageOpen(true)}
              onDeleteCustomPage={deleteCustomPage}
              authed={authed}
            />
          )}

          {activeCustomPage && activeCustomPage.template === "cards" && (
            <GenericCardsPage
              eyebrow="// Custom page"
              title={activeCustomPage.label}
              items={customData[activeCustomPage.id] || []}
              setItems={setCustomItems(activeCustomPage.id)}
              authed={authed}
            />
          )}
          {activeCustomPage && activeCustomPage.template === "videos" && (
            <VideosPage
              title={activeCustomPage.label}
              showChannelLink={false}
              showGenreFilter={false}
              videos={customData[activeCustomPage.id] || []}
              setVideos={setCustomItems(activeCustomPage.id)}
              activeTag={null}
              clearTag={() => {}}
              authed={authed}
            />
          )}
        </div>
      )}

      <Footer profile={profile} authed={authed} />

      {loginOpen && (
        <LoginModal onClose={() => setLoginOpen(false)} onSuccess={() => { setAuthed(true); setLoginOpen(false); }} />
      )}
      {newPageOpen && (
        <NewPageModal onClose={() => setNewPageOpen(false)} onCreate={createCustomPage} />
      )}
    </div>
  );
}
