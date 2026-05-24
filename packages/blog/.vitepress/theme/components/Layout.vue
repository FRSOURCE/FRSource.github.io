<script lang="ts" setup>
import { computed } from 'vue';
import { useData, Locales, withBase } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
const Layout = DefaultTheme.Layout;
import Articles from './Articles.vue';
import VPDocFooterLastUpdated from 'vitepress/dist/client/theme-default/components/VPDocFooterLastUpdated.vue';
import AuthorInfo from '../../components/AuthorInfo.vue';
import RSSIcon from './RSSIcon.vue';
import AtomIcon from './AtomIcon.vue';
import JsonFeedIcon from './JsonFeedIcon.vue';
// import CreationDate from "../../components/CreationDate.vue";

const { localeIndex, page, frontmatter } = useData();
const formattedArticles = computed(() =>
    page.value.articles[localeIndex.value as keyof Locales]?.map(
        ({ title, author, description, path, image, creationDate }) => ({
            title,
            author,
            description,
            image,
            creationDate,
            link: path,
            linkText:
                localeIndex.value === 'root'
                    ? 'Read the full article'
                    : 'Przeczytaj cały artykuł',
        }),
    ),
);

const headerArray = computed(
    () => frontmatter.value.frs_hero.text.split(' ') as string[],
);

const feedLinks = [
    {
        href: withBase('/feed.rss'),
        label: 'RSS',
        ariaLabel: 'Subscribe via RSS',
        icon: RSSIcon,
    },
    {
        href: withBase('/feed.atom'),
        label: 'Atom',
        ariaLabel: 'Subscribe via Atom',
        icon: AtomIcon,
    },
    {
        href: withBase('/feed.json'),
        label: 'JSON Feed',
        ariaLabel: 'Subscribe via JSON Feed',
        icon: JsonFeedIcon,
    },
];
</script>

<template>
    <Layout>
        <template #home-features-before v-if="frontmatter.showNewestArticles">
            <div class="layout-container">
                <div class="hero">
                    <hgroup
                        class="hero__text-wrapper"
                        v-if="frontmatter.frs_hero"
                    >
                        <h1 class="hero__text">
                            {{ frontmatter.frs_hero.name }}
                        </h1>
                        <h2 class="hero__text">
                            <span class="c-secondary">{{
                                headerArray[0] + ' '
                            }}</span>
                            <span class="c-tertiary">{{
                                headerArray[1] + ' '
                            }}</span>
                            <span class="c-primary"
                                >{{ headerArray[2] }} {{ headerArray[3] }}</span
                            >
                        </h2>
                    </hgroup>

                    <svg style="height: 0; width: 0" aria-hidden="true">
                        <clipPath
                            id="frs_code_clipPath"
                            clipPathUnits="objectBoundingBox"
                        >
                            <path
                                d="M.6471.2587.5328.1925.2544.3533.2544.4623.3774.5333C.361.5345.346.54.346.559.346.5809.365.5872.3887.5953.405.6008.4187.6044.4187.6125.4187.6186.4134.6224.3971.6222.3749.6222.3663.617.3663.5998H.3409C.3409.628.356.6445.3962.6445.4307.6446.4443.6314.4443.6121.4443.5889.4126.5799.392.5729.374.5669.3714.565.3714.5599.3714.5541.3786.5516.3899.5516.4037.5516.4143.5554.4143.5675H.4367L.8111.7836.925.7176.9255.6086.8559.5685.9255.5282.9255.4194.8113.3533.6471.448.5775.4078.6471.3675ZM.291.4041A.1665.1665 90 01.291.7776.1665.1665 90 01.291.4041M.291.3744A.2165.2165 90 10.291.8075.2165.2165 90 00.291.3744M.1425.531H.2225V.5533H.168V.5855L.2188.5824V.6049L.168.608V.643H.1425V.531ZM.2351.531H.2785C.3051.531.3284.5373.3284.5622.3284.5807.3134.5859.2999.5874V.5938H.3162C.325.5938.3297.5985.3297.6072V.643H.3044V.6036H.2606V.643H.235V.531ZM.2785.5814C.2935.5814.3029.5814.3029.5674.3029.5533.2938.5533.2785.5533H.2605V.5814H.2785Z"
                            />
                        </clipPath>
                    </svg>

                    <img
                        class="hero_image"
                        src="/code.webp"
                        srcset="
                            /code_320.webp 320w,
                            /code_400.webp 400w,
                            /code.webp     640w
                        "
                        sizes="
                            (min-width: 960px) 400px,
                            (min-width: 640px) 200px,
                            160px
                        "
                        :alt="frontmatter.frs_hero.image.alt"
                    />
                </div>
            </div>
            <!-- :actions="[{ theme: 'brand', text: 'see all articles', link: '/post' }]" -->
            <!-- TODO: when we have more articles - create a separated post.md page -->
            <Articles :articles="formattedArticles">
                <template #prefix>
                    <h3
                        class="section-title font-secondary"
                        v-text="
                            localeIndex === 'root'
                                ? 'Newest articles'
                                : 'Najnowsze artykuły'
                        "
                    />
                </template>
            </Articles>
        </template>

        <template #layout-bottom>
            <div class="rss-footer">
                <a
                    v-for="{ href, label, ariaLabel, icon } in feedLinks"
                    :key="href"
                    :href="href"
                    :aria-label="ariaLabel"
                    class="rss-footer__link"
                >
                    <component :is="icon" class="rss-footer__icon" />
                    {{ label }}
                </a>
            </div>
        </template>

        <template #doc-before>
            <div class="header-info">
                <AuthorInfo
                    v-if="frontmatter.author"
                    :author="frontmatter.author"
                />
                <!-- <CreationDate /> -->
                <VPDocFooterLastUpdated />
            </div>
        </template>
    </Layout>
</template>

<style scoped>
.rss-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 12px 24px;
    border-top: 1px solid var(--vp-c-divider);
}

.rss-footer__link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: var(--vp-c-text-2);
    text-decoration: none;
    transition: color 0.2s;
}

.rss-footer__link:hover {
    color: var(--vp-c-brand-1);
}

.rss-footer__icon {
    width: 14px;
    height: 14px;
}

.hero {
    display: flex;
    flex-flow: column-reverse;
    padding-bottom: 48px;
    align-items: center;
    gap: 15%;
}

.hero__text-wrapper {
    flex-shrink: 0;
    align-self: flex-start;
}

.hero__text {
    max-width: 392px;
    line-height: 32px;
    font-size: 32px;
    font-family: var(--font-family-secondary);
    letter-spacing: 2.7px;
    white-space: pre-wrap;
}

.hero_image {
    min-width: 0;
    height: 160px;
    clip-path: url(#frs_code_clipPath);
    aspect-ratio: 1;
    object-fit: cover;
    object-position: 0 0;
    background: #1e1e1e;
    animation: linear hero_image_bg 20s infinite;
}

@keyframes hero_image_bg {
    0% {
        object-position: 0 0;
    }
    100% {
        object-position: 0 105%;
    }
}

.section-title {
    padding: 0 0 20px 20px;
    text-transform: uppercase;
}

.header-info {
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

@media (min-width: 640px) {
    .hero__text {
        max-width: 576px;
        line-height: 48px;
        font-size: 48px;
    }

    .hero_image {
        height: 200px;
    }
}

@media (min-width: 960px) {
    .hero {
        gap: 0;
        flex-flow: row;
        text-align: left;
    }

    .hero__text-wrapper {
        align-self: auto;
    }

    .hero__text {
        line-height: 54px;
        font-size: 56px;
    }

    .hero_image {
        margin: -5% auto;
        height: auto;
        width: 30%;
    }
}
</style>
