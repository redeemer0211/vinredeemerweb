# VIN_REDEEMER (React + Tailwind)

A real, runnable React project — the same gamer HUD/terminal site as the
plain HTML version, rebuilt as components with Tailwind utility classes.

**The site itself is public.** Anyone can view Home, Games, and Videos.
A "Login" button sits in the top-right of the navbar; clicking it opens a
modal. Only correct credentials unlock **admin mode** — that's what shows
the "+ Add game" / "+ Add video" buttons and the ✕ remove buttons on
cards. Everyone else just sees your content, read-only.

## Responsive layout — fitting the screen on PC, tablet, and phone

Every page now adapts its spacing, grid density, and (for paginated
pages) how much it shows per page based on device size:
- **Hero** fills exactly one screen's height below the navbar
  (`.screen-fit` in `src/index.css`, using `100dvh` so mobile browser
  chrome doesn't cause a false gap), so the landing view reads as a
  single screen rather than the top of a long scroll.
- **Other pages** get the same `.screen-fit` treatment as a minimum
  height, so a page with little content (an empty Merch or About page)
  still fills the screen instead of leaving the footer stranded near the
  top — but content that's actually long will still push past one screen,
  on purpose (see below).
- **Videos and the Sticker sheet** use an adaptive page size
  (`useResponsiveValue` in `src/lib/useViewport.js`): fewer cards per
  page on a phone (4 videos / 6 stickers), more on tablet, full-size on
  desktop (10 each). That keeps each individual page closer to fitting a
  small screen without much scrolling, while more content just becomes
  another page tap rather than one long scroll.
- **Grids** (Games, Merch, custom Cards pages) use a smaller minimum tile
  width so phones get 2 columns instead of 1 where the screen allows it,
  and the Profile page's 3-card row steps down to 2 columns on tablet
  before collapsing to 1 on phone.

**Being upfront about what this can't do:** "see everything, never
scroll" is only possible while the amount of content stays small. Once
you've added, say, 20 games or a full page of videos, there is more
content than any phone screen can show at readable size — at that point
the honest options are (a) let it scroll, which is what this does, (b)
shrink everything until it's illegible, or (c) hide some of it, which
directly contradicts "see every content." This update makes every page
adapt and use its space efficiently on every device, and keeps individual
pages of paginated content as screen-friendly as possible — but it does
not, and can't, eliminate scrolling once there's enough content to
justify it. That's normal, expected behavior for a site that's actually
being used and added to, not a bug.

## Run it

```bash
npm install
npm run dev
```

Then open the local URL it prints (usually `http://localhost:5173`).

To build for deployment:
```bash
npm run build
```
This outputs a static `dist/` folder you can host anywhere (Netlify,
Vercel, Cloudflare Pages, GitHub Pages).

## Project layout

```
index.html              Vite entry HTML, loads the Google Fonts
public/
  _headers               Netlify security headers (CSP, etc.) — applied on deploy, not in dev
  stickers/                8 placeholder chibi SVGs seeded into the sticker sheet
vercel.json              same headers, Vercel's format — delete whichever host you're not using
src/
  main.jsx               mounts <App />
  App.jsx                page switching + persistence + the custom-page system
  index.css              Tailwind directives + a few custom effect classes
  components/
    Navbar.jsx              centered nav: logo left, pages centered, admin controls right
    Hero.jsx                 read-only "about me" section + social icons — all edited on Profile
    LoginModal.jsx            admin sign-in, opened from the navbar's Login button
    NewPageModal.jsx           "New page" form, opened from Profile's Pages card
    GamesPage.jsx               game cards — tags/genres, filter bar, click through to videos
    VideosPage.jsx               video cards — own tags + inherited game tags, genre filter, YouTube sync
    GenreFilterBar.jsx            Any/Soulslike/FPS/RPG filter pills, shared by Games + Videos
    YouTubeSync.jsx               admin panel that pulls your uploads playlist into Videos
    GenericCardsPage.jsx          reusable card grid — powers Merch + custom "Cards" pages
    ProfilePage.jsx                Player Profile / Sticker sheet / Socials cards, About Me page editor, Pages
    AboutMePage.jsx                 public About page: hobbies, games, free time
    StickerSheet.jsx                embeddable sticker grid used inside Profile
    Pagination.jsx                   shared Prev/Next pager (Videos + Sticker sheet)
    Btn.jsx / Field.jsx             small shared UI pieces
  lib/
    auth.js                 salted + peppered credential hash check + session handling
    youtube.js               YouTube URL → video ID parsing (single video links)
    youtubeApi.js             YouTube Data API v3 client — channel lookup + uploads playlist paging
    genres.js                  the Any/Soulslike/FPS/RPG filter list + matching helper
    storage.js                 localStorage read/write helpers
    sanitize.js                 URL validation — blocks javascript:/data: links from becoming clickable
  data/
    seed.js                    starter content for games/videos/merch/stickers/profile
tailwind.config.js         theme: colors, fonts, glow shadows
```

## Pages

**Public, in the centered nav:** Home, Games, Videos, About, Merchandise (beta).
**Profile is hidden from visitors** — it only shows up for you, via the
gear icon next to Log out (top right, once signed in). It's not in the
nav, mobile menu, or anywhere a visitor would stumble onto it. Worth
knowing: like everything else in this client-only site, that's a UI
choice, not a hard security boundary — see the Security section below.

**Admin-created:** from the Profile page's **Pages** card (see below), add
more from two templates:
- **Cards** — an image/title/description grid with optional price + buy link
  (same shape as Merchandise). Good for anything catalog-like.
- **Videos** — a YouTube-embed grid (same shape as Videos, minus the sync panel).

New pages show up in the public nav immediately, for everyone — only
managing them (creating/deleting) is hidden inside Profile along with
everything else admin-only. There isn't a page template for Home/Hero — a
second hero wouldn't make sense on one site — but Cards and Videos cover
most other cases.

## Editing your photo, description, profile, and socials

All of it lives on the **Profile page** — sign in, click the gear icon
next to Log out, then Profile. The top of the page is **three cards side
by side** (stacked on smaller screens), with a tight 6px gap between them:

1. **Player Profile** — your circular hero photo (upload or URL) and the
   Hero section's description text.
2. **Sticker sheet** — see below.
3. **Socials** — YouTube, TikTok, and Facebook, each with a URL and an
   optional "Following" count you type in yourself (there's no live
   follower-count API wired up here — TikTok and Facebook don't offer a
   simple free one, and even YouTube's would need its own API key/quota
   just for a number, so this stays a plain editable text field, e.g.
   "12.4K"). These URLs also show up as small icon buttons in the **Hero
   section** on Home — configure them once here, they appear there automatically.

Below that row:
- **About Me page card** — hobbies, games you play, and a free-time blurb;
  this is what populates the public **About** page in the nav (see below).
- **Pages card** — create or delete custom pages.

The Home page's Hero section and the public About page just display
whatever's set here — neither has edit controls of its own.

## About page

A public page (`About` in the nav) laid out in two equal-width columns:
- **Left** — two stacked cards: your circular photo (same one set on
  Profile's Player Profile card) with identity/interest tags underneath
  (e.g. "Gunpla, Gamer, Hiker, Traveller"), then a photo/video gallery
  below it — paste an image URL, upload a file, or paste a YouTube link
  and it's auto-detected as a video embed. Shown a few at a time with
  Prev/Next paging, fewer per page on small screens.
- **Right** — a description paragraph about you, stretched to match the
  combined height of the two cards on the left.

All three are edited from the **About Me page** card on Profile.
If you had content saved under the old Hobbies/Games/Free-time fields
from before this layout changed, it's migrated automatically the first
time the page loads (`src/lib/aboutMe.js`) — Hobbies + Games merge into
Tags, Free-time becomes Description, nothing is lost. New installs just
get the defaults from `seed.js`.

## Stickers

The sticker sheet sits as its own card next to Player Profile / Socials
on the (hidden, admin-only-findable) Profile page — it's meant as a
personal asset library (forum replies, loading screens, wherever you need
a quick image link) rather than a public gallery. Every sticker has a
**"Copy"** button that copies its image URL to your clipboard. It shows
in a responsive grid (up to 5 columns), 10 at a time, with Prev/Next
paging underneath once you have more than that.

It ships with 8 generic placeholder chibi icons (`public/stickers/*.svg`)
so it isn't empty — flat vector placeholders, not a generated likeness of
you. There's no image-generation step in this project; to get real chibi
art of yourself, use an image generator (Midjourney, DALL·E, Ideogram,
etc.) or a commissioned artist, then upload the results via "+ Add
sticker" while signed in — URL or file upload both work.

## Games & Videos: tags/genres, editing, and filtering

Both game **and** video cards can carry any number of tags — genre,
playstyle, whatever ("Soulslike", "FPS", "Co-op", "100%'d") — added one
at a time in the add/edit form and shown as small pills on the card.
Existing cards are editable too: the pencil icon next to the ✕ on each
card reopens the same form pre-filled.

A video's *effective* tags are the union of its own tags and the tags of
whatever game it's linked to (via the "Game tag" field matching a game's
title) — so you can tag a video directly, tag its game once and let the
video inherit it, or both. Handy if a video doesn't cleanly belong to one
game, or you just don't want to tag every single upload individually.

Both pages show a filter bar — **Any / Soulslike / FPS / RPG** — above
the grid. (Custom "Videos" template pages skip the filter bar entirely,
since they aren't tied to a specific game.) Want different categories?
Edit `GENRE_FILTERS` in `src/lib/genres.js` — everything else adapts automatically.

Videos show **10 per page** with Prev/Next controls underneath, so the
grid doesn't turn into an endless scroll as you add more. Filtering by a
game tag (from the Games page) or by genre resets back to page 1.

## Pulling your videos from YouTube

On the Videos page, signed in, open **"Sync from YouTube"**. You'll need:
- A **YouTube Data API v3 key** — Google Cloud Console → APIs & Services →
  Credentials → Create Credentials → API key, with "YouTube Data API v3"
  enabled on that project. Free, no credit card. Restrict the key by HTTP
  referrer to your domain once deployed, so it can't be used from anywhere else.
- Your **channel handle** (the `@name` from your channel URL) or channel ID.

Hit "Sync now" and it pulls your uploads playlist directly — cheap reads
(`channels.list` + `playlistItems.list`, 1 unit each), not the expensive
`search.list` endpoint. Already-added videos are skipped automatically by
matching video IDs, so you can re-sync any time to pick up new uploads.
The key is stored only in your browser's local storage and used straight
from your own session — it's never part of the site's public code.

Unlike the chat preview, this version **persists your games, videos,
profile photo, and everything else in the browser's local storage**,
since it's a real app running in a real browser, not a sandboxed artifact.

## Changing your login

The credential hash is now **salted and peppered**, not just a plain
SHA-256 of `email:password` — see `src/lib/auth.js` for the full
explanation of what that actually buys you in a client-only app (short
version: the salt is a real improvement against precomputed rainbow
tables; the "pepper" can't be a true secret here since this file ships to
every visitor's browser, so treat it as a second fixed salt rather than
something an attacker can't see).

To change your email or password, run this in any browser console —
note the format now includes the salt and pepper:

```js
async function hash(s){
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
const SALT = 'f3a9c1e7b2d84f6a9c0e1b7d3a5f8c2e';   // must match src/lib/auth.js
const PEPPER = 'VIN_REDEEMER_PEPPER_2026';           // must match src/lib/auth.js
await hash(`${SALT}:youremail@example.com:YourNewPassword:${PEPPER}`);
```

Paste the result into `CRED_HASH` in `src/lib/auth.js`. If you also want
to change `SALT` or `PEPPER` themselves (fine to do, there's nothing
special about the current values), update them in `auth.js` too and
recompute the hash with the new values.

## Editing your info

Almost everything is editable on the site itself while signed in — Hero
photo/description/social links (via Profile), Profile, Games, Videos,
Merch, Stickers, and custom pages. The only things still in code:
- **Hero heading** ("Hey, I'm Vin...") — `src/components/Hero.jsx`
- **Default YouTube channel link** — `DEFAULT_CHANNEL_URL` at the top of `src/components/VideosPage.jsx`
- **Genre filter categories** — `GENRE_FILTERS` in `src/lib/genres.js`
- **Theme colors/fonts** — `tailwind.config.js`

## Security — what's real, what isn't

**What this project actually does:**
- **Link/script injection is blocked.** Any URL that ends up as a clickable
  link or image (video links, cover images, your profile photo) is checked
  in `src/lib/sanitize.js` before it's ever rendered. Only real `http(s)`
  links and `data:image/...` uploads are allowed — a `javascript:...` value
  typed into any field will not execute.
- **A Content-Security-Policy is set at the hosting level** (`public/_headers`
  for Netlify, `vercel.json` for Vercel) — this tells the *browser itself*
  to refuse to run inline scripts, load frames from anywhere but YouTube,
  or load images from unexpected origins, even if something slipped past
  the app's own checks. This only applies once deployed, not in `npm run dev`.
- **Text content is auto-escaped.** React escapes everything rendered via
  `{...}` by default (nothing in this codebase bypasses that with
  `dangerouslySetInnerHTML`), so a game description or video title can't
  inject HTML/scripts either.
- **Admin actions require a valid session**, so a visitor can't add, edit,
  or delete your cards without your password.
- **Production builds are minified** (`npm run build`) — variable and
  function names get shortened and the code is bundled, which makes
  casually reading the source meaningfully more tedious. It does not make
  it unreadable to someone who actually wants to.

**What isn't possible, for any website:**
- **Hiding your page's content from "Inspect Element."** A browser has to
  download your HTML/CSS/JS to display the page at all, which means that
  code is sitting in the visitor's browser the whole time. There is no
  setting, obfuscation trick, or library that changes this — it's true of
  every site on the internet, including banks. Right-click-blocking and
  DevTools-key-blocking scripts exist, but they don't stop DevTools from
  opening (there are several ways around both that don't involve a
  keyboard shortcut), and they make the site harder to use for legitimate
  visitors, including anyone relying on screen readers or browser
  extensions. This project disables right-click **only on images**, as a
  light "no casual save-as" nudge — it's cosmetic, not security, and you
  can delete that `useEffect` in `App.jsx` if it ever gets in the way.

## ⚠️ On the login being "secure"

Worth repeating from the HTML version: this is still a client-side-only
check. The password isn't stored in plain text, and failed logins get
routed to a 404-style screen without saying which field was wrong — but
because the check runs in the visitor's own browser, someone determined
could read the hash out of the built JS and try to crack it, or just strip
the check out of a build they control. That's true of any login without a
server behind it.

This is a solid "keep it off Google, keep casual visitors out" gate for a
personal project. For anything that really needs to stay locked down,
you'd want a real backend or an auth provider (Netlify Identity, Firebase
Auth, Cloudflare Access) validating requests server-side.
