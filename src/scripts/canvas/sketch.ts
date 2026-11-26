// A hand-drawn sketch toolkit for canvas scenes: pen strokes with a hand's wobble and overshoot,
// brush-tapered strands, marker-filled masses, dots and handwritten labels. A sketch is built once
// from a seed (so it looks the same on every visit), then `sketchScene` draws it on stroke by
// stroke, fast and once, straight on the page. Each stroke is drawn in a palette role (ink by
// default; `pen()` switches it), so the sketch follows the theme.
import { FONT_HAND, progress } from './draw';
import type { ColorRole, Palette, Scene } from './stage';

export type Pt = [number, number];

interface PathStroke {
	kind: 'path';
	pts: Pt[];
	cum: number[];
	len: number;
	w: number;
	// Fill with the page colour first, hiding whatever is drawn behind the shape
	paper: boolean;
	// Offset of the faint graphite pass
	ox: number;
	oy: number;
	pen: ColorRole;
}
interface TaperStroke {
	kind: 'taper';
	pts: Pt[];
	w0: number;
	profile: 'tip' | 'spindle';
	color: 'ink' | 'paper';
}
// A marker-filled shape with light strands carved into it (hair, a dark shirt)
interface MassStroke {
	kind: 'mass';
	outline: Pt[];
	strands: TaperStroke[];
	edge: PathStroke;
}
interface DotStroke {
	kind: 'dot';
	cx: number;
	cy: number;
	rx: number;
	ry: number;
	rot: number;
	pen: ColorRole;
}
interface TextStroke {
	kind: 'text';
	str: string;
	x: number;
	y: number;
	size: number;
	rot: number;
	pen: ColorRole;
}
export type Stroke = PathStroke | TaperStroke | MassStroke | DotStroke | TextStroke;

export interface AddOptions {
	w?: number;
	paper?: boolean;
	closed?: boolean;
	sharp?: boolean;
	jit?: number;
	wob?: number;
}

export interface MassOptions {
	// Direction the strands flow at a point
	dir: (x: number, y: number) => number;
	count: number;
	fine: number;
	margin: number;
	fineMargin?: number;
	len: Pt;
	w: Pt;
}

export interface HairOptions {
	// Hair combs out from the crown, then falls forward into a fringe below fringeY
	crown: Pt;
	fringeY: number;
	// The rounded top of the mop: an arc around centre, sweeping `sweep` half-turns
	centre: Pt;
	radius: number;
	sweep: number;
	// Tuft length: base plus up to extra
	tuft: Pt;
	// The jagged fringe, from the back of the head to the front
	fringe: Pt[];
	mass: Omit<MassOptions, 'dir'>;
}

/* ---------- pure geometry ---------- */
const dist = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1]);

function seeded(seed: number): () => number {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function catmull(pts: Pt[], closed: boolean, step = 3): Pt[] {
	const n = pts.length;
	if (n < 2) return pts.map((p) => [p[0], p[1]]);
	const P = closed ? [pts[n - 1]!, ...pts, pts[0]!, pts[1]!] : [pts[0]!, ...pts, pts[n - 1]!];
	const segs = closed ? n : n - 1;
	const out: Pt[] = [];
	for (let i = 0; i < segs; i++) {
		const [p0, p1, p2, p3] = [P[i]!, P[i + 1]!, P[i + 2]!, P[i + 3]!];
		const m = Math.max(2, Math.ceil(dist(p1, p2) / step));
		for (let j = 0; j < m; j++) {
			const t = j / m;
			const t2 = t * t;
			const t3 = t2 * t;
			const f = (a: number, b: number, c: number, d: number) =>
				0.5 *
				(2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
			out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
		}
	}
	const last = closed ? P[1]! : P[n]!;
	out.push([last[0], last[1]]);
	return out;
}

function linear(pts: Pt[], closed: boolean, step = 3): Pt[] {
	const L = closed ? [...pts, pts[0]!] : pts;
	const out: Pt[] = [];
	for (let i = 0; i < L.length - 1; i++) {
		const [a, b] = [L[i]!, L[i + 1]!];
		const m = Math.max(1, Math.ceil(dist(a, b) / step));
		for (let j = 0; j < m; j++)
			out.push([a[0] + ((b[0] - a[0]) * j) / m, a[1] + ((b[1] - a[1]) * j) / m]);
	}
	const e = L[L.length - 1]!;
	out.push([e[0], e[1]]);
	return out;
}

function inPoly(x: number, y: number, poly: Pt[]) {
	let c = false;
	for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
		const [xi, yi] = poly[i]!;
		const [xj, yj] = poly[j]!;
		if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
	}
	return c;
}

/* ---------- building a sketch ---------- */
// `wobble` scales every hand tremor and overshoot: 1 is a steady hand, 2.5 a loose one
export function createSketch(seed: number, wobbleAmount: number) {
	const K = wobbleAmount;
	const strokes: Stroke[] = [];
	const random = seeded(seed);
	const R = (a: number) => (random() * 2 - 1) * a;
	// The palette role new strokes are drawn in
	let current: ColorRole = 'ink';
	const pen = (role: ColorRole) => {
		current = role;
	};

	// Low-frequency hand tremor along the stroke
	const wobble = (d: Pt[], amp: number): Pt[] => {
		const f1 = 0.012 + random() * 0.014;
		const f2 = 0.05 + random() * 0.05;
		const ph = [0, 0, 0, 0].map(() => random() * 6.283) as [number, number, number, number];
		let s = 0;
		return d.map((p, i) => {
			if (i) s += dist(d[i - 1]!, p);
			return [
				p[0] + amp * (0.7 * Math.sin(s * f1 + ph[0]) + 0.3 * Math.sin(s * f2 + ph[1])),
				p[1] + amp * (0.7 * Math.sin(s * f1 + ph[2]) + 0.3 * Math.sin(s * f2 + ph[3])),
			];
		});
	};

	const makePath = (d: Pt[], o: AddOptions): PathStroke => {
		const cum = [0];
		for (let i = 1; i < d.length; i++) cum.push(cum[i - 1]! + dist(d[i - 1]!, d[i]!));
		return {
			kind: 'path',
			pts: d,
			cum,
			len: cum.at(-1) || 1,
			w: o.w ?? 1,
			paper: !!o.paper,
			ox: R(1.4),
			oy: R(1.4),
			pen: current,
		};
	};

	const add = (pts: Pt[], o: AddOptions = {}) => {
		const j = (o.jit ?? 2) * K;
		const c = pts.map((p): Pt => [p[0] + R(j), p[1] + R(j)]);
		const d = wobble((o.sharp ? linear : catmull)(c, !!o.closed), (o.wob ?? 1.4) * K);
		strokes.push(makePath(d, o));
	};

	const seg = (x1: number, y1: number, x2: number, y2: number, o: AddOptions = {}) => {
		const L = Math.hypot(x2 - x1, y2 - y1) || 1;
		const ux = (x2 - x1) / L;
		const uy = (y2 - y1) / L;
		const a = random() * 4 * K;
		const b = random() * 6 * K;
		const bow = R(L * 0.015 * K);
		add(
			[
				[x1 - ux * a, y1 - uy * a],
				[(x1 + x2) / 2 - uy * bow, (y1 + y2) / 2 + ux * bow],
				[x2 + ux * b, y2 + uy * b],
			],
			{ jit: 0.8, ...o },
		);
	};

	const arc = (
		cx: number,
		cy: number,
		rx: number,
		ry: number,
		a0: number,
		a1: number,
		o: AddOptions = {},
	) => {
		const n = Math.max(4, Math.ceil(Math.abs(a1 - a0) / (Math.PI / 9)));
		const pts: Pt[] = [];
		for (let i = 0; i <= n; i++) {
			const a = a0 + ((a1 - a0) * i) / n;
			pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]);
		}
		add(pts, { jit: 1.2, ...o });
	};

	// Closed ellipse drawn the way a pen does it: start anywhere, overshoot the join
	const ellipse = (cx: number, cy: number, rx: number, ry: number, o: AddOptions = {}) => {
		const a0 = random() * Math.PI * 2;
		arc(cx, cy, rx, ry, a0, a0 + Math.PI * 2 + 0.12 + random() * 0.25 * K, o);
	};

	// Polygon with softly rounded corners
	const roundPoly = (pts: Pt[], r: number, o: AddOptions = {}) => {
		const out: Pt[] = [];
		const n = pts.length;
		for (let i = 0; i < n; i++) {
			const [u, v, w] = [pts[(i - 1 + n) % n]!, pts[i]!, pts[(i + 1) % n]!];
			const du = dist(v, u);
			const dw = dist(v, w);
			out.push([v[0] + ((u[0] - v[0]) / du) * r, v[1] + ((u[1] - v[1]) / du) * r]);
			out.push([v[0] + ((w[0] - v[0]) / dw) * r, v[1] + ((w[1] - v[1]) / dw) * r]);
		}
		add(out, { closed: true, sharp: true, jit: 0.3, wob: 0.8, ...o });
	};

	const rrect = (x: number, y: number, w: number, h: number, r: number, o: AddOptions = {}) => {
		const pts: Pt[] = [];
		const corners: [number, number, number, number][] = [
			[x + w - r, y + r, -Math.PI / 2, 0],
			[x + w - r, y + h - r, 0, Math.PI / 2],
			[x + r, y + h - r, Math.PI / 2, Math.PI],
			[x + r, y + r, Math.PI, Math.PI * 1.5],
		];
		for (const [cx, cy, a0, a1] of corners)
			for (let i = 0; i <= 4; i++) {
				const a = a0 + ((a1 - a0) * i) / 4;
				pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
			}
		add(pts, { closed: true, sharp: true, jit: Math.min(2, r * 0.08 + 0.6), wob: 1, ...o });
	};

	const arrow = (pts: Pt[], o: AddOptions = {}) => {
		add(pts, { w: 1.05, ...o });
		const [x, y] = pts[pts.length - 1]!;
		const [px, py] = pts[pts.length - 2]!;
		const a = Math.atan2(y - py, x - px);
		const L = 26;
		seg(x, y, x - Math.cos(a - 0.5) * L, y - Math.sin(a - 0.5) * L);
		seg(x, y, x - Math.cos(a + 0.5) * L, y - Math.sin(a + 0.5) * L);
	};

	const gear = (cx: number, cy: number, ro: number, ri: number, teeth: number) => {
		const pts: Pt[] = [];
		const h = Math.PI / teeth;
		for (let i = 0; i < teeth; i++) {
			const a = (i * 2 * Math.PI) / teeth - Math.PI / 2;
			for (const [r, d] of [
				[ri, -0.62],
				[ro, -0.36],
				[ro, 0.36],
				[ri, 0.62],
			] as const)
				pts.push([cx + r * Math.cos(a + d * h), cy + r * Math.sin(a + d * h)]);
		}
		add(pts, { closed: true, sharp: true, jit: 0.8, wob: 0.8, paper: true, w: 1.05 });
		ellipse(cx, cy, ri * 0.4, ri * 0.4);
	};

	const dot = (cx: number, cy: number, rx: number, ry: number) =>
		strokes.push({ kind: 'dot', cx: cx + R(1), cy: cy + R(1), rx, ry, rot: R(0.35), pen: current });

	const text = (str: string, x: number, y: number, size: number) =>
		strokes.push({ kind: 'text', str, x, y, size, rot: R(0.015 * K), pen: current });

	// Brush stroke with variable width, ending in a point
	const strand = (x: number, y: number, ang: number, len: number, curl: number, w0: number) => {
		const n = Math.max(6, Math.round(len / 4));
		const step = len / n;
		const pts: Pt[] = [[x, y]];
		let a = ang;
		for (let i = 1; i <= n; i++) {
			a += curl / n + R(0.035 * K);
			x += Math.cos(a) * step;
			y += Math.sin(a) * step;
			pts.push([x, y]);
		}
		strokes.push({ kind: 'taper', pts, w0, profile: 'tip', color: 'ink' });
	};

	const texturedMass = (poly: Pt[], o: MassOptions) => {
		const outline = wobble(
			linear(
				poly.map((p): Pt => [p[0] + R(1.5 * K), p[1] + R(1.5 * K)]),
				true,
			),
			1.1 * K,
		);
		const xs = poly.map((p) => p[0]);
		const ys = poly.map((p) => p[1]);
		const [bx0, bx1, by0, by1] = [
			Math.min(...xs),
			Math.max(...xs),
			Math.min(...ys),
			Math.max(...ys),
		];
		const interior = (x: number, y: number, m: number) =>
			[
				[0, 0],
				[m, 0],
				[-m, 0],
				[0, m],
				[0, -m],
			].every(([dx, dy]) => inPoly(x + dx!, y + dy!, poly));
		const pick = (m: number): Pt => {
			for (let k = 0; k < 800; k++) {
				const x = bx0 + random() * (bx1 - bx0);
				const y = by0 + random() * (by1 - by0);
				if (interior(x, y, m)) return [x, y];
			}
			return [(bx0 + bx1) / 2, (by0 + by1) / 2];
		};
		const strands: TaperStroke[] = [];
		const flow = (x: number, y: number, len: number, w0: number) => {
			const n = Math.max(6, Math.round(len / 4));
			const pts: Pt[] = [[x, y]];
			const bend = R(0.2);
			for (let i = 1; i <= n; i++) {
				const a = o.dir(x, y) + bend + R(0.03 * K);
				x += (Math.cos(a) * len) / n;
				y += (Math.sin(a) * len) / n;
				pts.push([x, y]);
			}
			strands.push({ kind: 'taper', pts, w0, profile: 'spindle', color: 'paper' });
		};
		for (let n = 0; n < o.count; n++) {
			const [x, y] = pick(o.margin);
			flow(
				x,
				y,
				o.len[0] + random() * (o.len[1] - o.len[0]),
				o.w[0] + random() * (o.w[1] - o.w[0]),
			);
		}
		for (let n = 0; n < o.fine; n++) {
			const [x, y] = pick(o.fineMargin ?? 6);
			flow(x, y, 12 + random() * 24, 0.8 + random() * 0.7);
		}
		strokes.push({ kind: 'mass', outline, strands, edge: makePath(outline, { w: 0.95 }) });
	};

	// A rounded mop of hair with pointed tufts that follow the flow, and a few flyaways on top
	const hairMop = (o: HairOptions) => {
		const [cx, cy] = o.centre;
		const dir = (x: number, y: number) => {
			let a = Math.atan2(y - o.crown[1], x - o.crown[0]);
			if (y > o.fringeY) {
				const k = Math.min(1, (y - o.fringeY) / 70) * 0.65;
				a = a * (1 - k) + (Math.PI / 2 + 0.15) * k;
			}
			return a;
		};
		const steps = 46;
		const hair: Pt[] = [];
		const tuftAt = new Set<number>();
		for (let i = 3; i < steps - 2; i += 3 + Math.floor(random() * 3)) tuftAt.add(i);
		for (let i = 0; i <= steps; i++) {
			const a = Math.PI * 0.95 + (i / steps) * Math.PI * o.sweep;
			const r = o.radius + R(4);
			const p: Pt = [cx + r * Math.cos(a), cy + r * Math.sin(a)];
			if (tuftAt.has(i)) {
				const fa = dir(p[0], p[1]);
				const ta = Math.atan2(Math.sin(a) + Math.sin(fa) * 1.2, Math.cos(a) + Math.cos(fa) * 1.2);
				const L = o.tuft[0] + random() * o.tuft[1];
				hair.push([p[0] + Math.cos(ta) * L, p[1] + Math.sin(ta) * L]);
			} else hair.push(p);
		}
		hair.push(...o.fringe);
		texturedMass(hair, { dir, ...o.mass });
		for (let k = 0; k < 4; k++) {
			const p = hair[5 + Math.floor(random() * (steps - 10))]!;
			const ang = Math.atan2(p[1] - cy, p[0] - cx) * 0.5 + dir(p[0], p[1]) * 0.5;
			strand(
				p[0] - Math.cos(ang) * 6,
				p[1] - Math.sin(ang) * 6,
				ang,
				16 + random() * 18,
				R(0.9),
				1.6,
			);
		}
	};

	return {
		strokes,
		random,
		R,
		pen,
		add,
		seg,
		arc,
		ellipse,
		roundPoly,
		rrect,
		arrow,
		gear,
		dot,
		text,
		strand,
		texturedMass,
		hairMop,
	};
}

/* ---------- drawing it on ---------- */
function tracePath(
	ctx: CanvasRenderingContext2D,
	pts: Pt[],
	dx = 0,
	dy = 0,
	upto = Infinity,
	cum?: number[],
) {
	const [first] = pts;
	if (!first) return;
	ctx.beginPath();
	ctx.moveTo(first[0] + dx, first[1] + dy);
	for (let i = 1; i < pts.length; i++) {
		const p = pts[i]!;
		if (cum && cum[i]! > upto) {
			const prev = pts[i - 1]!;
			const k = (upto - cum[i - 1]!) / (cum[i]! - cum[i - 1]! || 1);
			ctx.lineTo(prev[0] + (p[0] - prev[0]) * k + dx, prev[1] + (p[1] - prev[1]) * k + dy);
			return;
		}
		ctx.lineTo(p[0] + dx, p[1] + dy);
	}
}

function fillTaper(ctx: CanvasRenderingContext2D, s: TaperStroke, ws: number) {
	const p = s.pts;
	const n = p.length;
	const left: Pt[] = [];
	const right: Pt[] = [];
	for (let i = 0; i < n; i++) {
		const a = p[Math.max(0, i - 1)]!;
		const b = p[Math.min(n - 1, i + 1)]!;
		const dx = b[0] - a[0];
		const dy = b[1] - a[1];
		const d = Math.hypot(dx, dy) || 1;
		const t = i / (n - 1);
		const shape =
			s.profile === 'tip'
				? Math.min(1, t * 5 + 0.3) * Math.pow(1 - t, 0.85)
				: Math.sin(Math.PI * Math.pow(t, 0.75));
		const w = (shape * s.w0 * ws) / 2;
		left.push([p[i]![0] + (-dy / d) * w, p[i]![1] + (dx / d) * w]);
		right.push([p[i]![0] - (-dy / d) * w, p[i]![1] - (dx / d) * w]);
	}
	ctx.beginPath();
	ctx.moveTo(left[0]![0], left[0]![1]);
	for (let i = 1; i < n; i++) ctx.lineTo(left[i]![0], left[i]![1]);
	for (let i = n - 1; i >= 0; i--) ctx.lineTo(right[i]![0], right[i]![1]);
	ctx.closePath();
	ctx.fill();
}

function drawPath(
	ctx: CanvasRenderingContext2D,
	s: PathStroke,
	p: number,
	base: number,
	colors: Palette,
) {
	if (s.paper) {
		tracePath(ctx, s.pts);
		ctx.closePath();
		ctx.fillStyle = colors.canvas;
		ctx.fill();
	}
	const upto = s.len * p;
	ctx.strokeStyle = colors[s.pen];
	ctx.lineWidth = base * s.w;
	tracePath(ctx, s.pts, 0, 0, upto, s.cum);
	ctx.stroke();
	// Faint graphite pass beside the line
	ctx.save();
	ctx.globalAlpha *= 0.3;
	ctx.lineWidth = base * s.w * 0.35;
	tracePath(ctx, s.pts, s.ox, s.oy, upto, s.cum);
	ctx.stroke();
	ctx.restore();
}

function drawStroke(
	ctx: CanvasRenderingContext2D,
	s: Stroke,
	p: number,
	base: number,
	colors: Palette,
) {
	const ink = colors.ink;
	const paper = colors.canvas;
	const ws = base / 4.4;
	switch (s.kind) {
		case 'path':
			drawPath(ctx, s, p, base, colors);
			break;
		case 'taper':
			ctx.save();
			ctx.globalAlpha *= p;
			ctx.fillStyle = s.color === 'paper' ? paper : ink;
			fillTaper(ctx, s, ws);
			ctx.restore();
			break;
		case 'mass':
			// Marker fill floods in, the strands are carved after it, the edge draws round it
			ctx.save();
			ctx.globalAlpha *= Math.min(1, p * 1.6);
			tracePath(ctx, s.outline);
			ctx.closePath();
			ctx.fillStyle = ink;
			ctx.fill();
			ctx.clip();
			ctx.globalAlpha *= Math.max(0, (p - 0.35) / 0.65);
			ctx.fillStyle = paper;
			for (const strand of s.strands) fillTaper(ctx, strand, ws);
			ctx.restore();
			drawPath(ctx, s.edge, p, base, colors);
			break;
		case 'dot':
			ctx.fillStyle = colors[s.pen];
			ctx.beginPath();
			ctx.ellipse(s.cx, s.cy, s.rx * p, s.ry * p, s.rot, 0, Math.PI * 2);
			ctx.fill();
			break;
		case 'text': {
			ctx.save();
			ctx.translate(s.x, s.y);
			ctx.rotate(s.rot);
			// Thin, regular-weight handwriting. Caveat runs smaller than the sketches' original
			// hand font, hence the scale.
			ctx.font = `400 ${s.size * 1.15}px ${FONT_HAND}`;
			const width = ctx.measureText(s.str).width;
			ctx.beginPath();
			ctx.rect(-width / 2 - 6, -s.size * 1.2, (width + 12) * p, s.size * 1.7);
			ctx.clip();
			ctx.fillStyle = colors[s.pen];
			ctx.textAlign = 'center';
			ctx.fillText(s.str, 0, 0);
			ctx.restore();
			break;
		}
	}
}

// One quick pass, strokes overlapping like a fast pen
const START = 120;
const SPREAD = 1450;
const PATH_MS = 240;
const MASS_MS = 420;

// Strokes that are fully drawn, kept as an image so each frame only draws the strokes in progress
interface Layer {
	key: string;
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	// Strokes [0, committed) are in the layer
	committed: number;
	lastT: number;
}

export function sketchScene(strokes: Stroke[], width: number, height: number): Scene {
	const gap = SPREAD / strokes.length;
	const end = START + SPREAD + MASS_MS;
	const startOf = (i: number) => START + i * gap;
	const endOf = (i: number) => startOf(i) + (strokes[i]!.kind === 'mass' ? MASS_MS : PATH_MS);
	const layers = new WeakMap<HTMLCanvasElement, Layer>();

	// No sheet: the sketch sits straight on the page. A small margin keeps overshooting strokes
	// inside the canvas.
	const prepare = (ctx: CanvasRenderingContext2D, transform: DOMMatrix) => {
		ctx.setTransform(transform);
		ctx.translate(width * 0.03, height * 0.03);
		ctx.scale(0.94, 0.94);
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
	};

	return {
		width,
		height,
		duration: end,
		loop: false,
		still: end,
		draw(ctx, t, colors) {
			const transform = ctx.getTransform();
			// Keep lines at least 1.5 CSS px wide on small screens
			const base = Math.max(4.4, 1.5 / (transform.a / (devicePixelRatio || 1)));
			const { width: pw, height: ph } = ctx.canvas;
			const key = `${pw}x${ph} ${colors.ink} ${colors.canvas}`;

			let layer = layers.get(ctx.canvas as HTMLCanvasElement);
			if (!layer || layer.key !== key || t < layer.lastT) {
				const canvas = layer?.canvas ?? document.createElement('canvas');
				canvas.width = pw;
				canvas.height = ph;
				const layerCtx = canvas.getContext('2d')!;
				layerCtx.clearRect(0, 0, pw, ph);
				prepare(layerCtx, transform);
				layer = { key, canvas, ctx: layerCtx, committed: 0, lastT: t };
				layers.set(ctx.canvas as HTMLCanvasElement, layer);
			}
			layer.lastT = t;

			// Commit finished strokes, in order, so the layer keeps the drawing's stacking
			while (layer.committed < strokes.length && t >= endOf(layer.committed)) {
				drawStroke(layer.ctx, strokes[layer.committed]!, 1, base, colors);
				layer.committed++;
			}

			ctx.save();
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.drawImage(layer.canvas, 0, 0);
			ctx.restore();

			// Then only the strokes still being drawn
			ctx.save();
			prepare(ctx, transform);
			for (let i = layer.committed; i < strokes.length && startOf(i) <= t; i++) {
				const p = progress(t, startOf(i), endOf(i));
				if (p > 0) drawStroke(ctx, strokes[i]!, p, base, colors);
			}
			ctx.restore();
		},
	};
}
