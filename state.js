// DOM Cache
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const finalScoreEl = document.getElementById('final-score');
const menuOverlay = document.getElementById('menu-overlay');
const gameOverOverlay = document.getElementById('game-over-overlay');

// Data & Config
const THEMES = {
    cyberpunk: { bg: '#05070a', ground: '#161b22', line: '#00f2ff', obs1: '#ff0055', obs2: '#00f2ff', filter: 'none' },
    classic: { bg: '#f7f7f7', ground: '#535353', line: '#535353', obs1: '#535353', obs2: '#535353', filter: 'grayscale(100%) contrast(150%)' },
    modern: { bg: '#edf2f7', ground: '#a0aec0', line: '#3182ce', obs1: '#e53e3e', obs2: '#38a169', filter: 'saturate(1.2)' },
    scifi: { bg: '#0b001a', ground: '#1a0033', line: '#00ffff', obs1: '#ff00ff', obs2: '#ffff00', filter: 'hue-rotate(90deg)' }
};

let currentTheme = 'cyberpunk';
let currentLocation = 'classic';
let state = { active: false, paused: true, score: 0, speed: 6, frameCount: 0, groundY: 340, bgOffset: 0 };
const config = { sound: true };

// Audio System
const AudioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playTone(freq, type, duration, vol = 0.05) {
    if (!config.sound || !state.active) return;
    try {
        if (AudioCtx.state === 'suspended') AudioCtx.resume();
        const osc = AudioCtx.createOscillator();
        const gain = AudioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, AudioCtx.currentTime);
        gain.gain.setValueAtTime(vol, AudioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, AudioCtx.currentTime + duration);
        osc.connect(gain); gain.connect(AudioCtx.destination);
        osc.start(); osc.stop(AudioCtx.currentTime + duration);
    } catch(e) {}
}

// Asset Loading
const clawdImg = new Image();
clawdImg.src = 'https://cdn.stickermule.com/artworks/1c69d7fd-a6de-42a8-99be-3edc7b32c8f1/large.png?cacheFor=31a4293c9f5cc540655eb3642dd66c15';

const bgImages = {
    newyork: new Image(),
    shanghai: new Image(),
    dhaka: new Image()
};
bgImages.newyork.crossOrigin = "anonymous";
bgImages.newyork.src = 'https://t3.ftcdn.net/jpg/01/41/49/38/360_F_141493835_XYWsOzzOJbI8UVu5zzX9zwLfSQtNDhIa.jpg';
bgImages.shanghai.crossOrigin = "anonymous";
bgImages.shanghai.src = 'https://t3.ftcdn.net/jpg/00/58/03/24/360_F_58032450_yvjAJ1HLNatvHhw4o7d2g7JMWcFB2tWr.jpg';
bgImages.dhaka.crossOrigin = "anonymous";
bgImages.dhaka.src = 'https://png.pngtree.com/png-vector/20221023/ourmid/pngtree-dhaka-city-skyline-silhouette-background-culture-dhaka-asia-vector-png-image_34379458.png';

let bgBuffer = document.createElement('canvas');
bgBuffer.width = 1600; 
bgBuffer.height = 400;