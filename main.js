const grid = new Grid(COLS_COUNT, ROWS_COUNT);
const scoreEl = document.getElementById('score');

function render() {
    scoreEl.innerHTML = '' + grid.score;
    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.fillRect(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
    );
    ctx.translate(X_OFFSET, Y_OFFSET);
    ctx.strokeStyle = '#abc';
    ctx.strokeWidth = 1;
    for (let c = 0; c < COLS_COUNT; c++) {
        for (let r = 0; r < ROWS_COUNT; r++) {
            ctx.strokeRect(
                c * CELL_SIZE,
                r * CELL_SIZE,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    }
    grid.render(ctx);
    ctx.restore();
}
function logic(dtt) {
    grid.logic(dtt);
}
ctx.canvas.addEventListener('click', e => {
    const mx = e.offsetX - X_OFFSET;
    const my = e.offsetY - Y_OFFSET;
    const mc = ~~(mx / CELL_SIZE);
    const mr = ~~(my / CELL_SIZE);
    const cell = grid.getCell(mc, mr);
    if (cell) {
        const selected = grid.findSelected(cell);
        //cell.isSelected = !cell.isSelected;
        if (selected.length === 4 && selected.every(p => !p.isFalling)) {
            selected.forEach(selectedCell => {
                selectedCell.isSelected = true; // !selectedCell.isSelected;
            });
        }
    }
})
grid.createPiece();
let lastTick = Date.now();
requestAnimationFrame(function loop(){
    const dt = Date.now() - lastTick;
    const dtt = dt / 1000;
    if (dt > 0) {
        logic(dtt);
        render();
        lastTick = Date.now();
    }
    requestAnimationFrame(loop);
});


