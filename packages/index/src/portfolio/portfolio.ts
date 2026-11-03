/// <reference lib="dom" />

import 'regenerator-runtime/runtime';
import './portfolio.scss';
import type { ContactDialogCtrl } from '../contactDialog';
import { initGlitch } from '../common/glitch';
import { initThemeButtons } from '../common/theme';

const DESKTOP = '(orientation: landscape) and (min-width: 920px)';

initThemeButtons();
initGlitch();

// ---- contact: mailto links open the shared contact dialog when JS is on -----

let contactDialogCtrl: ContactDialogCtrl | undefined;

async function openContact(message?: string) {
    if (!contactDialogCtrl) {
        const contactDialogModule = await import('../contactDialog').catch(
            () => undefined,
        );
        if (!contactDialogModule) return false;
        contactDialogCtrl = new contactDialogModule.ContactDialogCtrl();
        await contactDialogModule.ContactDialogCtrl.templateLoader;
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

// ---- deck: projects as a stack of browser windows on desktop ----------------

const content = document.querySelector<HTMLElement>('.content')!;
const workHead = content.querySelector<HTMLElement>('.work__head')!;
const items = [...content.querySelectorAll<HTMLLIElement>('.project')];

let current = 0;
let deck: HTMLElement | undefined;
let nav: HTMLElement | undefined;
let status: HTMLElement | undefined;
let windows: HTMLElement[] = [];
let dots: HTMLButtonElement[] = [];

const pad = (n: number) => String(n).padStart(2, '0');
const nameOf = (i: number) =>
    items[i].querySelector('.project__name')!.textContent!.trim();

function select(index: number, announce = true) {
    current = (index + items.length) % items.length;

    items.forEach((li, i) => {
        li.classList.toggle('is-active', i === current);
        li.querySelector('details')!.open = i === current;
    });
    windows.forEach((win, i) => {
        const p = (i - current + items.length) % items.length;
        win.style.setProperty('--p', String(p));
        if (p > 4) win.setAttribute('data-far', '');
        else win.removeAttribute('data-far');
    });
    dots.forEach((dot, i) => {
        if (i === current) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
        dot.tabIndex = i === current ? 0 : -1;
    });
    if (announce && status)
        status.textContent = `Project ${current + 1} of ${items.length}: ${nameOf(current)}`;
}

function buildDeck() {
    deck = document.createElement('div');
    deck.className = 'deck';
    deck.setAttribute('aria-hidden', 'true');
    windows = items.map((li, i) => {
        const win = document.createElement('button');
        win.type = 'button';
        win.tabIndex = -1;
        win.className = 'win';
        const figure = li
            .querySelector('.window')!
            .cloneNode(true) as HTMLElement;
        const img = figure.querySelector('img');
        if (img) img.alt = '';
        figure.querySelector('[role=img]')?.removeAttribute('role');
        win.append(...figure.childNodes);
        win.addEventListener('click', () => select(i));
        deck!.appendChild(win);
        return win;
    });

    nav = document.createElement('div');
    nav.className = 'deck-nav';
    nav.setAttribute('role', 'group');
    nav.setAttribute('aria-label', 'Projects');
    const prev = Object.assign(document.createElement('button'), {
        type: 'button',
        className: 'btn text',
        textContent: '← prev',
    });
    const next = Object.assign(document.createElement('button'), {
        type: 'button',
        className: 'btn text',
        textContent: 'next →',
    });
    prev.addEventListener('click', () => select(current - 1));
    next.addEventListener('click', () => select(current + 1));

    const list = document.createElement('div');
    list.className = 'deck-nav__dots';
    dots = items.map((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'deck-nav__dot';
        dot.setAttribute('aria-label', `Project ${i + 1}: ${nameOf(i)}`);
        dot.addEventListener('click', () => select(i));
        list.appendChild(dot);
        return dot;
    });
    nav.addEventListener('keydown', (e) => {
        const step = {
            ArrowRight: 1,
            ArrowDown: 1,
            ArrowLeft: -1,
            ArrowUp: -1,
        }[e.key as 'ArrowRight'];
        const target = e.target as HTMLElement;
        if (step === undefined || !dots.includes(target as HTMLButtonElement))
            return;
        e.preventDefault();
        select(current + step);
        dots[current].focus();
    });
    nav.append(prev, list, next);

    status = document.createElement('p');
    status.className = 'sr-only';
    status.setAttribute('role', 'status');
}

function enableDeck() {
    if (content.classList.contains('is-deck')) return;
    if (!deck) buildDeck();
    content.classList.add('is-deck');
    content.insertAdjacentElement('afterbegin', deck!);
    workHead.insertAdjacentElement('afterend', status!);
    workHead.insertAdjacentElement('afterend', nav!);
    items.forEach((li) =>
        li.querySelector('summary')!.setAttribute('tabindex', '-1'),
    );
    select(current, false);
}

function disableDeck() {
    if (!content.classList.contains('is-deck')) return;
    content.classList.remove('is-deck');
    deck!.remove();
    nav!.remove();
    status!.remove();
    items.forEach((li) => {
        li.classList.remove('is-active');
        li.querySelector('summary')!.removeAttribute('tabindex');
    });
}

// in deck mode the open project cannot be collapsed
content.addEventListener('click', (e) => {
    if (
        content.classList.contains('is-deck') &&
        (e.target as Element).closest('summary')
    )
        e.preventDefault();
});

const mql = matchMedia(DESKTOP);
const sync = () => (mql.matches ? enableDeck() : disableDeck());
mql.addEventListener('change', sync);
sync();
