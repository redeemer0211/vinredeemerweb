export function parseYouTubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace("/", "").split("/")[0] || null;
    }
    if (u.pathname.startsWith("/embed/")) {
      return u.pathname.split("/embed/")[1].split("/")[0] || null;
    }
    if (u.pathname.startsWith("/shorts/")) {
      return u.pathname.split("/shorts/")[1].split("/")[0] || null;
    }
    return u.searchParams.get("v");
  } catch {
    return null;
  }
}
