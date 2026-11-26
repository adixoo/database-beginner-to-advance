import type Lenis from 'lenis';
import { revealAfterFirstScreen } from './reveal-after-scroll';

// Wires the BackToTop button: fills its ring with the share of the page scrolled, shows it after
// the first screen, and scrolls back up on click (smoothly through Lenis when it is running).
export function initBackToTop(button: HTMLButtonElement | null, lenis?: Lenis): void {
	const ring = button?.querySelector<SVGCircleElement>('[data-back-to-top-ring]');
	if (!button || !ring) return;

	const circumference = Number(ring.getAttribute('stroke-dasharray'));

	revealAfterFirstScreen(button, () => {
		const scrollable = document.documentElement.scrollHeight - innerHeight;
		const progress = scrollable > 0 ? Math.min(scrollY / scrollable, 1) : 0;
		ring.style.strokeDashoffset = String(circumference * (1 - progress));
	});

	button.addEventListener('click', () => {
		if (lenis) {
			lenis.scrollTo(0);
		} else {
			const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
			scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
		}
		// The button hides at the top, so hand keyboard focus to the first link up there
		document.querySelector<HTMLElement>('header a')?.focus({ preventScroll: true });
	});
}
