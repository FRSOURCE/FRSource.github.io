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
import { type Response } from 'node-fetch';

const getFetch = new Function(
    'modulePath',
    "return import('node-fetch').then(mod => mod.default)",
) as () => Promise<typeof fetch>;

type AdditionalPostData = {
    syncDateDevTo?: string;
    syncedIdDevTo?: number;
    syncedUrlDevTo?: string;
};

const tryToParseJSONResponse = async (res: Response) => {
    const text = await res.text();
    try {
        return JSON.parse(text) as Record<string, unknown>;
    } catch (e) {
        if (e instanceof Error) {
            e.message = 'text: ' + text + '.\n' + e.message;
        }
        throw e;
    }
};

export const publish = async ({
    srcDirPath,
    postname,
}: {
    srcDirPath: string;
    postname: string;
}) => {
    console.log(`Uploading ${postname} to dev.to...`);
    try {
        const articleIndexPath = path.join(srcDirPath, 'index.md');
        const articleLastUpdated = await getGitTimestamp(srcDirPath);
        const frontmatterData = matter.read(articleIndexPath);
        const { syncDateDevTo, syncedIdDevTo, syncedUrlDevTo } =
            frontmatterData.data as AdditionalPostData;

        const parsedPost = await parsePostMarkdown(frontmatterData);
        if (!parsedPost) return;

        const {
            title,
            author: authorId,
            tags,
            description,
            image,
        } = parsedPost;

        if (syncDateDevTo && syncDateDevTo === articleLastUpdated.toString()) {
            console.log(
                `Post "${title}" is already up to date on Dev.to (${syncedUrlDevTo}), skipping...`,
            );
            return;
        }

        const author = members.find(({ id }) => id === authorId);
        if (!author) {
            console.error(
                `Author with id: ${authorId} cannot be found. Skipping publish of post "${title}"...`,
            );
            return;
        }

        const tokenName = `DEVTO_TOKEN_${authorId?.toUpperCase()}`;
        const token = process.env[tokenName];
        if (typeof token === 'undefined') {
            console.error(
                `Dev.to integration token missing. Make sure to specify env "${tokenName}".`,
            );
            return;
        }

        const canonicalUrl = `${baseUrl}/post/${postname}`;
        const content = await convertImagesToAbsolutePaths(
            frontmatterData.content,
        );

        const articlePayload = {
            article: {
                title,
                body_markdown:
                    content +
                    `\n\n> This article has been originally published on [FRSPACE blog](${canonicalUrl}).\n> Take a look there to find more of my articles 🎉`,
                published: true,
                // Dev.to allows max 4 tags
                tags: tags
                    .slice(0, 4)
                    .map((tag: string) => tag.replace(/[^A-Za-z0-9]/g, '')),
                canonical_url: canonicalUrl,
                description,
                ...(image?.src ? { main_image: `${baseUrl}${image.src}` } : {}),
            },
        };

        const fetch = await getFetch();
        const isUpdate = !!syncedIdDevTo;
        const url = isUpdate
            ? `https://dev.to/api/articles/${syncedIdDevTo}`
            : 'https://dev.to/api/articles';

        const response = await fetch(url, {
            method: isUpdate ? 'PUT' : 'POST',
            headers: {
                'api-key': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(articlePayload),
        });

        if (response.status === 200 || response.status === 201) {
            const data = await tryToParseJSONResponse(response);
            const action = isUpdate ? 'Updated' : 'Published';
            console.log(`${action} to Dev.to: ${data.url}`);
            frontmatterData.data.syncDateDevTo = articleLastUpdated;
            frontmatterData.data.syncedIdDevTo = data.id;
            frontmatterData.data.syncedUrlDevTo = data.url;
            await outputFile(
                articleIndexPath,
                matter.stringify(frontmatterData.content, frontmatterData.data),
            );
        } else {
            const text = await response.text();
            throw Object.assign(new Error(text || 'Unknown error'), {
                status: response.status,
                data: text,
            });
        }
    } catch (error) {
        const err = error as {
            status?: number;
            message?: string;
            data?: unknown;
        };
        if (err.status === 401)
            console.error(
                'The API key is invalid or missing.',
                err.message,
                err.data,
            );
        else if (err.status === 422)
            console.error(
                'Required fields were invalid or missing.',
                err.message,
                err.data,
            );
        else if (err.status === 429)
            console.error('You have exceeded the rate limit.', err.message);
        else {
            console.error('Unknown error.', error);
            return process.exit(1);
        }
    }
};
