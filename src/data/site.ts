// everything about the business that might change: name, address, phone, hours, links.
// the header, footer, hours tables, open/closed badge, structured data, sitemap and llms.txt all read from here.
// sources for each fact are in RESEARCH.md
import { hm, type Week } from '../lib/hours.ts';

/**
 * The live domain, no trailing slash. Placeholder until the client buys one
 * (boncafeetrestaurant.com was available on Oct 30, 2026).
 * Canonical links, social previews, the sitemap and structured data all use it.
 */
export const SITE_URL = 'https://www.boncafeetrestaurant.com';

/** Mon–Sat 7:30 AM – 7 PM, Sun 7:30 AM – 5 PM (Google Business Profile, Oct 2026). Index 0 = Sunday. */
export const HOURS: Week = [
    { open: hm(7, 30), close: hm(17) },
    { open: hm(7, 30), close: hm(19) },
    { open: hm(7, 30), close: hm(19) },
    { open: hm(7, 30), close: hm(19) },
    { open: hm(7, 30), close: hm(19) },
    { open: hm(7, 30), close: hm(19) },
    { open: hm(7, 30), close: hm(19) }
];

const directionsQuery = encodeURIComponent('Bon Cafe et Restaurant, 41-31 Queens Blvd, Sunnyside, NY 11104');

export const site = {
    name: 'Bon Café et Restaurant',
    shortName: 'Bon Café',
    owner: 'Shana Choi',
    founded: '2022',
    tagline: 'Korean comfort food, all-day breakfast and good coffee in Sunnyside, Queens',
    summary:
        'Bon Café et Restaurant is a neighborhood café on Queens Boulevard in Sunnyside, Queens, serving Korean and American comfort food made fresh with house-made sauces: bibimbap, tteokbokki, healthy rice bowls, salads, omelettes and breakfast all day, croissant sandwiches, paninis and burgers, plus lattes, frappés, lemonades and smoothies.',

    phone: {
        display: '(929) 708-2678',
        href: 'tel:+19297082678',
        intl: '+1-929-708-2678'
    },

    address: {
        street: '41-31 Queens Blvd',
        locality: 'Sunnyside',
        borough: 'Queens',
        region: 'NY',
        postalCode: '11104',
        country: 'US',
        /** short line used under the address */
        corner: 'On the corner of Queens Blvd & 42nd St'
    },

    geo: { lat: 40.7439043, lng: -73.9224979 },

    transit: '7 train to 40 St–Lowery St, then two blocks east along Queens Blvd',

    links: {
        instagram: 'https://www.instagram.com/bon_cafe_et_restaurant/',
        instagramHandle: '@bon_cafe_et_restaurant',
        googleMaps:
            'https://www.google.com/maps/place/Bon+Cafe+et+Restaurant/@40.7439043,-73.9224979,17z/data=!4m6!3m5!1s0x89c25f4bac441fcd:0xe3f2dc79fffeee9a!8m2!3d40.7439043!4d-73.9224979!16s%2Fg%2F11sghkwrmw',
        googleReviews:
            'https://www.google.com/maps/place/Bon+Cafe+et+Restaurant/@40.7439043,-73.9224979,17z/data=!4m8!3m7!1s0x89c25f4bac441fcd:0xe3f2dc79fffeee9a!8m2!3d40.7439043!4d-73.9224979!9m1!1b1!16s%2Fg%2F11sghkwrmw',
        directions: `https://www.google.com/maps/dir/?api=1&destination=${directionsQuery}`,
        mapEmbed: `https://maps.google.com/maps?q=${directionsQuery}&z=17&output=embed`,
        grubhub: 'https://www.grubhub.com/restaurant/bon-cafe-et-restaurant-41-31-queens-blvd-sunnyside/3061515',
        doordash: 'https://www.doordash.com/store/bon-cafe-et-restaurant-sunnyside-36949237/'
    },

    /** Google rating shown in the reviews section. Update it now and then. */
    rating: { value: 4.6, count: 136, source: 'Google', asOf: 'October 2026' },

    /** Print & copy service (Instagram, Oct 2025). */
    printing: {
        firstPage: '$1',
        extraPage: '50¢',
        student: '25¢'
    },

    goodToKnow: [
        'Dine-in, takeout & delivery',
        'Free Wi-Fi for everyone',
        'Cards & tap-to-pay accepted',
        'Wheelchair-accessible entrance, seating & restroom',
        'Good for kids',
        'Paid street parking'
    ]
} as const;

export const NAV = [
    { label: 'Menu', href: '/menu' },
    { label: 'About', href: '/#about' },
    { label: 'Coffee', href: '/#coffee' },
    { label: 'Visit', href: '/#visit' }
] as const;
