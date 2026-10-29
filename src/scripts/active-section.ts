// A heading counts as the current section once its top passes this line, in px from the viewport top
const ACTIVE_LINE = 140;

// Marks the link to the section in view with aria-current="true".
export function trackActiveSection(nav: HTMLElement): void {
	const links = [...nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
	const entries = links
		.map((link) => ({
			link,
			heading: document.getElementById(decodeURIComponent(link.hash.slice(1))),
		}))
		.filter(
			(entry): entry is { link: HTMLAnchorElement; heading: HTMLElement } => entry.heading !== null,
		);
	if (!entries.length) return;

	let current: HTMLAnchorElement | undefined;
	let frame = 0;

	const update = (): void => {
		frame = 0;
		const passed = entries.filter(
			({ heading }) => heading.getBoundingClientRect().top <= ACTIVE_LINE,
		);
		// Before the first heading, nothing is current; at the very bottom, the last section is
		const atBottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
		const next = (atBottom ? entries.at(-1) : passed.at(-1))?.link;
		if (next === current) return;
		current?.removeAttribute('aria-current');
		next?.setAttribute('aria-current', 'true');
		current = next;
	};

	const schedule = (): void => {
		if (!frame) frame = requestAnimationFrame(update);
	};

	addEventListener('scroll', schedule, { passive: true });
	addEventListener('resize', schedule);
	update();
}
