// the parts every page shares: <head> tags, header, mobile navigation, footer, phone action bar
import { HOURS, NAV, SITE_URL, site } from '../data/site.ts';
import { PAGES, type PageKey } from '../data/pages.ts';
import { DISPLAY_ORDER, DAY_NAMES, formatSpan, groupWeek } from '../lib/hours.ts';
import { cx, html, raw, type SafeHtml } from '../lib/html.ts';
import { icon } from './icons.ts';
import { jsonLd } from './schema.ts';

export interface PageRender {
    key: PageKey;
    main: SafeHtml;
    jsonLd?: Record<string, unknown>[];
    /** images to preload (the first hero slide) */
    preload?: { href: string; srcset: string; sizes: string }[];
    /** marks the page for page-specific scripts, e.g. "menu" */
    pageType?: string;
}

const OG_ALT = 'Bon Café et Restaurant, Sunnyside, Queens';

/** what the open/closed line says before the browser works out the live status */
const STATIC_STATUS = 'Open daily from 7:30 AM';

function head(p: PageRender): SafeHtml {
    const meta = PAGES[p.key];
    const hidden = 'hidden' in meta && meta.hidden;
    const url = `${SITE_URL}${meta.path}`;
    return html`<title>${meta.title}</title>
    <meta name="description" content="${meta.description}" />
    ${hidden ? html`<meta name="robots" content="noindex" />` : html`<link rel="canonical" href="${url}" />`}
    <meta name="theme-color" content="#161310" />
    <meta name="format-detection" content="telephone=no" />
    <link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${site.name}" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:title" content="${meta.title}" />
    <meta property="og:description" content="${meta.description}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${SITE_URL}/og-image.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${OG_ALT}" />
    <meta name="twitter:card" content="summary_large_image" />
    ${(p.preload ?? []).map(
        (img) => html`<link rel="preload" as="image" href="${img.href}" imagesrcset="${img.srcset}" imagesizes="${img.sizes}" fetchpriority="high" />`
    )}
    ${(p.jsonLd ?? []).map((data) => html`<script type="application/ld+json">${raw(jsonLd(data))}</script>`)}`;
}

/** BON CAFÉ / ET RESTAURANT, set in wide-tracked capitals */
export function wordmark(size: 'sm' | 'lg' = 'sm'): SafeHtml {
    const big = size === 'lg';
    return html`<span class="block leading-none">
        <span class="${cx('block font-semibold tracking-[0.34em]', big ? 'text-[2rem]' : 'text-[1.25rem] lg:text-[1.55rem]')}">BON CAFÉ</span>
        <span class="${cx('mt-[0.45em] block font-normal tracking-[0.62em] opacity-80', big ? 'text-[0.8rem]' : 'text-[0.56rem] lg:text-[0.64rem]')}"
            >ET RESTAURANT</span
        >
    </span>`;
}

/** Live open/closed line. src/client/main.ts fills in the state and text. */
export function statusLine(extra = '', href = '/#visit'): SafeHtml {
    return html`<a href="${href}" class="${cx('status', extra)}" data-open-status>
        <span class="status-dot"></span><span data-status-text>${STATIC_STATUS}</span>
    </a>`;
}

/** Hours, one row per day, Monday first. Today's row is highlighted in the browser. */
export function hoursTable(extra = ''): SafeHtml {
    return html`<table class="${cx('w-full text-left', extra)}">
        <caption class="sr-only">Opening hours</caption>
        <tbody>
            ${DISPLAY_ORDER.map((day) => {
                const span = HOURS[day] ?? null;
                return html`<tr data-hours-day="${day}" class="border-b border-current/12 last:border-0">
                    <th scope="row" class="py-2.5 pr-4 font-normal"><span>${DAY_NAMES[day]}</span></th>
                    <td class="py-2.5 text-right tabular-nums">${span ? formatSpan(span) : 'Closed'}</td>
                </tr>`;
            })}
        </tbody>
    </table>`;
}

/** "Mon – Sat 7:30 AM – 7 PM · Sunday 7:30 AM – 5 PM" */
export const hoursSummary = (): string =>
    groupWeek(HOURS)
        .map((row) => `${row.days} ${row.hours}`)
        .join(' · ');

/** The three ways to order: used by the header dropdown, the mobile menu and the home page. */
export const ORDER_LINKS = [
    { label: 'Grubhub', href: site.links.grubhub, external: true },
    { label: 'DoorDash', href: site.links.doordash, external: true },
    { label: `Call ${site.phone.display}`, href: site.phone.href, external: false }
] as const;

function header(current: PageKey): SafeHtml {
    return html`<header class="sticky top-0 z-40 bg-ink text-white" data-header>
        <div class="wrap flex h-16 items-center justify-between gap-6 lg:h-[5.5rem]">
            <a href="/" class="text-white no-underline" aria-label="Bon Café et Restaurant, home">${wordmark()}</a>
            <div class="flex items-center gap-10">
                <nav aria-label="Main" class="hidden lg:block">
                    <ul class="flex items-center gap-9">
                        ${NAV.map(
                            (link) => html`<li>
                                <a class="nav-link" href="${link.href}" ${current === 'menu' && link.href === '/menu' ? raw('aria-current="page"') : ''}
                                    >${link.label}</a
                                >
                            </li>`
                        )}
                    </ul>
                </nav>
                <div class="relative hidden lg:block" data-dropdown>
                    <button type="button" class="btn btn-light btn-sm" aria-expanded="false" aria-controls="order-menu" data-dropdown-toggle>
                        Order online ${icon('chevron-down', 'size-3.5')}
                    </button>
                    <ul id="order-menu" class="absolute right-0 top-full mt-3 w-64 bg-white py-2 text-ink shadow-[0_18px_40px_-12px_rgb(0_0_0/0.45)]" hidden data-dropdown-panel>
                        ${ORDER_LINKS.map(
                            (link) => html`<li>
                                <a
                                    class="flex items-center justify-between px-6 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.2em] no-underline hover:bg-bone"
                                    href="${link.href}"
                                    ${link.external ? raw('target="_blank" rel="noopener"') : ''}
                                    >${link.label}${link.external ? icon('arrow-up-right', 'size-3.5 text-muted') : ''}</a
                                >
                            </li>`
                        )}
                    </ul>
                </div>
                <button type="button" class="grid size-11 place-items-center text-white lg:hidden" aria-controls="mobile-nav" aria-expanded="false" data-nav-open>
                    ${icon('menu', 'size-6')}<span class="sr-only">Open navigation</span>
                </button>
            </div>
        </div>
    </header>`;
}

function mobileNav(): SafeHtml {
    const links = [...NAV, { label: 'Order online', href: '/#order' }];
    return html`<dialog
        id="mobile-nav"
        class="m-0 h-dvh max-h-none w-full max-w-none bg-ink p-0 text-white backdrop:bg-black/50 open:animate-[nav-in_0.25s_ease-out]"
        aria-label="Site navigation"
    >
        <div class="flex h-full flex-col">
            <div class="wrap flex h-16 shrink-0 items-center justify-between">
                <a href="/" class="text-white no-underline" aria-label="Bon Café et Restaurant, home" data-nav-link>${wordmark()}</a>
                <button type="button" class="grid size-11 place-items-center text-white" data-nav-close>
                    ${icon('x', 'size-6')}<span class="sr-only">Close navigation</span>
                </button>
            </div>
            <nav class="wrap flex-1 overflow-y-auto pb-10" aria-label="Mobile">
                <ul class="border-t border-white/15">
                    ${links.map(
                        (link) => html`<li class="border-b border-white/15">
                            <a href="${link.href}" class="font-display block py-4 text-[2.4rem] font-semibold uppercase leading-none tracking-[0.03em] no-underline" data-nav-link
                                >${link.label}</a
                            >
                        </li>`
                    )}
                </ul>
                <div class="mt-10 space-y-5 text-[0.95rem] text-white/80">
                    ${statusLine('text-white', '/#visit')}
                    <p>${hoursSummary()}</p>
                    <p>
                        <a class="text-white underline-offset-4 hover:underline" href="${site.links.directions}" target="_blank" rel="noopener"
                            >${site.address.street}, ${site.address.locality}</a
                        ><br />${site.address.corner}
                    </p>
                    <p><a class="text-white underline-offset-4 hover:underline" href="${site.phone.href}">${site.phone.display}</a></p>
                </div>
                <div class="mt-8 grid grid-cols-2 gap-3">
                    <a class="btn btn-light btn-sm" href="${site.links.grubhub}" target="_blank" rel="noopener">Grubhub</a>
                    <a class="btn btn-outline-light btn-sm" href="${site.links.doordash}" target="_blank" rel="noopener">DoorDash</a>
                </div>
            </nav>
        </div>
    </dialog>`;
}

function footer(): SafeHtml {
    const explore = [...NAV, { label: 'Order online', href: '/#order' }, { label: 'Privacy', href: '/privacy' }, { label: 'Accessibility', href: '/accessibility' }];
    const heading = 'font-sans text-[0.68rem] font-medium uppercase tracking-[0.3em] text-white/55';
    const link = 'text-white/85 no-underline hover:text-white hover:underline underline-offset-4';
    return html`<footer class="bg-ink text-white">
        <div class="wrap grid gap-12 pt-20 pb-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_0.8fr]">
            <div class="max-w-sm">
                <a href="/" class="text-white no-underline" aria-label="Bon Café et Restaurant, home">${wordmark()}</a>
                <p class="mt-7 leading-relaxed text-white/70">Korean comfort food, all-day breakfast and specialty coffee on Queens Boulevard in Sunnyside, Queens.</p>
                <a class="mt-6 inline-flex items-center gap-2.5 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-white no-underline hover:text-white/75" href="${site.links.instagram}" target="_blank" rel="noopener">
                    ${icon('instagram', 'size-4')} ${site.links.instagramHandle}
                </a>
            </div>
            <div>
                <h2 class="${heading}">Visit</h2>
                <address class="mt-5 space-y-2 not-italic">
                    <a class="${cx('block', link)}" href="${site.links.directions}" target="_blank" rel="noopener"
                        >${site.address.street}<br />${site.address.locality}, ${site.address.region} ${site.address.postalCode}</a
                    >
                    <span class="block text-white/60">${site.address.corner}</span>
                    <a class="${cx('block', link)}" href="${site.phone.href}">${site.phone.display}</a>
                </address>
            </div>
            <div>
                <h2 class="${heading}">Hours</h2>
                <ul class="mt-5 space-y-2 text-white/85">
                    ${groupWeek(HOURS).map((row) => html`<li class="flex justify-between gap-4"><span>${row.days}</span><span class="tabular-nums">${row.hours}</span></li>`)}
                </ul>
            </div>
            <nav aria-label="Footer">
                <h2 class="${heading}">Explore</h2>
                <ul class="mt-5 space-y-2">
                    ${explore.map((item) => html`<li><a class="${link}" href="${item.href}">${item.label}</a></li>`)}
                </ul>
            </nav>
        </div>
        <div class="border-t border-white/10">
            <div class="wrap flex flex-col gap-2 pt-6 pb-24 text-[0.7rem] uppercase tracking-[0.16em] text-white/50 md:flex-row md:justify-between md:pb-7">
                <p>© ${new Date().getFullYear()} ${site.name}</p>
                <p>Designed &amp; built by <a class="text-white/80 no-underline hover:text-white" href="https://gradientv.com" target="_blank" rel="noopener">GradientV</a></p>
            </div>
        </div>
    </footer>`;
}

/** Call / Directions / Order, pinned to the bottom of the screen on phones */
function quickBar(): SafeHtml {
    const item = 'flex items-center justify-center gap-2 py-4 text-[0.68rem] font-medium uppercase tracking-[0.18em] no-underline';
    return html`<nav aria-label="Quick actions" class="fixed inset-x-0 bottom-0 z-30 bg-ink pb-[env(safe-area-inset-bottom)] text-white lg:hidden">
        <ul class="grid grid-cols-3 divide-x divide-white/15 border-t border-white/15">
            <li><a class="${item}" href="${site.phone.href}">${icon('phone', 'size-4')} Call</a></li>
            <li><a class="${item}" href="${site.links.directions}" target="_blank" rel="noopener">${icon('map-pin', 'size-4')} Directions</a></li>
            <li><a class="${cx(item, 'bg-red')}" href="/#order">${icon('shopping-bag', 'size-4')} Order</a></li>
        </ul>
    </nav>`;
}

/** The <head> tags and the <body> markup for one page. */
export function documentParts(p: PageRender): { head: string; body: string } {
    const body = html`<a class="skip-link" href="#main">Skip to content</a>
        ${header(p.key)} ${mobileNav()}
        <main id="main" tabindex="-1" ${p.pageType ? raw(`data-page="${p.pageType}"`) : ''}>${p.main}</main>
        ${footer()} ${quickBar()}`;
    return { head: head(p).toString(), body: body.toString() };
}
