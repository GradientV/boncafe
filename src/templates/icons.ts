// inline SVG icons (Lucide, ISC license), rendered into the HTML at build time with a thin 1.5 stroke.
// usage: ${icon('phone', 'size-4')}
import {
    Armchair,
    ArrowRight,
    ArrowUpRight,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
    Menu,
    Pause,
    Phone,
    Play,
    Printer,
    Search,
    ShoppingBag,
    Star,
    TrainFront,
    Wifi,
    X
} from 'lucide-static';
import { raw, type SafeHtml } from '../lib/html.ts';

// Lucide dropped brand logos, so this is the familiar outline glyph drawn to match
const INSTAGRAM = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="x"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></svg>`;

const ICONS = {
    armchair: Armchair,
    'arrow-right': ArrowRight,
    'arrow-up-right': ArrowUpRight,
    'chevron-down': ChevronDown,
    'chevron-left': ChevronLeft,
    'chevron-right': ChevronRight,
    clock: Clock,
    instagram: INSTAGRAM,
    'map-pin': MapPin,
    menu: Menu,
    pause: Pause,
    phone: Phone,
    play: Play,
    printer: Printer,
    search: Search,
    'shopping-bag': ShoppingBag,
    star: Star,
    train: TrainFront,
    wifi: Wifi,
    x: X
} as const;

export type IconName = keyof typeof ICONS;

const cache = new Map<string, string>();

export function icon(name: IconName, className = 'size-5'): SafeHtml {
    const key = `${name}|${className}`;
    let svg = cache.get(key);
    if (!svg) {
        svg = ICONS[name]
            .trim()
            .replace(/\s*\n\s*/g, ' ')
            .replace(/\sclass="[^"]*"/, '')
            .replace(/\swidth="24"/, '')
            .replace(/\sheight="24"/, '')
            .replace('stroke-width="2"', 'stroke-width="1.5"')
            .replace('<svg', `<svg class="${className}" aria-hidden="true" focusable="false"`);
        cache.set(key, svg);
    }
    return raw(svg);
}
