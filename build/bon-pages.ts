// the Vite plugin that turns src/templates into real HTML pages.
//
// - every .html file at the project root is a thin shell with <!--bon:head--> and <!--bon:body-->;
//   this plugin fills them from src/templates/*.ts, in dev and in the build, so the built site is
//   plain static HTML (great for Google and link previews) with a small script for the interactive bits
// - serves clean URLs (/menu → menu.html) in dev and preview, the same as Vercel's cleanUrls
// - adds sitemap.xml, robots.txt, llms.txt and site.webmanifest to the build
//
// the templates are imported by vite.config.ts, so editing one restarts the dev server
// and the browser reloads by itself
import fs from 'node:fs';
import path from 'node:path';
import type { Connect, Plugin } from 'vite';
import { generatedFiles } from '../src/templates/files.ts';
import { renderPage } from '../src/templates/pages.ts';

/** /menu → /menu.html when that file exists in `baseDir` */
function cleanUrls(baseDir: string): Connect.NextHandleFunction {
    return (req, _res, next) => {
        const [pathname = '/', query] = (req.url ?? '/').split('?');
        const trimmed = pathname.replace(/\/+$/, '');
        if (trimmed && !path.extname(trimmed) && !trimmed.startsWith('/@') && fs.existsSync(path.join(baseDir, `${trimmed}.html`))) {
            req.url = `${trimmed}.html${query ? `?${query}` : ''}`;
        }
        next();
    };
}

export function bonPages(): Plugin {
    let root = process.cwd();
    let outDir = path.join(root, 'dist');

    return {
        name: 'bon-pages',

        configResolved(config) {
            root = config.root;
            outDir = path.resolve(root, config.build.outDir);
        },

        transformIndexHtml: {
            order: 'pre',
            handler(shell, ctx) {
                return renderPage(path.basename(ctx.filename), shell);
            }
        },

        configureServer(server) {
            server.middlewares.use(cleanUrls(root));
            // sitemap, robots, llms.txt and the manifest, so they work in dev too
            server.middlewares.use((req, res, next) => {
                const name = (req.url ?? '').split('?')[0]?.replace(/^\//, '') ?? '';
                const body = generatedFiles()[name];
                if (!body) return next();
                const type = name.endsWith('.xml') ? 'application/xml' : name.endsWith('.webmanifest') ? 'application/manifest+json' : 'text/plain';
                res.setHeader('Content-Type', `${type}; charset=utf-8`);
                res.end(body);
            });
        },

        configurePreviewServer(server) {
            server.middlewares.use(cleanUrls(outDir));
        },

        generateBundle() {
            for (const [fileName, source] of Object.entries(generatedFiles())) {
                this.emitFile({ type: 'asset', fileName, source });
            }
        }
    };
}
