# Bon Café et Restaurant project memory

## Client and working agreement
- The user owns GradientV LLC (gradientv.com); Bon Café et Restaurant is a client project.
- The user runs `git add`, `git commit`, and `git push` personally. Do not stage, commit, or push unless the user explicitly asks.
- When asked for a commit message, return one concise, copyable line.
- Before suggesting `git add .`, remind the user to check `git status` for unrelated or private files.
- Make requested changes directly, then summarize what changed and what was checked. Explain issues in clear, practical language.
- Ask a short question when a client policy or business fact can't be safely inferred (hours, prices, owner details); keep working on independent parts meanwhile.

## Project details
- Client: Bon Café et Restaurant, 41-31 Queens Blvd (at 42nd St), Sunnyside, Queens. Owner: Shana Choi (per a 2022 interview; confirm).
- Purpose: marketing site with home (photo slideshow, welcome, food/coffee sections, house favorites, reviews, ordering links, hours, map) and a full menu page with search and filters, plus privacy and accessibility pages.
- Design direction (from the user): formal and photo-led like thesmithrestaurant.com and carnegiediner.com. Square corners everywhere, no pill shapes, no playful illustrations. Jost + Barlow Condensed; ink / white / bone with one red accent.
- Stack: TypeScript 6, Vite 8, Tailwind CSS 4 (`@tailwindcss/vite`, tokens in `src/styles.css`), no UI framework. Pages are TypeScript template functions (`src/templates/`) rendered to static HTML by `build/bon-pages.ts`. Hosted on Vercel (`vercel.json`).
- Content lives in `src/data/`; sources and open questions for the client are in `RESEARCH.md`. Facts must stay sourced; don't invent prices, hours or claims.
- Template strings use the `html` tag from `src/lib/html.ts`, which escapes by default; only pass trusted markup through `raw()`.
- Photos: originals in `images-raw/` (git-ignored) → `npm run images` → `public/images/*.webp` + `src/data/image-sizes.ts`; every photo is registered in `src/data/photos.ts` with alt text and credit. Only the bulgogi bowl is the café's own; the rest are Unsplash placeholders to replace before launch. Don't use Yelp/Google customer photos without permission, or stock photos that show another business's name.
- Brand assets (`public/favicon-32.png`, `apple-touch-icon.png`, `icon-*`, `og-image.jpg`) come from `npm run brand` and are committed.
- Custom CSS class names must not collide with Tailwind utilities (e.g. use `.menu-filter`, not `.filter`).
- Anything time-dependent (open/closed badge, today's hours row, seasonal notes) is computed in New York time in `src/client/main.ts`; the static HTML shows a neutral fallback.
- Checks before handing work back: `npm run lint`, `npm run build` (includes `tsc -b`), then look at the pages at phone and desktop widths.
- Footer credit stays: "Designed & built by GradientV".
