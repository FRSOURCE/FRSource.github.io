/**
 * Shared by every inner page. The "← Homepage" link goes back to the page the visitor came from
 * when that was another page of this site. The homepage link then takes the place of the link
 * to that page in the right part of the nav, so both ways stay one click away.
 *
 * Markup: `[data-back]` is the back link, `[data-page-link="/path/"]` marks the nav link that
 * points to a page. Run it before `initGlitch`, which reads `data-glitch` when it starts.
 */

const PAGES: Record<string, { label: string; title: string }> = {
    '/portfolio/': {
        label: 'Our work',
        title: 'Back to the websites and apps we have built',
    },
    '/factory/': {
        label: 'Software factory',
        title: 'Back to the software factory page',
    },
};

export function initBackLink() {
    try {
        const back = document.querySelector<HTMLAnchorElement>('[data-back]');
        if (!back || !document.referrer) return;

        const from = new URL(document.referrer);
        const page = PAGES[from.pathname];
        if (from.origin !== location.origin || !page) return;
        if (from.pathname === location.pathname) return;

        back.href = from.pathname;
        back.title = page.title;
        back.textContent = `← ${page.label}`;

        // the nav link that pointed there now leads to the homepage
        const swap = document.querySelector<HTMLAnchorElement>(
            `[data-page-link="${from.pathname}"]`,
        );
        if (swap) {
            swap.href = '/';
            swap.title = 'Back to the FRSOURCE homepage';
            swap.textContent = 'Homepage';
            swap.classList.remove('nav-work');
            swap.dataset.glitch = 'back';
        }
    } catch {}
}
