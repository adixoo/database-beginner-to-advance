import type { APIRoute, GetStaticPaths } from 'astro';
import { LEVELS, PATHS, SITE_TAGLINE } from '../../config/site';
import { renderOgImage } from '../../lib/og-image';
import { ogImageSlug } from '../../lib/seo';
import { getTopics, topicHref } from '../../lib/topics';

// A type alias, not an interface, so it fits Astro's index-signature props type
type Props = {
	title: string;
	label?: string;
};

// One share image per page: home, each learning path and each topic (Layout.astro links them)
export const getStaticPaths = (async () => {
	const topics = await getTopics();
	const cards: { path: string; props: Props }[] = [
		{ path: '/', props: { title: SITE_TAGLINE } },
		...LEVELS.map((level) => ({
			path: PATHS[level].href,
			props: { title: PATHS[level].label, label: 'Learning path' },
		})),
		...topics.map((topic) => ({
			path: topicHref(topic),
			props: { title: topic.data.title, label: PATHS[topic.data.level].label },
		})),
	];
	return cards.map(({ path, props }) => ({ params: { slug: ogImageSlug(path) }, props }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<Props> = async ({ props, site }) => {
	const png = await renderOgImage({ ...props, host: site!.host });
	return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
