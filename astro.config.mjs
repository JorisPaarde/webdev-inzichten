// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { remarkBasePath } from './src/utils/remarkBasePath.mjs';

const isDevelopment = process.env.NODE_ENV === 'development';
const BASE_PATH = isDevelopment ? '' : '/webdev-inzichten';

// https://astro.build/config
export default defineConfig({
	site: 'https://jorispaarde.github.io/webdev-inzichten/',
	base: BASE_PATH,
	integrations: [mdx(), sitemap()],
	markdown: {
		remarkPlugins: [remarkBasePath],
	},
});

export { BASE_PATH };
