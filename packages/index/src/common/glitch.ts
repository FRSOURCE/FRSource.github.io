const KEY = 'FRS:glitch';
const MAX_AGE = 4000;
const COVER_CLASS = 'glitch-cover';
const REVEAL_CLASS = 'glitch-in';

type Direction = 'fwd' | 'back';

const rnd = (min: number, max: number) => Math.random() * (max - min) + min;
const reducedMotion = () =>
    matchMedia('(prefers-reduced-motion: reduce)').matches;

const EASE = 'cubic-bezier(.2,.8,.2,1)';
const FRINGE_DELAYS = [0, 35, 80];

function createVeil(startCovered: boolean, offset: number) {
    const veil = document.createElement('div');
    veil.className = 'veil';
    veil.setAttribute('aria-hidden', 'true');

    const bands: HTMLElement[][] = [];
    for (let y = 0, h = innerHeight; y < h;) {
        const height = Math.min(h - y, Math.round(rnd(22, 92)));
        const band = document.createElement('div');
        band.className = 'veil__band';
        band.style.top = `${y}px`;
        band.style.height = `${height + 1}px`;

        const fringes = ['veil__fringe--coral', 'veil__fringe--teal'].map(
            (mod) => {
                const el = document.createElement('div');
                el.className = `veil__fringe ${mod}`;
                return el;
            },
        );
        const fill = document.createElement('div');
        fill.className =
            'veil__fill' + (Math.random() < 0.28 ? ' veil__fill--grad' : '');
        const layers = [...fringes, fill];
        band.append(...layers);
        bands.push(layers);
        veil.appendChild(band);
        y += height;
    }
    if (!startCovered) {
        bands.flat().forEach((el) => {
            el.style.transform = `translateX(${offset}px)`;
        });
    }
    document.body.appendChild(veil);
    return { veil, bands };
}

function sweep(
    bands: HTMLElement[][],
    from: number,
    to: number,
): Promise<unknown> {
    return Promise.all(
        bands.flatMap((layers) => {
            const base = rnd(0, 260);
            const duration = rnd(240, 380);
            return layers.map(
                (el, i) =>
                    el.animate(
                        [
                            { transform: `translateX(${from}px)` },
                            { transform: `translateX(${to}px)` },
                        ],
                        {
                            duration,
                            delay: base + FRINGE_DELAYS[i],
                            easing: EASE,
                            fill: 'both',
                        },
                    ).finished,
            );
        }),
    );
}

function shake(el: Element, steps: number) {
    el.animate(
        Array.from({ length: 9 }, () => ({
            translate: `${rnd(-9, 9)}px ${rnd(-3, 3)}px`,
        })).concat([{ translate: '0 0' }]),
        { duration: 140 * steps, easing: 'steps(1)' },
    );
}

const offsetFor = (dir: Direction) =>
    (dir === 'fwd' ? 1 : -1) * (innerWidth + 60);

let activeVeil: HTMLElement | undefined;

function clearVeil() {
    activeVeil?.remove();
    activeVeil = undefined;
    document.documentElement.classList.remove(COVER_CLASS);
    try {
        sessionStorage.removeItem(KEY);
    } catch {}
}

/** Covers the screen with glitching bands, then resolves. */
async function cover(dir: Direction) {
    const offset = offsetFor(dir);
    const { veil, bands } = createVeil(false, offset);
    activeVeil = veil;
    const main = document.querySelector('main');
    if (main) shake(main, 5);
    await sweep(bands, offset, 0);
}

/** Runs on the destination page: bands start covering the screen and leave. */
async function reveal(dir: Direction) {
    const offset = offsetFor(dir);
    const { veil, bands } = createVeil(true, offset);
    activeVeil = veil;
    const root = document.documentElement;
    root.classList.remove(COVER_CLASS);
    shake(veil, 1);
    await new Promise((resolve) => setTimeout(resolve, 140));
    root.classList.add(REVEAL_CLASS);
    await sweep(bands, 0, -offset);
    veil.remove();
    activeVeil = undefined;
    setTimeout(() => root.classList.remove(REVEAL_CLASS), 1000);
}

function readFlag(): Direction | undefined {
    try {
        const [dir, time] = (sessionStorage.getItem(KEY) || '').split(':');
        sessionStorage.removeItem(KEY);
        if ((dir === 'fwd' || dir === 'back') && Date.now() - +time < MAX_AGE)
            return dir;
    } catch {}
}

/**
 * Progressive enhancement over a normal navigation: links with
 * `data-glitch="fwd|back"` get a glitch sweep, everything else is untouched.
 */
export function initGlitch() {
    const root = document.documentElement;

    addEventListener('pageshow', (e) => {
        if (e.persisted) clearVeil();
    });

    const incoming = readFlag();
    if (incoming) {
        if (reducedMotion()) clearVeil();
        else reveal(incoming).catch(clearVeil);
        // safety net: never leave the page covered
        setTimeout(clearVeil, 3000);
    } else {
        root.classList.remove(COVER_CLASS);
    }

    document
        .querySelectorAll<HTMLAnchorElement>('a[data-glitch]')
        .forEach((link) =>
            link.addEventListener('click', async (e) => {
                if (
                    reducedMotion() ||
                    e.defaultPrevented ||
                    e.button !== 0 ||
                    e.metaKey ||
                    e.ctrlKey ||
                    e.shiftKey ||
                    e.altKey ||
                    (link.target && link.target !== '_self') ||
                    link.origin !== location.origin
                )
                    return;

                e.preventDefault();
                const dir = link.dataset.glitch as Direction;
                try {
                    await cover(dir);
                    sessionStorage.setItem(KEY, `${dir}:${Date.now()}`);
                } catch {}
                // navigation can be cancelled or restored from bfcache
                setTimeout(clearVeil, 2500);
                location.assign(link.href);
            }),
        );
}
