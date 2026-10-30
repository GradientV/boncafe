// privacy, accessibility and the 404 page
import { PHOTOS } from '../data/photos.ts';
import { site } from '../data/site.ts';
import { html, type SafeHtml } from '../lib/html.ts';
import type { PageRender } from './layout.ts';
import { photo } from './photo.ts';
import { businessSchema } from './schema.ts';

const UPDATED = 'October 30, 2026';

function prose(label: string, title: string, body: SafeHtml): SafeHtml {
    return html`<section class="bg-ink text-white">
            <div class="wrap py-20 text-center md:py-28">
                <p class="label label-center label-light">${label}</p>
                <h1 class="mt-8 text-[clamp(3.2rem,8vw,5.5rem)]">${title}</h1>
                <p class="mt-5 text-[0.68rem] font-medium uppercase tracking-[0.28em] text-white/60">Last updated ${UPDATED}</p>
            </div>
        </section>
        <article class="wrap max-w-3xl py-16 md:py-24">
            <div
                class="space-y-5 text-[1.06rem] leading-[1.85] text-muted [&_a]:text-ink [&_a]:underline [&_a]:decoration-red [&_a]:underline-offset-4 [&_h2]:pt-8 [&_h2]:text-[2rem] [&_h2]:text-ink [&_li]:pl-1 [&_strong]:font-medium [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6"
            >
                ${body}
            </div>
        </article>`;
}

export function privacyPage(): PageRender {
    return {
        key: 'privacy',
        jsonLd: [businessSchema()],
        main: prose(
            'The fine print',
            'Privacy',
            html`<p><strong>In short:</strong> this website doesn’t ask for your name, email or payment details, and it doesn’t use advertising or tracking cookies.</p>
                <h2>What this site collects</h2>
                <p>
                    There are no forms, accounts or newsletters on this site. If anonymous visit statistics are turned on, they come from Vercel Web Analytics, which counts page
                    views without cookies and without identifying you.
                </p>
                <p>The menu page’s search box and filters run entirely in your browser. Nothing you type is sent anywhere.</p>
                <h2>Other companies’ services</h2>
                <ul>
                    <li><strong>Google Maps.</strong> The map on our home page is loaded from Google, which may set its own cookies. Google’s privacy policy applies.</li>
                    <li><strong>Ordering.</strong> Grubhub and DoorDash links take you to those companies’ sites; their privacy policies apply to your order.</li>
                    <li><strong>Instagram.</strong> Links to our Instagram open Instagram, which has its own privacy policy.</li>
                </ul>
                <h2>Questions</h2>
                <p>
                    Call us at <a href="${site.phone.href}">${site.phone.display}</a> or stop by ${site.address.street} in ${site.address.locality}. We’ll update this page if
                    anything changes.
                </p>`
        )
    };
}

export function accessibilityPage(): PageRender {
    return {
        key: 'accessibility',
        jsonLd: [businessSchema()],
        main: prose(
            'Everyone’s welcome',
            'Accessibility',
            html`<p>We want everyone to be able to read our menu, find our hours and get to our door. This site aims to meet the WCAG 2.2 AA guidelines.</p>
                <h2>On this website</h2>
                <ul>
                    <li>Every page works with a keyboard, and there’s a “Skip to content” link at the top.</li>
                    <li>Text and buttons meet contrast guidelines, and the site works when you zoom in to 200%.</li>
                    <li>The menu uses real headings and text (not pictures of a menu), so screen readers can read every dish and price.</li>
                    <li>The photo slideshow on the home page has a pause button, and it stays still if your device is set to reduce motion.</li>
                </ul>
                <h2>At the café</h2>
                <ul>
                    <li>Wheelchair-accessible entrance, seating and restroom.</li>
                    <li>We’re happy to read the menu aloud or help with an order. Just ask.</li>
                </ul>
                <h2>Something not working?</h2>
                <p>
                    If any part of this site is hard to use, please call <a href="${site.phone.href}">${site.phone.display}</a> and tell us which page and what happened. We’ll fix
                    it, and we’ll help you with your order in the meantime.
                </p>
                <p>The map and the ordering services are run by other companies, so we can’t always fix problems inside them, but we’ll pass your feedback along.</p>`
        )
    };
}

export function notFoundPage(): PageRender {
    return {
        key: 'notFound',
        main: html`<section class="relative grid min-h-[78vh] place-items-center overflow-hidden bg-ink py-24 text-center text-white">
            ${photo(PHOTOS.lattePour, { sizes: '100vw', className: 'absolute inset-0 size-full opacity-30', decorative: true })}
            <div class="wrap relative max-w-2xl">
                <p class="label label-center label-light">Error 404</p>
                <h1 class="mt-8 text-[clamp(3rem,8vw,5.5rem)]">Page Not Found</h1>
                <p class="mt-6 text-[1.06rem] font-light leading-relaxed text-white/85">The page you’re looking for has moved or no longer exists.</p>
                <div class="mt-10 flex flex-wrap justify-center gap-3">
                    <a class="btn btn-light" href="/">Back to home</a>
                    <a class="btn btn-outline-light" href="/menu">View menu</a>
                </div>
            </div>
        </section>`
    };
}
