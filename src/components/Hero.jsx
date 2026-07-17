import { Gamepad2, Play, User, Youtube, Music2, Facebook } from "lucide-react";
import Btn from "./Btn.jsx";
import { safeImageSrc, safeHref } from "../lib/sanitize.js";

export default function Hero({ setPage, profileImage, heroDesc, profile }) {
  const cleanImage = safeImageSrc(profileImage);
  const socialLinks = [
    ...(profile?.youtube ? [{ id: "youtube", label: "YouTube", url: profile.youtube, Icon: Youtube }] : []),
    ...(profile?.tiktok ? [{ id: "tiktok", label: "TikTok", url: profile.tiktok, Icon: Music2 }] : []),
    ...(profile?.facebook ? [{ id: "facebook", label: "Facebook", url: profile.facebook, Icon: Facebook }] : []),
  ].filter((s) => safeHref(s.url));

  return (
    <section className="flex-1 relative overflow-hidden flex items-center px-5 sm:px-8 md:px-10 py-8 sm:py-12 md:py-16 border-b border-line">
      <div className="scanlines" />

      <div className="w-full grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-cyan">// Player Profile</span>
          <h1 className="font-display mt-3 mb-4 leading-relaxed text-[clamp(1.25rem,4vw,2.2rem)]">
            Hey, I'm <span className="text-cyan text-glow-cyan">Vin</span>.<br />
            I play the games, then I post the runs worth watching.
          </h1>
          <p className="mb-5 max-w-md text-base sm:text-lg text-txd">{heroDesc}</p>
          <div className="flex gap-3 sm:gap-4 flex-wrap mb-5">
            <Btn variant="primary" onClick={() => setPage("games")}>
              <Gamepad2 size={16} /> View my games
            </Btn>
            <Btn variant="ghost" onClick={() => setPage("videos")}>
              <Play size={16} /> Watch videos
            </Btn>
          </div>

          {socialLinks.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((s) => (
                <a key={s.id} href={safeHref(s.url)} target="_blank" rel="noopener noreferrer" title={s.label}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-lineb text-txd hover:text-cyan hover:border-cyan transition">
                  <s.Icon size={15} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="relative aspect-square w-full max-w-[220px] sm:max-w-xs md:max-w-sm mx-auto rounded-full overflow-hidden bg-panel border border-lineb shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          {cleanImage ? (
            <img src={cleanImage} alt="Vin Redeemer" className="w-full h-full object-cover" onContextMenu={(e) => e.preventDefault()} />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-cyan-dim/30 to-mag-dim/30">
              <User size={48} className="text-txf" />
              <span className="font-mono text-xs text-txf">NO PHOTO SET</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
