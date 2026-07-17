import { useEffect, useRef, useState } from "react";
import { Mail, Youtube, Music2, Facebook, Heart, UserPlus } from "lucide-react";
import { safeHref } from "../lib/sanitize.js";

const FOLLOW_PLATFORMS = [
  { key: "youtube", label: "YouTube", Icon: Youtube },
  { key: "tiktok", label: "TikTok", Icon: Music2 },
  { key: "facebook", label: "Facebook", Icon: Facebook },
];

const LIKE_KEY = "vr_liked";

export default function Footer({ profile, authed }) {
  const [liked, setLiked] = useState(false);
  const [followOpen, setFollowOpen] = useState(false);
  const followRef = useRef(null);

  useEffect(() => {
    setLiked(localStorage.getItem(LIKE_KEY) === "1");
  }, []);

  useEffect(() => {
    function onClickOutside(e) {
      if (followRef.current && !followRef.current.contains(e.target)) setFollowOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function toggleLike() {
    const next = !liked;
    setLiked(next);
    localStorage.setItem(LIKE_KEY, next ? "1" : "0");
  }

  const followLinks = FOLLOW_PLATFORMS
    .map((p) => ({ ...p, href: safeHref(profile?.[p.key]) }))
    .filter((p) => p.href);

  const contactEmail = profile?.contactEmail;
  const mailHref = contactEmail ? `mailto:${contactEmail}` : null;

  return (
    <footer className="px-5 sm:px-8 md:px-10 py-6 md:py-8 border-t border-line">
      <div className="flex flex-wrap items-center justify-between gap-6 mb-4">
        <span className="font-display text-xs">
          VIN<span className="text-mag">_</span>REDEEMER
        </span>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLike}
            className={`flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide px-3 py-1.5 rounded-full border transition ${
              liked ? "border-mag text-mag" : "border-lineb text-txd hover:text-mag hover:border-mag"
            }`}
            aria-pressed={liked}
          >
            <Heart size={13} fill={liked ? "currentColor" : "none"} />
            {liked ? "Liked" : "Like"}
          </button>

          {followLinks.length > 0 && (
            <div className="relative" ref={followRef}>
              <button
                onClick={() => setFollowOpen((o) => !o)}
                className={`flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide px-3 py-1.5 rounded-full border transition ${
                  followOpen ? "border-cyan text-gray-100" : "border-lineb text-txd hover:text-cyan hover:border-cyan"
                }`}
                aria-expanded={followOpen}
              >
                <UserPlus size={13} /> Follow
              </button>

              {followOpen && (
                <div className="absolute right-0 bottom-full mb-2 flex items-center gap-2 p-2 rounded-full border border-line bg-panel shadow-lg">
                  {followLinks.map((p) => (
                    <a
                      key={p.key}
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={p.label}
                      onClick={() => setFollowOpen(false)}
                      className="w-9 h-9 flex items-center justify-center rounded-full border border-lineb text-txd hover:text-cyan hover:border-cyan transition"
                    >
                      <p.Icon size={16} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {mailHref && (
        <div className="mb-4">
          <a href={mailHref} className="flex items-center gap-2 font-mono text-xs text-txd hover:text-cyan w-fit">
            <Mail size={13} /> {contactEmail}
          </a>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-txf">
        <span>© {new Date().getFullYear()} Vin Redeemer</span>
        <span>{authed ? "Signed in as admin" : "Public view"}</span>
      </div>
    </footer>
  );
}
