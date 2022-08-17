const ctx = document.getElementById('ctx').getContext('2d');
const parentRect = ctx.canvas.parentElement.getBoundingClientRect();
ctx.canvas.width = parentRect.width;
ctx.canvas.height = parentRect.height;

const CELL_SIZE = 32;
const COLS_COUNT = ~~(ctx.canvas.width / CELL_SIZE);
const ROWS_COUNT = ~~(ctx.canvas.height / CELL_SIZE);
const X_OFFSET = (ctx.canvas.width - COLS_COUNT * CELL_SIZE) / 2;
const Y_OFFSET = (ctx.canvas.height - ROWS_COUNT * CELL_SIZE) / 2;

