// runs on every page: mobile navigation, the "Order online" dropdown, the live open/closed line,
// seasonal notes and the home-page slideshow. the menu page's search/filters load separately (./menu.ts)
import { HOURS } from '../data/site.ts';
import { getStatus, nowInNewYork } from '../lib/hours.ts';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// ---------- mobile navigation (a native <dialog>: focus trap and Escape come for free) ----------
const dialog = document.querySelector<HTMLDialogElement>('#mobile-nav');
const openButton = document.querySelector<HTMLButtonElement>('[data-nav-open]');
if (dialog && openButton) {
    openButton.addEventListener('click', () => {
        dialog.showModal();
        openButton.setAttribute('aria-expanded', 'true');
    });
    dialog.querySelector('[data-nav-close]')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => openButton.setAttribute('aria-expanded', 'false'));
    for (const link of dialog.querySelectorAll('[data-nav-link]')) {
        link.addEventListener('click', () => dialog.close());
    }
    // turning a tablet to landscape shows the desktop nav, so close the overlay
    window.matchMedia('(min-width: 64rem)').addEventListener('change', (event) => {
        if (event.matches && dialog.open) dialog.close();
    });
}

// ---------- "Order online" dropdown in the header ----------
for (const dropdown of document.querySelectorAll<HTMLElement>('[data-dropdown]')) {
    const toggle = dropdown.querySelector<HTMLButtonElement>('[data-dropdown-toggle]');
    const panel = dropdown.querySelector<HTMLElement>('[data-dropdown-panel]');
    if (!toggle || !panel) continue;
    const setOpen = (open: boolean): void => {
        panel.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => setOpen(Boolean(panel.hidden)));
    dropdown.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !panel.hidden) {
            setOpen(false);
            toggle.focus();
        }
    });
    dropdown.addEventListener('focusout', (event) => {
        if (!dropdown.contains(event.relatedTarget as Node | null)) setOpen(false);
    });
    document.addEventListener('click', (event) => {
        if (!dropdown.contains(event.target as Node)) setOpen(false);
    });
}

// ---------- open / closed line and today's row in the hours table (New York time) ----------
function paintStatus(): void {
    const now = nowInNewYork();
    const status = getStatus(HOURS, now);
    const text = status.detail ? `${status.label} · ${status.detail}` : status.label;
    for (const line of document.querySelectorAll<HTMLElement>('[data-open-status]')) {
        line.dataset.state = status.state;
        const label = line.querySelector('[data-status-text]');
        if (label) label.textContent = text;
    }
    for (const row of document.querySelectorAll<HTMLElement>('[data-hours-day]')) {
        const isToday = row.dataset.hoursDay === String(now.day);
        row.classList.toggle('is-today', isToday);
        if (isToday) row.setAttribute('aria-current', 'date');
        else row.removeAttribute('aria-current');
    }
}
paintStatus();
window.setInterval(paintStatus, 60_000);

// ---------- seasonal notes: data-season="9-11" shows from September through November ----------
const month = Number(new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', month: 'numeric' }).format(new Date()));
for (const node of document.querySelectorAll<HTMLElement>('[data-season]')) {
    const [from = 1, to = 12] = (node.dataset.season ?? '').split('-').map(Number);
    node.hidden = from <= to ? month < from || month > to : month < from && month > to;
}

// ---------- home-page slideshow ----------
const hero = document.querySelector<HTMLElement>('[data-hero]');
if (hero) {
    const slides = [...hero.querySelectorAll<HTMLElement>('[data-slide]')];
    const counter = hero.querySelector('[data-hero-count]');
    const pauseButton = hero.querySelector<HTMLButtonElement>('[data-hero-pause]');
    const pad = (n: number): string => String(n).padStart(2, '0');
    const DELAY = 6500;
    let index = 0;
    let timer = 0;
    // with "reduce motion" on, the photos never change by themselves (the arrows still work)
    let paused = reduceMotion.matches;

    const show = (next: number): void => {
        index = (next + slides.length) % slides.length;
        slides.forEach((slide, i) => {
            slide.classList.toggle('is-active', i === index);
            slide.setAttribute('aria-hidden', String(i !== index));
        });
        if (counter) counter.textContent = `${pad(index + 1)} / ${pad(slides.length)}`;
    };
    const schedule = (): void => {
        window.clearTimeout(timer);
        if (paused || document.hidden || slides.length < 2) return;
        timer = window.setTimeout(() => {
            show(index + 1);
            schedule();
        }, DELAY);
    };
    const paintPause = (): void => {
        if (!pauseButton) return;
        pauseButton.setAttribute('aria-pressed', String(paused));
        pauseButton.querySelector('[data-icon="pause"]')?.toggleAttribute('hidden', paused);
        pauseButton.querySelector('[data-icon="play"]')?.toggleAttribute('hidden', !paused);
    };

    hero.querySelector('[data-hero-prev]')?.addEventListener('click', () => {
        show(index - 1);
        schedule();
    });
    hero.querySelector('[data-hero-next]')?.addEventListener('click', () => {
        show(index + 1);
        schedule();
    });
    pauseButton?.addEventListener('click', () => {
        paused = !paused;
        paintPause();
        schedule();
    });
    document.addEventListener('visibilitychange', schedule);

    show(0);
    paintPause();
    schedule();
}

// ---------- page-specific code ----------
if (document.querySelector('[data-page="menu"]')) {
    void import('./menu.ts').then(({ initMenu }) => initMenu());
}
