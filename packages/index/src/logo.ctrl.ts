import { PowerGlitch } from 'powerglitch';

const randInt = (a: number = 0, b: number = 1) => Math.random() * (b - a) + a;

const getItemsToReveal = (logo: SVGElement) => {
    const paths = Array.from(
        logo.querySelectorAll<HTMLElement | SVGElement>('path'),
    );

    paths.push(logo!.querySelector<SVGSVGElement>('use')!);

    return paths;
};

/**
 * @param skipReveal show the whole logo at once, only the random glitching remains
 * @returns promise resolved once the logo has been fully revealed
 */
export const startLogoAnimation = (logo: SVGElement, skipReveal = false) => {
    let lastVisibleItem = -1;
    let revealed!: () => void;
    const done = new Promise<void>((resolve) => (revealed = resolve));

    let itemsToReveal = [getItemsToReveal(logo)];

    if (!skipReveal)
        itemsToReveal[0].forEach((item) => (item.style.visibility = 'hidden'));

    const glitchWrapper = document.createElement('div');
    glitchWrapper.style.width = '100%';
    glitchWrapper.style.height = '100%';
    logo.parentElement!.appendChild(glitchWrapper);
    glitchWrapper.appendChild(logo);

    const progressReveal = async () => {
        let timeout: number;
        if (lastVisibleItem === itemsToReveal[0].length - 1) {
            revealed();
            timeout = randInt(1000, 6000);
        } else {
            ++lastVisibleItem;
            itemsToReveal.forEach(
                (glitchElement) =>
                    (glitchElement[lastVisibleItem].style.visibility =
                        'visible'),
            );
            timeout = randInt(300, 700);
        }

        reinitGlitch();

        setTimeout(progressReveal.bind(this), timeout);
    };

    const reinitGlitch = () => {
        PowerGlitch.glitch(glitchWrapper, {
            timing: {
                duration: randInt(300, 2000),
                iterations: 1,
            },
        });
    };

    const initGlitch = () => {
        reinitGlitch();

        itemsToReveal = Array.from(
            glitchWrapper.parentElement!.querySelectorAll<SVGElement>(
                'svg[role=img]',
            ),
        ).map((glitchElement) => getItemsToReveal(glitchElement));

        glitchWrapper.parentElement!.style.width =
            glitchWrapper.parentElement!.parentElement!.style.width = '100%';
        glitchWrapper.parentElement!.style.height =
            glitchWrapper.parentElement!.parentElement!.style.height = '100%';
        glitchWrapper.parentElement!.style.gridTemplate = '50% 50% / 50% 50%';
    };

    setTimeout(progressReveal.bind(this), 500); // starting timeout
    initGlitch();
    if (skipReveal) lastVisibleItem = itemsToReveal[0].length - 1;

    return done;
};
