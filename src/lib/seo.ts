import { SITE_NAME } from '../config/site';

// The page's path without slashes at either end: "/beginner/keys/" -> "beginner/keys", "/" -> ""
export function pageSlug(pathname: string): string {
	return pathname.replace(/^\/+|\/+$/g, '');
}

// One address per page, without a trailing slash, to match the site's own links
export function canonicalUrl(pathname: string, site: URL): string {
	return new URL(`/${pageSlug(pathname)}`, site).href;
}

const XML_ESCAPES: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&apos;',
};

// A single sitemap file listing every URL (no sitemap index), as served at /sitemap.xml
export function sitemapXml(urls: readonly string[]): string {
	const entries = urls.map(
		(url) => `  <url><loc>${url.replace(/[&<>"']/g, (char) => XML_ESCAPES[char])}</loc></url>`,
	);
	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...entries,
		'</urlset>',
		'',
	].join('\n');
}

// Open Graph's recommended size for a large preview card
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

// The [...slug] param of a page's share image route; the home page has no path, so it gets "index"
export function ogImageSlug(pathname: string): string {
	return pageSlug(pathname) || 'index';
}

// Each page's share image is generated at /og/<page path>.png (src/pages/og/[...slug].png.ts)
export function ogImagePath(pathname: string): string {
	return `/og/${ogImageSlug(pathname)}.png`;
}

export interface Crumb {
	name: string;
	url: string;
}

// schema.org structured data, rendered as <script type="application/ld+json"> by Layout.astro
export type JsonLd = Record<string, unknown>;

export function websiteJsonLd(site: URL, description: string): JsonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: SITE_NAME,
		url: site.href,
		description,
		inLanguage: 'en',
	};
}

export function breadcrumbJsonLd(crumbs: readonly Crumb[]): JsonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: crumbs.map((crumb, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: crumb.name,
			item: crumb.url,
		})),
	};
}

export interface ArticleInfo {
	title: string;
	description: string;
	url: string;
	image: string;
	// "Beginner" or "Advanced"
	level: string;
	site: URL;
}

export function articleJsonLd({
	title,
	description,
	url,
	image,
	level,
	site,
}: ArticleInfo): JsonLd {
	return {
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline: title,
		description,
		url,
		image,
		inLanguage: 'en',
		proficiencyLevel: level,
		isAccessibleForFree: true,
		isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: site.href },
	};
}
