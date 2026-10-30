// titles and descriptions for Google and link previews, one entry per page.
// `file` is the HTML entry at the project root; `path` is the clean URL it's served at

export interface PageMeta {
    file: string;
    path: string;
    title: string;
    description: string;
    /** left out of the sitemap (404) */
    hidden?: boolean;
}

export const PAGES = {
    home: {
        file: 'index.html',
        path: '/',
        title: 'Bon Café et Restaurant · Korean Comfort Food & Coffee in Sunnyside, Queens',
        description:
            'Neighborhood café at 41-31 Queens Blvd (at 42nd St) in Sunnyside, Queens. Bibimbap, tteokbokki, healthy rice bowls, all-day breakfast, croissant sandwiches, lattes and smoothies. Free Wi-Fi. Open daily from 7:30 AM.'
    },
    menu: {
        file: 'menu.html',
        path: '/menu',
        title: 'Menu · Bon Café et Restaurant, Sunnyside',
        description:
            'The full Bon Café menu with prices: breakfast and omelettes all day, Korean bibimbap and tteokbokki, healthy bibim bowls, salads, avocado toast, croissant sandwiches, paninis, burgers, lattes, frappés and smoothies.'
    },
    privacy: {
        file: 'privacy.html',
        path: '/privacy',
        title: 'Privacy · Bon Café et Restaurant',
        description: 'How the Bon Café et Restaurant website handles your information. Short version: we don’t collect any.'
    },
    accessibility: {
        file: 'accessibility.html',
        path: '/accessibility',
        title: 'Accessibility · Bon Café et Restaurant',
        description: 'Our commitment to an accessible website and café, what we’ve done so far, and how to tell us about a problem.'
    },
    notFound: {
        file: '404.html',
        path: '/404',
        title: 'Page not found · Bon Café et Restaurant',
        description: 'This page wandered off for a latte.',
        hidden: true
    }
} as const satisfies Record<string, PageMeta>;

export type PageKey = keyof typeof PAGES;
