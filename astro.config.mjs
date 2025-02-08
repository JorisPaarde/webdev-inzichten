// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { remarkBasePath } from './src/utils/remarkBasePath.mjs';
import { remarkExternalLinks } from './src/utils/remarkExternalLinks.mjs';
import { REPO_NAME } from './src/consts';

const isDevelopment = process.env.NODE_ENV === 'development';
const BASE_PATH = isDevelopment ? '' : `/${REPO_NAME}`;

// https://astro.build/config
export default defineConfig({
	site: `https://jorispaarde.github.io/${REPO_NAME}/`,
	base: BASE_PATH,
	integrations: [mdx(), sitemap()],
	markdown: {
		remarkPlugins: [remarkBasePath, remarkExternalLinks],
	},
});

export { BASE_PATH };
