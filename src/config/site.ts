export const SITE_NAME = 'learndb';

export const LEVELS = ['beginner', 'advanced'] as const;
export type Level = (typeof LEVELS)[number];

export interface LearningPath {
	label: string;
	href: string;
	summary: string;
}

export const PATHS = {
	beginner: {
		label: 'Beginner',
		href: '/beginner',
		summary: 'Start here if databases are new to you.',
	},
	advanced: {
		label: 'Advanced',
		href: '/advanced',
		summary: 'For when you already write SQL and want to go deeper.',
	},
} as const satisfies Record<Level, LearningPath>;
