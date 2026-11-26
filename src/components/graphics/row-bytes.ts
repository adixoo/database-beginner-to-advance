// The row (1, 'Buy milk') as bytes, as RowToBytes and RowHeader draw it with RowBytesStrip: a
// header cell (sky), the id (mint), then the body one byte per letter. Exported so the graphics
// can place labels and brackets over the cells.

export const ROW_BODY = 'Buy milk';
export const CELL_HEIGHT = 44;
export const HEADER_CELL = { x: 10, width: 96 };
export const ID_CELL = { x: 110, width: 44 };
export const CHAR_X = 158;
export const CHAR_WIDTH = 42;
export const CHAR_STEP = 46;
// Right edge of the last letter's cell
export const BODY_END = CHAR_X + ([...ROW_BODY].length - 1) * CHAR_STEP + CHAR_WIDTH;
