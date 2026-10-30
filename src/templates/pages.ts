// which template renders which HTML entry file
import { homePage } from './home.ts';
import { documentParts, type PageRender } from './layout.ts';
import { accessibilityPage, notFoundPage, privacyPage } from './legal.ts';
import { menuPage } from './menu-page.ts';

const RENDERERS: Record<string, () => PageRender> = {
    'index.html': homePage,
    'menu.html': menuPage,
    'privacy.html': privacyPage,
    'accessibility.html': accessibilityPage,
    '404.html': notFoundPage
};

export const PAGE_FILES = Object.keys(RENDERERS);

/** Fill an HTML shell's <!--bon:head--> and <!--bon:body--> slots. */
export function renderPage(fileName: string, shell: string): string {
    const render = RENDERERS[fileName];
    if (!render) return shell;
    const parts = documentParts(render());
    // replacer functions, so "$" in prices is never treated as a replacement pattern
    return shell.replace('<!--bon:head-->', () => parts.head).replace('<!--bon:body-->', () => parts.body);
}
