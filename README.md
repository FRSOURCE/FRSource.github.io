# Source project for frsource.github.io

code is licensed under [MIT](https://github.com/FRSOURCE/FRSource.github.io/blob/dev/LICENSE),
text content, all markdown files, words, images are licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).

## Portfolio page (`/portfolio/`)

Lives in `packages/index/src/pages/portfolio/index.astro`. The project list is the single source of truth in `packages/index/src/portfolio/projects.json`, newest first. The markup (`components/Project.astro`) and the JSON-LD are rendered from it at build time, there is nothing to regenerate.

### Add or edit a project

1. Add screenshots to `packages/index/src/portfolio/img/`, 16:10, named after the project `id`:
    - `<id>.jpg` and `<id>.webp` at 1280x800,
    - `<id>-sm.webp` at 640x400.
2. Add an entry to `projects.json` (the order in the file is the order on the page):

    | field         | meaning                                                                     |
    | ------------- | --------------------------------------------------------------------------- |
    | `id`          | slug, used for image names and the `#anchor`                                |
    | `name`        | project name (the `h2`)                                                     |
    | `host`        | address shown to visitors                                                   |
    | `url`         | link target, or `null` when there is nothing to link to                     |
    | `year`        | only the year is shown                                                      |
    | `stack`       | list of technologies                                                        |
    | `description` | what it is and what we did                                                  |
    | `note`        | optional highlight line                                                     |
    | `alt`         | factual alt text for the screenshot                                         |
    | `internal`    | optional, `true` for links to frsource.org itself (same tab, no `nofollow`) |
    | `links`       | optional extra links, `[{ "label": "...", "url": "..." }]`, e.g. app stores |
    | `noImage`     | optional, `true` renders a gradient placeholder instead of a screenshot     |

3. Check it with `pnpm start` (or `pnpm build && pnpm preview`), then open `/portfolio/` on desktop and mobile widths.

External links get `rel="nofollow noopener"` automatically. Each project also gets a "Build something like this" link that opens the contact form with a pre-filled message (a `mailto:` link without JS).

### How it works

- Without JS (and on small screens) it is a plain list of `<details>` elements, closed by default.
- `src/portfolio/portfolio.ts` upgrades it to the "Browser Deck" on landscape screens of 920px and wider.
- The glitch sweep between `/` and `/portfolio/` is progressive enhancement over a normal link click (`data-glitch` attribute, `src/common/glitch.ts`). It is skipped with `prefers-reduced-motion`.

## Home and portfolio pages (`packages/index`)

An [Astro](https://astro.build) static site styled with [Tailwind CSS](https://tailwindcss.com) (v4, utilities only, no preflight) and plain CSS in `src/styles/`. The only client code is small vanilla TypeScript (`src/index.ts`, `src/portfolio/portfolio.ts`).

- `pnpm start` runs the dev server (`/blog` is proxied to the blog's dev server).
- `pnpm build` writes the site to the repository's `public/` folder (the blog is added there by its own build), generates the favicons and `sw.js` (precaches the homepage, see `build/serviceWorker.mjs`).
- Static files that must be copied as they are (`robots.txt`, `sitemap.xml`, `logo.*`, ...) live in `packages/index/public/`.
- Theme tokens (colors, spacing, breakpoints) are in the `@theme` block of `src/styles/global.css`. The `dark:` variant follows `prefers-color-scheme` unless a visitor picked a theme (`body.t-light` / `body.t-dark`).
