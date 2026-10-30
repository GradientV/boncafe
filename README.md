# Bon Café et Restaurant

Website for **Bon Café et Restaurant**, the neighborhood café at 41-31 Queens Blvd (at 42nd St), Sunnyside, Queens: Korean comfort food, all-day breakfast, healthy bowls, sandwiches, smoothies and lattes.

TypeScript · Vite 8 · Tailwind CSS 4 · no framework · every page is static HTML

Designed & built by [GradientV](https://gradientv.com).

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:5177.

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server. Editing a template or data file restarts it and the page reloads |
| `npm run build` | Type-check, then build every page into `dist/` |
| `npm run preview` | Serve the built `dist/` at http://localhost:4177 |
| `npm run lint` | oxlint |
| `npm run typecheck` | `tsc -b` |
| `npm run images` | Turn the originals in `images-raw/` into web-ready WebP in `public/images/` (see Photos) |
| `npm run brand` | Regenerate the favicon, app icons and the social share image |

Needs Node 22.18 or newer (the scripts in `scripts/` are TypeScript run directly by Node).

## Design

Formal and photo-led, in the spirit of The Smith and Carnegie Diner & Café: a black header bar with a wide-tracked **BON CAFÉ / ET RESTAURANT** wordmark, full-bleed photography, square corners everywhere (no pills), and uppercase tracked labels.

- **Fonts:** Jost (nav, buttons, labels, body) and Barlow Condensed (headlines), self-hosted via Fontsource.
- **Colors** (tokens in `src/styles.css`): ink `#161310`, white, bone `#f5f1eb` for alternating sections, and one accent, Bon red `#b3261e`, for labels and primary actions.
- **Buttons:** rectangles with tracked uppercase text: `btn-dark`, `btn-red`, `btn-outline`, `btn-light`, `btn-outline-light`.

## How it's built

There's no React. Pages are written as TypeScript template functions and rendered to plain HTML by a small Vite plugin, so the built site is fast, static and easy for Google to read. A little TypeScript runs in the browser for the interactive parts.

```
index.html, menu.html, …     thin shells with <!--bon:head--> and <!--bon:body--> slots
build/bon-pages.ts           the Vite plugin: fills the shells, clean URLs in dev,
                             sitemap/robots/llms.txt/manifest in the build
src/data/                    all the content (see below)
src/templates/               the pages and the shared layout (run at build time)
src/client/main.ts           browser code for every page: slideshow, mobile menu, order dropdown, open/closed line
src/client/menu.ts           browser code for /menu: search, filters, section bar
src/lib/                     shared helpers (hours math, the html`` template tag)
src/styles.css               Tailwind + brand tokens and a few components
```

## Pages

| Route | What's on it |
| --- | --- |
| `/` | Photo slideshow, welcome, Breakfast / Korean classics / Coffee bar sections, house favorites, guest reviews, order online, stay a while, visit (hours, contact, map) |
| `/menu` | Every dish with prices, sticky section bar, search, Korean / Spicy / Meatless filters, allergy note |
| `/privacy`, `/accessibility` | Policies |
| `404` | "Page not found" |

`/about`, `/contact`, `/hours`, `/order`, `/coffee`, `/drinks` and a few others redirect to the right place (`vercel.json`).

## Updating content

Everything the café might change lives in `src/data/`. No template edits needed.

- **`site.ts`**: name, address, phone, **hours**, links (Instagram, Grubhub, DoorDash, maps), Google rating, printing prices, and `SITE_URL`. The open/closed line, hours tables, footer, structured data and llms.txt all read from here.
- **`menu.ts`**: every section and dish (name, description, price, tags) and the home-page house favorites. Leave a `price` out to hide it; `priceNote` shows instead (e.g. "Ask us").
- **`photos.ts`**: every photo: file, alt text, crop point and credit. `HERO_SLIDES` sets the slideshow order.
- **`reviews.ts`**: the quotes in the reviews band.
- **`pages.ts`**: page titles and descriptions for Google and link previews.

### Open / closed line

Worked out in **New York time**, so it's right for anyone, anywhere: "Open now · until 7 PM", "Closing soon", "Closed now · opens tomorrow 7:30 AM". Today's row in the hours table is highlighted. Before the script runs it reads "Open daily from 7:30 AM".

### Seasonal bits

Anything with `data-season="9-11"` only shows from September through November (New York time). The "In season · Pumpkin chocolate fudge latte" note in the coffee section uses it.

## Photos

**Only one photo is the café's own** (the bulgogi bowl, from their DoorDash store). The rest are **free stock placeholders from Unsplash** (Unsplash License: free for commercial use, no attribution required), chosen to match dishes they actually serve. Replace them with Bon Café's own photos before launch; `src/data/photos.ts` marks each one with `source: 'bon-cafe' | 'unsplash'`.

To add or replace a photo:

1. Put the original (`.jpg`, `.png` or `.webp`) in `images-raw/`. That folder is git-ignored; nothing is deleted.
2. Run `npm run images`. It writes `public/images/<name>.webp` (up to 2000 px) and `<name>-sm.webp` (up to 900 px for phones), and updates `src/data/image-sizes.ts` so every image gets the right width and height.
3. Point an entry in `src/data/photos.ts` at the new file name, with alt text and a credit. Use `focus` (e.g. `'50% 60%'`) to steer the crop.

Every `<img>` gets a phone-sized and a desktop-sized version, width and height (no layout jump), and lazy loading below the fold. The first slide is preloaded; the other slides load right after it.

## SEO and sharing

- Each page has its own title, description, canonical link and Open Graph / Twitter tags.
- Structured data (`src/templates/schema.ts`): `CafeOrCoffeeShop` + `Restaurant` with address, geo, hours, phone and menu link; the menu page adds a full `Menu` with prices.
- `sitemap.xml`, `robots.txt`, `llms.txt` and `site.webmanifest` are generated in the build from the same data.
- The share image `public/og-image.jpg` (`npm run brand`) uses Bon Café's own photo with the wordmark.

## Accessibility

Skip link, real headings for every menu section and dish, a native `<dialog>` for the mobile menu (focus stays inside, Escape closes it), keyboard-friendly order dropdown (Escape closes it), visible focus outlines, AA contrast, and a pause button on the slideshow, which stays still when "reduce motion" is on.

## Deploying (Vercel)

Import the repo. `vercel.json` sets the build (`npm run build` → `dist`), clean URLs, redirects, security headers (including a Content-Security-Policy that allows only the Google Maps embed) and caching. Turn on Vercel Web Analytics in the project; the script is already in each page (it 404s on localhost, which is expected).

### Before launch

- [ ] **Replace the Unsplash placeholder photos** with Bon Café's own (or book a shoot). See `src/data/photos.ts`.
- [ ] Buy the domain and set `SITE_URL` in `src/data/site.ts`, then rebuild.
- [ ] Go through **Confirm with the client** in `RESEARCH.md` (hours, phone, prices, drink prices, the Japanese and Korean entrée sections).
- [ ] Add the website to their Google Business Profile, Grubhub/DoorDash pages and Instagram bio.

## Credits

- Fonts: Jost and Barlow Condensed (SIL Open Font License), self-hosted via Fontsource.
- Icons: Lucide (ISC).
- Photos: bulgogi bowl by Bon Café et Restaurant. Placeholders from Unsplash by David B Townsend (avocado toast), Dmitry Pavlovsky (bibimbap), Fahmi Fakhrudin (latte pour), Hyeryeong Song (dining room), Luis Covarrubias (croissant sandwich), nameless 3791 (latte), Lala Azizli (strawberry matcha), Petr Sevcovic (café tables), Marcin Skalij (tteokbokki), Jakub Kapusnak (Korean table), Jimmy Hu (7 train) and Demi DeHerrera (iced latte).
