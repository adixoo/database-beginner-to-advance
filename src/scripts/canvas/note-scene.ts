// The headline's hand-drawn underline: one long wobbly stroke, then a shorter one back. Plays once.
import { handPath, progress, strokePartial } from './draw';
import type { Scene } from './stage';

export const underlineScene: Scene = {
	width: 600,
	height: 44,
	duration: 1800,
	loop: false,
	still: 1800,
	draw(ctx, t, colors) {
		ctx.save();
		ctx.strokeStyle = colors.mint;
		ctx.lineWidth = 7;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		strokePartial(ctx, handPath({ x: 8, y: 22 }, { x: 590, y: 14 }, 6, 21), progress(t, 500, 1100));
		ctx.lineWidth = 5;
		strokePartial(
			ctx,
			handPath({ x: 560, y: 24 }, { x: 140, y: 36 }, -4, 9),
			progress(t, 1100, 1600),
		);
		ctx.restore();
	},
};
