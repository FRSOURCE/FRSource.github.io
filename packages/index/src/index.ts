/// <reference lib="dom" />

import 'regenerator-runtime/runtime';
import './index.scss';
import type { ContactDialogCtrl } from './contactDialog';
import domready from 'domready';
import { startLogoAnimation } from './logo.ctrl';

(async () => {
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const loadEls = document.body.querySelectorAll('.load-fadeinup');

        domready(() =>
            setTimeout(
                () =>
                    loadEls.forEach((el, i) =>
                        setTimeout(() => el.classList.add('in'), 300 * i),
                    ),
                500,
            ),
        );

        const logo = document.querySelector<SVGSVGElement>('.icon-logomark')!;

        startLogoAnimation(logo);
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
                await contactDialogModule.ContactDialogCtrl.templateLoader;

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

    const themes: string[] = [];
    document.body.querySelectorAll('.btn[data-theme]').forEach((btn) => {
        const theme = btn.getAttribute('data-theme')!;
        themes.push(theme);
        btn.addEventListener('click', () => {
            localStorage.setItem('FRS:theme', theme);
            themes.forEach((theme) =>
                document.body.classList.remove('t-' + theme),
            );
            document.body.classList.add('t-' + theme);
        });
    });

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register(new URL('./serviceWorker.ts', import.meta.url), {
                type: 'module',
            })
            .catch((err) =>
                console.log('Service worker registration failed: ' + err),
            );
    }
})();
