class Grid {
    cells = {};

    constructor(colsCount, rowsCount) {
        this.colsCount = colsCount;
        this.rowsCount = rowsCount;
        this.score = 0;
    }

    forEach(callback) {
        for (let c = 0; c < this.colsCount; c++) {
            for (let r = this.rowsCount - 1; r >= 0; r--) {
                const cell = this.getCell(c, r);
                cell && callback(cell, c, r);
            }
        }
    }

    forEachInColumn(column, callback) {
        for (let r = this.rowsCount - 1; r >= 0; r--) {
            const cell = this.getCell(column, r);
            cell && callback(cell, r);
        }
    }

    logic(dtt) {
        const fallingCells = [];
        this.forEach((cell, c, r) => {
            cell.logic(dtt);
            if (cell.r !== r) {
                this.replaceCell(cell);
                delete this.cells[this.cellHash(c, r)]
            }
            if (r === this.rowsCount - 1) {
                cell.stopFalling();
            } else {
                const nextCell = this.getCell(c, r + 1);
                if (nextCell && !nextCell.isFalling) {
                    cell.stopFalling();
                }
            }
            if (cell.isFalling) {
                fallingCells.push(cell);
            }
            if (cell.r === 0 && !cell.isFalling) {
                this.score = 0;
                this.cells = {};
            }
        });
        let needToUpdateScore = false;
        this.forEach(cell => {
            if (cell.isSelected) {
                this.removeCell(cell);
                this.forEachInColumn(cell.c, cellInColumn => {
                    cellInColumn.isFalling = true;
                });
                needToUpdateScore = true;
            }
        });
        let needToFall = false;
        for (let r = this.rowsCount - 1; r >= 0; r--) {
            let fullLine = true;
            for (let c = 0; c < this.colsCount; c++) {
                const cell = this.getCell(c,r);
                if (!cell || cell.isFalling) {
                    fullLine = false;
                }
            }
            if (fullLine) {
                this.forEachInRow(r, (cell, col, row) => {
                    this.removeCell(cell);
                });
                needToFall = true;
            }
        }
        if (needToFall) {
            this.forEach(cell => cell.isFalling = true);
        }

        if (needToUpdateScore) {
            this.score++;
        }
        if (fallingCells.length === 0) {
            this.createPiece();
        }
    }

    render(ctx) {
        this.forEach((cell, c, r) => {
            cell.render(ctx);
            // ctx.font = `monospace ${cell.size / 2}px`;
            // ctx.fillStyle = '#000';
            // ctx.fillText(
            //     `${c}:${r}`,
            //     cell.x + 2,
            //     r * cell.size + cell.size
            // );

        });
    }

    replaceCell(cell, c, r) {
        c = c || cell.c;
        r = r || cell.r;
        this.cells[this.cellHash(c, r)] = cell;
    }

    createPiece() {
        const natureName = NATURE_NAMES[~~(Math.random() * NATURE_NAMES.length)];
        const natures = NATURES[natureName];
        const natureRotation = ~~(Math.random() * natures.length);
        const natureColor = NATURES_COLOR_MAP[natureName];
        const nature = natures[natureRotation];
        let natureColsCount = 1;

        nature.forEach(row => {
            if (row.length > natureColsCount) {
                natureColsCount = row.length;
            }
        });
        const offsetRow = 0;
        const offsetCol = ~~(Math.random() * (COLS_COUNT - natureColsCount + 1));
        for (let r = 0; r < nature.length; r++) {
            for (let c = 0; c < nature[r].length; c++) {
                if (nature[r][c]) {
                    const cell = new Cell(
                        c + offsetCol,
                        r + offsetRow,
                        natureColor,
                        CELL_SIZE,
                        natureName
                    );
                    cell.isFalling = true;
                    this.replaceCell(cell);
                }
            }
        }
    }

    cellHash(c, r) {
        return `${c}:${r}`;
    }

    getCell(c, r) {
        return this.cells[this.cellHash(c, r)];
    }

    findSelected(cell, result = []) {
        result.push(cell);
        const neighbors = [
            this.getCell(cell.c, cell.r - 1),
            this.getCell(cell.c, cell.r + 1),
            this.getCell(cell.c - 1, cell.r),
            this.getCell(cell.c + 1, cell.r),
        ].filter(n => !!n && n.color === cell.color);
        neighbors.forEach(n => {
            if (!result.some(p => p === n)) {
                this.findSelected(n, result);
            }
        });
        return result;
    }

    removeCell(cell) {
        delete this.cells[this.cellHash(cell.c, cell.r)];
    }

    forEachInRow(r, callback) {
        for (let c = 0; c < this.colsCount; c++) {
            callback(this.getCell(c, r), c, r);
        }
    }
}
