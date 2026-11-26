// Rail geometry shared by OnThisPage.astro (label indents) and rail-toc.ts (the drawing), in px
export const RAIL_X = 5;
export const INDENT = 14;
export const LABEL_GAP = 14;

// Where the rail runs for a heading level (0 for h2, 1 for h3)
export function railX(depth: number): number {
	return RAIL_X + depth * INDENT;
}
