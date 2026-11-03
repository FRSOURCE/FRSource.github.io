/// <reference lib="dom" />

import type { ContactDialogCtrl } from '../contactDialog';
import { initGlitch } from '../common/glitch';
import { initThemeButtons } from '../common/theme';
import { prefetchWhenIdle } from '../common/idle';

const DESKTOP = '(orientation: landscape) and (min-width: 920px)';

initThemeButtons();
initGlitch();
prefetchWhenIdle([
    () => import('../contactDialog'),
    () => import('../common/glitch.veil'),
]);

// ---- contact: mailto links open the shared contact dialog when JS is on -----

let contactDialogCtrl: ContactDialogCtrl | undefined;

async function openContact(message?: string) {
    if (!contactDialogCtrl) {
        const contactDialogModule = await import('../contactDialog').catch(
            () => undefined,
        );
        if (!contactDialogModule) return false;
        contactDialogCtrl = new contactDialogModule.ContactDialogCtrl();
        document.body
            .querySelector('.content')!
            .insertAdjacentElement('afterbegin', contactDialogCtrl.element);
    }
    contactDialogCtrl.isShown()
        ? contactDialogCtrl.hide()
        : contactDialogCtrl.show(message);
    return true;
}

document.querySelectorAll<HTMLAnchorElement>('[data-contact]').forEach((el) =>
    el.addEventListener('click', async (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0)
            return;
        e.preventDefault();
        // on failure fall back to the mailto link
        if (!(await openContact(el.dataset.contactMessage)))
            location.href = el.href;
    }),
);

// ---- deck: laid out by CSS, only made interactive once the viewport is desktop-sized

const mql = matchMedia(DESKTOP);
const loadDeck = () => import('./deck').then((m) => m.initDeck(mql));

if (mql.matches) loadDeck();
else mql.addEventListener('change', loadDeck, { once: true });
