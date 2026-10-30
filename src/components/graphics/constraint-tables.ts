// The course's `users` and `posts` tables as the Constraints topic finds them, shared by its
// graphics.
import { POSTS_ROWS, type TableColumn } from './query-posts-data';

export const CONSTRAINT_POSTS_COLUMNS: TableColumn[] = [
	{ label: 'id', x: 50, anchor: 'end' },
	{ label: 'user_id', x: 124, anchor: 'end' },
	{ label: 'caption', x: 146, anchor: 'start' },
	{ label: 'views', x: 420, anchor: 'end' },
];

export const CONSTRAINT_POSTS_WIDTH = 440;

export const CONSTRAINT_POSTS_ROWS: string[][] = POSTS_ROWS;

export const CONSTRAINT_USERS_COLUMNS: TableColumn[] = [
	{ label: 'id', x: 50, anchor: 'end' },
	{ label: 'username', x: 74, anchor: 'start' },
	{ label: 'name', x: 210, anchor: 'start' },
];

export const CONSTRAINT_USERS_WIDTH = 300;

export const CONSTRAINT_USERS_ROWS: string[][] = [
	['1', 'asha.codes', 'Asha'],
	['2', 'ravi.clicks', 'Ravi'],
	['3', 'meera.eats', 'Meera'],
];
