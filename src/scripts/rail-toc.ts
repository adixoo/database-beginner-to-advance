// "On this page" as a rail: a dashed line through a dot per heading, filled in up to where the
// reader is, with a small plane that glides along it and turns to face the way the page scrolls.
// Ported from rare-ui's rail-toc (swamimalode07/rare-ui) to plain DOM, with its motion springs
// replaced by GSAP quickTo tweens. OnThisPage.astro renders the links; this draws the rail.
import { gsap } from 'gsap';
import { RAIL_X, railX } from './rail-toc-layout';

const SVG = 'http://www.w3.org/2000/svg';
// Rail length the plane must back up before it turns round, so scroll jitter cannot flip it
const TURN_SLACK = 2;
// The plane is narrower than a dot, so the rail and dots under it are cut away
const PLANE_HOLE = 4;

type Point = { x: number; y: number };

function buildPath(nodes: Point[]): string {
	const [first] = nodes;
	if (!first) return '';
	const points: Point[] = [{ x: first.x, y: 0 }, first];
	for (let i = 1; i < nodes.length; i++) {
		const from = nodes[i - 1]!;
		const to = nodes[i]!;
		if (from.x !== to.x) {
			const bend = (to.y - from.y) * 0.3;
			points.push({ x: from.x, y: from.y + bend }, { x: to.x, y: to.y - bend });
		}
		points.push(to);
	}
	return points.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join(' ');
}

// The rail only ever runs downward, so y grows along its length
function lengthAtY(path: SVGPathElement, total: number, y: number): number {
	let lo = 0;
	let hi = total;
	for (let i = 0; i < 24; i++) {
		const mid = (lo + hi) / 2;
		if (path.getPointAtLength(mid).y < y) lo = mid;
		else hi = mid;
	}
	return hi;
}

function el<K extends keyof SVGElementTagNameMap>(
	tag: K,
	attrs: Record<string, string | number> = {},
): SVGElementTagNameMap[K] {
	const node = document.createElementNS(SVG, tag);
	for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
	return node;
}

export interface RailTocOptions {
	// Where a heading counts as reached, in px from the top of the screen (clears the fixed navbar)
	offset: number;
}

export function initRailToc(nav: HTMLElement, { offset }: RailTocOptions): void {
	const list = nav.querySelector<HTMLElement>('[data-rail-list]');
	const plane = nav.querySelector<HTMLElement>('[data-rail-plane]');
	const rows = [...nav.querySelectorAll<HTMLElement>('[data-rail-item]')];
	const links = rows.map((row) => row.querySelector<HTMLAnchorElement>('a')!);
	const headings = links.map((link) =>
		document.getElementById(decodeURIComponent(link.hash.slice(1))),
	);
	if (!list || !plane || !rows.length) return;
	const reduce = matchMedia('(prefers-reduced-motion: reduce)');

	/* ---------- the drawing, built once and re-measured on resize ---------- */
	const svg = el('svg', {
		class: 'pointer-events-none absolute left-0 top-0 overflow-visible',
		'aria-hidden': 'true',
	});
	const fade = el('linearGradient', {
		id: 'rail-toc-fade',
		gradientUnits: 'userSpaceOnUse',
		x1: 0,
		y1: 0,
		x2: 0,
	});
	fade.append(
		el('stop', { offset: 0, 'stop-color': 'black' }),
		el('stop', { offset: 1, 'stop-color': 'white' }),
	);
	const railMask = el('mask', { id: 'rail-toc-mask', maskUnits: 'userSpaceOnUse' });
	const railMaskFill = el('rect', { fill: 'url(#rail-toc-fade)' });
	const nodeCutouts = rows.map(() => el('circle', { r: 4, fill: 'black' }));
	const railHole = el('circle', { r: PLANE_HOLE, fill: 'black' });
	railMask.append(railMaskFill, ...nodeCutouts, railHole);
	const dotMask = el('mask', { id: 'rail-toc-dots', maskUnits: 'userSpaceOnUse' });
	const dotMaskFill = el('rect', { fill: 'white' });
	const dotHole = el('circle', { r: PLANE_HOLE, fill: 'black' });
	dotMask.append(dotMaskFill, dotHole);

	const rail = el('path', {
		fill: 'none',
		'stroke-width': 1.25,
		'stroke-dasharray': '2 5',
		'stroke-linecap': 'round',
		'stroke-linejoin': 'round',
		class: 'stroke-gray-600',
	});
	// The travelled part, drawn as a dash that grows along a normalised length
	const trail = el('path', {
		fill: 'none',
		'stroke-width': 1.5,
		'stroke-linejoin': 'round',
		pathLength: 1,
		'stroke-dasharray': 1,
		'stroke-dashoffset': 1,
		class: 'stroke-mint',
	});
	const railGroup = el('g', { mask: 'url(#rail-toc-mask)' });
	railGroup.append(rail, trail);
	const dots = rows.map(() => el('circle', { r: 3.25, 'stroke-width': 1.25, class: 'rail-dot' }));
	const dotGroup = el('g', { mask: 'url(#rail-toc-dots)' });
	dotGroup.append(...dots);
	const defs = el('defs');
	defs.append(fade, railMask, dotMask);
	svg.append(defs, railGroup, dotGroup);
	list.prepend(svg);

	let lengths: number[] = [];
	let total = 0;

	const measure = () => {
		const nodes = rows.map((row) => ({
			x: railX(Number(row.dataset.depth ?? 0)),
			y: row.offsetTop + row.offsetHeight / 2,
		}));
		const width = Math.max(...nodes.map((n) => n.x)) + RAIL_X + 4;
		const height = list.offsetHeight;
		const box = { x: -8, y: -8, width: width + 16, height: height + 16 };
		svg.setAttribute('width', String(width));
		svg.setAttribute('height', String(height));
		for (const mask of [railMask, dotMask])
			for (const [k, v] of Object.entries(box)) mask.setAttribute(k, String(v));
		for (const rect of [railMaskFill, dotMaskFill])
			for (const [k, v] of Object.entries(box)) rect.setAttribute(k, String(v));
		fade.setAttribute('y2', String((nodes[0]?.y ?? 4) - 4));
		const d = buildPath(nodes);
		rail.setAttribute('d', d);
		trail.setAttribute('d', d);
		nodes.forEach((node, i) => {
			for (const circle of [nodeCutouts[i]!, dots[i]!]) {
				circle.setAttribute('cx', String(node.x));
				circle.setAttribute('cy', String(node.y));
			}
		});
		total = rail.getTotalLength();
		lengths = nodes.map((node) => lengthAtY(rail, total, node.y));
	};

	/* ---------- the plane ---------- */
	let reached = -1;
	let facing: 1 | -1 = 1;
	let turnFrom = 0;
	let heading = 180;
	const state = { l: 0 };

	const turnTo = gsap.quickTo(plane, 'rotation', { duration: 0.4, ease: 'power3.out' });

	const pose = (l: number) => {
		if (!total) return;
		const at = rail.getPointAtLength(l);
		const behind = rail.getPointAtLength(Math.max(0, l - 1));
		const ahead = rail.getPointAtLength(Math.min(total, l + 1));
		gsap.set(plane, { x: at.x, y: at.y });
		for (const hole of [railHole, dotHole]) {
			hole.setAttribute('cx', String(at.x));
			hole.setAttribute('cy', String(at.y));
		}
		const angle =
			(Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI +
			90 +
			(facing < 0 ? 180 : 0);
		// Unwrapped against the current heading, so the turn takes the short way round
		heading = angle + 360 * Math.round((heading - angle) / 360);
		if (reduce.matches) gsap.set(plane, { rotation: heading });
		else turnTo(heading);
		trail.setAttribute('stroke-dashoffset', String(1 - l / total));

		const count = lengths.filter((n) => n <= l + 0.5).length;
		if (count === reached) return;
		reached = count;
		dots.forEach((dot, i) => {
			dot.classList.toggle('is-reached', i < count);
			dot.setAttribute('r', i < count ? '3' : '3.25');
		});
		const active = Math.max(0, count - 1);
		links.forEach((link, i) => {
			if (i === active) link.setAttribute('aria-current', 'location');
			else link.removeAttribute('aria-current');
		});
	};

	// Glides the plane to a length on the rail; a fresh target retargets the running tween
	const travelTo = gsap.quickTo(state, 'l', {
		duration: 0.55,
		ease: 'power3.out',
		onUpdate: () => pose(state.l),
	});

	const aim = (next: number) => {
		if ((next - turnFrom) * facing > 0) turnFrom = next;
		else if (Math.abs(next - turnFrom) > TURN_SLACK) {
			facing = facing > 0 ? -1 : 1;
			turnFrom = next;
		}
		if (reduce.matches) {
			state.l = next;
			pose(next);
		} else travelTo(next);
	};

	/* ---------- following the page ---------- */
	// A clicked heading holds the plane until the reader scrolls, since headings near the end
	// cannot scroll up to the reading line
	let pinned: number | null = null;
	let userScrolled = false;
	let placed = false;

	const target = (): number => {
		if (pinned !== null) return lengths[pinned] ?? 0;
		const scrollTop = scrollY;
		const viewHeight = innerHeight;
		// The reading line starts at the top edge and sweeps to the bottom near the end, so the
		// first and the last headings can both be reached
		const remaining = Math.max(0, document.documentElement.scrollHeight - viewHeight - scrollTop);
		const line = Math.min(offset, scrollTop);
		const anchor = line + Math.max(0, viewHeight - line - remaining);
		const tops = headings.map((h) => (h ? h.getBoundingClientRect().top : Infinity));
		const index = tops.findLastIndex((top) => top <= anchor);
		if (index === -1) return lengths[0] ?? 0;
		if (index === lengths.length - 1) return lengths[index]!;
		const span = tops[index + 1]! - tops[index]!;
		const progress = span > 0 ? (anchor - tops[index]!) / span : 0;
		return (
			lengths[index]! + Math.min(1, Math.max(0, progress)) * (lengths[index + 1]! - lengths[index]!)
		);
	};

	const sync = () => {
		if (!lengths.length) return;
		const next = target();
		if (!placed) {
			placed = true;
			state.l = next;
			turnFrom = next;
			pose(next);
			gsap.set(plane, { rotation: heading, autoAlpha: 1 });
			return;
		}
		aim(next);
	};

	let frame = 0;
	const onScroll = () => {
		if (pinned !== null && userScrolled) pinned = null;
		if (!frame)
			frame = requestAnimationFrame(() => {
				frame = 0;
				sync();
			});
	};
	const onIntent = () => {
		userScrolled = true;
	};

	addEventListener('scroll', onScroll, { passive: true });
	addEventListener('wheel', onIntent, { passive: true });
	addEventListener('touchstart', onIntent, { passive: true });
	addEventListener('pointerdown', onIntent);
	addEventListener('keydown', onIntent);

	links.forEach((link, i) =>
		link.addEventListener('click', () => {
			pinned = i;
			userScrolled = false;
			sync();
		}),
	);

	const remeasure = () => {
		measure();
		pose(state.l);
		sync();
	};
	new ResizeObserver(remeasure).observe(list);
	void document.fonts.ready.then(remeasure);
	remeasure();
}
