// npm run images: turns every original in images-raw/ into web-ready WebP files in public/images/
//   <name>.webp     up to 2000 px wide (big screens)
//   <name>-sm.webp  up to 900 px wide (phones, small slots)
// and writes their pixel sizes to src/data/image-sizes.ts, so every <img> gets a width and height
// (no layout jump while it loads). images-raw/ is git-ignored; the WebP files are committed.
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const rawDir = path.join(root, 'images-raw');
const outDir = path.join(root, 'public', 'images');
mkdirSync(outDir, { recursive: true });

const sizes: Record<string, { width: number; height: number }> = {};
const files = readdirSync(rawDir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort();

for (const file of files) {
    const name = path.parse(file).name.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
    const input = sharp(path.join(rawDir, file)).rotate(); // respect phone-camera orientation
    const big = await input
        .clone()
        .resize({ width: 2000, withoutEnlargement: true })
        .webp({ quality: 74, effort: 5 })
        .toFile(path.join(outDir, `${name}.webp`));
    const small = await input
        .clone()
        .resize({ width: 900, withoutEnlargement: true })
        .webp({ quality: 72, effort: 5 })
        .toFile(path.join(outDir, `${name}-sm.webp`));
    sizes[name] = { width: big.width, height: big.height };
    console.log(`${name}: ${big.width}×${big.height} (${(big.size / 1024).toFixed(0)} KB) + small (${(small.size / 1024).toFixed(0)} KB)`);
}

const body = Object.entries(sizes)
    .map(([name, s]) => `    '${name}': { width: ${s.width}, height: ${s.height} }`)
    .join(',\n');
writeFileSync(
    path.join(root, 'src', 'data', 'image-sizes.ts'),
    `// written by \`npm run images\`. don't edit by hand\nexport const IMAGE_SIZES: Record<string, { width: number; height: number }> = {\n${body}\n};\n`
);
console.log(`\n${files.length} photos → public/images/, sizes → src/data/image-sizes.ts`);
