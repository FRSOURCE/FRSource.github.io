/** Wires up all `[data-theme]` buttons on the page, persists the choice. */
export function initThemeButtons() {
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
}
