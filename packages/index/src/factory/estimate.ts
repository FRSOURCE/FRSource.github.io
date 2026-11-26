/**
 * Indicative price model for the /factory/ estimator.
 *
 * !! PLACEHOLDER NUMBERS for extras, phase shares and speed !! The per-type price tables are the
 * agreed ranges, everything else (extras, shares, days per EUR) is a guess to tune.
 * The estimate is "semi-automated" on purpose: it only pre-fills the contact form,
 * a human confirms the final quote.
 */

export type ProjectType = 'site' | 'shop' | 'app' | 'tool';
export type DesignState = 'scratch' | 'designs' | 'ai';
export type Speed = 'standard' | 'rush';

export interface EstimateInput {
    type: ProjectType;
    /** pages / screens with a unique layout */
    screens: number;
    design: DesignState;
    /** extras picked by the visitor (included ones are added automatically) */
    features: string[];
    /** how many of a countable extra (payment methods, integrations), 1 when missing */
    counts?: Record<string, number>;
    speed: Speed;
    /** free text from the visitor, added to the message */
    description?: string;
}

export interface Estimate {
    low: number;
    high: number;
    daysLow: number;
    daysHigh: number;
    phases: { id: string; label: string; share: number }[];
    summary: string;
}

export const CURRENCY = 'EUR';

/**
 * Price of the first unit, then the step to each next unit: `steps[0]` is the step to the
 * 2nd unit, `steps[4]` the step to the 6th, every unit after the 6th costs `tail`.
 * e.g. site (low): 800, 1000, 1200, 1300, 1400, 1500, then +50 each.
 */
interface Curve {
    base: number;
    steps: [number, number, number, number, number];
    tail: number;
}

export const TYPES: Record<
    ProjectType,
    { label: string; unit: string; low: Curve; high: Curve }
> = {
    site: {
        label: 'Website',
        unit: 'Pages with unique layout',
        low: { base: 800, steps: [200, 200, 100, 100, 100], tail: 50 },
        high: { base: 1700, steps: [200, 200, 100, 100, 100], tail: 50 },
    },
    shop: {
        label: 'Online shop',
        unit: 'Screens with unique layout',
        low: { base: 1800, steps: [400, 400, 250, 250, 250], tail: 100 },
        high: { base: 3600, steps: [500, 500, 300, 300, 300], tail: 150 },
    },
    app: {
        label: 'Web app / MVP',
        unit: 'Screens with unique layout',
        low: { base: 1300, steps: [300, 300, 200, 200, 200], tail: 100 },
        high: { base: 2900, steps: [400, 400, 250, 250, 250], tail: 125 },
    },
    tool: {
        label: 'Internal tool',
        unit: 'Screens with unique layout',
        low: { base: 1000, steps: [250, 250, 150, 150, 150], tail: 75 },
        high: { base: 2200, steps: [300, 300, 200, 200, 200], tail: 100 },
    },
};

export function curvePrice(curve: Curve, n: number) {
    let price = curve.base;
    for (let i = 1; i < n; i++) price += curve.steps[i - 1] ?? curve.tail;
    return price;
}

/** extras that already come with the project type */
export const INCLUDED: Record<ProjectType, string[]> = {
    site: [],
    shop: ['auth', 'payments'],
    app: ['auth'],
    tool: [],
};

export const DESIGN_STATES: Record<
    DesignState,
    { label: string; hint: string }
> = {
    scratch: {
        label: 'Start from scratch',
        hint: 'We design it with you',
    },
    designs: {
        label: 'I have designs',
        hint: 'Figma, sketches, a brand book',
    },
    ai: {
        label: 'I have an AI prototype',
        hint: 'Lovable, v0, Claude, Cursor… we finish it',
    },
};

export const FEATURES: Record<
    string,
    {
        label: string;
        hint?: string;
        cost: number;
        /** countable extras: price of each additional one, and what to call them */
        perExtra?: number;
        countLabel?: string;
    }
> = {
    auth: { label: 'Accounts & login', cost: 600 },
    payments: {
        label: 'Payments',
        cost: 800,
        perExtra: 300,
        countLabel: 'payment methods',
    },
    cms: { label: 'Editable content (CMS)', cost: 600 },
    admin: { label: 'Admin panel', cost: 1200 },
    integrations: {
        label: 'Third-party integrations',
        cost: 700,
        perExtra: 400,
        countLabel: 'integrations',
    },
    i18n: { label: 'Multiple languages', cost: 500 },
    tests: { label: 'Automated & visual tests', cost: 500 },
    hybrid: {
        label: 'Hybrid app / TWA',
        hint: 'installable, app-store ready',
        cost: 1200,
    },
};

const RATES = {
    /** shares of the base price: what each phase of the factory costs */
    shares: { design: 0.15, prototype: 0.2, build: 0.55, launch: 0.1 },
    /** auditing and hardening an existing AI prototype, share of the base price */
    hardenShare: 0.1,
    /** extras are priced as a range as well */
    extraSpread: { low: 0.85, high: 1.25 },
    rushMultiplier: 1.3,
    /** how much money of work fits into one working day of the team */
    eurPerDay: 1000,
    minDays: 2,
    round: 50,
};

const round = (n: number) => Math.round(n / RATES.round) * RATES.round;

export const formatMoney = (n: number) =>
    new Intl.NumberFormat('en', {
        style: 'currency',
        currency: CURRENCY,
        maximumFractionDigits: 0,
    }).format(n);

export function estimate(input: EstimateInput): Estimate {
    const t = TYPES[input.type];
    const screens = Math.max(1, input.screens);
    const baseLow = curvePrice(t.low, screens);
    const baseHigh = curvePrice(t.high, screens);
    const baseMid = (baseLow + baseHigh) / 2;

    const included = INCLUDED[input.type];
    const extras = [...new Set(input.features)].filter(
        (id) => !included.includes(id),
    );
    const count = (id: string) =>
        Math.min(20, Math.max(1, Math.round(input.counts?.[id] ?? 1)));
    // included extras cost nothing for the first one, every additional one is charged
    const extraPrice = (id: string, isIncluded: boolean) => {
        const f = FEATURES[id];
        if (!f) return 0;
        const more = f.perExtra ? (count(id) - 1) * f.perExtra : 0;
        return (isIncluded ? 0 : f.cost) + more;
    };
    const extrasCost =
        extras.reduce((sum, id) => sum + extraPrice(id, false), 0) +
        included.reduce((sum, id) => sum + extraPrice(id, true), 0);

    // what the visitor skips by already having designs / a prototype
    const s = RATES.shares;
    const baseFactor =
        input.design === 'scratch'
            ? 1
            : input.design === 'designs'
              ? 1 - s.design
              : 1 - s.design - s.prototype + RATES.hardenShare;

    const mult = input.speed === 'rush' ? RATES.rushMultiplier : 1;
    const low = round(
        (baseLow * baseFactor + extrasCost * RATES.extraSpread.low) * mult,
    );
    const high = round(
        (baseHigh * baseFactor + extrasCost * RATES.extraSpread.high) * mult,
    );

    const parts = [
        {
            id: 'design',
            label: 'Design',
            value: input.design === 'scratch' ? baseMid * s.design : 0,
        },
        {
            id: 'prototype',
            label: 'Prototype',
            value: input.design === 'ai' ? 0 : baseMid * s.prototype,
        },
        {
            id: 'build',
            label: input.design === 'ai' ? 'Hardening & build' : 'Working app',
            value:
                baseMid * s.build +
                extrasCost +
                (input.design === 'ai' ? baseMid * RATES.hardenShare : 0),
        },
        { id: 'launch', label: 'QA & launch', value: baseMid * s.launch },
    ].filter((p) => p.value > 0);
    const total = parts.reduce((sum, p) => sum + p.value, 0);

    // rush shortens the calendar, it does not reduce the work
    const days = Math.max(
        RATES.minDays,
        Math.ceil((low + high) / 2 / mult / RATES.eurPerDay) *
            (mult > 1 ? 0.7 : 1),
    );
    const daysLow = Math.max(RATES.minDays, Math.round(days * 0.85));
    const daysHigh = Math.max(daysLow + 1, Math.round(days * 1.3));

    const labels = (ids: string[]) =>
        ids
            .map((id) => {
                const f = FEATURES[id];
                if (!f) return '';
                return f.perExtra && count(id) > 1
                    ? `${f.label} (${count(id)} ${f.countLabel})`
                    : f.label;
            })
            .filter(Boolean);
    const summary = [
        'Hi! I used the estimator on frsource.org/factory/:',
        `- Project: ${t.label}, ${screens} ${t.unit.toLowerCase()}`,
        `- Starting point: ${DESIGN_STATES[input.design].label}`,
        `- Extras: ${extras.length ? labels(extras).join(', ') : 'none'}`,
        included.length
            ? `- Included with this type: ${labels(included).join(', ')}`
            : '',
        `- Pace: ${input.speed === 'rush' ? 'rush' : 'standard'}`,
        `- Indicative: ${formatMoney(low)} to ${formatMoney(high)}, about ${daysLow} to ${daysHigh} working days`,
        '',
        input.description?.trim()
            ? `About the project:\n${input.description.trim()}`
            : 'A bit more about the project: ',
    ]
        .filter((line, i, all) => line !== '' || i === all.length - 2)
        .join('\n');

    return {
        low,
        high,
        daysLow,
        daysHigh,
        phases: parts.map((p) => ({
            id: p.id,
            label: p.label,
            share: p.value / total,
        })),
        summary,
    };
}
