// Show a corner button once the first screen has been scrolled past
const SHOW_AFTER = 0.6;

// Marks the element `data-visible` (and reachable) once the reader is past the first screen,
// and hides it again near the top. `onScroll` runs on the same updates, for extra work.
export function revealAfterFirstScreen(element: HTMLElement, onScroll?: () => void): void {
	// Scroll events already arrive at most once per frame, so update straight away
	const update = (): void => {
		const visible = scrollY > innerHeight * SHOW_AFTER;
		element.toggleAttribute('data-visible', visible);
		element.inert = !visible;
		onScroll?.();
	};

	addEventListener('scroll', update, { passive: true });
	addEventListener('resize', update);
	update();
}
