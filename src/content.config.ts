import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { LEVELS } from './config/site';

// One Markdown (.md or .mdx) file per topic in src/content/topics/<level>/, e.g. beginner/what-is-a-table.mdx
const topics = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/topics' }),
	schema: z.object({
		title: z.string(),
		// One sentence, used as the page's meta description
		description: z.string(),
		level: z.enum(LEVELS),
		// Position in the sidebar, lowest first
		order: z.number().int(),
	}),
});

export const collections = { topics };
