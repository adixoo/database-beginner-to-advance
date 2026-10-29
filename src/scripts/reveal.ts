// Adds `is-in` once each element enters the viewport. Never replays and never leaves content hidden.
export function revealOnEnter(targets: NodeListOf<Element>): void {
	if (!targets.length) return;

	if (!('IntersectionObserver' in window)) {
		targets.forEach((el) => el.classList.add('is-in'));
		return;
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				entry.target.classList.add('is-in');
				observer.unobserve(entry.target);
			}
		},
		{ rootMargin: '0px 0px -5% 0px', threshold: 0 },
	);
	targets.forEach((el) => observer.observe(el));

	// Safety net: show anything on screen that the observer has not revealed shortly after load
	window.addEventListener('load', () =>
		setTimeout(() => {
			targets.forEach((el) => {
				const { top, bottom } = el.getBoundingClientRect();
				if (top < innerHeight && bottom > 0) el.classList.add('is-in');
			});
		}, 2500),
	);
}
