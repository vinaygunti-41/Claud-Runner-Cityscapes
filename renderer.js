// --- ANIMATION / BACKGROUND RENDERER ---
function renderCityscape() {
    const bctx = bgBuffer.getContext('2d');
    bctx.clearRect(0, 0, bgBuffer.width, bgBuffer.height);
    
    const themeColors = THEMES[currentTheme];
    const gy = state.groundY;

    if (['newyork', 'shanghai', 'dhaka'].includes(currentLocation) && bgImages[currentLocation].complete && bgImages[currentLocation].naturalWidth > 0) {
        const img = bgImages[currentLocation];
        const targetHeight = 350; 
        const targetWidth = (img.naturalWidth / img.naturalHeight) * targetHeight;
        
        bctx.save();
        
        if (currentTheme === 'cyberpunk' || currentTheme === 'scifi') {
            bctx.filter = `invert(1) contrast(2)`;
        } else {
            bctx.filter = `contrast(1.5)`; 
        }
        
        let curX = 0;
        while (curX < 1600) {
            bctx.drawImage(img, curX, gy - targetHeight + 15, targetWidth, targetHeight);
            curX += targetWidth;
        }

        bctx.restore();
        return; 
    }

    const rect = (x, y, w, h) => bctx.fillRect(x, gy - h - y, w, h);
    
    function drawPattern(offsetX) {
        bctx.save();
        bctx.translate(offsetX, 0);

        bctx.fillStyle = themeColors.ground;

        if (currentLocation === 'classic') {
            bctx.globalAlpha = 1.0;
            
            const drawCloud = (cx, cy) => {
                bctx.fillRect(cx + 20, cy, 30, 10);
                bctx.fillRect(cx + 10, cy + 10, 50, 10);
                bctx.fillRect(cx, cy + 20, 70, 10);
                bctx.fillRect(cx + 10, cy + 30, 50, 10);
            };
            
            drawCloud(100, gy - 250);
            drawCloud(450, gy - 280);
            drawCloud(700, gy - 190);

            for(let i = 0; i < 800; i += 15) {
                if(Math.random() > 0.6) bctx.fillRect(i, gy + 5, 4, 3);
                if(Math.random() > 0.8) bctx.fillRect(i + 8, gy + 15, 3, 3);
                if(Math.random() > 0.9) bctx.fillRect(i + 4, gy + 25, 6, 2);
            }
        }
        bctx.restore();
    }
    drawPattern(0);
    drawPattern(800);
}

function draw() {
    const t = THEMES[currentTheme];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = t.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const useImage = ['newyork', 'shanghai', 'dhaka'].includes(currentLocation) && bgImages[currentLocation].complete && bgImages[currentLocation].naturalWidth > 0;

    if (useImage) {
        if (currentTheme === 'cyberpunk' || currentTheme === 'scifi') {
            ctx.globalCompositeOperation = 'screen';
            ctx.drawImage(bgBuffer, state.bgOffset, 0);
            
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = t.line; 
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
            ctx.globalCompositeOperation = 'multiply';
            ctx.globalAlpha = 0.55; 
            ctx.drawImage(bgBuffer, state.bgOffset, 0);
            ctx.globalAlpha = 1.0;
        }
    } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(bgBuffer, state.bgOffset, 0);
    }
    
    ctx.globalCompositeOperation = 'source-over';

    ctx.strokeStyle = t.line; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, state.groundY); ctx.lineTo(canvas.width, state.groundY); ctx.stroke();

    obstacles.forEach(o => o.draw(t));
    player.draw(t);
}