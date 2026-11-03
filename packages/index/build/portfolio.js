/**
 * Renders the project list of the portfolio page from src/portfolio/projects.json.
 *
 *   pnpm portfolio
 *
 * Rewrites the blocks between the `projects:start/end` and `jsonld:start/end`
 * markers in src/portfolio/index.html. Run it after editing projects.json
 * (newest project first) and commit both files.
 */
const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');

const ROOT = resolve(__dirname, '..', 'src', 'portfolio');
const PAGE_URL = 'https://www.frsource.org/portfolio/';
const CONTACT = 'hi@frsource.org';

const projects = JSON.parse(
    readFileSync(resolve(ROOT, 'projects.json'), 'utf-8'),
);

const esc = (s) =>
    String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
const pad = (n) => String(n).padStart(2, '0');

const mailto = (p) =>
    `mailto:${CONTACT}?subject=${encodeURIComponent('A project like ' + p.name)}`;
const message = (p) =>
    `Hi! I like what you did with ${p.name} and would like something similar. `;

function renderProject(p, i) {
    const img = `./img/${p.id}`;
    const ext = (url, label, shown = label) =>
        `<a href="${esc(url)}" target="_blank" rel="nofollow noopener" title="${esc(label)} (opens in a new window)">${esc(shown)}<span class="sr-only"> (opens in a new window)</span> <span aria-hidden="true">↗</span></a>`;
    const extra = (p.links || []).map((l) => ext(l.url, l.label)).join(' ');
    const picture = p.noImage
        ? `<div class="window__fallback" role="img" aria-label="No screenshot available, the site is offline"><span aria-hidden="true">${esc(p.name)}</span></div>`
        : `<picture>
                        <source type="image/webp" srcset="${img}-sm.webp 640w, ${img}.webp 1280w" sizes="(min-width: 920px) 36vw, 90vw" />
                        <img src="${img}.jpg" width="1280" height="800" alt="${esc(p.alt)}" loading="lazy" decoding="async" />
                    </picture>`;
    const figureElement = `
                        <figure class="window">
                            <div class="window__chrome" aria-hidden="true"><i></i><i></i><i></i><span>${esc(p.host)}</span></div>
                            ${picture}
                        </figure>`;
    const link = !p.url
        ? `<span>${figureElement}${esc(p.host)}</span>`
        : p.internal
          ? `<a href="${esc(p.url)}" title="Open ${esc(p.host)}">${figureElement}${esc(p.host)}</a>`
          : ext(p.url, `Visit ${p.host}`, p.host);
    return `<li class="project" id="${p.id}">
    <article aria-labelledby="${p.id}-name">
        <details name="work">
            <summary>
                <span class="project__n" aria-hidden="true">${pad(i + 1)}</span>
                <h2 class="project__name" id="${p.id}-name">${esc(p.name)}</h2>
                <span class="project__year"><span class="sr-only">Year: </span>${esc(p.year)}</span>
                <span class="project__chev" aria-hidden="true"></span>
            </summary>
            <div class="project__body">
                <p class="project__url">${link}${extra ? ` ${extra}` : ''}</p>
                <ul class="project__stack" aria-label="Tech stack">${p.stack.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
                <p class="project__desc">${esc(p.description)}</p>${p.note ? `\n                <p class="project__note">${esc(p.note)}</p>` : ''}
                <div class="d-f">
                    <button type="button" class="btn fill project__cta mt-3" href="${mailto(p)}" data-contact data-contact-message="${esc(message(p))}">
                        <span class="d-ib topline"><small class="topline__item">just&nbsp;</small><span class="topline__item">Build something like this</span></span>
                    </button>
                </div>
            </div>
        </details>
    </article>
</li>`;
}

function renderJsonLd() {
    return JSON.stringify(
        {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Our work - FRSOURCE',
            url: PAGE_URL,
            isPartOf: {
                '@type': 'WebSite',
                name: 'FRSOURCE',
                url: 'https://www.frsource.org/',
            },
            mainEntity: {
                '@type': 'ItemList',
                numberOfItems: projects.length,
                itemListElement: projects.map((p, i) => ({
                    '@type': 'ListItem',
                    position: i + 1,
                    item: {
                        '@type': 'CreativeWork',
                        name: p.name,
                        url: p.url || `${PAGE_URL}#${p.id}`,
                        dateCreated: String(p.year),
                        description: p.description,
                        keywords: p.stack.join(', '),
                        creator: {
                            '@type': 'Organization',
                            name: 'FRSOURCE',
                            url: 'https://www.frsource.org/',
                        },
                    },
                })),
            },
        },
        null,
        4,
    );
}

function replaceBlock(html, name, content) {
    const re = new RegExp(
        `(<!-- ${name}:start -->)[\\s\\S]*?(<!-- ${name}:end -->)`,
    );
    if (!re.test(html))
        throw new Error(`Missing ${name} markers in index.html`);
    return html.replace(re, (_, a, b) => `${a}\n${content}\n${b}`);
}

const file = resolve(ROOT, 'index.html');
let html = readFileSync(file, 'utf-8');
html = replaceBlock(html, 'projects', projects.map(renderProject).join('\n'));
html = replaceBlock(
    html,
    'jsonld',
    `<script type="application/ld+json">\n${renderJsonLd()}\n</script>`,
);
writeFileSync(file, html);
console.log(
    `Rendered ${projects.length} projects into src/portfolio/index.html`,
);
