// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const isDevelopment = process.env.NODE_ENV === 'development'

// https://astro.build/config
export default defineConfig({
	site: 'https://jorispaarde.github.io/webdev-inzichten/',
	base: isDevelopment ? '' : '/webdev-inzichten',
	integrations: [mdx(), sitemap()],
});
