// npm run brand: writes the favicon, app icons and the social share image into public/.
//   public/favicon-32.png, apple-touch-icon.png, icon-192.png, icon-512.png  (a "BC" monogram on black)
//   public/og-image.jpg  (1200×630: Bon Café's own photo, darkened, with the wordmark)
// the results are committed, so the build doesn't need to run this
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { inflateSync } from 'node:zlib';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const pub = path.join(root, 'public');
const INK = '#161310';

/** WOFF 1.0 → plain TrueType, so the image library's font engine can read the brand font. */
function woffToTtf(woff: Buffer): Buffer {
    if (woff.toString('ascii', 0, 4) !== 'wOFF') throw new Error('not a WOFF 1.0 file');
    const flavor = woff.readUInt32BE(4);
    const numTables = woff.readUInt16BE(12);
    const tables = Array.from({ length: numTables }, (_, i) => {
        const at = 44 + i * 20;
        const offset = woff.readUInt32BE(at + 4);
        const compLength = woff.readUInt32BE(at + 8);
        const origLength = woff.readUInt32BE(at + 12);
        const raw = woff.subarray(offset, offset + compLength);
        return { tag: woff.subarray(at, at + 4), checksum: woff.readUInt32BE(at + 16), data: compLength < origLength ? inflateSync(raw) : raw };
    });
    const pow = 2 ** Math.floor(Math.log2(numTables));
    const header = Buffer.alloc(12 + numTables * 16);
    header.writeUInt32BE(flavor, 0);
    header.writeUInt16BE(numTables, 4);
    header.writeUInt16BE(pow * 16, 6);
    header.writeUInt16BE(Math.log2(pow), 8);
    header.writeUInt16BE(numTables * 16 - pow * 16, 10);
    const chunks: Buffer[] = [header];
    let offset = header.length;
    tables.forEach((t, i) => {
        const at = 12 + i * 16;
        t.tag.copy(header, at);
        header.writeUInt32BE(t.checksum, at + 4);
        header.writeUInt32BE(offset, at + 8);
        header.writeUInt32BE(t.data.length, at + 12);
        const padded = Buffer.alloc(Math.ceil(t.data.length / 4) * 4);
        t.data.copy(padded);
        chunks.push(padded);
        offset += padded.length;
    });
    return Buffer.concat(chunks);
}

// the static Jost files (a dev dependency) → TTF in a temp folder
const fontDir = path.join(tmpdir(), 'bon-cafe-fonts');
mkdirSync(fontDir, { recursive: true });
const jost = (weight: number): string => {
    const file = path.join(fontDir, `Jost-${weight}.ttf`);
    writeFileSync(file, woffToTtf(readFileSync(path.join(root, `node_modules/@fontsource/jost/files/jost-latin-${weight}-normal.woff`))));
    return file;
};
const JOST_REGULAR = jost(400);
const JOST_SEMIBOLD = jost(600);

/** one line of Jost, as a transparent PNG. tracking is in em */
async function text(words: string, opts: { size: number; weight: 400 | 600; tracking: number; color?: string }): Promise<{ input: Buffer; width: number; height: number }> {
    const spacing = Math.round(opts.size * opts.tracking * 1024);
    const input = await sharp({
        text: {
            text: `<span foreground="${opts.color ?? '#ffffff'}" letter_spacing="${spacing}">${words}</span>`,
            font: `Jost ${opts.weight === 600 ? 'SemiBold ' : ''}${opts.size}`,
            fontfile: opts.weight === 600 ? JOST_SEMIBOLD : JOST_REGULAR,
            rgba: true,
            dpi: 72
        }
    })
        .png()
        .toBuffer();
    const meta = await sharp(input).metadata();
    return { input, width: meta.width ?? 0, height: meta.height ?? 0 };
}

// ---------- icons: BC on black ----------
async function icon(size: number, file: string): Promise<void> {
    const mark = await text('BC', { size: Math.round(size * 0.36), weight: 600, tracking: 0.08 });
    // the trailing letter-space makes the text image slightly wide, so nudge it back to center
    const nudge = Math.round(size * 0.36 * 0.04);
    await sharp({ create: { width: size, height: size, channels: 4, background: INK } })
        .composite([{ input: mark.input, left: Math.round((size - mark.width) / 2 + nudge), top: Math.round((size - mark.height) / 2) }])
        .png()
        .toFile(path.join(pub, file));
}
await icon(32, 'favicon-32.png');
await icon(180, 'apple-touch-icon.png');
await icon(192, 'icon-192.png');
await icon(512, 'icon-512.png');

// ---------- social share image ----------
const W = 1200;
const H = 630;
const photo = await sharp(path.join(pub, 'images', 'bulgogi-bowl.webp')).resize(W, H, { fit: 'cover', position: 'centre' }).toBuffer();
const shade = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><radialGradient id="g" cx="50%" cy="50%" r="70%"><stop offset="0" stop-color="${INK}" stop-opacity=".78"/><stop offset="1" stop-color="${INK}" stop-opacity=".55"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/><rect x="40" y="40" width="${W - 80}" height="${H - 80}" fill="none" stroke="#ffffff" stroke-opacity=".35"/></svg>`
);
const name = await text('BON CAFÉ', { size: 104, weight: 600, tracking: 0.3 });
const sub = await text('ET RESTAURANT', { size: 26, weight: 400, tracking: 0.62 });
const place = await text('SUNNYSIDE · QUEENS', { size: 20, weight: 400, tracking: 0.42 });
const rule = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="72" height="2"><rect width="72" height="2" fill="#b3261e"/></svg>`);
// letter-spacing also trails the last letter, so shift each line right by half of one space to look centered
const center = (w: number, tracking: number, size: number) => Math.round((W - w) / 2 + (tracking * size) / 2);

await sharp(photo)
    .composite([
        { input: shade, left: 0, top: 0 },
        { input: name.input, left: center(name.width, 0.3, 104), top: 200 },
        { input: sub.input, left: center(sub.width, 0.62, 26), top: 200 + name.height + 14 },
        { input: rule, left: (W - 72) / 2, top: 200 + name.height + sub.height + 46 },
        { input: place.input, left: center(place.width, 0.42, 20), top: 200 + name.height + sub.height + 76 }
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(pub, 'og-image.jpg'));

console.log('brand assets written to public/');
