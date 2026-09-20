// --- GAME ENGINE ---
function startGame() {
    currentTheme = document.getElementById('theme-select').value;
    currentLocation = document.getElementById('loc-select').value;
    config.sound = document.getElementById('sound-toggle').checked;
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    renderCityscape(); 
    
    state.score = 0; state.speed = 6.5; state.frameCount = 0;
    state.active = true; state.paused = false; state.bgOffset = 0;
    obstacles = []; player.y = state.groundY - player.h; player.dy = 0; player.ducking = false;
    scoreEl.innerText = '0';
    
    menuOverlay.classList.remove('active');
    gameOverOverlay.classList.remove('active');
    
    if (AudioCtx.state === 'suspended') AudioCtx.resume();
    loop();
}

function loop() {
    if (state.paused || !state.active) return;
    update();
    draw();
    requestAnimationFrame(loop);
}

function update() {
    state.frameCount++;
    player.update();
    
    state.bgOffset -= state.speed * 0.3;
    if (state.bgOffset <= -800) state.bgOffset = 0;

    let spawnRate = Math.max(45, 110 - (state.score * 0.8));
    if (state.frameCount % Math.floor(spawnRate) === 0) {
        obstacles.push(new Obstacle(Math.random() > 0.70 ? 1 : 0));
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        const o = obstacles[i];
        o.update();
        
        const h = player.hitbox;
        let testX = h.headX; let testY = h.headY;
        
        if (h.headX < o.x) testX = o.x; else if (h.headX > o.x + o.w) testX = o.x + o.w;
        if (h.headY < o.y) testY = o.y; else if (h.headY > o.y + o.h) testY = o.y + o.h;
        const distX = h.headX - testX; const distY = h.headY - testY;
        const distance = Math.sqrt((distX*distX) + (distY*distY));
        const hitHead = distance <= h.headR;

        const hitBody = (h.bodyX < o.x + o.w && h.bodyX + h.bodyW > o.x && h.bodyY < o.y + o.h && h.bodyY + h.bodyH > o.y);

        if (hitHead || hitBody) {
            state.active = false;
            finalScoreEl.innerText = state.score;
            gameOverOverlay.classList.add('active');
            playTone(150, 'sawtooth', 0.4, 0.1);
        }

        if (!o.passed && o.x + o.w < player.x) {
            o.passed = true; state.score++; scoreEl.innerText = state.score;
            if (state.score % 10 === 0) { state.speed += 0.4; playTone(800, 'sine', 0.1); }
        }

        if (o.x + o.w < 0) obstacles.splice(i, 1);
    }
}

// Initializing hooks 
Object.values(bgImages).forEach(img => {
    img.onload = () => { if (!state.active) { renderCityscape(); draw(); } };
});

clawdImg.onload = () => {
    renderCityscape(); draw(); 
};