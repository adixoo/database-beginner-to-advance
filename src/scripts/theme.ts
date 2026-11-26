// Light/dark switch. The first paint is set by the inline script in Layout.astro; this wires the
// toggle button and saves the reader's choice. Keep STORAGE_KEY in step with that script.
const STORAGE_KEY = 'theme';

function applyTheme(dark: boolean): void {
	const root = document.documentElement;
	root.classList.toggle('dark', dark);
	const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
	const color = dark ? meta?.dataset.dark : meta?.dataset.light;
	if (meta && color) meta.content = color;
}

export function initThemeToggle(buttons: Iterable<HTMLButtonElement>): void {
	const list = [...buttons];
	const sync = () => {
		const dark = document.documentElement.classList.contains('dark');
		for (const button of list) button.setAttribute('aria-pressed', String(dark));
	};
	sync();

	for (const button of list) {
		button.addEventListener('click', () => {
			const dark = !document.documentElement.classList.contains('dark');
			applyTheme(dark);
			try {
				localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
			} catch {
				// Storage blocked (private mode): the choice lasts for this page only
			}
			sync();
		});
	}

	// Follow the system while the reader has not chosen
	matchMedia('(prefers-color-scheme: light)').addEventListener('change', (event) => {
		let saved: string | null = null;
		try {
			saved = localStorage.getItem(STORAGE_KEY);
		} catch {
			// Storage blocked: treat as no saved choice
		}
		if (saved) return;
		applyTheme(!event.matches);
		sync();
	});
}
