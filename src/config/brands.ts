import { siMariadb, siMongodb, siMysql, siPostgresql, siRedis, siSqlite } from 'simple-icons';
import type { SimpleIcon } from 'simple-icons';

// Logos (Simple Icons, CC0) for products named in topics, looked up by name, case-insensitive
const BRAND_ICONS: SimpleIcon[] = [siPostgresql, siMysql, siSqlite, siMariadb, siMongodb, siRedis];

const byName = new Map(BRAND_ICONS.map((icon) => [icon.title.toLowerCase(), icon]));

export function brandIcon(name: string): SimpleIcon | undefined {
	return byName.get(name.trim().toLowerCase());
}
