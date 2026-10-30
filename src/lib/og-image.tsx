import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import sharp from 'sharp';
import { SITE_NAME } from '../config/site';
import { THEME_COLORS } from '../config/theme';
import { OG_IMAGE_SIZE } from './seo';

export interface OgCard {
	title: string;
	// Shown after the site name in the top row, e.g. the level of a topic
	label?: string;
	// Host shown in the bottom row, e.g. "database.adibitz.com"
	host: string;
}

// Share previews are shown small (a chat bubble, a feed card), so the title is as large as fits
// on two lines: short titles get bigger type
export function titleFontSize(title: string): number {
	if (title.length <= 12) return 176;
	if (title.length <= 20) return 144;
	return 116;
}

const require = createRequire(import.meta.url);

// satori reads .woff (not .woff2); DM Sans is the site's text face
function loadFont(weight: 400 | 700): Promise<Buffer> {
	return readFile(require.resolve(`@fontsource/dm-sans/files/dm-sans-latin-${weight}-normal.woff`));
}

let fonts: Promise<Buffer[]> | undefined;

function OgImage({ title, label, host }: OgCard) {
	const size = titleFontSize(title);
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				// satori defaults to content-box, which would push the padding past the image edges
				boxSizing: 'border-box',
				width: '100%',
				height: '100%',
				padding: '72px 80px',
				background: THEME_COLORS.canvas,
				color: THEME_COLORS.ink,
				fontFamily: 'DM Sans',
			}}
		>
			<div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 48 }}>
				<div style={{ width: 32, height: 32, borderRadius: 8, background: THEME_COLORS.mint }} />
				<span style={{ fontWeight: 700 }}>{SITE_NAME}</span>
				{label && <span style={{ color: THEME_COLORS.inkMuted }}>· {label}</span>}
			</div>
			<div
				style={{
					display: 'flex',
					fontSize: size,
					fontWeight: 700,
					lineHeight: 1,
					letterSpacing: -0.03 * size,
				}}
			>
				{title}
			</div>
			<div
				style={{
					display: 'flex',
					paddingTop: 28,
					borderTop: `3px solid ${THEME_COLORS.gray700}`,
					color: THEME_COLORS.inkBody,
					fontSize: 40,
				}}
			>
				{host}
			</div>
		</div>
	);
}

// A 1200×630 PNG with the page title in large type on the site's dark canvas
export async function renderOgImage(card: OgCard): Promise<Buffer> {
	fonts ??= Promise.all([loadFont(400), loadFont(700)]);
	const [regular, bold] = await fonts;
	const svg = await satori(<OgImage {...card} />, {
		...OG_IMAGE_SIZE,
		fonts: [
			{ name: 'DM Sans', data: regular, weight: 400, style: 'normal' },
			{ name: 'DM Sans', data: bold, weight: 700, style: 'normal' },
		],
	});
	// satori draws text as paths, so sharp needs no fonts to rasterise it
	return sharp(Buffer.from(svg)).png().toBuffer();
}
