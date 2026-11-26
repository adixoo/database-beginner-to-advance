// The topics list's hooks (TopicList.astro): a dashed mint line runs down the list to the current
// topic and curls into it, and a faint second hook follows the topic under the pointer or focus.
// Ported from rare-ui's hook-sidebar (swamimalode07/rare-ui) to plain DOM, with its motion
// springs replaced by GSAP tweens.
import { gsap } from 'gsap';

// Height of the curl at the end of a line, in px
const CORNER = 6;

interface Rail {
	root: HTMLElement;
	line: HTMLElement;
	corner: SVGElement;
}

function railParts(root: HTMLElement): Rail {
	return {
		root,
		line: root.querySelector<HTMLElement>('[data-hook-line]')!,
		corner: root.querySelector<SVGElement>('[data-hook-corner]')!,
	};
}

export function initHookList(list: HTMLElement): void {
	const links = [...list.querySelectorAll<HTMLAnchorElement>('[data-hook-item]')];
	const activeRoot = list.querySelector<HTMLElement>('[data-hook-rail="active"]');
	const hoverRoot = list.querySelector<HTMLElement>('[data-hook-rail="hover"]');
	if (!links.length || !activeRoot || !hoverRoot) return;

	const active = railParts(activeRoot);
	const hover = railParts(hoverRoot);
	const reduce = matchMedia('(prefers-reduced-motion: reduce)');
	const activeIndex = links.findIndex((link) => link.getAttribute('aria-current') === 'page');

	let centers: number[] = [];
	let hoverIndex: number | null = null;
	let pointerInside = false;
	let focusInside = false;

	// The hover hook travels quickly and lands softly; the fade is shorter
	const travel = { duration: 0.35, ease: 'expo.out' };
	const lineTop = gsap.quickTo(hover.line, 'top', travel);
	const lineHeight = gsap.quickTo(hover.line, 'height', travel);
	const cornerTop = gsap.quickTo(hover.corner, 'top', travel);

	const place = (rail: Rail, from: number, y: number, animate: boolean) => {
		const top = from;
		const height = Math.max(0, y - CORNER - from);
		if (animate && !reduce.matches) {
			lineTop(top);
			lineHeight(height);
			cornerTop(y - CORNER);
		} else {
			gsap.set(rail.line, { top, height });
			gsap.set(rail.corner, { top: y - CORNER });
		}
	};

	const measure = () => {
		const origin = list.getBoundingClientRect().top;
		centers = links.map((link) => {
			const box = link.getBoundingClientRect();
			return box.top - origin + box.height / 2;
		});
		const activeY = centers[activeIndex];
		if (activeY !== undefined) place(active, 0, activeY, false);
		gsap.set(active.root, { autoAlpha: activeY === undefined ? 0 : 1 });
		update(false);
	};

	const update = (animate = true) => {
		const activeY = centers[activeIndex];
		const hoverY = hoverIndex === null ? undefined : centers[hoverIndex];
		const visible =
			(pointerInside || focusInside) && hoverY !== undefined && hoverIndex !== activeIndex;
		if (hoverY !== undefined) {
			// Above the current topic the mint line already covers the span, so draw only the curl
			const from =
				activeY !== undefined && hoverY <= activeY ? Math.max(0, hoverY - CORNER) : (activeY ?? 0);
			// Coming out of hiding, jump to the spot instead of sliding from the last one
			const wasHidden = Number(gsap.getProperty(hover.root, 'opacity')) < 0.05;
			place(hover, from, hoverY, animate && !wasHidden);
		}
		gsap.to(hover.root, {
			autoAlpha: visible ? 1 : 0,
			duration: reduce.matches ? 0 : 0.2,
			overwrite: true,
		});
	};

	links.forEach((link, index) => {
		link.addEventListener('pointerenter', () => {
			hoverIndex = index;
			pointerInside = true;
			update();
		});
		link.addEventListener('focus', () => {
			hoverIndex = index;
			focusInside = true;
			update();
		});
		link.addEventListener('blur', () => {
			focusInside = false;
			update();
		});
	});
	list.addEventListener('pointerleave', () => {
		pointerInside = false;
		update();
	});

	new ResizeObserver(measure).observe(list);
	void document.fonts.ready.then(measure);
	measure();
}
