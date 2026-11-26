// Advanced mockup: a hand-drawn doodle of a frowning developer at a laptop, surrounded by a
// database with a gear, a query plan, an index tree and a rising chart. Drawn on fast, once,
// at the loosest wobble.
import { createSketch, sketchScene, type Pt } from './sketch';

const {
	strokes,
	random,
	R,
	pen,
	add,
	seg,
	arc,
	ellipse,
	roundPoly,
	rrect,
	arrow,
	gear,
	dot,
	text,
	strand,
	texturedMass,
} = createSketch(20261126, 2.5);

// Colours follow DESIGN.md: sky the database, lilac the query plan, mint the index tree and
// the rising chart (fast is good), butter for annotation (labels and their arrows); the person
// and the furniture stay in ink.

// Desk and chair, furthest back
seg(195, 962, 1300, 959, { w: 1.05 });
add([
	[402, 958],
	[392, 850],
	[396, 770],
	[428, 734],
	[480, 720],
	[536, 716],
]);
add(
	[
		[446, 958],
		[438, 840],
		[452, 780],
	],
	{ w: 0.9 },
);

// Dark t-shirt, hatched like marker
texturedMass(
	[
		[630, 722],
		[682, 745],
		[735, 732],
		[812, 738],
		[880, 760],
		[918, 805],
		[922, 958],
		[470, 958],
		[462, 880],
		[470, 800],
		[510, 752],
		[570, 730],
	],
	{ dir: () => -0.95, count: 150, fine: 60, margin: 10, len: [30, 85], w: [1.1, 2.2] },
);

// Neck, face, ear
seg(652, 686, 648, 724);
seg(712, 697, 716, 733);
add([
	[842, 482],
	[850, 540],
	[848, 598],
	[830, 640],
	[802, 668],
]);
add([
	[556, 540],
	[562, 575],
	[572, 592],
]);
add([
	[592, 640],
	[612, 660],
	[650, 684],
	[700, 696],
	[738, 694],
]);
arc(586, 612, 28, 30, Math.PI * 1.42, Math.PI * 0.58);
arc(590, 612, 11, 13, Math.PI * 1.3, Math.PI * 0.75, { w: 0.8 });

// Hair: combed out from the crown, falling into a spiky fringe
const crown: Pt = [540, 315];
const hairDir = (x: number, y: number) => {
	let a = Math.atan2(y - crown[1], x - crown[0]);
	if (y > 430) {
		const k = Math.min(1, (y - 430) / 70) * 0.65;
		a = a * (1 - k) + (Math.PI / 2 + 0.15) * k;
	}
	return a;
};
const hair: Pt[] = [];
const [hcx, hcy, steps] = [690, 470, 46];
const tuftAt = new Set<number>();
for (let i = 3; i < steps - 2; i += 3 + Math.floor(random() * 3)) tuftAt.add(i);
for (let i = 0; i <= steps; i++) {
	const a = Math.PI * 0.95 + (i / steps) * Math.PI * 1.07;
	const r = 150 + R(4);
	const p: Pt = [hcx + r * Math.cos(a), hcy + r * Math.sin(a)];
	if (tuftAt.has(i)) {
		const fa = hairDir(p[0], p[1]);
		const ta = Math.atan2(Math.sin(a) + Math.sin(fa) * 1.2, Math.cos(a) + Math.cos(fa) * 1.2);
		const L = 14 + random() * 24;
		hair.push([p[0] + Math.cos(ta) * L, p[1] + Math.sin(ta) * L]);
	} else hair.push(p);
}
hair.push(
	[824, 462],
	[806, 488],
	[788, 454],
	[766, 484],
	[746, 452],
	[722, 490],
	[700, 458],
	[678, 497],
	[658, 466],
	[638, 506],
	[618, 478],
	[600, 532],
	[582, 496],
	[566, 546],
	[548, 506],
);
texturedMass(hair, {
	dir: hairDir,
	count: 120,
	fine: 70,
	margin: 14,
	len: [35, 100],
	w: [1.2, 2.7],
});
for (let k = 0; k < 4; k++) {
	const p = hair[5 + Math.floor(random() * (steps - 10))]!;
	const ang = Math.atan2(p[1] - hcy, p[0] - hcx) * 0.5 + hairDir(p[0], p[1]) * 0.5;
	strand(p[0] - Math.cos(ang) * 6, p[1] - Math.sin(ang) * 6, ang, 16 + random() * 18, R(0.9), 1.6);
}

// Glasses
roundPoly(
	[
		[625, 540],
		[718, 534],
		[722, 596],
		[630, 602],
	],
	10,
	{ w: 1.1 },
);
roundPoly(
	[
		[748, 528],
		[830, 520],
		[834, 575],
		[752, 582],
	],
	10,
	{ w: 1.1 },
);
add([
	[720, 552],
	[734, 545],
	[748, 548],
]);
seg(626, 558, 594, 570);

// Frowning face
dot(678, 568, 7, 10);
dot(792, 552, 7, 10);
add(
	[
		[646, 518],
		[676, 522],
		[704, 534],
	],
	{ w: 1.15 },
);
add(
	[
		[768, 518],
		[792, 506],
		[820, 499],
	],
	{ w: 1.15 },
);
add(
	[
		[742, 590],
		[736, 612],
		[748, 616],
	],
	{ w: 0.85 },
);
add(
	[
		[730, 648],
		[750, 638],
		[770, 645],
	],
	{ w: 0.95 },
);

// Forearm propped on the desk, fist under the chin
add(
	[
		[744, 722],
		[728, 800],
		[716, 900],
		[714, 958],
		[812, 958],
		[815, 790],
		[810, 722],
	],
	{ closed: true, sharp: true, paper: true, jit: 1.2 },
);
add(
	[
		[736, 704],
		[742, 676],
		[762, 662],
		[786, 662],
		[806, 672],
		[814, 696],
		[808, 722],
		[792, 742],
		[768, 746],
		[748, 734],
	],
	{ closed: true, paper: true, jit: 1.2 },
);
add(
	[
		[748, 700],
		[772, 706],
		[798, 700],
	],
	{ w: 0.8 },
);
seg(786, 668, 782, 692, { w: 0.8 });

// Laptop
roundPoly(
	[
		[572, 952],
		[745, 955],
		[743, 968],
		[576, 968],
	],
	3,
	{ paper: true },
);
roundPoly(
	[
		[792, 755],
		[1116, 748],
		[1068, 966],
		[742, 970],
	],
	12,
	{ w: 1.05, paper: true },
);
ellipse(942, 872, 20, 20);

// "Thinking hard" marks
seg(858, 388, 880, 358);
seg(874, 415, 914, 398);
seg(880, 445, 926, 448);

// Database with a gear
pen('sky');
{
	const [cx, rx, ry, top, bot] = [242, 122, 36, 192, 385];
	ellipse(cx, top, rx, ry, { w: 1.1 });
	seg(cx - rx, top, cx - rx, bot, { w: 1.1 });
	seg(cx + rx, top, cx + rx, bot, { w: 1.1 });
	arc(cx, 258, rx, ry, 0, Math.PI, { w: 1.1 });
	arc(cx, 322, rx, ry, 0, Math.PI, { w: 1.1 });
	arc(cx, bot, rx, ry, 0, Math.PI, { w: 1.1 });
	gear(380, 322, 66, 50, 8);
}
pen('butter');
text('Indexing', 222, 478, 62);
text('& Optimization', 232, 542, 62);
arrow([
	[262, 582],
	[280, 622],
	[330, 648],
	[398, 642],
]);

// Query plan card, its title in annotation colour
pen('lilac');
rrect(540, 22, 450, 240, 38, { w: 1.1 });
pen('butter');
text('Query Plan', 765, 96, 62);
pen('lilac');
rrect(725, 120, 92, 40, 5);
rrect(628, 196, 92, 40, 5);
rrect(838, 196, 92, 40, 5);
add(
	[
		[760, 160],
		[676, 181],
		[674, 196],
	],
	{ sharp: true, jit: 0.8 },
);
add(
	[
		[782, 160],
		[880, 181],
		[884, 196],
	],
	{ sharp: true, jit: 0.8 },
);

// Index tree
pen('mint');
rrect(1198, 128, 72, 46, 6);
rrect(1100, 232, 66, 46, 6);
rrect(1308, 232, 66, 46, 6);
for (const x of [1062, 1160, 1262, 1385]) rrect(x, 322, 46, 44, 5);
seg(1215, 174, 1140, 232);
seg(1252, 174, 1335, 232);
seg(1120, 278, 1088, 322);
seg(1146, 278, 1180, 322);
seg(1328, 278, 1288, 322);
seg(1355, 278, 1405, 322);
seg(1365, 122, 1375, 148);
seg(1392, 165, 1420, 142);
pen('butter');
text('Indexes', 1245, 430, 62);
arrow([
	[1150, 478],
	[1140, 540],
	[1090, 585],
	[1015, 606],
]);

// Scaling chart, with its rising trend arrow
pen('mint');
seg(1172, 706, 1480, 704, { w: 1.05 });
for (const [x, w, t] of [
	[1188, 40, 662],
	[1258, 44, 636],
	[1332, 44, 603],
	[1405, 46, 562],
] as const)
	add(
		[
			[x, 706],
			[x, t],
			[x + w, t],
			[x + w, 706],
		],
		{ sharp: true, jit: 1 },
	);
arrow([
	[1178, 632],
	[1290, 592],
	[1380, 545],
	[1425, 500],
]);
pen('butter');
text('Scaling &', 1322, 772, 58);
text('Performance', 1340, 830, 58);

export const tuningDoodle = sketchScene(strokes, 1536, 1024);
