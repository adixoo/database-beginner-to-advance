// Shared look for data tables: the Table component and Markdown tables (MdTable and friends).

export const TABLE_CLASSES = {
	frame: 'relative overflow-x-auto rounded-xl bg-surface px-3 py-2',
	table: 'w-full border-separate border-spacing-0 text-base tabular-nums',
	row: 'group',
	// Links in cells, in the site's link style (tables sit outside the prose styles)
	links:
		'[&_a]:font-medium [&_a]:text-mint [&_a]:underline [&_a]:decoration-[0.07em] [&_a]:underline-offset-[0.2em]',
	headerCell:
		'border-b border-gray-700 px-3 py-3 text-sm font-medium whitespace-nowrap text-ink-muted', // taste-skill-ignore: table rule
	// Text cells wrap so tables fit their column; figures stay on one line (bodyToneClass)
	bodyCell: 'border-b border-gray-800 px-3 py-3.5 align-top group-last:border-b-0', // taste-skill-ignore: table rule
} as const;

// Numbers are right-aligned; their values are set as figures in full ink
export const headerAlignClass = (numeric: boolean): string =>
	numeric ? 'text-right' : 'text-left';

export const bodyToneClass = (numeric: boolean): string =>
	numeric ? 'text-right font-semibold whitespace-nowrap text-ink' : 'text-ink-soft';

// Markdown marks a right-aligned column (`---:`) with an inline text-align style, as a string or an object
export const isRightAligned = (style: unknown): boolean => {
	if (typeof style === 'string') return /text-align:\s*right/.test(style);
	if (style && typeof style === 'object')
		return (style as Record<string, unknown>).textAlign === 'right';
	return false;
};
