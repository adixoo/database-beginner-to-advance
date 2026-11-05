import type { APIRoute } from 'astro';

// Allow every crawler and point it at the single sitemap (src/pages/sitemap.xml.ts)
export const GET: APIRoute = ({ site }) => {
	const sitemapUrl = new URL('sitemap.xml', site);
	const body = ['User-agent: *', 'Allow: /', '', `Sitemap: ${sitemapUrl.href}`, ''].join('\n');
	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
