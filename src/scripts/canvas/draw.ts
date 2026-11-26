// Drawing helpers shared by the canvas scenes: timing, hand-drawn strokes and handwriting,
// typed code and the window that frames a mockup.
import type { ColorRole, Palette } from './stage';

export const FONT_SANS = "'DM Sans', system-ui, sans-serif";
export const FONT_MONO = "'JetBrains Mono', monospace"; // taste-skill-ignore: code in a mockup
export const FONT_HAND = "'Caveat', 'Segoe Print', cursive";

export interface Point {
	x: number;
	y: number;
}

// 0 before `start`, 1 after `end`, eased out in between
export function progress(t: number, start: number, end: number): number {
	const p = Math.min(Math.max((t - start) / (end - start), 0), 1);
	return 1 - (1 - p) ** 3;
}

// Small deterministic jitter so strokes wobble the same way on every frame
function seeded(seed: number): () => number {
	let s = seed;
	return () => {
		s = (s * 16807) % 2147483647;
		return s / 2147483647 - 0.5;
	};
}

// A hand-drawn line from `from` to `to`, bowed sideways by `bend` (negative bends the other way)
export function handPath(from: Point, to: Point, bend: number, seed = 7): Point[] {
	const rand = seeded(seed);
	const dx = to.x - from.x;
	const dy = to.y - from.y;
	const length = Math.hypot(dx, dy) || 1;
	const control = {
		x: (from.x + to.x) / 2 - (dy / length) * bend,
		y: (from.y + to.y) / 2 + (dx / length) * bend,
	};
	const steps = 28;
	return Array.from({ length: steps + 1 }, (_, i) => {
		const k = i / steps;
		const wobble = i === 0 || i === steps ? 0 : rand() * 1.4;
		return {
			x: (1 - k) ** 2 * from.x + 2 * (1 - k) * k * control.x + k ** 2 * to.x + wobble,
			y: (1 - k) ** 2 * from.y + 2 * (1 - k) * k * control.y + k ** 2 * to.y + wobble,
		};
	});
}

export function strokePartial(
	ctx: CanvasRenderingContext2D,
	points: Point[],
	p: number,
): Point | undefined {
	const segments = points.length - 1;
	const reach = p * segments;
	const [first] = points;
	if (!first || p <= 0) return undefined;
	ctx.beginPath();
	ctx.moveTo(first.x, first.y);
	let end = first;
	for (let i = 1; i <= segments; i++) {
		const a = points[i - 1]!;
		const b = points[i]!;
		const k = Math.min(reach - (i - 1), 1);
		if (k <= 0) break;
		end = { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
		ctx.lineTo(end.x, end.y);
	}
	ctx.stroke();
	return end;
}

// Draws the shaft over the first 80% of `p`, then the two strokes of the head
export function drawArrow(
	ctx: CanvasRenderingContext2D,
	points: Point[],
	p: number,
	color: string,
): void {
	ctx.save();
	ctx.strokeStyle = color;
	ctx.lineWidth = 2.6;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	strokePartial(ctx, points, Math.min(p / 0.8, 1));
	const head = (p - 0.8) / 0.2;
	const tip = points.at(-1);
	const before = points.at(-4);
	if (head > 0 && tip && before) {
		const angle = Math.atan2(tip.y - before.y, tip.x - before.x);
		for (const side of [-1, 1]) {
			const wing = angle + Math.PI + side * 0.5;
			const size = 13 * Math.min(head, 1);
			ctx.beginPath();
			ctx.moveTo(tip.x, tip.y);
			ctx.lineTo(tip.x + Math.cos(wing) * size, tip.y + Math.sin(wing) * size);
			ctx.stroke();
		}
	}
	ctx.restore();
}

// Handwriting: the text is uncovered left to right as `p` goes from 0 to 1, slightly tilted
export function writeHand(
	ctx: CanvasRenderingContext2D,
	text: string,
	at: Point,
	p: number,
	{ size, color, tilt = -0.04 }: { size: number; color: string; tilt?: number },
): void {
	if (p <= 0) return;
	ctx.save();
	ctx.translate(at.x, at.y);
	ctx.rotate(tilt);
	ctx.font = `600 ${size}px ${FONT_HAND}`;
	const width = ctx.measureText(text).width;
	ctx.beginPath();
	ctx.rect(-4, -size * 1.1, (width + 8) * p, size * 1.6);
	ctx.clip();
	ctx.fillStyle = color;
	ctx.textBaseline = 'alphabetic';
	ctx.fillText(text, 0, 0);
	ctx.restore();
}

export type CodePart = [text: string, role: ColorRole];

// Code typed one character at a time; returns where the caret is
export function typeCode(
	ctx: CanvasRenderingContext2D,
	parts: CodePart[],
	at: Point,
	chars: number,
	colors: Palette,
	size = 15,
): Point {
	ctx.font = `500 ${size}px ${FONT_MONO}`;
	ctx.textBaseline = 'alphabetic';
	let x = at.x;
	let left = chars;
	for (const [text, role] of parts) {
		if (left <= 0) break;
		const shown = text.slice(0, left);
		ctx.fillStyle = colors[role];
		ctx.fillText(shown, x, at.y);
		x += ctx.measureText(shown).width;
		left -= text.length;
	}
	return { x, y: at.y };
}

export function codeLength(parts: CodePart[]): number {
	return parts.reduce((sum, [text]) => sum + text.length, 0);
}

export function drawCaret(
	ctx: CanvasRenderingContext2D,
	at: Point,
	t: number,
	color: string,
	size = 15,
): void {
	if (Math.floor(t / 450) % 2) return;
	ctx.fillStyle = color;
	ctx.fillRect(at.x + 1, at.y - size * 0.85, 2, size * 1.05);
}

// The mockup's window: a filled panel with a title bar one tone up
export function drawWindow(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	title: string,
	colors: Palette,
): void {
	ctx.fillStyle = colors.surface;
	ctx.beginPath();
	ctx.roundRect(0, 0, width, height, 16);
	ctx.fill();
	ctx.fillStyle = colors.raised;
	ctx.beginPath();
	ctx.roundRect(0, 0, width, 44, [16, 16, 0, 0]);
	ctx.fill();
	ctx.fillStyle = colors.inkMuted;
	ctx.font = `600 14px ${FONT_SANS}`;
	ctx.textBaseline = 'middle';
	ctx.fillText(title, 20, 22);
	ctx.textBaseline = 'alphabetic';
}

// A rounded box filled with a 14% wash of `color` and outlined in it (a highlighted cell)
export function washBox(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	w: number,
	h: number,
	color: string,
	p: number,
): void {
	if (p <= 0) return;
	ctx.save();
	// Relative to the current alpha, so a scene's fade-out fades the wash too
	const base = ctx.globalAlpha;
	ctx.beginPath();
	ctx.roundRect(x, y, w, h, 8);
	ctx.globalAlpha = base * 0.16 * p;
	ctx.fillStyle = color;
	ctx.fill();
	ctx.globalAlpha = base * p;
	ctx.strokeStyle = color;
	ctx.lineWidth = 2;
	ctx.stroke();
	ctx.restore();
}
