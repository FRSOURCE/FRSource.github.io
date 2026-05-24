import matter from 'gray-matter';
import path from 'path';
import { members } from '../composables/members';
import { getGitCreationTimestamp } from './getGitCreationTimestamp';
import { getGitTimestamp } from './getGitTimestamp';
import type replaceAsync from 'string-replace-async';

const __dirname = new URL('.', import.meta.url).pathname;
const getReplaceAsync = new Function(
    'modulePath',
    "return import('string-replace-async').then(mod => mod.default)",
) as () => Promise<typeof replaceAsync>;

export const baseUrl = 'https://www.frsource.org/blog';

export const parsePostMarkdown = async (
    mdData: matter.GrayMatterFile<string>,
) => {
    const {
        data,
        path: filepath,
        content,
    } = mdData as typeof mdData & {
        path: string;
    };
    const title: string = data.title || content.match(/# (.+)/)[1];
    let error = false;
    if (!title || !data.description) {
        console.error(
            `Every post must contain title and description in frontmatter (title might be written as a main article markdown heading), post "${filepath}" does not! Skipping.`,
        );
        error = true;
    }
    if (!data.author || !members.some(({ id }) => id === data.author)) {
        console.error(
            `Post "${filepath}" is missing a valid author id in frontmatter data! Skipping.`,
        );
        error = true;
    }
    return error
        ? (undefined as void)
        : {
              title,
              author: data.author,
              tags:
                  data.head
                      ?.find(([name]) => name === 'meta')
                      ?.find(
                          (items) =>
                              typeof items === 'object' &&
                              items?.name === 'keywords',
                      )
                      ?.content?.split(',')
                      ?.map((tag) => tag.trim()) || [],
              description: data.description as string,
              image: data.image,
              srcPath: data.srcPath,
              path: filepath.replace(/index\.md$/, ''),
              lastUpdated: await getGitTimestamp(data.srcPath, {
                  cwd: path.resolve(__dirname, '..'),
              }),
              creationDate: await getGitCreationTimestamp(data.srcPath, {
                  cwd: path.resolve(__dirname, '..'),
              }),
          };
};

export const convertImagesToAbsolutePaths = async (
    content: string,
    processImage?: (path: string) => Promise<string>,
) =>
    (await getReplaceAsync())(
        content,
        /^(!\[[^\]$]+?\]\()([^\)$]+?)\)$/gm,
        async (_, start, filepath) => {
            return `${start}${baseUrl}${
                (await processImage?.(filepath)) ?? filepath
            })`;
        },
    );
