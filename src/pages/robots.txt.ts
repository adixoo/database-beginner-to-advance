import type { APIRoute } from 'astro';

// Allow every crawler and point it at the sitemap that @astrojs/sitemap writes at build time
export const GET: APIRoute = ({ site }) => {
	const sitemapUrl = new URL('sitemap-index.xml', site);
	const body = ['User-agent: *', 'Allow: /', '', `Sitemap: ${sitemapUrl.href}`, ''].join('\n');
	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
