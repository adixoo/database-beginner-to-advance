// The navbar's menu pill (Navbar.astro), animated with GSAP. Open: the bar widens and the site
// name slides out beside the icon, the panel grows down, then the links rise in one after
// another, over a backdrop that fades in. Close runs the same steps backwards. Escape, or a click
// outside (the backdrop included), closes it; with reduced motion every step is instant. The
// bar slides away while the reader scrolls down and returns when they scroll up.
import { gsap } from 'gsap';

// Expo out: reacts at once, lands softly
const EASE = 'expo.out';

export interface MenuBarParts {
	nav: HTMLElement;
	toggle: HTMLButtonElement;
	label: HTMLElement;
	// Dims the page behind the open menu; clicking it closes the menu
	overlay: HTMLElement;
	// The site name, shown only while the menu is open
	name: HTMLElement;
	panel: HTMLElement;
	items: HTMLElement[];
	// Width in px when open, never wider than the space the bar sits in
	openWidth: number;
}

export function initMenuBar({
	nav,
	toggle,
	label,
	overlay,
	name,
	panel,
	items,
	openWidth,
}: MenuBarParts): void {
	const reduce = matchMedia('(prefers-reduced-motion: reduce)');
	let open = false;
	let closedWidth = 0;
	let timeline: gsap.core.Timeline | undefined;

	const finish = (tl: gsap.core.Timeline) => {
		timeline?.kill();
		timeline = tl;
		if (reduce.matches) tl.progress(1);
	};

	const setOpen = (next: boolean, { focusToggle = false } = {}) => {
		if (next === open) return;
		open = next;
		toggle.setAttribute('aria-expanded', String(open));
		label.textContent = open ? 'Close' : 'Menu';
		panel.inert = !open;

		if (open) {
			// Measure the closed bar before it changes, so closing can return to exactly this
			closedWidth = closedWidth || nav.offsetWidth;
			const room = nav.parentElement?.clientWidth ?? openWidth;
			finish(
				gsap
					.timeline({ defaults: { ease: EASE } })
					// From wherever it is now, so reopening mid-close does not jump
					.to(overlay, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' }, 0)
					.to(nav, { width: Math.min(openWidth, room), duration: 0.5 }, 0)
					.to(name, { width: 'auto', opacity: 1, duration: 0.45 }, 0.05)
					.to(panel, { height: 'auto', duration: 0.5 }, 0.25)
					.fromTo(
						items,
						{ opacity: 0, y: 16 },
						{ opacity: 1, y: 0, duration: 0.35, stagger: 0.06 },
						0.45,
					),
			);
		} else {
			finish(
				gsap
					.timeline({
						defaults: { ease: EASE },
						// Back to its natural width, so it follows its content again
						onComplete: () => {
							gsap.set(nav, { clearProps: 'width' });
							closedWidth = 0;
						},
					})
					.to(items, { opacity: 0, y: 16, duration: 0.15 }, 0)
					.to(panel, { height: 0, duration: 0.5 }, 0.05)
					.to(name, { width: 0, opacity: 0, duration: 0.35 }, 0.2)
					.to(nav, { width: closedWidth, duration: 0.5 }, 0.2)
					.to(overlay, { autoAlpha: 0, duration: 0.35, ease: 'power2.out' }, 0.1),
			);
		}
		if (focusToggle) toggle.focus();
	};

	// Closed state: the name tucked away, the panel collapsed and out of the tab order, its links
	// waiting below
	gsap.set(name, { width: 0, opacity: 0 });
	gsap.set(panel, { height: 0 });
	gsap.set(items, { opacity: 0, y: 16 });
	panel.inert = true;

	// Entrance: the bar rises in once
	if (!reduce.matches) {
		gsap.from(nav, { opacity: 0, y: 24, scale: 0.96, duration: 0.7, ease: EASE });
	}

	toggle.addEventListener('click', () => setOpen(!open));
	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && open) setOpen(false, { focusToggle: true });
	});
	document.addEventListener('click', (event) => {
		if (open && !nav.contains(event.target as Node)) setOpen(false);
	});

	hideOnScrollDown(nav.closest('header') ?? nav, () => open, reduce);
}

// Below this many px from the top, the bar always shows
const SHOW_NEAR_TOP = 120;
// Scroll movements smaller than this are ignored, so a trackpad's jitter cannot flicker the bar
const SCROLL_SLACK = 6;

// Slides the bar up out of view while the reader scrolls down, and back as soon as they scroll
// up. It stays while the menu is open, near the top of the page, and when focus moves into it.
function hideOnScrollDown(bar: HTMLElement, isOpen: () => boolean, reduce: MediaQueryList): void {
	let lastY = scrollY;
	let hidden = false;

	const show = (next: boolean) => {
		if (next === hidden) return;
		hidden = next;
		gsap.to(bar, {
			yPercent: hidden ? -120 : 0,
			duration: reduce.matches ? 0 : hidden ? 0.35 : 0.5,
			ease: hidden ? 'power2.in' : EASE,
			overwrite: true,
		});
	};

	addEventListener(
		'scroll',
		() => {
			const y = scrollY;
			const delta = y - lastY;
			if (Math.abs(delta) < SCROLL_SLACK) return;
			lastY = y;
			show(!isOpen() && y > SHOW_NEAR_TOP && delta > 0);
		},
		{ passive: true },
	);
	bar.addEventListener('focusin', () => show(false));
}
