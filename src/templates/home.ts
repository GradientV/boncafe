// the home page
import { FAVORITES, MENU, findItem, formatPrice, itemId } from '../data/menu.ts';
import { HERO_SLIDES, PHOTOS, type Photo } from '../data/photos.ts';
import { REVIEWS } from '../data/reviews.ts';
import { site } from '../data/site.ts';
import { cx, html, type SafeHtml } from '../lib/html.ts';
import { icon, type IconName } from './icons.ts';
import { hoursTable, statusLine, type PageRender } from './layout.ts';
import { photo } from './photo.ts';
import { businessSchema } from './schema.ts';

const H2 = 'text-[clamp(2.5rem,5.2vw,4.25rem)]';
const BODY = 'text-[1.06rem] leading-[1.8] text-muted';

function hero(): SafeHtml {
    const slides = HERO_SLIDES.map((key) => PHOTOS[key]);
    return html`<section class="hero" aria-roledescription="carousel" aria-label="Photos of Bon Café" data-hero>
        <div class="absolute inset-0">
            ${slides.map(
                (p, i) => html`<div class="${cx('hero-slide', i === 0 && 'is-active')}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${slides.length}" data-slide>
                    ${photo(p, { sizes: '100vw', className: 'size-full', eager: i === 0, soon: i > 0, decorative: true })}
                </div>`
            )}
        </div>
        <div class="hero-shade" aria-hidden="true"></div>

        <div class="relative z-10 flex h-full flex-col items-center justify-center px-5 pb-10 text-center">
            <p class="label label-center label-light">Sunnyside · Queens</p>
            <h1 class="mt-8 leading-none">
                <span class="block text-[clamp(4.2rem,13vw,10rem)] tracking-[0.05em]">Bon Café</span>
                <span class="mt-3 block font-sans text-[clamp(0.8rem,1.8vw,1.15rem)] font-normal tracking-[0.62em]">et Restaurant</span>
            </h1>
            <p class="mt-8 max-w-xl text-[1.08rem] font-light leading-relaxed text-white/90 md:text-[1.2rem]">
                Korean comfort food, all-day breakfast and specialty coffee on Queens Boulevard.
            </p>
            <div class="mt-10 flex flex-wrap justify-center gap-3">
                <a class="btn btn-light" href="/menu">View menu</a>
                <a class="btn btn-outline-light" href="#order">Order online</a>
            </div>
        </div>

        <button type="button" class="hero-control absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 sm:grid lg:left-6" data-hero-prev>
            ${icon('chevron-left', 'size-8')}<span class="sr-only">Previous photo</span>
        </button>
        <button type="button" class="hero-control absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 sm:grid lg:right-6" data-hero-next>
            ${icon('chevron-right', 'size-8')}<span class="sr-only">Next photo</span>
        </button>

        <a href="#about" class="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 text-[0.68rem] font-medium uppercase tracking-[0.3em] text-white no-underline">
            Scroll for more ${icon('chevron-down', 'size-6')}
        </a>
        <div class="absolute bottom-7 right-4 z-10 hidden items-center gap-3 text-[0.68rem] font-medium tracking-[0.2em] text-white/85 sm:flex lg:right-8">
            <span data-hero-count>01 / ${String(slides.length).padStart(2, '0')}</span>
            <button type="button" class="hero-control size-10" aria-pressed="false" data-hero-pause>
                <span data-icon="pause">${icon('pause', 'size-4')}</span><span data-icon="play" hidden>${icon('play', 'size-4')}</span>
                <span class="sr-only">Pause the slideshow</span>
            </button>
        </div>
    </section>`;
}

function welcome(): SafeHtml {
    return html`<section id="about" class="py-24 md:py-32" aria-labelledby="about-title">
        <div class="wrap max-w-4xl text-center" data-reveal>
            <p class="label label-center">Welcome</p>
            <h2 id="about-title" class="${cx('mt-8', H2)}">Welcome to Bon Café</h2>
            <p class="mt-5 text-[0.72rem] font-medium uppercase tracking-[0.3em] text-muted">Est. ${site.founded} · Queens Blvd &amp; 42nd St</p>
            <div class="${cx('mx-auto mt-10 max-w-2xl space-y-5', BODY)}">
                <p>
                    Founded by ${site.owner} in ${site.founded}, Bon Café et Restaurant brings Korean and American cooking together on the corner of Queens Boulevard and 42nd
                    Street. Everything is made fresh and finished with sauces prepared in house, from breakfast through dinner.
                </p>
                <p>
                    Start the day with an omelette and a dirty chai, come back for bibimbap at lunch, or settle in for the afternoon with free Wi-Fi. We hire from the
                    neighborhood, because we want Sunnyside to grow with us.
                </p>
            </div>
            <div class="mt-11 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
                ${statusLine('text-ink')}
                <a class="text-link" href="/menu">View the menu ${icon('arrow-right', 'size-3.5')}</a>
            </div>
        </div>
    </section>`;
}

interface Split {
    id?: string;
    image: Photo;
    label: string;
    title: string;
    body: SafeHtml;
    actions: SafeHtml;
    extra?: SafeHtml;
    reverse?: boolean;
    tint?: boolean;
}

/** a full-bleed photo on one half, text on the other */
function split(s: Split): SafeHtml {
    return html`<section ${s.id ? html`id="${s.id}"` : ''} class="${cx(s.tint ? 'bg-bone' : 'bg-white')}" aria-label="${s.title}">
        <div class="grid lg:min-h-[42rem] lg:grid-cols-2">
            <div class="${cx('relative min-h-[22rem] sm:min-h-[28rem]', s.reverse && 'lg:order-2')}">
                ${photo(s.image, { sizes: '(min-width: 1024px) 50vw, 100vw', className: 'absolute inset-0 size-full' })}
            </div>
            <div class="flex items-center px-5 py-16 sm:px-12 md:py-20 lg:px-16 xl:px-24">
                <div class="max-w-lg" data-reveal>
                    <p class="label">${s.label}</p>
                    <h2 class="${cx('mt-6', H2)}">${s.title}</h2>
                    <div class="${cx('mt-6 space-y-4', BODY)}">${s.body}</div>
                    ${s.extra ?? ''}
                    <div class="mt-10 flex flex-wrap gap-3">${s.actions}</div>
                </div>
            </div>
        </div>
    </section>`;
}

function splits(): SafeHtml {
    const coffee = MENU.find((s) => s.id === 'coffee');
    const drinks = (coffee?.items ?? []).slice(0, 6).map((i) => i.name.replace(/ Latte$/, ''));
    return html`${split({
        image: PHOTOS.croissantSandwich,
        label: 'Served all day',
        title: 'Breakfast & Brunch',
        body: html`<p>
            Omelettes, eggs Benedict, avocado toast and eleven croissant sandwiches, served from the moment we open until we close. Omelettes come with home fries, plus
            toast or salad.
        </p>`,
        actions: html`<a class="btn btn-dark" href="/menu#breakfast">Breakfast menu</a>`
    })}
    ${split({
        image: PHOTOS.bulgogiBowl,
        label: 'From our kitchen',
        title: 'Korean Classics',
        body: html`<p>
            Bulgogi bibimbap crowned with a sunny-side-up egg, rosé tteokbokki, gochujang penne and bulgogi in everything from omelettes to paninis, each finished with Bon
            Café’s house-made sauces.
        </p>`,
        actions: html`<a class="btn btn-dark" href="/menu#bibimbap">Korean dishes</a><a class="btn btn-outline" href="/menu#japanese">Japanese lunch &amp; dinner</a>`,
        reverse: true,
        tint: true
    })}
    ${split({
        id: 'coffee',
        image: PHOTOS.strawberryMatcha,
        label: 'The coffee bar',
        title: 'Lattes, Teas & Smoothies',
        body: html`<p>
            Signature lattes, frappés, color-changing lemonades and ten fresh smoothies. Dine in and your drink arrives in a real cup.
        </p>`,
        extra: html`<p class="mt-8 text-[0.68rem] font-medium uppercase tracking-[0.26em] text-muted">Signature lattes</p>
            <ul class="mt-3 grid grid-cols-2 gap-x-8 border-t border-line text-[0.95rem]">
                ${drinks.map((d) => html`<li class="border-b border-line py-2.5 text-text">${d}</li>`)}
            </ul>
            <p class="mt-6 text-[0.72rem] font-medium uppercase tracking-[0.24em] text-red" data-season="9-11" hidden>In season · Pumpkin chocolate fudge latte</p>`,
        actions: html`<a class="btn btn-dark" href="/menu#coffee">Drinks menu</a>`
    })}`;
}

function favorites(): SafeHtml {
    return html`<section class="bg-bone py-24 md:py-32" aria-labelledby="favorites-title">
        <div class="wrap">
            <div class="text-center" data-reveal>
                <p class="label label-center">Signatures</p>
                <h2 id="favorites-title" class="${cx('mt-8', H2)}">House Favorites</h2>
            </div>
            <ul class="mx-auto mt-16 grid max-w-5xl gap-x-16 gap-y-10 md:grid-cols-2">
                ${FAVORITES.map((fav) => {
                    const { section, item } = findItem(fav.item);
                    return html`<li data-reveal>
                        <a class="group block no-underline" href="/menu#${itemId(section, item)}">
                            <span class="flex items-baseline gap-3">
                                <span class="text-[0.95rem] font-medium uppercase tracking-[0.14em] text-ink transition-colors group-hover:text-red">${item.name}</span>
                                <span class="leader" aria-hidden="true"></span>
                                <span class="text-[0.95rem] font-medium tabular-nums text-ink">${formatPrice(item, section)}</span>
                            </span>
                            <span class="mt-2 block leading-relaxed text-muted">${fav.blurb ?? item.description}</span>
                        </a>
                    </li>`;
                })}
            </ul>
            <div class="mt-16 text-center"><a class="btn btn-dark" href="/menu">View full menu</a></div>
        </div>
    </section>`;
}

function reviews(): SafeHtml {
    const [lead, ...rest] = REVIEWS;
    return html`<section id="reviews" class="relative overflow-hidden bg-ink py-28 text-white md:py-36" aria-labelledby="reviews-title">
        ${photo(PHOTOS.koreanTable, { sizes: '100vw', className: 'absolute inset-0 size-full opacity-40', decorative: true })}
        <div class="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/35 to-ink/80" aria-hidden="true"></div>
        <div class="wrap relative text-center">
            <p class="label label-center label-light" id="reviews-title">Guest reviews</p>
            ${lead
                ? html`<figure class="mx-auto mt-10 max-w-4xl" data-reveal>
                      <blockquote class="font-display text-[clamp(2.3rem,5.6vw,4.6rem)] font-semibold uppercase leading-[1.02] tracking-[0.02em]">“${lead.quote}”</blockquote>
                      <figcaption class="mt-8 text-[0.7rem] font-medium uppercase tracking-[0.3em] text-white/75">${lead.by} · ${lead.source}</figcaption>
                  </figure>`
                : ''}
            <div class="mx-auto mt-16 grid max-w-5xl gap-10 border-t border-white/20 pt-12 text-left md:grid-cols-3">
                ${rest.slice(0, 3).map(
                    (r) => html`<figure data-reveal>
                        <blockquote class="text-[1.02rem] leading-relaxed text-white/90">“${r.quote}”</blockquote>
                        <figcaption class="mt-4 text-[0.66rem] font-medium uppercase tracking-[0.26em] text-white/60">${r.by}</figcaption>
                    </figure>`
                )}
            </div>
            <div class="mt-14 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
                <p class="flex items-center gap-2.5 text-[0.72rem] font-medium uppercase tracking-[0.26em] text-white/85">
                    ${icon('star', 'size-4 fill-white text-white')} ${site.rating.value} on ${site.rating.source} · ${site.rating.count} reviews
                </p>
                <a class="btn btn-outline-light btn-sm" href="${site.links.googleReviews}" target="_blank" rel="noopener">Read reviews</a>
            </div>
        </div>
    </section>`;
}

function orderAndStay(): SafeHtml {
    const facts: { icon: IconName; title: string; body: string }[] = [
        { icon: 'wifi', title: 'Free Wi-Fi', body: 'For every guest, all day.' },
        {
            icon: 'printer',
            title: 'Print & copy',
            body: `${site.printing.firstPage} first page, ${site.printing.extraPage} after. Students ${site.printing.student}.`
        },
        { icon: 'armchair', title: 'Plenty of seats', body: 'Room to work, read or meet.' },
        { icon: 'train', title: 'By subway', body: '7 train to 40 St–Lowery St, two blocks away.' }
    ];
    const card = 'aspect-[4/3] overflow-hidden';
    const zoom = 'size-full transition-transform duration-700 ease-out hover:scale-[1.03]';
    return html`<section class="py-24 md:py-32" aria-label="Order online and stay a while">
        <div class="wrap grid gap-20 md:grid-cols-2 md:gap-10 lg:gap-16">
            <article id="order" class="scroll-mt-28" aria-labelledby="order-title" data-reveal>
                <div class="${card}">${photo(PHOTOS.tteokbokki, { sizes: '(min-width: 768px) 50vw, 100vw', className: zoom })}</div>
                <p class="label mt-10">Pickup &amp; delivery</p>
                <h2 id="order-title" class="mt-6 text-[clamp(2.3rem,4vw,3.4rem)]">Order Online</h2>
                <p class="${cx('mt-5', BODY)}">Order Bon Café for pickup or delivery through Grubhub or DoorDash, or call us at ${site.phone.display}.</p>
                <div class="mt-9 flex flex-wrap gap-3">
                    <a class="btn btn-dark" href="${site.links.grubhub}" target="_blank" rel="noopener">Grubhub ${icon('arrow-up-right', 'size-3.5')}</a>
                    <a class="btn btn-outline" href="${site.links.doordash}" target="_blank" rel="noopener">DoorDash ${icon('arrow-up-right', 'size-3.5')}</a>
                </div>
            </article>
            <article id="stay" aria-labelledby="stay-title" data-reveal>
                <div class="${card}">${photo(PHOTOS.cafeTables, { sizes: '(min-width: 768px) 50vw, 100vw', className: zoom })}</div>
                <p class="label mt-10">Stay a while</p>
                <h2 id="stay-title" class="mt-6 text-[clamp(2.3rem,4vw,3.4rem)]">Work, Study &amp; Gather</h2>
                <dl class="mt-7 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                    ${facts.map(
                        (f) => html`<div class="border-t border-line pt-4">
                            <dt class="flex items-center gap-2.5 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-ink">${icon(f.icon, 'size-4 text-red')} ${f.title}</dt>
                            <dd class="mt-2 leading-relaxed text-muted">${f.body}</dd>
                        </div>`
                    )}
                </dl>
            </article>
        </div>
    </section>`;
}

function visit(): SafeHtml {
    const heading = 'text-[0.68rem] font-medium uppercase tracking-[0.3em] text-white/55';
    const link = 'text-white underline-offset-4 hover:underline';
    return html`<section id="visit" class="bg-ink text-white [--today-color:#f2b8b1]" aria-labelledby="visit-title">
        <div class="relative h-[24rem] overflow-hidden md:h-[30rem]">
            ${photo(PHOTOS.sevenTrain, { sizes: '100vw', className: 'absolute inset-0 size-full' })}
            <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/5" aria-hidden="true"></div>
            <div class="wrap relative flex h-full flex-col justify-end pb-12">
                <p class="label label-light">Visit</p>
                <h2 id="visit-title" class="mt-6 text-[clamp(2.7rem,6.5vw,5.2rem)]">Find Us on<br />Queens Boulevard</h2>
            </div>
        </div>
        <div class="wrap grid gap-12 py-16 md:grid-cols-3 lg:py-20">
            <div>
                <h3 class="${heading}">Location</h3>
                <p class="mt-5 text-[1.05rem] leading-relaxed">
                    <a class="${link}" href="${site.links.directions}" target="_blank" rel="noopener"
                        >${site.address.street}<br />${site.address.locality}, ${site.address.region} ${site.address.postalCode}</a
                    >
                </p>
                <p class="mt-3 leading-relaxed text-white/70">${site.address.corner}. ${site.transit}. Paid street parking nearby.</p>
                <a class="btn btn-light btn-sm mt-8" href="${site.links.directions}" target="_blank" rel="noopener">${icon('map-pin', 'size-4')} Get directions</a>
            </div>
            <div>
                <h3 class="${heading}">Hours</h3>
                <div class="mt-5">${statusLine('text-white', '#visit')}</div>
                ${hoursTable('mt-4 text-white/85')}
            </div>
            <div>
                <h3 class="${heading}">Contact</h3>
                <p class="mt-5 text-[1.05rem]"><a class="${link}" href="${site.phone.href}">${site.phone.display}</a></p>
                <p class="mt-2">
                    <a class="${link}" href="${site.links.instagram}" target="_blank" rel="noopener">${site.links.instagramHandle}</a>
                </p>
                <ul class="mt-8 border-t border-white/15 text-[0.95rem] text-white/75">
                    ${site.goodToKnow.map((fact) => html`<li class="border-b border-white/15 py-2.5">${fact}</li>`)}
                </ul>
            </div>
        </div>
        <iframe
            src="${site.links.mapEmbed}"
            title="Map: Bon Café et Restaurant, 41-31 Queens Blvd, Sunnyside"
            class="block h-[26rem] w-full border-0 grayscale transition duration-500 hover:grayscale-0"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen
        ></iframe>
    </section>`;
}

export function homePage(): PageRender {
    const first = PHOTOS[HERO_SLIDES[0] ?? 'avocadoToast'];
    return {
        key: 'home',
        preload: [{ href: `/images/${first.file}.webp`, srcset: `/images/${first.file}-sm.webp 900w, /images/${first.file}.webp 2000w`, sizes: '100vw' }],
        jsonLd: [businessSchema()],
        main: html`${hero()} ${welcome()} ${splits()} ${favorites()} ${reviews()} ${orderAndStay()} ${visit()}`
    };
}
