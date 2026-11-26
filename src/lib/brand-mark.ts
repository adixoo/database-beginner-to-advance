import { THEME_COLORS } from '../config/theme';

// The site's icon: a hand-written "db" over a mint swoosh on a hand-cut dark tile, on a 64 grid.
// Used for the favicon (src/pages/favicon.svg.ts, favicon.ico.ts) and the share images.

const TILE =
	'M14 2.5 C 26 1.5, 38 2, 50 2.5 C 58 3, 61.5 6, 61.5 14 C 62 26, 62 38, 61.5 50 C 61 58, 58 61.5, 50 61.5 C 38 62.5, 26 62, 14 61.5 C 6 61, 2.5 58, 2.5 50 C 2 38, 2 26, 2.5 14 C 3 6, 6 2.5, 14 2.5 Z';

// d bowl, d stem with its exit, b stem, b bowl
const LETTERS = [
	'M27 33 C 24 27.5, 15 28, 12.5 36 C 10.5 42.5, 14 48.5, 19 48 C 24 47.5, 27 42, 28.5 35',
	'M31 10 C 30.5 22, 29 36, 29 43 C 29 48, 31.5 49.5, 34 47.5',
	'M37.5 10 C 37.5 22, 36.5 36, 36.5 47',
	'M36.5 38 C 39 30.5, 47 29, 50.5 35 C 53.5 41, 50 48.5, 43.5 48.5 C 40.5 48.5, 38 47, 36.5 45',
];

const SWOOSH = 'M12 56.5 C 24 53.5, 39 53.5, 53 50';

// Stroke width that reads best at each display size: heavier when tiny, lighter when large
export function brandMarkStroke(px: number): number {
	if (px <= 16) return 5.4;
	if (px <= 32) return 4.7;
	return 4.3;
}

export function brandMarkSvg(stroke = brandMarkStroke(32)): string {
	const letters = LETTERS.map((d) => `<path d="${d}"/>`).join('');
	return [
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">',
		`<path fill="${THEME_COLORS.surface}" d="${TILE}"/>`,
		`<g fill="none" stroke-linecap="round" stroke-linejoin="round">`,
		`<g stroke="${THEME_COLORS.ink}" stroke-width="${stroke}" transform="translate(3 0) skewX(-6) translate(2 0)">${letters}</g>`,
		`<path stroke="${THEME_COLORS.mint}" stroke-width="${stroke - 1}" d="${SWOOSH}"/>`,
		'</g></svg>',
	].join('');
}
