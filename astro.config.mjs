// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	integrations: [react(), mdx()],

	markdown: {
		// Token colours are set as --astro-code-* variables in src/styles/global.css
		shikiConfig: { theme: 'css-variables' },
	},

	vite: {
		plugins: [tailwindcss()],
	},
});
