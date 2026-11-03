const GAP = 1500;

const idle = () =>
    new Promise<void>((resolve) =>
        'requestIdleCallback' in window
            ? requestIdleCallback(() => resolve(), { timeout: 5000 })
            : setTimeout(resolve, 200),
    );

/**
 * Runs the (module import) loaders one by one, with a pause in between,
 * once the page and all of its requests have settled.
 * Skipped on data-saver connections, interaction still loads on demand.
 */
export async function prefetchWhenIdle(loaders: (() => Promise<unknown>)[]) {
    if (
        (navigator as Navigator & { connection?: { saveData?: boolean } })
            .connection?.saveData
    )
        return;

    if (document.readyState !== 'complete')
        await new Promise((resolve) =>
            addEventListener('load', resolve, { once: true }),
        );

    for (const load of loaders) {
        await idle();
        await load().catch(() => {});
        await new Promise((resolve) => setTimeout(resolve, GAP));
    }
}
