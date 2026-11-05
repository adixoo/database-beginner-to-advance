import type { APIRoute } from 'astro';
import { LEVELS, PATHS } from '../config/site';
import { canonicalUrl, sitemapXml } from '../lib/seo';
import { getTopics, topicHref } from '../lib/topics';

// One sitemap for the whole site: the home page, each level page, then that level's topics in
// order. The 404 page and share images are not pages to index, so they are left out.
export const GET: APIRoute = async ({ site }) => {
	const origin = site!;
	const paths = ['/'];
	for (const level of LEVELS) {
		paths.push(PATHS[level].href);
		for (const topic of await getTopics(level)) {
			paths.push(topicHref(topic));
		}
	}
	const body = sitemapXml(paths.map((path) => canonicalUrl(path, origin)));
	return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
