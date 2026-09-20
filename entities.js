// --- PLAYER CONTROLLER ---
const player = {
    x: 80, y: 0, w: 56, h: 56, dy: 0, jumped: false, ducking: false,
    get hitbox() {
        const duckOffset = this.ducking ? 18 : 0;
        return {
            headX: this.x + this.w/2, 
            headY: this.y + 14 + duckOffset, 
            headR: 10, 
            bodyX: this.x + 12, 
            bodyY: this.y + 24 + duckOffset, 
            bodyW: this.w - 24, 
            bodyH: this.ducking ? this.h - 42 : this.h - 24
        };
    },
    update() {
        this.dy += 0.85; 
        this.y += this.dy;
        if (this.y + this.h > state.groundY) {
            this.y = state.groundY - this.h;
            this.dy = 0; this.jumped = false;
        }
    },
    draw(themeColors) {
        ctx.save();
        ctx.filter = THEMES[currentTheme].filter;
        
        let dh = this.ducking ? this.h * 0.65 : this.h;
        let dy = this.ducking ? this.y + (this.h * 0.35) : this.y;
        
        const tilt = Math.sin(state.frameCount * 0.2) * 0.05;
        ctx.translate(this.x + this.w/2, dy + dh/2);
        ctx.rotate(this.jumped ? 0 : tilt);
        ctx.drawImage(clawdImg, -this.w/2, -dh/2, this.w, dh);
        ctx.restore();
    }
};

// --- OBSTACLES ---
let obstacles = [];
class Obstacle {
    constructor(type) {
        this.type = type; 
        if (type === 0) {
            this.w = 30 + Math.random()*20; this.h = 40 + Math.random()*25;
            this.y = state.groundY - this.h;
        } else {
            this.w = 45; this.h = 18;
            this.y = state.groundY - 80;
        }
        this.x = canvas.width;
        this.passed = false;
    }
    update() { this.x -= state.speed * (this.type === 1 ? 1.25 : 1); }
    draw(themeColors) {
        ctx.fillStyle = this.type === 0 ? themeColors.obs1 : themeColors.obs2;
        const cx = this.x; const cy = this.y;
        const cw = this.w; const ch = this.h;

        if (currentTheme === 'cyberpunk' || currentTheme === 'scifi') {
            ctx.shadowBlur = 12; ctx.shadowColor = ctx.fillStyle;
        }

        if (this.type === 0) {
            ctx.fillRect(cx + cw/2 - 6, cy, 12, ch);
            ctx.fillRect(cx, cy + 15, 8, ch/2 - 5);
            ctx.fillRect(cx + 8, cy + 15 + ch/2 - 5, cw/2 - 14, 8);
            ctx.fillRect(cx + cw - 8, cy + 25, 8, ch/2 - 10);
            ctx.fillRect(cx + cw/2 + 6, cy + 25 + ch/2 - 10, cw/2 - 14, 8);
        } else {
            const flap = state.frameCount % 30 < 15;
            ctx.fillRect(cx + 10, cy + 6, 18, 6);  
            ctx.fillRect(cx + 28, cy + 2, 10, 6);  
            ctx.fillRect(cx + 38, cy + 4, 7, 4);   
            if (flap) {
                ctx.fillRect(cx + 12, cy - 4, 14, 10); 
            } else {
                ctx.fillRect(cx + 12, cy + 12, 14, 10); 
            }
        }
        ctx.shadowBlur = 0; 
    }
}