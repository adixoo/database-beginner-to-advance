// The `posts` and `users` tables side by side as the INNER, RIGHT and FULL JOIN graphics draw
// them: posts on the left, users on the right, matched on user_id.
import { CONSTRAINT_USERS_ROWS } from './constraint-tables';
import { POSTS_ROWS, type TableColumn } from './query-posts-data';

export const JOIN_POSTS_COLUMNS: TableColumn[] = [
	{ label: 'id', x: 54, anchor: 'end' },
	{ label: 'user_id', x: 124, anchor: 'end', key: true },
	{ label: 'caption', x: 150, anchor: 'start' },
];

// The first three posts, without views
export const JOIN_POSTS_ROWS: string[][] = POSTS_ROWS.slice(0, 3).map((row) => row.slice(0, 3));

export const JOIN_USERS_COLUMNS: TableColumn[] = [
	{ label: 'id', x: 474, anchor: 'end', key: true },
	{ label: 'username', x: 494, anchor: 'start' },
	{ label: 'name', x: 600, anchor: 'start' },
];

export const JOIN_USERS_ROWS: string[][] = CONSTRAINT_USERS_ROWS;
