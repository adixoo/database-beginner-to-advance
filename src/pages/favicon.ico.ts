import type { APIRoute } from 'astro';
import sharp from 'sharp';
import { brandMarkStroke, brandMarkSvg } from '../lib/brand-mark';
import { pngsToIco } from '../lib/ico';

// Sizes browsers and Windows pick from; each is drawn with the stroke that suits its size
const SIZES = [16, 32, 48];

export const GET: APIRoute = async () => {
	const images = await Promise.all(
		SIZES.map(async (size) => ({
			size,
			// The SVG is 64 units wide; render it straight at the target size (72 dpi = 1 unit per px)
			png: await sharp(Buffer.from(brandMarkSvg(brandMarkStroke(size))), {
				density: (72 * size) / 64,
			})
				.png()
				.toBuffer(),
		})),
	);
	return new Response(new Uint8Array(pngsToIco(images)), {
		headers: { 'Content-Type': 'image/x-icon' },
	});
};
