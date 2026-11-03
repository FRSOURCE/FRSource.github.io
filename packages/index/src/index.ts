/// <reference lib="dom" />

import type { ContactDialogCtrl } from './contactDialog';
import { startLogoAnimation } from './logo.ctrl';
import { initGlitch } from './common/glitch';
import { initThemeButtons } from './common/theme';
import { prefetchWhenIdle } from './common/idle';

const INTRO_KEY = 'FRS:intro';

(async () => {
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const logo = document.querySelector<SVGSVGElement>('.icon-logomark')!;

        if (document.documentElement.classList.contains('intro-done')) {
            // intro already seen: content is shown as is, logo just keeps glitching
            startLogoAnimation(logo, true);
        } else {
            const loadEls = document.body.querySelectorAll('.load-fadeinup');

            const faded = new Promise<void>((resolve) => {
                const reveal = () =>
                    setTimeout(() => {
                        loadEls.forEach((el, i) =>
                            setTimeout(() => el.classList.add('in'), 300 * i),
                        );
                        // last element starts at 300 * (n - 1), its animation lasts 600ms
                        setTimeout(resolve, 300 * loadEls.length + 600);
                    }, 500);

                if (document.readyState === 'loading')
                    document.addEventListener('DOMContentLoaded', reveal);
                else reveal();
            });

            // remember the intro only once it has played to the end
            Promise.all([startLogoAnimation(logo), faded]).then(() => {
                try {
                    localStorage.setItem(INTRO_KEY, '1');
                } catch {}
            });
        }
    }

    let contactDialogCtrl: ContactDialogCtrl;

    document.body
        .querySelector<HTMLButtonElement>('.btn--contact')!
        .addEventListener('click', async function () {
            if (!contactDialogCtrl) {
                this.disabled = true;
                const contactDialogModule =
                    await import('./contactDialog').catch(
                        () => (this.disabled = false as false),
                    );
                if (!contactDialogModule) return;
                contactDialogCtrl = new contactDialogModule.ContactDialogCtrl();

                document.body
                    .querySelector('.content')!
                    .insertAdjacentElement(
                        'afterbegin',
                        contactDialogCtrl.element,
                    );
                this.disabled = false;
            }

            contactDialogCtrl.isShown()
                ? contactDialogCtrl.hide()
                : contactDialogCtrl.show();
        });

    initThemeButtons();
    initGlitch();
    prefetchWhenIdle([
        () => import('./contactDialog'),
        () => import('./common/glitch.veil'),
    ]);

    if (import.meta.env.PROD && 'serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('/sw.js')
            .catch((err) =>
                console.log('Service worker registration failed: ' + err),
            );
    }
})();
