// Hero mockup: a small SQL editor. CREATE TABLE is typed and run, the empty table appears in the
// results pane; then an INSERT is typed and run, and each row flies from its line in the editor
// into the table. An output log, a row count and two handwritten notes follow along. The same
// users the Beginner mockup later queries.
import {
	FONT_MONO,
	FONT_SANS,
	codeLength,
	drawArrow,
	drawCaret,
	drawWindow,
	handPath,
	progress,
	typeCode,
	washBox,
	writeHand,
	type CodePart,
	type Point,
} from './draw';
import type { Palette, Scene } from './stage';

const W = 600;
const H = 400;

const USERS = [
	['1', 'asha.codes'],
	['2', 'ravi.clicks'],
	['3', 'meera.eats'],
] as const;

const CREATE: CodePart[][] = [
	[
		['CREATE TABLE', 'lilac'],
		[' users (', 'ink'],
	],
	[
		['  id ', 'ink'],
		['INTEGER PRIMARY KEY', 'lilac'],
		[',', 'inkSoft'],
	],
	[
		['  username ', 'ink'],
		['TEXT', 'lilac'],
	],
	[[');', 'inkSoft']],
];
const INSERT: CodePart[][] = [
	[
		['INSERT INTO', 'lilac'],
		[' users ', 'ink'],
		['VALUES', 'lilac'],
	],
	...USERS.map(([id, name], i): CodePart[] => [
		['  (', 'inkSoft'],
		[id, 'peach'],
		[', ', 'inkSoft'],
		[`'${name}'`, 'mint'],
		[i === USERS.length - 1 ? ');' : '),', 'inkSoft'],
	]),
];
// Editor lines: CREATE, a blank line, then INSERT
const INSERT_FIRST_LINE = CREATE.length + 1;

// Timeline (ms)
const CREATE_START = 300;
const CREATE_MS_PER_CHAR = 30;
const RUN_CREATE = 2300;
const TABLE_IN = 2450;
const INSERT_START = 3300;
const INSERT_MS_PER_CHAR = 24;
const RUN_INSERT = 5500;
const FLY_START = 5650;
const FLY_GAP = 380;
const FLY_MS = 520;
const DONE = FLY_START + FLY_GAP * (USERS.length - 1) + FLY_MS;
// Notes wait for the rows, so they point at real data
const NOTE_ID = DONE + 250;
const NOTE_TABLE = DONE + 1150;
// The last note is written: the scene stops here and holds this frame
const END = NOTE_TABLE + 1100;

// Layout
const CODE = { x: 48, y: 78, line: 24, size: 13 };
const PANE = { x: 352, y: 60, w: 228, h: 236 };
const TABLE = { x: PANE.x + 12, y: PANE.y + 40, w: PANE.w - 24, header: 28, row: 32, idW: 56 };
const OUTPUT = { x: 24, y: 322 };

const lineY = (line: number) => CODE.y + line * CODE.line;
const rowTop = (i: number) => TABLE.y + TABLE.header + 4 + i * TABLE.row;

const typedChars = (t: number, start: number, msPerChar: number) =>
	Math.max(0, Math.floor((t - start) / msPerChar));

// The editor line the caret is on while a block is typed
function activeLine(lines: CodePart[][], firstLine: number, chars: number): number {
	let left = chars;
	for (let i = 0; i < lines.length; i++) {
		left -= codeLength(lines[i]!);
		if (left <= 0) return firstLine + i;
	}
	return firstLine + lines.length - 1;
}

// Types `chars` characters of a block of lines; returns where the caret is
function typeBlock(
	ctx: CanvasRenderingContext2D,
	lines: CodePart[][],
	firstLine: number,
	chars: number,
	colors: Palette,
): Point {
	let left = chars;
	let caret = { x: CODE.x, y: lineY(firstLine) };
	lines.forEach((line, i) => {
		if (left > 0)
			caret = typeCode(ctx, line, { x: CODE.x, y: lineY(firstLine + i) }, left, colors, CODE.size);
		left -= codeLength(line);
	});
	return caret;
}

function drawRunButton(ctx: CanvasRenderingContext2D, t: number, colors: Palette) {
	const pressed = [RUN_CREATE, RUN_INSERT].some((at) => t >= at && t < at + 280);
	ctx.fillStyle = pressed ? colors.mint : colors.gray800;
	ctx.beginPath();
	ctx.roundRect(W - 96, 9, 76, 26, 13);
	ctx.fill();
	ctx.fillStyle = pressed ? colors.surface : colors.ink;
	ctx.font = `600 13px ${FONT_SANS}`;
	ctx.textAlign = 'center';
	ctx.fillText('▶  Run', W - 58, 27);
	ctx.textAlign = 'left';
}

// Line numbers for the lines that exist so far, with the caret's line highlighted
function drawGutter(
	ctx: CanvasRenderingContext2D,
	lines: number,
	active: number | null,
	colors: Palette,
) {
	ctx.font = `500 12px ${FONT_MONO}`;
	ctx.textAlign = 'right';
	for (let i = 0; i < lines; i++) {
		if (i === active) {
			ctx.fillStyle = colors.raised;
			ctx.fillRect(12, lineY(i) - 16, PANE.x - 24, 22);
		}
		ctx.fillStyle = i === active ? colors.inkSoft : colors.gray500;
		ctx.fillText(String(i + 1), 34, lineY(i));
	}
	ctx.textAlign = 'left';
}

function drawTable(ctx: CanvasRenderingContext2D, t: number, colors: Palette) {
	const shown = progress(t, TABLE_IN, TABLE_IN + 300);
	if (shown <= 0) return;
	ctx.save();
	ctx.globalAlpha = shown;

	// Results pane with the table's name and its live row count
	ctx.fillStyle = colors.raised;
	ctx.beginPath();
	ctx.roundRect(PANE.x, PANE.y, PANE.w, PANE.h, 12);
	ctx.fill();
	const rows = USERS.filter((_, i) => t >= FLY_START + i * FLY_GAP + FLY_MS).length;
	ctx.fillStyle = colors.ink;
	ctx.font = `700 14px ${FONT_SANS}`;
	ctx.fillText('users', PANE.x + 14, PANE.y + 26);
	ctx.fillStyle = colors.inkMuted;
	ctx.font = `500 13px ${FONT_SANS}`;
	ctx.textAlign = 'right';
	ctx.fillText(`${rows} ${rows === 1 ? 'row' : 'rows'}`, PANE.x + PANE.w - 14, PANE.y + 26);
	ctx.textAlign = 'left';

	// Header: column names, with a PK tag on id
	const { x, y, w, header, idW } = TABLE;
	ctx.fillStyle = colors.gray800;
	ctx.beginPath();
	ctx.roundRect(x, y, w, header, 8);
	ctx.fill();
	ctx.fillStyle = colors.inkSoft;
	ctx.font = `600 12px ${FONT_SANS}`;
	ctx.fillText('id', x + 12, y + 19);
	ctx.fillText('username', x + idW + 6, y + 19);
	ctx.save();
	ctx.globalAlpha *= 0.2;
	ctx.fillStyle = colors.lilac;
	ctx.beginPath();
	ctx.roundRect(x + 28, y + 7, 22, 14, 4);
	ctx.fill();
	ctx.restore();
	ctx.fillStyle = colors.lilac;
	ctx.font = `700 9px ${FONT_SANS}`;
	ctx.fillText('PK', x + 32, y + 17.5);

	// Rows, each with a short mint wash as it lands
	USERS.forEach(([id, name], i) => {
		const landed = FLY_START + i * FLY_GAP + FLY_MS;
		if (t < landed) return;
		const top = rowTop(i);
		washBox(ctx, x, top, w, TABLE.row - 4, colors.mint, 1 - progress(t, landed, landed + 700));
		ctx.fillStyle = colors.ink;
		ctx.font = `500 14px ${FONT_SANS}`;
		ctx.fillText(id, x + 12, top + 19);
		ctx.fillText(name, x + idW + 6, top + 19);
	});
	ctx.restore();
}

// A tuple travels from its INSERT line to its row, on a small arc
function drawFlights(ctx: CanvasRenderingContext2D, t: number, colors: Palette) {
	USERS.forEach(([id, name], i) => {
		const start = FLY_START + i * FLY_GAP;
		if (t < start || t >= start + FLY_MS) return;
		const p = progress(t, start, start + FLY_MS);
		const from = { x: CODE.x + 18, y: lineY(INSERT_FIRST_LINE + 1 + i) - 15 };
		const to = { x: TABLE.x, y: rowTop(i) };
		const x = from.x + (to.x - from.x) * p;
		const y = from.y + (to.y - from.y) * p - Math.sin(Math.PI * p) * 26;
		const label = `${id}  ${name}`;
		ctx.font = `500 12px ${FONT_MONO}`;
		const width = ctx.measureText(label).width + 20;
		ctx.fillStyle = colors.gray800;
		ctx.beginPath();
		ctx.roundRect(x, y, width, 22, 11);
		ctx.fill();
		ctx.strokeStyle = colors.mint;
		ctx.lineWidth = 1.5;
		ctx.stroke();
		ctx.fillStyle = colors.ink;
		ctx.fillText(label, x + 10, y + 15);
	});
}

function drawOutput(ctx: CanvasRenderingContext2D, t: number, colors: Palette) {
	// The log's label arrives with its first message
	const shown = progress(t, TABLE_IN, TABLE_IN + 250);
	if (shown <= 0) return;
	ctx.save();
	ctx.globalAlpha = shown;
	ctx.fillStyle = colors.inkMuted;
	ctx.font = `600 12px ${FONT_SANS}`;
	ctx.fillText('Output', OUTPUT.x, OUTPUT.y);
	ctx.restore();
	const messages: [at: number, text: string][] = [
		[TABLE_IN, 'Table users created'],
		[DONE, `${USERS.length} rows inserted · 0.4 ms`],
	];
	messages.forEach(([at, text], i) => {
		const p = progress(t, at, at + 250);
		if (p <= 0) return;
		ctx.save();
		ctx.globalAlpha *= p;
		const y = OUTPUT.y + 24 + i * 22;
		ctx.fillStyle = colors.mint;
		ctx.font = `700 13px ${FONT_SANS}`;
		ctx.fillText('✓', OUTPUT.x, y);
		ctx.fillStyle = colors.inkSoft;
		ctx.font = `500 13px ${FONT_SANS}`;
		ctx.fillText(text, OUTPUT.x + 18, y);
		ctx.restore();
	});
}

export const tableScene: Scene = {
	width: W,
	height: H,
	duration: END,
	loop: false,
	still: END,
	draw(ctx, t, colors) {
		drawWindow(ctx, W, H, 'shop.db', colors);
		drawRunButton(ctx, t, colors);

		// The line being typed is highlighted in the gutter, under the code
		const createChars = typedChars(t, CREATE_START, CREATE_MS_PER_CHAR);
		const insertChars = typedChars(t, INSERT_START, INSERT_MS_PER_CHAR);
		const typingCreate = t >= CREATE_START && t < RUN_CREATE;
		const typingInsert = t >= INSERT_START && t < RUN_INSERT;
		const active = typingInsert
			? activeLine(INSERT, INSERT_FIRST_LINE, insertChars)
			: typingCreate
				? activeLine(CREATE, 0, createChars)
				: null;
		const lines =
			t < INSERT_START
				? activeLine(CREATE, 0, createChars) + 1
				: activeLine(INSERT, INSERT_FIRST_LINE, insertChars) + 1;
		drawGutter(ctx, lines, active, colors);

		const createCaret = typeBlock(ctx, CREATE, 0, createChars, colors);
		const insertCaret = typeBlock(ctx, INSERT, INSERT_FIRST_LINE, insertChars, colors);
		if (t < RUN_CREATE) drawCaret(ctx, createCaret, t, colors.ink, CODE.size);
		if (typingInsert) drawCaret(ctx, insertCaret, t, colors.ink, CODE.size);

		drawTable(ctx, t, colors);
		drawOutput(ctx, t, colors);
		drawFlights(ctx, t, colors);

		// Handwritten notes: the id column, then the finished table
		drawArrow(
			ctx,
			handPath({ x: 400, y: 330 }, { x: TABLE.x + 20, y: rowTop(2) + 34 }, -14, 17),
			progress(t, NOTE_ID, NOTE_ID + 500),
			colors.butter,
		);
		writeHand(ctx, 'unique ids', { x: 404, y: 344 }, progress(t, NOTE_ID + 400, NOTE_ID + 900), {
			size: 24,
			color: colors.butter,
		});
		drawArrow(
			ctx,
			handPath({ x: 520, y: 352 }, { x: TABLE.x + TABLE.w - 20, y: rowTop(2) + 34 }, 16, 29),
			progress(t, NOTE_TABLE, NOTE_TABLE + 500),
			colors.butter,
		);
		writeHand(
			ctx,
			'your first table!',
			{ x: 420, y: 380 },
			progress(t, NOTE_TABLE + 400, NOTE_TABLE + 1100),
			{
				size: 26,
				color: colors.butter,
			},
		);
	},
};
