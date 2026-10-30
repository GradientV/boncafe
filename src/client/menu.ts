// the menu page: search, "show only" filters, and the section bar that follows your scroll

const normalize = (text: string): string =>
    text
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .trim();

export function initMenu(): void {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const search = document.querySelector<HTMLInputElement>('[data-menu-search]');
    const filterButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-filter]')];
    const items = [...document.querySelectorAll<HTMLElement>('[data-item]')];
    const sections = [...document.querySelectorAll<HTMLElement>('[data-menu-section]')];
    const catItems = [...document.querySelectorAll<HTMLElement>('[data-cat-for]')];
    const catLinks = [...document.querySelectorAll<HTMLAnchorElement>('.cat-link')];
    const drinksPanel = document.querySelector<HTMLElement>('[data-drinks]');
    const empty = document.querySelector<HTMLElement>('[data-menu-empty]');
    const count = document.querySelector<HTMLElement>('[data-menu-count]');
    const reset = document.querySelector<HTMLButtonElement>('[data-menu-reset]');
    const catNav = document.querySelector<HTMLElement>('[data-cat-nav]');
    const active = new Set<string>();

    // ---------- search + filters ----------
    function apply(): void {
        const words = normalize(search?.value ?? '')
            .split(/\s+/)
            .filter(Boolean);
        let shown = 0;
        for (const item of items) {
            const tags = (item.dataset.tags ?? '').split(' ');
            const text = item.dataset.search ?? '';
            const match = words.every((w) => text.includes(w)) && [...active].every((t) => tags.includes(t));
            item.hidden = !match;
            if (match) shown++;
        }
        for (const section of sections) {
            const visible = section.querySelector('[data-item]:not([hidden])') !== null;
            section.hidden = !visible;
            const chip = catItems.find((c) => c.dataset.catFor === section.id);
            if (chip) chip.hidden = !visible;
        }
        if (drinksPanel) drinksPanel.hidden = drinksPanel.querySelector('[data-menu-section]:not([hidden])') === null;
        if (empty) empty.hidden = shown > 0;
        const filtering = words.length > 0 || active.size > 0;
        if (count) count.textContent = filtering ? `${shown} ${shown === 1 ? 'item matches' : 'items match'}` : '';
    }

    search?.addEventListener('input', apply);
    search?.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && search.value) {
            search.value = '';
            apply();
        }
    });
    for (const button of filterButtons) {
        button.addEventListener('click', () => {
            const tag = button.dataset.filter ?? '';
            if (active.has(tag)) active.delete(tag);
            else active.add(tag);
            button.setAttribute('aria-pressed', String(active.has(tag)));
            apply();
        });
    }
    reset?.addEventListener('click', () => {
        if (search) search.value = '';
        active.clear();
        for (const button of filterButtons) button.setAttribute('aria-pressed', 'false');
        apply();
        search?.focus();
    });

    // ---------- the section bar follows the page ----------
    function setCurrent(id: string): void {
        for (const link of catLinks) {
            if (link.getAttribute('href') !== `#${id}`) {
                link.removeAttribute('aria-current');
                continue;
            }
            link.setAttribute('aria-current', 'true');
            if (catNav) {
                const bar = catNav.getBoundingClientRect();
                const chip = link.getBoundingClientRect();
                if (chip.left < bar.left + 8 || chip.right > bar.right - 8) {
                    catNav.scrollBy({ left: chip.left - bar.left - 24, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
                }
            }
        }
    }
    const spy = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) if (entry.isIntersecting) setCurrent(entry.target.id);
        },
        { rootMargin: '-35% 0px -60% 0px' }
    );
    for (const section of sections) spy.observe(section);

    apply();
}
