import base from '@frsource/prettier-config';

export default {
    ...base,
    plugins: ['prettier-plugin-astro'],
    overrides: [{ files: '*.astro', options: { parser: 'astro' } }],
};
