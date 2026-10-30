// the /menu page. search, filters and the section bar live in src/client/menu.ts
import { MENU, TAG_LABELS, formatPrice, itemId, type MenuItem, type MenuSection, type Tag } from '../data/menu.ts';
import { PHOTOS } from '../data/photos.ts';
import { site } from '../data/site.ts';
import { html, type SafeHtml } from '../lib/html.ts';
import { icon } from './icons.ts';
import { statusLine, type PageRender } from './layout.ts';
import { photo } from './photo.ts';
import { businessSchema, menuSchema } from './schema.ts';

const FILTERS: Tag[] = ['korean', 'spicy', 'meatless'];

/** lowercase, accent-free text the search box matches against */
const searchText = (section: MenuSection, item: MenuItem): string =>
    `${item.name} ${item.description ?? ''} ${section.title}`
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase();

function notes(item: MenuItem): string {
    return [item.favorite && 'House favorite', item.seasonal && 'Seasonal', ...(item.tags ?? []).map((t) => TAG_LABELS[t])].filter(Boolean).join(' · ');
}

function menuItem(section: MenuSection, item: MenuItem): SafeHtml {
    const price = section.price ? '' : formatPrice(item, section);
    const tagLine = notes(item);
    return html`<li
        id="${itemId(section, item)}"
        class="menu-item -mx-4 scroll-mt-16 px-4 py-2"
        data-item
        data-kind="${section.kind}"
        data-tags="${(item.tags ?? []).join(' ')}"
        data-search="${searchText(section, item)}"
    >
        <div class="flex items-baseline gap-3">
            <h3 class="text-[0.92rem] font-medium uppercase leading-snug tracking-[0.13em] text-ink">${item.name}</h3>
            ${price ? html`<span class="leader" aria-hidden="true"></span><span class="shrink-0 text-[0.92rem] font-medium tabular-nums text-ink">${price}</span>` : ''}
        </div>
        ${item.description ? html`<p class="mt-1.5 leading-relaxed text-muted">${item.description}</p>` : ''}
        ${tagLine ? html`<p class="mt-2 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-red">${tagLine}</p>` : ''}
    </li>`;
}

function menuSection(section: MenuSection): SafeHtml {
    const unpriced = section.kind === 'drinks' && !section.price && section.items.every((i) => i.price === undefined);
    return html`<section id="${section.id}" class="scroll-mt-12" aria-labelledby="h-${section.id}" data-menu-section>
        <header class="text-center">
            <h2 id="h-${section.id}" class="text-[clamp(2.2rem,4.4vw,3.3rem)]">${section.title}</h2>
            ${section.blurb ? html`<p class="mt-3 font-light italic text-muted">${section.blurb}</p>` : ''}
            <span class="mx-auto mt-6 block h-px w-14 bg-red" aria-hidden="true"></span>
        </header>
        <ul class="mt-12 grid gap-x-16 gap-y-7 md:grid-cols-2">
            ${section.items.map((item) => menuItem(section, item))}
        </ul>
        ${unpriced ? html`<p class="mt-8 text-center text-[0.68rem] font-medium uppercase tracking-[0.24em] text-muted">Ask at the counter for sizes and prices</p>` : ''}
    </section>`;
}

function banner(): SafeHtml {
    return html`<section class="relative overflow-hidden bg-ink text-white" aria-labelledby="menu-title">
        ${photo(PHOTOS.koreanTable, { sizes: '100vw', className: 'absolute inset-0 size-full opacity-55', eager: true, decorative: true })}
        <div class="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/45 to-ink/85" aria-hidden="true"></div>
        <div class="wrap relative py-24 text-center md:py-32">
            <p class="label label-center label-light">Breakfast · Lunch · Dinner</p>
            <h1 id="menu-title" class="mt-8 text-[clamp(4rem,11vw,7.5rem)] tracking-[0.06em]">Menu</h1>
            <p class="mx-auto mt-6 max-w-xl font-light leading-relaxed text-white/85">
                All-day breakfast, Korean favorites, healthy bowls, sandwiches, a little Japanese, coffee and smoothies. Prices are subject to change.
            </p>
            <div class="mt-9 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
                ${statusLine('text-white', '/#visit')}
                <a class="status text-white" href="${site.phone.href}">${icon('phone', 'size-3.5')} ${site.phone.display}</a>
            </div>
        </div>
    </section>`;
}

function sectionBar(): SafeHtml {
    return html`<div class="sticky top-16 z-30 border-t border-white/10 bg-ink lg:top-[5.5rem]" data-menu-bar>
        <nav aria-label="Menu sections" class="wrap overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" data-cat-nav>
            <ul class="flex w-max gap-8">
                ${MENU.map((section) => html`<li data-cat-for="${section.id}"><a class="cat-link" href="#${section.id}">${section.title}</a></li>`)}
            </ul>
        </nav>
    </div>`;
}

function tools(): SafeHtml {
    return html`<div class="border-b border-line">
        <div class="wrap flex flex-col gap-6 py-7 md:flex-row md:items-center md:justify-between">
            <label class="relative block md:w-96">
                <span class="sr-only">Search the menu</span>
                ${icon('search', 'pointer-events-none absolute left-0 top-1/2 size-4.5 -translate-y-1/2 text-muted')}
                <input
                    type="search"
                    class="w-full rounded-none border-0 border-b border-ink bg-transparent py-3 pl-8 pr-2 text-[1rem] text-ink placeholder:text-muted focus:border-red focus:outline-none"
                    placeholder="Search the menu (try “bulgogi”)"
                    autocomplete="off"
                    data-menu-search
                />
            </label>
            <div class="flex flex-wrap items-center gap-x-8 gap-y-3" role="group" aria-label="Show only">
                <span class="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-muted">Show only</span>
                ${FILTERS.map((tag) => html`<button type="button" class="menu-filter text-ink" aria-pressed="false" data-filter="${tag}">${TAG_LABELS[tag]}</button>`)}
            </div>
        </div>
    </div>`;
}

export function menuPage(): PageRender {
    const food = MENU.filter((s) => s.kind === 'food');
    const drinks = MENU.filter((s) => s.kind === 'drinks');
    return {
        key: 'menu',
        pageType: 'menu',
        jsonLd: [businessSchema(), menuSchema()],
        main: html`${banner()} ${sectionBar()} ${tools()}
            <p class="sr-only" aria-live="polite" data-menu-count></p>
            <div class="wrap py-16 md:py-24">
                <div class="border border-line px-6 py-12 text-center" data-menu-empty hidden>
                    <p class="font-display text-3xl font-semibold uppercase">Nothing matches that</p>
                    <p class="mt-3 text-muted">Try another word, or clear the search and filters.</p>
                    <button type="button" class="btn btn-dark btn-sm mt-7" data-menu-reset>Clear search &amp; filters</button>
                </div>
                <div class="space-y-24">${food.map(menuSection)}</div>
            </div>
            <div class="bg-bone py-20 md:py-28" data-drinks>
                <div class="wrap space-y-24">${drinks.map(menuSection)}</div>
            </div>
            <div class="wrap py-16 md:py-20">
                <aside class="mx-auto max-w-4xl border border-line p-8 text-center md:p-12" aria-labelledby="allergy-title">
                    <h2 id="allergy-title" class="text-[clamp(1.8rem,3vw,2.4rem)]">Allergies &amp; Dietary Needs</h2>
                    <p class="mx-auto mt-5 max-w-2xl leading-[1.8] text-muted">
                        Please tell us about any allergy when you order. Our kitchen works with eggs, dairy, wheat, soy, nuts, sesame, fish and shellfish.
                        <strong class="font-medium text-ink">Meatless</strong> means no meat or seafood is listed in the dish; kimchi and some sauces can contain fish or
                        shellfish, so please ask if you’re vegetarian or vegan.
                    </p>
                </aside>
            </div>`
    };
}
