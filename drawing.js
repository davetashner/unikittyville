// ── Draw ──
function draw() {
  const W = canvas.width, H = canvas.height;
  const ww = getCurrentWorldW();
  const cam = Math.max(0, Math.min(ww - W, player.x - W / 2));

  // Level transition effect
  if (levelTransition.active) {
    drawLevelTransition(W, H);
    return;
  }

  // Day/night cycle (0..1, 0=noon, 0.5=midnight)
  const cycle = (Math.sin(gameTime / DAY_LENGTH * Math.PI * 2 - Math.PI / 2) + 1) / 2;
  const isNight = cycle > 0.5;

  levelRegistry[currentLevel].drawSky(W, H, cycle, isNight, cam);

  ctx.save();
  ctx.translate(-cam, 0);

  if (currentScene !== null) {
    const sceneDrawMap = {
      [Scene.HOUSE]: () => drawHouseInterior(cam, W, H),
      [Scene.CAMPER]: () => drawCamperInterior(cam, W, H),
      [Scene.WINDMILL]: () => drawWindmillInterior(cam, W, H),
      [Scene.PIZZA]: () => drawPizzaInterior(cam, W, H),
      [Scene.PARK]: () => drawParkInterior(cam, W, H),
      [Scene.PANTHEON]: () => drawPantheonInterior(cam, W, H),
      [Scene.SWIMMING]: () => drawSwimmingScene(cam, W, H),
      [Scene.SURFING]: () => drawSurfingScene(cam, W, H),
      [Scene.CHALET]: () => drawChaletInterior(cam, W, H),
      [Scene.SWIMMING_IN_POOL]: () => drawPoolSwimmingScene(cam, W, H),
      [Scene.CAMP_CAMPER]: () => drawCampCamperInterior(cam, W, H),
      [Scene.WATERING_HOLE]: () => drawWateringHoleScene(cam, W, H),
      [Scene.SCUBA_DIVING]: () => drawScubaDivingScene(cam, W, H),
      [Scene.SAILING]: () => drawSailingScene(cam, W, H),
      [Scene.CAPE_LAUNCH]: () => drawCapeLaunchScene(cam, W, H),
      [Scene.SMOOTHIE_SHOP]: () => drawSmoothieShopInterior(cam, W, H),
      [Scene.TOPGOLF]: () => drawTopGolfInterior(cam, W, H),
      [Scene.HOSPITAL]: () => drawHospitalInterior(cam, W, H),
      [Scene.FAO_SCHWARZ]: () => drawFaoSchwarzInterior(cam, W, H),
      [Scene.EMPIRE_STATE]: () => drawEmpireStateInterior(cam, W, H),
      [Scene.THIRTY_ROCK]: () => drawThirtyRockInterior(cam, W, H),
      [Scene.GRAND_CENTRAL]: () => drawGrandCentralInterior(cam, W, H),
      [Scene.THE_MET]: () => drawMetMuseumInterior(cam, W, H),
      [Scene.NASA_MUSEUM]: () => drawNasaMuseumInterior(cam, W, H),
      [Scene.TELEGRAM]: () => drawTelegramOffice(cam, W, H),
    };
    if (sceneDrawMap[currentScene]) sceneDrawMap[currentScene]();
  } else {
    levelRegistry[currentLevel].drawWorld(W, H, cam, cycle, isNight);
  }

  // Draw speech bubbles above NPCs (in world coordinates)
  drawSpeechBubbles();

  ctx.restore();

  // Photo gallery overlay (safari level)
  if (photoGalleryOpen && currentLevel === 9) {
    drawPhotoGallery(W, H);
  }

  // Fact Notebook overlay
  if (notebookOpen) {
    drawNotebook(W, H);
  }

  // Achievement screen overlay
  if (achievementScreenOpen) {
    drawAchievements(W, H);
  }

  // Achievement unlock popup banner
  if (achievementPopup) {
    drawAchievementPopup(W, H);
  }
}

function drawPhotoGallery(W, H) {
  // Semi-transparent backdrop
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.fillRect(0, 0, W, H);

  // Title
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold ' + Math.round(H * 0.06) + 'px "Segoe UI", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Safari Photo Album', W / 2, H * 0.12);

  ctx.font = Math.round(H * 0.03) + 'px "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Press V to close', W / 2, H * 0.18);

  // Four polaroid-style frames
  const animals = [
    { key: 'elephant', label: 'Elephant', emoji: '', color: '#94a3b8' },
    { key: 'rhino', label: 'Rhino', emoji: '', color: '#6b7280' },
    { key: 'giraffe', label: 'Giraffe', emoji: '', color: '#fbbf24' },
    { key: 'antelope', label: 'Antelope', emoji: '', color: '#a78bfa' },
  ];

  const frameW = Math.round(W * 0.18);
  const frameH = Math.round(frameW * 1.2);
  const gap = Math.round(W * 0.04);
  const totalW = animals.length * frameW + (animals.length - 1) * gap;
  const startX = (W - totalW) / 2;
  const startY = H * 0.25;

  for (let i = 0; i < animals.length; i++) {
    const a = animals[i];
    const fx = startX + i * (frameW + gap);
    const fy = startY;
    const taken = safariPhotosTaken[a.key];

    // Polaroid frame
    ctx.fillStyle = taken ? '#fefce8' : '#374151';
    ctx.fillRect(fx, fy, frameW, frameH);

    // Photo area
    const photoX = fx + frameW * 0.1;
    const photoY = fy + frameW * 0.1;
    const photoW = frameW * 0.8;
    const photoH = frameW * 0.7;

    if (taken) {
      // Draw a simple scene with the animal
      // Savanna background
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(photoX, photoY, photoW, photoH);
      ctx.fillStyle = '#92400e';
      ctx.fillRect(photoX, photoY + photoH * 0.7, photoW, photoH * 0.3);

      // Sun
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(photoX + photoW * 0.8, photoY + photoH * 0.2, photoH * 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Animal silhouette (simple shapes)
      ctx.fillStyle = a.color;
      const ax = photoX + photoW * 0.5;
      const ay = photoY + photoH * 0.55;
      if (a.key === 'elephant') {
        ctx.fillRect(ax - 12, ay - 8, 24, 16);
        ctx.fillRect(ax - 14, ay + 4, 6, 10);
        ctx.fillRect(ax + 8, ay + 4, 6, 10);
        ctx.fillRect(ax + 10, ay - 12, 8, 8);
        ctx.fillRect(ax + 16, ay - 8, 3, 12);
      } else if (a.key === 'rhino') {
        ctx.fillRect(ax - 14, ay - 6, 28, 14);
        ctx.fillRect(ax - 16, ay + 4, 6, 10);
        ctx.fillRect(ax + 10, ay + 4, 6, 10);
        ctx.fillRect(ax - 16, ay - 10, 6, 6);
        // horn
        ctx.fillStyle = '#d1d5db';
        ctx.fillRect(ax - 18, ay - 14, 4, 6);
      } else if (a.key === 'giraffe') {
        ctx.fillRect(ax - 4, ay - 20, 8, 30);
        ctx.fillRect(ax - 8, ay + 6, 6, 10);
        ctx.fillRect(ax + 2, ay + 6, 6, 10);
        ctx.fillRect(ax - 6, ay - 24, 12, 8);
        // spots
        ctx.fillStyle = '#92400e';
        ctx.fillRect(ax - 2, ay - 14, 3, 3);
        ctx.fillRect(ax + 1, ay - 6, 3, 3);
        ctx.fillRect(ax - 3, ay, 3, 3);
      } else if (a.key === 'antelope') {
        ctx.fillRect(ax - 10, ay - 4, 20, 10);
        ctx.fillRect(ax - 12, ay + 2, 4, 10);
        ctx.fillRect(ax + 8, ay + 2, 4, 10);
        ctx.fillRect(ax - 12, ay - 8, 8, 6);
        // horns
        ctx.fillStyle = '#78716c';
        ctx.fillRect(ax - 12, ay - 16, 2, 10);
        ctx.fillRect(ax - 6, ay - 16, 2, 10);
      }

      // Checkmark
      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold ' + Math.round(frameW * 0.15) + 'px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('\u2713', fx + frameW - 6, fy + 16);
    } else {
      // Empty — question mark
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(photoX, photoY, photoW, photoH);
      ctx.fillStyle = '#4b5563';
      ctx.font = 'bold ' + Math.round(photoH * 0.5) + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('?', photoX + photoW / 2, photoY + photoH * 0.65);
    }

    // Label
    ctx.fillStyle = taken ? '#1e1b4b' : '#9ca3af';
    ctx.font = 'bold ' + Math.round(frameW * 0.12) + 'px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(a.label, fx + frameW / 2, fy + frameH - frameW * 0.08);
  }

  // Collection progress
  const count = Object.values(safariPhotosTaken).filter(v => v).length;
  ctx.fillStyle = count >= 4 ? '#4ade80' : '#e2e8f0';
  ctx.font = 'bold ' + Math.round(H * 0.04) + 'px "Segoe UI", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(count + '/4 species photographed' + (count >= 4 ? ' — Collection complete!' : ''), W / 2, H * 0.88);
}

function drawNotebook(W, H) {
  // Semi-transparent backdrop
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, W, H);

  // Notebook parchment background
  const pad = Math.round(W * 0.06);
  const nbX = pad, nbY = pad;
  const nbW = W - pad * 2, nbH = H - pad * 2;

  // Parchment fill
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(nbX, nbY, nbW, nbH);

  // Subtle border
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 3;
  ctx.strokeRect(nbX, nbY, nbW, nbH);

  // Spine line (left margin)
  const spineX = nbX + Math.round(nbW * 0.06);
  ctx.strokeStyle = '#fca5a5';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(spineX, nbY);
  ctx.lineTo(spineX, nbY + nbH);
  ctx.stroke();

  // Title
  const titleSize = Math.round(H * 0.055);
  ctx.fillStyle = '#92400e';
  ctx.font = 'bold ' + titleSize + 'px "Segoe UI", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Fact Notebook', W / 2, nbY + titleSize + 10);

  // Category tabs
  const tabY = nbY + titleSize + 25;
  const tabH = Math.round(H * 0.045);
  const tabFont = Math.round(tabH * 0.6);
  ctx.font = 'bold ' + tabFont + 'px "Segoe UI", system-ui, sans-serif';

  const tabColors = { All: '#78716c', Geography: '#3b82f6', History: '#dc2626', Science: '#16a34a', Culture: '#a855f7', Language: '#f59e0b' };
  const tabTotalW = nbW - 20;
  const tabW = Math.floor(tabTotalW / NOTEBOOK_CATEGORIES.length);
  const tabStartX = nbX + 10;

  for (let i = 0; i < NOTEBOOK_CATEGORIES.length; i++) {
    const cat = NOTEBOOK_CATEGORIES[i];
    const tx = tabStartX + i * tabW;
    const isActive = cat === notebookCategory;

    // Tab background
    ctx.fillStyle = isActive ? tabColors[cat] : '#e7e5e4';
    ctx.fillRect(tx + 2, tabY, tabW - 4, tabH);

    // Tab text
    ctx.fillStyle = isActive ? '#ffffff' : '#57534e';
    ctx.textAlign = 'center';
    ctx.fillText(cat, tx + tabW / 2, tabY + tabH * 0.72);
  }

  // Filter facts by category
  const filteredFacts = notebookCategory === 'All'
    ? factNotebook
    : factNotebook.filter(f => f.category === notebookCategory);

  // Fact list area
  const listY = tabY + tabH + 15;
  const listH = nbY + nbH - listY - Math.round(H * 0.08);
  const lineH = Math.round(H * 0.055);
  const maxLines = Math.floor(listH / lineH);
  const maxScroll = Math.max(0, filteredFacts.length - maxLines);
  if (notebookScroll > maxScroll) notebookScroll = maxScroll;

  // Horizontal ruled lines
  ctx.strokeStyle = '#ddd6cb';
  ctx.lineWidth = 1;
  for (let i = 0; i <= maxLines; i++) {
    const ly = listY + i * lineH;
    if (ly > nbY + nbH - 30) break;
    ctx.beginPath();
    ctx.moveTo(nbX + 10, ly);
    ctx.lineTo(nbX + nbW - 10, ly);
    ctx.stroke();
  }

  // Draw facts
  const factFont = Math.round(lineH * 0.45);
  const labelFont = Math.round(lineH * 0.35);
  ctx.textAlign = 'left';

  if (filteredFacts.length === 0) {
    ctx.fillStyle = '#a8a29e';
    ctx.font = 'italic ' + Math.round(H * 0.035) + 'px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(factNotebook.length === 0 ? 'No facts yet! Talk to NPCs with Q to learn things.' : 'No facts in this category.', W / 2, listY + lineH * 2);
  } else {
    for (let i = 0; i < maxLines && (i + notebookScroll) < filteredFacts.length; i++) {
      const fact = filteredFacts[i + notebookScroll];
      const fy = listY + i * lineH + lineH * 0.65;

      // Category dot
      ctx.fillStyle = tabColors[fact.category] || '#78716c';
      ctx.beginPath();
      ctx.arc(spineX + 14, fy - factFont * 0.25, 4, 0, Math.PI * 2);
      ctx.fill();

      // Fact text (truncate if too long)
      ctx.fillStyle = '#44403c';
      ctx.font = factFont + 'px "Segoe UI", system-ui, sans-serif';
      const maxTextW = nbX + nbW - spineX - 130;
      let displayText = fact.text;
      while (ctx.measureText(displayText).width > maxTextW && displayText.length > 10) {
        displayText = displayText.slice(0, -4) + '...';
      }
      ctx.fillText(displayText, spineX + 24, fy);

      // Level label (right-aligned)
      ctx.fillStyle = '#a8a29e';
      ctx.font = labelFont + 'px "Segoe UI", system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(fact.levelName, nbX + nbW - 15, fy);
      ctx.textAlign = 'left';
    }
  }

  // Scroll indicators
  if (notebookScroll > 0) {
    ctx.fillStyle = '#92400e';
    ctx.font = 'bold ' + Math.round(H * 0.035) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('\u25B2', nbX + nbW - 25, listY + 15);
  }
  if (notebookScroll < maxScroll) {
    ctx.fillStyle = '#92400e';
    ctx.font = 'bold ' + Math.round(H * 0.035) + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('\u25BC', nbX + nbW - 25, nbY + nbH - Math.round(H * 0.06));
  }

  // Footer: fact count + close hint
  const footerY = nbY + nbH - 12;
  ctx.fillStyle = '#78716c';
  ctx.font = Math.round(H * 0.03) + 'px "Segoe UI", system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(factNotebook.length + ' fact' + (factNotebook.length !== 1 ? 's' : '') + ' collected', nbX + 15, footerY);
  ctx.textAlign = 'right';
  ctx.fillText('N / Enter to close  |  \u2190\u2192 categories  |  \u2191\u2193 scroll', nbX + nbW - 15, footerY);
  ctx.textAlign = 'left';
}

function drawAchievements(W, H) {
  // Semi-transparent backdrop
  ctx.fillStyle = 'rgba(0, 0, 0, 0.82)';
  ctx.fillRect(0, 0, W, H);

  // Title
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold ' + Math.round(H * 0.07) + 'px "Segoe UI", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Achievement Badges', W / 2, H * 0.1);

  ctx.font = Math.round(H * 0.03) + 'px "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('Press B to close', W / 2, H * 0.16);

  // Grid layout: 4 columns x 2 rows
  const cols = 4;
  const rows = 2;
  const cardW = Math.round(W * 0.19);
  const cardH = Math.round(H * 0.3);
  const gapX = Math.round(W * 0.03);
  const gapY = Math.round(H * 0.04);
  const totalW = cols * cardW + (cols - 1) * gapX;
  const startX = (W - totalW) / 2;
  const startY = H * 0.22;

  for (let i = 0; i < achievements.length; i++) {
    const a = achievements[i];
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cx = startX + col * (cardW + gapX);
    const cy = startY + row * (cardH + gapY);

    // Card background
    if (a.earned) {
      // Colorful earned card
      const grad = ctx.createLinearGradient(cx, cy, cx + cardW, cy + cardH);
      grad.addColorStop(0, 'rgba(124, 58, 237, 0.5)');
      grad.addColorStop(1, 'rgba(251, 191, 36, 0.4)');
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = 'rgba(55, 65, 81, 0.6)';
    }
    // Rounded rect
    const r = 10;
    ctx.beginPath();
    ctx.moveTo(cx + r, cy);
    ctx.lineTo(cx + cardW - r, cy);
    ctx.quadraticCurveTo(cx + cardW, cy, cx + cardW, cy + r);
    ctx.lineTo(cx + cardW, cy + cardH - r);
    ctx.quadraticCurveTo(cx + cardW, cy + cardH, cx + cardW - r, cy + cardH);
    ctx.lineTo(cx + r, cy + cardH);
    ctx.quadraticCurveTo(cx, cy + cardH, cx, cy + cardH - r);
    ctx.lineTo(cx, cy + r);
    ctx.quadraticCurveTo(cx, cy, cx + r, cy);
    ctx.closePath();
    ctx.fill();

    // Border
    ctx.strokeStyle = a.earned ? 'rgba(251, 191, 36, 0.7)' : 'rgba(107, 114, 128, 0.4)';
    ctx.lineWidth = a.earned ? 2 : 1;
    ctx.stroke();

    const centerX = cx + cardW / 2;

    // Icon or lock
    const iconSize = Math.round(cardH * 0.3);
    ctx.font = iconSize + 'px sans-serif';
    ctx.textAlign = 'center';
    if (a.earned) {
      ctx.fillText(a.icon, centerX, cy + cardH * 0.35);
    } else {
      ctx.fillStyle = '#6b7280';
      ctx.fillText('???', centerX, cy + cardH * 0.35);
    }

    // Name
    const nameSize = Math.round(cardH * 0.1);
    ctx.font = 'bold ' + nameSize + 'px "Segoe UI", system-ui, sans-serif';
    ctx.fillStyle = a.earned ? '#fef08a' : '#9ca3af';
    ctx.textAlign = 'center';
    ctx.fillText(a.name, centerX, cy + cardH * 0.55);

    // Description or hint
    const descSize = Math.round(cardH * 0.075);
    ctx.font = descSize + 'px "Segoe UI", system-ui, sans-serif';
    ctx.fillStyle = a.earned ? '#e2e8f0' : '#6b7280';
    const descText = a.earned ? a.description : a.hint;
    // Simple word wrap for long text
    const words = descText.split(' ');
    let line = '';
    let lineY = cy + cardH * 0.65;
    const maxLineW = cardW - 16;
    for (const word of words) {
      const test = line + (line ? ' ' : '') + word;
      if (ctx.measureText(test).width > maxLineW && line) {
        ctx.fillText(line, centerX, lineY);
        line = word;
        lineY += descSize + 2;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, centerX, lineY);

    // Earned checkmark
    if (a.earned) {
      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold ' + Math.round(cardH * 0.12) + 'px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('\u2713', cx + cardW - 6, cy + 18);
    }
  }

  // Progress summary
  const earned = achievements.filter(a => a.earned).length;
  ctx.fillStyle = earned === achievements.length ? '#4ade80' : '#e2e8f0';
  ctx.font = 'bold ' + Math.round(H * 0.035) + 'px "Segoe UI", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(earned + '/' + achievements.length + ' badges earned' + (earned === achievements.length ? ' \u2014 All complete!' : ''), W / 2, H * 0.94);
}

function drawAchievementPopup(W, H) {
  if (!achievementPopup) return;
  const progress = achievementPopup.timer / ACHIEVEMENT_POPUP_DURATION;
  // Slide in from top, stay, slide out
  let yOffset;
  if (progress > 0.85) {
    // Sliding in
    yOffset = (1 - (progress - 0.85) / 0.15) * 1;
  } else if (progress < 0.15) {
    // Sliding out
    yOffset = (1 - progress / 0.15) * 1;
  } else {
    yOffset = 1;
  }

  const bannerH = Math.round(H * 0.12);
  const bannerW = Math.round(W * 0.55);
  const bx = (W - bannerW) / 2;
  const by = H * 0.05 * yOffset - bannerH * (1 - yOffset);

  // Banner background
  const grad = ctx.createLinearGradient(bx, by, bx + bannerW, by + bannerH);
  grad.addColorStop(0, 'rgba(124, 58, 237, 0.92)');
  grad.addColorStop(0.5, 'rgba(168, 85, 247, 0.92)');
  grad.addColorStop(1, 'rgba(251, 191, 36, 0.92)');
  ctx.fillStyle = grad;
  // Rounded banner
  const r = 12;
  ctx.beginPath();
  ctx.moveTo(bx + r, by);
  ctx.lineTo(bx + bannerW - r, by);
  ctx.quadraticCurveTo(bx + bannerW, by, bx + bannerW, by + r);
  ctx.lineTo(bx + bannerW, by + bannerH - r);
  ctx.quadraticCurveTo(bx + bannerW, by + bannerH, bx + bannerW - r, by + bannerH);
  ctx.lineTo(bx + r, by + bannerH);
  ctx.quadraticCurveTo(bx, by + bannerH, bx, by + bannerH - r);
  ctx.lineTo(bx, by + r);
  ctx.quadraticCurveTo(bx, by, bx + r, by);
  ctx.closePath();
  ctx.fill();

  // Border
  ctx.strokeStyle = 'rgba(253, 224, 71, 0.8)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Icon
  const iconSize = Math.round(bannerH * 0.5);
  ctx.font = iconSize + 'px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(achievementPopup.icon, bx + 16, by + bannerH * 0.65);

  // Text
  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold ' + Math.round(bannerH * 0.22) + 'px "Segoe UI", system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Achievement Unlocked!', bx + iconSize + 28, by + bannerH * 0.4);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold ' + Math.round(bannerH * 0.26) + 'px "Segoe UI", system-ui, sans-serif';
  ctx.fillText(achievementPopup.name, bx + iconSize + 28, by + bannerH * 0.72);
}

function drawSpeechBubbles() {
  for (const bubble of activeSpeechBubbles) {
    const npc = bubble.npc;
    const alpha = Math.min(1, bubble.life / 800);
    ctx.globalAlpha = alpha;

    ctx.font = '11px system-ui';
    const maxWidth = 160;
    const words = bubble.text.split(' ');
    const lines = [];
    let currentLine = '';
    for (const word of words) {
      const testLine = currentLine ? currentLine + ' ' + word : word;
      if (ctx.measureText(testLine).width > maxWidth) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);

    const lineHeight = 14;
    const padX = 10, padY = 6;
    const boxW = Math.min(maxWidth + padX * 2, Math.max(...lines.map(l => ctx.measureText(l).width)) + padX * 2);
    const boxH = lines.length * lineHeight + padY * 2;
    const bx = npc.x - boxW / 2;
    const by = npc.y - 70 - boxH;

    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath(); ctx.roundRect(bx, by, boxW, boxH, 8); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(bx, by, boxW, boxH, 8); ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath();
    ctx.moveTo(npc.x - 6, by + boxH);
    ctx.lineTo(npc.x, by + boxH + 8);
    ctx.lineTo(npc.x + 6, by + boxH);
    ctx.fill();

    ctx.fillStyle = '#1f2937';
    ctx.textAlign = 'center';
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], npc.x, by + padY + 11 + i * lineHeight);
    }
    ctx.globalAlpha = 1;
  }
}

// ── Shared Drawing Helpers ──

function drawYarnBallsForLevel(yarnBallArray) {
  for (const yb of yarnBallArray) {
    if (yb.collected) continue;
    const bob = Math.sin(gameTime / 400 + yb.bobPhase) * 3;
    const yx = yb.x, yy = yb.y + bob;

    // Glow
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = yb.color;
    ctx.beginPath();
    ctx.arc(yx, yy, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Ball body
    ctx.fillStyle = yb.color;
    ctx.beginPath();
    ctx.arc(yx, yy, 12, 0, Math.PI * 2);
    ctx.fill();

    // Yarn lines (cross-hatch pattern)
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(yx, yy, 10, 0.3, 1.8); ctx.stroke();
    ctx.beginPath(); ctx.arc(yx, yy, 8, 2.0, 3.5); ctx.stroke();
    ctx.beginPath(); ctx.arc(yx, yy, 6, 4.0, 5.5); ctx.stroke();

    // Shine
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath();
    ctx.arc(yx - 3, yy - 4, 3, 0, Math.PI * 2);
    ctx.fill();

    // Trailing string
    ctx.strokeStyle = yb.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(yx + 10, yy + 5);
    ctx.quadraticCurveTo(yx + 16, yy + 12 + bob, yx + 12, yy + 18);
    ctx.stroke();
  }
}

function drawPlatformsWithStyle(platformArray, topColor, bottomColor, decorateFn) {
  for (const p of platformArray) {
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(p.x + 3, p.y + 3, p.w, 14);

    // Main platform body
    const pGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + 14);
    pGrad.addColorStop(0, topColor);
    pGrad.addColorStop(1, bottomColor);
    ctx.fillStyle = pGrad;
    ctx.beginPath();
    ctx.roundRect(p.x, p.y, p.w, 14, 4);
    ctx.fill();

    // Level-specific decoration
    if (decorateFn) decorateFn(p);
  }
}

function drawLevel1Sky(W, H, cycle, isNight, cam) {
  const dayTop = [135, 206, 250];
  const nightTop = [15, 23, 42];
  const dayBot = [255, 253, 240];
  const nightBot = [30, 41, 82];
  const t = cycle;
  const skyTop = lerpColor(dayTop, nightTop, t);
  const skyBot = lerpColor(dayBot, nightBot, t);
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, `rgb(${skyTop})`);
  grad.addColorStop(1, `rgb(${skyBot})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  if (isNight) drawStars(W, H, cycle);
  if (isNight) drawRainbow(W, H, 0);
  drawCelestial(W, H, cycle);
  drawHills(W, H, 0);
}

function drawLevel2Sky(W, H, cycle, isNight) {
  // NYC has a more urban sky — deeper blues/grays
  const dayTop = [120, 160, 200];
  const nightTop = [10, 15, 30];
  const dayBot = [200, 210, 220];
  const nightBot = [25, 30, 50];
  const t = cycle;
  const skyTop = lerpColor(dayTop, nightTop, t);
  const skyBot = lerpColor(dayBot, nightBot, t);
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, `rgb(${skyTop})`);
  grad.addColorStop(1, `rgb(${skyBot})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  if (isNight) drawStars(W, H, cycle);
  drawCelestial(W, H, cycle);
}

function drawLevel1World(W, H, cam) {
  drawGround(W, H, cam);
  drawBgScenes(cam, W);
  drawPond();
  for (const f of pondFish) drawFish(f);
  drawGrill();
  drawPlatforms();
  drawYarnBalls();
  drawHouse();
  for (const npc of npcs) drawKitty(npc.x, npc.y, npc.color, npc.facing, npc.walkFrame, npc.accessory);
  drawPlayerAndUI();
}

function drawLevel2World(W, H, cam) {
  // Sidewalk/road
  ctx.fillStyle = '#4b5563';
  ctx.fillRect(0, GROUND_Y, getCurrentWorldW(), H);
  ctx.fillStyle = '#6b7280';
  ctx.fillRect(0, GROUND_Y, getCurrentWorldW(), 4);
  // Road markings
  ctx.fillStyle = '#fbbf24';
  for (let rx = 0; rx < getCurrentWorldW(); rx += 80) {
    ctx.fillRect(rx, GROUND_Y + 20, 40, 3);
  }
  // Sidewalk
  ctx.fillStyle = '#9ca3af';
  ctx.fillRect(0, GROUND_Y - 2, getCurrentWorldW(), 6);

  // Background buildings (behind everything)
  drawNYCBuildings(cam, W);

  // NYC scenes
  drawNYCScenes(cam, W);

  // Platforms (fire escapes)
  drawNYCPlatforms();

  // Yarn balls
  drawNYCYarnBalls();

  // NPCs
  for (const npc of nycNpcs) drawKitty(npc.x, npc.y, npc.color, npc.facing, npc.walkFrame, npc.accessory);

  drawPlayerAndUI();
}

function drawPlayerAndUI() {
  // Draw sled under kitty on sledding level — tilted to match terrain
  if (currentLevel === 2 && sledding) {
    const terrainAngle = Math.atan2(
      sledTerrainY(player.x + 10) - sledTerrainY(player.x - 10), 20
    );
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(terrainAngle);
    drawSled(0, 0);
    ctx.restore();
  }
  // Draw cheetah under kitty when riding
  if (currentLevel === 9 && ridingCheetah) {
    drawRidingCheetah(player.x, player.y, player.facing);
  }
  // On sledding level, draw kitty sitting in sled (offset lower into sled)
  const sledOffset = (currentLevel === 2 && sledding) ? 5 : 0;
  drawKitty(player.x, player.y - (ridingCheetah ? 15 : sledOffset), player.color, player.facing, player.walkFrame, 'horn', playerEyeColor, playerHornColors);

  // Space suit overlay (Cape Canaveral through Moon levels)
  if (capeSpaceSuit && currentLevel >= 11 && currentLevel <= 13 && currentScene === null) {
    const sx = player.x;
    const sy = player.y - (ridingCheetah ? 15 : sledOffset);
    // Suit body (white with slight transparency so fur color peeks through)
    ctx.fillStyle = 'rgba(240, 240, 245, 0.85)';
    ctx.beginPath();
    ctx.ellipse(sx, sy - 12, 11, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    // Suit legs
    ctx.fillRect(sx - 8, sy + 1, 6, 8);
    ctx.fillRect(sx + 2, sy + 1, 6, 8);
    // Boots
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(sx - 9, sy + 7, 8, 4);
    ctx.fillRect(sx + 1, sy + 7, 8, 4);
    // Helmet (round, over head)
    ctx.fillStyle = 'rgba(230, 230, 235, 0.9)';
    ctx.beginPath();
    ctx.arc(sx, sy - 28, 12, 0, Math.PI * 2);
    ctx.fill();
    // Helmet outline
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Visor (gold reflective)
    ctx.fillStyle = 'rgba(251, 191, 36, 0.6)';
    ctx.beginPath();
    ctx.arc(sx + player.facing * 2, sy - 28, 8, 0, Math.PI * 2);
    ctx.fill();
    // Visor shine
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.arc(sx + player.facing * 4, sy - 30, 3, 0, Math.PI * 2);
    ctx.fill();
    // Horn poking through top of helmet
    ctx.fillStyle = playerHornColors ? playerHornColors[0] : '#c084fc';
    ctx.beginPath();
    ctx.moveTo(sx - 2, sy - 39);
    ctx.lineTo(sx, sy - 50);
    ctx.lineTo(sx + 2, sy - 39);
    ctx.closePath();
    ctx.fill();
    // Ear bumps on helmet
    ctx.fillStyle = 'rgba(230, 230, 235, 0.9)';
    ctx.beginPath(); ctx.arc(sx - 8, sy - 35, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(sx + 8, sy - 35, 4, 0, Math.PI * 2); ctx.fill();
    // NASA patch on chest
    ctx.fillStyle = '#1e40af';
    ctx.beginPath();
    ctx.arc(sx + player.facing * 4, sy - 15, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 3px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('N', sx + player.facing * 4, sy - 14);
    ctx.textAlign = 'left';
    // Life support backpack
    ctx.fillStyle = '#d1d5db';
    ctx.fillRect(sx - player.facing * 8, sy - 22, 6, 14);
    ctx.fillStyle = '#9ca3af';
    ctx.fillRect(sx - player.facing * 8 + 1, sy - 20, 4, 3);
    ctx.fillRect(sx - player.facing * 8 + 1, sy - 15, 4, 3);
  }

  // Draw Kit's stroller behind player (all levels except flight/space where player is in a vehicle)
  if (hasStroller && currentLevel !== 10 && currentLevel !== 12 && currentScene === null) {
    drawStroller(player.x - player.facing * 25, player.y, kitFurColor);
  }

  // Draw named parrot on player's shoulder (safari + cape levels)
  if (parrotState === 'named' && (currentLevel === 9 || currentLevel === 11) && currentScene === null) {
    const px = player.x + player.facing * 8;
    const py = player.y - 35 + Math.sin(gameTime / 400) * 1.5;
    // Body
    ctx.fillStyle = '#22c55e';
    ctx.beginPath(); ctx.ellipse(px, py, 4, 5, 0, 0, Math.PI * 2); ctx.fill();
    // Head
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(px, py - 6, 3.5, 0, Math.PI * 2); ctx.fill();
    // Beak
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(px + player.facing * 3, py - 7);
    ctx.lineTo(px + player.facing * 7, py - 5.5);
    ctx.lineTo(px + player.facing * 3, py - 5);
    ctx.closePath(); ctx.fill();
    // Eye
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(px + player.facing * 1, py - 6.5, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(px + player.facing * 1.3, py - 6.5, 0.7, 0, Math.PI * 2); ctx.fill();
    // Tail
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(px - player.facing * 2, py + 3);
    ctx.lineTo(px - player.facing * 6, py + 9);
    ctx.lineTo(px - player.facing * 1, py + 8);
    ctx.closePath(); ctx.fill();
    // Name
    if (parrotName) {
      ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 8px system-ui'; ctx.textAlign = 'center';
      ctx.fillText(parrotName, px, py - 12);
      ctx.textAlign = 'left';
    }
  }

  // Glitter particles from horn
  for (const g of glitterParticles) {
    const alpha = Math.min(1, g.life / 400);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = g.color;
    ctx.beginPath();
    ctx.arc(g.x, g.y, g.size, 0, Math.PI * 2);
    ctx.fill();
  }
  // Dust particles (cheetah ride)
  for (const d of dustParticles) {
    const alpha = Math.min(1, d.life / 300);
    ctx.globalAlpha = alpha * 0.6;
    ctx.fillStyle = d.color;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 12px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(playerName, player.x, player.y - (ridingCheetah ? 53 : 38));

  if (fishing.active) {
    ctx.strokeStyle = '#a3a3a3';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(player.x + player.facing * 10, player.y - 10);
    ctx.lineTo(player.x + player.facing * 30, player.y + 20);
    ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(player.x + player.facing * 30, player.y + 20, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const p of popups) {
    const alpha = Math.min(1, p.life / 500);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.font = 'bold 16px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(p.text, p.x, p.y);
    ctx.globalAlpha = 1;
  }
}

function drawSled(x, y) {
  ctx.save();
  ctx.translate(x, y);
  // Sled runners (two curved rails)
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  // Left runner
  ctx.beginPath();
  ctx.moveTo(-18, 6);
  ctx.quadraticCurveTo(-22, 4, -20, 0);
  ctx.lineTo(16, 0);
  ctx.stroke();
  // Right runner
  ctx.beginPath();
  ctx.moveTo(-18, 10);
  ctx.quadraticCurveTo(-22, 8, -20, 4);
  ctx.lineTo(16, 4);
  ctx.stroke();
  // Sled seat (wooden planks)
  ctx.fillStyle = '#b45309';
  ctx.fillRect(-16, -4, 30, 4);
  ctx.fillStyle = '#92400e';
  ctx.fillRect(-16, -4, 30, 1);
  // Cross braces
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(-10, -4); ctx.lineTo(-10, 4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(0, 4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(10, -4); ctx.lineTo(10, 4); ctx.stroke();
  // Front curl
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-16, -4);
  ctx.quadraticCurveTo(-22, -6, -20, -12);
  ctx.stroke();
  ctx.restore();
}

function drawLevelTransition(W, H) {
  const t = levelTransition.timer / 1500;
  // Rainbow wipe effect
  const colors = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6','#ec4899'];
  const bandH = H / colors.length;
  for (let i = 0; i < colors.length; i++) {
    ctx.fillStyle = colors[i];
    const delay = i * 0.08;
    const progress = Math.max(0, Math.min(1, (t - delay) / 0.5));
    ctx.fillRect(0, i * bandH, W * progress, bandH + 1);
  }
  // Level name text
  if (t > 0.4) {
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 36px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const textAlpha = Math.min(1, (t - 0.4) / 0.3);
    ctx.globalAlpha = textAlpha;
    const lvl = levelTransition.toLevel;
    const name = (LEVEL_NAMES[lvl - 1]) || 'Level ' + lvl;
    ctx.fillText(name, W / 2, H / 2 - 20);
    ctx.font = '20px system-ui';
    ctx.fillText(playerName + ' is on the way!', W / 2, H / 2 + 20);
    ctx.globalAlpha = 1;
    ctx.textBaseline = 'alphabetic';
  }
}

function drawNYCBuildings(cam, W) {
  for (const b of level2.buildings) {
    if (b.x + b.w < cam - 50 || b.x > cam + W + 50) continue;
    const bx = b.x, by = GROUND_Y;

    // Building body
    ctx.fillStyle = b.c;
    ctx.fillRect(bx, by - b.h, b.w, b.h);

    // Spire
    if (b.spire) {
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(bx + b.w / 2 - 4, by - b.h);
      ctx.lineTo(bx + b.w / 2, by - b.h - 30);
      ctx.lineTo(bx + b.w / 2 + 4, by - b.h);
      ctx.fill();
    }

    // Windows
    if (b.windows) {
      const rows = Math.floor((b.h - 20) / 18);
      const cols = Math.floor((b.w - 10) / 16);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const wx = bx + 8 + c * 16;
          const wy = by - b.h + 12 + r * 18;
          // Some windows lit, some dark
          const lit = Math.sin((bx + r * 7 + c * 13) * 0.1 + gameTime / 5000) > 0;
          ctx.fillStyle = lit ? '#fde68a' : 'rgba(0,0,0,0.3)';
          ctx.fillRect(wx, wy, 8, 10);
        }
      }
    }

    // Roof edge
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(bx - 2, by - b.h - 3, b.w + 4, 5);
  }
}

function drawNYCPlatforms() {
  for (const p of level2.platforms) {
    // Fire escape style platforms — metallic
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(p.x + 3, p.y + 3, p.w, 12);

    const pGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + 12);
    pGrad.addColorStop(0, '#94a3b8');
    pGrad.addColorStop(1, '#64748b');
    ctx.fillStyle = pGrad;
    ctx.beginPath();
    ctx.roundRect(p.x, p.y, p.w, 12, 3);
    ctx.fill();

    // Railing
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x, p.y - 16);
    ctx.moveTo(p.x + p.w, p.y);
    ctx.lineTo(p.x + p.w, p.y - 16);
    ctx.moveTo(p.x, p.y - 16);
    ctx.lineTo(p.x + p.w, p.y - 16);
    ctx.stroke();
  }
}

function drawNYCYarnBalls() { drawYarnBallsForLevel(level2.yarnBalls); }

function drawNYCScenes(cam, W) {
  for (const s of level2.scenes) {
    if (s.x < cam - 200 || s.x > cam + W + 200) continue;
    switch (s.type) {
      case 'taxi': drawTaxi(s.x); break;
      case 'hotdog_cart': drawHotdogCart(s.x); break;
      case 'fire_hydrant': drawFireHydrant(s.x); break;
      case 'streetlamp': drawStreetlamp(s.x); break;
      case 'pizza_shop': drawPizzaShop(s.x); break;
      case 'central_park': drawCentralPark(s.x); break;
      case 'statue_liberty': drawStatueLiberty(s.x); break;
      case 'subway': drawSubwayEntrance(s.x); break;
      case 'pigeon_flock': drawPigeons(s.x); break;
      case 'hospital': drawHospital(s.x); break;
      case 'fao_schwarz': drawFaoExterior(s.x); break;
      case 'empire_state': drawEmpireExterior(s.x); break;
      case 'thirty_rock': drawThirtyRockExterior(s.x); break;
      case 'grand_central': drawGrandCentralExterior(s.x); break;
      case 'met_museum': drawMetExterior(s.x); break;
    }
  }
}

function drawFaoExterior(x) {
  const gy = GROUND_Y;
  ctx.fillStyle = '#dc2626'; ctx.fillRect(x - 45, gy - 90, 90, 90);
  ctx.fillStyle = '#fbbf24'; ctx.fillRect(x - 40, gy - 85, 80, 5);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 9px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('FAO SCHWARZ', x, gy - 72);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(x - 30, gy - 60, 20, 30); ctx.fillRect(x + 10, gy - 60, 20, 30);
  ctx.fillStyle = '#92400e'; ctx.fillRect(x - 8, gy - 35, 16, 35);
  ctx.textAlign = 'left';
}

function drawEmpireExterior(x) {
  const gy = GROUND_Y;
  ctx.fillStyle = '#94a3b8'; ctx.fillRect(x - 25, gy - 120, 50, 120);
  ctx.fillStyle = '#78716c'; ctx.fillRect(x - 15, gy - 140, 30, 25);
  ctx.fillRect(x - 5, gy - 155, 10, 18);
  ctx.fillRect(x - 2, gy - 170, 4, 18);
  ctx.fillStyle = '#fef08a';
  for (let wy = gy - 115; wy < gy - 5; wy += 10) {
    for (let wx = x - 20; wx < x + 20; wx += 10) {
      ctx.fillRect(wx, wy, 4, 4);
    }
  }
  ctx.fillStyle = '#fff'; ctx.font = 'bold 7px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('EMPIRE STATE', x, gy - 125);
  ctx.textAlign = 'left';
}

function drawThirtyRockExterior(x) {
  const gy = GROUND_Y;
  ctx.fillStyle = '#475569'; ctx.fillRect(x - 40, gy - 100, 80, 100);
  ctx.fillStyle = '#334155'; ctx.fillRect(x - 35, gy - 95, 70, 5);
  ctx.fillStyle = '#fef08a';
  for (let wy = gy - 85; wy < gy - 5; wy += 12) {
    ctx.fillRect(x - 30, wy, 8, 5); ctx.fillRect(x - 10, wy, 8, 5);
    ctx.fillRect(x + 10, wy, 8, 5); ctx.fillRect(x + 25, wy, 8, 5);
  }
  ctx.fillStyle = '#3b82f6'; ctx.fillRect(x - 15, gy - 30, 30, 30);
  ctx.fillStyle = '#fff'; ctx.font = 'bold 8px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('30 ROCK', x, gy - 98);
  ctx.fillText('NBC', x, gy - 18);
  ctx.textAlign = 'left';
}

function drawGrandCentralExterior(x) {
  const gy = GROUND_Y;
  ctx.fillStyle = '#d6d3d1'; ctx.fillRect(x - 50, gy - 80, 100, 80);
  // Columns
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = '#a8a29e';
    ctx.fillRect(x - 42 + i * 28, gy - 75, 6, 70);
  }
  // Pediment (triangle)
  ctx.fillStyle = '#a8a29e';
  ctx.beginPath(); ctx.moveTo(x - 55, gy - 80); ctx.lineTo(x, gy - 100); ctx.lineTo(x + 55, gy - 80); ctx.closePath(); ctx.fill();
  // Clock
  ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(x, gy - 88, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#92400e'; ctx.fillRect(x - 10, gy - 30, 20, 30);
  ctx.fillStyle = '#fff'; ctx.font = 'bold 7px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('GRAND CENTRAL', x, gy - 72);
  ctx.textAlign = 'left';
}

function drawMetExterior(x) {
  const gy = GROUND_Y;
  ctx.fillStyle = '#e7e5e4'; ctx.fillRect(x - 55, gy - 75, 110, 75);
  // Columns
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = '#d6d3d1';
    ctx.fillRect(x - 48 + i * 24, gy - 70, 5, 65);
  }
  // Steps
  for (let s = 0; s < 3; s++) {
    ctx.fillStyle = '#d6d3d1';
    ctx.fillRect(x - 55 - s * 5, gy - 5 + s * 2, 110 + s * 10, 3);
  }
  // Banner
  ctx.fillStyle = '#dc2626'; ctx.fillRect(x - 30, gy - 68, 60, 12);
  ctx.fillStyle = '#fff'; ctx.font = 'bold 7px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('THE MET', x, gy - 59);
  ctx.textAlign = 'left';
}

function drawTaxi(x) {
  const gy = GROUND_Y;
  // Body
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath(); ctx.roundRect(x - 30, gy - 22, 60, 18, 4); ctx.fill();
  // Roof
  ctx.fillStyle = '#eab308';
  ctx.beginPath(); ctx.roundRect(x - 14, gy - 32, 28, 12, 4); ctx.fill();
  // Windows
  ctx.fillStyle = '#bae6fd';
  ctx.fillRect(x - 12, gy - 30, 10, 8);
  ctx.fillRect(x + 2, gy - 30, 10, 8);
  // Wheels
  ctx.fillStyle = '#1f2937';
  ctx.beginPath(); ctx.arc(x - 18, gy - 4, 6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 18, gy - 4, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#6b7280';
  ctx.beginPath(); ctx.arc(x - 18, gy - 4, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 18, gy - 4, 3, 0, Math.PI * 2); ctx.fill();
  // TAXI sign
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.roundRect(x - 8, gy - 36, 16, 5, 2); ctx.fill();
  ctx.fillStyle = '#1f2937';
  ctx.font = 'bold 4px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('TAXI', x, gy - 32);
}

function drawHotdogCart(x) {
  const gy = GROUND_Y;
  // Cart body
  ctx.fillStyle = '#dc2626';
  ctx.beginPath(); ctx.roundRect(x - 25, gy - 35, 50, 25, 5); ctx.fill();
  // Umbrella
  ctx.fillStyle = '#2563eb';
  ctx.beginPath(); ctx.arc(x, gy - 50, 30, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#fbbf24';
  // Umbrella stripes
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(x, gy - 50, 30, Math.PI + i * 0.5, Math.PI + i * 0.5 + 0.25);
    ctx.lineTo(x, gy - 50);
    ctx.fill();
  }
  // Pole
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(x - 1, gy - 50, 2, 15);
  // Wheels
  ctx.fillStyle = '#1f2937';
  ctx.beginPath(); ctx.arc(x - 18, gy - 4, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 18, gy - 4, 5, 0, Math.PI * 2); ctx.fill();
  // HOT DOGS text
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 6px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('HOT DOGS', x, gy - 20);
}

function drawFireHydrant(x) {
  const gy = GROUND_Y;
  ctx.fillStyle = '#ef4444';
  ctx.beginPath(); ctx.roundRect(x - 6, gy - 22, 12, 22, 3); ctx.fill();
  // Top cap
  ctx.fillRect(x - 8, gy - 24, 16, 4);
  // Side nozzles
  ctx.fillRect(x - 10, gy - 16, 4, 4);
  ctx.fillRect(x + 6, gy - 16, 4, 4);
  // Highlight
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillRect(x - 2, gy - 20, 3, 16);
}

function drawStreetlamp(x) {
  const gy = GROUND_Y;
  // Pole
  ctx.fillStyle = '#374151';
  ctx.fillRect(x - 2, gy - 80, 4, 80);
  // Arm
  ctx.beginPath();
  ctx.moveTo(x, gy - 75);
  ctx.quadraticCurveTo(x + 15, gy - 78, x + 20, gy - 70);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#374151';
  ctx.stroke();
  // Light
  const cycle = (Math.sin(gameTime / DAY_LENGTH * Math.PI * 2 - Math.PI / 2) + 1) / 2;
  if (cycle > 0.4) {
    // Glow
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#fde68a';
    ctx.beginPath(); ctx.arc(x + 20, gy - 66, 30, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = cycle > 0.4 ? '#fde68a' : '#d1d5db';
  ctx.beginPath(); ctx.arc(x + 20, gy - 66, 5, 0, Math.PI * 2); ctx.fill();
}

function drawPizzaShop(x) {
  const gy = GROUND_Y;
  // Storefront
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(x - 40, gy - 55, 80, 55);
  // Window
  ctx.fillStyle = '#fde68a';
  ctx.fillRect(x - 32, gy - 45, 64, 30);
  // Door
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x - 8, gy - 35, 16, 35);
  // Sign
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath(); ctx.roundRect(x - 30, gy - 60, 60, 10, 3); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 7px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('PIZZA', x, gy - 52.5);
  // Pizza slice in window
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.moveTo(x - 10, gy - 25);
  ctx.lineTo(x, gy - 40);
  ctx.lineTo(x + 10, gy - 25);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.moveTo(x - 8, gy - 27);
  ctx.lineTo(x, gy - 38);
  ctx.lineTo(x + 8, gy - 27);
  ctx.closePath();
  ctx.fill();
}

function drawCentralPark(x) {
  const gy = GROUND_Y;
  // Green patch
  ctx.fillStyle = '#4ade80';
  ctx.beginPath();
  ctx.ellipse(x, gy, 80, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  // Trees
  for (let i = -2; i <= 2; i++) {
    const tx = x + i * 30;
    ctx.fillStyle = '#78350f';
    ctx.fillRect(tx - 3, gy - 40, 6, 40);
    ctx.fillStyle = '#16a34a';
    ctx.beginPath(); ctx.arc(tx, gy - 50, 18, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.beginPath(); ctx.arc(tx + 5, gy - 55, 14, 0, Math.PI * 2); ctx.fill();
  }
  // Bench
  ctx.fillStyle = '#92400e';
  ctx.fillRect(x - 15, gy - 12, 30, 3);
  ctx.fillRect(x - 15, gy - 18, 30, 3);
  ctx.fillRect(x - 14, gy - 12, 3, 12);
  ctx.fillRect(x + 11, gy - 12, 3, 12);
  // Sign
  ctx.fillStyle = '#16a34a';
  ctx.beginPath(); ctx.roundRect(x + 50, gy - 25, 30, 12, 2); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = '5px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('CENTRAL', x + 65, gy - 17);
  ctx.fillText('PARK', x + 65, gy - 12);
}

function drawStatueLiberty(x) {
  const gy = GROUND_Y;
  // Pedestal
  ctx.fillStyle = '#9ca3af';
  ctx.fillRect(x - 20, gy - 30, 40, 30);
  ctx.fillRect(x - 25, gy - 5, 50, 5);
  // Body
  ctx.fillStyle = '#86efac';
  ctx.beginPath();
  ctx.moveTo(x - 12, gy - 30);
  ctx.lineTo(x - 8, gy - 80);
  ctx.lineTo(x + 8, gy - 80);
  ctx.lineTo(x + 12, gy - 30);
  ctx.fill();
  // Head
  ctx.beginPath(); ctx.arc(x, gy - 88, 10, 0, Math.PI * 2); ctx.fill();
  // Crown
  ctx.fillStyle = '#86efac';
  for (let i = 0; i < 7; i++) {
    const a = Math.PI + (i / 6) * Math.PI;
    ctx.beginPath();
    ctx.moveTo(x, gy - 88);
    ctx.lineTo(x + Math.cos(a) * 16, gy - 88 + Math.sin(a) * 16);
    ctx.lineTo(x + Math.cos(a) * 14, gy - 88 + Math.sin(a) * 12);
    ctx.fill();
  }
  // Torch arm
  ctx.strokeStyle = '#86efac';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x + 8, gy - 80);
  ctx.lineTo(x + 20, gy - 105);
  ctx.stroke();
  // Torch flame
  ctx.fillStyle = '#fbbf24';
  const flicker = Math.sin(gameTime / 150) * 2;
  ctx.beginPath();
  ctx.moveTo(x + 16, gy - 105);
  ctx.quadraticCurveTo(x + 20, gy - 118 + flicker, x + 24, gy - 105);
  ctx.fill();
  // Tablet
  ctx.fillStyle = '#4ade80';
  ctx.fillRect(x - 10, gy - 65, 8, 14);
}

function drawSubwayEntrance(x) {
  const gy = GROUND_Y;
  // Railing
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(x - 25, gy - 25, 4, 25);
  ctx.fillRect(x + 21, gy - 25, 4, 25);
  ctx.fillRect(x - 25, gy - 25, 50, 4);
  // Steps going down
  ctx.fillStyle = '#6b7280';
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(x - 20 + i * 3, gy - 4 + i * 3, 40 - i * 6, 4);
  }
  // Globe lamp
  ctx.fillStyle = '#22c55e';
  ctx.beginPath(); ctx.arc(x, gy - 30, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#4ade80';
  ctx.beginPath(); ctx.arc(x, gy - 30, 4, 0, Math.PI * 2); ctx.fill();
  // S sign
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 6px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('S', x, gy - 28);
}

function drawPigeons(x) {
  for (let i = 0; i < 5; i++) {
    const px = x + i * 16 - 32 + Math.sin(gameTime / 800 + i * 2) * 5;
    const py = GROUND_Y - 6;
    const facing = Math.sin(gameTime / 1200 + i * 3) > 0 ? 1 : -1;
    ctx.save();
    ctx.translate(px, py);
    ctx.scale(facing, 1);
    // Body
    ctx.fillStyle = '#9ca3af';
    ctx.beginPath(); ctx.ellipse(0, 0, 6, 4, 0, 0, Math.PI * 2); ctx.fill();
    // Head
    ctx.fillStyle = '#6b7280';
    ctx.beginPath(); ctx.arc(5, -3, 3, 0, Math.PI * 2); ctx.fill();
    // Neck shimmer
    ctx.fillStyle = '#818cf8';
    ctx.beginPath(); ctx.arc(4, -1, 2, 0, Math.PI * 2); ctx.fill();
    // Eye
    ctx.fillStyle = '#f97316';
    ctx.beginPath(); ctx.arc(6, -4, 1, 0, Math.PI * 2); ctx.fill();
    // Beak
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(7, -3);
    ctx.lineTo(10, -2.5);
    ctx.lineTo(7, -2);
    ctx.fill();
    // Pecking animation
    if (Math.sin(gameTime / 300 + i * 1.7) > 0.7) {
      ctx.fillStyle = '#9ca3af';
      ctx.beginPath(); ctx.arc(5, -1, 3, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
}

function drawHospital(x) {
  const gy = GROUND_Y;
  // Building
  ctx.fillStyle = '#f0f9ff';
  ctx.fillRect(x - 55, gy - 80, 110, 80);
  // Roof
  ctx.fillStyle = '#bae6fd';
  ctx.fillRect(x - 60, gy - 85, 120, 8);
  // Red cross
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(x - 3, gy - 75, 6, 18);
  ctx.fillRect(x - 9, gy - 69, 18, 6);
  // Windows
  ctx.fillStyle = '#bfdbfe';
  ctx.fillRect(x - 40, gy - 65, 18, 14);
  ctx.fillRect(x + 22, gy - 65, 18, 14);
  ctx.fillRect(x - 40, gy - 42, 18, 14);
  ctx.fillRect(x + 22, gy - 42, 18, 14);
  // Door
  ctx.fillStyle = '#60a5fa';
  ctx.beginPath();
  ctx.roundRect(x - 12, gy - 35, 24, 35, [6, 6, 0, 0]);
  ctx.fill();
  // Door cross
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(x - 1, gy - 28, 2, 10);
  ctx.fillRect(x - 4, gy - 24, 8, 2);
  // Sign
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.roundRect(x - 35, gy - 90, 70, 10, 3);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 7px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('HOSPITAL', x, gy - 82);
  ctx.textAlign = 'left';

  // If Kit was delivered, show a banner
  if (hospitalDelivered) {
    ctx.fillStyle = '#f472b6';
    ctx.font = '6px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Kit was born here!', x, gy - 92);
    ctx.textAlign = 'left';
  }
}

function drawBabyKit(x, y, color) {
  // Tiny body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, 5, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  // Tiny head
  ctx.beginPath();
  ctx.arc(x, y - 5, 4, 0, Math.PI * 2);
  ctx.fill();
  // Big eyes (proportionally larger for baby)
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x - 2, y - 6, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 2, y - 6, 2, 0, Math.PI * 2);
  ctx.fill();
  // Pupils
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath();
  ctx.arc(x - 1.5, y - 5.5, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 2.5, y - 5.5, 1, 0, Math.PI * 2);
  ctx.fill();
  // Tiny nub horn
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.moveTo(x - 1, y - 8);
  ctx.lineTo(x, y - 12);
  ctx.lineTo(x + 1, y - 8);
  ctx.closePath();
  ctx.fill();
  // Tiny ears
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - 3, y - 8);
  ctx.lineTo(x - 2, y - 11);
  ctx.lineTo(x - 1, y - 8);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 1, y - 8);
  ctx.lineTo(x + 2, y - 11);
  ctx.lineTo(x + 3, y - 8);
  ctx.fill();
}

function drawStroller(x, y, kitColor) {
  // Stroller frame
  ctx.strokeStyle = '#6b7280';
  ctx.lineWidth = 2;
  // Handle
  ctx.beginPath();
  ctx.moveTo(x - 12, y - 25);
  ctx.lineTo(x - 15, y - 10);
  ctx.stroke();
  // Basket
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.roundRect(x - 12, y - 12, 20, 12, 3);
  ctx.fill();
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;
  ctx.stroke();
  // Wheels
  ctx.fillStyle = '#1f2937';
  ctx.beginPath();
  ctx.arc(x - 8, y + 2, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 6, y + 2, 3, 0, Math.PI * 2);
  ctx.fill();
  // Baby Kit in stroller
  drawBabyKit(x - 1, y - 10, kitColor);
}

function lerpColor(a, b, t) {
  return a.map((v, i) => Math.round(v + (b[i] - v) * t));
}

function drawStars(W, H) {
  // deterministic stars
  const seed = 42;
  for (let i = 0; i < 60; i++) {
    const sx = ((seed * (i + 1) * 7) % W);
    const sy = ((seed * (i + 1) * 13) % (H * 0.5));
    const twinkle = Math.sin(gameTime / 400 + i) * 0.3 + 0.7;
    ctx.globalAlpha = twinkle * 0.8;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawRainbow(W, H, cam) {
  const colors = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6'];
  const cx = WORLD_W / 2 - cam;
  const cy = H * 0.15;
  const baseR = 280;
  ctx.globalAlpha = 0.35;
  for (let i = 0; i < colors.length; i++) {
    ctx.strokeStyle = colors[i];
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx, cy + 100, baseR - i * 8, Math.PI, 0);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function drawCelestial(W, H, cycle) {
  const angle = cycle * Math.PI;
  const cx = W / 2 + Math.cos(angle + Math.PI) * (W * 0.35);
  const cy = H * 0.15 - Math.sin(angle) * (H * 0.2) + H * 0.15;
  if (cycle < 0.5) {
    // Sun
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(cx, cy, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    ctx.globalAlpha = 0.3;
    ctx.fill();
    ctx.globalAlpha = 1;
  } else {
    // Moon
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(cx, cy, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath();
    ctx.arc(cx + 6, cy - 4, 16, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawHills(W, H, cam) {
  // far hills
  ctx.fillStyle = 'rgba(100, 160, 100, 0.3)';
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 10) {
    const wx = x + cam * 0.2;
    const y = H * 0.6 + Math.sin(wx / 200) * 30 + Math.sin(wx / 80) * 15;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(W, H);
  ctx.fill();

  // near hills
  ctx.fillStyle = 'rgba(80, 140, 80, 0.4)';
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 10) {
    const wx = x + cam * 0.5;
    const y = H * 0.7 + Math.sin(wx / 150) * 20 + Math.sin(wx / 60) * 10;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(W, H);
  ctx.fill();
}

function drawGround(W, H, cam) {
  // Main ground
  ctx.fillStyle = '#4ade80';
  ctx.fillRect(0, GROUND_Y, WORLD_W, H);

  // Grass detail
  ctx.fillStyle = '#22c55e';
  for (let x = 0; x < WORLD_W; x += 20) {
    if (x > POND.x && x < POND.x + POND.w) continue;
    ctx.fillRect(x, GROUND_Y - 2, 3, 6);
    ctx.fillRect(x + 8, GROUND_Y - 1, 2, 4);
  }

  // Dirt layer
  ctx.fillStyle = '#92400e';
  ctx.fillRect(0, GROUND_Y + 40, WORLD_W, 200);
}

function drawPond() {
  // Water
  const waterGrad = ctx.createLinearGradient(POND.x, GROUND_Y, POND.x, GROUND_Y + POND.depth);
  waterGrad.addColorStop(0, 'rgba(56, 189, 248, 0.6)');
  waterGrad.addColorStop(1, 'rgba(14, 116, 144, 0.8)');
  ctx.fillStyle = waterGrad;

  // Pond shape (rounded)
  ctx.beginPath();
  ctx.moveTo(POND.x, GROUND_Y);
  ctx.quadraticCurveTo(POND.x - 10, GROUND_Y + POND.depth / 2, POND.x + 20, GROUND_Y + POND.depth);
  ctx.lineTo(POND.x + POND.w - 20, GROUND_Y + POND.depth);
  ctx.quadraticCurveTo(POND.x + POND.w + 10, GROUND_Y + POND.depth / 2, POND.x + POND.w, GROUND_Y);
  ctx.fill();

  // Water shimmer
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const sx = POND.x + 40 + i * 70;
    const sy = GROUND_Y + 15 + Math.sin(gameTime / 500 + i) * 5;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + 20, sy);
    ctx.stroke();
  }
}

function drawFish(f) {
  ctx.save();
  ctx.translate(f.x, f.y);
  const dir = f.vx >= 0 ? 1 : -1;
  ctx.scale(dir, 1);

  // Body
  ctx.fillStyle = f.color;
  ctx.beginPath();
  ctx.ellipse(0, 0, f.size, f.size * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tail
  ctx.beginPath();
  ctx.moveTo(-f.size, 0);
  ctx.lineTo(-f.size - 8, -6);
  ctx.lineTo(-f.size - 8, 6);
  ctx.closePath();
  ctx.fill();

  // Eye (big googly)
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(f.size * 0.4, -2, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(f.size * 0.5, -2, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Smile
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(f.size * 0.3, 3, 3, 0, Math.PI);
  ctx.stroke();

  ctx.restore();
}

function drawGrill() {
  const gx = GRILL.x, gy = GROUND_Y;

  // Legs
  ctx.fillStyle = '#404040';
  ctx.fillRect(gx - 20, gy - 30, 4, 30);
  ctx.fillRect(gx + 16, gy - 30, 4, 30);

  // Grill body
  ctx.fillStyle = '#525252';
  ctx.fillRect(gx - 25, gy - 40, 50, 12);

  // Grill grates
  ctx.strokeStyle = '#737373';
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(gx - 22 + i * 11, gy - 40);
    ctx.lineTo(gx - 22 + i * 11, gy - 28);
    ctx.stroke();
  }

  // Bacon on grill if cooking
  if (cooking.active) {
    const cookPct = cooking.progress / 3000;
    const r = Math.round(255 - cookPct * 100);
    const g = Math.round(180 - cookPct * 120);
    const b = Math.round(180 - cookPct * 160);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(gx - 15 + i * 12, gy - 38, 8, 3);
      // wavy bacon
      ctx.fillRect(gx - 14 + i * 12, gy - 35, 8, 3);
    }

    // Smoke
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = '#d4d4d4';
    for (let i = 0; i < 3; i++) {
      const smokeY = gy - 50 - Math.sin(gameTime / 300 + i) * 10 - i * 12;
      const smokeX = gx - 5 + Math.sin(gameTime / 500 + i * 2) * 8;
      ctx.beginPath();
      ctx.arc(smokeX, smokeY, 5 + i * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}

function drawBgScenes(cam, W) {
  for (const s of bgScenes) {
    // Skip if offscreen
    if (s.x < cam - 200 || s.x > cam + W + 200) continue;
    switch (s.type) {
      case 'rv': drawRV(s.x, s.color); break;
      case 'cactus': drawCactus(s.x, s.size); break;
      case 'mushroom': drawMushrooms(s.x, s.count); break;
      case 'flowers': drawFlowerGarden(s.x); break;
      case 'campfire': drawCampfire(s.x); break;
      case 'windmill': drawWindmill(s.x); break;
      case 'crystals': drawCrystals(s.x); break;
      case 'beehive': drawBeehive(s.x); break;
      case 'waterfall': drawWaterfall(s.x); break;
      case 'bridge': drawRainbowBridge(s.x); break;
    }
  }
}

function drawRV(x, color) {
  const gy = GROUND_Y;
  // Wheels
  ctx.fillStyle = '#1f2937';
  ctx.beginPath(); ctx.arc(x - 25, gy - 4, 8, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 25, gy - 4, 8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#6b7280';
  ctx.beginPath(); ctx.arc(x - 25, gy - 4, 4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 25, gy - 4, 4, 0, Math.PI * 2); ctx.fill();
  // Body
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.roundRect(x - 40, gy - 50, 80, 42, 6); ctx.fill();
  // Roof
  ctx.fillStyle = '#fff';
  ctx.fillRect(x - 38, gy - 54, 76, 6);
  // Window
  ctx.fillStyle = '#bae6fd';
  ctx.fillRect(x - 28, gy - 44, 20, 16);
  ctx.fillRect(x + 8, gy - 44, 20, 16);
  // Door
  ctx.fillStyle = '#fff';
  ctx.fillRect(x - 4, gy - 40, 12, 28);
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath(); ctx.arc(x + 5, gy - 26, 2, 0, Math.PI * 2); ctx.fill();
  // Awning stripe
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(x - 38, gy - 50, 76, 4);
}

function drawCactus(x, size) {
  const gy = GROUND_Y;
  const h = 50 * size;
  ctx.fillStyle = '#22c55e';
  // Main trunk
  ctx.beginPath(); ctx.roundRect(x - 6 * size, gy - h, 12 * size, h, 5); ctx.fill();
  // Left arm
  ctx.beginPath(); ctx.roundRect(x - 20 * size, gy - h * 0.7, 14 * size, 8 * size, 4); ctx.fill();
  ctx.beginPath(); ctx.roundRect(x - 20 * size, gy - h * 0.7 - 18 * size, 8 * size, 20 * size, 4); ctx.fill();
  // Right arm
  ctx.beginPath(); ctx.roundRect(x + 6 * size, gy - h * 0.5, 14 * size, 8 * size, 4); ctx.fill();
  ctx.beginPath(); ctx.roundRect(x + 14 * size, gy - h * 0.5 - 14 * size, 8 * size, 16 * size, 4); ctx.fill();
  // Highlights
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fillRect(x - 2 * size, gy - h + 5, 3 * size, h - 10);
  // Flower on top
  ctx.fillStyle = '#f472b6';
  ctx.beginPath(); ctx.arc(x, gy - h - 4, 4 * size, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath(); ctx.arc(x, gy - h - 4, 2 * size, 0, Math.PI * 2); ctx.fill();
}

function drawMushrooms(x, count) {
  const gy = GROUND_Y;
  const colors = ['#ef4444','#f472b6','#a78bfa','#fbbf24'];
  for (let i = 0; i < count; i++) {
    const mx = x + i * 28 - 40;
    const mh = 14 + (i % 3) * 6;
    const mc = colors[i % 4];
    // Stem
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(mx - 3, gy - mh, 6, mh);
    // Cap
    ctx.fillStyle = mc;
    ctx.beginPath(); ctx.arc(mx, gy - mh, 12, Math.PI, 0); ctx.fill();
    // Spots
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(mx - 4, gy - mh - 4, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(mx + 5, gy - mh - 2, 2, 0, Math.PI * 2); ctx.fill();
  }
}

function drawFlowerGarden(x) {
  const gy = GROUND_Y;
  const flowerColors = ['#f43f5e','#fbbf24','#a78bfa','#38bdf8','#4ade80','#f472b6'];
  for (let i = 0; i < 8; i++) {
    const fx = x + i * 18 - 60;
    const fh = 12 + Math.sin(i * 1.7) * 5;
    // Stem
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(fx, gy); ctx.lineTo(fx, gy - fh); ctx.stroke();
    // Leaf
    if (i % 2 === 0) {
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.ellipse(fx + 4, gy - fh / 2, 4, 2, 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    // Petals
    const fc = flowerColors[i % flowerColors.length];
    ctx.fillStyle = fc;
    for (let p = 0; p < 5; p++) {
      const a = (p / 5) * Math.PI * 2 + gameTime / 2000;
      ctx.beginPath();
      ctx.arc(fx + Math.cos(a) * 4, gy - fh + Math.sin(a) * 4, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    // Center
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath(); ctx.arc(fx, gy - fh, 2.5, 0, Math.PI * 2); ctx.fill();
  }
}

function drawCampfire(x) {
  const gy = GROUND_Y;
  // Log seats
  ctx.fillStyle = '#78350f';
  ctx.beginPath(); ctx.roundRect(x - 50, gy - 14, 30, 12, 4); ctx.fill();
  ctx.beginPath(); ctx.roundRect(x + 20, gy - 14, 30, 12, 4); ctx.fill();
  // Log rings
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.ellipse(x - 50, gy - 8, 4, 6, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(x + 50, gy - 8, 4, 6, 0, 0, Math.PI * 2); ctx.stroke();
  // Fire pit stones
  ctx.fillStyle = '#6b7280';
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * 12, gy - 4 + Math.sin(a) * 5, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  // Fire
  const flicker = Math.sin(gameTime / 100) * 3;
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.moveTo(x - 8, gy - 4);
  ctx.quadraticCurveTo(x - 4, gy - 30 + flicker, x, gy - 4);
  ctx.fill();
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.moveTo(x - 4, gy - 4);
  ctx.quadraticCurveTo(x + 2, gy - 22 - flicker, x + 5, gy - 4);
  ctx.fill();
  ctx.fillStyle = '#fde68a';
  ctx.beginPath();
  ctx.moveTo(x - 2, gy - 4);
  ctx.quadraticCurveTo(x, gy - 14 + flicker * 0.5, x + 3, gy - 4);
  ctx.fill();
  // Sparks
  ctx.fillStyle = '#fbbf24';
  for (let i = 0; i < 3; i++) {
    const sy = gy - 30 - Math.sin(gameTime / 200 + i * 2) * 12;
    const sx = x - 3 + Math.cos(gameTime / 300 + i * 3) * 8;
    ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.arc(sx, sy, 1.5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawWindmill(x) {
  const gy = GROUND_Y;
  // Tower
  ctx.fillStyle = '#e5e7eb';
  ctx.beginPath();
  ctx.moveTo(x - 15, gy);
  ctx.lineTo(x - 8, gy - 80);
  ctx.lineTo(x + 8, gy - 80);
  ctx.lineTo(x + 15, gy);
  ctx.fill();
  ctx.strokeStyle = '#d1d5db';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x - 12, gy - 25); ctx.lineTo(x + 12, gy - 25); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 10, gy - 50); ctx.lineTo(x + 10, gy - 50); ctx.stroke();
  // Door
  ctx.fillStyle = '#78350f';
  ctx.beginPath(); ctx.arc(x, gy - 8, 6, Math.PI, 0); ctx.fill();
  ctx.fillRect(x - 6, gy - 8, 12, 8);
  // Blades
  const angle = gameTime / 1500;
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 3;
  for (let i = 0; i < 4; i++) {
    const a = angle + (i / 4) * Math.PI * 2;
    const bx = Math.cos(a) * 35;
    const by = Math.sin(a) * 35;
    ctx.beginPath();
    ctx.moveTo(x, gy - 80);
    ctx.lineTo(x + bx, gy - 80 + by);
    ctx.stroke();
    // Blade surface
    ctx.fillStyle = 'rgba(210,180,140,0.5)';
    ctx.beginPath();
    ctx.moveTo(x, gy - 80);
    ctx.lineTo(x + bx, gy - 80 + by);
    ctx.lineTo(x + bx + Math.cos(a + 0.3) * 5, gy - 80 + by + Math.sin(a + 0.3) * 5);
    ctx.fill();
  }
  // Hub
  ctx.fillStyle = '#78350f';
  ctx.beginPath(); ctx.arc(x, gy - 80, 4, 0, Math.PI * 2); ctx.fill();
}

function drawCrystals(x) {
  const gy = GROUND_Y;
  const crystalData = [
    { dx: -20, h: 35, w: 8, c: '#a78bfa' },
    { dx: -8, h: 50, w: 10, c: '#c084fc' },
    { dx: 6, h: 40, w: 9, c: '#818cf8' },
    { dx: 18, h: 28, w: 7, c: '#e879f9' },
    { dx: -14, h: 22, w: 6, c: '#c4b5fd' },
  ];
  for (const cr of crystalData) {
    const shimmer = Math.sin(gameTime / 600 + cr.dx) * 0.15 + 0.85;
    ctx.globalAlpha = shimmer;
    ctx.fillStyle = cr.c;
    ctx.beginPath();
    ctx.moveTo(x + cr.dx, gy);
    ctx.lineTo(x + cr.dx - cr.w / 2, gy - cr.h * 0.3);
    ctx.lineTo(x + cr.dx, gy - cr.h);
    ctx.lineTo(x + cr.dx + cr.w / 2, gy - cr.h * 0.3);
    ctx.closePath();
    ctx.fill();
    // Highlight edge
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.moveTo(x + cr.dx, gy - cr.h);
    ctx.lineTo(x + cr.dx + cr.w / 2, gy - cr.h * 0.3);
    ctx.lineTo(x + cr.dx + 1, gy - cr.h * 0.5);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  // Sparkle particles
  ctx.fillStyle = '#fff';
  for (let i = 0; i < 4; i++) {
    const sy = gy - 20 - Math.sin(gameTime / 400 + i * 1.5) * 20;
    const sx = x - 15 + Math.cos(gameTime / 500 + i * 2) * 25;
    ctx.globalAlpha = Math.sin(gameTime / 300 + i) * 0.4 + 0.3;
    ctx.beginPath(); ctx.arc(sx, sy, 1.5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawBeehive(x) {
  const gy = GROUND_Y;
  // Tree trunk
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x - 8, gy - 90, 16, 90);
  // Bark lines
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(x - 4, gy - 20 - i * 18);
    ctx.lineTo(x - 2, gy - 14 - i * 18);
    ctx.stroke();
  }
  // Foliage
  ctx.fillStyle = '#16a34a';
  ctx.beginPath(); ctx.arc(x, gy - 100, 28, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x - 18, gy - 88, 20, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 18, gy - 88, 20, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#22c55e';
  ctx.beginPath(); ctx.arc(x + 8, gy - 108, 18, 0, Math.PI * 2); ctx.fill();
  // Beehive
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath(); ctx.arc(x + 20, gy - 70, 12, 0, Math.PI * 2); ctx.fill();
  // Hive stripes
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 1.5;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(x + 10, gy - 70 + i * 4);
    ctx.lineTo(x + 30, gy - 70 + i * 4);
    ctx.stroke();
  }
  // Hole
  ctx.fillStyle = '#92400e';
  ctx.beginPath(); ctx.arc(x + 20, gy - 66, 3, 0, Math.PI * 2); ctx.fill();
  // Bees
  for (let i = 0; i < 3; i++) {
    const ba = gameTime / 400 + i * 2.1;
    const bx = x + 20 + Math.cos(ba) * (18 + i * 5);
    const by = gy - 70 + Math.sin(ba) * (12 + i * 4);
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath(); ctx.ellipse(bx, by, 3, 2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(bx - 1, by - 2, 1, 4);
    // Wings
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath(); ctx.ellipse(bx - 2, by - 3, 2, 1, -0.3, 0, Math.PI * 2); ctx.fill();
  }
}

function drawWaterfall(x) {
  const gy = GROUND_Y;
  // Cliff rocks
  ctx.fillStyle = '#6b7280';
  ctx.beginPath();
  ctx.moveTo(x - 30, gy);
  ctx.lineTo(x - 25, gy - 70);
  ctx.lineTo(x - 10, gy - 80);
  ctx.lineTo(x + 10, gy - 80);
  ctx.lineTo(x + 25, gy - 70);
  ctx.lineTo(x + 30, gy);
  ctx.fill();
  // Rock detail
  ctx.fillStyle = '#4b5563';
  ctx.beginPath();
  ctx.moveTo(x - 20, gy - 30);
  ctx.lineTo(x - 10, gy - 50);
  ctx.lineTo(x, gy - 30);
  ctx.fill();
  // Water stream
  ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
  ctx.fillRect(x - 6, gy - 75, 12, 75);
  // Animated water lines
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 5; i++) {
    const wy = ((gameTime / 8 + i * 15) % 75);
    ctx.beginPath();
    ctx.moveTo(x - 4, gy - 75 + wy);
    ctx.lineTo(x + 4, gy - 75 + wy);
    ctx.stroke();
  }
  // Splash at bottom
  ctx.fillStyle = 'rgba(186, 230, 253, 0.5)';
  const splash = Math.sin(gameTime / 200) * 3;
  ctx.beginPath(); ctx.arc(x - 8, gy - 2, 6 + splash, Math.PI, 0); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 8, gy - 2, 5 - splash, Math.PI, 0); ctx.fill();
  // Mist
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = '#bae6fd';
  ctx.beginPath(); ctx.arc(x, gy - 8, 20, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;
}

function drawRainbowBridge(x) {
  const gy = GROUND_Y;
  const colors = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6'];
  // Bridge arc
  for (let i = 0; i < colors.length; i++) {
    ctx.strokeStyle = colors[i];
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(x, gy, 50 + i * 6, Math.PI, 0);
    ctx.stroke();
  }
  // Pillars
  ctx.fillStyle = '#d1d5db';
  ctx.fillRect(x - 52, gy - 30, 8, 30);
  ctx.fillRect(x + 44, gy - 30, 8, 30);
  // Sparkles on bridge
  ctx.fillStyle = '#fff';
  for (let i = 0; i < 6; i++) {
    const a = Math.PI + (i / 5) * Math.PI * -1;
    const r = 65 + Math.sin(gameTime / 300 + i) * 5;
    ctx.globalAlpha = Math.sin(gameTime / 250 + i * 1.2) * 0.4 + 0.4;
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * r, gy + Math.sin(a) * r, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawPlatforms() {
  drawPlatformsWithStyle(platforms, '#a78bfa', '#7c3aed', function(p) {
    // Grass tufts on top
    ctx.fillStyle = '#4ade80';
    for (let gx = p.x + 8; gx < p.x + p.w - 8; gx += 12) {
      ctx.beginPath();
      ctx.moveTo(gx - 3, p.y);
      ctx.lineTo(gx, p.y - 5);
      ctx.lineTo(gx + 3, p.y);
      ctx.fill();
    }
    // Sparkle dots
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath(); ctx.arc(p.x + 10, p.y + 6, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(p.x + p.w - 10, p.y + 6, 1.5, 0, Math.PI * 2); ctx.fill();
  });
}

function drawYarnBalls() { drawYarnBallsForLevel(yarnBalls); }

function drawHouse() {
  const hx = HOUSE.x, hy = GROUND_Y, hw = HOUSE.w, hh = HOUSE.h;

  // Wall
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(hx, hy - hh, hw, hh);

  // Roof
  ctx.fillStyle = '#a855f7';
  ctx.beginPath();
  ctx.moveTo(hx - 15, hy - hh);
  ctx.lineTo(hx + hw / 2, hy - hh - 60);
  ctx.lineTo(hx + hw + 15, hy - hh);
  ctx.closePath();
  ctx.fill();

  // Roof edge
  ctx.strokeStyle = '#7c3aed';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Door
  ctx.fillStyle = '#92400e';
  ctx.fillRect(hx + hw / 2 - 15, hy - 50, 30, 50);
  // Doorknob
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(hx + hw / 2 + 8, hy - 25, 3, 0, Math.PI * 2);
  ctx.fill();

  // Windows
  ctx.fillStyle = '#bae6fd';
  ctx.fillRect(hx + 15, hy - hh + 30, 30, 30);
  ctx.fillRect(hx + hw - 45, hy - hh + 30, 30, 30);
  // Window frames
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.strokeRect(hx + 15, hy - hh + 30, 30, 30);
  ctx.strokeRect(hx + hw - 45, hy - hh + 30, 30, 30);
  // Cross
  ctx.beginPath();
  ctx.moveTo(hx + 30, hy - hh + 30); ctx.lineTo(hx + 30, hy - hh + 60);
  ctx.moveTo(hx + 15, hy - hh + 45); ctx.lineTo(hx + 45, hy - hh + 45);
  ctx.stroke();

  // Flower boxes
  ctx.fillStyle = '#f472b6';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(hx + 18 + i * 7, hy - hh + 28, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawRomeSky(W, H, cycle, isNight) {
  const dayTop = [150, 180, 230]; const nightTop = [15, 18, 35];
  const dayBot = [255, 230, 200]; const nightBot = [30, 25, 45];
  const skyTop = lerpColor(dayTop, nightTop, cycle);
  const skyBot = lerpColor(dayBot, nightBot, cycle);
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, `rgb(${skyTop})`); grad.addColorStop(1, `rgb(${skyBot})`);
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  if (isNight) drawStars(W, H, cycle);
  drawCelestial(W, H, cycle);
}

function drawRomeWorld(W, H, cam) {
  const ww = getCurrentWorldW();
  ctx.fillStyle = '#a8a29e'; ctx.fillRect(0, GROUND_Y, ww, H);
  ctx.strokeStyle = '#78716c'; ctx.lineWidth = 0.5;
  for (let rx = Math.max(0, Math.floor((cam - 20) / 24) * 24); rx < Math.min(ww, cam + W + 20); rx += 24) {
    for (let ry = 0; ry < 3; ry++) {
      const offset = ry % 2 === 0 ? 0 : 12;
      ctx.beginPath(); ctx.roundRect(rx + offset, GROUND_Y + 4 + ry * 10, 20, 8, 2); ctx.stroke();
    }
  }
  drawRomeScenes(cam, W); drawRomePlatforms(); drawRomeYarnBalls();
  for (const npc of romeNpcs) drawKitty(npc.x, npc.y, npc.color, npc.facing, npc.walkFrame, npc.accessory);
  drawPlayerAndUI();
}

function drawRomePlatforms() {
  drawPlatformsWithStyle(level3.platforms, '#d6d3d1', '#a8a29e', function(p) {
    ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(p.x + 5, p.y + 7); ctx.lineTo(p.x + p.w - 5, p.y + 7); ctx.stroke();
  });
}

function drawRomeYarnBalls() { drawYarnBallsForLevel(level3.yarnBalls); }

function drawRomeScenes(cam, W) {
  for (const s of level3.scenes) {
    if (s.x < cam - 250 || s.x > cam + W + 250) continue;
    switch (s.type) {
      case 'colosseum': drawColosseum(s.x); break;
      case 'fountain': drawFountain(s.x); break;
      case 'roman_column': drawRomanColumn(s.x); break;
      case 'gelato_cart': drawGelatoCart(s.x); break;
      case 'vespa': drawVespa(s.x); break;
      case 'olive_tree': drawOliveTree(s.x); break;
      case 'pantheon': drawPantheon(s.x); break;
      case 'pasta_shop': drawPastaShop(s.x); break;
      case 'leaning_tower': drawLeaningTower(s.x); break;
      case 'piazza': drawPiazza(s.x); break;
      case 'fiat': drawFiat(s.x); break;
    }
  }
}

function drawColosseum(x) {
  const gy = GROUND_Y;
  ctx.fillStyle = '#d6d3d1';
  ctx.beginPath(); ctx.ellipse(x, gy - 50, 80, 60, 0, Math.PI, 0); ctx.fill();
  ctx.fillRect(x - 80, gy - 50, 160, 50);
  ctx.fillStyle = '#78716c';
  for (let tier = 0; tier < 3; tier++) {
    const ty = gy - 85 + tier * 22;
    const numArches = 8 - tier;
    const archW = 140 / numArches;
    for (let i = 0; i < numArches; i++) {
      const ax = x - 70 + i * archW + archW / 2;
      ctx.beginPath(); ctx.arc(ax, ty + 8, archW / 2 - 2, Math.PI, 0); ctx.fill();
    }
  }
  ctx.fillStyle = '#d6d3d1';
  for (let i = 0; i < 8; i++) {
    const bh = Math.sin(i * 1.3) * 8 + 5;
    ctx.fillRect(x - 75 + i * 20, gy - 110 - bh, 15, bh);
  }
}

function drawFountain(x) {
  const gy = GROUND_Y;
  ctx.fillStyle = '#d6d3d1';
  ctx.beginPath(); ctx.ellipse(x, gy - 8, 40, 12, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath(); ctx.ellipse(x, gy - 10, 35, 9, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#d6d3d1'; ctx.fillRect(x - 4, gy - 45, 8, 35);
  ctx.beginPath(); ctx.ellipse(x, gy - 45, 15, 6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2;
  const jt = Math.sin(gameTime / 200) * 3;
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath(); ctx.moveTo(x + i * 8, gy - 45);
    ctx.quadraticCurveTo(x + i * 15, gy - 60 + jt, x + i * 20, gy - 15); ctx.stroke();
  }
  ctx.fillStyle = '#fff';
  for (let i = 0; i < 4; i++) {
    ctx.globalAlpha = Math.sin(gameTime / 200 + i) * 0.3 + 0.3;
    ctx.beginPath(); ctx.arc(x - 10 + Math.cos(gameTime / 300 + i * 1.5) * 20, gy - 30 + Math.sin(gameTime / 250 + i * 2) * 15, 1.5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawRomanColumn(x) {
  const gy = GROUND_Y;
  ctx.fillStyle = '#d6d3d1';
  ctx.fillRect(x - 10, gy - 8, 20, 8); ctx.fillRect(x - 6, gy - 70, 12, 62); ctx.fillRect(x - 10, gy - 74, 20, 6);
  ctx.strokeStyle = 'rgba(0,0,0,0.1)'; ctx.lineWidth = 1;
  for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(x + i * 2, gy - 8); ctx.lineTo(x + i * 2, gy - 70); ctx.stroke(); }
}

function drawGelatoCart(x) {
  const gy = GROUND_Y;
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(x - 25, gy - 35, 50, 28, 5); ctx.fill();
  ctx.fillStyle = '#16a34a'; ctx.beginPath(); ctx.arc(x, gy - 50, 28, Math.PI, Math.PI + Math.PI / 3); ctx.lineTo(x, gy - 50); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, gy - 50, 28, Math.PI + Math.PI / 3, Math.PI + 2 * Math.PI / 3); ctx.lineTo(x, gy - 50); ctx.fill();
  ctx.fillStyle = '#dc2626'; ctx.beginPath(); ctx.arc(x, gy - 50, 28, Math.PI + 2 * Math.PI / 3, 0); ctx.lineTo(x, gy - 50); ctx.fill();
  ctx.fillStyle = '#94a3b8'; ctx.fillRect(x - 1, gy - 50, 2, 15);
  const gc = ['#fda4af','#86efac','#fde68a','#c4b5fd'];
  for (let i = 0; i < 4; i++) { ctx.fillStyle = gc[i]; ctx.beginPath(); ctx.arc(x - 15 + i * 10, gy - 25, 5, Math.PI, 0); ctx.fill(); }
  ctx.fillStyle = '#1f2937';
  ctx.beginPath(); ctx.arc(x - 18, gy - 4, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 18, gy - 4, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#78350f'; ctx.font = 'bold 5px system-ui'; ctx.textAlign = 'center'; ctx.fillText('GELATO', x, gy - 12);
}

function drawVespa(x) {
  const gy = GROUND_Y;
  ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.roundRect(x - 18, gy - 22, 36, 16, 6); ctx.fill();
  ctx.fillStyle = '#78350f'; ctx.beginPath(); ctx.roundRect(x - 8, gy - 26, 20, 6, 3); ctx.fill();
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x - 14, gy - 22); ctx.lineTo(x - 18, gy - 30); ctx.stroke();
  ctx.fillStyle = '#1f2937';
  ctx.beginPath(); ctx.arc(x - 14, gy - 4, 6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 14, gy - 4, 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fde68a'; ctx.beginPath(); ctx.arc(x - 18, gy - 16, 3, 0, Math.PI * 2); ctx.fill();
}

function drawOliveTree(x) {
  const gy = GROUND_Y;
  ctx.fillStyle = '#78350f';
  ctx.beginPath(); ctx.moveTo(x - 5, gy); ctx.quadraticCurveTo(x - 8, gy - 25, x - 3, gy - 45);
  ctx.lineTo(x + 3, gy - 45); ctx.quadraticCurveTo(x + 8, gy - 25, x + 5, gy); ctx.fill();
  ctx.fillStyle = '#6b8e6b';
  ctx.beginPath(); ctx.arc(x, gy - 55, 22, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x - 14, gy - 48, 16, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 14, gy - 48, 16, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#365314';
  for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(x - 12 + i * 6, gy - 42 + Math.cos(i * 1.7) * 8, 2.5, 0, Math.PI * 2); ctx.fill(); }
}

function drawPantheon(x) {
  const gy = GROUND_Y;
  for (let i = 0; i < 6; i++) {
    const cx2 = x - 50 + i * 20;
    ctx.fillStyle = '#d6d3d1'; ctx.fillRect(cx2 - 3, gy - 80, 6, 80); ctx.fillRect(cx2 - 5, gy - 82, 10, 4);
  }
  ctx.fillStyle = '#d6d3d1';
  ctx.beginPath(); ctx.moveTo(x - 55, gy - 82); ctx.lineTo(x, gy - 105); ctx.lineTo(x + 55, gy - 82); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#a8a29e'; ctx.beginPath(); ctx.arc(x, gy - 60, 50, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#78716c'; ctx.font = 'bold 5px system-ui'; ctx.textAlign = 'center'; ctx.fillText('PANTHEON', x, gy - 90);
}

function drawPastaShop(x) {
  const gy = GROUND_Y;
  ctx.fillStyle = '#fef3c7'; ctx.fillRect(x - 35, gy - 50, 70, 50);
  ctx.fillStyle = '#16a34a'; ctx.fillRect(x - 38, gy - 50, 76, 8);
  for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(x - 30 + i * 12, gy - 42, 6, 0, Math.PI); ctx.fill(); }
  ctx.fillStyle = '#fde68a'; ctx.fillRect(x - 25, gy - 38, 50, 20);
  ctx.fillStyle = '#78350f'; ctx.beginPath(); ctx.roundRect(x - 8, gy - 30, 16, 30, [4, 4, 0, 0]); ctx.fill();
  ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.5;
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x - 20 + i * 12, gy - 36); ctx.lineTo(x - 20 + i * 12, gy - 22); ctx.stroke(); }
  ctx.fillStyle = '#dc2626'; ctx.font = 'bold 6px system-ui'; ctx.textAlign = 'center'; ctx.fillText('PASTA', x, gy - 52);
}

function drawPiazza(x) {
  const gy = GROUND_Y;
  ctx.fillStyle = '#e7e5e4'; ctx.beginPath(); ctx.ellipse(x, gy, 70, 8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#a8a29e';
  ctx.beginPath(); ctx.moveTo(x - 4, gy); ctx.lineTo(x - 3, gy - 50); ctx.lineTo(x, gy - 60);
  ctx.lineTo(x + 3, gy - 50); ctx.lineTo(x + 4, gy); ctx.fill();
  ctx.fillStyle = '#78350f'; ctx.fillRect(x - 50, gy - 10, 20, 4); ctx.fillRect(x + 30, gy - 10, 20, 4);
  for (let i = 0; i < 4; i++) {
    const px = x - 30 + i * 20 + Math.sin(gameTime / 600 + i * 2) * 8;
    ctx.fillStyle = '#9ca3af'; ctx.beginPath(); ctx.ellipse(px, gy - 4, 4, 3, 0, 0, Math.PI * 2); ctx.fill();
  }
}

function drawLeaningTower(x) {
  const gy = GROUND_Y;
  ctx.save();
  ctx.translate(x, gy);
  ctx.rotate(-0.08); // the lean!
  // Tower body (8 tiers)
  ctx.fillStyle = '#e7e5e4';
  for (let i = 0; i < 8; i++) {
    const tw = 30 - i * 1.5;
    const ty = -i * 15 - 10;
    ctx.fillRect(-tw / 2, ty - 15, tw, 15);
    // Columns on each tier
    ctx.fillStyle = '#d6d3d1';
    for (let c = 0; c < 4; c++) {
      const cx2 = -tw / 2 + 3 + c * ((tw - 6) / 3);
      ctx.fillRect(cx2, ty - 13, 2, 11);
    }
    // Arches
    ctx.fillStyle = '#a8a29e';
    for (let c = 0; c < 3; c++) {
      const ax = -tw / 2 + 5 + c * ((tw - 10) / 2);
      ctx.beginPath();
      ctx.arc(ax + 3, ty - 8, 3, Math.PI, 0);
      ctx.fill();
    }
    ctx.fillStyle = '#e7e5e4';
  }
  // Top dome
  ctx.fillStyle = '#d6d3d1';
  ctx.beginPath();
  ctx.arc(0, -130, 8, Math.PI, 0);
  ctx.fill();
  ctx.restore();
}


// ── Fiat (Rome portal to Hawaii) ──
function drawFiat(x) {
  const gy = GROUND_Y;
  // Body
  ctx.fillStyle = '#22d3ee';
  ctx.beginPath(); ctx.roundRect(x - 22, gy - 24, 44, 18, 6); ctx.fill();
  // Roof
  ctx.fillStyle = '#06b6d4';
  ctx.beginPath(); ctx.roundRect(x - 12, gy - 34, 28, 12, [6, 6, 0, 0]); ctx.fill();
  // Windshield
  ctx.fillStyle = '#bae6fd';
  ctx.beginPath(); ctx.roundRect(x - 9, gy - 32, 10, 8, 2); ctx.fill();
  ctx.beginPath(); ctx.roundRect(x + 2, gy - 32, 10, 8, 2); ctx.fill();
  // Wheels
  ctx.fillStyle = '#1f2937';
  ctx.beginPath(); ctx.arc(x - 14, gy - 4, 6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 14, gy - 4, 6, 0, Math.PI * 2); ctx.fill();
  // Hubcaps
  ctx.fillStyle = '#9ca3af';
  ctx.beginPath(); ctx.arc(x - 14, gy - 4, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 14, gy - 4, 3, 0, Math.PI * 2); ctx.fill();
  // Headlights
  ctx.fillStyle = '#fde68a';
  ctx.beginPath(); ctx.arc(x + 22, gy - 18, 3, 0, Math.PI * 2); ctx.fill();
  // FIAT label
  ctx.fillStyle = '#1f2937'; ctx.font = 'bold 5px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('FIAT', x, gy - 36);
  // Arrow glow (portal indicator)
  ctx.globalAlpha = 0.5 + Math.sin(gameTime / 300) * 0.3;
  ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 10px system-ui';
  ctx.fillText('>>>', x + 32, gy - 20);
  ctx.globalAlpha = 1;
}

// ── Hawaii Draw Functions ──
function drawHawaiiSky(W, H, cycle, isNight) {
  const dayTop = [80, 200, 255]; const nightTop = [10, 20, 45];
  const dayBot = [255, 180, 120]; const nightBot = [30, 20, 50];
  const skyTop = lerpColor(dayTop, nightTop, cycle);
  const skyBot = lerpColor(dayBot, nightBot, cycle);
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, `rgb(${skyTop})`); grad.addColorStop(0.7, `rgb(${skyBot})`);
  grad.addColorStop(1, '#38bdf8');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  if (isNight) drawStars(W, H, cycle);
  if (isNight) drawRainbow(W, H, 0);
  drawCelestial(W, H, cycle);
}

function drawHawaiiWorld(W, H, cam) {
  const ww = getCurrentWorldW();
  // Ocean below ground
  ctx.fillStyle = '#0ea5e9';
  ctx.fillRect(0, GROUND_Y, ww, H);
  // Animated waves on the ocean
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 2;
  for (let wx = Math.floor((cam - 20) / 40) * 40; wx < cam + W + 40; wx += 40) {
    const wy = GROUND_Y + 8 + Math.sin(gameTime / 400 + wx * 0.05) * 3;
    ctx.beginPath(); ctx.moveTo(wx, wy); ctx.quadraticCurveTo(wx + 20, wy - 4, wx + 40, wy); ctx.stroke();
  }
  // Sandy beach strip
  ctx.fillStyle = '#fde68a';
  ctx.fillRect(0, GROUND_Y - 4, ww, 8);
  // Beach details (shells, footprints)
  ctx.fillStyle = '#d97706';
  for (let sx = Math.floor((cam - 10) / 120) * 120; sx < cam + W + 10; sx += 120) {
    ctx.beginPath(); ctx.arc(sx + 30, GROUND_Y, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(sx + 80, GROUND_Y + 1, 1.5, 0, Math.PI * 2); ctx.fill();
  }
  drawHawaiiScenes(cam, W);
  drawHawaiiPlatforms();
  drawHawaiiYarnBalls();
  for (const npc of hawaiiNpcs) drawKitty(npc.x, npc.y, npc.color, npc.facing, npc.walkFrame, npc.accessory);
  drawPlayerAndUI();
}

function drawHawaiiPlatforms() {
  drawPlatformsWithStyle(level4.platforms, '#a3e635', '#65a30d', function(p) {
    ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 1.5;
    for (let i = 0; i < 3; i++) {
      const gx = p.x + 10 + i * (p.w - 20) / 2;
      ctx.beginPath(); ctx.moveTo(gx, p.y); ctx.lineTo(gx - 3, p.y - 6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(gx, p.y); ctx.lineTo(gx + 3, p.y - 5); ctx.stroke();
    }
  });
}

function drawHawaiiYarnBalls() { drawYarnBallsForLevel(level4.yarnBalls); }

function drawHawaiiScenes(cam, W) {
  for (const s of level4.scenes) {
    if (s.x < cam - 250 || s.x > cam + W + 250) continue;
    switch (s.type) {
      case 'palm_tree': drawPalmTree(s.x); break;
      case 'tiki_torch': drawTikiTorch(s.x); break;
      case 'coconut_pile': drawCoconutPile(s.x); break;
      case 'volcano': drawVolcano(s.x); break;
      case 'beach_hut': drawBeachHut(s.x); break;
      case 'surfboard': drawSurfboard(s.x); break;
      case 'sea_turtle': drawSeaTurtle(s.x); break;
      case 'flower_lei': drawFlowerLei(s.x); break;
      case 'airport': drawAirport(s.x); break;
    }
  }
}

function drawPalmTree(x) {
  const gy = GROUND_Y;
  // Trunk (curved)
  ctx.strokeStyle = '#92400e'; ctx.lineWidth = 10; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, gy);
  ctx.quadraticCurveTo(x + 12, gy - 50, x + 5, gy - 90); ctx.stroke();
  // Fronds
  ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 3;
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const fx = x + 5 + Math.cos(angle) * 35;
    const fy = gy - 90 + Math.sin(angle) * 15 - 5;
    const sway = Math.sin(gameTime / 800 + i) * 4;
    ctx.beginPath(); ctx.moveTo(x + 5, gy - 88);
    ctx.quadraticCurveTo(x + 5 + Math.cos(angle) * 20, gy - 95 + Math.sin(angle) * 8, fx + sway, fy); ctx.stroke();
    // Leaf details
    ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x + 5, gy - 88);
    ctx.quadraticCurveTo(x + 5 + Math.cos(angle) * 18, gy - 92 + Math.sin(angle) * 6, fx + sway - 3, fy + 3); ctx.stroke();
    ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 3;
  }
  // Coconuts
  ctx.fillStyle = '#78350f';
  ctx.beginPath(); ctx.arc(x + 3, gy - 85, 4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 9, gy - 83, 4, 0, Math.PI * 2); ctx.fill();
}

function drawTikiTorch(x) {
  const gy = GROUND_Y;
  // Pole
  ctx.fillStyle = '#92400e'; ctx.fillRect(x - 3, gy - 55, 6, 55);
  // Carved face
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x - 5, gy - 45, 10, 15);
  ctx.fillStyle = '#fde68a';
  ctx.fillRect(x - 3, gy - 42, 3, 3); // left eye
  ctx.fillRect(x + 1, gy - 42, 3, 3); // right eye
  ctx.fillRect(x - 2, gy - 36, 5, 2); // mouth
  // Flame
  const flicker = Math.sin(gameTime / 100) * 3;
  ctx.fillStyle = '#f97316';
  ctx.beginPath(); ctx.moveTo(x - 6, gy - 55);
  ctx.quadraticCurveTo(x, gy - 72 + flicker, x + 6, gy - 55); ctx.fill();
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath(); ctx.moveTo(x - 3, gy - 55);
  ctx.quadraticCurveTo(x, gy - 66 + flicker, x + 3, gy - 55); ctx.fill();
  // Glow
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath(); ctx.arc(x, gy - 58, 20, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;
}

function drawCoconutPile(x) {
  const gy = GROUND_Y;
  ctx.fillStyle = '#78350f';
  ctx.beginPath(); ctx.arc(x - 5, gy - 6, 6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 5, gy - 6, 6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x, gy - 14, 6, 0, Math.PI * 2); ctx.fill();
  // Coconut detail lines
  ctx.strokeStyle = '#5c2d0e'; ctx.lineWidth = 0.8;
  for (const cx2 of [x - 5, x + 5, x]) {
    const cy = cx2 === x ? gy - 14 : gy - 6;
    ctx.beginPath(); ctx.arc(cx2, cy, 4, 0.5, 2.5); ctx.stroke();
  }
}

function drawVolcano(x) {
  const gy = GROUND_Y;
  // Mountain
  ctx.fillStyle = '#57534e';
  ctx.beginPath(); ctx.moveTo(x - 100, gy); ctx.lineTo(x - 20, gy - 120);
  ctx.lineTo(x + 20, gy - 120); ctx.lineTo(x + 100, gy); ctx.closePath(); ctx.fill();
  // Crater
  ctx.fillStyle = '#78350f';
  ctx.beginPath(); ctx.ellipse(x, gy - 118, 22, 8, 0, 0, Math.PI * 2); ctx.fill();
  // Lava glow
  ctx.fillStyle = '#ef4444';
  ctx.beginPath(); ctx.ellipse(x, gy - 118, 16, 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f97316';
  ctx.beginPath(); ctx.ellipse(x, gy - 118, 10, 3, 0, 0, Math.PI * 2); ctx.fill();
  // Smoke
  ctx.fillStyle = 'rgba(120,120,120,0.3)';
  for (let i = 0; i < 3; i++) {
    const sx = x - 5 + Math.sin(gameTime / 400 + i * 2) * 10;
    const sy = gy - 130 - i * 18 - Math.sin(gameTime / 300 + i) * 5;
    ctx.beginPath(); ctx.arc(sx, sy, 8 + i * 3, 0, Math.PI * 2); ctx.fill();
  }
  // Lava streams
  ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x - 8, gy - 115);
  ctx.quadraticCurveTo(x - 40, gy - 60, x - 60, gy); ctx.stroke();
  ctx.strokeStyle = '#f97316'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x + 5, gy - 115);
  ctx.quadraticCurveTo(x + 35, gy - 70, x + 50, gy); ctx.stroke();
}

function drawBeachHut(x) {
  const gy = GROUND_Y;
  // Stilts
  ctx.fillStyle = '#92400e';
  ctx.fillRect(x - 25, gy - 10, 5, 10);
  ctx.fillRect(x + 20, gy - 10, 5, 10);
  // Platform
  ctx.fillRect(x - 30, gy - 14, 60, 5);
  // Walls
  ctx.fillStyle = '#fde68a';
  ctx.fillRect(x - 25, gy - 45, 50, 32);
  // Thatched roof
  ctx.fillStyle = '#a16207';
  ctx.beginPath(); ctx.moveTo(x - 35, gy - 45); ctx.lineTo(x, gy - 65);
  ctx.lineTo(x + 35, gy - 45); ctx.closePath(); ctx.fill();
  // Roof texture
  ctx.strokeStyle = '#92400e'; ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(x - 30 + i * 12, gy - 47);
    ctx.lineTo(x - 5 + i * 5, gy - 58);
    ctx.stroke();
  }
  // Door
  ctx.fillStyle = '#78350f';
  ctx.beginPath(); ctx.roundRect(x - 7, gy - 35, 14, 22, [4, 4, 0, 0]); ctx.fill();
  // Window
  ctx.fillStyle = '#87ceeb';
  ctx.fillRect(x + 10, gy - 38, 10, 8);
  ctx.strokeStyle = '#92400e'; ctx.lineWidth = 1; ctx.strokeRect(x + 10, gy - 38, 10, 8);
}

function drawSurfboard(x) {
  const gy = GROUND_Y;
  // Board stuck in sand at angle
  ctx.save(); ctx.translate(x, gy - 5); ctx.rotate(-0.3);
  ctx.fillStyle = '#f472b6';
  ctx.beginPath(); ctx.roundRect(-6, -45, 12, 45, [6, 6, 2, 2]); ctx.fill();
  // Stripe
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(-4, -35, 8, 5);
  ctx.fillStyle = '#22d3ee';
  ctx.fillRect(-4, -25, 8, 5);
  // Fin
  ctx.fillStyle = '#f472b6';
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-4, 5); ctx.lineTo(4, 5); ctx.closePath(); ctx.fill();
  ctx.restore();
}

function drawSeaTurtle(x) {
  const gy = GROUND_Y;
  const bob = Math.sin(gameTime / 600 + x) * 2;
  // Shell
  ctx.fillStyle = '#65a30d';
  ctx.beginPath(); ctx.ellipse(x, gy - 8 + bob, 14, 10, 0, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#4d7c0f';
  ctx.beginPath(); ctx.ellipse(x, gy - 6 + bob, 14, 5, 0, 0, Math.PI); ctx.fill();
  // Shell pattern
  ctx.strokeStyle = '#3f6212'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(x, gy - 10 + bob, 6, Math.PI, 0); ctx.stroke();
  ctx.beginPath(); ctx.arc(x - 5, gy - 8 + bob, 4, Math.PI, 0); ctx.stroke();
  ctx.beginPath(); ctx.arc(x + 5, gy - 8 + bob, 4, Math.PI, 0); ctx.stroke();
  // Head
  ctx.fillStyle = '#65a30d';
  ctx.beginPath(); ctx.arc(x + 14, gy - 6 + bob, 5, 0, Math.PI * 2); ctx.fill();
  // Eye
  ctx.fillStyle = '#1f2937';
  ctx.beginPath(); ctx.arc(x + 16, gy - 7 + bob, 1.5, 0, Math.PI * 2); ctx.fill();
  // Flippers
  ctx.fillStyle = '#65a30d';
  ctx.beginPath(); ctx.ellipse(x - 8, gy - 2 + bob, 6, 3, -0.3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x + 8, gy - 2 + bob, 6, 3, 0.3, 0, Math.PI * 2); ctx.fill();
}

function drawFlowerLei(x) {
  const gy = GROUND_Y;
  // Draped on ground
  const colors = ['#f472b6','#fbbf24','#a78bfa','#fb923c','#34d399'];
  for (let i = 0; i < 8; i++) {
    const fx = x - 14 + i * 4;
    const fy = gy - 4 + Math.sin(i * 0.8) * 2;
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath(); ctx.arc(fx, fy, 3, 0, Math.PI * 2); ctx.fill();
    // Center dot
    ctx.fillStyle = '#fde68a';
    ctx.beginPath(); ctx.arc(fx, fy, 1, 0, Math.PI * 2); ctx.fill();
  }
}

function drawAirport(x) {
  const gy = GROUND_Y;
  // Runway
  ctx.fillStyle = '#4b5563';
  ctx.fillRect(x - 80, gy - 3, 160, 6);
  ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1; ctx.setLineDash([8, 6]);
  ctx.beginPath(); ctx.moveTo(x - 75, gy); ctx.lineTo(x + 75, gy); ctx.stroke();
  ctx.setLineDash([]);
  // Terminal building
  ctx.fillStyle = '#e5e7eb';
  ctx.fillRect(x - 40, gy - 50, 80, 47);
  // Control tower
  ctx.fillStyle = '#d1d5db';
  ctx.fillRect(x + 25, gy - 75, 14, 25);
  ctx.fillStyle = '#bae6fd';
  ctx.fillRect(x + 22, gy - 80, 20, 8);
  ctx.fillStyle = '#9ca3af';
  ctx.fillRect(x + 20, gy - 82, 24, 3);
  // Terminal windows
  ctx.fillStyle = '#bae6fd';
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(x - 35 + i * 15, gy - 42, 10, 8);
  }
  // Terminal door
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(x - 8, gy - 30, 16, 27);
  // "AIRPORT" sign
  ctx.fillStyle = '#fff'; ctx.font = 'bold 8px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('AIRPORT', x, gy - 52);
  // Airplane
  const planeX = x + 60 + Math.sin(gameTime / 800) * 15;
  const planeY = gy - 100 - Math.cos(gameTime / 800) * 8;
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(planeX + 20, planeY);
  ctx.lineTo(planeX - 15, planeY - 3);
  ctx.lineTo(planeX - 20, planeY - 10);
  ctx.lineTo(planeX - 18, planeY - 3);
  ctx.lineTo(planeX - 25, planeY);
  ctx.lineTo(planeX - 18, planeY + 3);
  ctx.lineTo(planeX - 20, planeY + 8);
  ctx.lineTo(planeX - 15, planeY + 3);
  ctx.closePath();
  ctx.fill();
  // Plane windows
  ctx.fillStyle = '#60a5fa';
  for (let i = 0; i < 4; i++) {
    ctx.beginPath(); ctx.arc(planeX + 5 - i * 6, planeY, 1.5, 0, Math.PI * 2); ctx.fill();
  }
  // Prompt glow
  ctx.globalAlpha = 0.4 + Math.sin(gameTime / 300) * 0.2;
  ctx.fillStyle = '#3b82f6';
  ctx.beginPath(); ctx.arc(x, gy - 20, 25, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;
}

// ── Alps Draw Functions ──
// ── Sledding Level Drawing Functions ──

function drawSleddingSky(W, H, cycle, isNight) {
  const dayTop = [200, 220, 240];
  const nightTop = [15, 20, 35];
  const dayBot = [230, 240, 250];
  const nightBot = [25, 30, 55];
  const t = cycle;
  const skyTop = lerpColor(dayTop, nightTop, t);
  const skyBot = lerpColor(dayBot, nightBot, t);
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, `rgb(${skyTop})`);
  grad.addColorStop(1, `rgb(${skyBot})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  if (isNight) drawStars(W, H, cycle);
  drawCelestial(W, H, cycle);
  // Snowy mountains in background
  drawSledMountains(W, H);
}

function drawSleddingWorld(W, H, cam, cycle, isNight) {
  const ww = level2Sled.worldW;

  // Draw sloped terrain (snow-covered hill)
  ctx.fillStyle = '#f0f4f8';
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = Math.floor(cam); x <= Math.ceil(cam + W) + 10; x += 5) {
    ctx.lineTo(x, sledTerrainY(x));
  }
  ctx.lineTo(Math.ceil(cam + W) + 10, H);
  ctx.closePath();
  ctx.fill();

  // Snow surface line
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 3;
  ctx.beginPath();
  let terrainStarted = false;
  for (let x = Math.floor(cam); x <= Math.ceil(cam + W) + 10; x += 5) {
    const y = sledTerrainY(x);
    if (!terrainStarted) { ctx.moveTo(x, y); terrainStarted = true; }
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Snow sparkle detail along terrain
  ctx.fillStyle = '#fff';
  for (let x = Math.floor(cam); x < Math.ceil(cam + W); x += 30) {
    ctx.fillRect(x + Math.sin(x) * 5, sledTerrainY(x) - 1, 2, 3);
  }

  // Sled tracks behind player (two parallel runner trails)
  if (sledding && player.x > 150) {
    ctx.strokeStyle = 'rgba(180, 200, 220, 0.4)';
    ctx.lineWidth = 2;
    for (const offset of [-5, 5]) {
      ctx.beginPath();
      const trackStart = Math.max(Math.floor(cam), player.x - 300);
      let trackStarted = false;
      for (let x = trackStart; x < player.x; x += 5) {
        const y = sledTerrainY(x) + offset * 0.3;
        if (!trackStarted) { ctx.moveTo(x, y); trackStarted = true; }
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }

  // Background pine trees on terrain
  for (const pine of level2Sled.pines) {
    if (pine.x < cam - 100 || pine.x > cam + W + 100) continue;
    drawPineTree(pine.x, pine.y, pine.size);
  }

  // Snow platforms (terrain features)
  drawSleddingPlatforms();

  // Snowballs
  drawSnowballs();

  // Snowmen
  drawSnowmen(cam, W);

  // Yarn balls
  drawSleddingYarnBalls();

  // Train at end (at terrain level)
  drawTrain(ww - 150);

  // Falling snowflakes
  drawSnowflakes(cam, W, H);

  // NPCs
  for (const npc of sledNpcs) drawKitty(npc.x, npc.y, npc.color, npc.facing, npc.walkFrame, npc.accessory);

  drawPlayerAndUI();
}

function drawSledMountains(W, H) {
  ctx.fillStyle = 'rgba(200, 215, 230, 0.5)';
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 20) {
    const y = H * 0.35 + Math.sin(x / 120) * 40 + Math.cos(x / 60) * 20;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(W, H);
  ctx.fill();
  // Snow caps
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 20) {
    const y = H * 0.35 + Math.sin(x / 120) * 40 + Math.cos(x / 60) * 20;
    ctx.lineTo(x, y - 5);
  }
  for (let x = W; x >= 0; x -= 20) {
    const y = H * 0.35 + Math.sin(x / 120) * 40 + Math.cos(x / 60) * 20;
    ctx.lineTo(x, y + 8);
  }
  ctx.fill();
}

function drawPineTree(x, gy, size) {
  const s = size;
  // Trunk
  ctx.fillStyle = '#5c3a1e';
  ctx.fillRect(x - 3 * s, gy - 15 * s, 6 * s, 15 * s);
  // Snow-covered layers
  for (let i = 0; i < 3; i++) {
    const ly = gy - 15 * s - i * 18 * s;
    const lw = (30 - i * 8) * s;
    // Green
    ctx.fillStyle = '#2d6a4f';
    ctx.beginPath();
    ctx.moveTo(x - lw / 2, ly);
    ctx.lineTo(x, ly - 22 * s);
    ctx.lineTo(x + lw / 2, ly);
    ctx.fill();
    // Snow on top
    ctx.fillStyle = '#f0f4f8';
    ctx.beginPath();
    ctx.moveTo(x - lw / 2 + 4, ly);
    ctx.lineTo(x, ly - 18 * s);
    ctx.lineTo(x + lw / 2 - 4, ly);
    ctx.fill();
  }
}

function drawSleddingPlatforms() {
  for (const p of level2Sled.platforms) {
    // Ice/snow platform
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(p.x + 3, p.y + 3, p.w, 12);

    const pGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + 12);
    pGrad.addColorStop(0, '#e2e8f0');
    pGrad.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = pGrad;
    ctx.beginPath();
    ctx.roundRect(p.x, p.y, p.w, 12, 4);
    ctx.fill();

    // Snow cap
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.roundRect(p.x - 2, p.y - 3, p.w + 4, 6, 3);
    ctx.fill();
  }
}

function drawSnowballs() {
  for (const sb of level2Sled.snowballs) {
    if (sb.collected) continue;
    const bob = Math.sin(gameTime / 400 + sb.bobPhase) * 3;
    const sx = sb.x, sy = sb.y + bob;

    // Glow
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = '#bae6fd';
    ctx.beginPath();
    ctx.arc(sx, sy, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Snowball
    ctx.fillStyle = '#f0f4f8';
    ctx.beginPath();
    ctx.arc(sx, sy, 10, 0, Math.PI * 2);
    ctx.fill();

    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath();
    ctx.arc(sx - 3, sy - 3, 4, 0, Math.PI * 2);
    ctx.fill();

    // Snow sparkle
    ctx.fillStyle = '#bae6fd';
    ctx.beginPath();
    ctx.arc(sx + 2, sy + 2, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawSnowmen(cam, W) {
  for (const sm of level2Sled.snowmen) {
    if (sm.x < cam - 50 || sm.x > cam + W + 50) continue;
    const s = sm.size;
    const gy = sm.y;

    // Bottom ball
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(sm.x, gy - 12 * s, 12 * s, 0, Math.PI * 2);
    ctx.fill();

    // Middle ball
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.arc(sm.x, gy - 28 * s, 9 * s, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(sm.x, gy - 40 * s, 7 * s, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.arc(sm.x - 3 * s, gy - 42 * s, 1.5 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(sm.x + 3 * s, gy - 42 * s, 1.5 * s, 0, Math.PI * 2);
    ctx.fill();

    // Carrot nose
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(sm.x, gy - 40 * s);
    ctx.lineTo(sm.x + 8 * s, gy - 39 * s);
    ctx.lineTo(sm.x, gy - 38 * s);
    ctx.fill();

    // Scarf
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(sm.x - 8 * s, gy - 33 * s, 16 * s, 3 * s);
    ctx.fillRect(sm.x + 4 * s, gy - 33 * s, 3 * s, 8 * s);

    // Stick arms
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sm.x - 9 * s, gy - 28 * s);
    ctx.lineTo(sm.x - 22 * s, gy - 35 * s);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(sm.x + 9 * s, gy - 28 * s);
    ctx.lineTo(sm.x + 22 * s, gy - 35 * s);
    ctx.stroke();

    // Top hat
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(sm.x - 6 * s, gy - 52 * s, 12 * s, 10 * s);
    ctx.fillRect(sm.x - 8 * s, gy - 46 * s, 16 * s, 3 * s);
  }
}

function drawSleddingYarnBalls() {
  for (const yb of level2Sled.yarnBalls) {
    if (yb.collected) continue;
    const bob = Math.sin(gameTime / 400 + yb.bobPhase) * 3;
    const bx = yb.x, by = yb.y + bob;
    // Glow
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = yb.color;
    ctx.beginPath();
    ctx.arc(bx, by, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    // Yarn ball
    ctx.fillStyle = yb.color;
    ctx.beginPath();
    ctx.arc(bx, by, 8, 0, Math.PI * 2);
    ctx.fill();
    // Yarn lines
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(bx, by, 5, 0.3, 2.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(bx - 1, by + 1, 3, 1, 3.5);
    ctx.stroke();
  }
}

function drawTrain(x) {
  const gy = currentLevel === 2 ? sledTerrainY(x) : GROUND_Y;
  // Railroad tracks
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x - 70, gy - 3, 140, 3);
  ctx.fillRect(x - 70, gy + 2, 140, 3);
  // Ties
  ctx.fillStyle = '#92400e';
  for (let i = -3; i <= 3; i++) {
    ctx.fillRect(x + i * 18 - 4, gy - 5, 8, 12);
  }
  // Engine body
  ctx.fillStyle = '#dc2626';
  ctx.beginPath(); ctx.roundRect(x - 35, gy - 40, 70, 32, 5); ctx.fill();
  // Cabin
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(x + 10, gy - 58, 25, 20);
  // Cabin roof
  ctx.fillStyle = '#7f1d1d';
  ctx.fillRect(x + 7, gy - 62, 31, 5);
  // Cabin window
  ctx.fillStyle = '#bae6fd';
  ctx.fillRect(x + 15, gy - 55, 14, 10);
  // Front windows
  ctx.fillStyle = '#bae6fd';
  ctx.fillRect(x - 28, gy - 35, 12, 10);
  ctx.fillRect(x - 10, gy - 35, 12, 10);
  // Smokestack
  ctx.fillStyle = '#374151';
  ctx.fillRect(x - 22, gy - 55, 10, 16);
  ctx.fillRect(x - 25, gy - 58, 16, 5);
  // Steam puffs
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = '#e5e7eb';
  for (let i = 0; i < 4; i++) {
    const sy = gy - 65 - i * 10 - Math.sin(gameTime / 350 + i) * 4;
    const sx = x - 17 + Math.sin(gameTime / 500 + i * 1.5) * 6;
    ctx.beginPath();
    ctx.arc(sx, sy, 5 + i * 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  // Cowcatcher
  ctx.fillStyle = '#4b5563';
  ctx.beginPath();
  ctx.moveTo(x - 35, gy - 8);
  ctx.lineTo(x - 45, gy);
  ctx.lineTo(x - 35, gy);
  ctx.fill();
  // Wheels
  ctx.fillStyle = '#1f2937';
  ctx.beginPath(); ctx.arc(x - 20, gy - 4, 7, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x, gy - 4, 7, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 20, gy - 4, 7, 0, Math.PI * 2); ctx.fill();
  // Wheel hubs
  ctx.fillStyle = '#6b7280';
  ctx.beginPath(); ctx.arc(x - 20, gy - 4, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x, gy - 4, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 20, gy - 4, 3, 0, Math.PI * 2); ctx.fill();
  // Connecting rod (animated)
  const rodOffset = Math.sin(gameTime / 200) * 3;
  ctx.strokeStyle = '#6b7280';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 20, gy - 4 + rodOffset);
  ctx.lineTo(x + 20, gy - 4 - rodOffset);
  ctx.stroke();
  // Snow on top
  ctx.fillStyle = '#f0f4f8';
  ctx.beginPath();
  ctx.ellipse(x - 10, gy - 40, 28, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + 22, gy - 58, 12, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  // NYC sign on side
  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 7px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('NYC EXPRESS', x - 5, gy - 18);
}

function drawSnowflakes(cam, W, H) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  for (let i = 0; i < 30; i++) {
    const sx = cam + ((i * 173 + Math.sin(gameTime / 800 + i * 0.7) * 40) % W);
    const sy = ((gameTime / 15 + i * 67) % H);
    const size = 1.5 + (i % 3);
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawAlpsSky(W, H, cycle, isNight) {
  const dayTop = [180, 210, 240]; const nightTop = [15, 20, 40];
  const dayBot = [230, 240, 255]; const nightBot = [30, 35, 60];
  const skyTop = lerpColor(dayTop, nightTop, cycle);
  const skyBot = lerpColor(dayBot, nightBot, cycle);
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, `rgb(${skyTop})`);
  grad.addColorStop(1, `rgb(${skyBot})`);
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  if (isNight) drawStars(W, H, cycle);
  drawCelestial(W, H, cycle);
  // Distant mountain range silhouette
  ctx.fillStyle = `rgba(${isNight ? '60,70,100' : '180,195,220'}, 0.6)`;
  ctx.beginPath(); ctx.moveTo(0, GROUND_Y - 40);
  for (let mx = 0; mx <= W; mx += 60) {
    const mh = 50 + Math.sin(mx * 0.015 + 2) * 30 + Math.sin(mx * 0.007) * 20;
    ctx.lineTo(mx, GROUND_Y - 40 - mh);
  }
  ctx.lineTo(W, GROUND_Y); ctx.lineTo(0, GROUND_Y); ctx.closePath(); ctx.fill();
  // Snow peaks
  ctx.fillStyle = `rgba(255,255,255, ${isNight ? 0.3 : 0.6})`;
  for (let mx = 0; mx <= W; mx += 60) {
    const mh = 50 + Math.sin(mx * 0.015 + 2) * 30 + Math.sin(mx * 0.007) * 20;
    const peakY = GROUND_Y - 40 - mh;
    ctx.beginPath();
    ctx.moveTo(mx - 10, peakY + 12);
    ctx.lineTo(mx, peakY);
    ctx.lineTo(mx + 10, peakY + 12);
    ctx.closePath(); ctx.fill();
  }
}

function drawAlpsWorld(W, H, cam) {
  // First-person downhill ski view
  const cx = W / 2 + cam; // center x in world coords (translate is active)
  const vanishY = H * 0.3; // vanishing point y
  const groundH = H - vanishY; // ground area height
  const focal = 300; // perspective focal length

  // Snow-covered slope — gradient from horizon to bottom
  const snowGrad = ctx.createLinearGradient(cam, vanishY, cam, H);
  snowGrad.addColorStop(0, '#cce4f7');
  snowGrad.addColorStop(0.3, '#e0f2fe');
  snowGrad.addColorStop(1, '#f8fafc');
  ctx.fillStyle = snowGrad;
  ctx.fillRect(cam, vanishY, W, groundH);

  // Perspective slope lines (converge to vanishing point)
  ctx.strokeStyle = 'rgba(180, 210, 235, 0.3)';
  ctx.lineWidth = 1;
  for (let i = -5; i <= 5; i++) {
    ctx.beginPath();
    ctx.moveTo(cx, vanishY);
    ctx.lineTo(cx + i * W * 0.15, H);
    ctx.stroke();
  }

  // Horizontal depth lines (closer = wider apart)
  ctx.strokeStyle = 'rgba(200, 220, 240, 0.25)';
  for (let d = 1; d < 8; d++) {
    const depthY = vanishY + groundH * (d / 8) * (d / 8);
    ctx.beginPath();
    ctx.moveTo(cam, depthY);
    ctx.lineTo(cam + W, depthY);
    ctx.stroke();
  }

  // Snow sparkles on the slope
  ctx.fillStyle = '#fff';
  for (let i = 0; i < 30; i++) {
    const sparkleZ = ((i * 137 + alpsScrollZ * 0.5) % 600) + 20;
    const sparkleL = ((i * 89) % 400) - 200;
    const sz = focal / sparkleZ;
    if (sz < 0.05 || sz > 3) continue;
    const sy = vanishY + groundH * (1 - 1 / (sparkleZ * 0.01 + 1));
    const ssx = cx + sparkleL * sz;
    ctx.globalAlpha = Math.sin(gameTime / 300 + i) * 0.3 + 0.4;
    ctx.beginPath();
    ctx.arc(ssx, sy, sz * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Sort all objects by z-distance (far to near) for proper overlap
  const drawList = [];

  // Trees
  for (const tree of level5.trees) {
    const dz = tree.z - alpsScrollZ;
    if (dz < 5 || dz > 500) continue;
    drawList.push({ type: 'tree', dz, lane: tree.lane, size: tree.size, hit: tree.hit });
  }

  // Cornices (jump ramps)
  for (const c of level5.cornices) {
    const dz = c.z - alpsScrollZ;
    if (dz < -30 || dz > 400) continue;
    drawList.push({ type: 'cornice', dz });
  }

  // Diamonds
  for (const d of level5.diamonds) {
    if (d.collected) continue;
    const dz = d.z - alpsScrollZ;
    if (dz < 0 || dz > 500) continue;
    const bob = Math.sin(gameTime / 350 + d.bobPhase) * 3;
    drawList.push({ type: 'diamond', dz, lane: d.lane, bob });
  }

  // Sort far to near
  drawList.sort((a, b) => b.dz - a.dz);

  // Draw all objects with perspective projection
  for (const obj of drawList) {
    const dz = Math.max(obj.dz, 5);
    const scale = focal / dz;
    const screenY = vanishY + groundH * (1 - 1 / (dz * 0.008 + 1));

    if (obj.type === 'tree') {
      const tx = cx + obj.lane * scale;
      const treeH = 40 * obj.size * scale;
      const treeW = 20 * obj.size * scale;
      // Trunk
      ctx.fillStyle = '#78350f';
      ctx.fillRect(tx - treeW * 0.1, screenY - treeH * 0.2, treeW * 0.2, treeH * 0.3);
      // Tree layers
      ctx.fillStyle = obj.hit ? '#ef4444' : '#166534';
      for (let layer = 0; layer < 3; layer++) {
        const ly = screenY - treeH * (0.2 + layer * 0.28);
        const lw = treeW * (1 - layer * 0.25);
        ctx.beginPath();
        ctx.moveTo(tx - lw, ly);
        ctx.lineTo(tx, ly - treeH * 0.3);
        ctx.lineTo(tx + lw, ly);
        ctx.closePath();
        ctx.fill();
      }
      // Snow caps
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      for (let layer = 0; layer < 3; layer++) {
        const ly = screenY - treeH * (0.2 + layer * 0.28);
        const lw = treeW * (0.6 - layer * 0.15);
        ctx.beginPath();
        ctx.moveTo(tx - lw, ly - treeH * 0.15);
        ctx.lineTo(tx, ly - treeH * 0.3);
        ctx.lineTo(tx + lw, ly - treeH * 0.15);
        ctx.closePath();
        ctx.fill();
      }
    } else if (obj.type === 'cornice') {
      // Snow ramp across the slope
      const rampW = W * 0.6 * scale;
      ctx.fillStyle = '#bae6fd';
      ctx.beginPath();
      ctx.moveTo(cx - rampW, screenY);
      ctx.lineTo(cx - rampW * 0.8, screenY - 15 * scale);
      ctx.lineTo(cx + rampW * 0.8, screenY - 15 * scale);
      ctx.lineTo(cx + rampW, screenY);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = Math.max(1, 2 * scale);
      ctx.stroke();
    } else if (obj.type === 'diamond') {
      const dx = cx + obj.lane * scale;
      const dy = screenY - (alpsAirborne ? 30 : 10) * scale + obj.bob;
      const ds = Math.max(4, 12 * scale);
      // Diamond shape
      ctx.fillStyle = '#60a5fa';
      ctx.beginPath();
      ctx.moveTo(dx, dy - ds);
      ctx.lineTo(dx + ds * 0.7, dy);
      ctx.lineTo(dx, dy + ds * 0.5);
      ctx.lineTo(dx - ds * 0.7, dy);
      ctx.closePath();
      ctx.fill();
      // Sparkle
      ctx.fillStyle = '#bfdbfe';
      ctx.beginPath();
      ctx.moveTo(dx - ds * 0.2, dy - ds * 0.3);
      ctx.lineTo(dx + ds * 0.1, dy - ds * 0.5);
      ctx.lineTo(dx + ds * 0.15, dy - ds * 0.15);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Chalet at the end of the run
  if (alpsScrollZ >= ALPS_RUN_LENGTH - 200) {
    const chaletDz = ALPS_RUN_LENGTH - alpsScrollZ;
    const chaletScale = focal / Math.max(chaletDz, 20);
    const chaletY = vanishY + groundH * (1 - 1 / (Math.max(chaletDz, 20) * 0.008 + 1));
    const cw = 80 * chaletScale;
    const ch = 60 * chaletScale;
    // Chalet body
    ctx.fillStyle = '#92400e';
    ctx.fillRect(cx - cw / 2, chaletY - ch, cw, ch);
    // Roof
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(cx - cw * 0.65, chaletY - ch);
    ctx.lineTo(cx, chaletY - ch - ch * 0.6);
    ctx.lineTo(cx + cw * 0.65, chaletY - ch);
    ctx.closePath();
    ctx.fill();
    // Snow on roof
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(cx - cw * 0.6, chaletY - ch - 2);
    ctx.lineTo(cx, chaletY - ch - ch * 0.55);
    ctx.lineTo(cx + cw * 0.6, chaletY - ch - 2);
    ctx.closePath();
    ctx.fill();
    // Door
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(cx - cw * 0.1, chaletY - ch * 0.5, cw * 0.2, ch * 0.5);
    // Windows
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(cx - cw * 0.35, chaletY - ch * 0.7, cw * 0.15, cw * 0.15);
    ctx.fillRect(cx + cw * 0.2, chaletY - ch * 0.7, cw * 0.15, cw * 0.15);
  }

  // Draw player (from behind) at bottom-center of screen
  const playerY = alpsAirborne ? H * 0.65 - Math.sin(alpsAirTimer / ALPS_AIR_DURATION * Math.PI) * 80 : H * 0.82;
  const playerX = cx + alpsPlayerLane;
  // Simple back-view silhouette
  const pScale = 1.2;
  // Body
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.ellipse(playerX, playerY - 12 * pScale, 10 * pScale, 14 * pScale, 0, 0, Math.PI * 2);
  ctx.fill();
  // Head
  ctx.beginPath();
  ctx.arc(playerX, playerY - 30 * pScale, 8 * pScale, 0, Math.PI * 2);
  ctx.fill();
  // Horn
  ctx.fillStyle = '#c084fc';
  ctx.beginPath();
  ctx.moveTo(playerX - 2, playerY - 38 * pScale);
  ctx.lineTo(playerX, playerY - 52 * pScale);
  ctx.lineTo(playerX + 2, playerY - 38 * pScale);
  ctx.closePath();
  ctx.fill();
  // Ears
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.moveTo(playerX - 7 * pScale, playerY - 34 * pScale);
  ctx.lineTo(playerX - 4 * pScale, playerY - 42 * pScale);
  ctx.lineTo(playerX - 1 * pScale, playerY - 34 * pScale);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(playerX + 1 * pScale, playerY - 34 * pScale);
  ctx.lineTo(playerX + 4 * pScale, playerY - 42 * pScale);
  ctx.lineTo(playerX + 7 * pScale, playerY - 34 * pScale);
  ctx.closePath();
  ctx.fill();
  // Equipment under feet
  if (alpsEquipment === 'skis') {
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(playerX - 6, playerY + 4); ctx.lineTo(playerX - 6, playerY + 14); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(playerX + 6, playerY + 4); ctx.lineTo(playerX + 6, playerY + 14); ctx.stroke();
  } else if (alpsEquipment === 'snowboard') {
    ctx.fillStyle = '#7c3aed';
    ctx.beginPath();
    ctx.roundRect(playerX - 14, playerY + 4, 28, 6, 3);
    ctx.fill();
  }

  // Speed lines (motion blur effect)
  if (skiing && !alpsChoosing) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const lx = cx + ((i * 137 + 50) % W) - W / 2;
      const ly1 = vanishY + 50 + (i * 40);
      ctx.beginPath();
      ctx.moveTo(lx, ly1);
      ctx.lineTo(lx + (lx - cx) * 0.3, ly1 + 30 + i * 5);
      ctx.stroke();
    }
  }

  // Progress indicator
  if (skiing && !alpsChoosing) {
    const progress = Math.min(1, alpsScrollZ / ALPS_RUN_LENGTH);
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(cam + W - 60, 50, 20, 200);
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(cam + W - 60, 50 + 200 * (1 - progress), 20, 200 * progress);
    ctx.fillStyle = '#fff';
    ctx.font = '10px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(Math.round(progress * 100) + '%', cam + W - 50, 45);
    ctx.textAlign = 'left';
  }

  // Equipment choice overlay
  if (alpsChoosing) {
    drawAlpsEquipmentChoice(W, H);
  }
}

function drawAlpsEquipmentChoice(W, H) {
  // Semi-transparent overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, W, H);

  // Title
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 28px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('Choose Your Ride!', W / 2, H / 3 - 20);

  // Skis option (left)
  const skiX = W / 2 - 100;
  const optY = H / 2 - 20;

  // Ski icon — two parallel lines
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(skiX - 15, optY - 15);
  ctx.lineTo(skiX + 15, optY + 15);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(skiX - 10, optY - 15);
  ctx.lineTo(skiX + 20, optY + 15);
  ctx.stroke();
  // Curved tips
  ctx.beginPath();
  ctx.arc(skiX - 15, optY - 18, 5, 0, Math.PI, true);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(skiX - 10, optY - 18, 5, 0, Math.PI, true);
  ctx.stroke();

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 18px system-ui';
  ctx.fillText('Skis', skiX, optY + 40);
  ctx.font = '14px system-ui';
  ctx.fillStyle = '#bae6fd';
  ctx.fillText('Press 1 or S', skiX, optY + 60);

  // Snowboard option (right)
  const sbX = W / 2 + 100;

  // Snowboard icon — single wide board
  ctx.fillStyle = '#a78bfa';
  ctx.save();
  ctx.translate(sbX, optY);
  ctx.rotate(-0.3);
  ctx.beginPath();
  ctx.roundRect(-20, -4, 40, 8, 4);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 18px system-ui';
  ctx.fillText('Snowboard', sbX, optY + 40);
  ctx.font = '14px system-ui';
  ctx.fillStyle = '#c4b5fd';
  ctx.fillText('Press 2 or B', sbX, optY + 60);

  ctx.textAlign = 'left';
}

function drawSkisOnPlayer(px, py) {
  ctx.save();
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';

  // Left ski
  ctx.beginPath();
  ctx.moveTo(px - 14, py + 2);
  ctx.lineTo(px + 8, py + 2);
  ctx.quadraticCurveTo(px + 14, py + 2, px + 14, py - 4);
  ctx.stroke();

  // Right ski
  ctx.beginPath();
  ctx.moveTo(px - 14, py + 6);
  ctx.lineTo(px + 8, py + 6);
  ctx.quadraticCurveTo(px + 14, py + 6, px + 14, py);
  ctx.stroke();

  // Ski poles
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(px - 10, py - 15);
  ctx.lineTo(px - 16, py + 5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(px + 6, py - 15);
  ctx.lineTo(px + 12, py + 5);
  ctx.stroke();
  // Pole baskets
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(px - 16, py + 7, 3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(px + 12, py + 7, 3, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function drawSnowboardOnPlayer(px, py) {
  ctx.save();

  // Snowboard — single wide board under both feet
  ctx.fillStyle = '#7c3aed';
  ctx.beginPath();
  ctx.roundRect(px - 16, py + 1, 32, 7, 4);
  ctx.fill();

  // Board design stripe
  ctx.fillStyle = '#a78bfa';
  ctx.fillRect(px - 10, py + 3, 20, 2);

  // Board edge highlight
  ctx.strokeStyle = '#6d28d9';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(px - 16, py + 1, 32, 7, 4);
  ctx.stroke();

  ctx.restore();
}

function drawAlpsPineTree(x, size, hit) {
  const gy = GROUND_Y;
  const h = 50 * size;
  // Trunk
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x - 3 * size, gy - 10 * size, 6 * size, 10 * size);
  // Tree layers (3 triangles stacked)
  const treeColor = hit ? '#ef4444' : '#166534';
  ctx.fillStyle = treeColor;
  for (let layer = 0; layer < 3; layer++) {
    const ly = gy - 10 * size - layer * h * 0.28;
    const lw = (18 - layer * 4) * size;
    const lh = h * 0.38;
    ctx.beginPath();
    ctx.moveTo(x, ly - lh);
    ctx.lineTo(x - lw, ly);
    ctx.lineTo(x + lw, ly);
    ctx.closePath(); ctx.fill();
  }
  // Snow on branches
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  for (let layer = 0; layer < 3; layer++) {
    const ly = gy - 10 * size - layer * h * 0.28;
    const lw = (18 - layer * 4) * size;
    ctx.beginPath();
    ctx.moveTo(x - lw * 0.7, ly - 2);
    ctx.quadraticCurveTo(x, ly - 6, x + lw * 0.7, ly - 2);
    ctx.lineTo(x + lw * 0.5, ly);
    ctx.quadraticCurveTo(x, ly - 3, x - lw * 0.5, ly);
    ctx.closePath(); ctx.fill();
  }
}

function drawCornice(x, y, w) {
  // Snow ledge / cornice
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  ctx.fillRect(x + 3, y + 3, w, 18);
  // Main snow body
  const cGrad = ctx.createLinearGradient(x, y, x, y + 18);
  cGrad.addColorStop(0, '#e0f2fe');
  cGrad.addColorStop(0.5, '#f0f9ff');
  cGrad.addColorStop(1, '#bae6fd');
  ctx.fillStyle = cGrad;
  ctx.beginPath(); ctx.roundRect(x, y, w, 18, 6); ctx.fill();
  // Overhang lip (the cornice curl)
  ctx.fillStyle = '#dbeafe';
  ctx.beginPath();
  ctx.moveTo(x + w, y + 4);
  ctx.quadraticCurveTo(x + w + 12, y + 8, x + w + 5, y + 18);
  ctx.lineTo(x + w, y + 18);
  ctx.closePath(); ctx.fill();
  // Top snow shine
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillRect(x + 5, y + 2, w - 10, 3);
  // Icicles
  ctx.fillStyle = '#bfdbfe';
  for (let i = 0; i < 4; i++) {
    const ix = x + 15 + i * ((w - 30) / 3);
    const ih = 8 + Math.sin(gameTime / 500 + i) * 2;
    ctx.beginPath();
    ctx.moveTo(ix - 2, y + 18);
    ctx.lineTo(ix, y + 18 + ih);
    ctx.lineTo(ix + 2, y + 18);
    ctx.closePath(); ctx.fill();
  }
}

function drawDiamond(x, y) {
  // Glowing diamond collectible
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = '#60a5fa';
  ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;
  // Diamond shape
  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.moveTo(x, y - 12);
  ctx.lineTo(x + 8, y - 3);
  ctx.lineTo(x, y + 10);
  ctx.lineTo(x - 8, y - 3);
  ctx.closePath(); ctx.fill();
  // Top facet (lighter)
  ctx.fillStyle = '#93c5fd';
  ctx.beginPath();
  ctx.moveTo(x, y - 12);
  ctx.lineTo(x + 8, y - 3);
  ctx.lineTo(x, y - 1);
  ctx.lineTo(x - 8, y - 3);
  ctx.closePath(); ctx.fill();
  // Highlight
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.beginPath();
  ctx.moveTo(x - 3, y - 10);
  ctx.lineTo(x + 2, y - 4);
  ctx.lineTo(x - 4, y - 4);
  ctx.closePath(); ctx.fill();
  // Sparkle
  const sparkle = Math.sin(gameTime / 200 + x) * 0.5 + 0.5;
  ctx.globalAlpha = sparkle;
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(x + 4, y - 8, 2, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;
}

function drawChalet(x) {
  const gy = GROUND_Y;
  // Foundation
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x - 45, gy - 5, 90, 5);
  // Walls (warm wood)
  const wallGrad = ctx.createLinearGradient(x - 40, gy - 65, x + 40, gy - 65);
  wallGrad.addColorStop(0, '#b45309');
  wallGrad.addColorStop(1, '#d97706');
  ctx.fillStyle = wallGrad;
  ctx.fillRect(x - 40, gy - 65, 80, 60);
  // Log lines
  ctx.strokeStyle = '#92400e'; ctx.lineWidth = 1;
  for (let ly = gy - 60; ly < gy - 5; ly += 8) {
    ctx.beginPath(); ctx.moveTo(x - 38, ly); ctx.lineTo(x + 38, ly); ctx.stroke();
  }
  // Roof
  ctx.fillStyle = '#991b1b';
  ctx.beginPath();
  ctx.moveTo(x - 55, gy - 65);
  ctx.lineTo(x, gy - 100);
  ctx.lineTo(x + 55, gy - 65);
  ctx.closePath(); ctx.fill();
  // Snow on roof
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(x - 55, gy - 65);
  ctx.lineTo(x, gy - 100);
  ctx.lineTo(x + 55, gy - 65);
  ctx.lineTo(x + 50, gy - 62);
  ctx.quadraticCurveTo(x, gy - 92, x - 50, gy - 62);
  ctx.closePath(); ctx.fill();
  // Snow overhang
  ctx.fillStyle = '#e0f2fe';
  ctx.beginPath();
  ctx.moveTo(x - 55, gy - 65);
  ctx.quadraticCurveTo(x - 58, gy - 58, x - 52, gy - 58);
  ctx.lineTo(x - 50, gy - 65);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 55, gy - 65);
  ctx.quadraticCurveTo(x + 58, gy - 58, x + 52, gy - 58);
  ctx.lineTo(x + 50, gy - 65);
  ctx.closePath(); ctx.fill();
  // Door
  ctx.fillStyle = '#451a03';
  ctx.beginPath(); ctx.roundRect(x - 10, gy - 40, 20, 35, [4, 4, 0, 0]); ctx.fill();
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath(); ctx.arc(x + 5, gy - 22, 2, 0, Math.PI * 2); ctx.fill();
  // Windows
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(x - 35, gy - 55, 16, 14);
  ctx.fillRect(x + 18, gy - 55, 16, 14);
  // Window glow
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(x - 35, gy - 55, 16, 14);
  ctx.fillRect(x + 18, gy - 55, 16, 14);
  ctx.globalAlpha = 1;
  // Window frames
  ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1.5;
  ctx.strokeRect(x - 35, gy - 55, 16, 14);
  ctx.strokeRect(x + 18, gy - 55, 16, 14);
  ctx.beginPath(); ctx.moveTo(x - 27, gy - 55); ctx.lineTo(x - 27, gy - 41); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 26, gy - 55); ctx.lineTo(x + 26, gy - 41); ctx.stroke();
  // Chimney
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x + 20, gy - 95, 12, 20);
  ctx.fillStyle = '#fff';
  ctx.fillRect(x + 18, gy - 97, 16, 4);
  // Smoke
  ctx.fillStyle = 'rgba(200,200,200,0.4)';
  for (let i = 0; i < 3; i++) {
    const sx = x + 26 + Math.sin(gameTime / 400 + i * 2) * 6;
    const sy = gy - 100 - i * 14 - Math.sin(gameTime / 300 + i) * 4;
    ctx.beginPath(); ctx.arc(sx, sy, 5 + i * 2, 0, Math.PI * 2); ctx.fill();
  }
  // "FINISH" banner
  ctx.fillStyle = '#dc2626'; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('FINISH', x, gy - 105);
}

function drawKitty(x, y, color, facing, walkFrame, accessory, eyeColor, hornColors) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);

  const bounce = walkFrame % 2 === 1 ? -2 : 0;

  // Body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, -12 + bounce, 16, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.beginPath();
  ctx.arc(0, -30 + bounce, 14, 0, Math.PI * 2);
  ctx.fill();

  // Ears
  ctx.beginPath();
  ctx.moveTo(-10, -40 + bounce);
  ctx.lineTo(-6, -50 + bounce);
  ctx.lineTo(-2, -40 + bounce);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(2, -40 + bounce);
  ctx.lineTo(6, -50 + bounce);
  ctx.lineTo(10, -40 + bounce);
  ctx.fill();

  // Inner ears
  ctx.fillStyle = '#fda4af';
  ctx.beginPath();
  ctx.moveTo(-8, -41 + bounce);
  ctx.lineTo(-6, -47 + bounce);
  ctx.lineTo(-4, -41 + bounce);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(4, -41 + bounce);
  ctx.lineTo(6, -47 + bounce);
  ctx.lineTo(8, -41 + bounce);
  ctx.fill();

  // Eyes (big!)
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.ellipse(-5, -32 + bounce, 5, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(5, -32 + bounce, 5, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pupils
  ctx.fillStyle = eyeColor || '#1e1b4b';
  ctx.beginPath();
  ctx.arc(-4, -31 + bounce, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(6, -31 + bounce, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Eye shine
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-3, -33 + bounce, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(7, -33 + bounce, 1, 0, Math.PI * 2);
  ctx.fill();

  // Mouth (happy)
  ctx.strokeStyle = '#831843';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(-2, -25 + bounce, 3, 0, Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(2, -25 + bounce, 3, 0, Math.PI);
  ctx.stroke();

  // Whiskers
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 0.8;
  for (let side = -1; side <= 1; side += 2) {
    ctx.beginPath();
    ctx.moveTo(side * 8, -28 + bounce);
    ctx.lineTo(side * 20, -30 + bounce);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(side * 8, -26 + bounce);
    ctx.lineTo(side * 20, -26 + bounce);
    ctx.stroke();
  }

  // Legs
  ctx.fillStyle = color;
  const legOffset = walkFrame % 4;
  const frontLeg = Math.sin(legOffset * Math.PI / 2) * 4;
  const backLeg = -frontLeg;
  ctx.fillRect(-10, -2 + bounce, 6, 6 + frontLeg);
  ctx.fillRect(4, -2 + bounce, 6, 6 + backLeg);

  // Tail
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-14, -8 + bounce);
  ctx.quadraticCurveTo(-24, -20 + bounce, -18, -28 + bounce + Math.sin(gameTime / 300) * 4);
  ctx.stroke();

  // Unicorn horn
  if (accessory === 'horn') {
    const hc = hornColors || ['#fbbf24', '#f472b6', '#a78bfa'];
    const hornGrad = ctx.createLinearGradient(0, -50 + bounce, 0, -58 + bounce);
    hornGrad.addColorStop(0, hc[0]);
    hornGrad.addColorStop(0.5, hc[1]);
    hornGrad.addColorStop(1, hc[2]);
    ctx.fillStyle = hornGrad;
    ctx.beginPath();
    ctx.moveTo(-3, -43 + bounce);
    ctx.lineTo(0, -58 + bounce);
    ctx.lineTo(3, -43 + bounce);
    ctx.closePath();
    ctx.fill();
    // Horn spiral lines
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 0.8;
    for (let i = 0; i < 3; i++) {
      const hy = -45 - i * 4 + bounce;
      ctx.beginPath();
      ctx.moveTo(-2, hy);
      ctx.lineTo(2, hy - 2);
      ctx.stroke();
    }
  }

  // NPC accessories
  if (accessory === 'bow') {
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(8, -42 + bounce, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(12, -42 + bounce, 3, 0, Math.PI * 2);
    ctx.fill();
  } else if (accessory === 'scarf') {
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(-10, -18 + bounce, 20, 5);
    ctx.fillRect(8, -18 + bounce, 4, 12);
  } else if (accessory === 'glasses') {
    ctx.strokeStyle = '#1e1b4b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(-5, -32 + bounce, 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(5, -32 + bounce, 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(1, -32 + bounce);
    ctx.lineTo(-1, -32 + bounce);
    ctx.stroke();
  } else if (accessory === 'flower') {
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(8, -44 + bounce, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f472b6';
    for (let a = 0; a < 5; a++) {
      const fa = (a / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(8 + Math.cos(fa) * 4, -44 + bounce + Math.sin(fa) * 4, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

// ── Oriental NC Drawing Functions ──

function drawOrientalSky(W, H, cycle, isNight) {
  // Warm sunset-toned sky over the Neuse River
  const dayTop = [100, 180, 240]; const nightTop = [12, 20, 40];
  const dayBot = [255, 160, 100]; const nightBot = [25, 20, 45];
  const skyTop = lerpColor(dayTop, nightTop, cycle);
  const skyBot = lerpColor(dayBot, nightBot, cycle);
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, `rgb(${skyTop})`); grad.addColorStop(0.6, `rgb(${skyBot})`);
  grad.addColorStop(1, '#2d6a8f');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  if (isNight) drawStars(W, H, cycle);
  drawCelestial(W, H, cycle);
  // Distant shoreline silhouette
  ctx.fillStyle = 'rgba(40,80,60,0.3)';
  ctx.beginPath(); ctx.moveTo(0, H * 0.55);
  for (let x = 0; x <= W; x += 20) {
    ctx.lineTo(x, H * 0.55 + Math.sin(x * 0.008) * 8 + Math.sin(x * 0.02) * 3);
  }
  ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
}

function drawOrientalWorld(W, H, cam) {
  const ww = getCurrentWorldW();
  // Neuse River water
  ctx.fillStyle = '#2d8faa';
  ctx.fillRect(0, GROUND_Y, ww, H);
  // Animated river waves
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 2;
  for (let wx = Math.floor((cam - 20) / 50) * 50; wx < cam + W + 50; wx += 50) {
    const wy = GROUND_Y + 6 + Math.sin(gameTime / 600 + wx * 0.04) * 2;
    ctx.beginPath(); ctx.moveTo(wx, wy); ctx.quadraticCurveTo(wx + 25, wy - 3, wx + 50, wy); ctx.stroke();
  }
  // Wooden dock walkway (ground)
  ctx.fillStyle = '#92400e';
  ctx.fillRect(0, GROUND_Y - 4, ww, 8);
  // Dock planks
  ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1;
  for (let dx = Math.floor((cam - 5) / 30) * 30; dx < cam + W + 5; dx += 30) {
    ctx.beginPath(); ctx.moveTo(dx, GROUND_Y - 4); ctx.lineTo(dx, GROUND_Y + 4); ctx.stroke();
  }
  // Draw scenes
  drawOrientalScenes(cam, W);
  // Platforms
  drawOrientalPlatforms();
  // Yarn balls
  drawOrientalYarnBalls();
  // NPCs
  for (const npc of orientalNpcs) drawKitty(npc.x, npc.y, npc.color, npc.facing, npc.walkFrame, npc.accessory);
  drawPlayerAndUI();
}

function drawOrientalPlatforms() {
  drawPlatformsWithStyle(levelOriental.platforms, '#92400e', '#78350f', function(p) {
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 0.5;
    for (let i = 0; i < 3; i++) {
      const gx = p.x + 8 + i * (p.w - 16) / 2;
      ctx.beginPath(); ctx.moveTo(gx, p.y + 2); ctx.lineTo(gx, p.y + 12); ctx.stroke();
    }
  });
}

function drawOrientalYarnBalls() { drawYarnBallsForLevel(levelOriental.yarnBalls); }

function drawOrientalScenes(cam, W) {
  for (const s of levelOriental.scenes) {
    if (s.x < cam - 250 || s.x > cam + W + 250) continue;
    switch (s.type) {
      case 'sailboat_docked': drawDockedSailboat(s.x); break;
      case 'shrimp_boat': drawShrimpBoat(s.x); break;
      case 'pine_tree': drawOrientalPine(s.x); break;
      case 'dock': drawWoodenDock(s.x); break;
      case 'pelican': drawPelican(s.x); break;
      case 'shell': if (!s.collected) drawShell(s.x); break;
      case 'sailboat_ride': drawSailboatRide(s.x); break;
      case 'dive_buoy': drawDiveBuoy(s.x); break;
      case 'oriental_dock_end': drawOrientalDockEnd(s.x); break;
    }
  }
}

function drawDockedSailboat(x) {
  const gy = GROUND_Y;
  const bob = Math.sin(gameTime / 800 + x) * 2;
  // Hull
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(x - 25, gy + 10 + bob); ctx.lineTo(x - 30, gy + 25 + bob);
  ctx.lineTo(x + 30, gy + 25 + bob); ctx.lineTo(x + 25, gy + 10 + bob);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#1e40af'; ctx.lineWidth = 1.5;
  ctx.stroke();
  // Mast
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x, gy + 10 + bob); ctx.lineTo(x, gy - 50 + bob); ctx.stroke();
  // Sail
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.beginPath();
  ctx.moveTo(x + 2, gy - 48 + bob); ctx.lineTo(x + 20, gy + 5 + bob);
  ctx.lineTo(x + 2, gy + 5 + bob); ctx.closePath(); ctx.fill();
}

function drawShrimpBoat(x) {
  const gy = GROUND_Y;
  const bob = Math.sin(gameTime / 900 + x * 0.5) * 2;
  // Hull — larger, working boat
  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.moveTo(x - 35, gy + 8 + bob); ctx.lineTo(x - 40, gy + 28 + bob);
  ctx.lineTo(x + 40, gy + 28 + bob); ctx.lineTo(x + 35, gy + 8 + bob);
  ctx.closePath(); ctx.fill();
  // Cabin
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(x - 10, gy - 15 + bob, 20, 23);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(x - 6, gy - 10 + bob, 5, 5);
  ctx.fillRect(x + 2, gy - 10 + bob, 5, 5);
  // Outrigger booms
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x, gy - 15 + bob); ctx.lineTo(x - 40, gy - 35 + bob); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x, gy - 15 + bob); ctx.lineTo(x + 40, gy - 35 + bob); ctx.stroke();
  // Nets hanging
  ctx.strokeStyle = 'rgba(180,160,140,0.5)'; ctx.lineWidth = 1;
  for (let n = 0; n < 3; n++) {
    const nx = x - 35 + n * 15;
    ctx.beginPath(); ctx.moveTo(nx, gy - 30 + bob); ctx.lineTo(nx + 5, gy + bob); ctx.stroke();
  }
  for (let n = 0; n < 3; n++) {
    const nx = x + 20 + n * 10;
    ctx.beginPath(); ctx.moveTo(nx, gy - 30 + bob); ctx.lineTo(nx + 5, gy + bob); ctx.stroke();
  }
}

function drawOrientalPine(x) {
  const gy = GROUND_Y;
  // Trunk
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x - 4, gy - 70, 8, 70);
  // Foliage — tiered
  ctx.fillStyle = '#166534';
  for (let i = 0; i < 3; i++) {
    const ty = gy - 40 - i * 22;
    const tw = 28 - i * 6;
    ctx.beginPath();
    ctx.moveTo(x - tw, ty); ctx.lineTo(x, ty - 25); ctx.lineTo(x + tw, ty);
    ctx.closePath(); ctx.fill();
  }
}

function drawWoodenDock(x) {
  const gy = GROUND_Y;
  // Dock extending into water
  ctx.fillStyle = '#92400e';
  ctx.fillRect(x - 20, gy - 2, 40, 35);
  // Planks
  ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1;
  for (let dy = 0; dy < 30; dy += 6) {
    ctx.beginPath(); ctx.moveTo(x - 20, gy + dy); ctx.lineTo(x + 20, gy + dy); ctx.stroke();
  }
  // Posts
  ctx.fillStyle = '#78350f';
  ctx.fillRect(x - 22, gy - 5, 5, 40);
  ctx.fillRect(x + 17, gy - 5, 5, 40);
}

function drawPelican(x) {
  const gy = GROUND_Y;
  const bob = Math.sin(gameTime / 500 + x) * 2;
  // Body
  ctx.fillStyle = '#f5f5f4';
  ctx.beginPath(); ctx.ellipse(x, gy - 18 + bob, 12, 10, 0, 0, Math.PI * 2); ctx.fill();
  // Head
  ctx.beginPath(); ctx.arc(x + 10, gy - 28 + bob, 7, 0, Math.PI * 2); ctx.fill();
  // Beak
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(x + 16, gy - 30 + bob); ctx.lineTo(x + 28, gy - 26 + bob);
  ctx.lineTo(x + 16, gy - 24 + bob); ctx.closePath(); ctx.fill();
  // Pouch
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.moveTo(x + 16, gy - 26 + bob);
  ctx.quadraticCurveTo(x + 22, gy - 20 + bob, x + 16, gy - 24 + bob);
  ctx.fill();
  // Eye
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath(); ctx.arc(x + 12, gy - 30 + bob, 1.5, 0, Math.PI * 2); ctx.fill();
  // Legs
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(x - 4, gy - 8 + bob); ctx.lineTo(x - 6, gy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 4, gy - 8 + bob); ctx.lineTo(x + 6, gy); ctx.stroke();
}

function drawShell(x) {
  const gy = GROUND_Y;
  const bob = Math.sin(gameTime / 400 + x * 0.1) * 2;
  // Shell shape
  ctx.fillStyle = '#fda4af';
  ctx.beginPath(); ctx.arc(x, gy - 6 + bob, 8, Math.PI, 0); ctx.fill();
  // Ridges
  ctx.strokeStyle = '#f472b6'; ctx.lineWidth = 0.8;
  for (let r = 0; r < 4; r++) {
    const ra = Math.PI + r * (Math.PI / 4);
    ctx.beginPath();
    ctx.moveTo(x, gy - 6 + bob);
    ctx.lineTo(x + Math.cos(ra) * 8, gy - 6 + bob + Math.sin(ra) * 8);
    ctx.stroke();
  }
  // Sparkle
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.beginPath(); ctx.arc(x - 2, gy - 9 + bob, 2, 0, Math.PI * 2); ctx.fill();
}

function drawSailboatRide(x) {
  const gy = GROUND_Y;
  const bob = Math.sin(gameTime / 700) * 3;
  // Larger sailboat for riding
  ctx.fillStyle = '#e0f2fe';
  ctx.beginPath();
  ctx.moveTo(x - 35, gy + 8 + bob); ctx.lineTo(x - 40, gy + 30 + bob);
  ctx.lineTo(x + 40, gy + 30 + bob); ctx.lineTo(x + 35, gy + 8 + bob);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#0284c7'; ctx.lineWidth = 2; ctx.stroke();
  // Mast
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x, gy + 5 + bob); ctx.lineTo(x, gy - 60 + bob); ctx.stroke();
  // Sail
  const sailPuff = Math.sin(gameTime / 1000) * 5;
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(x + 2, gy - 58 + bob); ctx.quadraticCurveTo(x + 30 + sailPuff, gy - 25 + bob, x + 2, gy + bob);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.1)'; ctx.lineWidth = 1; ctx.stroke();
  // Flag
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.moveTo(x, gy - 60 + bob); ctx.lineTo(x + 12, gy - 55 + bob);
  ctx.lineTo(x, gy - 50 + bob); ctx.closePath(); ctx.fill();
  // "Board" prompt arrow
  ctx.fillStyle = '#fbbf24';
  const arrowBob = Math.sin(gameTime / 300) * 3;
  ctx.beginPath();
  ctx.moveTo(x, gy - 70 + arrowBob); ctx.lineTo(x - 6, gy - 80 + arrowBob);
  ctx.lineTo(x + 6, gy - 80 + arrowBob); ctx.closePath(); ctx.fill();
}

function drawDiveBuoy(x) {
  const gy = GROUND_Y;
  const bob = Math.sin(gameTime / 500 + 2) * 3;
  // Buoy
  ctx.fillStyle = '#ef4444';
  ctx.beginPath(); ctx.arc(x, gy + 5 + bob, 12, 0, Math.PI * 2); ctx.fill();
  // White stripe
  ctx.fillStyle = '#fff';
  ctx.fillRect(x - 12, gy + 2 + bob, 24, 6);
  // Dive flag
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(x - 2, gy - 25 + bob, 4, 30);
  ctx.fillRect(x + 2, gy - 25 + bob, 14, 10);
  // White diagonal on flag
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 2, gy - 25 + bob); ctx.lineTo(x + 16, gy - 15 + bob);
  ctx.stroke();
  // Label
  ctx.fillStyle = '#fff'; ctx.font = 'bold 9px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('DIVE', x, gy - 28 + bob);
}

function drawOrientalDockEnd(x) {
  // Sign pointing to Alps
  ctx.fillStyle = '#92400e';
  ctx.fillRect(x - 3, GROUND_Y - 50, 6, 50);
  ctx.fillStyle = '#fde68a';
  ctx.beginPath(); ctx.roundRect(x - 30, GROUND_Y - 55, 60, 20, 4); ctx.fill();
  ctx.fillStyle = '#78350f'; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('To Alps →', x, GROUND_Y - 41);
}

// ── Sailing Scene ──
function drawSailingScene(cam, W, H) {
  const cx = cam + W / 2;
  const cy = GROUND_Y;
  // Open water background
  const grad = ctx.createLinearGradient(cx - W / 2, 0, cx - W / 2, H);
  grad.addColorStop(0, '#60a5fa'); grad.addColorStop(0.4, '#38bdf8');
  grad.addColorStop(0.5, '#0ea5e9'); grad.addColorStop(1, '#0369a1');
  ctx.fillStyle = grad; ctx.fillRect(cx - W / 2, 0, W, H);
  // Distant shore
  ctx.fillStyle = 'rgba(34,85,55,0.4)';
  ctx.beginPath(); ctx.moveTo(cx - W / 2, H * 0.35);
  for (let x = 0; x <= W; x += 15) {
    ctx.lineTo(cx - W / 2 + x, H * 0.35 + Math.sin(x * 0.01 + gameTime / 2000) * 6);
  }
  ctx.lineTo(cx + W / 2, H * 0.4); ctx.lineTo(cx - W / 2, H * 0.4); ctx.fill();
  // Animated waves
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.5;
  for (let wx = cx - W / 2; wx < cx + W / 2; wx += 40) {
    for (let row = 0; row < 4; row++) {
      const wy = H * 0.45 + row * 30 + Math.sin(gameTime / 500 + wx * 0.03 + row) * 4;
      ctx.beginPath(); ctx.moveTo(wx, wy); ctx.quadraticCurveTo(wx + 20, wy - 3, wx + 40, wy); ctx.stroke();
    }
  }
  // Sailboat (center of screen)
  const bob = Math.sin(gameTime / 700) * 4;
  const tilt = sailAngle * 0.3;
  ctx.save();
  ctx.translate(cx, cy + 20 + bob);
  ctx.rotate(tilt);
  // Hull
  ctx.fillStyle = '#f0f9ff';
  ctx.beginPath();
  ctx.moveTo(-40, 0); ctx.lineTo(-45, 20); ctx.lineTo(45, 20); ctx.lineTo(40, 0);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#0284c7'; ctx.lineWidth = 2; ctx.stroke();
  // Wake
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(-45, 20); ctx.quadraticCurveTo(-60, 30, -80, 25); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(45, 20); ctx.quadraticCurveTo(60, 30, 80, 25); ctx.stroke();
  // Mast
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, -5); ctx.lineTo(0, -80); ctx.stroke();
  // Sail billowing with wind
  const puff = Math.sin(gameTime / 800) * 8 + sailAngle * 20;
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(2, -78); ctx.quadraticCurveTo(35 + puff, -40, 2, -5);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.1)'; ctx.lineWidth = 1; ctx.stroke();
  // Flag
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath(); ctx.moveTo(0, -80); ctx.lineTo(15, -75); ctx.lineTo(0, -70); ctx.closePath(); ctx.fill();
  ctx.restore();
  // Draw Sparkle on the boat
  drawKitty(cx, cy + 5 + bob, player.color, player.facing, player.walkFrame, 'horn', playerEyeColor, playerHornColors);
  // Dolphin in background
  const dx = cx - 200 + Math.sin(gameTime / 2000) * 150;
  const dy = cy + 60 + Math.sin(gameTime / 600 + 1) * 15;
  ctx.fillStyle = '#6b7280';
  ctx.beginPath(); ctx.ellipse(dx, dy, 18, 8, 0, 0, Math.PI * 2); ctx.fill();
  // Dolphin fin
  ctx.beginPath(); ctx.moveTo(dx - 2, dy - 8); ctx.lineTo(dx + 5, dy - 18);
  ctx.lineTo(dx + 8, dy - 8); ctx.fill();
}

// ── Scuba Diving Scene ──
function drawScubaDivingScene(cam, W, H) {
  const cx = cam;
  // Underwater gradient background
  const grad = ctx.createLinearGradient(cx, 0, cx, H);
  grad.addColorStop(0, '#0e7490'); grad.addColorStop(0.3, '#0891b2');
  grad.addColorStop(0.7, '#164e63'); grad.addColorStop(1, '#0f172a');
  ctx.fillStyle = grad; ctx.fillRect(cx, 0, W, H);
  // Light rays from surface
  ctx.globalAlpha = 0.08;
  for (let r = 0; r < 5; r++) {
    const rx = cx + 100 + r * (W / 5) + Math.sin(gameTime / 3000 + r) * 30;
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(rx - 10, 0); ctx.lineTo(rx + 10, 0);
    ctx.lineTo(rx + 30 + r * 5, H); ctx.lineTo(rx - 30 - r * 5, H);
    ctx.closePath(); ctx.fill();
  }
  ctx.globalAlpha = 1;
  // Sea floor
  ctx.fillStyle = '#854d0e';
  ctx.fillRect(cx, SCUBA_WORLD_H - 30, SCUBA_WORLD_W, 60);
  // Sand texture
  ctx.fillStyle = '#a16207';
  for (let sx = cx; sx < cx + SCUBA_WORLD_W; sx += 8) {
    if (Math.sin(sx * 7.3) > 0.5) {
      ctx.beginPath(); ctx.arc(sx, SCUBA_WORLD_H - 25 + Math.sin(sx * 3) * 3, 1.5, 0, Math.PI * 2); ctx.fill();
    }
  }
  // Seagrass beds — swaying
  ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2; ctx.lineCap = 'round';
  for (let gx = cx + 30; gx < cx + SCUBA_WORLD_W; gx += 25) {
    const sway = Math.sin(gameTime / 800 + gx * 0.1) * 8;
    const gh = 20 + Math.sin(gx * 2.1) * 12;
    ctx.strokeStyle = Math.sin(gx * 1.7) > 0 ? '#22c55e' : '#16a34a';
    ctx.beginPath();
    ctx.moveTo(gx, SCUBA_WORLD_H - 30);
    ctx.quadraticCurveTo(gx + sway, SCUBA_WORLD_H - 30 - gh / 2, gx + sway * 0.7, SCUBA_WORLD_H - 30 - gh);
    ctx.stroke();
  }
  // Oyster reef formations
  drawOysterReef(cx + 200, SCUBA_WORLD_H - 50);
  drawOysterReef(cx + 600, SCUBA_WORLD_H - 60);
  drawOysterReef(cx + 1000, SCUBA_WORLD_H - 45);
  // Coral formations
  drawCoral(cx + 350, SCUBA_WORLD_H - 40, '#f472b6');
  drawCoral(cx + 500, SCUBA_WORLD_H - 50, '#fb923c');
  drawCoral(cx + 800, SCUBA_WORLD_H - 35, '#c084fc');
  drawCoral(cx + 1100, SCUBA_WORLD_H - 45, '#f43f5e');
  // Shipwreck silhouette (USS Oriental)
  drawShipwreck(cx + 750, SCUBA_WORLD_H - 70);
  // Marine life — fish swimming
  drawSwimmingFish(cx, W);
  // Sea turtles
  drawScubaTurtle(cx + 300 + Math.sin(gameTime / 3000) * 100, 150 + Math.sin(gameTime / 2000) * 30);
  drawScubaTurtle(cx + 900 + Math.sin(gameTime / 4000 + 2) * 80, 250 + Math.sin(gameTime / 2500 + 1) * 25);
  // Seahorses near seagrass
  drawSeahorse(cx + 150, SCUBA_WORLD_H - 80 + Math.sin(gameTime / 600) * 5);
  drawSeahorse(cx + 550, SCUBA_WORLD_H - 90 + Math.sin(gameTime / 700 + 1) * 5);
  drawSeahorse(cx + 1050, SCUBA_WORLD_H - 75 + Math.sin(gameTime / 650 + 2) * 5);
  // Blue crabs on sea floor
  drawBlueCrab(cx + 100, SCUBA_WORLD_H - 35);
  drawBlueCrab(cx + 450, SCUBA_WORLD_H - 33);
  drawBlueCrab(cx + 850, SCUBA_WORLD_H - 36);
  // Dolphins in background
  ctx.globalAlpha = 0.3;
  const dolphX = cx + 600 + Math.sin(gameTime / 5000) * 300;
  const dolphY = 60 + Math.sin(gameTime / 1500) * 20;
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath(); ctx.ellipse(dolphX, dolphY, 25, 10, 0.1, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(dolphX - 5, dolphY - 10); ctx.lineTo(dolphX + 5, dolphY - 22);
  ctx.lineTo(dolphX + 10, dolphY - 10); ctx.fill();
  ctx.globalAlpha = 1;
  // Collectibles (pearls/shells)
  for (const c of scubaCollectibles) {
    if (c.collected) continue;
    const bob = Math.sin(gameTime / 400 + c.x * 0.1) * 3;
    ctx.globalAlpha = 0.3; ctx.fillStyle = c.color;
    ctx.beginPath(); ctx.arc(cx + c.x, c.y + bob, 16, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1; ctx.fillStyle = c.color;
    ctx.beginPath(); ctx.arc(cx + c.x, c.y + bob, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath(); ctx.arc(cx + c.x - 3, c.y + bob - 3, 3, 0, Math.PI * 2); ctx.fill();
  }
  // Draw mercats
  for (const mc of scubaMercats) {
    drawMercat(cx + mc.x, mc.y, mc.tailColor, mc.facing, mc.name);
  }
  // Draw mercat speech bubbles
  for (const bubble of activeSpeechBubbles) {
    const npc = bubble.npc;
    if (!scubaMercats.includes(npc)) continue;
    const alpha = Math.min(1, bubble.life / 800);
    ctx.globalAlpha = alpha;
    ctx.font = '11px system-ui';
    const maxWidth = 160;
    const words = bubble.text.split(' ');
    const lines = []; let currentLine = '';
    for (const word of words) {
      const testLine = currentLine ? currentLine + ' ' + word : word;
      if (ctx.measureText(testLine).width > maxWidth) { lines.push(currentLine); currentLine = word; }
      else currentLine = testLine;
    }
    if (currentLine) lines.push(currentLine);
    const lineHeight = 14;
    const padX = 10, padY = 6;
    const boxW = Math.min(maxWidth + padX * 2, Math.max(...lines.map(l => ctx.measureText(l).width)) + padX * 2);
    const boxH = lines.length * lineHeight + padY * 2;
    const bx = cx + npc.x - boxW / 2;
    const by = Math.max(50, npc.y - 50 - boxH);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath(); ctx.roundRect(bx, by, boxW, boxH, 8); ctx.fill();
    ctx.fillStyle = '#1f2937'; ctx.textAlign = 'center';
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], cx + npc.x, by + padY + 11 + i * lineHeight);
    }
    ctx.globalAlpha = 1;
  }
  // Player (scuba Sparkle) with bubble trail
  const px = cx + scubaPlayer.x;
  const py = scubaPlayer.y;
  // Bubble trail
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  for (let b = 0; b < 4; b++) {
    const bx2 = px - player.facing * (10 + b * 8) + Math.sin(gameTime / 200 + b) * 3;
    const by2 = py - 30 - b * 10 + Math.sin(gameTime / 300 + b * 2) * 2;
    ctx.beginPath(); ctx.arc(bx2, by2, 2 + b * 0.5, 0, Math.PI * 2); ctx.fill();
  }
  drawKitty(px, py, player.color, player.facing, player.walkFrame, 'horn', playerEyeColor, playerHornColors);
  // Scuba mask on Sparkle
  ctx.save(); ctx.translate(px, py); ctx.scale(player.facing, 1);
  ctx.strokeStyle = '#0ea5e9'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(0, -32, 10, 8, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
  // HUD for scuba
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath(); ctx.roundRect(cx + 10, 10, 120, 30, 8); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
  ctx.fillText(`Pearls: ${scubaPearlCount}`, cx + 20, 30);
}

function drawMercat(x, y, tailColor, facing, name) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  const bob = Math.sin(gameTime / 600 + x * 0.01) * 4;
  // Fish tail
  ctx.fillStyle = tailColor;
  ctx.beginPath();
  ctx.moveTo(0, 5 + bob); ctx.quadraticCurveTo(-15, 20 + bob, -25, 30 + bob);
  ctx.quadraticCurveTo(-15, 35 + bob, -5, 25 + bob);
  ctx.quadraticCurveTo(5, 35 + bob, 15, 30 + bob);
  ctx.quadraticCurveTo(5, 20 + bob, 0, 5 + bob);
  ctx.fill();
  // Tail fin
  ctx.beginPath();
  ctx.moveTo(-25, 30 + bob);
  ctx.quadraticCurveTo(-35, 25 + bob, -40, 18 + bob);
  ctx.quadraticCurveTo(-30, 28 + bob, -25, 30 + bob);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-25, 30 + bob);
  ctx.quadraticCurveTo(-35, 35 + bob, -40, 42 + bob);
  ctx.quadraticCurveTo(-30, 32 + bob, -25, 30 + bob);
  ctx.fill();
  // Scales shimmer
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  for (let s = 0; s < 5; s++) {
    const sx = -5 - s * 4; const sy = 10 + s * 4 + bob;
    ctx.beginPath(); ctx.arc(sx, sy, 2, 0, Math.PI * 2); ctx.fill();
  }
  // Upper body (cat-like)
  ctx.fillStyle = '#fda4af';
  ctx.beginPath(); ctx.ellipse(0, -8 + bob, 12, 14, 0, 0, Math.PI * 2); ctx.fill();
  // Head
  ctx.beginPath(); ctx.arc(0, -26 + bob, 12, 0, Math.PI * 2); ctx.fill();
  // Cat ears
  ctx.beginPath();
  ctx.moveTo(-8, -35 + bob); ctx.lineTo(-5, -44 + bob); ctx.lineTo(-2, -35 + bob); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(2, -35 + bob); ctx.lineTo(5, -44 + bob); ctx.lineTo(8, -35 + bob); ctx.fill();
  // Inner ears
  ctx.fillStyle = tailColor;
  ctx.beginPath(); ctx.moveTo(-6, -36 + bob); ctx.lineTo(-5, -41 + bob); ctx.lineTo(-4, -36 + bob); ctx.fill();
  ctx.beginPath(); ctx.moveTo(4, -36 + bob); ctx.lineTo(5, -41 + bob); ctx.lineTo(6, -36 + bob); ctx.fill();
  // Starfish hair clip with sparkle
  const starX = 9; const starY = -38 + bob;
  ctx.fillStyle = '#fbbf24';
  for (let p = 0; p < 5; p++) {
    const a = (p / 5) * Math.PI * 2 - Math.PI / 2;
    const ox = Math.cos(a) * 5; const oy = Math.sin(a) * 5;
    ctx.beginPath(); ctx.moveTo(starX, starY);
    ctx.lineTo(starX + ox, starY + oy);
    ctx.lineTo(starX + Math.cos(a + 0.3) * 2.5, starY + Math.sin(a + 0.3) * 2.5);
    ctx.closePath(); ctx.fill();
  }
  // Sparkle on starfish
  const sparkle = Math.sin(gameTime / 200 + x) * 0.5 + 0.5;
  ctx.globalAlpha = sparkle;
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(starX + 2, starY - 3, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(starX + 2, starY - 6); ctx.lineTo(starX + 2, starY);
  ctx.moveTo(starX - 1, starY - 3); ctx.lineTo(starX + 5, starY - 3);
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 0.8; ctx.stroke();
  ctx.globalAlpha = 1;
  // Eyes
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(-4, -28 + bob, 4, 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(4, -28 + bob, 4, 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath(); ctx.arc(-3, -27 + bob, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(5, -27 + bob, 2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(-2, -29 + bob, 0.8, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(6, -29 + bob, 0.8, 0, Math.PI * 2); ctx.fill();
  // Mouth
  ctx.strokeStyle = '#831843'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(-1, -22 + bob, 2.5, 0, Math.PI); ctx.stroke();
  ctx.beginPath(); ctx.arc(1, -22 + bob, 2.5, 0, Math.PI); ctx.stroke();
  // Whiskers
  ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 0.7;
  for (let side = -1; side <= 1; side += 2) {
    ctx.beginPath(); ctx.moveTo(side * 7, -25 + bob); ctx.lineTo(side * 16, -27 + bob); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(side * 7, -23 + bob); ctx.lineTo(side * 16, -23 + bob); ctx.stroke();
  }
  ctx.restore();
}

function drawOysterReef(x, y) {
  // Cluster of oyster shells
  ctx.fillStyle = '#78716c';
  for (let i = 0; i < 5; i++) {
    const ox = x + Math.sin(i * 2.5) * 15;
    const oy = y + Math.cos(i * 1.7) * 5;
    ctx.beginPath(); ctx.ellipse(ox, oy, 8, 5, i * 0.5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.strokeStyle = '#a8a29e'; ctx.lineWidth = 0.5;
  for (let i = 0; i < 5; i++) {
    const ox = x + Math.sin(i * 2.5) * 15;
    const oy = y + Math.cos(i * 1.7) * 5;
    ctx.beginPath(); ctx.ellipse(ox, oy, 8, 5, i * 0.5, 0, Math.PI * 2); ctx.stroke();
  }
}

function drawCoral(x, y, color) {
  ctx.fillStyle = color;
  // Branching coral
  ctx.beginPath();
  ctx.moveTo(x, y); ctx.lineTo(x - 8, y - 20); ctx.lineTo(x - 4, y - 15); ctx.lineTo(x - 2, y - 25);
  ctx.lineTo(x + 2, y - 18); ctx.lineTo(x + 6, y - 22); ctx.lineTo(x + 10, y - 12);
  ctx.lineTo(x + 5, y); ctx.closePath(); ctx.fill();
  // Tips
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.beginPath(); ctx.arc(x - 8, y - 20, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x - 2, y - 25, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 6, y - 22, 2, 0, Math.PI * 2); ctx.fill();
}

function drawShipwreck(x, y) {
  ctx.globalAlpha = 0.5;
  // Tilted hull
  ctx.fillStyle = '#44403c';
  ctx.save(); ctx.translate(x, y); ctx.rotate(0.15);
  ctx.beginPath();
  ctx.moveTo(-50, 0); ctx.lineTo(-60, 20); ctx.lineTo(60, 20); ctx.lineTo(50, 0);
  ctx.closePath(); ctx.fill();
  // Broken mast
  ctx.strokeStyle = '#57534e'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(-15, -35); ctx.stroke();
  // Broken beam
  ctx.beginPath(); ctx.moveTo(-15, -35); ctx.lineTo(5, -25); ctx.stroke();
  // Portholes
  ctx.fillStyle = '#292524';
  ctx.beginPath(); ctx.arc(-20, 8, 4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(0, 8, 4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(20, 8, 4, 0, Math.PI * 2); ctx.fill();
  // Seaweed growing on wreck
  ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(30, 5); ctx.quadraticCurveTo(35, -10, 32, -20); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-30, 5); ctx.quadraticCurveTo(-35, -5, -38, -15); ctx.stroke();
  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawSwimmingFish(cam, W) {
  const fishColors = ['#fb923c', '#38bdf8', '#4ade80', '#fbbf24', '#f472b6', '#a78bfa'];
  // Schools of fish
  for (let i = 0; i < 12; i++) {
    const fx = cam + 100 + i * 95 + Math.sin(gameTime / 1200 + i * 1.5) * 40;
    const fy = 100 + i * 30 + Math.sin(gameTime / 800 + i * 2) * 20;
    const color = fishColors[i % fishColors.length];
    const facing = Math.cos(gameTime / 1200 + i * 1.5) > 0 ? 1 : -1;
    const size = 8 + (i % 3) * 3;
    ctx.fillStyle = color;
    ctx.save(); ctx.translate(fx, fy); ctx.scale(facing, 1);
    ctx.beginPath(); ctx.ellipse(0, 0, size, size * 0.5, 0, 0, Math.PI * 2); ctx.fill();
    // Tail
    ctx.beginPath();
    ctx.moveTo(-size, 0); ctx.lineTo(-size - 5, -4); ctx.lineTo(-size - 5, 4); ctx.closePath(); ctx.fill();
    // Eye
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(size * 0.4, -1, 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath(); ctx.arc(size * 0.5, -1, 1, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

function drawScubaTurtle(x, y) {
  const swim = Math.sin(gameTime / 1000 + x * 0.01);
  ctx.save(); ctx.translate(x, y);
  // Shell
  ctx.fillStyle = '#65a30d';
  ctx.beginPath(); ctx.ellipse(0, 0, 20, 15, 0, 0, Math.PI * 2); ctx.fill();
  // Shell pattern
  ctx.strokeStyle = '#4d7c0f'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.ellipse(0, 0, 14, 10, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(0, 0, 8, 5, 0, 0, Math.PI * 2); ctx.stroke();
  // Head
  ctx.fillStyle = '#84cc16';
  ctx.beginPath(); ctx.arc(22, -2, 7, 0, Math.PI * 2); ctx.fill();
  // Eye
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath(); ctx.arc(25, -4, 1.5, 0, Math.PI * 2); ctx.fill();
  // Flippers
  ctx.fillStyle = '#84cc16';
  const flipAngle = swim * 0.3;
  ctx.save(); ctx.rotate(flipAngle);
  ctx.beginPath(); ctx.ellipse(10, -15, 12, 4, -0.3, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  ctx.save(); ctx.rotate(-flipAngle);
  ctx.beginPath(); ctx.ellipse(10, 15, 12, 4, 0.3, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  ctx.beginPath(); ctx.ellipse(-15, -10, 8, 3, -0.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(-15, 10, 8, 3, 0.5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawSeahorse(x, y) {
  ctx.save(); ctx.translate(x, y);
  const bob = Math.sin(gameTime / 500 + x * 0.05) * 2;
  // Body — S-curve
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(0, -15 + bob);
  ctx.quadraticCurveTo(8, -5 + bob, 4, 5 + bob);
  ctx.quadraticCurveTo(0, 12 + bob, -4, 18 + bob);
  ctx.quadraticCurveTo(-8, 22 + bob, -6, 25 + bob);
  ctx.quadraticCurveTo(-2, 22 + bob, 0, 18 + bob);
  ctx.quadraticCurveTo(6, 12 + bob, 8, 5 + bob);
  ctx.quadraticCurveTo(12, -5 + bob, 4, -15 + bob);
  ctx.closePath(); ctx.fill();
  // Head
  ctx.beginPath(); ctx.arc(2, -18 + bob, 5, 0, Math.PI * 2); ctx.fill();
  // Snout
  ctx.fillRect(5, -20 + bob, 6, 3);
  // Eye
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath(); ctx.arc(3, -19 + bob, 1.2, 0, Math.PI * 2); ctx.fill();
  // Crown/spikes
  ctx.fillStyle = '#f59e0b';
  for (let s = 0; s < 3; s++) {
    ctx.beginPath();
    ctx.moveTo(-1 + s * 3, -22 + bob); ctx.lineTo(s * 3, -26 + bob); ctx.lineTo(1 + s * 3, -22 + bob);
    ctx.closePath(); ctx.fill();
  }
  // Dorsal fin
  ctx.fillStyle = 'rgba(245,158,11,0.5)';
  const finWave = Math.sin(gameTime / 200 + x) * 2;
  ctx.beginPath();
  ctx.moveTo(6, -10 + bob); ctx.quadraticCurveTo(12 + finWave, -5 + bob, 6, 0 + bob);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

function drawBlueCrab(x, y) {
  ctx.save(); ctx.translate(x, y);
  const walk = Math.sin(gameTime / 300 + x * 0.1) * 2;
  // Body
  ctx.fillStyle = '#2563eb';
  ctx.beginPath(); ctx.ellipse(0, 0, 10, 7, 0, 0, Math.PI * 2); ctx.fill();
  // Eyes on stalks
  ctx.fillStyle = '#1e40af';
  ctx.fillRect(-5, -8, 2, 4); ctx.fillRect(3, -8, 2, 4);
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(-4, -9, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(4, -9, 1.5, 0, Math.PI * 2); ctx.fill();
  // Claws
  ctx.fillStyle = '#3b82f6';
  ctx.beginPath(); ctx.arc(-14 + walk, -3, 4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(14 - walk, -3, 4, 0, Math.PI * 2); ctx.fill();
  // Legs
  ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 1;
  for (let l = 0; l < 3; l++) {
    const lx = -6 + l * 3;
    ctx.beginPath(); ctx.moveTo(lx, 5); ctx.lineTo(lx - 5 + walk, 10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-lx, 5); ctx.lineTo(-lx + 5 - walk, 10); ctx.stroke();
  }
  ctx.restore();
}

// ── Campground Drawing Functions ──

function drawCampgroundSky(W, H, cycle, isNight) {
  const dayTop = [50, 120, 60]; const nightTop = [10, 20, 35];
  const dayBot = [140, 200, 100]; const nightBot = [20, 30, 45];
  const skyTop = lerpColor(dayTop, nightTop, cycle);
  const skyBot = lerpColor(dayBot, nightBot, cycle);
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, `rgb(${skyTop})`); grad.addColorStop(0.7, `rgb(${skyBot})`);
  grad.addColorStop(1, '#4a7c3f');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  if (isNight) drawStars(W, H, cycle);
  if (isNight) drawRainbow(W, H, 0);
  drawCelestial(W, H, cycle);
}

function drawCampgroundWorld(W, H, cam) {
  const ww = getCurrentWorldW();
  // Forest floor
  ctx.fillStyle = '#4a7c3f';
  ctx.fillRect(0, GROUND_Y, ww, H);
  // Dirt path
  ctx.fillStyle = '#8B7355';
  ctx.fillRect(0, GROUND_Y - 2, ww, 6);
  // Grass details
  ctx.fillStyle = '#5c9c4a';
  for (let gx = Math.floor((cam - 10) / 60) * 60; gx < cam + W + 10; gx += 60) {
    ctx.beginPath(); ctx.arc(gx + 15, GROUND_Y + 2, 3, Math.PI, 0); ctx.fill();
    ctx.beginPath(); ctx.arc(gx + 40, GROUND_Y + 1, 2.5, Math.PI, 0); ctx.fill();
  }

  // Background pine trees (far back, parallax)
  ctx.fillStyle = '#2d5a27';
  for (let tx = Math.floor((cam * 0.3) / 100) * 100 - 100; tx < cam * 0.3 + W + 100; tx += 100) {
    const px = tx / 0.3;
    const th = 80 + Math.sin(tx * 0.7) * 20;
    ctx.beginPath();
    ctx.moveTo(px - 20, GROUND_Y);
    ctx.lineTo(px, GROUND_Y - th);
    ctx.lineTo(px + 20, GROUND_Y);
    ctx.fill();
  }

  drawCampgroundScenes(cam, W);
  drawCampgroundPlatforms();
  drawCampgroundYarnBalls();
  for (const npc of campNpcs) drawKitty(npc.x, npc.y, npc.color, npc.facing, npc.walkFrame, npc.accessory);
  drawPlayerAndUI();
}

function drawCampgroundPlatforms() {
  drawPlatformsWithStyle(level6.platforms, '#8B7355', '#6B5440', function(p) {
    ctx.fillStyle = '#5c9c4a';
    for (let i = 0; i < 2; i++) {
      const mx = p.x + 8 + i * (p.w - 16);
      ctx.beginPath(); ctx.arc(mx, p.y + 2, 3, Math.PI, 0); ctx.fill();
    }
  });
}

function drawCampgroundYarnBalls() { drawYarnBallsForLevel(level6.yarnBalls); }

function drawCampgroundScenes(cam, W) {
  // Pine trees scattered throughout
  const treePosns = [300, 600, 1000, 1500, 1800, 2400, 2700, 3200, 3600, 4200, 4600];
  for (const tx of treePosns) {
    if (tx < cam - 100 || tx > cam + W + 100) continue;
    drawCampPineTree(tx);
  }

  // Stick piles
  for (let i = 0; i < STICK_POSITIONS.length; i++) {
    const sx = STICK_POSITIONS[i];
    if (sx < cam - 50 || sx > cam + W + 50) continue;
    if (!level6.sticksCollected[i]) drawStickPile(sx);
  }

  // Fire pit
  if (FIRE_PIT_POS.x > cam - 100 && FIRE_PIT_POS.x < cam + W + 100) {
    drawFirePit(FIRE_PIT_POS.x);
  }

  // Hammock
  if (HAMMOCK_POS.x > cam - 120 && HAMMOCK_POS.x < cam + W + 120) {
    drawHammock(HAMMOCK_POS.x);
  }

  // Bigfoot
  if (BIGFOOT_POS.x > cam - 80 && BIGFOOT_POS.x < cam + W + 80) {
    drawBigfoot(BIGFOOT_POS.x);
  }

  // Dig site / pool
  if (DIG_SITE_POS.x > cam - 100 && DIG_SITE_POS.x < cam + W + 100) {
    drawDigSite(DIG_SITE_POS.x);
  }

  // Water pump
  if (WATER_PUMP_POS.x > cam - 60 && WATER_PUMP_POS.x < cam + W + 60) {
    drawWaterPump(WATER_PUMP_POS.x);
  }

  // Camp camper (drawn from image)
  if (CAMP_CAMPER_POS.x > cam - 200 && CAMP_CAMPER_POS.x < cam + W + 100) {
    drawCampCamper(CAMP_CAMPER_POS.x);
  }
}

function drawCampPineTree(x) {
  const gy = GROUND_Y;
  // Trunk
  ctx.fillStyle = '#5c3a1e';
  ctx.fillRect(x - 5, gy - 70, 10, 70);
  // Layers of branches
  const greens = ['#1a5c1a', '#228B22', '#2d8b2d'];
  for (let i = 0; i < 3; i++) {
    const ly = gy - 40 - i * 25;
    const lw = 35 - i * 8;
    ctx.fillStyle = greens[i];
    ctx.beginPath();
    ctx.moveTo(x - lw, ly);
    ctx.lineTo(x, ly - 30);
    ctx.lineTo(x + lw, ly);
    ctx.closePath();
    ctx.fill();
  }
}

function drawStickPile(x) {
  const gy = GROUND_Y;
  ctx.strokeStyle = '#8B6914'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  // Scattered sticks
  ctx.beginPath(); ctx.moveTo(x - 12, gy - 2); ctx.lineTo(x + 8, gy - 10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 5, gy - 1); ctx.lineTo(x - 10, gy - 14); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 5, gy - 3); ctx.lineTo(x + 15, gy - 8); ctx.stroke();
  ctx.strokeStyle = '#6B5210'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x - 8, gy - 5); ctx.lineTo(x + 12, gy - 16); ctx.stroke();
}

function drawFirePit(x) {
  const gy = GROUND_Y;
  // Stone ring
  ctx.fillStyle = '#6b7280';
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const sx = x + Math.cos(angle) * 22;
    const sy = gy - 5 + Math.sin(angle) * 8;
    ctx.beginPath(); ctx.ellipse(sx, sy, 6, 4, 0, 0, Math.PI * 2); ctx.fill();
  }
  // Inner dirt
  ctx.fillStyle = '#4a3728';
  ctx.beginPath(); ctx.ellipse(x, gy - 5, 18, 7, 0, 0, Math.PI * 2); ctx.fill();

  if (campfire.lit) {
    // Logs
    ctx.fillStyle = '#5c3a1e';
    ctx.save(); ctx.translate(x, gy - 8);
    ctx.rotate(-0.3); ctx.fillRect(-15, -3, 30, 6); ctx.restore();
    ctx.save(); ctx.translate(x, gy - 8);
    ctx.rotate(0.3); ctx.fillRect(-15, -3, 30, 6); ctx.restore();
    // Fire flames
    const flicker = Math.sin(gameTime / 100) * 3;
    const flicker2 = Math.cos(gameTime / 130) * 2;
    // Outer fire glow
    ctx.globalAlpha = 0.15 + Math.sin(gameTime / 200) * 0.05;
    ctx.fillStyle = '#f97316';
    ctx.beginPath(); ctx.ellipse(x, gy - 15, 35, 25, 0, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
    // Orange flames
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(x - 12, gy - 8);
    ctx.quadraticCurveTo(x - 8, gy - 35 + flicker, x, gy - 45 + flicker2);
    ctx.quadraticCurveTo(x + 8, gy - 35 - flicker2, x + 12, gy - 8);
    ctx.fill();
    // Yellow inner flames
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(x - 6, gy - 10);
    ctx.quadraticCurveTo(x - 3, gy - 30 - flicker, x, gy - 35 + flicker2);
    ctx.quadraticCurveTo(x + 3, gy - 28 + flicker, x + 6, gy - 10);
    ctx.fill();
    // White-hot center
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.moveTo(x - 3, gy - 12);
    ctx.quadraticCurveTo(x, gy - 22 - flicker2, x + 3, gy - 12);
    ctx.fill();
    // Embers / sparks
    for (let i = 0; i < 4; i++) {
      const ex = x + Math.sin(gameTime / 200 + i * 1.5) * 10;
      const ey = gy - 40 - (gameTime / 80 + i * 50) % 30;
      const ea = Math.max(0, 1 - ((gameTime / 80 + i * 50) % 30) / 30);
      ctx.globalAlpha = ea * 0.7;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath(); ctx.arc(ex, ey, 1.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Roasting marshmallow on a stick
    if (roasting.active) {
      const stickAngle = -0.4;
      ctx.save(); ctx.translate(x - 25, gy - 15);
      ctx.rotate(stickAngle);
      ctx.strokeStyle = '#8B6914'; ctx.lineWidth = 2; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(40, 0); ctx.stroke();
      // Marshmallow
      const roastPct = Math.min(1, roasting.progress / 3500);
      const mColor = roastPct < 0.57 ? '#fff5e6' : roastPct < 1 ? '#d4a76a' : '#5c3a1e';
      ctx.fillStyle = mColor;
      ctx.beginPath(); ctx.roundRect(38, -5, 10, 10, 3); ctx.fill();
      ctx.restore();
    }
  }
}

function drawHammock(x) {
  const gy = GROUND_Y;
  // Two trees
  ctx.fillStyle = '#5c3a1e';
  ctx.fillRect(x - 50 - 5, gy - 80, 10, 80);
  ctx.fillRect(x + 50 - 5, gy - 80, 10, 80);
  // Tree tops
  ctx.fillStyle = '#228B22';
  ctx.beginPath(); ctx.arc(x - 50, gy - 90, 20, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 50, gy - 90, 20, 0, Math.PI * 2); ctx.fill();
  // Hammock ropes
  ctx.strokeStyle = '#d4a76a'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x - 45, gy - 50); ctx.lineTo(x - 35, gy - 35); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 45, gy - 50); ctx.lineTo(x + 35, gy - 35); ctx.stroke();
  // Hammock fabric (catenary curve)
  const sway = hammockNapping ? Math.sin(gameTime / 500) * 3 : 0;
  ctx.strokeStyle = '#e74c3c'; ctx.lineWidth = 3;
  ctx.fillStyle = 'rgba(231,76,60,0.3)';
  ctx.beginPath();
  ctx.moveTo(x - 35, gy - 35);
  ctx.quadraticCurveTo(x, gy - 15 + sway, x + 35, gy - 35);
  ctx.stroke();
  ctx.lineTo(x + 35, gy - 33);
  ctx.quadraticCurveTo(x, gy - 10 + sway, x - 35, gy - 33);
  ctx.closePath();
  ctx.fill();

  if (hammockNapping) {
    // Sleeping kitty in hammock
    ctx.fillStyle = '#c4b5fd';
    ctx.beginPath(); ctx.ellipse(x, gy - 23 + sway, 12, 8, 0, 0, Math.PI * 2); ctx.fill();
    // Zzz
    ctx.fillStyle = '#a78bfa'; ctx.font = 'bold 14px system-ui';
    const zOff = Math.sin(gameTime / 600) * 5;
    ctx.fillText('z', x + 15, gy - 40 + zOff);
    ctx.fillText('Z', x + 22, gy - 52 + zOff);
    ctx.fillText('Z', x + 28, gy - 65 + zOff);
  }
}

function drawBigfoot(x) {
  const gy = GROUND_Y;
  const bounce = Math.sin(gameTime / 600) * 2;
  // Bigfoot body (large, brown, furry)
  ctx.fillStyle = '#5c3a1e';
  // Feet
  ctx.beginPath(); ctx.ellipse(x - 12, gy - 5, 12, 6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x + 12, gy - 5, 12, 6, 0, 0, Math.PI * 2); ctx.fill();
  // Body
  ctx.beginPath(); ctx.ellipse(x, gy - 45 + bounce, 25, 40, 0, 0, Math.PI * 2); ctx.fill();
  // Head
  ctx.beginPath(); ctx.arc(x, gy - 90 + bounce, 20, 0, Math.PI * 2); ctx.fill();
  // Face
  ctx.fillStyle = '#8B6914';
  ctx.beginPath(); ctx.ellipse(x, gy - 82 + bounce, 12, 8, 0, 0, Math.PI * 2); ctx.fill();
  // Eyes
  ctx.fillStyle = '#1a1a2e';
  ctx.beginPath(); ctx.arc(x - 7, gy - 92 + bounce, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 7, gy - 92 + bounce, 3, 0, Math.PI * 2); ctx.fill();
  // Eye highlights
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(x - 6, gy - 93 + bounce, 1, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 8, gy - 93 + bounce, 1, 0, Math.PI * 2); ctx.fill();
  // Friendly smile
  ctx.strokeStyle = '#1a1a2e'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(x, gy - 85 + bounce, 6, 0.2, Math.PI - 0.2); ctx.stroke();
  // Arms
  ctx.strokeStyle = '#5c3a1e'; ctx.lineWidth = 8; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - 22, gy - 50 + bounce); ctx.lineTo(x - 35, gy - 35 + bounce); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 22, gy - 50 + bounce); ctx.lineTo(x + 35, gy - 35 + bounce); ctx.stroke();

  // Chocolate milk (always present — Bigfoot holds one, spare on ground)
  // Glass on ground
  ctx.fillStyle = '#92400e';
  ctx.beginPath(); ctx.roundRect(x + 30, gy - 20, 14, 20, 2); ctx.fill();
  ctx.fillStyle = '#5c2d0e';
  ctx.beginPath(); ctx.ellipse(x + 37, gy - 18, 6, 3, 0, 0, Math.PI * 2); ctx.fill();
  // Glass in Bigfoot's hand
  ctx.fillStyle = '#92400e';
  ctx.beginPath(); ctx.roundRect(x - 42, gy - 42 + bounce, 12, 18, 2); ctx.fill();
  ctx.fillStyle = '#5c2d0e';
  ctx.beginPath(); ctx.ellipse(x - 36, gy - 40 + bounce, 5, 2.5, 0, 0, Math.PI * 2); ctx.fill();

  if (bigfootDrinking) {
    // Hearts floating up
    ctx.fillStyle = '#f472b6';
    for (let i = 0; i < 3; i++) {
      const hy = gy - 110 + bounce - (bigfootDrinkTimer / 100 + i * 15) % 40;
      const hx = x + Math.sin(gameTime / 300 + i) * 8;
      ctx.font = '12px system-ui';
      ctx.fillText('\u2665', hx, hy);
    }
  }

  // "Bigfoot" label
  ctx.fillStyle = '#fff'; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('Bigfoot', x, gy - 115 + bounce);
  ctx.textAlign = 'left';
}

function drawDigSite(x) {
  const gy = GROUND_Y;
  if (campPool.filled) {
    // Filled pool
    ctx.fillStyle = '#6b7280';
    ctx.beginPath(); ctx.roundRect(x - 40, gy - 8, 80, 30, 5); ctx.fill();
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath(); ctx.roundRect(x - 36, gy - 5, 72, 24, 3); ctx.fill();
    // Water ripples
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      const rx = x - 20 + i * 20;
      const ry = gy + 5 + Math.sin(gameTime / 400 + i) * 2;
      ctx.beginPath(); ctx.moveTo(rx - 8, ry); ctx.quadraticCurveTo(rx, ry - 3, rx + 8, ry); ctx.stroke();
    }
  } else if (campPool.dug) {
    // Dug hole (empty)
    ctx.fillStyle = '#4a3728';
    ctx.beginPath(); ctx.roundRect(x - 40, gy - 8, 80, 30, 5); ctx.fill();
    ctx.fillStyle = '#3a2a1a';
    ctx.beginPath(); ctx.roundRect(x - 36, gy - 5, 72, 24, 3); ctx.fill();
  } else if (campPool.digging) {
    // Partially dug
    const pct = campPool.digProgress / 3000;
    ctx.fillStyle = '#4a3728';
    ctx.beginPath(); ctx.roundRect(x - 40 * pct, gy - 8 * pct, 80 * pct, 30 * pct, 5); ctx.fill();
    // Dirt flying up
    ctx.fillStyle = '#8B7355';
    for (let i = 0; i < 3; i++) {
      const dx = x + Math.sin(gameTime / 100 + i * 2) * 20;
      const dy = gy - 15 - Math.random() * 15;
      ctx.beginPath(); ctx.arc(dx, dy, 2, 0, Math.PI * 2); ctx.fill();
    }
  } else {
    // Unmarked dig site — just a shovel
    ctx.strokeStyle = '#8B6914'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x, gy - 30); ctx.stroke();
    ctx.fillStyle = '#6b7280';
    ctx.beginPath();
    ctx.moveTo(x - 8, gy);
    ctx.quadraticCurveTo(x, gy + 10, x + 8, gy);
    ctx.lineTo(x + 3, gy - 5);
    ctx.lineTo(x - 3, gy - 5);
    ctx.closePath();
    ctx.fill();
    // "Dig here" sign
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(x + 15, gy - 25, 2, 25);
    ctx.fillStyle = '#d4a76a';
    ctx.beginPath(); ctx.roundRect(x + 8, gy - 35, 22, 12, 2); ctx.fill();
    ctx.fillStyle = '#5c3a1e'; ctx.font = '7px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('DIG', x + 19, gy - 26);
    ctx.textAlign = 'left';
  }
}

function drawWaterPump(x) {
  const gy = GROUND_Y;
  // Pump base
  ctx.fillStyle = '#6b7280';
  ctx.fillRect(x - 8, gy - 35, 16, 35);
  // Pump head
  ctx.fillStyle = '#4b5563';
  ctx.beginPath(); ctx.roundRect(x - 12, gy - 45, 24, 14, 3); ctx.fill();
  // Handle
  ctx.strokeStyle = '#374151'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x + 10, gy - 40); ctx.lineTo(x + 25, gy - 50); ctx.stroke();
  ctx.beginPath(); ctx.arc(x + 25, gy - 50, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#ef4444'; ctx.fill();
  // Spout
  ctx.fillStyle = '#6b7280';
  ctx.fillRect(x - 14, gy - 38, 6, 3);
  // Drip
  if (campPool.filling) {
    const dripY = gy - 35 + (gameTime / 100 % 20);
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath(); ctx.ellipse(x - 11, dripY, 2, 3, 0, 0, Math.PI * 2); ctx.fill();
  }
}

function drawCampCamper(x) {
  const gy = GROUND_Y;
  // Draw the camper image
  if (campCamperImgLoaded && campCamperImg.naturalWidth > 0) {
    const imgW = 160;
    const imgH = imgW * (campCamperImg.naturalHeight / campCamperImg.naturalWidth);
    ctx.drawImage(campCamperImg, x - imgW / 2, gy - imgH + 25, imgW, imgH);
  } else {
    // Fallback: simple rectangle camper
    ctx.fillStyle = '#e5e7eb';
    ctx.beginPath(); ctx.roundRect(x - 60, gy - 60, 120, 60, 8); ctx.fill();
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(x - 55, gy - 50, 30, 20);
    ctx.fillRect(x + 15, gy - 50, 30, 20);
    ctx.fillStyle = '#1f2937';
    ctx.beginPath(); ctx.arc(x - 30, gy, 10, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + 30, gy, 10, 0, Math.PI * 2); ctx.fill();
  }
}

// ── Africa Safari Drawing Functions ──

function drawSafariSky(W, H, cycle, isNight) {
  // Warm sunset savanna sky
  const dayTop = [220, 140, 60]; const nightTop = [15, 12, 30];
  const dayBot = [255, 180, 80]; const nightBot = [35, 25, 50];
  const skyTop = lerpColor(dayTop, nightTop, cycle);
  const skyBot = lerpColor(dayBot, nightBot, cycle);
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, `rgb(${skyTop})`);
  grad.addColorStop(0.6, `rgb(${skyBot})`);
  grad.addColorStop(1, '#c8a96e');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
  if (isNight) drawStars(W, H, cycle);
  drawCelestial(W, H, cycle);
}

function drawSafariWorld(W, H, cam) {
  const ww = getCurrentWorldW();
  // Savanna ground
  ctx.fillStyle = '#c8a96e';
  ctx.fillRect(0, GROUND_Y, ww, H);
  // Dirt/sand variation
  ctx.fillStyle = '#b89a5a';
  for (let gx = Math.floor((cam - 20) / 80) * 80; gx < cam + W + 20; gx += 80) {
    ctx.beginPath(); ctx.arc(gx + 30, GROUND_Y + 3, 4, Math.PI, 0); ctx.fill();
    ctx.beginPath(); ctx.arc(gx + 55, GROUND_Y + 2, 3, Math.PI, 0); ctx.fill();
  }

  // Background distant hills (parallax)
  ctx.fillStyle = '#a08050';
  for (let hx = Math.floor((cam * 0.2) / 200) * 200 - 200; hx < cam * 0.2 + W + 200; hx += 200) {
    const px = hx / 0.2;
    const hh = 40 + Math.sin(hx * 0.3) * 15;
    ctx.beginPath();
    ctx.arc(px, GROUND_Y, hh + 30, Math.PI, 0);
    ctx.fill();
  }

  // Draw scenes
  drawSafariScenes(cam, W);

  // Watering hole
  drawWateringHole(cam, W);

  // Platforms
  drawSafariPlatforms();

  // Yarn balls
  drawSafariYarnBalls();

  // Safari NPCs
  for (const npc of safariNpcs) drawKitty(npc.x, npc.y, npc.color, npc.facing, npc.walkFrame, npc.accessory);

  // Cheetah speech bubble
  if (cheetahSpeech.timer > 0) {
    drawCheetahSpeech(CHEETAH_POS.x, GROUND_Y);
  }

  drawPlayerAndUI();
}

function drawSafariScenes(cam, W) {
  for (const scene of level7.scenes) {
    if (scene.x < cam - 150 || scene.x > cam + W + 150) continue;
    switch (scene.type) {
      case 'acacia_tree': drawAcaciaTree(scene.x); break;
      case 'baobab_tree': drawBaobabTree(scene.x); break;
      case 'tall_grass': drawTallGrass(scene.x, scene.w); break;
      case 'elephant': drawElephant(scene.x); break;
      case 'rhino': break; // drawn dynamically from level7.rhinos
      case 'giraffe': drawGiraffe(scene.x); break;
      case 'cheetah': if (!ridingCheetah) drawCheetah(scene.x); break;
      case 'safari_jeep': drawSafariJeep(scene.x); break;
      case 'safari_rock': drawSafariRock(scene.x); break;
      case 'animal_tracks': drawAnimalTracks(scene.x); break;
    }
  }
  // Draw rhinos dynamically
  for (const rh of level7.rhinos) {
    if (rh.x < cam - 80 || rh.x > cam + W + 80) continue;
    drawRhino(rh.x, rh.charging);
  }
  // Draw antelopes
  for (const ant of level7.antelopes) {
    if (ant.x < cam - 60 || ant.x > cam + W + 60) continue;
    drawAntelope(ant.x, ant.running, ant.size);
  }
}

function drawSafariPlatforms() {
  drawPlatformsWithStyle(level7.platforms, '#a0845a', '#8a6e44', function(p) {
    ctx.fillStyle = '#b89a6a';
    ctx.fillRect(p.x + 5, p.y + 2, 6, 3);
    ctx.fillRect(p.x + p.w - 15, p.y + 4, 8, 2);
  });
}

function drawSafariYarnBalls() { drawYarnBallsForLevel(level7.yarnBalls); }

function drawAcaciaTree(x) {
  const gy = GROUND_Y;
  // Trunk — tall and thin
  ctx.fillStyle = '#5c3a1e';
  ctx.fillRect(x - 4, gy - 90, 8, 90);
  // Distinctive flat-top canopy
  ctx.fillStyle = '#4a7c3f';
  ctx.beginPath();
  ctx.ellipse(x, gy - 90, 45, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  // Darker top layer
  ctx.fillStyle = '#3a6a2f';
  ctx.beginPath();
  ctx.ellipse(x, gy - 95, 35, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  // Branch hints
  ctx.strokeStyle = '#5c3a1e'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x, gy - 60); ctx.lineTo(x - 25, gy - 82); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x, gy - 55); ctx.lineTo(x + 30, gy - 80); ctx.stroke();
}

function drawBaobabTree(x) {
  const gy = GROUND_Y;
  // Thick trunk
  ctx.fillStyle = '#8B7355';
  ctx.beginPath();
  ctx.moveTo(x - 18, gy);
  ctx.lineTo(x - 14, gy - 60);
  ctx.lineTo(x + 14, gy - 60);
  ctx.lineTo(x + 18, gy);
  ctx.closePath();
  ctx.fill();
  // Bulging middle
  ctx.beginPath();
  ctx.ellipse(x, gy - 35, 20, 28, 0, 0, Math.PI * 2);
  ctx.fill();
  // Sparse branches
  ctx.strokeStyle = '#6B5440'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - 5, gy - 60); ctx.lineTo(x - 25, gy - 85); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 5, gy - 60); ctx.lineTo(x + 20, gy - 80); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x, gy - 60); ctx.lineTo(x + 5, gy - 90); ctx.stroke();
  // Small leaf clusters
  ctx.fillStyle = '#5c9c4a';
  ctx.beginPath(); ctx.arc(x - 25, gy - 88, 8, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 20, gy - 83, 7, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 5, gy - 93, 6, 0, Math.PI * 2); ctx.fill();
  // Fruit
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath(); ctx.ellipse(x - 22, gy - 78, 3, 5, 0.3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x + 18, gy - 74, 3, 5, -0.2, 0, Math.PI * 2); ctx.fill();
}

function drawTallGrass(x, w) {
  const gy = GROUND_Y;
  ctx.fillStyle = '#8aba70';
  for (let gx = x; gx < x + w; gx += 8) {
    const gh = 15 + Math.sin(gx * 0.5 + gameTime / 500) * 5;
    const sway = Math.sin(gameTime / 800 + gx * 0.3) * 3;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.quadraticCurveTo(gx + sway, gy - gh * 0.6, gx + sway * 1.5, gy - gh);
    ctx.quadraticCurveTo(gx + sway + 2, gy - gh * 0.6, gx + 4, gy);
    ctx.fill();
  }
  // Lighter accents
  ctx.fillStyle = '#a8d88a';
  for (let gx = x + 4; gx < x + w; gx += 12) {
    const gh = 12 + Math.sin(gx * 0.7) * 4;
    const sway = Math.sin(gameTime / 700 + gx * 0.4) * 2;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.quadraticCurveTo(gx + sway, gy - gh * 0.6, gx + sway, gy - gh);
    ctx.quadraticCurveTo(gx + sway + 1, gy - gh * 0.6, gx + 3, gy);
    ctx.fill();
  }
}

function drawElephant(x) {
  const gy = GROUND_Y;
  // Body
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.ellipse(x, gy - 35, 35, 28, 0, 0, Math.PI * 2);
  ctx.fill();
  // Head
  ctx.beginPath();
  ctx.ellipse(x + 28, gy - 45, 18, 16, 0.2, 0, Math.PI * 2);
  ctx.fill();
  // Trunk
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 8; ctx.lineCap = 'round';
  const trunkSway = Math.sin(gameTime / 600) * 5;
  ctx.beginPath();
  ctx.moveTo(x + 42, gy - 40);
  ctx.quadraticCurveTo(x + 55, gy - 25 + trunkSway, x + 48, gy - 10);
  ctx.stroke();
  // Legs
  ctx.fillStyle = '#7c8ea0';
  ctx.fillRect(x - 20, gy - 12, 10, 12);
  ctx.fillRect(x - 5, gy - 12, 10, 12);
  ctx.fillRect(x + 10, gy - 12, 10, 12);
  ctx.fillRect(x + 22, gy - 12, 10, 12);
  // Ear
  ctx.fillStyle = '#a0b0c0';
  ctx.beginPath();
  ctx.ellipse(x + 20, gy - 48, 12, 10, -0.3, 0, Math.PI * 2);
  ctx.fill();
  // Eye
  ctx.fillStyle = '#1e293b';
  ctx.beginPath(); ctx.arc(x + 35, gy - 48, 3, 0, Math.PI * 2); ctx.fill();
  // Tusk
  ctx.fillStyle = '#fef3c7';
  ctx.beginPath();
  ctx.moveTo(x + 38, gy - 38);
  ctx.quadraticCurveTo(x + 48, gy - 32, x + 44, gy - 22);
  ctx.lineWidth = 3; ctx.strokeStyle = '#fef3c7'; ctx.stroke();
}

function drawRhino(x, charging) {
  const gy = GROUND_Y;
  // Body
  ctx.fillStyle = charging ? '#6b7280' : '#78716c';
  ctx.beginPath();
  ctx.ellipse(x, gy - 22, 28, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  // Head
  ctx.beginPath();
  ctx.ellipse(x + 22, gy - 25, 14, 12, 0.1, 0, Math.PI * 2);
  ctx.fill();
  // Horn
  ctx.fillStyle = '#a8a29e';
  ctx.beginPath();
  ctx.moveTo(x + 34, gy - 28);
  ctx.lineTo(x + 40, gy - 42);
  ctx.lineTo(x + 36, gy - 28);
  ctx.fill();
  // Second smaller horn
  ctx.beginPath();
  ctx.moveTo(x + 28, gy - 30);
  ctx.lineTo(x + 31, gy - 38);
  ctx.lineTo(x + 30, gy - 30);
  ctx.fill();
  // Legs
  ctx.fillStyle = '#57534e';
  ctx.fillRect(x - 16, gy - 8, 8, 8);
  ctx.fillRect(x - 3, gy - 8, 8, 8);
  ctx.fillRect(x + 8, gy - 8, 8, 8);
  ctx.fillRect(x + 18, gy - 8, 8, 8);
  // Eye
  ctx.fillStyle = '#1e293b';
  ctx.beginPath(); ctx.arc(x + 28, gy - 28, 2, 0, Math.PI * 2); ctx.fill();
  // Charging effect
  if (charging) {
    ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
    ctx.beginPath(); ctx.arc(x + 40, gy - 35, 8, 0, Math.PI * 2); ctx.fill();
  }
}

function drawAntelope(x, running, size) {
  const gy = GROUND_Y;
  const s = size || 1;
  ctx.save();
  ctx.translate(x, gy);
  ctx.scale(s, s);
  // Body
  ctx.fillStyle = '#d4a574';
  ctx.beginPath();
  ctx.ellipse(0, -18, 18, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  // Head
  ctx.beginPath();
  ctx.ellipse(15, -25, 8, 6, 0.3, 0, Math.PI * 2);
  ctx.fill();
  // Legs
  ctx.strokeStyle = '#b8956a'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  const legAnim = running ? Math.sin(gameTime / 80) * 8 : 0;
  ctx.beginPath(); ctx.moveTo(-10, -8); ctx.lineTo(-12 + legAnim, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-3, -8); ctx.lineTo(-5 - legAnim, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(5, -8); ctx.lineTo(3 + legAnim, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(12, -8); ctx.lineTo(10 - legAnim, 0); ctx.stroke();
  // Horns
  ctx.strokeStyle = '#5c3a1e'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(17, -28); ctx.lineTo(14, -40); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(19, -28); ctx.lineTo(22, -40); ctx.stroke();
  // Eye
  ctx.fillStyle = '#1e293b';
  ctx.beginPath(); ctx.arc(19, -27, 1.5, 0, Math.PI * 2); ctx.fill();
  // White belly
  ctx.fillStyle = '#fef3c7';
  ctx.beginPath();
  ctx.ellipse(0, -14, 14, 6, 0, 0.2, Math.PI - 0.2);
  ctx.fill();
  ctx.restore();
}

function drawGiraffe(x) {
  const gy = GROUND_Y;
  // Long legs
  ctx.fillStyle = '#d4a574';
  ctx.fillRect(x - 12, gy - 50, 6, 50);
  ctx.fillRect(x - 2, gy - 50, 6, 50);
  ctx.fillRect(x + 8, gy - 50, 6, 50);
  ctx.fillRect(x + 18, gy - 50, 6, 50);
  // Body
  ctx.fillStyle = '#d4a574';
  ctx.beginPath();
  ctx.ellipse(x + 5, gy - 55, 22, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  // Long neck
  ctx.fillStyle = '#d4a574';
  ctx.save();
  ctx.translate(x + 20, gy - 60);
  ctx.rotate(-0.15);
  ctx.fillRect(-5, -65, 10, 65);
  ctx.restore();
  // Head
  ctx.beginPath();
  ctx.ellipse(x + 22, gy - 125, 8, 6, 0.2, 0, Math.PI * 2);
  ctx.fill();
  // Spots
  ctx.fillStyle = '#92400e';
  const spots = [[-5, -55], [10, -58], [0, -48], [15, -50], [18, -75], [16, -90], [20, -105]];
  for (const [sx, sy] of spots) {
    ctx.beginPath(); ctx.ellipse(x + sx, gy + sy, 4, 3, 0, 0, Math.PI * 2); ctx.fill();
  }
  // Ossicones (horns)
  ctx.strokeStyle = '#5c3a1e'; ctx.lineWidth = 2; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x + 19, gy - 128); ctx.lineTo(x + 17, gy - 138); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 25, gy - 128); ctx.lineTo(x + 27, gy - 138); ctx.stroke();
  ctx.fillStyle = '#92400e';
  ctx.beginPath(); ctx.arc(x + 17, gy - 139, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 27, gy - 139, 2, 0, Math.PI * 2); ctx.fill();
  // Eye
  ctx.fillStyle = '#1e293b';
  ctx.beginPath(); ctx.arc(x + 27, gy - 126, 2, 0, Math.PI * 2); ctx.fill();
  // Friendly smile
  ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(x + 25, gy - 122, 3, 0, Math.PI); ctx.stroke();
}

function drawCheetah(x) {
  const gy = GROUND_Y;
  // Body
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.ellipse(x, gy - 18, 22, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  // Head
  ctx.beginPath();
  ctx.ellipse(x + 20, gy - 22, 10, 8, 0.1, 0, Math.PI * 2);
  ctx.fill();
  // Spots
  ctx.fillStyle = '#292524';
  const spotPositions = [[-10, -20], [-5, -14], [2, -22], [8, -16], [-8, -25], [5, -10], [12, -20]];
  for (const [sx, sy] of spotPositions) {
    ctx.beginPath(); ctx.arc(x + sx, gy + sy, 2, 0, Math.PI * 2); ctx.fill();
  }
  // Legs
  ctx.fillStyle = '#d97706';
  ctx.fillRect(x - 14, gy - 6, 5, 6);
  ctx.fillRect(x - 5, gy - 6, 5, 6);
  ctx.fillRect(x + 5, gy - 6, 5, 6);
  ctx.fillRect(x + 14, gy - 6, 5, 6);
  // Tail
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  const tailSway = Math.sin(gameTime / 400) * 8;
  ctx.beginPath();
  ctx.moveTo(x - 20, gy - 18);
  ctx.quadraticCurveTo(x - 30, gy - 30 + tailSway, x - 25, gy - 35);
  ctx.stroke();
  // Tail tip (black)
  ctx.strokeStyle = '#292524'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x - 26, gy - 33); ctx.lineTo(x - 25, gy - 37); ctx.stroke();
  // Tear marks (black lines from eyes)
  ctx.strokeStyle = '#292524'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(x + 26, gy - 22); ctx.lineTo(x + 28, gy - 16); ctx.stroke();
  // Eye
  ctx.fillStyle = '#fef3c7';
  ctx.beginPath(); ctx.arc(x + 25, gy - 24, 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#292524';
  ctx.beginPath(); ctx.arc(x + 26, gy - 24, 1.5, 0, Math.PI * 2); ctx.fill();
  // Yarn wanted indicator
  if (cheetahYarnGiven < 5) {
    const bob = Math.sin(gameTime / 300) * 3;
    ctx.fillStyle = '#c4b5fd';
    ctx.beginPath(); ctx.arc(x, gy - 42 + bob, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('?', x, gy - 39 + bob);
  }
}

function drawRidingCheetah(x, y, facing) {
  // Simplified cheetah body under the player
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  // Body
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.ellipse(0, -5, 25, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  // Head
  ctx.beginPath();
  ctx.ellipse(22, -8, 10, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  // Spots
  ctx.fillStyle = '#292524';
  const spots = [[-8, -8], [0, -4], [8, -9], [-4, -12], [5, -2]];
  for (const [sx, sy] of spots) {
    ctx.beginPath(); ctx.arc(sx, sy, 1.5, 0, Math.PI * 2); ctx.fill();
  }
  // Legs (animated)
  const legAnim = Math.sin(gameTime / 60) * 10;
  ctx.strokeStyle = '#d97706'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-15, 3); ctx.lineTo(-18 + legAnim, 12); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-5, 3); ctx.lineTo(-8 - legAnim, 12); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(8, 3); ctx.lineTo(5 + legAnim, 12); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(18, 3); ctx.lineTo(15 - legAnim, 12); ctx.stroke();
  // Tail
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
  const tailSway = Math.sin(gameTime / 200) * 8;
  ctx.beginPath();
  ctx.moveTo(-23, -5);
  ctx.quadraticCurveTo(-33, -15 + tailSway, -28, -22);
  ctx.stroke();
  // Eye
  ctx.fillStyle = '#292524';
  ctx.beginPath(); ctx.arc(28, -10, 2, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawSafariJeep(x) {
  const gy = GROUND_Y;
  // Body
  ctx.fillStyle = '#65a30d';
  ctx.beginPath(); ctx.roundRect(x - 40, gy - 40, 80, 30, 5); ctx.fill();
  // Roof
  ctx.fillStyle = '#4d7c0f';
  ctx.fillRect(x - 30, gy - 55, 50, 15);
  // Roof supports
  ctx.strokeStyle = '#4d7c0f'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x - 30, gy - 40); ctx.lineTo(x - 30, gy - 55); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 20, gy - 40); ctx.lineTo(x + 20, gy - 55); ctx.stroke();
  // Windshield
  ctx.fillStyle = '#bae6fd';
  ctx.fillRect(x - 25, gy - 38, 20, 12);
  // Wheels
  ctx.fillStyle = '#1f2937';
  ctx.beginPath(); ctx.arc(x - 22, gy - 8, 8, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 22, gy - 8, 8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#6b7280';
  ctx.beginPath(); ctx.arc(x - 22, gy - 8, 4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 22, gy - 8, 4, 0, Math.PI * 2); ctx.fill();
  // Spare tire
  ctx.fillStyle = '#374151';
  ctx.beginPath(); ctx.arc(x + 42, gy - 30, 7, 0, Math.PI * 2); ctx.fill();
  // "SAFARI" text
  ctx.fillStyle = '#fff'; ctx.font = 'bold 8px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('SAFARI', x, gy - 44);
}

function drawSafariRock(x) {
  const gy = GROUND_Y;
  ctx.fillStyle = '#a0845a';
  ctx.beginPath();
  ctx.moveTo(x - 15, gy);
  ctx.lineTo(x - 12, gy - 12);
  ctx.lineTo(x - 3, gy - 18);
  ctx.lineTo(x + 8, gy - 14);
  ctx.lineTo(x + 14, gy);
  ctx.closePath();
  ctx.fill();
  // Highlight
  ctx.fillStyle = '#b89a6a';
  ctx.beginPath();
  ctx.moveTo(x - 8, gy - 10);
  ctx.lineTo(x - 3, gy - 16);
  ctx.lineTo(x + 4, gy - 12);
  ctx.closePath();
  ctx.fill();
}

function drawAnimalTracks(x) {
  const gy = GROUND_Y;
  ctx.fillStyle = '#8a6e44';
  // Paw prints leading somewhere
  for (let i = 0; i < 5; i++) {
    const tx = x + i * 18;
    const ty = gy + 3;
    // Main pad
    ctx.beginPath(); ctx.ellipse(tx, ty, 3, 4, 0, 0, Math.PI * 2); ctx.fill();
    // Toe pads
    ctx.beginPath(); ctx.arc(tx - 3, ty - 4, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(tx + 3, ty - 4, 1.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(tx, ty - 5, 1.5, 0, Math.PI * 2); ctx.fill();
  }
}

function drawWateringHole(cam, W) {
  const whx = WATERING_HOLE_POS.x;
  const whw = WATERING_HOLE_POS.w;
  if (whx + whw < cam - 50 || whx > cam + W + 50) return;

  const gy = GROUND_Y;
  // Water
  ctx.fillStyle = '#38bdf8';
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.ellipse(whx + whw / 2, gy + 5, whw / 2, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  // Shore
  ctx.strokeStyle = '#92400e'; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(whx + whw / 2, gy + 5, whw / 2 + 5, 23, 0, 0, Math.PI * 2);
  ctx.stroke();
  // Water ripples
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1;
  const ripple = Math.sin(gameTime / 500) * 5;
  ctx.beginPath();
  ctx.ellipse(whx + whw / 2 - 20, gy + 3, 15 + ripple, 5, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(whx + whw / 2 + 30, gy + 7, 12 - ripple, 4, 0, 0, Math.PI * 2);
  ctx.stroke();
  // Mud patches on shore
  ctx.fillStyle = '#78552e';
  ctx.beginPath(); ctx.ellipse(whx + 20, gy + 3, 8, 3, 0.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(whx + whw - 15, gy + 5, 6, 3, -0.3, 0, Math.PI * 2); ctx.fill();
}

function drawWateringHoleScene(cam, W, H) {
  const cx = cam + W / 2;
  const cy = GROUND_Y - 80;
  // Background — savanna sky
  ctx.fillStyle = '#87CEEB';
  ctx.fillRect(cam, 0, W, H);
  // Water
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(cam, cy + 30, W, H - cy - 30);
  // Ripple effects
  ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    const rx = cx + Math.sin(gameTime / 600 + i * 1.2) * 100;
    const ry = cy + 50 + i * 20;
    ctx.beginPath();
    ctx.ellipse(rx, ry, 20 + Math.sin(gameTime / 400 + i) * 5, 5, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  // Shore
  ctx.fillStyle = '#c8a96e';
  ctx.fillRect(cam, cy + 25, W, 8);

  // Friendly crocodile (emerges from right side of water)
  if (crocVisible) {
    const crocX = cx + 120;
    const crocY = cy + 55;
    const bobY = Math.sin(gameTime / 800) * 3;
    // Snout poking out of water
    ctx.fillStyle = '#4a7c59';
    ctx.beginPath();
    ctx.ellipse(crocX, crocY + bobY, 25, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    // Head bump
    ctx.beginPath();
    ctx.ellipse(crocX - 15, crocY - 5 + bobY, 15, 10, -0.2, 0, Math.PI * 2);
    ctx.fill();
    // Eyes (big friendly cartoon eyes)
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(crocX - 20, crocY - 10 + bobY, 6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(crocX - 10, crocY - 10 + bobY, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath(); ctx.arc(crocX - 19, crocY - 10 + bobY, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(crocX - 9, crocY - 10 + bobY, 3, 0, Math.PI * 2); ctx.fill();
    // Friendly smile
    ctx.strokeStyle = '#2d5a3d';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(crocX - 5, crocY + 2 + bobY, 10, 0.2, Math.PI - 0.2);
    ctx.stroke();
    // Nostrils
    ctx.fillStyle = '#2d5a3d';
    ctx.beginPath(); ctx.arc(crocX + 8, crocY - 2 + bobY, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(crocX + 12, crocY - 2 + bobY, 2, 0, Math.PI * 2); ctx.fill();
    // Speech bubble
    if (crocSpeech.timer > 0) {
      ctx.font = '11px system-ui';
      const textW = ctx.measureText(crocSpeech.text).width;
      const bw = Math.min(textW + 16, 200);
      const bx = crocX - bw / 2;
      const by = crocY - 40 + bobY;
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.beginPath(); ctx.roundRect(bx, by - 12, bw, 20, 6); ctx.fill();
      ctx.fillStyle = '#1a1a1a';
      ctx.textAlign = 'center';
      ctx.fillText(crocSpeech.text, crocX, by + 3);
      ctx.textAlign = 'left';
    }
  }

  // Parrot (arriving or on shoulder)
  if (parrotState === 'arriving' || parrotState === 'shoulder' || parrotState === 'named') {
    const targetX = cx - 10;
    const targetY = cy + 25;
    let px, py;
    if (parrotState === 'arriving') {
      const t = Math.min(1, parrotArrivalTimer / 1500);
      px = cam + W + 30 - (W + 60) * t * t; // fly in from right
      py = cy - 40 + t * 65;
    } else {
      px = targetX;
      py = targetY + Math.sin(gameTime / 400) * 2;
    }
    // Parrot body
    ctx.fillStyle = '#22c55e'; // green body
    ctx.beginPath(); ctx.ellipse(px, py, 6, 8, 0, 0, Math.PI * 2); ctx.fill();
    // Head
    ctx.fillStyle = '#ef4444'; // red head
    ctx.beginPath(); ctx.arc(px, py - 9, 5, 0, Math.PI * 2); ctx.fill();
    // Beak
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(px + 4, py - 10);
    ctx.lineTo(px + 9, py - 8);
    ctx.lineTo(px + 4, py - 7);
    ctx.closePath();
    ctx.fill();
    // Eye
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(px + 1, py - 10, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(px + 1.5, py - 10, 1.2, 0, Math.PI * 2); ctx.fill();
    // Tail feathers
    ctx.fillStyle = '#3b82f6'; // blue tail
    ctx.beginPath();
    ctx.moveTo(px - 3, py + 6);
    ctx.lineTo(px - 8, py + 16);
    ctx.lineTo(px - 2, py + 14);
    ctx.lineTo(px + 2, py + 16);
    ctx.lineTo(px + 1, py + 6);
    ctx.closePath();
    ctx.fill();
    // Wing (flapping when arriving)
    if (parrotState === 'arriving') {
      const wing = Math.sin(gameTime / 80) * 8;
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.moveTo(px - 5, py - 3);
      ctx.lineTo(px - 15, py - 5 + wing);
      ctx.lineTo(px - 5, py + 3);
      ctx.closePath();
      ctx.fill();
    }
    // Name label
    if (parrotState === 'named' && parrotName) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 10px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(parrotName, px, py - 18);
      ctx.textAlign = 'left';
    }
  }

  // Player splashing
  drawKitty(cx, cy + 45, player.color, player.facing, player.walkFrame, 'horn', playerEyeColor, playerHornColors);
  // Splash effects
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  for (let i = 0; i < 3; i++) {
    const sx = cx + Math.sin(gameTime / 200 + i * 2) * 30;
    const sy = cy + 40 + Math.cos(gameTime / 300 + i) * 5;
    ctx.beginPath(); ctx.arc(sx, sy, 3, 0, Math.PI * 2); ctx.fill();
  }
  // Instructions
  ctx.fillStyle = '#fff'; ctx.font = 'bold 14px system-ui'; ctx.textAlign = 'center';
  let promptText = 'Splashing in the watering hole! Press S to get out';
  if (parrotState === 'shoulder') promptText = 'A parrot is on your shoulder! Press N to name it | S to exit';
  ctx.fillText(promptText, cx, cy - 10);
  ctx.textAlign = 'left';
}

function drawCheetahSpeech(x, gy) {
  if (cheetahSpeech.timer <= 0) return;
  const text = cheetahSpeech.text;
  ctx.font = '11px system-ui';
  const tw = ctx.measureText(text).width + 16;
  const bx = x - tw / 2;
  const by = gy - 65;
  // Bubble
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.beginPath(); ctx.roundRect(bx, by, tw, 24, 6); ctx.fill();
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.roundRect(bx, by, tw, 24, 6); ctx.stroke();
  // Tail
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.beginPath();
  ctx.moveTo(x - 5, by + 24);
  ctx.lineTo(x, by + 32);
  ctx.lineTo(x + 5, by + 24);
  ctx.fill();
  // Text
  ctx.fillStyle = '#292524'; ctx.textAlign = 'center';
  ctx.fillText(text, x, by + 16);
}

// ── Level 10: Transatlantic Flight Drawing ──

function drawFlightSky(W, H, cycle, isNight, cam) {
  // Sky gradient — higher altitude blue
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  if (isNight) {
    grad.addColorStop(0, '#0a1628');
    grad.addColorStop(0.6, '#1a2744');
    grad.addColorStop(1, '#1e3a5f');
  } else {
    grad.addColorStop(0, '#1e40af');
    grad.addColorStop(0.4, '#3b82f6');
    grad.addColorStop(1, '#60a5fa');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Stars at night
  if (isNight) {
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    for (let i = 0; i < 40; i++) {
      const sx = (i * 137 + 50) % W;
      const sy = (i * 89 + 20) % (H * 0.4);
      ctx.beginPath();
      ctx.arc(sx, sy, 1 + (i % 3) * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Sun or moon
  if (!isNight) {
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(W - 80, 60, 30, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(W - 80, 60, 22, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawFlightWorld(W, H, cam, cycle, isNight) {
  const ww = level10Flight.worldW;
  const t = gameTime;

  // Ocean — bottom third of screen (draw relative to cam so it fills the visible area)
  const oceanTop = H * 0.7;
  const oceanGrad = ctx.createLinearGradient(0, oceanTop, 0, H);
  oceanGrad.addColorStop(0, '#1d4ed8');
  oceanGrad.addColorStop(0.5, '#1e3a8a');
  oceanGrad.addColorStop(1, '#172554');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(cam, oceanTop, W, H - oceanTop);

  // Animated wave patterns
  ctx.strokeStyle = 'rgba(96, 165, 250, 0.4)';
  ctx.lineWidth = 2;
  for (let row = 0; row < 4; row++) {
    ctx.beginPath();
    const wy = oceanTop + 15 + row * 18;
    for (let x = cam - 20; x < cam + W + 20; x += 5) {
      const yOff = Math.sin((x + cam * 0.3 + t / 500 + row * 50) / 30) * 5;
      if (x === cam - 20) ctx.moveTo(x, wy + yOff);
      else ctx.lineTo(x, wy + yOff);
    }
    ctx.stroke();
  }

  // Distant ships on ocean
  const shipPositions = [800, 2200, 3600, 5000];
  for (const shipX of shipPositions) {
    const sx = shipX + cam * 0.5; // parallax (translate already applied)
    if (sx < cam - 40 || sx > cam + W + 40) continue;
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(sx - 8, oceanTop + 8, 16, 6);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(sx - 1, oceanTop - 2, 2, 12);
  }

  // Occasional islands
  const islandPositions = [1500, 3800];
  for (const ix of islandPositions) {
    const isx = ix + cam * 0.5;
    if (isx < cam - 60 || isx > cam + W + 60) continue;
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.ellipse(isx, oceanTop + 5, 25, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    // Palm tree on island
    ctx.fillStyle = '#92400e';
    ctx.fillRect(isx - 2, oceanTop - 15, 4, 18);
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.ellipse(isx, oceanTop - 18, 12, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Florida coastline at end of level
  const coastX = ww - 500;
  if (coastX < cam + W + 200) {
    ctx.fillStyle = '#fbbf24'; // sandy beach
    ctx.beginPath();
    ctx.moveTo(coastX, oceanTop);
    ctx.lineTo(coastX + 200, oceanTop - 30);
    ctx.lineTo(coastX + 600, oceanTop - 15);
    ctx.lineTo(coastX + 600, H);
    ctx.lineTo(coastX, H);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#22c55e'; // green land
    ctx.beginPath();
    ctx.moveTo(coastX + 50, oceanTop - 10);
    ctx.lineTo(coastX + 200, oceanTop - 35);
    ctx.lineTo(coastX + 550, oceanTop - 20);
    ctx.lineTo(coastX + 600, oceanTop - 15);
    ctx.lineTo(coastX + 600, oceanTop);
    ctx.lineTo(coastX + 50, oceanTop);
    ctx.closePath();
    ctx.fill();
    // Airstrip runway
    ctx.fillStyle = '#374151';
    ctx.fillRect(coastX + 150, oceanTop - 28, 300, 12);
    // Runway center line (dashed)
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.moveTo(coastX + 160, oceanTop - 22);
    ctx.lineTo(coastX + 440, oceanTop - 22);
    ctx.stroke();
    ctx.setLineDash([]);
    // Runway edge lights
    ctx.fillStyle = '#ef4444';
    for (let lx = coastX + 160; lx < coastX + 440; lx += 40) {
      ctx.beginPath();
      ctx.arc(lx, oceanTop - 16, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(lx, oceanTop - 28, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    // "Cape Canaveral" label
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Cape Canaveral!', coastX + 300, oceanTop - 45);
    // "Press Enter to Land" prompt
    if (player.x > coastX + 100) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 16px system-ui';
      ctx.fillText('Press Enter to Land!', coastX + 300, oceanTop - 60);
    }
    ctx.textAlign = 'left';
  }

  // Draw clouds (translucent, visual only, behind obstacles)
  for (const cloud of level10Flight.clouds) {
    const cx = cloud.x + Math.sin(t / 2000 + cloud.x) * 20;
    if (cx < cam -cloud.w || cx > cam + W + cloud.w) continue;
    ctx.globalAlpha = cloud.alpha;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(cx, cloud.y, cloud.w / 2, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx - cloud.w * 0.25, cloud.y + 5, cloud.w * 0.3, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + cloud.w * 0.25, cloud.y + 3, cloud.w * 0.35, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // Draw seagulls
  for (const sg of level10Flight.seagulls) {
    const sx = sg.x;
    if (sx < cam - 30 || sx > cam + W + 30) continue;
    if (sg.hit) continue;
    const wingY = Math.sin(t / 200 + sg.wingPhase) * 5;
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sx - 12, sg.y + wingY);
    ctx.quadraticCurveTo(sx - 4, sg.y - 6 + wingY, sx, sg.y);
    ctx.quadraticCurveTo(sx + 4, sg.y - 6 + wingY, sx + 12, sg.y + wingY);
    ctx.stroke();
    // Body
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.ellipse(sx, sg.y + 2, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    // Beak
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(sx + 5, sg.y + 1);
    ctx.lineTo(sx + 9, sg.y + 3);
    ctx.lineTo(sx + 5, sg.y + 4);
    ctx.closePath();
    ctx.fill();
  }

  // Draw thunderstorms
  for (const storm of level10Flight.storms) {
    const sx = storm.x;
    if (sx < cam -storm.w || sx > cam + W + storm.w) continue;
    if (storm.hit) continue;
    // Dark cloud
    ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
    ctx.beginPath();
    ctx.ellipse(sx, storm.y, storm.w / 2, storm.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(sx - 20, storm.y + 10, storm.w * 0.35, storm.h * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(sx + 25, storm.y + 8, storm.w * 0.3, storm.h * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
    // Lightning flash
    storm.flashTimer = (storm.flashTimer + 16) % 1200;
    if (storm.flashTimer < 100) {
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx - 5, storm.y + storm.h / 2);
      ctx.lineTo(sx + 3, storm.y + storm.h / 2 + 15);
      ctx.lineTo(sx - 2, storm.y + storm.h / 2 + 15);
      ctx.lineTo(sx + 5, storm.y + storm.h / 2 + 30);
      ctx.stroke();
    }
  }

  // Draw hurricanes
  for (const hur of level10Flight.hurricanes) {
    const hx = hur.x;
    if (hx < cam -hur.radius * 2 || hx > cam + W + hur.radius * 2) continue;
    if (hur.hit) continue;
    hur.rotation += 0.02;
    // Swirling cloud
    for (let ring = 0; ring < 4; ring++) {
      const r = hur.radius - ring * 10;
      const alpha = 0.3 + ring * 0.15;
      ctx.strokeStyle = `rgba(100, 116, 139, ${alpha})`;
      ctx.lineWidth = 6 - ring;
      ctx.beginPath();
      ctx.arc(hx, hur.y, r, hur.rotation + ring * 0.5, hur.rotation + ring * 0.5 + Math.PI * 1.5);
      ctx.stroke();
    }
    // Eye
    ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
    ctx.beginPath();
    ctx.arc(hx, hur.y, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw rubies (yarn balls with ruby appearance)
  for (const ruby of level10Flight.yarnBalls) {
    const rx = ruby.x;
    if (rx < cam - 20 || rx > cam + W + 20) continue;
    if (ruby.collected) continue;
    const bob = Math.sin(t / 300 + ruby.bobPhase) * 3;
    // Ruby gem shape
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    const ry = ruby.y + bob;
    ctx.moveTo(rx, ry - 8);
    ctx.lineTo(rx + 7, ry - 3);
    ctx.lineTo(rx + 5, ry + 6);
    ctx.lineTo(rx - 5, ry + 6);
    ctx.lineTo(rx - 7, ry - 3);
    ctx.closePath();
    ctx.fill();
    // Shine
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath();
    ctx.moveTo(rx - 2, ry - 6);
    ctx.lineTo(rx + 2, ry - 6);
    ctx.lineTo(rx + 4, ry - 3);
    ctx.lineTo(rx - 4, ry - 3);
    ctx.closePath();
    ctx.fill();
    // Sparkle
    ctx.fillStyle = '#fbbf24';
    const sparkle = Math.sin(t / 150 + ruby.bobPhase) * 0.5 + 0.5;
    ctx.globalAlpha = sparkle;
    ctx.beginPath();
    ctx.arc(rx + 4, ry - 5, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // Draw the plane (player)
  const px = player.x;
  const py = player.y;
  // Plane body
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.ellipse(px, py, 18, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  // Wings
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(px - 6, py - 14, 12, 6);
  ctx.fillRect(px - 6, py + 8, 12, 6);
  // Tail
  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.moveTo(px - 18, py);
  ctx.lineTo(px - 26, py - 10);
  ctx.lineTo(px - 26, py + 10);
  ctx.closePath();
  ctx.fill();
  // Cockpit
  ctx.fillStyle = '#60a5fa';
  ctx.beginPath();
  ctx.ellipse(px + 10, py - 2, 6, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  // Propeller
  const propAngle = t / 50;
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(px + 18 + Math.cos(propAngle) * 8, py + Math.sin(propAngle) * 8);
  ctx.lineTo(px + 18 - Math.cos(propAngle) * 8, py - Math.sin(propAngle) * 8);
  ctx.stroke();

  // Player cat in cockpit (tiny)
  drawKitty(px + 8, py + 2, player.color || '#86efac', 1, 0, 'horn', playerEyeColor, playerHornColors);

  // HUD: show "Enter" prompt near Florida
  if (player.x > ww - 500) {
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 16px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Press Enter to land in Florida!', W / 2, 30);
    ctx.textAlign = 'left';
  }

  // NPCs are not visible during flight — they're decorative for data integrity
}

// ── Level 11: Cape Canaveral Drawing ──

function drawCapeSky(W, H, cycle, isNight, cam) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  if (isNight) {
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.5, '#1e293b');
    grad.addColorStop(1, '#334155');
  } else {
    grad.addColorStop(0, '#38bdf8');
    grad.addColorStop(0.5, '#7dd3fc');
    grad.addColorStop(1, '#bae6fd');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Clouds
  ctx.fillStyle = isNight ? 'rgba(148,163,184,0.3)' : 'rgba(255,255,255,0.7)';
  const cloudPositions = [200, 600, 1100, 1600, 2200, 3000, 3500, 4200, 4800];
  for (const cp of cloudPositions) {
    const x = cp + cam * 0.7;
    if (x < cam - 80 || x > cam + W + 80) continue;
    ctx.beginPath();
    ctx.ellipse(x, 60 + (cp % 50), 40, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 20, 55 + (cp % 50), 30, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Sun/Moon
  if (!isNight) {
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(W - 100, 70, 30, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCapeWorld(W, H, cam, cycle, isNight) {
  const ww = level11Cape.worldW;
  const t = gameTime;

  // Ocean in background (visible area)
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(cam, GROUND_Y + 10, W, H - GROUND_Y);

  // Sandy ground
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(0, GROUND_Y, ww, 20);
  ctx.fillStyle = '#d97706';
  ctx.fillRect(0, GROUND_Y + 20, ww, H);

  // Concrete launch area (near rocket)
  const concreteX = ROCKET_POS.x - 200;
  ctx.fillStyle = '#9ca3af';
  ctx.fillRect(concreteX, GROUND_Y, 400, 20);

  // NASA Building
  const nbx = NASA_BUILDING_POS.x;
  if (nbx > cam - 200 && nbx < cam + W + 200) {
    // Main building
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(nbx, GROUND_Y - 120, NASA_BUILDING_POS.w, 120);
    // Roof
    ctx.fillStyle = '#475569';
    ctx.fillRect(nbx - 10, GROUND_Y - 130, NASA_BUILDING_POS.w + 20, 15);
    // NASA logo area
    ctx.fillStyle = '#1e40af';
    ctx.beginPath();
    ctx.arc(nbx + NASA_BUILDING_POS.w / 2, GROUND_Y - 80, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('NASA', nbx + NASA_BUILDING_POS.w / 2, GROUND_Y - 77);
    ctx.textAlign = 'left';
    // Windows
    for (let w = 0; w < 4; w++) {
      ctx.fillStyle = '#bfdbfe';
      ctx.fillRect(nbx + 15 + w * 42, GROUND_Y - 55, 25, 20);
    }
    // Door
    ctx.fillStyle = '#64748b';
    ctx.fillRect(nbx + NASA_BUILDING_POS.w / 2 - 15, GROUND_Y - 40, 30, 40);
  }

  // Space Suit Area
  const ssx = SPACE_SUIT_POS.x;
  if (ssx > cam - 60 && ssx < cam + W + 60) {
    // Display case
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(ssx - 20, GROUND_Y - 60, 40, 60);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.strokeRect(ssx - 20, GROUND_Y - 60, 40, 60);
    // Suit on display (if not worn)
    if (!capeSpaceSuit) {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(ssx - 8, GROUND_Y - 50, 16, 35);
      // Helmet
      ctx.fillStyle = '#bfdbfe';
      ctx.beginPath();
      ctx.arc(ssx, GROUND_Y - 52, 10, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#fff';
    ctx.font = '10px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Space Suit', ssx, GROUND_Y - 65);
    ctx.textAlign = 'left';
  }

  // THE ROCKET - the centerpiece!
  const rx = ROCKET_POS.x;
  if (rx > cam - 100 && rx < cam + W + 100) {
    // Launch tower
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(rx + 30, GROUND_Y - 200, 8, 200);
    // Cross beams
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(rx + 10, GROUND_Y - 40 * i - 30, 35, 3);
    }

    // Rocket body
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(rx - 15, GROUND_Y - 180, 30, 140);

    // Rocket nose cone
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(rx, GROUND_Y - 220);
    ctx.lineTo(rx + 15, GROUND_Y - 180);
    ctx.lineTo(rx - 15, GROUND_Y - 180);
    ctx.closePath();
    ctx.fill();

    // Rocket stripes
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(rx - 15, GROUND_Y - 120, 30, 10);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(rx - 15, GROUND_Y - 80, 30, 10);

    // Fins
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(rx - 15, GROUND_Y - 40);
    ctx.lineTo(rx - 30, GROUND_Y);
    ctx.lineTo(rx - 15, GROUND_Y);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(rx + 15, GROUND_Y - 40);
    ctx.lineTo(rx + 30, GROUND_Y);
    ctx.lineTo(rx + 15, GROUND_Y);
    ctx.closePath();
    ctx.fill();

    // Engine nozzle
    ctx.fillStyle = '#475569';
    ctx.fillRect(rx - 10, GROUND_Y - 40, 20, 10);

    // Fuel gauge if fueling
    if (capeFueling > 0 && capeFueling < 3000) {
      const pct = capeFueling / 3000;
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(rx - 25, GROUND_Y - 250, 50, 8);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(rx - 25, GROUND_Y - 250, 50 * pct, 8);
      ctx.fillStyle = '#fff';
      ctx.font = '10px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('Fueling...', rx, GROUND_Y - 255);
      ctx.textAlign = 'left';
    }

    // Fueled indicator
    if (capeFueled && !capeLaunching) {
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 12px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('\u2713 FUELED', rx, GROUND_Y - 235);
      ctx.textAlign = 'left';
    }

    // Launch flames!
    if (capeLaunching) {
      for (let i = 0; i < 8; i++) {
        const flameH = 20 + Math.random() * 30;
        const fx = rx - 8 + Math.random() * 16;
        ctx.fillStyle = i % 2 === 0 ? '#f59e0b' : '#ef4444';
        ctx.beginPath();
        ctx.moveTo(fx - 5, GROUND_Y - 30);
        ctx.lineTo(fx, GROUND_Y - 30 + flameH);
        ctx.lineTo(fx + 5, GROUND_Y - 30);
        ctx.closePath();
        ctx.fill();
      }
      // Smoke
      ctx.fillStyle = 'rgba(156, 163, 175, 0.6)';
      for (let i = 0; i < 6; i++) {
        const smokeX = rx - 20 + Math.random() * 40;
        const smokeY = GROUND_Y + Math.random() * 20;
        ctx.beginPath();
        ctx.arc(smokeX, smokeY, 10 + Math.random() * 15, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Palm trees
  for (const scene of level11Cape.scenes) {
    if (scene.type !== 'palm_tree') continue;
    const px = scene.x;
    if (px < cam - 30 || px > cam + W + 30) continue;
    // Trunk
    ctx.fillStyle = '#92400e';
    ctx.fillRect(px - 3, GROUND_Y - 50, 6, 50);
    // Fronds
    ctx.fillStyle = '#22c55e';
    for (let f = 0; f < 5; f++) {
      const angle = -Math.PI / 2 + (f - 2) * 0.4 + Math.sin(t / 1000 + scene.x) * 0.05;
      ctx.beginPath();
      ctx.moveTo(px, GROUND_Y - 50);
      ctx.quadraticCurveTo(
        px + Math.cos(angle) * 20,
        GROUND_Y - 50 + Math.sin(angle) * 20,
        px + Math.cos(angle) * 35,
        GROUND_Y - 50 + Math.sin(angle) * 35
      );
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#16a34a';
      ctx.stroke();
    }
  }

  // Platforms — concrete/metal style
  for (const p of level11Cape.platforms) {
    const px = p.x;
    if (px + p.w < cam - 20 || px > cam + W + 20) continue;
    ctx.fillStyle = '#64748b';
    ctx.fillRect(px, p.y, p.w, 10);
    ctx.fillStyle = '#475569';
    ctx.fillRect(px, p.y + 10, p.w, 4);
    // Safety stripes
    ctx.fillStyle = '#fbbf24';
    for (let s = 0; s < p.w; s += 12) {
      ctx.fillRect(px + s, p.y, 6, 2);
    }
  }

  // Yarn balls
  for (const yb of level11Cape.yarnBalls) {
    const yx = yb.x;
    if (yx < cam - 15 || yx > cam + W + 15) continue;
    if (yb.collected) continue;
    const bob = Math.sin(t / 300 + yb.bobPhase) * 3;
    ctx.fillStyle = yb.color;
    ctx.beginPath();
    ctx.arc(yx, yb.y + bob, 8, 0, Math.PI * 2);
    ctx.fill();
    // Yarn lines
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(yx, yb.y + bob, 5, 0, Math.PI);
    ctx.stroke();
  }

  // NPCs
  for (const npc of level11Cape.npcs) {
    const nx = npc.x;
    if (nx < cam - 30 || nx > cam + W + 30) continue;
    drawKitty(npc.x, npc.y, npc.color, npc.facing, npc.walkFrame, npc.accessory);
  }

  // Interaction prompts
  const px = player.x;
  if (!capeSpaceSuit && Math.abs(px - SPACE_SUIT_POS.x) < BUILDING_RANGE) {
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Press S for Space Suit!', SPACE_SUIT_POS.x, GROUND_Y - 80);
    ctx.textAlign = 'left';
  }

  if (Math.abs(px - ROCKET_POS.x) < BUILDING_RANGE && !capeFueled) {
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Hold P to Fuel Rocket', ROCKET_POS.x, GROUND_Y - 235);
    ctx.textAlign = 'left';
  }

  if (capeFueled && capeSpaceSuit && Math.abs(px - ROCKET_POS.x) < BUILDING_RANGE && !capeLaunching) {
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Press Enter to Board Rocket!', ROCKET_POS.x, GROUND_Y - 235);
    ctx.textAlign = 'left';
  }

  drawPlayerAndUI();
}

// Cape Canaveral Launch Scene (interior)
function drawCapeLaunchScene(cam, W, H) {
  const cx = cam + W / 2;
  const cy = H / 2;

  // Dark sky background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(cam, 0, W, H);

  // Stars
  for (let i = 0; i < 50; i++) {
    ctx.fillStyle = 'rgba(255,255,255,' + (0.3 + Math.random() * 0.7) + ')';
    ctx.beginPath();
    ctx.arc(cam + (i * 97 + 30) % W, (i * 61 + 15) % H, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  // Countdown display
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 72px system-ui';
  ctx.textAlign = 'center';
  const countNum = Math.max(0, Math.ceil(capeCountdown / 1000));
  ctx.fillText(countNum.toString(), cx, cy - 20);

  if (countNum <= 0) {
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 36px system-ui';
    ctx.fillText('LIFTOFF!', cx, cy + 40);
  } else {
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '18px system-ui';
    ctx.fillText('Hold SPACE to launch!', cx, cy + 40);

    // Power bar
    const barW = 200;
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(cx - barW / 2, cy + 60, barW, 20);
    ctx.fillStyle = capeLaunchPower > 0.8 ? '#22c55e' : '#f59e0b';
    ctx.fillRect(cx - barW / 2, cy + 60, barW * capeLaunchPower, 20);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.strokeRect(cx - barW / 2, cy + 60, barW, 20);
  }

  ctx.textAlign = 'left';
}

// ── Level 12: Space Flight Drawing ──

function drawSpaceSky(W, H, cycle, isNight, cam) {
  // Always dark in space
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#030712');
  grad.addColorStop(0.5, '#0a0f1a');
  grad.addColorStop(1, '#111827');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Parallax star field — 3 layers
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  for (let i = 0; i < 60; i++) {
    const sx = ((i * 173 + 50) + cam * 0.95) % W;
    const sy = (i * 67 + 20) % H;
    ctx.beginPath();
    ctx.arc(sx < 0 ? sx + W : sx, sy, 0.8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  for (let i = 0; i < 40; i++) {
    const sx = ((i * 211 + 80) + cam * 0.85) % W;
    const sy = (i * 97 + 30) % H;
    ctx.beginPath();
    ctx.arc(sx < 0 ? sx + W : sx, sy, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  for (let i = 0; i < 20; i++) {
    const sx = ((i * 157 + 120) + cam * 0.7) % W;
    const sy = (i * 113 + 10) % H;
    ctx.beginPath();
    ctx.arc(sx < 0 ? sx + W : sx, sy, 1.5 + Math.sin(gameTime / 500 + i) * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Nebula clouds in background
  const nebulaColors = ['rgba(139, 92, 246, 0.08)', 'rgba(236, 72, 153, 0.06)', 'rgba(59, 130, 246, 0.07)'];
  const nebulaPositions = [
    { x: 1000, y: 150, r: 120 },
    { x: 3500, y: 250, r: 100 },
    { x: 5500, y: 100, r: 140 },
  ];
  for (let n = 0; n < nebulaPositions.length; n++) {
    const nb = nebulaPositions[n];
    const nx = nb.x + cam * 0.8;
    if (nx < cam - 200 || nx > cam + W + 200) continue;
    const nebGrad = ctx.createRadialGradient(nx, nb.y, 0, nx, nb.y, nb.r);
    nebGrad.addColorStop(0, nebulaColors[n]);
    nebGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = nebGrad;
    ctx.fillRect(nx - nb.r, nb.y - nb.r, nb.r * 2, nb.r * 2);
  }
}

function drawSpaceWorld(W, H, cam, cycle, isNight) {
  const ww = level12Space.worldW;
  const t = gameTime;

  // Earth behind (shrinking as player moves right)
  const earthProgress = Math.min(1, cam / (ww - W)); // 0 at start, 1 at end
  const earthSize = 80 * (1 - earthProgress * 0.7);
  const earthX = 60 + cam * 0.9;
  const earthY = H / 2 + 50;
  if (earthSize > 5) {
    // Earth glow
    const earthGlow = ctx.createRadialGradient(earthX, earthY, earthSize * 0.8, earthX, earthY, earthSize * 1.5);
    earthGlow.addColorStop(0, 'rgba(59, 130, 246, 0.15)');
    earthGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = earthGlow;
    ctx.beginPath();
    ctx.arc(earthX, earthY, earthSize * 1.5, 0, Math.PI * 2);
    ctx.fill();
    // Earth body
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.arc(earthX, earthY, earthSize, 0, Math.PI * 2);
    ctx.fill();
    // Continents
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(earthX - earthSize * 0.2, earthY - earthSize * 0.1, earthSize * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(earthX + earthSize * 0.25, earthY + earthSize * 0.15, earthSize * 0.25, 0, Math.PI * 2);
    ctx.fill();
    // Ice caps
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(earthX, earthY - earthSize * 0.85, earthSize * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Moon ahead (growing as player approaches)
  const moonSize = 20 + earthProgress * 80;
  const moonX = W - 80 + cam * 0.05;
  const moonY = H / 2 - 30;
  // Moon glow
  const moonGlow = ctx.createRadialGradient(moonX, moonY, moonSize * 0.8, moonX, moonY, moonSize * 1.5);
  moonGlow.addColorStop(0, 'rgba(226, 232, 240, 0.1)');
  moonGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = moonGlow;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonSize * 1.5, 0, Math.PI * 2);
  ctx.fill();
  // Moon body
  ctx.fillStyle = '#d1d5db';
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonSize, 0, Math.PI * 2);
  ctx.fill();
  // Craters
  ctx.fillStyle = '#9ca3af';
  for (let c = 0; c < 4; c++) {
    const craterAngle = c * 1.5 + 0.5;
    const craterDist = moonSize * 0.4;
    ctx.beginPath();
    ctx.arc(
      moonX + Math.cos(craterAngle) * craterDist,
      moonY + Math.sin(craterAngle) * craterDist,
      moonSize * 0.12, 0, Math.PI * 2
    );
    ctx.fill();
  }

  // Draw asteroids
  for (const ast of level12Space.asteroids) {
    const ax = ast.x;
    if (ax < cam -ast.radius * 2 || ax > cam + W + ast.radius * 2) continue;
    if (ast.hit) continue;
    ast.rotation += ast.rotSpeed;
    ctx.save();
    ctx.translate(ax, ast.y);
    ctx.rotate(ast.rotation);
    // Rocky shape
    ctx.fillStyle = '#78716c';
    ctx.beginPath();
    for (let v = 0; v < ast.vertices.length; v++) {
      const vert = ast.vertices[v];
      const vx = Math.cos(vert.angle) * vert.r;
      const vy = Math.sin(vert.angle) * vert.r;
      if (v === 0) ctx.moveTo(vx, vy);
      else ctx.lineTo(vx, vy);
    }
    ctx.closePath();
    ctx.fill();
    // Shading
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.arc(2, 2, ast.radius * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Draw aliens
  for (const alien of level12Space.aliens) {
    const ax = alien.x;
    if (ax < cam - 20 || ax > cam + W + 20) continue;
    if (alien.collected) continue;
    const bob = Math.sin(t / 400 + alien.bobPhase) * 5;
    const ay = alien.y + bob;
    // Alien body — cute blob
    ctx.fillStyle = alien.color;
    ctx.beginPath();
    ctx.ellipse(ax, ay, alien.size, alien.size * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
    // Eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ax - 3, ay - 2, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ax + 3, ay - 2, 3, 0, Math.PI * 2);
    ctx.fill();
    // Pupils
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.arc(ax - 2, ay - 2, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ax + 4, ay - 2, 1.5, 0, Math.PI * 2);
    ctx.fill();
    // Smile
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(ax, ay + 1, 3, 0.1, Math.PI - 0.1);
    ctx.stroke();
    // Waving arm
    const wave = Math.sin(t / 300 + alien.bobPhase) * 0.3;
    ctx.strokeStyle = alien.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ax + alien.size, ay);
    ctx.lineTo(ax + alien.size + 6, ay - 5 + wave * 10);
    ctx.stroke();
    // Sparkle effect
    ctx.fillStyle = '#fbbf24';
    ctx.globalAlpha = 0.5 + Math.sin(t / 200 + alien.bobPhase) * 0.5;
    ctx.beginPath();
    ctx.arc(ax + alien.size + 2, ay - alien.size + 2, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // Draw spaceship (player)
  const px = player.x;
  const py = player.y;

  // Invulnerability flash
  if (spaceInvulnTimer > 0 && Math.floor(gameTime / 100) % 2 === 0) {
    // Skip drawing during flash frames for visual feedback
  } else {
    // Thrust trail
    ctx.fillStyle = '#f59e0b';
    for (let i = 0; i < 5; i++) {
      const trailX = px - 20 - i * 6 - ((i * 37 + gameTime) % 4);
      const trailY = py + ((i * 23 + gameTime) % 8) - 4;
      const trailR = 4 - i * 0.6;
      ctx.globalAlpha = 0.7 - i * 0.12;
      ctx.beginPath();
      ctx.arc(trailX, trailY, trailR, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    // Ship body
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(px + 20, py);
    ctx.lineTo(px - 10, py - 12);
    ctx.lineTo(px - 15, py);
    ctx.lineTo(px - 10, py + 12);
    ctx.closePath();
    ctx.fill();
    // Cockpit
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.ellipse(px + 5, py, 7, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Wings
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(px - 5, py - 5);
    ctx.lineTo(px - 12, py - 18);
    ctx.lineTo(px - 8, py - 5);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(px - 5, py + 5);
    ctx.lineTo(px - 12, py + 18);
    ctx.lineTo(px - 8, py + 5);
    ctx.closePath();
    ctx.fill();
  }

  // HUD: aliens collected
  ctx.fillStyle = '#a78bfa';
  ctx.font = 'bold 14px system-ui';
  ctx.textAlign = 'left';
  ctx.fillText('Aliens: ' + collectedAlienCount + '/' + MAX_SPACE_ALIENS, 10, 70);

  // Approach Moon prompt
  if (player.x > ww - 600) {
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 16px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Press Enter to land on the Moon!', W / 2, 30);
    ctx.textAlign = 'left';
  }
}

// ── Level Registry ──
// Central registry mapping level numbers to their data and draw functions.
// Defined here (at the bottom of drawing.js) because all level data from
// ── Level 13: Moon Drawing ──

function drawMoonSky(W, H, cycle, isNight, cam) {
  // Always dark on the Moon — no atmosphere
  ctx.fillStyle = '#030712';
  ctx.fillRect(0, 0, W, H);

  // Stars
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  for (let i = 0; i < 80; i++) {
    const sx = (i * 137 + 50) % W;
    const sy = (i * 89 + 20) % (H * 0.6);
    ctx.beginPath();
    ctx.arc(sx, sy, 0.8 + (i % 3) * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Earth — large, beautiful, in the sky
  const earthX = W * 0.75;
  const earthY = 80;
  const earthR = 40;
  // Glow
  const glow = ctx.createRadialGradient(earthX, earthY, earthR, earthX, earthY, earthR * 2);
  glow.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(earthX, earthY, earthR * 2, 0, Math.PI * 2);
  ctx.fill();
  // Earth body
  ctx.fillStyle = '#2563eb';
  ctx.beginPath();
  ctx.arc(earthX, earthY, earthR, 0, Math.PI * 2);
  ctx.fill();
  // Continents
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(earthX - 10, earthY - 5, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(earthX + 12, earthY + 8, 10, 0, Math.PI * 2);
  ctx.fill();
  // Ice caps
  ctx.fillStyle = '#f1f5f9';
  ctx.beginPath();
  ctx.arc(earthX, earthY - earthR * 0.8, 8, 0, Math.PI * 2);
  ctx.fill();
  // Atmosphere ring
  ctx.strokeStyle = 'rgba(96, 165, 250, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(earthX, earthY, earthR + 3, 0, Math.PI * 2);
  ctx.stroke();
}

function drawMoonWorld(W, H, cam, cycle, isNight) {
  const ww = level13Moon.worldW;
  const t = gameTime;

  // Lunar ground
  ctx.fillStyle = '#6b7280';
  ctx.fillRect(0, GROUND_Y, ww + 200, H - GROUND_Y + 10);
  // Surface texture
  ctx.fillStyle = '#9ca3af';
  ctx.fillRect(0, GROUND_Y, ww + 200, 3);

  // Craters
  for (const scene of level13Moon.scenes) {
    if (scene.type !== 'crater') continue;
    const cx = scene.x;
    if (cx < cam -scene.r * 2 || cx > cam + W + scene.r * 2) continue;
    ctx.fillStyle = '#4b5563';
    ctx.beginPath();
    ctx.ellipse(cx, GROUND_Y + 5, scene.r, scene.r * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    // Rim
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(cx, GROUND_Y + 3, scene.r + 2, scene.r * 0.3 + 2, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Rocks
  for (const scene of level13Moon.scenes) {
    if (scene.type !== 'rock') continue;
    const rx = scene.x;
    if (rx < cam - 20 || rx > cam + W + 20) continue;
    ctx.fillStyle = '#78716c';
    ctx.beginPath();
    ctx.moveTo(rx - 8, GROUND_Y);
    ctx.lineTo(rx - 5, GROUND_Y - 12);
    ctx.lineTo(rx + 3, GROUND_Y - 15);
    ctx.lineTo(rx + 10, GROUND_Y - 8);
    ctx.lineTo(rx + 8, GROUND_Y);
    ctx.closePath();
    ctx.fill();
  }

  // Smoothie Shop building
  const ssScene = level13Moon.scenes.find(s => s.type === 'smoothie_shop');
  if (ssScene) {
    const sx = ssScene.x;
    if (sx > cam - 150 && sx < cam + W + 150) {
      // Futuristic dome
      ctx.fillStyle = '#818cf8';
      ctx.beginPath();
      ctx.arc(sx, GROUND_Y - 40, 60, Math.PI, 0);
      ctx.lineTo(sx + 60, GROUND_Y);
      ctx.lineTo(sx - 60, GROUND_Y);
      ctx.closePath();
      ctx.fill();
      // Glass panels
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(sx + i * 20, GROUND_Y);
        ctx.lineTo(sx + i * 8, GROUND_Y - 55);
        ctx.stroke();
      }
      // Door
      ctx.fillStyle = '#4f46e5';
      ctx.fillRect(sx - 12, GROUND_Y - 30, 24, 30);
      // Sign
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 11px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('Smoothie Shop', sx, GROUND_Y - 65);
      // Glow
      ctx.fillStyle = 'rgba(129, 140, 248, 0.15)';
      ctx.beginPath();
      ctx.arc(sx, GROUND_Y - 20, 70, 0, Math.PI * 2);
      ctx.fill();
      ctx.textAlign = 'left';
    }
  }

  // TopGolf dome
  const tgScene = level13Moon.scenes.find(s => s.type === 'topgolf');
  if (tgScene) {
    const tx = tgScene.x;
    if (tx > cam - 180 && tx < cam + W + 180) {
      // Large dome
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.arc(tx, GROUND_Y - 50, 70, Math.PI, 0);
      ctx.lineTo(tx + 70, GROUND_Y);
      ctx.lineTo(tx - 70, GROUND_Y);
      ctx.closePath();
      ctx.fill();
      // Illuminated panels
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1;
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(tx + i * 18, GROUND_Y);
        ctx.lineTo(tx + i * 7, GROUND_Y - 65);
        ctx.stroke();
      }
      // Door
      ctx.fillStyle = '#047857';
      ctx.fillRect(tx - 15, GROUND_Y - 35, 30, 35);
      // Sign
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 11px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('TopGolf', tx, GROUND_Y - 75);
      // Flag
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(tx + 50, GROUND_Y - 60, 2, 30);
      ctx.beginPath();
      ctx.moveTo(tx + 52, GROUND_Y - 60);
      ctx.lineTo(tx + 65, GROUND_Y - 55);
      ctx.lineTo(tx + 52, GROUND_Y - 50);
      ctx.closePath();
      ctx.fill();
      ctx.textAlign = 'left';
    }
  }

  // Platforms — lunar rock style
  for (const p of level13Moon.platforms) {
    const px = p.x;
    if (px + p.w < cam - 20 || px > cam + W + 20) continue;
    ctx.fillStyle = '#9ca3af';
    ctx.fillRect(px, p.y, p.w, 8);
    ctx.fillStyle = '#6b7280';
    ctx.fillRect(px, p.y + 8, p.w, 4);
  }

  // Yarn balls
  for (const yb of level13Moon.yarnBalls) {
    const yx = yb.x;
    if (yx < cam - 15 || yx > cam + W + 15) continue;
    if (yb.collected) continue;
    const bob = Math.sin(t / 300 + yb.bobPhase) * 3;
    ctx.fillStyle = yb.color;
    ctx.beginPath();
    ctx.arc(yx, yb.y + bob, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(yx, yb.y + bob, 5, 0, Math.PI);
    ctx.stroke();
  }

  // NPCs (includes aliens from space flight)
  for (const npc of level13Moon.npcs) {
    const nx = npc.x;
    if (nx < cam - 30 || nx > cam + W + 30) continue;
    drawKitty(npc.x, npc.y, npc.color, npc.facing, npc.walkFrame, npc.accessory);
  }

  // Interaction prompts
  if (Math.abs(player.x - SMOOTHIE_SHOP_POS.x) < BUILDING_RANGE) {
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Press Enter for Smoothies!', SMOOTHIE_SHOP_POS.x, GROUND_Y - 80);
    ctx.textAlign = 'left';
  }
  if (Math.abs(player.x - TOPGOLF_POS.x) < BUILDING_RANGE) {
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Press Enter for TopGolf!', TOPGOLF_POS.x, GROUND_Y - 90);
    ctx.textAlign = 'left';
  }

  // Game completion area at end of level
  if (player.x > ww - 300) {
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 18px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('You reached the Moon! Congratulations!', W / 2, 30);
    ctx.font = '14px system-ui';
    ctx.fillText('Press Enter to complete your adventure!', W / 2, 55);
    ctx.textAlign = 'left';
  }

  drawPlayerAndUI();
}

// Smoothie Shop Interior
function drawSmoothieShopInterior(cam, W, H) {
  const cx = cam + W / 2;
  const cy = H / 2;

  // Background — futuristic purple interior
  ctx.fillStyle = '#312e81';
  ctx.fillRect(cx - 220, cy - 140, 440, 300);
  // Floor
  ctx.fillStyle = '#4338ca';
  ctx.fillRect(cx - 220, cy + 20, 440, 140);

  // Glowing fruit containers
  const fruits = [
    { name: 'Strawberry', color: '#ef4444', x: cx - 150 },
    { name: 'Mango', color: '#f59e0b', x: cx - 70 },
    { name: 'Blueberry', color: '#6366f1', x: cx + 10 },
    { name: 'Banana', color: '#fbbf24', x: cx + 90 },
  ];
  for (const fruit of fruits) {
    // Container
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(fruit.x - 20, cy - 80, 40, 50);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(fruit.x - 20, cy - 80, 40, 50);
    // Fruit
    ctx.fillStyle = fruit.color;
    ctx.beginPath();
    ctx.arc(fruit.x, cy - 55, 10, 0, Math.PI * 2);
    ctx.fill();
    // Label
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '9px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(fruit.name, fruit.x, cy - 25);
  }

  // Yogurt dispenser
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(cx + 150, cy - 70, 30, 40);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '8px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('Yogurt', cx + 165, cy - 75);

  // Blender
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(cx - 10, cy - 20, 20, 30);
  ctx.fillStyle = smoothieBlending ? '#a78bfa' : '#e2e8f0';
  ctx.fillRect(cx - 8, cy - 15, 16, 20);

  // Current smoothie ingredients display
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 14px system-ui';
  ctx.fillText('Smoothie Shop', cx, cy - 110);

  // Instructions
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '12px system-ui';
  ctx.fillText('C = Add Fruit | Y = Yogurt | B = Blend | Enter = Exit', cx, cy + 130);

  // Ingredient status
  ctx.font = '11px system-ui';
  const ingText = 'Fruits: ' + smoothieIngredients + '/3 | Yogurt: ' + (smoothieYogurt ? 'Yes' : 'No');
  ctx.fillText(ingText, cx, cy + 50);

  // Blending progress
  if (smoothieBlending) {
    const pct = smoothieProgress / 2000;
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(cx - 50, cy + 60, 100, 10);
    ctx.fillStyle = '#a78bfa';
    ctx.fillRect(cx - 50, cy + 60, 100 * pct, 10);
    ctx.fillText('Blending...', cx, cy + 85);
  }

  // Smoothie count
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 12px system-ui';
  ctx.fillText('Smoothies made: ' + smoothieCount, cx, cy + 105);

  // Recipe Mode hint (when not in recipe mode and not all done)
  if (!recipeModeActive && !recipeAllDone) {
    ctx.fillStyle = '#a78bfa';
    ctx.font = 'bold 11px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Press R for Recipe Mode!', cx, cy + 145);
  }
  if (recipeAllDone) {
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 11px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('All recipes completed!', cx, cy + 145);
  }

  // Recipe Mode overlay
  if (recipeModeActive) {
    drawRecipeCard(cx, cy);
  }

  ctx.textAlign = 'left';
}

function drawRecipeCard(cx, cy) {
  const recipe = RECIPE_DATA[recipeRound];
  const cardW = 360;
  const cardH = 260;
  const cardX = cx - cardW / 2;
  const cardY = cy - cardH / 2;

  // Semi-transparent backdrop
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(cx - 220, cy - 140, 440, 300);

  // Index card background — cream colored
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(cardX, cardY, cardW, cardH);

  // Card border
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 2;
  ctx.strokeRect(cardX, cardY, cardW, cardH);

  // Lined paper effect
  ctx.strokeStyle = 'rgba(147,130,115,0.3)';
  ctx.lineWidth = 1;
  const lineStart = cardY + 45;
  const lineSpacing = 28;
  for (let i = 0; i < recipeSteps.length + 1; i++) {
    const ly = lineStart + i * lineSpacing;
    ctx.beginPath();
    ctx.moveTo(cardX + 10, ly);
    ctx.lineTo(cardX + cardW - 10, ly);
    ctx.stroke();
  }

  // Red margin line
  ctx.strokeStyle = 'rgba(239,68,68,0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cardX + 35, cardY);
  ctx.lineTo(cardX + 35, cardY + cardH);
  ctx.stroke();

  // Title
  ctx.fillStyle = '#92400e';
  ctx.font = 'bold 16px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('Debug the Recipe: ' + recipe.name, cx, cardY + 22);

  // Round indicator
  ctx.fillStyle = '#78716c';
  ctx.font = '11px system-ui';
  ctx.fillText('Round ' + (recipeRound + 1) + ' of 3', cx, cardY + 38);

  // Steps
  ctx.textAlign = 'left';
  const stepStartY = lineStart + 18;
  for (let i = 0; i < recipeSteps.length; i++) {
    const sy = stepStartY + i * lineSpacing;
    const isCorrect = recipeSteps[i] === recipeCorrectOrder[i];
    const isSelected = recipeFirstSwap === i;

    // Highlight selected step
    if (isSelected) {
      ctx.fillStyle = 'rgba(99,102,241,0.2)';
      ctx.fillRect(cardX + 38, sy - 16, cardW - 48, lineSpacing);
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.strokeRect(cardX + 38, sy - 16, cardW - 48, lineSpacing);
    }

    // Step number
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 14px system-ui';
    ctx.fillText((i + 1) + ')', cardX + 42, sy);

    // Step text
    ctx.fillStyle = isCorrect ? '#166534' : '#1f2937';
    ctx.font = '14px system-ui';
    ctx.fillText(recipeSteps[i], cardX + 68, sy);

    // Green checkmark for correctly placed steps
    if (isCorrect) {
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 16px system-ui';
      ctx.fillText('\u2713', cardX + cardW - 30, sy);
    }
  }

  // Instruction text at bottom
  ctx.textAlign = 'center';
  if (recipeComplete) {
    // Success animation — spinning blender
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 14px system-ui';
    ctx.fillText('Correct! Blending ' + recipe.name + '...', cx, cardY + cardH - 20);

    // Blender animation
    const blenderX = cx + 130;
    const blenderY = cardY + cardH - 40;
    ctx.save();
    ctx.translate(blenderX, blenderY);
    ctx.rotate(recipeBlendAnim);
    ctx.fillStyle = recipe.color;
    ctx.fillRect(-8, -8, 16, 16);
    ctx.restore();
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(blenderX - 10, blenderY + 5, 20, 8);
  } else {
    ctx.fillStyle = '#78716c';
    ctx.font = '12px system-ui';
    ctx.fillText('Press two numbers to swap steps! | Enter/Esc = Exit', cx, cardY + cardH - 20);

    if (recipeFirstSwap !== null) {
      ctx.fillStyle = '#6366f1';
      ctx.font = 'bold 12px system-ui';
      ctx.fillText('Step ' + (recipeFirstSwap + 1) + ' selected — press another number to swap', cx, cardY + cardH - 6);
    }
  }
}

// TopGolf Interior
function drawTopGolfInterior(cam, W, H) {
  const cx = cam + W / 2;
  const cy = H / 2;

  // Dark backdrop with lunar landscape visible through dome
  ctx.fillStyle = '#030712';
  ctx.fillRect(cx - 250, cy - 150, 500, 320);

  // Lunar landscape through dome
  ctx.fillStyle = '#374151';
  ctx.fillRect(cx - 250, cy + 50, 500, 120);

  // Targets at varying distances
  const targets = [
    { x: cx + 50, label: 'Close', pts: 20, color: '#22c55e' },
    { x: cx + 130, label: 'Medium', pts: 30, color: '#f59e0b' },
    { x: cx + 220, label: 'Far', pts: 50, color: '#ef4444' },
  ];
  for (const tgt of targets) {
    // Target post
    ctx.fillStyle = tgt.color;
    ctx.fillRect(tgt.x - 1, cy, 2, 50);
    // Target ring
    ctx.strokeStyle = tgt.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(tgt.x, cy + 10, 12, 0, Math.PI * 2);
    ctx.stroke();
    // Points label
    ctx.fillStyle = '#fff';
    ctx.font = '10px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(tgt.pts + 'pts', tgt.x, cy - 5);
  }

  // Player tee area
  ctx.fillStyle = '#065f46';
  ctx.fillRect(cx - 200, cy + 50, 80, 20);

  // Player (unikitty) standing at the tee
  const kittyX = cx - 160;
  const kittyY = cy + 50;
  drawKitty(kittyX, kittyY, player.color, 1, 0, 'horn', playerEyeColor, playerHornColors);

  // Golf club in paws
  ctx.save();
  ctx.translate(kittyX + 8, kittyY - 10);
  ctx.rotate(golfBall.active ? -0.3 : -0.8 + golfAngle * 0.6);
  // Shaft
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 22); ctx.stroke();
  // Club head
  ctx.fillStyle = '#64748b';
  ctx.fillRect(-4, 20, 8, 5);
  ctx.restore();

  // Aim line
  if (!golfBall.active) {
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cx - 160, cy + 50);
    const aimLen = 60;
    ctx.lineTo(
      cx - 160 + Math.cos(golfAngle) * aimLen,
      cy + 50 - Math.sin(golfAngle) * aimLen
    );
    ctx.stroke();
    ctx.setLineDash([]);

    // Power bar
    if (golfCharging) {
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(cx - 200, cy + 80, 80, 8);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(cx - 200, cy + 80, 80 * golfPower, 8);
    }
  }

  // Golf ball in flight
  if (golfBall.active) {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(golfBall.x, golfBall.y, 4, 0, Math.PI * 2);
    ctx.fill();
    // Trail
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.arc(golfBall.x - golfBall.vx * 2, golfBall.y - golfBall.vy * 2, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Title and instructions
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 14px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('TopGolf on the Moon!', cx, cy - 130);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '12px system-ui';
  ctx.fillText('Up/Down = Aim | Space = Shoot | Enter = Exit', cx, cy + 140);

  // Score
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 12px system-ui';
  ctx.fillText('Golf Score: ' + golfScore, cx, cy + 110);

  ctx.textAlign = 'left';
}

const levelRegistry = {
  1: {
    name: 'Meadow',
    worldW: WORLD_W,
    platforms: platforms,
    yarnBalls: yarnBalls,
    npcs: npcs,
    musicId: 'musicMeadow',
    drawSky: drawLevel1Sky,
    drawWorld: drawLevel1World,
  },
  2: {
    name: 'Sledding',
    worldW: level2Sled.worldW,
    platforms: level2Sled.platforms,
    yarnBalls: level2Sled.yarnBalls,
    npcs: sledNpcs,
    musicId: 'musicSledding',
    drawSky: drawSleddingSky,
    drawWorld: drawSleddingWorld,
  },
  3: {
    name: 'NYC',
    worldW: level2.worldW,
    platforms: level2.platforms,
    yarnBalls: level2.yarnBalls,
    npcs: nycNpcs,
    musicId: 'musicNYC',
    drawSky: drawLevel2Sky,
    drawWorld: drawLevel2World,
  },
  4: {
    name: 'Rome',
    worldW: level3.worldW,
    platforms: level3.platforms,
    yarnBalls: level3.yarnBalls,
    npcs: romeNpcs,
    musicId: 'musicRome',
    drawSky: drawRomeSky,
    drawWorld: drawRomeWorld,
  },
  5: {
    name: 'Hawaii',
    worldW: level4.worldW,
    platforms: level4.platforms,
    yarnBalls: level4.yarnBalls,
    npcs: hawaiiNpcs,
    musicId: 'musicHawaii',
    drawSky: drawHawaiiSky,
    drawWorld: drawHawaiiWorld,
  },
  6: {
    name: 'Oriental',
    worldW: levelOriental.worldW,
    platforms: levelOriental.platforms,
    yarnBalls: levelOriental.yarnBalls,
    npcs: orientalNpcs,
    musicId: 'musicOriental',
    drawSky: drawOrientalSky,
    drawWorld: drawOrientalWorld,
  },
  7: {
    name: 'Alps',
    worldW: level5.worldW,
    platforms: level5.platforms,
    yarnBalls: level5.yarnBalls,
    npcs: alpsNpcs,
    musicId: 'musicAlps',
    drawSky: drawAlpsSky,
    drawWorld: drawAlpsWorld,
  },
  8: {
    name: 'Campground',
    worldW: level6.worldW,
    platforms: level6.platforms,
    yarnBalls: level6.yarnBalls,
    npcs: campNpcs,
    musicId: 'musicCampground',
    drawSky: drawCampgroundSky,
    drawWorld: drawCampgroundWorld,
  },
  9: {
    name: 'Africa Safari',
    worldW: level7.worldW,
    platforms: level7.platforms,
    yarnBalls: level7.yarnBalls,
    npcs: safariNpcs,
    musicId: 'musicSafari',
    drawSky: drawSafariSky,
    drawWorld: drawSafariWorld,
  },
  10: {
    name: 'Transatlantic Flight',
    worldW: level10Flight.worldW,
    platforms: level10Flight.platforms,
    yarnBalls: level10Flight.yarnBalls,
    npcs: flightNpcs,
    musicId: 'musicFlight',
    drawSky: drawFlightSky,
    drawWorld: drawFlightWorld,
  },
  11: {
    name: 'Cape Canaveral',
    worldW: level11Cape.worldW,
    platforms: level11Cape.platforms,
    yarnBalls: level11Cape.yarnBalls,
    npcs: capeNpcs,
    musicId: 'musicCapeCanaveral',
    drawSky: drawCapeSky,
    drawWorld: drawCapeWorld,
  },
  12: {
    name: 'Space Flight',
    worldW: level12Space.worldW,
    platforms: level12Space.platforms,
    yarnBalls: level12Space.yarnBalls,
    npcs: spaceNpcs,
    musicId: 'musicSpace',
    drawSky: drawSpaceSky,
    drawWorld: drawSpaceWorld,
  },
  13: {
    name: 'Moon',
    worldW: level13Moon.worldW,
    platforms: level13Moon.platforms,
    yarnBalls: level13Moon.yarnBalls,
    npcs: moonNpcs,
    musicId: 'musicMoon',
    drawSky: drawMoonSky,
    drawWorld: drawMoonWorld,
  },
};

// Derive constants from registry
const LEVEL_NAMES = Object.values(levelRegistry).map(l => l.name);
const TOTAL_LEVELS = Object.keys(levelRegistry).length;

// Validate registry completeness at startup
for (let i = 1; i <= Object.keys(levelRegistry).length; i++) {
  if (!levelRegistry[i]) console.warn('Missing level registry entry for level ' + i);
}

// Validate audio elements exist for each level's musicId
for (const [lvl, reg] of Object.entries(levelRegistry)) {
  if (reg.musicId && !document.getElementById(reg.musicId)) {
    console.warn('Missing audio element for level ' + lvl + ': ' + reg.musicId);
  }
}
