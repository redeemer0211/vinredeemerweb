/*
  Uses only videos.list-cost-tier endpoints (channels.list, playlistItems.list
  — 1 unit each) instead of search.list (100 units, and rate-limited to its
  own ~100-calls/day bucket as of the June 2026 quota split). Fetching a
  channel's entire uploads playlist this way costs roughly 1 unit per 50
  videos, so even a large channel is cheap to sync.
*/

const API_BASE = "https://www.googleapis.com/youtube/v3";

export async function fetchChannelUploads({ apiKey, channelInput, maxVideos = 50 }) {
  if (!apiKey?.trim()) throw new Error("Add your YouTube API key first.");
  if (!channelInput?.trim()) throw new Error("Add your channel handle or ID.");

  const cleaned = channelInput.trim();
  const channelsUrl = new URL(`${API_BASE}/channels`);
  channelsUrl.searchParams.set("part", "contentDetails");
  channelsUrl.searchParams.set("key", apiKey.trim());

  if (/^UC[\w-]{20,}$/.test(cleaned)) {
    channelsUrl.searchParams.set("id", cleaned);
  } else {
    channelsUrl.searchParams.set("forHandle", cleaned.replace(/^@/, ""));
  }

  const chRes = await fetch(channelsUrl);
  const chData = await chRes.json();
  if (!chRes.ok) throw new Error(chData?.error?.message || "Couldn't look up that channel.");
  const channel = chData.items?.[0];
  if (!channel) throw new Error("No channel found for that handle or ID.");

  const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsPlaylistId) throw new Error("That channel doesn't expose an uploads playlist.");

  const results = [];
  let pageToken = "";
  while (results.length < maxVideos) {
    const plUrl = new URL(`${API_BASE}/playlistItems`);
    plUrl.searchParams.set("part", "snippet");
    plUrl.searchParams.set("playlistId", uploadsPlaylistId);
    plUrl.searchParams.set("maxResults", "50");
    plUrl.searchParams.set("key", apiKey.trim());
    if (pageToken) plUrl.searchParams.set("pageToken", pageToken);

    const plRes = await fetch(plUrl);
    const plData = await plRes.json();
    if (!plRes.ok) throw new Error(plData?.error?.message || "Couldn't fetch uploads.");

    const items = (plData.items || [])
      .map((it) => ({
        videoId: it.snippet?.resourceId?.videoId,
        title: it.snippet?.title || "Untitled",
        desc: (it.snippet?.description || "").slice(0, 220),
        publishedAt: it.snippet?.publishedAt,
      }))
      .filter((v) => v.videoId && v.title !== "Private video" && v.title !== "Deleted video");

    results.push(...items);
    pageToken = plData.nextPageToken;
    if (!pageToken) break;
  }

  return results.slice(0, maxVideos);
}
