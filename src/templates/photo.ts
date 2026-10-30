// <img> for a photo from src/data/photos.ts: responsive srcset (phone + desktop sizes),
// width/height so nothing jumps while it loads, lazy unless it's the first thing on screen
import { photoSize, type Photo } from '../data/photos.ts';
import { cx, html, raw, type SafeHtml } from '../lib/html.ts';

const SMALL = 900;

/**
 * `eager`: the first thing on screen (loads first).
 * `soon`: loads right away but behind everything else (the later hero slides, so they're ready when they fade in).
 * otherwise lazy: loads as it scrolls into view.
 */
export function photo(
    p: Photo,
    opts: { sizes: string; className?: string; eager?: boolean; soon?: boolean; alt?: string; decorative?: boolean }
): SafeHtml {
    const { width, height } = photoSize(p);
    const smallWidth = Math.min(SMALL, width);
    const loading = opts.eager ? raw('fetchpriority="high"') : opts.soon ? raw('fetchpriority="low"') : raw('loading="lazy"');
    const focus = p.focus ? raw(` style="object-position:${p.focus}"`) : '';
    return html`<img
        src="/images/${p.file}.webp"
        srcset="/images/${p.file}-sm.webp ${smallWidth}w, /images/${p.file}.webp ${width}w"
        sizes="${opts.sizes}"
        width="${width}"
        height="${height}"
        alt="${opts.decorative ? '' : (opts.alt ?? p.alt)}"
        class="${cx('object-cover', opts.className)}"
        ${loading}
        decoding="async"${focus}
    />`;
}
