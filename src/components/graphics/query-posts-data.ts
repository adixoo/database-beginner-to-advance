// The course's `posts` table as it stands from Filtering and sorting on (with its views column),
// shared by the Filtering and Counting graphics so every picture shows the same rows.

// Same shape as SvgTable's columns
export interface TableColumn {
	label: string;
	x: number;
	anchor: 'start' | 'end';
	key?: boolean;
}

export const POSTS_COLUMNS: TableColumn[] = [
	{ label: 'id', x: 50, anchor: 'end' },
	{ label: 'user_id', x: 124, anchor: 'end' },
	{ label: 'caption', x: 146, anchor: 'start' },
	{ label: 'views', x: 380, anchor: 'end' },
];

export const POSTS_WIDTH = 400;

export const POSTS_ROWS: string[][] = [
	['101', '1', 'Sunset at the beach', '42'],
	['102', '2', 'First latte art', '7'],
	['103', '1', 'Weekend trek', '15'],
	['104', '2', 'Street tacos', '23'],
	['105', '2', 'NULL', '3'],
];

// Picks rows by index, in the given order: a query's result
export const postsRows = (indexes: number[]): string[][] =>
	indexes.map((index) => POSTS_ROWS[index]);
