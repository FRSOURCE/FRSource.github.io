/// <reference lib="dom" />

import type { ContactDialogCtrl } from '../contactDialog';
import { attach as autoresize } from '@frsource/autoresize-textarea';
import { initBackLink } from '../common/backlink';
import { initGlitch } from '../common/glitch';
import { initThemeButtons } from '../common/theme';
import { prefetchWhenIdle } from '../common/idle';
import {
    FEATURES,
    INCLUDED,
    TYPES,
    estimate,
    formatMoney,
    type DesignState,
    type ProjectType,
    type Speed,
} from './estimate';

initBackLink();
initThemeButtons();
initGlitch();
prefetchWhenIdle([
    () => import('../contactDialog'),
    () => import('../common/glitch.veil'),
]);

const scroller = document.querySelector<HTMLElement>('main')!;
const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));

// ---- contact ---------------------------------------------------------------

let contactDialogCtrl: ContactDialogCtrl | undefined;

async function openContact(message?: string) {
    if (!contactDialogCtrl) {
        const mod = await import('../contactDialog').catch(() => undefined);
        if (!mod) return false;
        contactDialogCtrl = new mod.ContactDialogCtrl();
        document.body.insertAdjacentElement(
            'afterbegin',
            contactDialogCtrl.element,
        );
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
        if (!(await openContact(el.dataset.contactMessage)))
            location.href = el.href;
    }),
);

// in-page anchors scroll the <main> element, smoothly unless the visitor opted out
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href')!);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
        history.replaceState(null, '', a.getAttribute('href'));
    }),
);

// ---- scroll motion ---------------------------------------------------------
// JS only writes progress numbers (--in, --t, --pp, --cover) on elements,
// the look ("Depth" for the page, "Stack" for the process steps) is in factory.css.

const root = document.documentElement;
const reveals = [...document.querySelectorAll<HTMLElement>('[data-r]')];
const depths = [...document.querySelectorAll<HTMLElement>('[data-depth]')];
const heroEl = document.querySelector<HTMLElement>('.f-hero')!;
const pipeline = document.querySelector<HTMLElement>('.pipeline');
const stack = [...document.querySelectorAll<HTMLElement>('.pipeline .step')];
const heroSub = heroEl.querySelector<HTMLElement>('.f-sub__in');
// phones: the hero description scrolls away before the factory starts to build (see factory.css)
const phone = matchMedia('(max-width: 919px)');

// stagger index inside a group
document
    .querySelectorAll<HTMLElement>('[data-stagger]')
    .forEach((group) =>
        [...group.children].forEach((child, i) =>
            (child as HTMLElement).style.setProperty('--i', String(i)),
        ),
    );

// writing a custom property restyles the element (and everything below it) even when the value
// is the same, so only write what changed
const written = new WeakMap<HTMLElement, Map<string, string>>();
function setVar(el: HTMLElement, name: string, value: string) {
    let vars = written.get(el);
    if (!vars) written.set(el, (vars = new Map()));
    if (vars.get(name) === value) return;
    vars.set(name, value);
    el.style.setProperty(name, value);
}

let ticking = false;
function update() {
    ticking = false;
    const vh = scroller.clientHeight;
    const top0 = scroller.getBoundingClientRect().top;
    // the page has a frame (body padding), so "one screen" is the scrolling area, not the viewport
    setVar(root, '--main-h', `${vh}px`);
    const frame = scroller.getBoundingClientRect();
    setVar(root, '--main-top', `${frame.top}px`);
    setVar(root, '--main-left', `${frame.left}px`);
    setVar(root, '--main-w', `${frame.width}px`);

    // read every position first, write afterwards: no layout work between the writes
    const rects = reveals.map((el) => el.getBoundingClientRect());
    const depthRects = depths.map((el) => el.getBoundingClientRect());
    const pipelineRect = pipeline?.getBoundingClientRect();
    const stackTops = stack.map((el) => el.getBoundingClientRect().top - top0);
    // at the very bottom nothing can scroll any further, so nothing may stay half-faded
    const subH = phone.matches ? heroSub?.offsetHeight : undefined;
    const atBottom =
        scroller.scrollTop > 0 &&
        scroller.scrollTop + vh >= scroller.scrollHeight - 2;

    reveals.forEach((el, n) => {
        const r = rects[n];
        const top = r.top - top0;
        const i = +(el.style.getPropertyValue('--i') || 0);
        const raw = (vh * 0.96 - top) / (vh * 0.34);
        const isIn =
            atBottom && el.closest('.f-final')
                ? 1
                : clamp(raw * 1.25 - i * 0.18);
        setVar(el, '--in', isIn.toFixed(3));
        setVar(el, '--t', clamp((vh - top) / (vh + r.height)).toFixed(3));
    });
    depths.forEach((el, n) => {
        const r = depthRects[n];
        setVar(
            el,
            '--t',
            clamp((vh - (r.top - top0)) / (vh + r.height)).toFixed(3),
        );
    });

    if (root.dataset.motion !== 'off') {
        // pinned hero: scrolling through it builds the factory
        const p = clamp(scroller.scrollTop / (heroEl.offsetHeight - vh));
        if (subH) {
            setVar(heroEl, '--sub-h', `${subH}px`);
            setVar(heroEl, '--away', clamp(p / 0.12).toFixed(3));
            setStage(p < 0.12 ? 0 : p < 0.4 ? 1 : p < 0.68 ? 2 : 3);
        } else {
            setVar(heroEl, '--away', '0');
            setStage(p < 0.06 ? 0 : p < 0.36 ? 1 : p < 0.66 ? 2 : 3);
        }
    }

    if (pipeline && pipelineRect) {
        setVar(
            pipeline,
            '--pp',
            clamp(
                (vh * 0.75 - (pipelineRect.top - top0)) /
                    (pipelineRect.height * 0.9),
            ).toFixed(3),
        );
    }
    // stacked cards: how far the next card has slid over this one
    stack.forEach((card, i) => {
        const next = stackTops[i + 1];
        const cover = next === undefined ? 0 : clamp((vh - next) / (vh * 0.8));
        setVar(card, '--cover', cover.toFixed(3));
    });
}

function request() {
    if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
    }
}

// ---- hero ------------------------------------------------------------------
// The text types itself in on load (.is-run). The hero is pinned for three screens and the
// scroll position says how much of the factory is built: .s1 .s2 .s3 on the hero.

let stage = -1;
function setStage(n: number) {
    if (n === stage) return;
    stage = n;
    [1, 2, 3].forEach((k) => heroEl.classList.toggle(`s${k}`, n >= k));
}

if (root.dataset.motion === 'off') {
    setStage(3);
} else {
    setStage(0);
    requestAnimationFrame(() =>
        requestAnimationFrame(() => heroEl.classList.add('is-run')),
    );
}

scroller.addEventListener('scroll', request, { passive: true });
addEventListener('resize', request);
update();
requestAnimationFrame(update);

// ---- estimator ---------------------------------------------------------------

const form = document.querySelector<HTMLFormElement>('#estimator');
if (form) {
    const out = {
        range: form.querySelector<HTMLElement>('[data-out="range"]')!,
        days: form.querySelector<HTMLElement>('[data-out="days"]')!,
        bar: form.querySelector<HTMLElement>('[data-out="bar"]')!,
        legend: form.querySelector<HTMLElement>('[data-out="legend"]')!,
        screensLabel: form.querySelector<HTMLElement>(
            '[data-out="screens-label"]',
        )!,
        screensValue: form.querySelector<HTMLElement>(
            '[data-out="screens-value"]',
        )!,
    };
    // the description grows from 2 lines up to the max-height set in CSS
    autoresize(form.querySelector<HTMLTextAreaElement>('textarea')!);
    const send = form.querySelector<HTMLAnchorElement>('[data-send]')!;
    const copy = form.querySelector<HTMLButtonElement>('[data-copy]')!;
    let summary = '';

    const read = () => {
        const data = new FormData(form);
        return {
            type: data.get('type') as ProjectType,
            screens: +(data.get('screens') as string),
            design: data.get('design') as DesignState,
            speed: data.get('speed') as Speed,
            description: (data.get('description') as string) ?? '',
            features: data.getAll('feature') as string[],
            counts: Object.fromEntries(
                Object.keys(FEATURES).map((id) => [
                    id,
                    +((data.get(`count-${id}`) as string) || 1),
                ]),
            ),
        };
    };

    const render = () => {
        const input = read();
        const e = estimate(input);
        summary = e.summary;
        out.screensLabel.textContent = `${TYPES[input.type].unit}:`;
        out.screensValue.textContent = String(input.screens);
        out.range.textContent = `${formatMoney(e.low)} to ${formatMoney(e.high)}`;
        out.days.textContent = `${e.daysLow} to ${e.daysHigh} working days`;
        out.bar.innerHTML = e.phases
            .map(
                (p, i) =>
                    `<i style="flex-grow:${(p.share * 100).toFixed(1)}" data-k="${i}"></i>`,
            )
            .join('');
        out.legend.innerHTML = e.phases
            .map(
                (p, i) =>
                    `<li data-k="${i}"><span>${p.label}</span><b>${Math.round(p.share * 100)}%</b></li>`,
            )
            .join('');
        send.dataset.contactMessage = summary;
        send.href = `mailto:hi@frsource.org?subject=${encodeURIComponent('Project estimate')}&body=${encodeURIComponent(summary)}`;
    };

    // extras that come with the project type are ticked and locked, the visitor's own picks are remembered
    const picks = new Set<string>();
    const boxes = [
        ...form.querySelectorAll<HTMLInputElement>('input[name="feature"]'),
    ];
    const applyIncluded = () => {
        const included = INCLUDED[read().type];
        boxes.forEach((box) => {
            const isIncluded = included.includes(box.value);
            box.disabled = isIncluded;
            box.checked = isIncluded || picks.has(box.value);
            const hint = box.parentElement!.querySelector('small')!;
            hint.textContent = isIncluded
                ? 'included in this type'
                : (hint.dataset.hint ?? '');
            box.closest('.choice')!.toggleAttribute(
                'data-included',
                isIncluded,
            );
        });
    };

    form.addEventListener('input', (e) => {
        const el = e.target as HTMLInputElement;
        if (el.name === 'feature')
            el.checked ? picks.add(el.value) : picks.delete(el.value);
        if (el.name === 'type') applyIncluded();
        render();
    });
    form.addEventListener('submit', (e) => e.preventDefault());
    copy.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(summary);
            copy.textContent = 'Copied ✓';
        } catch {
            copy.textContent = 'Copy failed';
        }
        setTimeout(() => (copy.textContent = 'Copy summary'), 1800);
    });
    applyIncluded();
    render();
}
