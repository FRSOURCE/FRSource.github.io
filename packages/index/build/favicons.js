const { resolve } = require('path');
const { promises: fs } = require('fs');
const {
    FaviconSettings,
    MasterIcon,
    generateFaviconFiles,
    generateFaviconHtml,
    IconTransformationType,
} = require('@realfavicongenerator/generate-favicon');
const {
    getNodeImageAdapter,
    loadAndConvertToSvg,
} = require('@realfavicongenerator/image-adapter-node');

const PUBLIC_PATH = resolve(__dirname, '..', '..', '..', 'public');

(async function () {
    const imageAdapter = await getNodeImageAdapter();

    // This is the icon that will be transformed into the various favicon files
    /** @type MasterIcon */
    const masterIcon = {
        icon: await loadAndConvertToSvg(
            resolve(__dirname, '..', 'src', 'assets', 'favicon.png'),
        ),
    };

    /** @type FaviconSettings */
    const faviconSettings = {
        path: '/',
        icon: {
            desktop: {
                regularIconTransformation: {
                    type: IconTransformationType.Background,
                    backgroundColor: '#ffffff',
                    backgroundRadius: 0.5,
                    imageScale: 1,
                },
                darkIconType: 'none',
            },
            touch: {
                transformation: {
                    type: IconTransformationType.Background,
                    backgroundColor: '#ffffff',
                    backgroundRadius: 0,
                    imageScale: 0.96,
                },
                appTitle: "FRSOURCE - Let's shape your web",
            },
            webAppManifest: {
                transformation: {
                    type: IconTransformationType.Background,
                    backgroundColor: '#ffffff',
                    backgroundRadius: 0,
                    imageScale: 0.94,
                },
                backgroundColor: '#ffffff',
                themeColor: '#071633',
                name: "FRSOURCE - Let's shape your web",
                shortName: 'FRSOURCE',
            },
        },
    };

    const files = await generateFaviconFiles(
        masterIcon,
        faviconSettings,
        imageAdapter,
    );

    for (const fileName of Object.keys(files)) {
        if (fileName === 'favicon.svg') continue;
        const file = files[fileName];

        await fs.writeFile(resolve(PUBLIC_PATH, fileName), file);
    }

    const html = generateFaviconHtml(faviconSettings);
    let markupToInsert = '';

    for (let markup of html.markups) {
        if (markup.includes('favicon.svg"')) continue;
        if (markup.includes('.png"')) {
            markup = markup.replace(/rel="icon"/g, 'rel="alternate icon"');
        }
        markupToInsert += markup;
    }

    markupToInsert += [
        '<meta name="apple-mobile-web-app-title" content="FRSOURCE - Let\'s shape your web" />',
        '<meta name="application-name" content="FRSOURCE - Let\'s shape your web" />',
        '<meta name="msapplication-TileColor" content="#071633" />',
        '<meta name="theme-color" content="#071633" />',
    ].join('\n');

    for (const page of ['index.html', 'portfolio/index.html']) {
        await replaceInFile(
            resolve(PUBLIC_PATH, page),
            '</head>',
            `${markupToInsert}</head>`,
        );
    }
})();

///

async function replaceInFile(path, search, replace) {
    const fileContent = await fs.readFile(path, 'utf-8');
    return fs.writeFile(path, fileContent.replace(search, replace));
}
