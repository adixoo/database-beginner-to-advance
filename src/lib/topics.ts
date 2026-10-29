import { getCollection, type CollectionEntry } from 'astro:content';
import { PATHS, SITE_NAME, type Level } from '../config/site';

export type Topic = CollectionEntry<'topics'>;

export async function getTopics(level?: Level): Promise<Topic[]> {
	const topics = await getCollection('topics', ({ data }) => !level || data.level === level);
	return topics.sort((a, b) => a.data.order - b.data.order);
}

// The file name without its folder: "beginner/what-is-a-database" -> "what-is-a-database"
export function topicSlug(topic: Topic): string {
	return topic.id.split('/').pop() ?? topic.id;
}

export function topicHref(topic: Topic): string {
	return `${PATHS[topic.data.level].href}/${topicSlug(topic)}`;
}

// MDX-only lines: `import …` statements, and component tags on a line of their own:
// self-closing (<RowColumnCell />) or a wrapper's opening/closing tag (<WordsToKnow>, </WordsToKnow>),
// whose Markdown children are kept
const MDX_IMPORT = /^import\s.+$\n?/gm;
const MDX_COMPONENT = /^<\/?[A-Z][\w.]*(\s[^>]*)?\/?>\s*$\n?/gm;

// The topic as plain Markdown (title plus its source without MDX code), for pasting into an AI model
export function topicToMarkdown(topic: Topic): string {
	const body = (topic.body ?? '')
		.replace(MDX_IMPORT, '')
		.replace(MDX_COMPONENT, '')
		.replace(/\n{3,}/g, '\n\n')
		.trim();
	return `# ${topic.data.title}\n\n${body}\n`;
}

// A level's topics as a Markdown list with site-relative links and one-line descriptions
export function topicsToMarkdown(level: Level, topics: Topic[]): string {
	const path = PATHS[level];
	const items = topics.map(
		(topic, index) =>
			`${index + 1}. [${topic.data.title}](${topicHref(topic)}): ${topic.data.description}`,
	);
	return `# ${path.label} topics on ${SITE_NAME}\n\n${path.summary}\n\n${items.join('\n')}\n`;
}
