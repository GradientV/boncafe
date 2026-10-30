// structured data (JSON-LD) so Google and AI assistants get the address, hours, menu and prices right
import { MENU } from '../data/menu.ts';
import { HOURS, SITE_URL, site } from '../data/site.ts';
import { DAY_NAMES, formatClock } from '../lib/hours.ts';

type Json = Record<string, unknown>;

function openingHours(): Json[] {
    const groups = new Map<string, { days: string[]; opens: string; closes: string }>();
    HOURS.forEach((span, day) => {
        if (!span) return;
        const key = `${span.open}-${span.close}`;
        const group = groups.get(key) ?? { days: [], opens: formatClock(span.open), closes: formatClock(span.close) };
        group.days.push(DAY_NAMES[day] ?? '');
        groups.set(key, group);
    });
    return [...groups.values()].map((g) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: g.days,
        opens: g.opens,
        closes: g.closes
    }));
}

export function businessSchema(): Json {
    const { address, geo, links } = site;
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': ['CafeOrCoffeeShop', 'Restaurant'],
                '@id': `${SITE_URL}/#business`,
                name: site.name,
                alternateName: site.shortName,
                description: site.summary,
                url: `${SITE_URL}/`,
                image: `${SITE_URL}/og-image.jpg`,
                logo: `${SITE_URL}/icon-512.png`,
                telephone: site.phone.intl,
                priceRange: '$$',
                servesCuisine: ['Korean', 'American', 'Breakfast', 'Brunch', 'Coffee'],
                acceptsReservations: false,
                paymentAccepted: 'Credit Card, Debit Card, Mobile Payments',
                currenciesAccepted: 'USD',
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: address.street,
                    addressLocality: address.locality,
                    addressRegion: address.region,
                    postalCode: address.postalCode,
                    addressCountry: address.country
                },
                geo: { '@type': 'GeoCoordinates', latitude: geo.lat, longitude: geo.lng },
                hasMap: links.googleMaps,
                openingHoursSpecification: openingHours(),
                hasMenu: `${SITE_URL}/menu`,
                founder: { '@type': 'Person', name: site.owner },
                foundingDate: site.founded,
                amenityFeature: [
                    { '@type': 'LocationFeatureSpecification', name: 'Free Wi-Fi', value: true },
                    { '@type': 'LocationFeatureSpecification', name: 'Wheelchair-accessible entrance', value: true },
                    { '@type': 'LocationFeatureSpecification', name: 'Print and copy service', value: true }
                ],
                sameAs: [links.instagram]
            },
            {
                '@type': 'WebSite',
                '@id': `${SITE_URL}/#website`,
                url: `${SITE_URL}/`,
                name: site.name,
                publisher: { '@id': `${SITE_URL}/#business` }
            }
        ]
    };
}

export function menuSchema(): Json {
    return {
        '@context': 'https://schema.org',
        '@type': 'Menu',
        '@id': `${SITE_URL}/menu#menu`,
        name: `${site.name} menu`,
        url: `${SITE_URL}/menu`,
        inLanguage: 'en',
        hasMenuSection: MENU.map((section) => ({
            '@type': 'MenuSection',
            name: section.title,
            ...(section.blurb ? { description: section.blurb } : {}),
            hasMenuItem: section.items.map((item) => {
                const price = item.price ?? section.price;
                return {
                    '@type': 'MenuItem',
                    name: item.name,
                    ...(item.description ? { description: item.description } : {}),
                    ...(price !== undefined ? { offers: { '@type': 'Offer', price: price.toFixed(2), priceCurrency: 'USD' } } : {})
                };
            })
        }))
    };
}

/** Safe to drop inside a <script> tag. */
export const jsonLd = (data: Json): string => JSON.stringify(data).replace(/</g, '\\u003c');
