// The topics drawer (TopicsMenu.astro): a native modal <dialog> whose panel slides in from the
// left over a backdrop, with the topics rising in after it. GSAP runs the motion; the dialog gives
// focus handling and Escape. A tap on the backdrop, the close button or Escape slides it away.
// It opens from the topics bar or from the round button in the bottom-left corner.
import { gsap } from 'gsap';

const EASE = 'expo.out';

export interface TopicsDrawerParts {
	// The topics bar (a link to the level page, so it works without JavaScript) and the corner button
	triggers: HTMLElement[];
	dialog: HTMLDialogElement;
	overlay: HTMLElement;
	panel: HTMLElement;
	close: HTMLButtonElement;
	items: HTMLElement[];
}

export function initTopicsDrawer({
	triggers,
	dialog,
	overlay,
	panel,
	close,
	items,
}: TopicsDrawerParts): void {
	const reduce = matchMedia('(prefers-reduced-motion: reduce)');
	const root = document.documentElement;
	let timeline: gsap.core.Timeline | undefined;
	let closing = false;
	// Whichever trigger opened it gets focus back on close
	let opener: HTMLElement | undefined;
	const setExpanded = (value: boolean) => {
		for (const trigger of triggers) trigger.setAttribute('aria-expanded', String(value));
	};

	const run = (tl: gsap.core.Timeline) => {
		timeline?.kill();
		timeline = tl;
		if (reduce.matches) tl.progress(1);
	};

	const open = (from: HTMLElement) => {
		if (dialog.open) return;
		opener = from;
		closing = false;
		// The page behind stays still while the drawer is open
		root.style.overflow = 'hidden';
		setExpanded(true);
		dialog.showModal();
		// Start with the current topic in view
		panel.querySelector('[aria-current="page"]')?.scrollIntoView({ block: 'center' });
		run(
			gsap
				.timeline({ defaults: { ease: EASE } })
				.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: 'power2.out' }, 0)
				.fromTo(panel, { x: 0, xPercent: -100 }, { xPercent: 0, duration: 0.55 }, 0)
				.fromTo(
					items,
					{ opacity: 0, x: -16 },
					{ opacity: 1, x: 0, duration: 0.4, stagger: 0.018 },
					0.15,
				),
		);
	};

	const shut = () => {
		if (!dialog.open || closing) return;
		closing = true;
		run(
			gsap
				.timeline({
					onComplete: () => {
						dialog.close();
						root.style.overflow = '';
						setExpanded(false);
						closing = false;
						// Back to what opened it (a tap does not always focus a link)
						opener?.focus({ preventScroll: true });
					},
				})
				.to(panel, { xPercent: -100, duration: 0.3, ease: 'power2.in' }, 0)
				.to(overlay, { autoAlpha: 0, duration: 0.3, ease: 'power2.out' }, 0.05),
		);
	};

	for (const trigger of triggers)
		trigger.addEventListener('click', (event) => {
			event.preventDefault();
			open(trigger);
		});
	close.addEventListener('click', shut);
	overlay.addEventListener('click', shut);
	// Escape: slide away instead of the dialog's instant close
	dialog.addEventListener('cancel', (event) => {
		event.preventDefault();
		shut();
	});
}
