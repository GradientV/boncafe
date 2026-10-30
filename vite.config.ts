// Vite: Tailwind, plus build/bon-pages.ts, which renders the pages from src/templates.
// every page is its own HTML entry (a multi-page site), so the build is plain static HTML
import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { bonPages } from './build/bon-pages.ts';

const page = (file: string): string => resolve(import.meta.dirname, file);

export default defineConfig({
    appType: 'mpa',
    plugins: [tailwindcss(), bonPages()],
    build: {
        rollupOptions: {
            input: {
                index: page('index.html'),
                menu: page('menu.html'),
                privacy: page('privacy.html'),
                accessibility: page('accessibility.html'),
                notFound: page('404.html')
            }
        }
    },
    server: { port: 5177 },
    preview: { port: 4177 }
});
