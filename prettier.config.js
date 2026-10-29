// @ts-check

/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
	useTabs: true,
	singleQuote: true,
	printWidth: 100,
	// prettier-plugin-tailwindcss must stay last
	plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
	tailwindStylesheet: './src/styles/global.css',
	overrides: [
		{
			files: '*.astro',
			options: { parser: 'astro' },
		},
		{
			files: ['*.md', '*.mdx', '*.json', '*.yml', '*.yaml'],
			options: { useTabs: false },
		},
	],
};
