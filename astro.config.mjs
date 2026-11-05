// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	// Absolute URLs for the sitemap, canonical links and Open Graph tags
	site: 'https://database.adibitz.com',

	integrations: [react(), mdx()],

	markdown: {
		// Token colours are set as --astro-code-* variables in src/styles/global.css
		shikiConfig: { theme: 'css-variables' },
	},

	vite: {
		plugins: [tailwindcss()],
	},

	adapter: vercel(),
});
