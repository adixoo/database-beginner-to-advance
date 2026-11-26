// Runs a Canvas 2D scene: sizes it for the screen's pixel density, plays it once when it first
// scrolls into view, redraws in the current theme's colours, and shows its still frame instead
// of playing when motion is off.

import { FONT_HAND } from './draw';

export type ColorRole =
	| 'canvas'
	| 'surface'
	| 'raised'
	| 'gray800'
	| 'gray600'
	| 'gray500'
	| 'ink'
	| 'inkSoft'
	| 'inkMuted'
	| 'mint'
	| 'sky'
	| 'lilac'
	| 'peach'
	| 'butter';

export type Palette = Record<ColorRole, string>;

export interface Scene {
	// The scene is drawn in this virtual size and scaled to fit the canvas width
	width: number;
	height: number;
	// Length of one play in ms; a looping scene starts again after it
	duration: number;
	loop: boolean;
	// The moment (ms) shown as a still frame when the reader prefers reduced motion
	still: number;
	draw(ctx: CanvasRenderingContext2D, t: number, colors: Palette): void;
}

// CSS custom property behind each role (src/styles/global.css)
const TOKENS: Record<ColorRole, string> = {
	canvas: '--color-canvas',
	surface: '--color-surface',
	raised: '--color-raised',
	gray800: '--color-gray-800',
	gray600: '--color-gray-600',
	gray500: '--color-gray-500',
	ink: '--color-ink',
	inkSoft: '--color-ink-soft',
	inkMuted: '--color-ink-muted',
	mint: '--color-mint',
	sky: '--color-sky',
	lilac: '--color-lilac',
	peach: '--color-peach',
	butter: '--color-butter',
};

function readPalette(): Palette {
	const style = getComputedStyle(document.documentElement);
	const entries = Object.entries(TOKENS).map(([role, token]) => [
		role,
		style.getPropertyValue(token).trim(),
	]);
	return Object.fromEntries(entries) as Palette;
}

// Canvas text does not make the browser fetch a web font, and no page element uses the hand
// font's weights, so ask for them before the first real frame
const handFontsLoaded = Promise.all(
	['400', '600'].map((weight) => document.fonts.load(`${weight} 32px ${FONT_HAND}`)),
)
	.catch(() => [])
	.then(() => document.fonts.ready);

export function mountScene(canvas: HTMLCanvasElement, scene: Scene): void {
	const ctx = canvas.getContext('2d');
	if (!ctx) return;

	canvas.style.aspectRatio = `${scene.width} / ${scene.height}`;
	const reduced = matchMedia('(prefers-reduced-motion: reduce)');
	const root = document.documentElement;
	let colors = readPalette();
	let dark = root.classList.contains('dark');
	// Blank until it plays, so the finished frame never flashes first; with motion off it holds
	// the still frame. Once played, nothing runs, so scrolling costs nothing.
	let t = reduced.matches ? scene.still : 0;
	let startedAt = 0;
	let frame = 0;

	const render = () => {
		if (!canvas.width) return;
		const scale = canvas.width / scene.width;
		ctx.setTransform(scale, 0, 0, scale, 0, 0);
		ctx.clearRect(0, 0, scene.width, scene.height);
		scene.draw(ctx, t, colors);
	};

	const tick = (now: number) => {
		const elapsed = now - startedAt;
		const done = !scene.loop && elapsed >= scene.duration;
		t = done ? scene.still : scene.loop ? elapsed % scene.duration : elapsed;
		render();
		frame = done ? 0 : requestAnimationFrame(tick);
	};

	const play = () => {
		if (frame || reduced.matches) return;
		startedAt = performance.now();
		frame = requestAnimationFrame(tick);
	};

	const rest = () => {
		cancelAnimationFrame(frame);
		frame = 0;
		t = scene.still;
		render();
	};

	const io = new IntersectionObserver(([entry]) => {
		if (!entry?.isIntersecting) return;
		io.disconnect();
		play();
	});
	io.observe(canvas);

	new ResizeObserver(([entry]) => {
		const width = entry?.contentRect.width ?? 0;
		if (!width) return;
		const dpr = Math.min(devicePixelRatio || 1, 2);
		canvas.width = Math.round(width * dpr);
		canvas.height = Math.round(((width * scene.height) / scene.width) * dpr);
		render();
	}).observe(canvas);

	// Theme switch: re-read the colours and redraw. Only the `dark` class counts; other classes
	// on <html> change all the time (the smooth scroller marks every scroll).
	new MutationObserver(() => {
		const nowDark = root.classList.contains('dark');
		if (nowDark === dark) return;
		dark = nowDark;
		colors = readPalette();
		render();
	}).observe(root, { attributes: true, attributeFilter: ['class'] });

	reduced.addEventListener('change', rest);
	// Web fonts may land after the first frame
	void handFontsLoaded.then(render);
}
