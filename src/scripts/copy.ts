const RESET_AFTER_MS = 2000;

interface CopySource {
	text: string;
	// Selected when the clipboard is unavailable, so the text can be copied by hand
	selectable?: Element;
}

// Wires copy buttons. Each needs a sibling `[data-copy-status]` for the screen-reader message.
// - `[data-copy-code]` copies the <pre> in its `[data-code-frame]`
// - `[data-copy-source="id"]` copies the text of the <template id="id">, with site-relative
//   Markdown links made absolute so the text works outside the site (e.g. pasted into an AI chat)
export function initCopyButtons(root: ParentNode = document): void {
	root
		.querySelectorAll<HTMLButtonElement>('[data-copy-code], [data-copy-source]')
		.forEach((button) => {
			if (button.dataset.ready) return;
			button.dataset.ready = 'true';
			button.addEventListener('click', () => void copyFrom(button));
		});
}

function sourceFor(button: HTMLButtonElement): CopySource | undefined {
	const sourceId = button.dataset.copySource;
	if (sourceId) {
		const template = document.getElementById(sourceId);
		if (!(template instanceof HTMLTemplateElement)) return undefined;
		const text = (template.content.textContent ?? '').replaceAll('](/', `](${location.origin}/`);
		return { text };
	}

	const code = button.closest('[data-code-frame]')?.querySelector('pre');
	return code ? { text: code.innerText.replace(/\n$/, ''), selectable: code } : undefined;
}

async function copyFrom(button: HTMLButtonElement): Promise<void> {
	const source = sourceFor(button);
	if (!source) return;
	const status = button.parentElement?.querySelector('[data-copy-status]');
	const label = button.textContent;

	try {
		await navigator.clipboard.writeText(source.text);
		setFeedback(button, status, 'Copied', 'Copied to clipboard');
	} catch (error) {
		// The clipboard needs a secure context and permission
		console.error('Copy failed', error);
		if (source.selectable) {
			window.getSelection()?.selectAllChildren(source.selectable);
			setFeedback(button, status, 'Press Ctrl+C', 'Could not copy. The text is selected.');
		} else {
			setFeedback(button, status, 'Copy failed', 'Could not copy to the clipboard.');
		}
	}

	setTimeout(() => {
		button.textContent = label;
		if (status) status.textContent = '';
	}, RESET_AFTER_MS);
}

function setFeedback(
	button: HTMLButtonElement,
	status: Element | null | undefined,
	label: string,
	announcement: string,
): void {
	button.textContent = label;
	if (status) status.textContent = announcement;
}
