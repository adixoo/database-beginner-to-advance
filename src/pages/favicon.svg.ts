import type { APIRoute } from 'astro';
import { brandMarkSvg } from '../lib/brand-mark';

// The site icon as SVG, for browsers that take it (Layout.astro links it)
export const GET: APIRoute = () =>
	new Response(brandMarkSvg(), { headers: { 'Content-Type': 'image/svg+xml' } });
