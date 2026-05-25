import path from 'path';
import { promises as fs } from 'fs';
import fsExtra from 'fs-extra';
import chokidar from 'chokidar';
import commandLineArgs from 'command-line-args';
import { memoize } from 'lodash-es';
import { publish as mediumPublish } from './syncToMedium';
import { publish as devToPublish } from './syncToDevTo';

const __dirname = new URL('.', import.meta.url).pathname;
const LOCALES = ['en', 'pl'];
const DEFAULT_LOCALE = LOCALES[0];
const DEFAULT_LOCALE_DIR = '';
const IGNORED_POST_FILES = ['.DS_Store'];

const memoizedPostDestinationPath = memoize(postDestinationPath);

const args = commandLineArgs([
    { name: 'watch', alias: 'w', type: Boolean },
    { name: 'sync-with-medium', type: Boolean },
    { name: 'sync-with-devto', type: Boolean },
]);
const cwd = path.join(__dirname, '..');

const watcher = chokidar
    .watch('./post', {
        cwd,
        ignoreInitial: true,
    })
    .on('ready', async () => {
        await clearPosts();
        const filesToSync = await filterOutDirs(watcher.getWatched());
        const syncedPosts = await copyPosts(filesToSync);
        const enPosts = syncedPosts.filter((post) => post?.locale === 'en');
        if (args['sync-with-medium']) {
            await Promise.all(
                enPosts.map((post) =>
                    mediumPublish({
                        srcDirPath: post.src,
                        postname: post.postname,
                    }),
                ),
            );
        }
        if (args['sync-with-devto']) {
            await Promise.all(
                enPosts.map((post) =>
                    devToPublish({
                        srcDirPath: post.src,
                        postname: post.postname,
                    }),
                ),
            );
        }
        if (!args.watch) await watcher.close();
    })
    .on('all', (event, filepath, stats) => {
        switch (event) {
            case 'add':
            case 'change':
                copyPostFile(filepath);
                break;
            case 'unlink':
            case 'unlinkDir':
                fsExtra
                    .remove(memoizedPostDestinationPath(filepath))
                    .catch(
                        (e) =>
                            `Error :: unsuccessful unlink for path: ${memoizedPostDestinationPath(
                                filepath,
                            )}`,
                    );
                break;
        }
    });

///

function withCwd(...paths: string[]) {
    return path.join(cwd, ...paths);
}

function parsePostPath(srcPostPath: string) {
    const separator = `\\${path.sep}`;
    const regex = new RegExp(
        `post${separator}([^${separator}]+)${separator}([^${separator}]+)${separator}?(.*)?$`,
        'i',
    );
    const [, postname, locale, rest = ''] = srcPostPath.match(regex) ?? [];
    return { postname, locale, rest };
}

async function copyPosts(postsToCopy: Record<string, string[]>) {
    return await Promise.all(
        Object.keys(postsToCopy).map(async (postSrcDir, i) => {
            return {
                src: withCwd(postSrcDir),
                dest: memoizedPostDestinationPath(postSrcDir),
                ...parsePostPath(postSrcDir),
                files: await Promise.all(
                    postsToCopy[postSrcDir].map((filename) =>
                        filename === 'index.md'
                            ? copyPostFile(path.join(postSrcDir, filename))
                            : copyPostAsset(path.join(postSrcDir, filename)),
                    ),
                ),
            };
        }),
    );
}

async function copyPostFile(srcFilepath: string) {
    const srcContent = await fsExtra.readFile(
        withCwd(path.dirname(srcFilepath), path.basename(srcFilepath)),
    );
    const dest = memoizedPostDestinationPath(srcFilepath);
    await fsExtra.outputFile(
        dest,
        srcContent
            .toString()
            .replace(
                '---',
                `---\ntype: article\nsrcPath: "${path.dirname(srcFilepath)}"`,
            ),
    );
    return dest;
}

async function copyPostAsset(srcFilepath: string) {
    const dest = memoizedPostDestinationPath(srcFilepath, true);
    await fsExtra.copy(
        withCwd(path.dirname(srcFilepath), path.basename(srcFilepath)),
        memoizedPostDestinationPath(srcFilepath, true),
        { overwrite: true },
    );
    return dest;
}

function postDestinationPath(srcFilepath: string, isAsset?: boolean) {
    const { locale, postname, rest } = parsePostPath(srcFilepath);
    const pathParts = isAsset
        ? [
              'public',
              'post',
              locale === DEFAULT_LOCALE ? DEFAULT_LOCALE_DIR : locale,
          ]
        : [locale === DEFAULT_LOCALE ? DEFAULT_LOCALE_DIR : locale, 'post'];
    return withCwd('..', ...pathParts, postname, rest);
}

async function clearPosts() {
    await Promise.all(
        LOCALES.map((locale) =>
            fsExtra.remove(
                withCwd(
                    '..',
                    locale === DEFAULT_LOCALE ? DEFAULT_LOCALE_DIR : locale,
                    'post',
                ),
            ),
        ),
    );
}

async function filterOutDirs(fileTree: Record<string, string[]>) {
    const fileTreeCopy = {};
    await Promise.all(
        Object.keys(fileTree).map(async (dirPath) => {
            fileTreeCopy[dirPath] = [];
            await Promise.all(
                fileTree[dirPath].map(async (pathname) => {
                    if (
                        (await isFile(withCwd(dirPath, pathname))) &&
                        !IGNORED_POST_FILES.includes(path.basename(pathname))
                    )
                        fileTreeCopy[dirPath].push(pathname);
                }),
            );
            if (!fileTreeCopy[dirPath].length) delete fileTreeCopy[dirPath];
        }),
    );
    return fileTreeCopy;
}

function isFile(filepath: string) {
    return fs
        .stat(filepath)
        .then((stat) => stat.isFile())
        .catch(() => false);
}
