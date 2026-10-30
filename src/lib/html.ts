// a tiny HTML template helper for the build-time pages.
//
//   html`<h2>${title}</h2>`        → title is escaped (so "Mac & Cheese" is safe)
//   html`<ul>${items.map(...)}</ul>` → arrays are joined
//   html`${raw(svgString)}`          → trusted markup goes in as-is
//   null / undefined / false         → render nothing (handy for `cond && html`...``)

export class SafeHtml {
    readonly value: string;
    constructor(value: string) {
        this.value = value;
    }
    toString(): string {
        return this.value;
    }
}

const ESCAPES: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
};

export const escapeHtml = (text: string): string => text.replace(/[&<>"']/g, (ch) => ESCAPES[ch] ?? ch);

/** Mark a string as trusted markup (SVG, pre-rendered HTML). */
export const raw = (markup: string): SafeHtml => new SafeHtml(markup);

function render(value: unknown): string {
    if (value === null || value === undefined || value === false || value === true) return '';
    if (value instanceof SafeHtml) return value.value;
    if (Array.isArray(value)) return value.map(render).join('');
    return escapeHtml(String(value));
}

export function html(strings: TemplateStringsArray, ...values: unknown[]): SafeHtml {
    let out = strings[0] ?? '';
    for (let i = 0; i < values.length; i++) {
        out += render(values[i]) + (strings[i + 1] ?? '');
    }
    return new SafeHtml(out);
}

/** Join class names, skipping falsy ones. */
export const cx = (...names: (string | false | null | undefined)[]): string => names.filter(Boolean).join(' ');
