class Cell {
    constructor(c, r, color, size) {
        this.c = c;
        this.r = r;
        this.size = size;
        this.x = this.c * this.size;
        this.y = this.r * this.size;
        this.color = color;
        this.isFalling = true;
        this.isSelected = false;
    }
    render(ctx) {
        if (this.color) {
            ctx.fillStyle = this.color;
            ctx.fillRect(
                this.x,
                this.y,
                this.size,
                this.size
            );
            // ctx.font = `monospace ${this.size / 2}px`;
            // ctx.fillStyle = '#fff';
            // ctx.fillText(
            //     `${this.c}:${this.r}`,
            //     this.x + 2,
            //     this.y + this.size / 2);
            if (this.isSelected) {
                ctx.fillStyle = '#fff';
                ctx.fillRect(
                    this.x + 4,
                    this.y + 4,
                    this.size - 8,
                    this.size - 8);

            }
        }
    }
    logic(dtt) {
        const SPEED = 320;
        const dy = dtt * SPEED;
        if (this.isFalling) {
            this.y += dy;
        }
        this.r = ~~(this.y / this.size);
    }
    stopFalling() {
        this.isFalling = false;
        this.y = this.r * this.size;
    }
}
