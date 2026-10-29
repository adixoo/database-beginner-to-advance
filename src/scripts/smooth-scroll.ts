import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// Smooth wheel scrolling. Skipped when the visitor asks for reduced motion.
export function startSmoothScroll(): Lenis | undefined {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	return new Lenis({ autoRaf: true, anchors: true });
}
