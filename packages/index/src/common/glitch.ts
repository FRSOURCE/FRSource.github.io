export const KEY = 'FRS:glitch';
export const COVER_CLASS = 'glitch-cover';
export const REVEAL_CLASS = 'glitch-in';
const MAX_AGE = 4000;

export type Direction = 'fwd' | 'back';

const reducedMotion = () =>
    matchMedia('(prefers-reduced-motion: reduce)').matches;

// the veil animation is only needed when a transition actually happens
const loadVeil = () => import('./glitch.veil');

function clearCover() {
    document.documentElement.classList.remove(COVER_CLASS);
    try {
        sessionStorage.removeItem(KEY);
    } catch {}
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
        if (e.persisted) {
            clearCover();
            document.querySelectorAll('.veil').forEach((el) => el.remove());
        }
    });

    const incoming = readFlag();
    if (incoming) {
        const clearVeil = () =>
            loadVeil().then((m) => m.clearVeil(), clearCover);
        if (reducedMotion()) clearCover();
        else
            loadVeil()
                .then((m) => m.reveal(incoming))
                .catch(clearCover);
        // safety net: never leave the page covered
        setTimeout(clearVeil, 3000);
    } else {
        root.classList.remove(COVER_CLASS);
    }

    document
        .querySelectorAll<HTMLAnchorElement>('a[data-glitch]')
        .forEach((link) => {
            for (const ev of ['pointerenter', 'focus', 'touchstart'])
                link.addEventListener(ev, loadVeil, {
                    once: true,
                    passive: true,
                });
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
                let veil: Awaited<ReturnType<typeof loadVeil>> | undefined;
                try {
                    veil = await loadVeil();
                    await veil.cover(dir);
                    sessionStorage.setItem(KEY, `${dir}:${Date.now()}`);
                } catch {}
                // navigation can be cancelled or restored from bfcache
                setTimeout(() => veil?.clearVeil() ?? clearCover(), 2500);
                location.assign(link.href);
            });
        });
}
