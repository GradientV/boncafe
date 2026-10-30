// the small text files every build writes next to the pages: sitemap.xml, robots.txt, llms.txt, site.webmanifest
import { MENU, formatPrice } from '../data/menu.ts';
import { PAGES } from '../data/pages.ts';
import { HOURS, SITE_URL, site } from '../data/site.ts';
import { groupWeek } from '../lib/hours.ts';

function sitemap(): string {
    const today = new Date().toISOString().slice(0, 10);
    const urls = Object.values(PAGES)
        .filter((page) => !('hidden' in page && page.hidden))
        .map((page) => `  <url><loc>${SITE_URL}${page.path}</loc><lastmod>${today}</lastmod></url>`)
        .join('\n');
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const robots = (): string => `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;

/** A plain-text summary for AI assistants (llmstxt.org). */
function llms(): string {
    const hours = groupWeek(HOURS)
        .map((row) => `- ${row.days}: ${row.hours}`)
        .join('\n');
    const menu = MENU.map((section) => {
        const items = section.items
            .map((item) => {
                const price = formatPrice(item, section);
                return `- ${item.name}${price ? ` (${price})` : ''}${item.description ? `: ${item.description}` : ''}`;
            })
            .join('\n');
        return `### ${section.title}\n${items}`;
    }).join('\n\n');
    return `# ${site.name}

> ${site.summary}

- Address: ${site.address.street}, ${site.address.locality}, ${site.address.region} ${site.address.postalCode} (${site.address.corner.toLowerCase()})
- Phone: ${site.phone.display}
- Instagram: ${site.links.instagram}
- Order online: Grubhub (${site.links.grubhub}), DoorDash (${site.links.doordash})
- Getting there: ${site.transit}
- Owner: ${site.owner}, opened ${site.founded}
- Free Wi-Fi; print & copy service (${site.printing.firstPage} first page, ${site.printing.extraPage} after, students ${site.printing.student} a page)

## Hours (New York time)
${hours}

## Pages
- [Home](${SITE_URL}/): hours, location, favorites, story
- [Menu](${SITE_URL}/menu): full menu with prices

## Menu
${menu}
`;
}

function manifest(): string {
    return `${JSON.stringify(
        {
            name: site.name,
            short_name: site.shortName,
            description: site.tagline,
            start_url: '/',
            display: 'browser',
            background_color: '#fbf5ea',
            theme_color: '#fbf5ea',
            icons: [
                { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
                { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
            ]
        },
        null,
        2
    )}\n`;
}

export function generatedFiles(): Record<string, string> {
    return {
        'sitemap.xml': sitemap(),
        'robots.txt': robots(),
        'llms.txt': llms(),
        'site.webmanifest': manifest()
    };
}
