// Every canvas scene by the name CanvasScene.astro takes
import { databaseDoodle } from './database-doodle';
import { underlineScene } from './note-scene';
import type { Scene } from './stage';
import { tableScene } from './table-scene';
import { tuningDoodle } from './tuning-doodle';

export const SCENES = {
	table: tableScene,
	'database-doodle': databaseDoodle,
	'tuning-doodle': tuningDoodle,
	underline: underlineScene,
} as const satisfies Record<string, Scene>;

export type SceneName = keyof typeof SCENES;
