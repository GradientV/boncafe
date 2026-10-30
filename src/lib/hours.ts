// opening-hours helpers, shared by the build (hours tables, structured data)
// and the browser (the live "Open now" badge).
// everything is computed in New York time, so the badge is right for a visitor in any time zone

/** One day's opening span, in minutes after midnight (New York time). */
export interface Span {
    open: number;
    close: number;
}

/** Seven entries, index 0 = Sunday (same order as Date#getDay). `null` = closed all day. */
export type Week = readonly (Span | null)[];

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
export const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

/** Display order for hours tables: the week starts on Monday. */
export const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;

/** `hm(7, 30)` → 450 minutes. */
export const hm = (hours: number, minutes = 0): number => hours * 60 + minutes;

/** 450 → "7:30 AM", 1140 → "7 PM". */
export function formatTime(minutes: number): string {
    const h24 = Math.floor(minutes / 60) % 24;
    const m = minutes % 60;
    const suffix = h24 < 12 ? 'AM' : 'PM';
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    return m === 0 ? `${h12} ${suffix}` : `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}

/** 450 → "07:30" (the format schema.org wants). */
export function formatClock(minutes: number): string {
    const h = Math.floor(minutes / 60) % 24;
    const m = minutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export const formatSpan = (span: Span): string => `${formatTime(span.open)} – ${formatTime(span.close)}`;

/** The weekday and minute right now in New York. */
export function nowInNewYork(date: Date = new Date()): { day: number; minutes: number } {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23'
    }).formatToParts(date);
    const part = (type: Intl.DateTimeFormatPartTypes): string => parts.find((p) => p.type === type)?.value ?? '';
    const day = DAY_SHORT.indexOf(part('weekday') as (typeof DAY_SHORT)[number]);
    const hour = Number(part('hour')) % 24;
    const minute = Number(part('minute'));
    return { day: day === -1 ? new Date().getDay() : day, minutes: hour * 60 + minute };
}

export type StatusState = 'open' | 'closing' | 'closed';

export interface Status {
    state: StatusState;
    /** "Open now", "Closing soon", "Closed now" */
    label: string;
    /** "until 7 PM", "opens tomorrow 7:30 AM" */
    detail: string;
}

/** How many minutes before closing the badge switches to "Closing soon". */
const CLOSING_SOON = 30;

export function getStatus(week: Week, now = nowInNewYork()): Status {
    const today = week[now.day] ?? null;

    if (today && now.minutes >= today.open && now.minutes < today.close) {
        const soon = today.close - now.minutes <= CLOSING_SOON;
        return {
            state: soon ? 'closing' : 'open',
            label: soon ? 'Closing soon' : 'Open now',
            detail: `until ${formatTime(today.close)}`
        };
    }

    if (today && now.minutes < today.open) {
        return { state: 'closed', label: 'Closed now', detail: `opens ${formatTime(today.open)}` };
    }

    for (let offset = 1; offset <= 7; offset++) {
        const day = (now.day + offset) % 7;
        const span = week[day];
        if (span) {
            const when = offset === 1 ? 'tomorrow' : DAY_NAMES[day];
            return { state: 'closed', label: 'Closed now', detail: `opens ${when} ${formatTime(span.open)}` };
        }
    }

    return { state: 'closed', label: 'Closed', detail: '' };
}

export interface HoursRow {
    /** "Mon – Sat" or "Sunday" */
    days: string;
    /** "7:30 AM – 7 PM" or "Closed" */
    hours: string;
    /** the weekday numbers this row covers (0 = Sunday) */
    dayNumbers: number[];
}

/** Collapses days with matching hours, Monday first: [{ days: "Mon – Sat", hours: "7:30 AM – 7 PM" }, …]. */
export function groupWeek(week: Week): HoursRow[] {
    const rows: HoursRow[] = [];
    for (const day of DISPLAY_ORDER) {
        const span = week[day] ?? null;
        const hours = span ? formatSpan(span) : 'Closed';
        const last = rows.at(-1);
        const lastDay = last?.dayNumbers.at(-1);
        const isNextDay = lastDay !== undefined && (lastDay + 1) % 7 === day;
        if (last && last.hours === hours && isNextDay) {
            last.dayNumbers.push(day);
        } else {
            rows.push({ days: '', hours, dayNumbers: [day] });
        }
    }
    for (const row of rows) {
        const first = row.dayNumbers[0] ?? 0;
        const last = row.dayNumbers.at(-1) ?? first;
        row.days = row.dayNumbers.length === 1 ? (DAY_NAMES[first] ?? '') : `${DAY_SHORT[first]} – ${DAY_SHORT[last]}`;
    }
    return rows;
}
