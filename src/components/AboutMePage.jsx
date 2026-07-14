import { useState } from "react";
import { User, Youtube } from "lucide-react";
import Pagination from "./Pagination.jsx";
import { safeImageSrc } from "../lib/sanitize.js";
import { parseYouTubeId } from "../lib/youtube.js";
import { useResponsiveValue } from "../lib/useViewport.js";

function MediaTile({ item }) {
  if (item.type === "video") {
    const id = parseYouTubeId(item.url);
    return (
      <div className="rounded-lg overflow-hidden bg-raised border border-line">
        <div className="relative aspect-video bg-black">
          {id ? (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${id}`}
              title={item.caption || "video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-txf">Couldn't read that link</div>
          )}
        </div>
        {item.caption && <div className="px-3 py-2 font-mono text-[11px] text-txd border-t border-line">{item.caption}</div>}
      </div>
    );
  }
  const img = safeImageSrc(item.url);
  return (
    <div className="rounded-lg overflow-hidden bg-raised border border-line">
      <div className="aspect-video bg-void flex items-center justify-center">
        {img ? (
          <img src={img} alt={item.caption || "photo"} className="w-full h-full object-cover" onContextMenu={(e) => e.preventDefault()} />
        ) : (
          <span className="font-mono text-xs text-txf">NO IMAGE</span>
        )}
      </div>
      {item.caption && <div className="px-3 py-2 font-mono text-[11px] text-txd border-t border-line">{item.caption}</div>}
    </div>
  );
}

export default function AboutMePage({ aboutMe, profileImage }) {
  const { tags = [], description = "", media = [] } = aboutMe || {};
  const cleanImage = safeImageSrc(profileImage);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = useResponsiveValue({ mobile: 2, tablet: 4, desktop: 4 });
  const totalPages = Math.max(1, Math.ceil(media.length / PAGE_SIZE));
  const pageItems = media.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <header className="px-5 sm:px-8 md:px-10 pt-8 sm:pt-10 md:pt-14 pb-5 md:pb-6 border-b border-line">
        <h1 className="font-display text-lg mb-2">About Me</h1>
        <p className="font-mono text-sm text-txd">The stuff that doesn't fit in a bio line.</p>
      </header>

      <section className="px-5 sm:px-8 md:px-10 py-6 md:py-10 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          {/* Left — photo + tags, stacked above description */}
          <div className="flex flex-col gap-6">
            <div className="rounded-lg p-6 bg-panel border border-line">
              <div className="w-32 sm:w-36 aspect-square rounded-full overflow-hidden bg-raised border border-lineb mx-auto">
                {cleanImage ? (
                  <img src={cleanImage} alt="Vin Redeemer" className="w-full h-full object-cover" onContextMenu={(e) => e.preventDefault()} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-dim/30 to-mag-dim/30">
                    <User size={32} className="text-txf" />
                  </div>
                )}
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-5">
                  {tags.map((t) => (
                    <span key={t} className="font-mono text-xs px-3 py-1.5 rounded-full border border-cyan-dim text-cyan">{t}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-lg p-6 bg-panel border border-line">
              <div className="font-mono font-semibold text-sm mb-4 text-cyan">Description</div>
              <p className="text-sm sm:text-base text-txd whitespace-pre-wrap">
                {description || "Nothing written yet."}
              </p>
            </div>
          </div>

          {/* Right — media gallery, matched to the combined height of the two cards on the left */}
          <div className="rounded-lg p-6 bg-panel border border-line h-full flex flex-col">
            <div className="font-mono font-semibold text-sm mb-4 text-cyan flex items-center gap-2">
              <Youtube size={14} className="text-txf" /> Photos & videos
            </div>
            {media.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center py-10 rounded border border-dashed border-lineb text-txd font-mono text-xs">
                Nothing uploaded yet.
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center">
                <div className="grid sm:grid-cols-2 gap-4">
                  {pageItems.map((item) => (
                    <MediaTile key={item.id} item={item} />
                  ))}
                </div>
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
