<script lang="ts">
export type ArticleProps = {
    author: string;
    title: string;
    description: string;
    link: string;
    linkText: string;
    image: DefaultTheme.ThemeableImage;
    creationDate: number;
};
</script>

<script setup lang="ts">
import type { DefaultTheme } from 'vitepress/theme';
import { VPImage } from 'vitepress/theme';
import Tile from './Tile.vue';
import TileTextContent from './TileTextContent.vue';
import AuthorInfo from '../../components/AuthorInfo.vue';
import { computed, onMounted, ref, watchEffect } from 'vue';

const props = defineProps<ArticleProps>();

const date = computed(() => new Date(props.creationDate));
const isoDatetime = computed(() => date.value.toISOString());
const datetime = ref('');

// set time on mounted hook because the locale string might be different
// based on end user and will lead to potential hydration mismatch if
// calculated at build time
onMounted(() => {
    watchEffect(() => {
        datetime.value = date.value.toLocaleDateString(
            window.navigator.language,
        );
    });
});
</script>

<template>
    <Tile
        v-bind="$props"
        tag="article"
        class="article"
        :class="{ 'article--with-img': image }"
    >
        <div class="article__content">
            <div class="info-box">
                <AuthorInfo :author="author" :only-avatar="!image" />
                <time class="creation-date" :datetime="isoDatetime">{{
                    datetime
                }}</time>
            </div>
            <TileTextContent
                :title="title"
                :description="description"
                :link-text="linkText"
                title-tag="h4"
            />
        </div>
        <div class="img" v-if="image"><VPImage :image="image" /></div>
    </Tile>
</template>

<style scoped>
.article--with-img .article__content {
    padding-right: 32px;
    flex-basis: 50%;
}

.article__content {
    padding: 20px;
    width: 100%;
}

.info-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.author {
    position: relative;
    z-index: 1;
}

.creation-date {
    font-size: 10px;
    opacity: 0.6;
}

.img {
    position: relative;
    overflow: hidden;
    height: 200px;
    background: #fff;
    transition: 0.2s background-color ease-in-out;
}

.article :deep(.VPImage) {
    height: 100%;
    width: 100%;
    max-width: none;
    object-fit: cover;
    mix-blend-mode: multiply;
}

.article :deep(.tile__link):where(:active, :hover, :focus) + .tile__inner .img {
    background: var(--c-primary);
}

@media (min-width: 542px) {
    .article--with-img {
        grid-column-end: span 2;
    }

    .img {
        height: auto;
        flex-basis: 50%;
        margin-left: 10px;
        min-width: 0;
    }
}
</style>
