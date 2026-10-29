// HTML elements in rendered MDX swapped for site components: <Content components={MDX_COMPONENTS} />
import CodePre from '../CodePre.astro';
import MdTable from './MdTable.astro';
import MdTd from './MdTd.astro';
import MdTh from './MdTh.astro';
import MdTr from './MdTr.astro';

export const MDX_COMPONENTS = {
	pre: CodePre,
	table: MdTable,
	tr: MdTr,
	th: MdTh,
	td: MdTd,
};
