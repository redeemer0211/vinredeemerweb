export const seedGames = [
  {
    id: "g1",
    title: "Elden Ring",
    image: "",
    tag: "Elden Ring",
    desc: "Currently on a no-summons Malenia run.",
    genres: ["Soulslike", "RPG"],
  },
  {
    id: "g2",
    title: "Valorant",
    image: "",
    tag: "Valorant",
    desc: "Climbing back to Immortal this split.",
    genres: ["FPS"],
  },
];

export const seedVideos = [
  {
    id: "v1",
    title: "Malenia, no summons — finally",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    tag: "Elden Ring",
    desc: "37 attempts. Worth it. Replace this with a real link.",
  },
  {
    id: "v2",
    title: "Immortal grind, ep. 4",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    tag: "Valorant",
    desc: "Clutch 1v3 on Bind. Replace this with a real link.",
  },
];

export const seedMerch = [
  {
    id: "m1",
    name: "Vin_Redeemer Logo Tee",
    image: "",
    price: "$28",
    link: "",
    desc: "Placeholder listing — replace the image and link with your real merch.",
  },
];

// Generic placeholder chibi stickers — not a personalized likeness, just a
// starting sheet so the page isn't empty. Swap these for your own art.
export const seedStickers = [
  { id: "s1", image: "/stickers/happy.svg", caption: "Happy" },
  { id: "s2", image: "/stickers/enthusiastic.svg", caption: "Let's go!" },
  { id: "s3", image: "/stickers/gaming.svg", caption: "Gaming" },
  { id: "s4", image: "/stickers/ramen.svg", caption: "Ramen break" },
  { id: "s5", image: "/stickers/chill.svg", caption: "Chill" },
  { id: "s6", image: "/stickers/sleepy.svg", caption: "Sleepy" },
  { id: "s7", image: "/stickers/determined.svg", caption: "Determined" },
  { id: "s8", image: "/stickers/sad.svg", caption: "Sad" },
];

export const defaultProfile = {
  youtube: "https://www.youtube.com/@vin_redeemer",
  youtubeFollowers: "",
  tiktok: "",
  tiktokFollowers: "",
  facebook: "",
  facebookFollowers: "",
};

export const defaultHeroDesc =
  "This is where I keep the games I'm actually grinding right now and the gameplay I've cut together from them. Pick a game, jump to the clips — no algorithm, no clutter, just the stuff I made.";

export const defaultAboutMe = {
  tags: ["Gunpla", "Gamer", "Hiker", "Traveller"],
  description:
    "Full-time gamer, part-time video editor. When I'm not recording, I'm usually deep in a boss fight, building a kit, out on a trail, or planning the next trip.",
  media: [],
};
