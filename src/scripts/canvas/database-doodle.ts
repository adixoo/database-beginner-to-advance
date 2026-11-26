// Beginner mockup: a hand-drawn doodle of a puzzled person at a laptop, fist on chin, thinking
// of a database (a cylinder in a speech bubble), with an open book on the desk. Drawn on fast,
// once, at the loosest wobble.
import { createSketch, sketchScene, type Pt } from './sketch';

const { strokes, pen, add, seg, arc, ellipse, roundPoly, dot, text, hairMop } = createSketch(
	20261127,
	2.5,
);

// Colours follow DESIGN.md: peach the question, sky the database, lilac the book, butter for
// annotation (labels and the hand-drawn arrow); the person and the furniture stay in ink.

// Question mark and "huh" marks
pen('peach');
add(
	[
		[262, 165],
		[272, 128],
		[305, 112],
		[338, 128],
		[340, 162],
		[318, 185],
		[305, 202],
		[306, 220],
	],
	{ w: 1.15 },
);
dot(308, 244, 10, 10);
seg(222, 268, 256, 298);
seg(208, 330, 248, 338);

pen('ink');

// Hair: combed out from a crown at the upper back of the head, falling forward into a fringe
hairMop({
	crown: [318, 205],
	fringeY: 415,
	centre: [462, 398],
	radius: 152,
	sweep: 1.1,
	tuft: [16, 26],
	fringe: [
		[625, 442],
		[606, 428],
		[594, 454],
		[574, 426],
		[554, 458],
		[532, 428],
		[510, 464],
		[488, 436],
		[464, 480],
		[440, 452],
		[416, 504],
		[394, 478],
		[366, 510],
		[348, 470],
		[320, 492],
		[302, 450],
	],
	mass: { count: 120, fine: 70, margin: 14, fineMargin: 8, len: [35, 105], w: [1.2, 2.7] },
});

// Face: jaw, ear, eyebrow, eyes, an "o" mouth
add([
	[612, 432],
	[638, 482],
	[645, 535],
	[630, 585],
	[592, 618],
	[540, 630],
	[505, 625],
]);
arc(400, 560, 30, 30, Math.PI * 1.39, Math.PI * 0.61);
arc(402, 560, 12, 14, Math.PI * 1.3, Math.PI * 0.75, { w: 0.8 });
add(
	[
		[578, 470],
		[592, 461],
		[607, 467],
	],
	{ w: 0.9 },
);
dot(535, 494, 8, 12);
dot(592, 499, 8, 12);
ellipse(575, 556, 9, 13, { w: 0.9 });

// Fist on chin
add([
	[422, 668],
	[404, 636],
	[410, 604],
	[430, 590],
	[452, 595],
	[466, 585],
	[486, 592],
	[498, 610],
	[494, 640],
	[482, 664],
]);
seg(450, 600, 455, 622, { w: 0.8 });
seg(472, 598, 476, 616, { w: 0.8 });

// Forearm and elbow on the desk
add([
	[410, 668],
	[384, 740],
	[360, 810],
	[345, 870],
]);
add([
	[482, 666],
	[456, 740],
	[425, 815],
	[402, 882],
]);
add([
	[300, 808],
	[298, 852],
	[316, 884],
	[360, 892],
	[402, 884],
]);

// Shirt: collar, neck, shoulders, sleeve hems, torso
add([
	[496, 662],
	[528, 686],
	[570, 660],
]);
seg(560, 628, 566, 658);
add([
	[470, 668],
	[410, 682],
	[360, 712],
	[318, 766],
	[296, 806],
]);
seg(294, 806, 350, 818);
add([
	[570, 660],
	[640, 676],
	[700, 708],
	[728, 748],
]);
seg(690, 772, 724, 752);
seg(640, 712, 640, 884);

// Thought arrow
pen('butter');
add(
	[
		[678, 490],
		[698, 450],
		[742, 418],
		[802, 404],
	],
	{ w: 1.05 },
);
seg(802, 404, 772, 386);
seg(802, 404, 786, 436);

// Speech bubble, open where the arrow enters
pen('ink');
{
	const [x0, y0, x1, y1, r, b] = [748, 88, 1386, 566, 100, 10];
	const pts: Pt[] = [];
	const corner = (cx: number, cy: number, a0: number, a1: number) => {
		for (let i = 0; i <= 3; i++) {
			const a = a0 + ((a1 - a0) * i) / 3;
			pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
		}
	};
	corner(x0 + r, y1 - r, Math.PI, Math.PI / 2);
	pts.push([(x0 + x1) / 2, y1 + b]);
	corner(x1 - r, y1 - r, Math.PI / 2, 0);
	pts.push([x1 + b, (y0 + y1) / 2]);
	corner(x1 - r, y0 + r, 0, -Math.PI / 2);
	pts.push([(x0 + x1) / 2, y0 - b]);
	corner(x0 + r, y0 + r, -Math.PI / 2, -Math.PI);
	pts.push([x0 - 5, 280], [x0, 362]);
	add(pts, { w: 1.1, jit: 3 });
}

// Database cylinder
pen('sky');
{
	const [cx, rx, ry, top, bot] = [1062, 128, 40, 172, 375];
	ellipse(cx, top, rx, ry, { w: 1.1 });
	seg(cx - rx, top, cx - rx, bot, { w: 1.1 });
	seg(cx + rx, top, cx + rx, bot, { w: 1.1 });
	arc(cx, 245, rx, ry, 0, Math.PI, { w: 1.1 });
	arc(cx, 312, rx, ry, 0, Math.PI, { w: 1.1 });
	arc(cx, bot, rx, ry, 0, Math.PI, { w: 1.1 });
}
pen('butter');
text('Database', 1070, 488, 92);

// Emphasis marks around the cylinder
pen('sky');
seg(826, 212, 868, 238);
seg(822, 265, 860, 276);
seg(1250, 258, 1292, 240);
seg(1255, 300, 1297, 296);

// Laptop
pen('ink');
roundPoly(
	[
		[752, 682],
		[1032, 676],
		[978, 892],
		[684, 896],
	],
	12,
	{ w: 1.05 },
);
ellipse(868, 790, 22, 22);
roundPoly(
	[
		[520, 874],
		[690, 878],
		[688, 890],
		[526, 890],
	],
	4,
);

// Desk
seg(130, 894, 1018, 891, { w: 1.05 });
seg(1326, 889, 1392, 888, { w: 1.05 });

// Open book lying on the desk
pen('lilac');
{
	const [B, C, E]: Pt[] = [
		[1088, 800],
		[1166, 824],
		[1258, 796],
	]; // far edge
	const [A, D, F]: Pt[] = [
		[1022, 880],
		[1142, 912],
		[1316, 862],
	]; // near edge
	add([B!, [1128, 803], C!]); // left page top, dipping into the spine
	seg(B![0], B![1], A![0], A![1]);
	add([A!, [1082, 889], D!]);
	add([C!, [1210, 801], E!]); // right page top
	seg(E![0], E![1], F![0], F![1]);
	add([D!, [1230, 893], F!]);
	add([C!, [1157, 868], D!]); // spine
	// Page block and cover below the near edge
	add([A!, [1021, 893], [1082, 906], [1142, 927], [1232, 906], [1318, 877], F!], { w: 0.95 });
	// Text lines, laid out in each page's perspective
	const bil = (p00: Pt, p10: Pt, p01: Pt, p11: Pt, u: number, v: number): Pt => [
		(p00[0] * (1 - u) + p10[0] * u) * (1 - v) + (p01[0] * (1 - u) + p11[0] * u) * v,
		(p00[1] * (1 - u) + p10[1] * u) * (1 - v) + (p01[1] * (1 - u) + p11[1] * u) * v,
	];
	[0.24, 0.4, 0.56, 0.72].forEach((v, i) => {
		let p = bil(B!, C!, A!, D!, 0.2, v);
		let q = bil(B!, C!, A!, D!, i === 3 ? 0.55 : 0.8, v);
		seg(p[0], p[1], q[0], q[1], { w: 0.6 });
		p = bil(C!, E!, D!, F!, 0.18, v);
		q = bil(C!, E!, D!, F!, i === 2 ? 0.6 : 0.82, v);
		seg(p[0], p[1], q[0], q[1], { w: 0.6 });
	});
}

export const databaseDoodle = sketchScene(strokes, 1536, 1024);
