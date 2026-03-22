// ── Character Creator ──
// Quick-pick row: one representative color per hue family
const PALETTE_QUICK = [
  '#fb7185', '#fb923c', '#facc15', '#4ade80',
  '#22d3ee', '#60a5fa', '#a855f7', '#e879f9',
  '#ffffff', '#94a3b8', '#475569', '#1e293b',
];

// Full palette (shown when expanded)
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

function buildPalette(containerId, fullContainerId, selectedColor, onSelect) {
  const quickContainer = document.getElementById(containerId);
  const fullContainer = document.getElementById(fullContainerId);
  if (!quickContainer) return;

  // Both containers share selection — clicking one deselects in both
  const allContainers = [quickContainer, fullContainer].filter(Boolean);
  function deselectAll() {
    for (const c of allContainers) c.querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));
  }

  function makeSwatch(color) {
    const swatch = document.createElement('div');
    swatch.className = 'swatch' + (color === selectedColor ? ' selected' : '');
    swatch.style.background = color;
    swatch.addEventListener('click', () => {
      deselectAll();
      // Highlight this color in all containers that have it
      for (const c of allContainers) {
        c.querySelectorAll('.swatch').forEach(s => {
          if (s.style.background === swatch.style.background) s.classList.add('selected');
        });
      }
      onSelect(color);
      updatePreview();
    });
    return swatch;
  }

  // Quick-pick row
  quickContainer.innerHTML = '';
  for (const color of PALETTE_QUICK) {
    quickContainer.appendChild(makeSwatch(color));
  }

  // Full palette (hidden by default)
  if (fullContainer) {
    fullContainer.innerHTML = '';
    for (const color of PALETTE_64) {
      fullContainer.appendChild(makeSwatch(color));
    }
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
  buildPalette('furPalette', 'furPaletteFull', selectedFurColor, (c) => { selectedFurColor = c; });
  buildPalette('eyePalette', 'eyePaletteFull', selectedEyeColor, (c) => { selectedEyeColor = c; });
  buildPalette('hornPalette', 'hornPaletteFull', selectedHornColor, (c) => { selectedHornColor = c; });

  // Toggle button
  const toggle = document.getElementById('paletteToggle');
  const fullPalettes = document.getElementById('fullPalettes');
  if (toggle && fullPalettes) {
    toggle.addEventListener('click', () => {
      const expanded = fullPalettes.style.display !== 'none';
      fullPalettes.style.display = expanded ? 'none' : 'flex';
      toggle.textContent = expanded ? 'More colors...' : 'Fewer colors';
    });
  }
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

  // Postcard writer — capture typing when open in write mode
  if (postcardOpen && postcardMode === 'write' && !postcardJustSent && !e.repeat) {
    e.preventDefault();
    if (e.key === 'Escape') {
      postcardOpen = false;
      postcardText = '';
    } else if (e.key === 'Enter' && postcardText.length > 0) {
      // Send postcard
      const theme = POSTCARD_THEMES[currentLevel];
      const levelName = LEVEL_NAMES[currentLevel - 1] || 'Level ' + currentLevel;
      const isNew = !postcardSentLevels.has(currentLevel);
      const postcardEntry = { level: currentLevel, text: postcardText, levelName: levelName };
      if (currentLevel === 8 && bigfootPhotoTaken) postcardEntry.bigfootPhoto = true;
      postcardsSent.push(postcardEntry);
      postcardSentLevels.add(currentLevel);
      savePostcards();
      if (isNew) {
        score += POSTCARD_POINTS;
        addPopup(player.x, player.y - 40, '+' + POSTCARD_POINTS + ' Postcard sent!', '#fbbf24');
        playChaChing();
      } else {
        addPopup(player.x, player.y - 40, 'Postcard sent!', '#86efac');
      }
      postcardJustSent = true;
      postcardSentTimer = 1200;
      postcardText = '';
    } else if (e.key === 'Backspace') {
      postcardText = postcardText.slice(0, -1);
    } else if (e.key === 'Tab') {
      // Switch to gallery mode
      postcardMode = 'gallery';
      postcardGalleryScroll = 0;
    } else if (e.key.length === 1 && postcardText.length < 140 && /[a-zA-Z0-9 !?.,;:'"()\-]/.test(e.key)) {
      postcardText += e.key;
    }
    return;
  }
  // Postcard gallery — navigation
  if (postcardOpen && postcardMode === 'gallery' && !e.repeat) {
    e.preventDefault();
    if (e.key === 'Escape') {
      postcardOpen = false;
    } else if (e.key === 'Tab') {
      postcardMode = 'write';
    } else if (e.key === 'ArrowUp') {
      postcardGalleryScroll = Math.max(0, postcardGalleryScroll - 1);
    } else if (e.key === 'ArrowDown') {
      postcardGalleryScroll = Math.min(Math.max(0, postcardsSent.length - 4), postcardGalleryScroll + 1);
    }
    return;
  }
  // Postcard "just sent" confirmation — any key dismisses
  if (postcardOpen && postcardJustSent && !e.repeat) {
    e.preventDefault();
    postcardJustSent = false;
    postcardSentTimer = 0;
    postcardOpen = false;
    return;
  }

  // Art description typing at the Met Museum
  if (artDescActive && currentScene === Scene.THE_MET && !e.repeat) {
    e.preventDefault();
    keys[e.code] = false; // block game from seeing these keys
    if (e.key === 'Escape') {
      artDescActive = false;
      artDescText = '';
    } else if (e.key === 'Enter' && artDescText.length > 0) {
      // Save the description
      const key = 'painting_' + artDescPaintingIdx;
      if (!artDescriptions[key]) artDescriptions[key] = [];
      artDescriptions[key].push(artDescText);
      saveArtDescriptions();
      score += 20;
      addPopup(player.x, player.y - 40, '+20 Art description!', '#c084fc');
      playChaChing();
      artDescActive = false;
      artDescText = '';
    } else if (e.key === 'Backspace') {
      artDescText = artDescText.slice(0, -1);
    } else if (e.key.length === 1 && artDescText.length < 100 && /[a-zA-Z0-9 !?.,;:'"()\-]/.test(e.key)) {
      artDescText += e.key;
    }
    return;
  }

  // Captain's Mission Log — capture typing when open
  if (missionLogOpen && !e.repeat) {
    e.preventDefault();
    if (e.key === 'Escape') {
      missionLogOpen = false;
    } else if (e.key === 'Enter') {
      // Save current entry and advance
      const text = missionLogTexts[missionLogEntry];
      if (text.length >= MISSION_LOG_MIN_CHARS && !missionLogScored[missionLogEntry]) {
        missionLogScored[missionLogEntry] = true;
        score += MISSION_LOG_ENTRY_POINTS;
        addPopup(player.x, player.y - 40, '+' + MISSION_LOG_ENTRY_POINTS + ' Log entry saved!', '#60a5fa');
        playChaChing();
      }
      saveMissionLog();
      if (missionLogEntry < 4) {
        missionLogEntry++;
      } else {
        // All 5 complete — check for bonus
        const allDone = missionLogScored.every(s => s);
        if (allDone && !missionLogBonusAwarded) {
          missionLogBonusAwarded = true;
          missionLogComplete = true;
          score += MISSION_LOG_BONUS;
          addPopup(player.x, player.y - 60, '+' + MISSION_LOG_BONUS + ' Mission Log Complete!', '#fbbf24');
          playChaChing();
          saveMissionLog();
        }
        missionLogOpen = false;
      }
    } else if (e.key === 'Backspace') {
      missionLogTexts[missionLogEntry] = missionLogTexts[missionLogEntry].slice(0, -1);
    } else if (e.key === 'Tab') {
      e.preventDefault(); // prevent focus change
      // Navigate between entries
      if (e.shiftKey) {
        missionLogEntry = Math.max(0, missionLogEntry - 1);
      } else {
        missionLogEntry = Math.min(4, missionLogEntry + 1);
      }
    } else if (e.key.length === 1 && missionLogTexts[missionLogEntry].length < MISSION_LOG_MAX_CHARS && /[a-zA-Z0-9 !?.,;:'"()\-_]/.test(e.key)) {
      missionLogTexts[missionLogEntry] += e.key;
    }
    return;
  }

  // Baby name typing in hospital name_pick stage
  if (hospitalStage === 'name_pick' && !e.repeat) {
    if (e.key === 'Backspace') {
      kitNameInput = kitNameInput.slice(0, -1);
    } else if (e.key.length === 1 && kitNameInput.length < 12 && /[a-zA-Z ]/.test(e.key)) {
      kitNameInput += e.key;
    }
  }
  // Mission Control typing minigame
  if (currentScene === Scene.MISSION_CONTROL && missionControl.active && !missionControl.complete && !missionControl.failed && !e.repeat) {
    const mc = missionControl;
    const currentCmd = MISSION_COMMANDS[mc.round];
    if (e.key === 'Backspace') {
      e.preventDefault();
      mc.typed = mc.typed.slice(0, -1);
    } else if (e.key.length === 1 && /[a-zA-Z ]/.test(e.key)) {
      e.preventDefault();
      const typedChar = e.key.toUpperCase();
      const expectedChar = currentCmd[mc.typed.length];
      if (typedChar === expectedChar) {
        mc.typed += typedChar;
      } else {
        mc.errors++;
      }
    }
  }
  // Fuel calculator digit input — consume keys to prevent game actions
  if (fuelCalcActive && !e.repeat) {
    keys[e.code] = false; // block game from seeing these keys
    if (fuelCalcFeedbackTimer <= 0) {
      if (/^[0-9]$/.test(e.key) && fuelCalcAnswer.length < 6) {
        fuelCalcAnswer += e.key;
      } else if (e.key === 'Backspace') {
        fuelCalcAnswer = fuelCalcAnswer.slice(0, -1);
      } else if (e.key === 'Enter' && fuelCalcAnswer.length > 0) {
        const correctAnswer = FUEL_CALC_PROBLEMS[fuelCalcProblem].answer;
        if (parseInt(fuelCalcAnswer) === correctAnswer) {
          fuelCalcFeedback = 'correct';
          fuelCalcCorrect++;
          fuelCalcProblem++;
          fuelCalcAnswer = '';
          fuelCalcFeedbackTimer = 1200;
        } else {
          fuelCalcFeedback = 'wrong';
          fuelCalcAnswer = '';
          fuelCalcFeedbackTimer = 1200;
        }
      } else if (e.key === 'Escape') {
        fuelCalcActive = false;
      }
    }
  }
  // Market haggling digit input
  if (currentScene === Scene.MARKET && marketActive && !e.repeat) {
    keys[e.code] = false; // block game from seeing these keys
    if (marketFeedbackTimer <= 0) {
      if (/^[0-9]$/.test(e.key) && marketAnswer.length < 6) {
        marketAnswer += e.key;
      } else if (e.key === 'Backspace') {
        marketAnswer = marketAnswer.slice(0, -1);
      } else if (e.key === 'Enter' && marketAnswer.length > 0) {
        const correctAnswer = MARKET_PROBLEMS[marketProblem].answer;
        if (parseInt(marketAnswer) === correctAnswer) {
          marketFeedback = 'correct';
          marketCorrect++;
          score += POINTS.MARKET_HAGGLE;
          addPopup(player.x, player.y - 40, '+' + POINTS.MARKET_HAGGLE + ' Correct!', '#4ade80');
          playChaChing();
        } else {
          marketFeedback = 'wrong';
        }
        marketProblem++;
        marketAnswer = '';
        marketFeedbackTimer = 1500;
      } else if (e.key === 'Escape') {
        currentScene = null;
        marketActive = false;
      }
    }
  }
  // Telegram typing input
  if (currentScene === Scene.TELEGRAM && telegramActive && !telegramComplete && !e.repeat) {
    if (e.key.length === 1) {
      e.preventDefault();
      const expectedChar = telegramText[telegramTyped.length];
      if (e.key === expectedChar) {
        telegramTyped += e.key;
      } else {
        telegramErrors++;
        telegramErrorFlash = performance.now();
      }
    }
  }
  // Campfire Story Typing
  if (storyTyping.active && !storyTyping.complete && !e.repeat) {
    const story = CAMPFIRE_STORIES[storyTyping.storyIndex];
    if (e.key === 'Escape') {
      e.preventDefault();
      storyTyping.active = false;
    } else if (e.key.length === 1 && storyTyping.typed < story.length) {
      e.preventDefault();
      keys[e.code] = false; // block game from seeing these keys
      const expected = story[storyTyping.typed];
      if (e.key === expected) {
        storyTyping.typed++;
        if (storyTyping.typed >= story.length) {
          // Story complete!
          storyTyping.complete = true;
          storyTyping.completeTimer = 0;
          const elapsed = (performance.now() - storyTyping.startTime) / 1000;
          const wpm = Math.round((story.length / 5) / (elapsed / 60));
          const speedBonus = wpm >= 40 ? POINTS.STORY_SPEED_BONUS : Math.round(POINTS.STORY_SPEED_BONUS * Math.min(1, wpm / 40));
          const totalPts = POINTS.STORY_TYPING + speedBonus;
          score += totalPts;
          addPopup(player.x, player.y - 40, '+' + totalPts + ' Story complete!', '#fbbf24');
          playChaChing();
        }
      } else {
        storyTyping.errors++;
      }
    }
  }
  // Whale Song Transcription typing during transatlantic flight (level 10)
  if (currentLevel === 10 && whaleTranscription.active && !e.repeat) {
    const wt = whaleTranscription;
    const target = WHALE_TRANSMISSIONS[wt.currentIndex].text;
    if (e.key === 'Backspace') {
      e.preventDefault();
      wt.typed = wt.typed.slice(0, -1);
    } else if (e.key.length === 1 && wt.typed.length < target.length) {
      e.preventDefault();
      const expected = target[wt.typed.length];
      if (e.key === expected) {
        wt.typed += e.key;
      } else {
        wt.errors++;
      }
    }
  }
  // Scroll transcription typing in Pantheon
  if (scrollActive && !scrollComplete && !e.repeat) {
    if (e.key.length === 1 && scrollTyped < scrollText.length) {
      e.preventDefault();
      const expected = scrollText[scrollTyped];
      if (e.key === expected) {
        scrollTyped++;
        if (scrollTyped >= scrollText.length) {
          // Scroll complete!
          scrollComplete = true;
          scrollShowFact = true;
          scrollFactTimer = 0;
          const accuracy = Math.max(0, Math.round(((scrollText.length - scrollErrors) / scrollText.length) * 100));
          score += POINTS.SCROLL;
          addPopup(player.x, player.y - 40, '+' + POINTS.SCROLL + ' Scroll ' + (scrollRound + 1) + '/5!', '#fbbf24');
          playChaChing();
        }
      } else {
        scrollErrors++;
        scrollTotalErrors++;
        scrollFlashRed = 300; // flash for 300ms
      }
    }
  }
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

// Tour guide: canvas tap to advance, double-tap to skip (mobile)
let tourGuideTapTime = 0;
canvas.addEventListener('touchstart', function(e) {
  if (!tourGuideActive) return;
  e.preventDefault();
  const now = Date.now();
  if (now - tourGuideTapTime < 350) {
    // Double-tap: skip all
    keys['Enter'] = true;
    setTimeout(() => { keys['Enter'] = false; }, 50);
  } else {
    // Single tap: next fact
    keys['Space'] = true;
    setTimeout(() => { keys['Space'] = false; }, 50);
  }
  tourGuideTapTime = now;
}, { passive: false });

// ── Quiz touch support ──
// Tapping the canvas answer buttons triggers quiz answers (works on mobile and desktop)
canvas.addEventListener('click', function(e) {
  if (!quizActive) return;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const tx = (e.clientX - rect.left) * scaleX;
  const ty = (e.clientY - rect.top) * scaleY;
  const W = canvas.width, H = canvas.height;
  // Match button layout from drawQuizOverlay
  const boxW = Math.min(W * 0.85, 420);
  const bx = (W - boxW) / 2;
  const boxH = 180;
  const by = (H - boxH) / 2 - 20;
  // answerY uses 2 lines as estimate (question text wrap); buttons start ~76px from box top
  const answerY = by + 76;
  const btnH = 26;
  const btnW = boxW - 40;
  for (let i = 0; i < 3; i++) {
    const btnY = answerY + i * (btnH + 4);
    if (tx > bx + 20 && tx < bx + 20 + btnW && ty > btnY && ty < btnY + btnH) {
      keys['Digit' + (i + 1)] = true;
      setTimeout(() => { keys['Digit' + (i + 1)] = false; }, 100);
      break;
    }
  }
});

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

// ── Learning Dashboard ──
document.getElementById('learningDashboardBtn').addEventListener('click', () => {
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('learningDashboard').style.display = 'flex';
  buildLearningDashboard();
});

document.getElementById('dashboardBack').addEventListener('click', () => {
  document.getElementById('learningDashboard').style.display = 'none';
  document.getElementById('startScreen').style.display = 'flex';
});

function buildLearningDashboard() {
  const container = document.getElementById('dashboardContent');
  container.innerHTML = '';

  // Helper: read JSON from localStorage safely
  function loadJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch (e) { return fallback; }
  }

  // Helper: create a styled card section
  function makeCard(title, icon, content) {
    const card = document.createElement('div');
    card.style.cssText = 'background:rgba(255,255,255,0.12);backdrop-filter:blur(8px);border-radius:16px;padding:16px 20px;border:1px solid rgba(255,255,255,0.15);';
    card.innerHTML = '<div style="font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:10px;">' + icon + ' ' + title + '</div>' + content;
    return card;
  }

  // Helper: create a bar chart row
  function makeBar(label, value, max, color) {
    const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
    return '<div style="margin-bottom:8px;">' +
      '<div style="display:flex;justify-content:space-between;color:rgba(255,255,255,0.9);font-size:0.85rem;margin-bottom:3px;">' +
        '<span>' + label + '</span><span>' + value + '/' + max + '</span>' +
      '</div>' +
      '<div style="background:rgba(255,255,255,0.15);border-radius:8px;height:14px;overflow:hidden;">' +
        '<div style="width:' + pct + '%;height:100%;background:' + color + ';border-radius:8px;transition:width 0.5s;min-width:' + (pct > 0 ? '4px' : '0') + ';"></div>' +
      '</div>' +
    '</div>';
  }

  // ── 1. Subjects Progress (fact categories) ──
  const facts = loadJSON('factNotebook', []);
  const categories = { Geography: 0, History: 0, Science: 0, Culture: 0, Language: 0 };
  for (const f of facts) {
    if (f.category && categories.hasOwnProperty(f.category)) {
      categories[f.category]++;
    }
  }
  // Estimate max per category (roughly 20 facts per category is a good target)
  const catMax = 20;
  const catColors = { Geography: '#38bdf8', History: '#f59e0b', Science: '#22c55e', Culture: '#f472b6', Language: '#a78bfa' };
  const catIcons = { Geography: '\uD83C\uDF0D', History: '\uD83C\uDFDB\uFE0F', Science: '\uD83D\uDD2C', Culture: '\uD83C\uDFAD', Language: '\uD83D\uDCAC' };
  let subjectBars = '';
  for (const [cat, count] of Object.entries(categories)) {
    subjectBars += makeBar(catIcons[cat] + ' ' + cat, count, catMax, catColors[cat]);
  }
  container.appendChild(makeCard('Subjects Progress', '\uD83D\uDCDA', subjectBars));

  // ── 2. Facts Discovered ──
  const totalFacts = facts.length;
  const factsHTML = '<div style="display:flex;align-items:center;gap:12px;">' +
    '<div style="font-size:2.5rem;color:#fde68a;">' + totalFacts + '</div>' +
    '<div style="color:rgba(255,255,255,0.8);font-size:0.9rem;">facts discovered across all levels</div>' +
  '</div>';
  container.appendChild(makeCard('Facts Discovered', '\uD83D\uDCD6', factsHTML));

  // ── 3. Achievements Earned ──
  const savedAch = loadJSON('unikittyville_achievements', {});
  const earnedCount = Object.keys(savedAch).length;
  const totalAch = 8; // matches achievements array length
  const achHTML = '<div style="display:flex;align-items:center;gap:12px;">' +
    '<div style="font-size:2.5rem;color:#fbbf24;">' + earnedCount + '/' + totalAch + '</div>' +
    '<div style="color:rgba(255,255,255,0.8);font-size:0.9rem;">achievements earned</div>' +
  '</div>' + makeBar('Progress', earnedCount, totalAch, '#fbbf24');
  container.appendChild(makeCard('Achievements Earned', '\uD83C\uDFC6', achHTML));

  // ── 4. Levels Visited ──
  const savedLevels = loadJSON('unikittyville_levels_visited', []);
  const visitedCount = new Set(savedLevels).size;
  const totalLvl = typeof TOTAL_LEVELS !== 'undefined' ? TOTAL_LEVELS : 13;
  let levelDots = '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;">';
  for (let i = 1; i <= totalLvl; i++) {
    const visited = savedLevels.includes(i);
    const name = (typeof levelRegistry !== 'undefined' && levelRegistry[i]) ? levelRegistry[i].name : ('Level ' + i);
    const bg = visited ? 'rgba(74,222,128,0.8)' : 'rgba(255,255,255,0.15)';
    const check = visited ? '\u2713' : '';
    levelDots += '<div title="' + name + '" style="width:36px;height:36px;border-radius:8px;background:' + bg + ';display:flex;align-items:center;justify-content:center;font-size:0.7rem;color:#fff;font-weight:700;flex-direction:column;line-height:1.1;">' +
      '<span>' + i + '</span>' + (check ? '<span style="font-size:0.6rem;">' + check + '</span>' : '') +
    '</div>';
  }
  levelDots += '</div>';
  const levelsHTML = '<div style="display:flex;align-items:center;gap:12px;margin-bottom:6px;">' +
    '<div style="font-size:2.5rem;color:#4ade80;">' + visitedCount + '/' + totalLvl + '</div>' +
    '<div style="color:rgba(255,255,255,0.8);font-size:0.9rem;">levels explored</div>' +
  '</div>' + levelDots;
  container.appendChild(makeCard('Levels Visited', '\uD83D\uDDFA\uFE0F', levelsHTML));

  // ── 5. Postcards Sent (bonus stat) ──
  const postcards = loadJSON('unikittyville_postcards', []);
  if (postcards.length > 0) {
    const pcHTML = '<div style="display:flex;align-items:center;gap:12px;">' +
      '<div style="font-size:2.5rem;color:#fb923c;">' + postcards.length + '</div>' +
      '<div style="color:rgba(255,255,255,0.8);font-size:0.9rem;">postcards sent home</div>' +
    '</div>';
    container.appendChild(makeCard('Postcards Sent', '\uD83D\uDCEE', pcHTML));
  }
}

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
  loadAchievements();
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
  // Activate tour guide for starting level
  if (!tourGuideSeen.has(lvl)) {
    tourGuideActive = true;
    tourGuideStep = 0;
    tourGuideSeen.add(lvl);
  }
  startLevelMusic(lvl);
  loadPostcards();
  loadMissionLog();
  requestAnimationFrame(loop);
}

// ── Difficulty Selector ──
const DIFF_COLORS = { easy: '#22c55e', medium: '#3b82f6', hard: '#9333ea' };
const DIFF_LABELS = { easy: 'E', medium: 'M', hard: 'H' };

function updateDifficultyUI() {
  const btns = document.querySelectorAll('.diff-btn');
  btns.forEach(btn => {
    const d = btn.getAttribute('data-diff');
    if (d === gameDifficulty) {
      btn.style.borderColor = '#fff';
      btn.style.boxShadow = '0 0 12px rgba(255,255,255,0.4)';
    } else {
      btn.style.borderColor = 'transparent';
      btn.style.boxShadow = 'none';
    }
  });
  const badge = document.getElementById('hudDifficulty');
  if (badge) {
    badge.textContent = DIFF_LABELS[gameDifficulty] || 'M';
    badge.style.background = DIFF_COLORS[gameDifficulty] || DIFF_COLORS.medium;
  }
}

document.querySelectorAll('.diff-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    setGameDifficulty(btn.getAttribute('data-diff'));
    updateDifficultyUI();
  });
});

// Restore persisted difficulty on load
updateDifficultyUI();

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
  loadAchievements();
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
  // Activate tour guide for level 1
  if (!tourGuideSeen.has(1)) {
    tourGuideActive = true;
    tourGuideStep = 0;
    tourGuideSeen.add(1);
  }
  // Start music (requires user gesture, which the click/enter provides)
  startLevelMusic(1);
  loadPostcards();
  loadMissionLog();
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
  // Hide prompt during hot dog math overlay (UI is drawn on canvas)
  if (hotdogMath.active) {
    el.style.display = 'none';
    setAction(null, '');
    return;
  }
  // Quiz mode overrides all other prompts
  if (quizActive) {
    el.textContent = 'Quiz! Press 1, 2, or 3 to answer!';
    el.style.display = 'block';
    setAction(null, '');
    return;
  }
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
    if (scrollActive && !scrollComplete) {
      el.textContent = 'Type the scroll text! Esc to cancel';
      setAction('Escape', 'Cancel');
    } else if (scrollActive && scrollComplete) {
      el.textContent = 'Scroll complete! Press Enter to continue';
      setAction('Enter', 'Next');
    } else if (pantheonPuzzle.active && !pantheonPuzzle.complete) {
      el.textContent = 'Architecture Puzzle: Press 1-5 to place pieces!';
      setAction('Enter', 'Exit');
    } else if (pantheonPuzzle.active && pantheonPuzzle.complete) {
      el.textContent = 'You rebuilt the Pantheon dome! Press Enter to leave';
      setAction('Enter', 'Exit');
    } else if (scrollAllDone) {
      el.textContent = 'All scrolls transcribed! Press A for puzzle, Enter to leave';
      setAction('KeyA', 'Puzzle', 'Enter', 'Exit');
    } else {
      el.textContent = 'Inside the Pantheon... Press T to transcribe scrolls, A for puzzle, Enter to leave';
      setAction('KeyT', 'Scroll', 'KeyA', 'Puzzle');
    }
    el.style.display = 'block';
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
    if (hasStroller && picnic.active) {
      el.textContent = picnic.feeding ? 'Kit is eating...' : 'Press F to feed Kit!';
      el.style.display = 'block';
      setAction('KeyF', 'Feed', 'Enter', 'Exit');
    } else if (hasStroller && !kitParkBonus) {
      el.textContent = 'Central Park with Kit! Press P for a picnic';
      el.style.display = 'block';
      setAction('KeyP', 'Picnic', 'Enter', 'Exit');
    } else {
      el.textContent = 'Relaxing in Central Park... Press Enter to leave';
      el.style.display = 'block';
      setAction('Enter', 'Exit');
    }
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
    } else if (hospitalStage === 'name_pick') {
      el.textContent = 'Type a name for your baby, then press Enter';
      setAction('Enter', 'Confirm');
    }
    el.style.display = 'block';
    return;
  }
  if (currentScene === Scene.FAO_SCHWARZ) {
    if (faoComplete) {
      el.textContent = 'Bravo! Press Enter to leave';
    } else {
      el.textContent = 'Left/Right: move | Space: play note (' + faoMelody.length + '/' + FAO_MELODY_TARGET.length + ')';
    }
    el.style.display = 'block';
    setAction('Space', 'Play', 'Enter', 'Exit');
    return;
  }
  if (currentScene === Scene.EMPIRE_STATE) {
    if (!empireAtTop) {
      el.textContent = 'Riding the elevator... ' + Math.round(empireElevator) + ' floors';
      setAction(null, '');
    } else {
      el.textContent = 'Top of the Empire State Building! What a view! Enter to leave';
      setAction('Enter', 'Exit');
    }
    el.style.display = 'block';
    return;
  }
  if (currentScene === Scene.THIRTY_ROCK) {
    if (thirtyRockDance.active && thirtyRockDance.showing) {
      el.textContent = 'Watch the dance moves...';
      setAction(null, '');
    } else if (thirtyRockDance.active) {
      el.textContent = 'Repeat the moves! Left/Right/Up/Space (' + thirtyRockDance.input.length + '/' + thirtyRockDance.sequence.length + ')';
      setAction(null, '');
    } else {
      el.textContent = 'Show complete! Score: ' + thirtyRockDance.score + '/' + thirtyRockDance.sequence.length + ' | Enter to leave';
      setAction('Enter', 'Exit');
    }
    el.style.display = 'block';
    return;
  }
  if (currentScene === Scene.GRAND_CENTRAL) {
    if (!grandCentralWhisper) {
      el.textContent = 'Grand Central Terminal! W to whisper | T for Telegram office | Enter to leave';
      setAction('KeyW', 'Whisper', 'KeyT', 'Telegram');
    } else {
      el.textContent = 'You whispered: "' + grandCentralWhisper + '" — it echoed! T for Telegram | Enter to leave';
      setAction('KeyT', 'Telegram', 'Enter', 'Exit');
    }
    el.style.display = 'block';
    return;
  }
  if (currentScene === Scene.TELEGRAM) {
    const levels = ['Easy', 'Medium', 'Hard'];
    if (!telegramActive && !telegramComplete) {
      el.textContent = 'Telegram Office (' + levels[telegramLevel] + ') — Left/Right to change difficulty | Enter to start | Esc to go back';
      setAction('Enter', 'Start');
    } else if (telegramActive) {
      const progress = telegramTyped.length + '/' + telegramText.length;
      el.textContent = 'Type the telegram! (' + progress + ') | Esc to cancel';
      setAction(null, '');
    } else {
      el.textContent = 'Telegram sent! Enter for another | Esc to go back';
      setAction('Enter', 'Again');
    }
    el.style.display = 'block';
    return;
  }
  if (currentScene === Scene.THE_MET) {
    const p = MET_PAINTINGS[metPaintingIndex];
    if (artDescActive) {
      el.textContent = 'Describe "' + p.title + '" — Type your description, Enter to submit, Esc to cancel';
      setAction('Enter', 'Submit');
    } else {
      el.textContent = '"' + p.title + '" — ' + p.level + ' (' + (metPaintingIndex + 1) + '/' + MET_PAINTINGS.length + ') Left/Right | D: Describe | Enter to leave';
      setAction('KeyD', 'Describe');
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
  } else if (bugCatcherActive) {
    el.textContent = bugCatcherRule ? bugCatcherRule.text + ' (Space to catch)' : 'Bug Catcher!';
    el.style.display = 'block';
    setAction('Space', 'Catch');
    return;
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
  } else if (near.nearBugNet) {
    el.textContent = 'Press Space to pick up the Bug Net!';
    el.style.display = 'block';
    setAction('Space', 'Pick up');
  } else if (currentLevel === 1 && hasBugNet && !bugCatcherActive && !bugCatcherFinished && Math.abs(player.x - BUG_NET_POS.x) < 120) {
    el.textContent = 'Press B to start Bug Catcher!';
    el.style.display = 'block';
    setAction('KeyB', 'Bugs');
  } else if (near.nearPizza) {
    el.textContent = 'Press Enter to make pizza!';
    el.style.display = 'block';
    setAction('Enter', 'Pizza');
  } else if (near.nearHospital) {
    el.textContent = 'Press Enter to help at the hospital!';
    el.style.display = 'block';
    setAction('Enter', 'Hospital');
  } else if (near.nearFao) {
    el.textContent = 'Press Enter to visit FAO Schwarz!';
    el.style.display = 'block';
    setAction('Enter', 'FAO');
  } else if (near.nearEmpire) {
    el.textContent = 'Press Enter to ride the Empire State elevator!';
    el.style.display = 'block';
    setAction('Enter', 'Enter');
  } else if (near.nearThirtyRock) {
    el.textContent = 'Press Enter to visit 30 Rock studios!';
    el.style.display = 'block';
    setAction('Enter', 'Enter');
  } else if (near.nearGrandCentral) {
    el.textContent = 'Press Enter to explore Grand Central Terminal!';
    el.style.display = 'block';
    setAction('Enter', 'Enter');
  } else if (near.nearMet) {
    el.textContent = 'Press Enter to visit The Met Museum!';
    el.style.display = 'block';
    setAction('Enter', 'Enter');
  } else if (near.nearHotdog) {
    if (hotdogMath.complete) {
      el.textContent = 'You already bought all 5 hot dogs here!';
    } else {
      el.textContent = 'Press H for Hot Dog Math Challenge!';
    }
    el.style.display = 'block';
    setAction(hotdogMath.complete ? null : 'KeyH', 'Math');
  } else if (near.nearPark) {
    el.textContent = 'Press Enter to visit Central Park';
    el.style.display = 'block';
    setAction('Enter', 'Enter');
  } else if (near.nearTaxi) {
    el.textContent = 'Press Enter to take a taxi to Rome!';
    el.style.display = 'block';
    setAction('Enter', 'Taxi');
  } else if (near.nearFountain) {
    el.textContent = 'Press S to toss a coin in the fountain!';
    el.style.display = 'block';
    setAction('KeyS', 'Wish');
  } else if (near.nearGelato) {
    el.textContent = 'Press G for gelato (+5 pts) | Enter for Gelato Shop';
    el.style.display = 'block';
    setAction('Enter', 'Shop');
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
  } else if (near.nearTrain && trainPuzzleActive) {
    el.textContent = 'Solve the signal puzzle! Press 1 or 2 to answer.';
    el.style.display = 'block';
    setAction(null, '');
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
  } else if (near.nearFirePit && campfire.lit && storyTyping.active) {
    el.textContent = 'Type the story! Esc to exit.';
    el.style.display = 'block';
    setAction(null, '');
  } else if (near.nearFirePit && campfire.lit && lightShowActive) {
    el.textContent = 'Light Show mode! Type colors to program the fire.';
    el.style.display = 'block';
    setAction(null, '');
  } else if (near.nearFirePit && campfire.lit && !near.nearGeometry) {
    el.textContent = 'R: Roast  L: Light Show  Y: Story Time!';
    el.style.display = 'block';
    setAction('KeyR', 'Roast');
  } else if (near.nearGeometry) {
    el.textContent = 'Press G for Campfire Geometry! Build shapes with sticks!';
    el.style.display = 'block';
    setAction('KeyG', 'Geometry');
  } else if (geometryActive) {
    el.textContent = 'Arrows: Rotate | Space: Place stick | Esc: Exit';
    el.style.display = 'block';
    setAction(null, '');
  } else if (near.nearHammock) {
    el.textContent = 'Press N to nap in the hammock!';
    el.style.display = 'block';
    setAction('KeyN', 'Nap');
  } else if (near.nearBigfoot) {
    let prompt = 'M: Chocolate milk';
    if (!bigfootPhotoTaken && leprechaunGold >= 1) {
      prompt += ' | P: Take photo (1 gold)';
    } else if (!bigfootPhotoTaken && leprechaunGold < 1) {
      prompt += ' | Need 1 gold for photo';
    } else if (bigfootPhotoTaken) {
      prompt += ' | Photo taken!';
    }
    el.textContent = prompt;
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
    if (parrotState === 'shoulder') {
      el.textContent = 'A parrot landed on your shoulder! N: Name it | S: Exit';
      setAction('KeyN', 'Name', 'KeyS', 'Exit');
    } else if (parrotState === 'named') {
      el.textContent = parrotName + ' is your new friend! S: Exit';
      setAction('KeyS', 'Exit');
    } else {
      el.textContent = 'Splashing in the watering hole! Press S to get out';
      setAction('KeyS', 'Exit');
    }
    el.style.display = 'block';
  } else if (journalActive) {
    if (journalResult === '') {
      el.textContent = 'Field Journal: Press 1, 2, or 3 to answer!';
    } else if (journalResult === 'correct') {
      el.textContent = 'Correct! Journal entry complete!';
    } else {
      el.textContent = 'Not quite — try again!';
    }
    el.style.display = 'block';
    setAction(null, '');
  } else if (safariPhotography.active) {
    el.textContent = 'Taking photo... hold steady!';
    el.style.display = 'block';
    setAction(null, '');
  } else if (ridingCheetah) {
    el.textContent = 'Riding the cheetah! G: Dismount | Yarn auto-collects nearby!';
    el.style.display = 'block';
    setAction('KeyG', 'Off');
  } else if (near.nearMarket && !marketComplete) {
    el.textContent = 'Press Enter to haggle at the market!';
    el.style.display = 'block';
    setAction('Enter', 'Enter');
  } else if (near.nearMarket && marketComplete) {
    el.textContent = 'Market complete! Great haggling!';
    el.style.display = 'block';
    setAction(null, '');
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
    if (diveLogShowingTimeline) {
      el.textContent = 'USS Oriental Timeline — Press Enter or Escape to close';
      el.style.display = 'block';
      setAction('Enter', 'Close');
      return;
    }
    // Check if near a timeline piece
    let nearPiece = false;
    for (let i = 0; i < DIVE_LOG_PIECES.length; i++) {
      if (diveLogFound.has(i)) continue;
      const piece = DIVE_LOG_PIECES[i];
      const dx = scubaPlayer.x - piece.x;
      const dy = scubaPlayer.y - piece.y;
      if (dx * dx + dy * dy < 2500) { nearPiece = true; break; }
    }
    if (nearPiece) {
      el.textContent = 'Press T to collect timeline piece! | Q: Talk | Enter: Surface';
      el.style.display = 'block';
      setAction('KeyT', 'Collect', 'Enter', 'Surface');
    } else {
      el.textContent = 'Swim with arrow keys! Collect pearls! Q: Talk to mercats | Enter: Surface';
      el.style.display = 'block';
      setAction('Enter', 'Surface', 'KeyQ', 'Talk');
    }
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
  } else if (currentLevel === 10) {
    if (player.x > level10Flight.worldW - 500) {
      el.textContent = 'Press Enter to land at Cape Canaveral!';
      el.style.display = 'block';
      setAction('Enter', 'Land');
    } else {
      el.textContent = whaleTranscription.active
        ? 'Type the radio transmission! Backspace to correct.'
        : 'Fly through the sky! Dodge seagulls, collect rubies! Type radio transmissions for bonus points!';
      el.style.display = 'block';
      setAction(null, '');
    }
    return;
  } else if (currentLevel === 12) {
    if (player.x > levelRegistry[12].worldW - 600) {
      el.textContent = 'Press Enter to land on the Moon!';
      el.style.display = 'block';
      setAction('Enter', 'Land');
    } else {
      el.textContent = 'Fly through space! Dodge asteroids, collect star crystals!';
      el.style.display = 'block';
      setAction(null, '');
    }
    return;
  } else if (currentLevel === 6 && player.x > ORIENTAL_WORLD_W - 150) {
    el.textContent = 'Press Enter to head to the Alps!';
    el.style.display = 'block';
    setAction('Enter', 'Alps');
  } else if (currentScene === Scene.CAPE_LAUNCH) {
    el.textContent = 'Hold SPACE to power the launch!';
    el.style.display = 'block';
    setAction('Space', 'Launch');
    return;
  } else if (currentScene === Scene.NASA_MUSEUM) {
    el.textContent = 'Kennedy Space Center Museum — Press Enter to leave';
    el.style.display = 'block';
    setAction('Enter', 'Exit');
    return;
  } else if (currentScene === Scene.MISSION_CONTROL) {
    if (missionControl.complete || missionControl.failed) {
      el.textContent = 'Press Enter to exit Mission Control';
    } else {
      el.textContent = 'Type the command! Backspace to correct.';
    }
    el.style.display = 'block';
    setAction('Enter', 'Exit');
    return;
  } else if (currentLevel === 11 && Math.abs(player.x - MISSION_CONTROL_POS.x - MISSION_CONTROL_POS.w / 2) < BUILDING_RANGE && currentScene === null) {
    el.textContent = 'Press Enter to enter Mission Control!';
    el.style.display = 'block';
    setAction('Enter', 'Enter');
  } else if (currentLevel === 11 && Math.abs(player.x - NASA_BUILDING_POS.x - NASA_BUILDING_POS.w / 2) < BUILDING_RANGE && currentScene === null) {
    el.textContent = 'Press Enter to visit the NASA Museum!';
    el.style.display = 'block';
    setAction('Enter', 'Enter');
  } else if (currentLevel === 11 && !capeSpaceSuit && Math.abs(player.x - SPACE_SUIT_POS.x) < BUILDING_RANGE) {
    el.textContent = 'Press S to put on Space Suit!';
    el.style.display = 'block';
    setAction('KeyS', 'Suit');
  } else if (currentLevel === 11 && fuelCalcActive) {
    el.textContent = 'Type your answer and press Enter (Esc to exit)';
    el.style.display = 'block';
    setAction('Enter', 'Submit');
  } else if (currentLevel === 11 && Math.abs(player.x - ROCKET_POS.x) < BUILDING_RANGE && !capeFueled) {
    el.textContent = 'Press P to calculate rocket fuel!';
    el.style.display = 'block';
    setAction('KeyP', 'Fuel');
  } else if (currentLevel === 11 && capeFueled && capeSpaceSuit && Math.abs(player.x - ROCKET_POS.x) < BUILDING_RANGE && !capeLaunching) {
    el.textContent = 'Press Enter to board the rocket!';
    el.style.display = 'block';
    setAction('Enter', 'Board');
  } else if (currentScene === Scene.SMOOTHIE_SHOP) {
    if (recipeModeActive) {
      if (recipeComplete) {
        el.textContent = 'Blending... next recipe coming up!';
      } else {
        el.textContent = 'Press numbers to swap steps | Enter/Esc = Exit';
      }
    } else {
      el.textContent = 'C = Fruit | Y = Yogurt | B = Blend | R = Recipes | Enter = Exit';
    }
    el.style.display = 'block';
    setAction('KeyC', 'Fruit');
    return;
  } else if (currentScene === Scene.TOPGOLF) {
    el.textContent = 'Up/Down = Aim | Space = Shoot | Enter = Exit';
    el.style.display = 'block';
    setAction('Space', 'Shoot');
    return;
  } else if (currentScene === Scene.FOUNTAIN_WISHES) {
    el.textContent = 'Up/Down = Aim | Hold Space = Toss | Enter = Exit';
    el.style.display = 'block';
    setAction('Space', 'Toss');
    return;
  } else if (currentLevel === 13 && Math.abs(player.x - SMOOTHIE_SHOP_POS.x) < BUILDING_RANGE) {
    el.textContent = 'Press Enter for Smoothie Shop!';
    el.style.display = 'block';
    setAction('Enter', 'Enter');
  } else if (currentLevel === 13 && Math.abs(player.x - TOPGOLF_POS.x) < BUILDING_RANGE) {
    el.textContent = 'Press Enter for TopGolf!';
    el.style.display = 'block';
    setAction('Enter', 'Enter');
  } else if (currentScene === Scene.APOLLO_MISSION) {
    const am = apolloMission;
    if (am.celebrateTimer > 0) {
      el.textContent = 'Apollo Mission Complete! +300 points!';
    } else if (am.step === 0) {
      el.textContent = 'Press Space when the boot reaches the green zone!';
      setAction('Space', 'Step');
    } else if (am.step === 1) {
      el.textContent = 'Hold Space to plant the flag!';
      setAction('Space', 'Plant');
    } else if (am.step === 2) {
      el.textContent = 'Left/Right to collect moon rocks! ' + am.rocksCollected + '/5';
      setAction(null, '');
    } else if (am.step === 3) {
      el.textContent = 'Press S to salute the flag!';
      setAction('KeyS', 'Salute');
    }
    el.style.display = 'block';
  } else if (currentScene === Scene.ROVER_PROGRAMMING) {
    const rp = roverProg;
    if (rp.running) {
      el.textContent = 'Running program... step ' + (rp.runStep + 1) + ' of ' + rp.program.length;
    } else if (rp.feedback === 'success') {
      el.textContent = 'Challenge complete! +' + POINTS.ROVER_CHALLENGE;
    } else if (rp.feedback === 'fail') {
      el.textContent = 'Try again! Press F/L/R/P to build commands';
    } else {
      el.textContent = 'Press F/L/R/P to program rover, Space to RUN, Backspace to delete';
      setAction('Space', 'Run');
    }
    el.style.display = 'block';
  } else if (currentLevel === 13 && Math.abs(player.x - ROVER_STATION_POS.x) < BUILDING_RANGE && !roverProg.complete) {
    el.textContent = 'Press Enter for Rover Programming!';
    el.style.display = 'block';
    setAction('Enter', 'Enter');
  } else if (currentLevel === 13 && Math.abs(player.x - APOLLO_SITE_POS.x) < BUILDING_RANGE && !apolloMission.complete) {
    el.textContent = 'Press Enter for Apollo Landing Recreation!';
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
  } else if (near.nearTimeCapsule) {
    el.textContent = 'Something is glowing... Press T to investigate!';
    el.style.display = 'block';
    setAction('KeyT', 'Dig');
  } else {
    el.style.display = 'none';
    setAction(null, '');
  }
}
