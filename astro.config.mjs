// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	// Absolute URLs for the sitemap, canonical links and Open Graph tags
	site: 'https://database.adibitz.com',

	integrations: [
		react(),
		mdx(),
		sitemap({
			// No trailing slash, to match the canonical links (src/lib/seo.ts) and the site's own links
			serialize(item) {
				const url = new URL(item.url);
				url.pathname = url.pathname.replace(/(.)\/$/, '$1');
				return { ...item, url: url.href };
			},
		}),
	],

	markdown: {
		// Token colours are set as --astro-code-* variables in src/styles/global.css
		shikiConfig: { theme: 'css-variables' },
	},

	vite: {
		plugins: [tailwindcss()],
	},

	adapter: vercel(),
});
