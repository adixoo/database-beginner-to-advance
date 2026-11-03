export const SITE_NAME = 'learndb';
// The home page's headline and meta description, also used for its share image and structured data
export const SITE_TAGLINE = 'Learn about databases';
export const SITE_DESCRIPTION =
	'Learn about databases. Start as a beginner, or go straight to advanced.';

// Cloudflare Web Analytics beacon. The token is public: it ships in every page's HTML.
export const CLOUDFLARE_BEACON_TOKEN = 'b06cb0d3c96d45aaa5bc5377d4990437';

export const LEVELS = ['beginner', 'advanced'] as const;
export type Level = (typeof LEVELS)[number];

export interface LearningPath {
	label: string;
	href: string;
	summary: string;
	// What a reader should already know before starting this path
	prerequisites?: readonly string[];
}

export const PATHS = {
	beginner: {
		label: 'Beginner',
		href: '/beginner',
		summary: 'Start here if databases are new to you.',
		prerequisites: ['A programming language', 'A backend framework'],
	},
	advanced: {
		label: 'Advanced',
		href: '/advanced',
		summary: 'For when you already write SQL and want to go deeper.',
	},
} as const satisfies Record<Level, LearningPath>;

export interface PracticeTool {
	name: string;
	// Short name for the navbar
	navLabel: string;
	href: string;
	description: string;
}

// Free in-browser tools readers can open to try the examples themselves
export const PRACTICE_TOOLS = [
	{
		name: 'Sequill editor',
		navLabel: 'SQLite editor',
		href: 'https://sequill.adibitz.com/app',
		description: 'Write and run SQL on a SQLite database in your browser.',
	},
	{
		name: 'Sequill schema visualizer',
		navLabel: 'Schema design',
		href: 'https://sequill.adibitz.com/vis',
		description: 'See your tables and how they connect as a diagram.',
	},
] as const satisfies readonly PracticeTool[];
