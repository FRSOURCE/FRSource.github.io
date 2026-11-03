import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import serviceWorker from './build/serviceWorker.mjs';

export default defineConfig({
    site: 'https://www.frsource.org',
    // the blog is built into `public/blog` after this package, so index builds first and owns the folder
    outDir: '../../public',
    trailingSlash: 'always',
    // whitespace between inline elements (buttons, links) is part of the layout
    compressHTML: false,
    build: { format: 'directory' },
    integrations: [serviceWorker()],
    vite: {
        plugins: [tailwindcss()],
        server: {
            // blog dev server (see packages/blog)
            proxy: { '/blog': 'http://localhost:5173' },
        },
    },
});
