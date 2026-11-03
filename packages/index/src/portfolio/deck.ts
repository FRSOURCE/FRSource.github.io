/// <reference lib="dom" />

// projects as a stack of browser windows on desktop: markup is static (Deck.astro,
// DeckNav.astro), this only wires up the interaction

const content = document.querySelector<HTMLElement>('.content')!;
const items = [...content.querySelectorAll<HTMLLIElement>('.project')];

let current = 0;
const windows = [...content.querySelectorAll<HTMLElement>('.deck .win')];
const nav = content.querySelector<HTMLElement>('.deck-nav')!;
const status = content.querySelector<HTMLElement>('[data-deck=status]')!;
const dots = [...nav.querySelectorAll<HTMLButtonElement>('.deck-nav__dot')];

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
    if (announce) {
        content.classList.add('deck-used');
        status.textContent = `Project ${current + 1} of ${items.length}: ${nameOf(current)}`;
    }
}

windows.forEach((win, i) => win.addEventListener('click', () => select(i)));
dots.forEach((dot, i) => dot.addEventListener('click', () => select(i)));
nav.querySelector('[data-deck=prev]')!.addEventListener('click', () =>
    select(current - 1),
);
nav.querySelector('[data-deck=next]')!.addEventListener('click', () =>
    select(current + 1),
);
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

export function initDeck(mql: MediaQueryList) {
    // in deck mode the open project cannot be collapsed
    content.addEventListener('click', (e) => {
        if (mql.matches && (e.target as Element).closest('summary'))
            e.preventDefault();
    });

    const sync = () => {
        items.forEach((li) => {
            const summary = li.querySelector('summary')!;
            if (mql.matches) summary.setAttribute('tabindex', '-1');
            else summary.removeAttribute('tabindex');
        });
        if (mql.matches) select(current, false);
    };
    mql.addEventListener('change', sync);
    sync();
}
