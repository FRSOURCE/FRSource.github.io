import { COVER_CLASS, KEY, REVEAL_CLASS, type Direction } from './glitch';

const rnd = (min: number, max: number) => Math.random() * (max - min) + min;

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

export function clearVeil() {
    activeVeil?.remove();
    activeVeil = undefined;
    document.documentElement.classList.remove(COVER_CLASS);
    try {
        sessionStorage.removeItem(KEY);
    } catch {}
}

/** Covers the screen with glitching bands, then resolves. */
export async function cover(dir: Direction) {
    const offset = offsetFor(dir);
    const { veil, bands } = createVeil(false, offset);
    activeVeil = veil;
    const main = document.querySelector('main');
    if (main) shake(main, 5);
    await sweep(bands, offset, 0);
}

/** Runs on the destination page: bands start covering the screen and leave. */
export async function reveal(dir: Direction) {
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
