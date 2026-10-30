// Adds a short "swipe sideways" note under any scrolling frame (a wide graphic or table) that is
// wider than the screen, so a row cut at the edge reads as scrollable, not clipped. The note is
// removed again when the frame fits, for example after the window is widened.
const HINT_TEXT = 'Swipe sideways to see it all →';

function updateHint(frame: HTMLElement): void {
	const overflows = frame.scrollWidth > frame.clientWidth + 1;
	const hint = frame.nextElementSibling;
	const hasHint = hint instanceof HTMLElement && hint.hasAttribute('data-scroll-hint');

	if (overflows && !hasHint) {
		const note = document.createElement('p');
		note.setAttribute('data-scroll-hint', '');
		note.setAttribute('aria-hidden', 'true');
		note.textContent = HINT_TEXT;
		frame.after(note);
	} else if (!overflows && hasHint) {
		hint.remove();
	}
}

export function showScrollHints(frames: NodeListOf<HTMLElement>): void {
	if (!frames.length) return;
	// Check once now; the observer only reports when the browser draws frames
	frames.forEach(updateHint);
	if (!('ResizeObserver' in window)) return;
	const observer = new ResizeObserver((entries) => {
		for (const entry of entries) updateHint(entry.target as HTMLElement);
	});
	frames.forEach((frame) => observer.observe(frame));
}
