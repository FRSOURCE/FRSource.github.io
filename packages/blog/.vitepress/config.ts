/// <reference path="../typings.d.ts" />

import {
    defineConfigWithTheme,
    DefaultTheme,
    LocaleConfig,
    PageData,
    SiteConfig,
} from 'vitepress';
import { promises as fs, writeFileSync } from 'fs';
import path from 'path';
import { type Author, Feed } from 'feed';
import matter from 'gray-matter';
import { parsePostMarkdown } from './scripts/posts.utils';
import { getGitCreationTimestamp } from './scripts/getGitCreationTimestamp';
import { getGitTimestamp } from './scripts/getGitTimestamp';
import { members } from './composables/members';

const siteURL = 'https://www.frsource.org';
const blogURL = `${siteURL}/blog`;

const generateEditLink = (pageData: PageData) => {
    if (pageData.frontmatter?.type === 'article') {
        return `https://github.com/FRSOURCE/FRSource.github.io/edit/dev/packages/blog/.vitepress/${pageData.frontmatter.srcPath}/index.md`;
    }

    return 'https://github.com/FRSOURCE/FRSource.github.io/';
};

type ArticleData = PageData['articles']['root'][0];

const locales: LocaleConfig = {
    root: {
        lang: 'en',
        label: 'English',
        title: '',
        titleTemplate: ':title FRSPACE - Web, IT & robotics',
        description: 'Web, IT, robotics & much more!',
    },
    pl: {
        lang: 'pl',
        label: 'Polski',
        title: '',
        titleTemplate: ':titleFRSPACE - Web, IT i robotyka',
        description: 'Web, IT, robotyka i znacznie więcej!',
        themeConfig: {
            nav: [
                { text: 'Strona główna', link: '/pl/' },
                { text: 'Nasz zespół', link: '/pl/team' },
                { text: 'Wspomóż nas ❤️', link: '/pl/sponsoring' },
                {
                    text: 'Szukasz ekspertów?',
                    link: 'https://www.frsource.org/',
                },
            ],
            lastUpdated: { text: 'Ostatnia aktualizacja' },
            creationDateText: 'Opublikowany',
            darkModeSwitchLabel: 'Wygląd',
            sidebarMenuLabel: 'Menu',
            returnToTopLabel: 'Wróc do góry strony',
            outlineTitle: 'W tym artykule',
            editLink: {
                pattern: generateEditLink,
                text: 'Zaproponuj zmiany do tego artykułu',
            },
            footer: {
                copyright: 'Wszelkie prawa zastrzeżone © FRSOURCE',
            },
            docFooter: {
                prev: 'Poprzedni artykuł',
                next: 'Następny artykuł',
            },
        },
    },
};

export default defineConfigWithTheme<
    DefaultTheme.Config & { locales: typeof locales; creationDateText: string }
>({
    base: '/blog/',
    cleanUrls: true,
    lastUpdated: true,
    markdown: {
        headers: false,
        lineNumbers: true,
    },
    locales,
    head: [
        ['meta', { name: 'theme-color', content: '#f35e48' }],
        [
            'link',
            {
                rel: 'alternate',
                type: 'application/rss+xml',
                href: 'https://www.frsource.org/blog/feed.rss',
                title: 'FRSPACE RSS',
            },
        ],
        [
            'link',
            {
                rel: 'alternate',
                type: 'application/atom+xml',
                href: 'https://www.frsource.org/blog/feed.atom',
                title: 'FRSPACE Atom',
            },
        ],
        [
            'link',
            {
                rel: 'alternate',
                type: 'application/feed+json',
                href: 'https://www.frsource.org/blog/feed.json',
                title: 'FRSPACE JSON Feed',
            },
        ],
        [
            'link',
            {
                rel: 'preconnect',
                href: 'https://fonts.googleapis.com',
                crossorigin: '',
            },
        ],
        [
            'link',
            {
                rel: 'preconnect',
                href: 'https://fonts.gstatic.com',
                crossorigin: '',
            },
        ],
        [
            'link',
            {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&display=swap',
            },
        ],
    ],
    themeConfig: {
        locales,
        sidebar: {
            //   '/post/': sidebarPost()
        },
        logo: {
            light: '/navbar-icon.svg',
            dark: '/navbar-icon-dark.svg',
            alt: 'FRSPACE logo - "FRS" text in a circle and stylized FRSPACE text next to it',
        },
        socialLinks: [
            { icon: 'facebook', link: 'https://facebook.com/FRSOURCE' },
            { icon: 'github', link: 'https://github.com/FRSOURCE' },
            { icon: 'twitter', link: 'https://twitter.com/frsource1' },
            { icon: 'instagram', link: 'https://www.instagram.com/frsource/' },
            {
                icon: 'linkedin',
                link: 'https://www.linkedin.com/company/83486451/',
            },
            { icon: 'youtube', link: 'https://www.youtube.com/@frsource' },
        ],
        // en only

        outlineTitle: 'In this article',
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Our team', link: '/team' },
            { text: 'Sponsor us ❤️', link: '/sponsoring' },
            {
                text: 'Looking for Web wizards?',
                link: 'https://www.frsource.org/',
            },
        ],
        lastUpdated: { text: 'Last updated' },
        creationDateText: 'Published',
        darkModeSwitchLabel: 'Appearance',
        sidebarMenuLabel: 'Menu',
        returnToTopLabel: 'Return to top',
        editLink: {
            pattern: generateEditLink,
            text: 'Propose changes to this article',
        },
        footer: {
            copyright: 'Copyright © FRSOURCE',
        },
        docFooter: {
            prev: 'Previous article',
            next: 'Next article',
        },
    },
    async buildEnd(siteConfig: SiteConfig) {
        const feed = new Feed({
            title: 'FRSPACE',
            description: 'Web, IT, robotics & much more!',
            id: `${blogURL}/`,
            link: siteURL,
            language: 'en',
            copyright: `Copyright ${new Date().getFullYear()} FRSOURCE`,
            feedLinks: {
                rss2: `${blogURL}/feed.rss`,
                atom: `${blogURL}/feed.atom`,
                json: `${blogURL}/feed.json`,
            },
            author: {
                name: 'FRSOURCE',
                email: 'blog@frsource.org',
                link: `${siteURL}/`,
            },
        });

        const postsDir = path.resolve(siteConfig.srcDir, 'post');
        const entries: Array<{
            title: string;
            description: string;
            image?: { src: string; alt?: string };
            creationDate: number;
            postDir: string;
            author: Author;
        }> = [];

        try {
            const postDirs = (
                await fs.readdir(postsDir, { withFileTypes: true })
            )
                .filter((d) => d.isDirectory())
                .map((d) => d.name);

            for (const postDir of postDirs) {
                const filePath = path.join(postsDir, postDir, 'index.md');
                const file = matter.read(filePath);
                const { data, content } = file;

                if (!data.description) continue;

                const title: string =
                    data.title || content.match(/# (.+)/)?.[1] || postDir;
                const creationDate = await getGitCreationTimestamp(
                    data.srcPath,
                    { cwd: __dirname },
                );
                const member = members.find(({ id }) => id === data.author);
                const author = {
                    name: member?.name,
                    link: 'https://www.frsource.org/blog/team',
                };

                entries.push({
                    title,
                    description: data.description,
                    image: data.image,
                    creationDate,
                    postDir,
                    author,
                });
            }
        } catch {
            // posts directory not yet populated
        }

        entries
            .sort((a, b) => b.creationDate - a.creationDate)
            .forEach(
                ({
                    title,
                    description,
                    image,
                    creationDate,
                    postDir,
                    author,
                }) => {
                    const link = `${blogURL}/post/${postDir}/`;
                    feed.addItem({
                        title,
                        id: link,
                        link,
                        description,
                        date: new Date(creationDate),
                        ...(image && {
                            image: `${blogURL}${image.src}`,
                        }),
                        author: [author],
                    });
                },
            );

        writeFileSync(path.resolve(siteConfig.outDir, 'feed.rss'), feed.rss2());
        writeFileSync(
            path.resolve(siteConfig.outDir, 'feed.atom'),
            feed.atom1(),
        );
        writeFileSync(
            path.resolve(siteConfig.outDir, 'feed.json'),
            feed.json1(),
        );
    },
    async transformPageData(pageData) {
        if (pageData.frontmatter?.type === 'article') {
            // it's an article
            pageData.lastUpdated = await getGitTimestamp(
                pageData.frontmatter.srcPath,
                { cwd: __dirname },
            );
            pageData.creationDate = await getGitCreationTimestamp(
                pageData.frontmatter.srcPath,
                { cwd: __dirname },
            );
        } else {
            pageData.articles = await getAllLangsArticlesData();
        }
    },
    async transformHead(context) {
        if (
            context?.pageData.frontmatter?.type === 'article' &&
            context?.pageData.frontmatter.image
        ) {
            return [
                [
                    'meta',
                    { property: 'og:title', content: context?.pageData.title },
                ],
                [
                    'meta',
                    {
                        property: 'og:title',
                        content: context?.pageData.description,
                    },
                ],
                ['meta', { property: 'og:type', content: 'article' }],
                [
                    'meta',
                    {
                        property: 'og:image',
                        content:
                            'https://www.frsource.org/blog' +
                            context?.pageData.frontmatter.image.src,
                    },
                ],
                [
                    'meta',
                    {
                        property: 'og:image:alt',
                        content: context?.pageData.frontmatter.image.alt,
                    },
                ],
            ];
        }
    },
});

function sidebarPost() {
    return [
        {
            items: [{ text: 'Our team', link: '/team' }],
        },
        {
            text: 'Posts',
            collapsible: true,
            items: [
                // TODO: get articles for menu
                // articles,
                {
                    text: 'What is VitePress?',
                    link: '/guide/what-is-vitepress',
                },
                { text: 'Getting Started', link: '/guide/getting-started' },
                { text: 'Configuration', link: '/guide/configuration' },
                { text: 'Deploying', link: '/guide/deploying' },
            ],
        },
    ];
}

async function getAllLangsArticlesData() {
    const articles = {} as Record<
        keyof typeof locales,
        Awaited<ReturnType<typeof getArticlesData>>
    >;
    await Promise.all(
        (Object.keys(locales) as (keyof typeof locales)[]).map(
            async (localeLink) => {
                articles[localeLink] = await getArticlesData(
                    localeLink === 'root' ? '' : localeLink,
                );
            },
        ),
    );
    return articles;
}

async function getArticlesData(lang?: string) {
    const articles = await fs.readdir(path.join(lang || '', 'post'), {
        withFileTypes: true,
    });

    return (
        await Promise.all(
            articles
                .filter((fileOrDir) => fileOrDir.isDirectory())
                .map<Promise<ArticleData | void>>(async ({ name: article }) => {
                    const file = matter.read(
                        path.join(lang || '', 'post', article, '/index.md'),
                    );

                    return await parsePostMarkdown(file);
                }),
        )
    ).filter((article): article is ArticleData => !!article);
}
