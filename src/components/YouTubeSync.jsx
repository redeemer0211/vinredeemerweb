import { useState } from "react";
import { RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import Btn from "./Btn.jsx";
import Field, { inputClass } from "./Field.jsx";
import { fetchChannelUploads } from "../lib/youtubeApi.js";
import { parseYouTubeId } from "../lib/youtube.js";
import { loadValue, saveValue } from "../lib/storage.js";

export default function YouTubeSync({ videos, setVideos }) {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => loadValue("vr_yt_api_key", ""));
  const [channel, setChannel] = useState(() => loadValue("vr_yt_channel", ""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function handleSync(e) {
    e.preventDefault();
    setError(""); setResult(null); setLoading(true);
    saveValue("vr_yt_api_key", apiKey);
    saveValue("vr_yt_channel", channel);
    try {
      const fetched = await fetchChannelUploads({ apiKey, channelInput: channel, maxVideos: 50 });
      const existingIds = new Set(videos.map((v) => parseYouTubeId(v.url)).filter(Boolean));
      const fresh = fetched.filter((v) => !existingIds.has(v.videoId));

      setVideos((list) => [
        ...fresh.map((v) => ({
          id: "yt_" + v.videoId,
          title: v.title,
          url: `https://www.youtube.com/watch?v=${v.videoId}`,
          tag: "",
          desc: v.desc,
        })),
        ...list,
      ]);
      setResult({ added: fresh.length, skipped: fetched.length - fresh.length });
    } catch (err) {
      setError(err.message || "Something went wrong reaching YouTube.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg mb-9 bg-panel border border-line overflow-hidden">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between px-5 py-4 font-mono text-sm text-cyan">
        <span className="flex items-center gap-2"><RefreshCw size={14} /> Sync from YouTube</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <form onSubmit={handleSync} className="px-5 pb-5">
          <p className="font-mono text-[11px] text-txf mb-4 leading-relaxed">
            Pulls your uploads playlist directly (cheap reads, no search calls).
            Your API key stays in this browser only — it's never part of the
            site's public code. Get a key from Google Cloud Console → APIs &amp;
            Services → Credentials, with the YouTube Data API v3 enabled, and
            restrict it by HTTP referrer to your domain.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="YouTube API key">
              <input type="password" className={inputClass} value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="AIza…" />
            </Field>
            <Field label="Channel handle or ID">
              <input className={inputClass} value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="@vin_redeemer or UC…" />
            </Field>
          </div>
          {error && <p className="font-mono text-xs mb-3 text-mag">{error}</p>}
          {result && (
            <p className="font-mono text-xs mb-3 text-cyan">
              Added {result.added} new video{result.added === 1 ? "" : "s"}
              {result.skipped ? ` (${result.skipped} already here, skipped).` : "."}
            </p>
          )}
          <Btn variant="primary" type="submit" disabled={loading}>
            <RefreshCw size={14} /> {loading ? "Syncing…" : "Sync now"}
          </Btn>
        </form>
      )}
    </div>
  );
}
