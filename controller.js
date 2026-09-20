// --- INPUTS & UI CONTROLLER ---
function handleAction(action) {
    if (!state.active && (menuOverlay.classList.contains('active') || gameOverOverlay.classList.contains('active'))) {
        return; 
    }
    if (action === 'jump' && !player.jumped && !player.ducking) {
        player.dy = -15.5; player.jumped = true;
        playTone(400, 'triangle', 0.1);
    }
}

window.addEventListener('keydown', e => {
    if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); handleAction('jump'); }
    if (e.code === 'ArrowDown') { e.preventDefault(); player.ducking = true; }
    if (e.code === 'Escape' && state.active) {
        state.paused = true; menuOverlay.classList.add('active');
    }
});

window.addEventListener('keyup', e => {
    if (e.code === 'ArrowDown') player.ducking = false;
});

canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const relativeY = (touch.clientY - rect.top) / rect.height;
    
    if (relativeY > 0.5) {
        player.ducking = true;
    } else {
        handleAction('jump');
    }
}, {passive: false});

canvas.addEventListener('touchend', e => {
    e.preventDefault();
    player.ducking = false;
}, {passive: false});

// Bind UI Buttons
document.getElementById('btn-start').onclick = startGame;
document.getElementById('btn-restart').onclick = startGame;
document.getElementById('btn-settings').onclick = () => {
    if(state.active) { state.paused = true; menuOverlay.classList.add('active'); }
};