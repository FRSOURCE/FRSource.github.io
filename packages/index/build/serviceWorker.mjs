import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ASSETS_DIR = '_astro';
// a file name in a string literal or an attribute, e.g. `import("./contactDialog.abc.js")`
const REFERENCE = /["'`(]((?:\.\/|\/?_astro\/)?[\w.-]+\.(?:js|css))["'`)]/g;

const EXTRA_URLS = [
    'https://www.frsource.org/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js',
    'https://fonts.googleapis.com/css2?family=Inconsolata&display=swap',
    'https://fonts.gstatic.com/s/inconsolata/v20/QldgNThLqRwH-OJ1UHjlKENVzkWGVkL3GZQmAwLYxYWI2qfdm7Lpp4U8WR32kXWdycuJDA.woff',
    '/site.webmanifest',
    '/favicon.ico',
    '/favicon-96x96.png',
    '/robots.txt',
    '/humans.txt',
];

/**
 * Follows the bundles the homepage loads (including lazy chunks like the contact dialog),
 * so the portfolio page, which this worker does not control, does not get precached.
 */
async function collectHomeAssets(outDir) {
    const found = new Set();

    const visit = async (file) => {
        if (found.has(file)) return;
        found.add(file);
        if (!file.endsWith('.js') && !file.endsWith('.css')) return;

        const code = await readFile(join(outDir, ASSETS_DIR, file), 'utf-8');
        for (const [, ref] of code.matchAll(REFERENCE)) {
            const name = ref.split('/').pop();
            if (existsSync(join(outDir, ASSETS_DIR, name))) await visit(name);
        }
    };

    const html = await readFile(join(outDir, 'index.html'), 'utf-8');
    for (const [, file] of html.matchAll(
        new RegExp(`/${ASSETS_DIR}/([\\w.-]+)`, 'g'),
    ))
        await visit(file);

    return [...found].sort().map((file) => `/${ASSETS_DIR}/${file}`);
}

/** Writes `/sw.js`: precaches the homepage and serves its assets cache-first. */
export default function serviceWorker() {
    return {
        name: 'frsource:service-worker',
        hooks: {
            'astro:build:done': async ({ dir }) => {
                const outDir = fileURLToPath(dir);
                const urls = ['/', ...(await collectHomeAssets(outDir))];

                const hash = createHash('sha1');
                hash.update(await readFile(join(outDir, 'index.html')));
                for (const url of urls.slice(1))
                    hash.update(await readFile(join(outDir, url)));

                const template = await readFile(
                    join(
                        dirname(fileURLToPath(import.meta.url)),
                        'sw.template.js',
                    ),
                    'utf-8',
                );
                await writeFile(
                    join(outDir, 'sw.js'),
                    template
                        .replace(
                            '__PRECACHE__',
                            JSON.stringify([...EXTRA_URLS, ...urls], null, 4),
                        )
                        .replace(
                            '__VERSION__',
                            hash.digest('hex').slice(0, 12),
                        ),
                );
            },
        },
    };
}
