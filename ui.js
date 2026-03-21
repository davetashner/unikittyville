// ── Character Creator ──
const PALETTE_64 = [
  // Row 1: Reds & pinks
  '#fecdd3','#fda4af','#fb7185','#f43f5e','#e11d48','#be123c','#881337','#4c0519',
  // Row 2: Oranges & warm
  '#fed7aa','#fdba74','#fb923c','#f97316','#ea580c','#c2410c','#9a3412','#7c2d12',
  // Row 3: Yellows & gold
  '#fef08a','#fde047','#facc15','#eab308','#ca8a04','#a16207','#854d0e','#713f12',
  // Row 4: Greens
  '#bbf7d0','#86efac','#4ade80','#22c55e','#16a34a','#15803d','#166534','#14532d',
  // Row 5: Teals & cyans
  '#a5f3fc','#67e8f9','#22d3ee','#06b6d4','#0891b2','#0e7490','#155e75','#164e63',
  // Row 6: Blues
  '#bfdbfe','#93c5fd','#60a5fa','#3b82f6','#2563eb','#1d4ed8','#1e40af','#1e3a5f',
  // Row 7: Purples & violets
  '#e9d5ff','#d8b4fe','#c084fc','#a855f7','#9333ea','#7e22ce','#6b21a8','#581c87',
  // Row 8: Special (white, grays, black, metallics, neons)
  '#ffffff','#e2e8f0','#94a3b8','#475569','#1e293b','#e879f9','#f0abfc','#a78bfa',
];

// Current selections
let selectedFurColor = '#e879f9'; // default player color
let selectedEyeColor = '#1e1b4b';
let selectedHornColor = '#f472b6'; // middle of the gradient — we derive gradient from this

// Horn gradient from a single picked color
function hornGradientFromColor(color) {
  return [lightenColor(color, 0.4), color, darkenColor(color, 0.3)];
}

function lightenColor(hex, amount) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  const nr = Math.min(255, Math.round(r + (255 - r) * amount));
  const ng = Math.min(255, Math.round(g + (255 - g) * amount));
  const nb = Math.min(255, Math.round(b + (255 - b) * amount));
  return '#' + [nr, ng, nb].map(c => c.toString(16).padStart(2, '0')).join('');
}

function darkenColor(hex, amount) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  const nr = Math.round(r * (1 - amount));
  const ng = Math.round(g * (1 - amount));
  const nb = Math.round(b * (1 - amount));
  return '#' + [nr, ng, nb].map(c => c.toString(16).padStart(2, '0')).join('');
}

function buildPalette(containerId, selectedColor, onSelect) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  for (const color of PALETTE_64) {
    const swatch = document.createElement('div');
    swatch.className = 'swatch' + (color === selectedColor ? ' selected' : '');
    swatch.style.background = color;
    swatch.addEventListener('click', () => {
      container.querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));
      swatch.classList.add('selected');
      onSelect(color);
      updatePreview();
    });
    container.appendChild(swatch);
  }
}

function updatePreview() {
  const canvas = document.getElementById('previewCanvas');
  if (!canvas) return;
  const pCtx = canvas.getContext('2d');
  pCtx.clearRect(0, 0, canvas.width, canvas.height);

  const cx = 60, cy = 80;

  // Body
  pCtx.fillStyle = selectedFurColor;
  pCtx.beginPath();
  pCtx.ellipse(cx, cy - 12, 16, 14, 0, 0, Math.PI * 2);
  pCtx.fill();

  // Head
  pCtx.beginPath();
  pCtx.arc(cx, cy - 30, 14, 0, Math.PI * 2);
  pCtx.fill();

  // Ears
  pCtx.beginPath();
  pCtx.moveTo(cx - 10, cy - 40);
  pCtx.lineTo(cx - 6, cy - 50);
  pCtx.lineTo(cx - 2, cy - 40);
  pCtx.fill();
  pCtx.beginPath();
  pCtx.moveTo(cx + 2, cy - 40);
  pCtx.lineTo(cx + 6, cy - 50);
  pCtx.lineTo(cx + 10, cy - 40);
  pCtx.fill();

  // Inner ears
  pCtx.fillStyle = '#fda4af';
  pCtx.beginPath();
  pCtx.moveTo(cx - 8, cy - 41);
  pCtx.lineTo(cx - 6, cy - 47);
  pCtx.lineTo(cx - 4, cy - 41);
  pCtx.fill();
  pCtx.beginPath();
  pCtx.moveTo(cx + 4, cy - 41);
  pCtx.lineTo(cx + 6, cy - 47);
  pCtx.lineTo(cx + 8, cy - 41);
  pCtx.fill();

  // Eyes
  pCtx.fillStyle = '#fff';
  pCtx.beginPath();
  pCtx.ellipse(cx - 5, cy - 32, 5, 6, 0, 0, Math.PI * 2);
  pCtx.fill();
  pCtx.beginPath();
  pCtx.ellipse(cx + 5, cy - 32, 5, 6, 0, 0, Math.PI * 2);
  pCtx.fill();

  // Pupils
  pCtx.fillStyle = selectedEyeColor;
  pCtx.beginPath();
  pCtx.arc(cx - 4, cy - 31, 2.5, 0, Math.PI * 2);
  pCtx.fill();
  pCtx.beginPath();
  pCtx.arc(cx + 6, cy - 31, 2.5, 0, Math.PI * 2);
  pCtx.fill();

  // Eye shine
  pCtx.fillStyle = '#fff';
  pCtx.beginPath();
  pCtx.arc(cx - 3, cy - 33, 1, 0, Math.PI * 2);
  pCtx.fill();
  pCtx.beginPath();
  pCtx.arc(cx + 7, cy - 33, 1, 0, Math.PI * 2);
  pCtx.fill();

  // Mouth
  pCtx.strokeStyle = '#831843';
  pCtx.lineWidth = 1.2;
  pCtx.beginPath();
  pCtx.arc(cx - 2, cy - 25, 3, 0, Math.PI);
  pCtx.stroke();
  pCtx.beginPath();
  pCtx.arc(cx + 2, cy - 25, 3, 0, Math.PI);
  pCtx.stroke();

  // Horn
  const hc = hornGradientFromColor(selectedHornColor);
  const hornGrad = pCtx.createLinearGradient(cx, cy - 50, cx, cy - 58);
  hornGrad.addColorStop(0, hc[0]);
  hornGrad.addColorStop(0.5, hc[1]);
  hornGrad.addColorStop(1, hc[2]);
  pCtx.fillStyle = hornGrad;
  pCtx.beginPath();
  pCtx.moveTo(cx - 3, cy - 43);
  pCtx.lineTo(cx, cy - 58);
  pCtx.lineTo(cx + 3, cy - 43);
  pCtx.closePath();
  pCtx.fill();

  // Horn spiral
  pCtx.strokeStyle = 'rgba(255,255,255,0.5)';
  pCtx.lineWidth = 0.8;
  for (let i = 0; i < 3; i++) {
    const hy = cy - 45 - i * 4;
    pCtx.beginPath();
    pCtx.moveTo(cx - 2, hy);
    pCtx.lineTo(cx + 2, hy - 2);
    pCtx.stroke();
  }

  // Tail
  pCtx.strokeStyle = selectedFurColor;
  pCtx.lineWidth = 4;
  pCtx.lineCap = 'round';
  pCtx.beginPath();
  pCtx.moveTo(cx - 14, cy - 8);
  pCtx.quadraticCurveTo(cx - 24, cy - 20, cx - 18, cy - 28);
  pCtx.stroke();

  // Legs
  pCtx.fillStyle = selectedFurColor;
  pCtx.fillRect(cx - 10, cy - 2, 6, 6);
  pCtx.fillRect(cx + 4, cy - 2, 6, 6);

  // Whiskers
  pCtx.strokeStyle = 'rgba(0,0,0,0.3)';
  pCtx.lineWidth = 0.8;
  for (let side = -1; side <= 1; side += 2) {
    pCtx.beginPath();
    pCtx.moveTo(cx + side * 8, cy - 28);
    pCtx.lineTo(cx + side * 20, cy - 30);
    pCtx.stroke();
    pCtx.beginPath();
    pCtx.moveTo(cx + side * 8, cy - 26);
    pCtx.lineTo(cx + side * 20, cy - 26);
    pCtx.stroke();
  }
}

function initCharacterCreator() {
  buildPalette('furPalette', selectedFurColor, (c) => { selectedFurColor = c; });
  buildPalette('eyePalette', selectedEyeColor, (c) => { selectedEyeColor = c; });
  buildPalette('hornPalette', selectedHornColor, (c) => { selectedHornColor = c; });
  updatePreview();
}

initCharacterCreator();

function resize() {
  const ASPECT = 16 / 9;
  const MAX_W = 960;
  const MAX_H = 540;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Determine available space — account for safe area insets on mobile
  const isMobile = ('ontouchstart' in window) || vw <= 1024;
  const pad = isMobile ? 0 : 20;

  // On mobile, subtract safe area insets (notch, home indicator) from available space
  const safeTop = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sat') || '0');
  const safeBottom = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sab') || '0');
  const safeLeft = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sal') || '0');
  const safeRight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sar') || '0');

  const availW = vw - pad - safeLeft - safeRight;
  const availH = vh - pad - safeTop - safeBottom;

  // Calculate largest 16:9 rectangle that fits — no max cap on mobile
  let w, h;
  if (availW / availH > ASPECT) {
    h = isMobile ? availH : Math.min(availH, MAX_H);
    w = Math.round(h * ASPECT);
  } else {
    w = isMobile ? availW : Math.min(availW, MAX_W);
    h = Math.round(w / ASPECT);
  }

  canvas.width = w;
  canvas.height = h;

  // Show orientation overlay on mobile portrait
  const overlay = document.getElementById('orientationOverlay');
  if (overlay) {
    const isPortrait = vh > vw;
    const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    overlay.style.display = (isTouchDevice && isPortrait) ? 'flex' : 'none';
  }
}
resize();
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', () => { setTimeout(resize, 100); });

// ── Input ──
window.addEventListener('keydown', e => {
  if (!e.repeat) keys[e.code] = true;
  if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'ArrowDown') e.preventDefault();
});
window.addEventListener('keyup', e => { keys[e.code] = false; });

// ── Touch Controls ──
(function initTouchControls() {
  function bindTouch(id, keyDown, keyUp) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('touchstart', function(e) {
      e.preventDefault();
      el.classList.add('active');
      if (typeof keyDown === 'function') keyDown();
      else keys[keyDown] = true;
    }, { passive: false });
    el.addEventListener('touchend', function(e) {
      e.preventDefault();
      el.classList.remove('active');
      if (typeof keyUp === 'function') keyUp();
      else keys[keyUp] = false;
    }, { passive: false });
    el.addEventListener('touchcancel', function(e) {
      el.classList.remove('active');
      if (typeof keyUp === 'function') keyUp();
      else keys[keyUp] = false;
    }, { passive: false });
  }
  bindTouch('touch-dpad-up', 'ArrowUp', 'ArrowUp');
  bindTouch('touch-dpad-left', 'ArrowLeft', 'ArrowLeft');
  bindTouch('touch-dpad-right', 'ArrowRight', 'ArrowRight');
  bindTouch('touch-dpad-down', 'ArrowDown', 'ArrowDown');
  bindTouch('touch-jump', 'Space', 'Space');
  bindTouch('touch-action',
    function() { if (currentActionKey) keys[currentActionKey] = true; },
    function() { if (currentActionKey) keys[currentActionKey] = false; }
  );
  bindTouch('touch-action2',
    function() { if (currentAction2Key) keys[currentAction2Key] = true; },
    function() { if (currentAction2Key) keys[currentAction2Key] = false; }
  );
})();

// ── Mobile Fullscreen + Orientation Lock ──
if (isMobile) {
  canvas.addEventListener('touchstart', function requestFS() {
    const el = document.documentElement;
    const fs = el.requestFullscreen || el.webkitRequestFullscreen;
    if (fs && !document.fullscreenElement && !document.webkitFullscreenElement) {
      fs.call(el).then(() => {
        document.getElementById('controls').style.display = 'none';
        // Lock to landscape once in fullscreen (required order for most browsers)
        if (screen.orientation && screen.orientation.lock) {
          screen.orientation.lock('landscape').catch(() => {});
        }
        setTimeout(resize, 150);
      }).catch(() => {});
    }
  }, { passive: true });

  document.addEventListener('fullscreenchange', () => setTimeout(resize, 150));
  document.addEventListener('webkitfullscreenchange', () => setTimeout(resize, 150));
}

// ── Level Select ──
const levelColors = ['#86efac','#bae6fd','#fca5a5','#fde68a','#38bdf8','#67e8f9','#ddd6fe','#bbf7d0','#f59e0b','#7dd3fc','#c084fc','#818cf8','#e2e8f0'];

function buildLevelGrid() {
  const grid = document.getElementById('levelGrid');
  grid.innerHTML = '';
  for (let i = 0; i < TOTAL_LEVELS; i++) {
    const btn = document.createElement('button');
    btn.textContent = LEVEL_NAMES[i];
    btn.style.cssText = `padding:14px 8px;border-radius:12px;border:2px solid rgba(255,255,255,0.4);font-weight:700;font-size:0.9rem;cursor:pointer;transition:transform 0.15s;background:${levelColors[i % levelColors.length]};color:#1e1b4b;`;
    btn.addEventListener('click', () => {
      startGameAtLevel(i + 1);
    });
    btn.addEventListener('mouseenter', () => { btn.style.transform = 'scale(1.08)'; });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'scale(1)'; });
    grid.appendChild(btn);
  }
}

document.getElementById('levelSelectBtn').addEventListener('click', () => {
  buildLevelGrid();
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('levelSelectScreen').style.display = 'flex';
});

document.getElementById('levelSelectBack').addEventListener('click', () => {
  document.getElementById('levelSelectScreen').style.display = 'none';
  document.getElementById('startScreen').style.display = 'flex';
});

function startGameAtLevel(lvl) {
  const name = document.getElementById('nameInput').value.trim();
  playerName = name || 'Sparkle';
  document.getElementById('levelSelectScreen').style.display = 'none';
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('hud').style.display = 'flex';
  if (isMobile) {
    document.getElementById('controls').style.display = 'none';
    document.getElementById('touch-controls').style.display = 'block';
    document.body.classList.add('touch-active');
  } else {
    document.getElementById('controls').style.display = 'flex';
  }
  document.getElementById('volumeControl').style.display = 'flex';
  document.getElementById('hudName').textContent = playerName;
  initMeows();
  for (const sfx of [...meowSounds, chaChingSound]) {
    if (sfx) {
      const p = sfx.play();
      if (p) p.then(() => { sfx.pause(); sfx.currentTime = 0; }).catch(() => {});
    }
  }
  // Apply character creator selections
  player.color = selectedFurColor;
  playerEyeColor = selectedEyeColor;
  playerHornColors = hornGradientFromColor(selectedHornColor);
  currentLevel = lvl;
  player.x = 100;
  player.y = GROUND_Y;
  player.vy = 0;
  player.onGround = true;
  startLevelMusic(lvl);
  requestAnimationFrame(loop);
}

// ── Start ──
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('nameInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') startGame();
});

function startGame() {
  const name = document.getElementById('nameInput').value.trim();
  playerName = name || 'Sparkle';
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('hud').style.display = 'flex';
  if (isMobile) {
    document.getElementById('controls').style.display = 'none';
    document.getElementById('touch-controls').style.display = 'block';
    document.body.classList.add('touch-active');
  } else {
    document.getElementById('controls').style.display = 'flex';
  }
  document.getElementById('volumeControl').style.display = 'flex';
  document.getElementById('hudName').textContent = playerName;
  initMeows();
  // Unlock audio on mobile: browsers require a user gesture before playing audio.
  // The Play button click/tap is that gesture. We briefly play/pause SFX elements
  // so subsequent play() calls succeed even outside a direct gesture context.
  // (Music elements are unlocked by startLevelMusic below.)
  for (const sfx of [...meowSounds, chaChingSound]) {
    if (sfx) {
      const p = sfx.play();
      if (p) p.then(() => { sfx.pause(); sfx.currentTime = 0; }).catch(() => {});
    }
  }
  // Apply character creator selections
  player.color = selectedFurColor;
  playerEyeColor = selectedEyeColor;
  playerHornColors = hornGradientFromColor(selectedHornColor);
  // Start music (requires user gesture, which the click/enter provides)
  startLevelMusic(1);
  requestAnimationFrame(loop);
}

function setAction(key, label, key2, label2) {
  currentActionKey = key;
  currentActionLabel = label;
  currentAction2Key = key2 || null;
  currentAction2Label = label2 || '';
  if (isMobile) {
    const btn = document.getElementById('touch-action');
    const btn2 = document.getElementById('touch-action2');
    if (key) {
      btn.textContent = label;
      btn.style.display = 'flex';
    } else {
      btn.style.display = 'none';
    }
    if (key2) {
      btn2.textContent = label2;
      btn2.style.display = 'flex';
    } else {
      btn2.style.display = 'none';
    }
  }
}

function updatePrompt(near) {
  const el = document.getElementById('prompt');
  if (currentScene === Scene.CAMP_CAMPER) {
    if (campCamperSleeping) {
      el.textContent = 'Sleeping... zzz (Press N to wake up)';
      setAction('KeyN', 'Wake');
    } else if (campCamperShowering) {
      const pct = Math.min(100, (campCamperShowerTimer / 3000) * 100);
      el.textContent = `Showering... ${Math.round(pct)}%`;
      setAction(null, '');
    } else if (campCamperPasta.cooking) {
      const pct = Math.min(100, (campCamperPasta.progress / 3000) * 100);
      el.textContent = `Making pasta... ${Math.round(pct)}%`;
      setAction(null, '');
    } else if (campCamperPlayerX < -40) {
      el.textContent = 'Press S to take a shower!';
      setAction('KeyS', 'Shower');
    } else if (Math.abs(campCamperPlayerX) < 30) {
      el.textContent = 'Press C to get pasta from the fridge!';
      setAction('KeyC', 'Pasta');
    } else if (campCamperPlayerX > 80) {
      el.textContent = 'Press N to go to sleep!';
      setAction('KeyN', 'Sleep');
    } else {
      el.textContent = 'Walk around the camper! (Enter to leave)';
      setAction('Enter', 'Exit');
    }
    el.style.display = 'block';
    return;
  }
  if (currentScene === Scene.SWIMMING_IN_POOL) {
    el.textContent = 'Swimming in your pool! Q: Talk to Leprechaun | S: Get out';
    el.style.display = 'block';
    setAction('KeyQ', 'Talk', 'KeyS', 'Exit');
    return;
  }
  if (hammockNapping) {
    el.textContent = 'Napping in the hammock... zzz';
    el.style.display = 'block';
    setAction(null, '');
    return;
  }
  if (bigfootDrinking) {
    el.textContent = 'Sharing chocolate milk with Bigfoot!';
    el.style.display = 'block';
    setAction(null, '');
    return;
  }
  if (currentScene === Scene.CHALET) {
    if (drinkingCocoa) {
      el.textContent = 'Drinking hot chocolate... mmm!';
    } else if (marshmallowScore >= 10 && !marshmallow.active) {
      el.textContent = 'Press D to drink the hot chocolate! (Enter to leave)';
      setAction('KeyD', 'Drink', 'Enter', 'Exit');
    } else {
      el.textContent = marshmallow.active ? 'Tossing...' : 'Up/Down to aim, Space to toss! (Enter to leave)';
      setAction('Enter', 'Exit');
    }
    el.style.display = 'block';
    return;
  }
  if (currentScene === Scene.SURFING) {
    el.textContent = 'Surfing the waves! Press S to get off';
    el.style.display = 'block';
    setAction('KeyS', 'Stop');
    return;
  }
  if (currentScene === Scene.SWIMMING) {
    el.textContent = 'Splashing in the fountain! Press S to get out';
    el.style.display = 'block';
    setAction('KeyS', 'Exit');
    return;
  }
  if (currentScene === Scene.PANTHEON) {
    el.textContent = 'Inside the Pantheon... Press Enter to leave';
    el.style.display = 'block';
    setAction('Enter', 'Exit');
    return;
  }
  if (currentScene === Scene.CAMPER) {
    if (camperNapping) {
      el.textContent = 'Napping... zzz';
    } else if (camperPhone.answered) {
      el.textContent = 'On the phone...';
    } else if (camperPhone.ringing) {
      el.textContent = 'Phone is ringing! Press P to answer!';
      setAction('KeyP', 'Answer');
    } else if (camperCooking.active) {
      if (camperCooking.progress >= 2500 && camperCooking.progress < 4500) {
        el.textContent = 'Fish is ready! Press C to take it off!';
        setAction('KeyC', 'Take');
      } else {
        el.textContent = 'Cooking fish on the stove...';
      }
    } else if (camperPlayerX < -100 && fishCount > 0) {
      el.textContent = 'Press C to cook fish on the stove!';
      setAction('KeyC', 'Cook');
    } else if (camperPlayerX > 80) {
      el.textContent = 'Press N to take a nap!';
      setAction('KeyN', 'Nap');
    } else {
      el.textContent = 'Walk around the camper! (Enter to leave)';
      setAction('Enter', 'Exit');
    }
    el.style.display = 'block';
    return;
  }
  if (currentScene === Scene.WINDMILL) {
    el.textContent = 'Inside the windmill... Press Enter to go outside';
    el.style.display = 'block';
    setAction('Enter', 'Exit');
    return;
  }
  if (currentScene === Scene.PARK) {
    el.textContent = 'Relaxing in Central Park... Press Enter to leave';
    el.style.display = 'block';
    setAction('Enter', 'Exit');
    return;
  }
  if (currentScene === Scene.HOSPITAL) {
    if (hospitalStage === 'prep') {
      el.textContent = 'Prepare the delivery room! Press C (' + hospitalPrepStations + '/3)';
      setAction('KeyC', 'Prepare');
    } else if (hospitalStage === 'vitals') {
      el.textContent = 'Press Space when the heart is in the green zone!';
      setAction('Space', 'Press');
    } else if (hospitalStage === 'breathing') {
      el.textContent = 'Coach breathing! Press Space at the peak (' + hospitalBreathingHits + '/5)';
      setAction('Space', 'Breathe');
    } else if (hospitalStage === 'delivery') {
      el.textContent = 'Hold Space to build power, release in the green zone!';
      setAction('Space', 'Push');
    } else if (hospitalStage === 'celebrate') {
      el.textContent = 'Baby Kit is here!';
      setAction(null, '');
    } else if (hospitalStage === 'color_pick') {
      el.textContent = 'Press 1-8 to choose Kit\'s color, Enter to confirm';
      setAction('Enter', 'Confirm');
    }
    el.style.display = 'block';
    return;
  }
  if (currentScene === Scene.PIZZA) {
    if (pizzaMaking.stage === 'idle') {
      el.textContent = 'Press C to make pizza! (Enter to leave)';
      setAction('KeyC', 'Cook');
    } else if (pizzaMaking.stage === 'dough') {
      el.textContent = 'Kneading dough... Press C when ready!';
      setAction('KeyC', 'Cook');
    } else if (pizzaMaking.stage === 'toppings') {
      el.textContent = 'Adding toppings... Press C to put in oven!';
      setAction('KeyC', 'Cook');
    } else if (pizzaMaking.stage === 'oven') {
      el.style.display = 'none';
      setAction('KeyC', 'Take out');
      return;
    }
    el.style.display = 'block';
  } else if (fishing.active) {
    el.textContent = 'Fishing...';
    el.style.display = 'block';
    setAction(null, '');
  } else if (cooking.active) {
    const pct = Math.min(100, (cooking.progress / 3000) * 100);
    el.textContent = `Cooking... ${Math.round(pct)}%`;
    el.style.display = 'block';
    setAction(null, '');
  } else if (near.inPond && !fishing.active) {
    el.textContent = 'Press F to fish';
    el.style.display = 'block';
    setAction('KeyF', 'Fish');
  } else if (near.nearGrill && !cooking.active) {
    el.textContent = 'Press C to cook bacon';
    el.style.display = 'block';
    setAction('KeyC', 'Cook');
  } else if (near.nearHouse) {
    el.textContent = 'Press Enter to go inside';
    el.style.display = 'block';
    setAction('Enter', 'Enter');
  } else if (near.nearCamper) {
    el.textContent = 'Press Enter to enter the camper';
    el.style.display = 'block';
    setAction('Enter', 'Enter');
  } else if (near.nearWindmill) {
    el.textContent = 'Press Enter to enter the windmill';
    el.style.display = 'block';
    setAction('Enter', 'Enter');
  } else if (near.nearBeehive) {
    el.textContent = 'Press H to collect honey';
    el.style.display = 'block';
    setAction('KeyH', 'Honey');
  } else if (near.nearPizza) {
    el.textContent = 'Press Enter to make pizza!';
    el.style.display = 'block';
    setAction('Enter', 'Pizza');
  } else if (near.nearHospital) {
    el.textContent = 'Press Enter to help at the hospital!';
    el.style.display = 'block';
    setAction('Enter', 'Hospital');
  } else if (near.nearHotdog) {
    el.textContent = score >= 10 ? 'Press C to buy a hot dog (-10 pts)' : 'Not enough points for a hot dog!';
    el.style.display = 'block';
    setAction(score >= 10 ? 'KeyC' : null, 'Buy');
  } else if (near.nearPark) {
    el.textContent = 'Press Enter to visit Central Park';
    el.style.display = 'block';
    setAction('Enter', 'Enter');
  } else if (near.nearTaxi) {
    el.textContent = 'Press Enter to take a taxi to Rome!';
    el.style.display = 'block';
    setAction('Enter', 'Taxi');
  } else if (near.nearFountain) {
    el.textContent = 'Press S to go swimming!';
    el.style.display = 'block';
    setAction('KeyS', 'Swim');
  } else if (near.nearGelato) {
    el.textContent = 'Press G for gelato! (+5 pts)';
    el.style.display = 'block';
    setAction('KeyG', 'Gelato');
  } else if (near.nearPantheonDoor) {
    el.textContent = 'Press Enter to enter the Pantheon';
    el.style.display = 'block';
    setAction('Enter', 'Enter');
  } else if (near.nearFiat) {
    el.textContent = 'Press Enter to take a Fiat to Hawaii!';
    el.style.display = 'block';
    setAction('Enter', 'Fiat');
  } else if (near.nearTiki) {
    el.textContent = 'Press T to light tiki torch! (+15 pts)';
    el.style.display = 'block';
    setAction('KeyT', 'Tiki');
  } else if (near.nearCoconut) {
    el.textContent = 'Press C to collect coconut! (+10 pts)';
    el.style.display = 'block';
    setAction('KeyC', 'Coconut');
  } else if (near.nearSurf) {
    el.textContent = 'Press S to go surfing!';
    el.style.display = 'block';
    setAction('KeyS', 'Surf');
  } else if (near.nearAirport) {
    el.textContent = 'Press Enter to fly to Oriental, NC!';
    el.style.display = 'block';
    setAction('Enter', 'Fly');
  } else if (near.nearChalet) {
    el.textContent = 'Press Enter to warm up in the chalet!';
    el.style.display = 'block';
    setAction('Enter', 'Enter');
  } else if (near.nearTrain) {
    el.textContent = 'Press Enter to take the train to NYC!';
    el.style.display = 'block';
    setAction('Enter', 'Train');
  } else if (roasting.active) {
    const pct = Math.min(100, (roasting.progress / 2000) * 100);
    if (roasting.progress >= 2000 && roasting.progress < 3500) {
      el.textContent = "Marshmallow is golden! Press C to make a s'more!";
      setAction('KeyC', "S'more");
    } else {
      el.textContent = `Roasting marshmallow... ${Math.round(pct)}%`;
      setAction(null, '');
    }
    el.style.display = 'block';
  } else if (campPool.digging) {
    const pct = Math.min(100, (campPool.digProgress / 3000) * 100);
    el.textContent = `Digging pool... ${Math.round(pct)}%`;
    el.style.display = 'block';
    setAction(null, '');
  } else if (campPool.filling) {
    const pct = Math.min(100, (campPool.fillProgress / 2500) * 100);
    el.textContent = `Filling pool... ${Math.round(pct)}%`;
    el.style.display = 'block';
    setAction(null, '');
  } else if (near.nearStick) {
    el.textContent = 'Press C to collect sticks!';
    el.style.display = 'block';
    setAction('KeyC', 'Collect');
  } else if (near.nearFirePit && !campfire.built && stickCount >= 5) {
    el.textContent = 'Press B to build a campfire! (5 sticks)';
    el.style.display = 'block';
    setAction('KeyB', 'Build');
  } else if (near.nearFirePit && !campfire.built && stickCount < 5) {
    el.textContent = `Need ${5 - stickCount} more sticks to build a fire!`;
    el.style.display = 'block';
    setAction(null, '');
  } else if (near.nearFirePit && campfire.lit) {
    el.textContent = 'Press R to roast a marshmallow!';
    el.style.display = 'block';
    setAction('KeyR', 'Roast');
  } else if (near.nearHammock) {
    el.textContent = 'Press N to nap in the hammock!';
    el.style.display = 'block';
    setAction('KeyN', 'Nap');
  } else if (near.nearBigfoot) {
    el.textContent = 'Press M for chocolate milk with Bigfoot!';
    el.style.display = 'block';
    setAction('KeyM', 'Drink');
  } else if (near.nearDigSite && !campPool.dug) {
    el.textContent = 'Press D to dig a pool!';
    el.style.display = 'block';
    setAction('KeyD', 'Dig');
  } else if (near.nearWaterPump && campPool.dug && !campPool.filled) {
    el.textContent = 'Press W to fill the pool with water!';
    el.style.display = 'block';
    setAction('KeyW', 'Fill');
  } else if (near.nearPool && campPool.filled) {
    el.textContent = 'Press S to swim in your pool!';
    el.style.display = 'block';
    setAction('KeyS', 'Swim');
  } else if (near.nearCampCamper) {
    el.textContent = 'Press Enter to enter the camper! J: Safari jeep to Africa!';
    el.style.display = 'block';
    setAction('Enter', 'Enter', 'KeyJ', 'Jeep');
  } else if (currentScene === Scene.WATERING_HOLE) {
    el.textContent = 'Splashing in the watering hole! Press S to get out';
    el.style.display = 'block';
    setAction('KeyS', 'Exit');
  } else if (safariPhotography.active) {
    el.textContent = 'Taking photo... hold steady!';
    el.style.display = 'block';
    setAction(null, '');
  } else if (ridingCheetah) {
    el.textContent = 'Riding the cheetah! G: Dismount | Yarn auto-collects nearby!';
    el.style.display = 'block';
    setAction('KeyG', 'Off');
  } else if (near.nearBaobab) {
    el.textContent = 'Press F to pick baobab fruit!';
    el.style.display = 'block';
    setAction('KeyF', 'Fruit');
  } else if (near.nearCheetah && !ridingCheetah && cheetahYarnGiven < 5 && yarnCount > 0) {
    el.textContent = `Press Y to give yarn to cheetah (${cheetahYarnGiven}/5)`;
    el.style.display = 'block';
    setAction('KeyY', 'Yarn');
  } else if (near.nearCheetah && !ridingCheetah && cheetahYarnGiven >= 5) {
    el.textContent = 'Press G to ride the cheetah!';
    el.style.display = 'block';
    setAction('KeyG', 'Ride');
  } else if (near.nearCheetah && !ridingCheetah && cheetahYarnGiven < 5 && yarnCount === 0) {
    el.textContent = `The cheetah wants yarn! (${cheetahYarnGiven}/5) Find more yarn balls!`;
    el.style.display = 'block';
    setAction(null, '');
  } else if (near.nearWateringHole) {
    el.textContent = 'Press S to swim in the watering hole!';
    el.style.display = 'block';
    setAction('KeyS', 'Swim');
  } else if (near.nearElephant) {
    el.textContent = 'Press E for elephant boost! P: Photo!';
    el.style.display = 'block';
    setAction('KeyE', 'Boost', 'KeyP', 'Photo');
  } else if (near.nearSafariJeep) {
    el.textContent = 'End of the safari! Great adventure!';
    el.style.display = 'block';
    setAction(null, '');
  } else if (near.nearNpc) {
    el.textContent = 'Press Q to talk!';
    el.style.display = 'block';
    setAction('KeyQ', 'Talk');
  } else if (currentLevel === 2 && !near.nearTrain) {
    el.textContent = 'Sled downhill! Dodge snowmen, collect snowballs!';
    el.style.display = 'block';
    setAction(null, '');
  } else if (currentScene === Scene.SCUBA_DIVING) {
    el.textContent = 'Swim with arrow keys! Collect pearls! Q: Talk to mercats | Enter: Surface';
    el.style.display = 'block';
    setAction('Enter', 'Surface', 'KeyQ', 'Talk');
    return;
  } else if (currentScene === Scene.SAILING) {
    el.textContent = 'Sailing the Neuse River! Left/Right to steer | Enter: Dock';
    el.style.display = 'block';
    setAction('Enter', 'Dock');
    return;
  } else if (near.nearSailboat) {
    el.textContent = 'Press Enter to go sailing!';
    el.style.display = 'block';
    setAction('Enter', 'Sail');
  } else if (near.nearDiveSpot) {
    el.textContent = 'Press Enter to go scuba diving!';
    el.style.display = 'block';
    setAction('Enter', 'Dive');
  } else if (currentLevel === 7 && alpsChoosing) {
    el.textContent = 'Choose your ride! Press 1/S for Skis or 2/B for Snowboard';
    el.style.display = 'block';
    setAction('KeyS', 'Skis', 'KeyB', 'Board');
  } else if (currentLevel === 7) {
    el.textContent = 'Ski downhill! Dodge trees, jump cornices, collect diamonds!';
    el.style.display = 'block';
    setAction(null, '');
  } else if (currentLevel === 6 && player.x > ORIENTAL_WORLD_W - 150) {
    el.textContent = 'Press Enter to head to the Alps!';
    el.style.display = 'block';
    setAction('Enter', 'Alps');
  } else if (currentScene === Scene.CAPE_LAUNCH) {
    el.textContent = 'Hold SPACE to power the launch!';
    el.style.display = 'block';
    setAction('Space', 'Launch');
    return;
  } else if (currentLevel === 11 && !capeSpaceSuit && Math.abs(player.x - SPACE_SUIT_POS.x) < BUILDING_RANGE) {
    el.textContent = 'Press S to put on Space Suit!';
    el.style.display = 'block';
    setAction('KeyS', 'Suit');
  } else if (currentLevel === 11 && Math.abs(player.x - ROCKET_POS.x) < BUILDING_RANGE && !capeFueled) {
    el.textContent = 'Hold P to fuel the rocket!';
    el.style.display = 'block';
    setAction('KeyP', 'Fuel');
  } else if (currentLevel === 11 && capeFueled && capeSpaceSuit && Math.abs(player.x - ROCKET_POS.x) < BUILDING_RANGE && !capeLaunching) {
    el.textContent = 'Press Enter to board the rocket!';
    el.style.display = 'block';
    setAction('Enter', 'Board');
  } else if (currentScene === Scene.SMOOTHIE_SHOP) {
    el.textContent = 'C = Fruit | Y = Yogurt | B = Blend | Enter = Exit';
    el.style.display = 'block';
    setAction('KeyC', 'Fruit');
    return;
  } else if (currentScene === Scene.TOPGOLF) {
    el.textContent = 'Up/Down = Aim | Space = Shoot | Enter = Exit';
    el.style.display = 'block';
    setAction('Space', 'Shoot');
    return;
  } else if (currentLevel === 13 && Math.abs(player.x - SMOOTHIE_SHOP_POS.x) < BUILDING_RANGE) {
    el.textContent = 'Press Enter for Smoothie Shop!';
    el.style.display = 'block';
    setAction('Enter', 'Enter');
  } else if (currentLevel === 13 && Math.abs(player.x - TOPGOLF_POS.x) < BUILDING_RANGE) {
    el.textContent = 'Press Enter for TopGolf!';
    el.style.display = 'block';
    setAction('Enter', 'Enter');
  } else if (currentLevel === 13 && player.x > level13Moon.worldW - 300) {
    el.textContent = 'Press Enter to complete your adventure!';
    el.style.display = 'block';
    setAction('Enter', 'Finish');
  } else if (currentLevel === 1 && Math.abs(player.x - BRIDGE_PORTAL.x) < 60) {
    el.textContent = 'Press Enter to go sledding!';
    el.style.display = 'block';
    setAction('Enter', 'Sled');
  } else {
    el.style.display = 'none';
    setAction(null, '');
  }
}
