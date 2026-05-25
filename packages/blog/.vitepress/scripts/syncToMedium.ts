import path from 'path';
import matter from 'gray-matter';
import { outputFile } from 'fs-extra';
import {
    parsePostMarkdown,
    baseUrl,
    convertImagesToAbsolutePaths,
} from './posts.utils';
import { members } from '../composables/members';
import { getGitTimestamp } from './getGitTimestamp';
import type fetch from 'node-fetch';
import { existsSync, promises as fs } from 'fs';
import isAnimated from '@frsource/is-animated';
import sharp from 'sharp';

const __dirname = new URL('.', import.meta.url).pathname;

type AdditionalPostData = {
    syncDateMedium?: string; // date when post was last updated
    syncedIdMedium?: string; // id under which post is published to medium
    syncedUrlMedium?: string; // syncedUrlMedium under which post is published to medium
};

const getFetch = new Function(
    'modulePath',
    "return import('node-fetch').then(mod => mod.default)",
) as () => Promise<typeof fetch>;

const processImageForMedium = async (imgRelativePath: string) => {
    const imgPath = path.resolve(
        __dirname,
        '..',
        '..',
        'public',
        ...imgRelativePath.split('/'),
    );
    if (!existsSync(imgPath))
        throw new Error(`Error :: Image: "${imgRelativePath}" does not exist!`);
    const buffer = await fs.readFile(imgPath);
    if (isAnimated(buffer)) {
        await sharp(buffer)
            .gif()
            .toFile(
                path.join(
                    path.dirname(imgPath),
                    path.basename(imgPath, '.webp') + '.gif',
                ),
            );
        return path.join(
            path.dirname(imgRelativePath),
            path.basename(imgRelativePath, '.webp') + '.gif',
        );
    }

    await sharp(buffer)
        .png()
        .toFile(
            path.join(
                path.dirname(imgPath),
                path.basename(imgPath, '.webp') + '.png',
            ),
        );
    return path.join(
        path.dirname(imgRelativePath),
        path.basename(imgRelativePath, '.webp') + '.png',
    );
};

export const preparePostForPublish = async ({
    slug,
    lastUpdated,
    frontmatterData,
    syncDateMedium,
    syncedIdMedium,
    syncedUrlMedium,
}: {
    slug: string;
    lastUpdated: string;
    frontmatterData: matter.GrayMatterFile<string>;
} & AdditionalPostData) => {
    const parsedPost = await parsePostMarkdown(frontmatterData);
    if (!parsedPost) return;
    const { title, author: authorId, tags } = parsedPost;
    if (syncDateMedium && syncDateMedium === lastUpdated) {
        console.log(
            `Post "${title}" is already up to date on Medium (${syncedUrlMedium}), skipping...`,
        );
        return;
    }

    if (!syncDateMedium)
        console.log(
            `Post "${title}" wasn't published to medium yet, attempting to publish.`,
        );
    else {
        console.log(
            `Warn :: Post "${title}" is already published on medium (${syncedUrlMedium}), but it needs to be updated. Medium API does not expose possibility to update existing article, so you need to update this article manually.`,
        );
        return;
    }

    const author = members.find(({ id }) => id === authorId);

    if (!author) {
        console.error(
            `Author with id: ${authorId} cannot be found. Make sure this id is correct and exists within members object. Skipping publish of post "${title}"...`,
        );
        return;
    }

    const { mediumId: mediumAuthorId } = author;

    if (!mediumAuthorId) {
        console.error(
            `Author id: ${authorId} is missing "mediumId" in its data. Skipping publish of post "${title}"...`,
        );
        return;
    }

    const tokenName = `MEDIUM_TOKEN_${authorId?.toUpperCase()}`;
    const token = process.env[tokenName];

    if (typeof token === 'undefined') {
        console.error(
            `Medium integration token missing. Make sure to specify env "${tokenName}".`,
        );
        return;
    }

    const canonicalUrl = `${baseUrl}/post/${slug}`;

    return {
        data: {
            token,
            authorId: mediumAuthorId,
        },
        body: {
            authorId: mediumAuthorId,
            title,
            contentFormat: 'markdown',
            content:
                (await convertImagesToAbsolutePaths(
                    frontmatterData.content,
                    processImageForMedium,
                )) +
                `\n\n> This article has been originally published on [FRSPACE blog](${canonicalUrl}).\n> Take a look there to find more of my articles 🎉`,
            tags,
            publishStatus: 'public', // possible values: draft, unlisted, public
            canonicalUrl,
            license: 'cc-40-by-nc-sa',
            notifyFollowers: true,
        },
    };
};

export const publish = async ({
    srcDirPath,
    postname,
}: {
    srcDirPath: string;
    postname: string;
}) => {
    try {
        const articleIndexPath = path.join(srcDirPath, 'index.md');
        const articleLastUpdated = await getGitTimestamp(srcDirPath);
        const frontmatterData = matter.read(articleIndexPath);
        const { syncDateMedium, syncedIdMedium, syncedUrlMedium } =
            frontmatterData.data as AdditionalPostData;

        const post = await preparePostForPublish({
            slug: postname,
            lastUpdated: articleLastUpdated.toString(),
            frontmatterData,
            syncDateMedium,
            syncedIdMedium,
            syncedUrlMedium,
        });
        if (!post) return;
        const fetch = await getFetch();

        const response = await fetch(
            `https://api.medium.com/v1/users/${post.data.authorId}/posts`,
            {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + post.data.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(post.body),
            },
        );
        const data = (await response.json()) as {
            data: Record<string, string>;
        };
        if (response.status === 201) {
            console.log(`Published to medium: ${data.data.url}`);
            frontmatterData.data.syncDateMedium = articleLastUpdated;
            frontmatterData.data.syncedIdMedium = data.data.id;
            frontmatterData.data.syncedUrlMedium = data.data.url;
            await outputFile(
                articleIndexPath,
                matter.stringify(frontmatterData.content, frontmatterData.data),
            );
        } else {
            const error = response;
            error.json = () => Promise.resolve(data);
            throw error;
        }
    } catch (error) {
        if (error.status === 400)
            console.error(
                'Required fields were invalid, not specified.',
                error.statusText,
                await error.json?.(),
            );
        else if (error.status === 401)
            console.error(
                'The access token is invalid or has been revoked.',
                error.statusText,
                await error.json?.(),
            );
        else if (error.status === 403)
            console.error(
                'The user does not have permission to publish, or the authorId in the request path points to wrongnon-existent user.',
                error.statusText,
                await error.json?.(),
            );
        else if (error.status === 429)
            console.error(
                'You have reached the rate limit for publishing today.',
                error.statusText,
                await error.json?.(),
            );
        else {
            console.error('Unknown error.', error);
            return process.exit(1);
        }
    }
};
