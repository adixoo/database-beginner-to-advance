// @ts-check
import eslintReact from '@eslint-react/eslint-plugin';
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import astro from 'eslint-plugin-astro';
import tailwindcss from 'eslint-plugin-tailwindcss';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Typed as `Config | ConfigArray`, but the preset is a single config object
const tailwindRecommended = /** @type {import('eslint').Linter.Config} */ (
	tailwindcss.configs.recommended
);

export default defineConfig([
	globalIgnores([
		'dist/',
		'.astro/',
		'node_modules/',
		'.claude/',
		'.changeset/',
		'.taste-skill/',
		'.vercel/',
	]),

	js.configs.recommended,
	tseslint.configs.recommended,
	astro.configs['flat/recommended'],

	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
		},
	},

	{
		files: ['**/*.{jsx,tsx}'],
		// Includes rules-of-hooks and exhaustive-deps, so eslint-plugin-react-hooks isn't needed
		extends: [eslintReact.configs['recommended-typescript']],
	},

	{
		// Not `extends`: the preset's own `files` list omits .astro and would be intersected with ours
		files: ['**/*.{astro,js,jsx,ts,tsx}'],
		plugins: tailwindRecommended.plugins,
		settings: {
			tailwindcss:
				/** @type {import('eslint-plugin-tailwindcss').PluginSettings} */
				({
					cssConfigPath: './src/styles/global.css',
				}),
		},
		rules: {
			...tailwindRecommended.rules,
			// prettier-plugin-tailwindcss sorts classes; avoid two sorters fighting
			'tailwindcss/classnames-order': 'off',
			// Suggests e.g. `leading-0.8` for `leading-[0.8]`, which Tailwind 4 does not generate
			'tailwindcss/no-unnecessary-arbitrary-value': 'off',
			// Classes from @tailwindcss/typography, which this plugin cannot see
			'tailwindcss/no-custom-classname': ['warn', { whitelist: ['prose', 'not-prose'] }],
		},
	},

	// Keep last: turns off stylistic rules that Prettier owns
	eslintConfigPrettier,
]);
