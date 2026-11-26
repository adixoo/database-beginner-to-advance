import { cn } from '@/lib/utils';

// A round button fixed to a bottom corner, hidden until scripts/reveal-after-scroll.ts marks it
// `data-visible` (after the first screen). Shared by BackToTop (right) and the topics drawer
// button (left), so the pair look and appear alike.
export function cornerButtonClass(side: 'left' | 'right', extra?: string): string {
	return cn(
		'fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-40 grid size-12 translate-y-3 cursor-pointer place-items-center rounded-full bg-raised text-ink opacity-0 transition-[opacity,translate,background-color] duration-150 hover:bg-gray-800 data-visible:translate-y-0 data-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none',
		side === 'left'
			? 'left-[max(1.25rem,env(safe-area-inset-left))]'
			: 'right-[max(1.25rem,env(safe-area-inset-right))]',
		extra,
	);
}
