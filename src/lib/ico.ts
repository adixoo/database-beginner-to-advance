// Packs square PNG images into one .ico file (ICO allows PNG-encoded entries)
export interface IcoImage {
	size: number;
	png: Buffer;
}

const HEADER = 6;
const ENTRY = 16;

export function pngsToIco(images: readonly IcoImage[]): Buffer {
	const header = Buffer.alloc(HEADER);
	header.writeUInt16LE(0, 0); // reserved
	header.writeUInt16LE(1, 2); // type: icon
	header.writeUInt16LE(images.length, 4);

	let offset = HEADER + ENTRY * images.length;
	const entries = images.map(({ size, png }) => {
		if (size < 1 || size > 256) throw new RangeError(`ICO sizes are 1–256px, got ${size}`);
		const entry = Buffer.alloc(ENTRY);
		entry.writeUInt8(size === 256 ? 0 : size, 0); // width, 0 means 256
		entry.writeUInt8(size === 256 ? 0 : size, 1); // height
		entry.writeUInt8(0, 2); // palette colours
		entry.writeUInt8(0, 3); // reserved
		entry.writeUInt16LE(1, 4); // colour planes
		entry.writeUInt16LE(32, 6); // bits per pixel
		entry.writeUInt32LE(png.length, 8);
		entry.writeUInt32LE(offset, 12);
		offset += png.length;
		return entry;
	});

	return Buffer.concat([header, ...entries, ...images.map((image) => image.png)]);
}
