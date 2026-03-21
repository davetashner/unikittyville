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

  if (currentLevel === 1) {
    drawLevel1Sky(W, H, cycle, isNight, cam);
  } else if (currentLevel === 2) {
    drawSleddingSky(W, H, cycle, isNight);
  } else if (currentLevel === 3) {
    drawLevel2Sky(W, H, cycle, isNight);
  } else if (currentLevel === 4) {
    drawRomeSky(W, H, cycle, isNight);
  } else if (currentLevel === 5) {
    drawHawaiiSky(W, H, cycle, isNight);
  } else if (currentLevel === 6) {
    drawOrientalSky(W, H, cycle, isNight);
  } else if (currentLevel === 8) {
    drawCampgroundSky(W, H, cycle, isNight);
  } else if (currentLevel === 9) {
    drawSafariSky(W, H, cycle, isNight);
  } else {
    drawAlpsSky(W, H, cycle, isNight);
  }

  ctx.save();
  ctx.translate(-cam, 0);

  if (insideHouse) {
    drawHouseInterior(cam, W, H);
  } else if (insideCamper) {
    drawCamperInterior(cam, W, H);
  } else if (insideWindmill) {
    drawWindmillInterior(cam, W, H);
  } else if (insidePizza) {
    drawPizzaInterior(cam, W, H);
  } else if (insidePark) {
    drawParkInterior(cam, W, H);
  } else if (insidePantheon) {
    drawPantheonInterior(cam, W, H);
  } else if (swimming) {
    drawSwimmingScene(cam, W, H);
  } else if (surfing) {
    drawSurfingScene(cam, W, H);
  } else if (insideChalet) {
    drawChaletInterior(cam, W, H);
  } else if (swimmingInPool) {
    drawPoolSwimmingScene(cam, W, H);
  } else if (insideCampCamper) {
    drawCampCamperInterior(cam, W, H);
  } else if (swimmingInWateringHole) {
    drawWateringHoleScene(cam, W, H);
  } else if (currentLevel === 1) {
    drawLevel1World(W, H, cam, cycle, isNight);
  } else if (currentLevel === 2) {
    drawSleddingWorld(W, H, cam, cycle, isNight);
  } else if (currentLevel === 3) {
    drawLevel2World(W, H, cam, cycle, isNight);
  } else if (currentLevel === 4) {
    drawRomeWorld(W, H, cam, cycle, isNight);
  } else if (currentLevel === 5) {
    drawHawaiiWorld(W, H, cam, cycle, isNight);
  } else if (scubaDiving) {
    drawScubaDivingScene(cam, W, H);
  } else if (sailing) {
    drawSailingScene(cam, W, H);
  } else if (currentLevel === 6) {
    drawOrientalWorld(W, H, cam, cycle, isNight);
  } else if (currentLevel === 8) {
    drawCampgroundWorld(W, H, cam, cycle, isNight);
  } else if (currentLevel === 9) {
    drawSafariWorld(W, H, cam, cycle, isNight);
  } else {
    drawAlpsWorld(W, H, cam, cycle, isNight);
  }

  // Draw speech bubbles above NPCs (in world coordinates)
  drawSpeechBubbles();

  ctx.restore();
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
  // Draw sled under kitty on sledding level
  if (currentLevel === 2 && sledding) {
    drawSled(player.x, player.y);
  }
  // Draw cheetah under kitty when riding
  if (currentLevel === 9 && ridingCheetah) {
    drawRidingCheetah(player.x, player.y, player.facing);
  }
  drawKitty(player.x, player.y - (ridingCheetah ? 15 : 0), player.color, player.facing, player.walkFrame, 'horn');

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
    const levelNames = { 1: 'Back to the Meadow!', 2: 'Time to Sled!', 3: 'Welcome to NYC!', 4: 'Benvenuto a Roma!', 5: 'Aloha Hawaii!', 6: 'Welcome to the Alps!', 7: 'Welcome to Camp!' };
    const levelSubtitles = { 1: playerName + ' returns home!', 2: playerName + ' hits the snowy hills!', 3: playerName + ' arrives in the big city!', 4: playerName + ' explores the Eternal City!', 5: playerName + ' hits the beach!', 6: playerName + ' hits the slopes!', 7: playerName + ' goes camping!' };
    ctx.fillText(levelNames[levelTransition.toLevel] || 'New Level!', W / 2, H / 2 - 20);
    ctx.font = '20px system-ui';
    ctx.fillText(levelSubtitles[levelTransition.toLevel] || '', W / 2, H / 2 + 20);
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

function drawNYCYarnBalls() {
  for (const yb of level2.yarnBalls) {
    if (yb.collected) continue;
    const bob = Math.sin(gameTime / 400 + yb.bobPhase) * 3;
    const yx = yb.x, yy = yb.y + bob;

    ctx.globalAlpha = 0.25;
    ctx.fillStyle = yb.color;
    ctx.beginPath();
    ctx.arc(yx, yy, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = yb.color;
    ctx.beginPath();
    ctx.arc(yx, yy, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(yx, yy, 10, 0.3, 1.8); ctx.stroke();
    ctx.beginPath(); ctx.arc(yx, yy, 8, 2.0, 3.5); ctx.stroke();
    ctx.beginPath(); ctx.arc(yx, yy, 6, 4.0, 5.5); ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath();
    ctx.arc(yx - 3, yy - 4, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = yb.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(yx + 10, yy + 5);
    ctx.quadraticCurveTo(yx + 16, yy + 12 + bob, yx + 12, yy + 18);
    ctx.stroke();
  }
}

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
    }
  }
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
  for (const p of platforms) {
    // Platform shadow
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(p.x + 3, p.y + 3, p.w, 14);

    // Main platform body
    const pGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + 14);
    pGrad.addColorStop(0, '#a78bfa');
    pGrad.addColorStop(1, '#7c3aed');
    ctx.fillStyle = pGrad;
    ctx.beginPath();
    ctx.roundRect(p.x, p.y, p.w, 14, 6);
    ctx.fill();

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
    ctx.beginPath();
    ctx.arc(p.x + 10, p.y + 6, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(p.x + p.w - 10, p.y + 6, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawYarnBalls() {
  for (const yb of yarnBalls) {
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
    ctx.beginPath();
    ctx.arc(yx, yy, 10, 0.3, 1.8);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(yx, yy, 8, 2.0, 3.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(yx, yy, 6, 4.0, 5.5);
    ctx.stroke();

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
  for (const p of level3.platforms) {
    ctx.fillStyle = 'rgba(0,0,0,0.1)'; ctx.fillRect(p.x + 3, p.y + 3, p.w, 14);
    const pGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + 14);
    pGrad.addColorStop(0, '#d6d3d1'); pGrad.addColorStop(1, '#a8a29e');
    ctx.fillStyle = pGrad; ctx.beginPath(); ctx.roundRect(p.x, p.y, p.w, 14, 4); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(p.x + 5, p.y + 7); ctx.lineTo(p.x + p.w - 5, p.y + 7); ctx.stroke();
  }
}

function drawRomeYarnBalls() {
  for (const yb of level3.yarnBalls) {
    if (yb.collected) continue;
    const bob = Math.sin(gameTime / 400 + yb.bobPhase) * 3;
    const yx = yb.x, yy = yb.y + bob;
    ctx.globalAlpha = 0.25; ctx.fillStyle = yb.color;
    ctx.beginPath(); ctx.arc(yx, yy, 18, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
    ctx.fillStyle = yb.color; ctx.beginPath(); ctx.arc(yx, yy, 12, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(yx, yy, 10, 0.3, 1.8); ctx.stroke();
    ctx.beginPath(); ctx.arc(yx, yy, 8, 2.0, 3.5); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath(); ctx.arc(yx - 3, yy - 4, 3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = yb.color; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(yx + 10, yy + 5);
    ctx.quadraticCurveTo(yx + 16, yy + 12 + bob, yx + 12, yy + 18); ctx.stroke();
  }
}

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
  for (const p of level4.platforms) {
    ctx.fillStyle = 'rgba(0,0,0,0.1)'; ctx.fillRect(p.x + 3, p.y + 3, p.w, 14);
    const pGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + 14);
    pGrad.addColorStop(0, '#a3e635'); pGrad.addColorStop(1, '#65a30d');
    ctx.fillStyle = pGrad; ctx.beginPath(); ctx.roundRect(p.x, p.y, p.w, 14, 4); ctx.fill();
    // Grass tufts on platforms
    ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 1.5;
    for (let i = 0; i < 3; i++) {
      const gx = p.x + 10 + i * (p.w - 20) / 2;
      ctx.beginPath(); ctx.moveTo(gx, p.y); ctx.lineTo(gx - 3, p.y - 6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(gx, p.y); ctx.lineTo(gx + 3, p.y - 5); ctx.stroke();
    }
  }
}

function drawHawaiiYarnBalls() {
  for (const yb of level4.yarnBalls) {
    if (yb.collected) continue;
    const bob = Math.sin(gameTime / 400 + yb.bobPhase) * 3;
    const yx = yb.x, yy = yb.y + bob;
    ctx.globalAlpha = 0.25; ctx.fillStyle = yb.color;
    ctx.beginPath(); ctx.arc(yx, yy, 18, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
    ctx.fillStyle = yb.color; ctx.beginPath(); ctx.arc(yx, yy, 12, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(yx, yy, 10, 0.3, 1.8); ctx.stroke();
    ctx.beginPath(); ctx.arc(yx, yy, 8, 2.0, 3.5); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath(); ctx.arc(yx - 3, yy - 4, 3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = yb.color; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(yx + 10, yy + 5);
    ctx.quadraticCurveTo(yx + 16, yy + 12 + bob, yx + 12, yy + 18); ctx.stroke();
  }
}

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

  // Snowy ground
  ctx.fillStyle = '#f0f4f8';
  ctx.fillRect(0, GROUND_Y, ww, H);
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(0, GROUND_Y, ww, 4);
  // Snow sparkle detail
  ctx.fillStyle = '#fff';
  for (let x = 0; x < ww; x += 30) {
    ctx.fillRect(x + Math.sin(x) * 5, GROUND_Y - 1, 2, 3);
  }

  // Background pine trees
  for (const pine of level2Sled.pines) {
    if (pine.x < cam - 100 || pine.x > cam + W + 100) continue;
    drawPineTree(pine.x, GROUND_Y, pine.size);
  }

  // Snow platforms
  drawSleddingPlatforms();

  // Snowballs
  drawSnowballs();

  // Snowmen
  drawSnowmen(cam, W);

  // Train at end
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

function drawTrain(x) {
  const gy = GROUND_Y;
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
  const ww = getCurrentWorldW();
  // Snow-covered ground
  ctx.fillStyle = '#f0f9ff';
  ctx.fillRect(0, GROUND_Y, ww, H);
  // Snow surface with sparkle
  const snowGrad = ctx.createLinearGradient(0, GROUND_Y, 0, GROUND_Y + 6);
  snowGrad.addColorStop(0, '#e0f2fe');
  snowGrad.addColorStop(1, '#f0f9ff');
  ctx.fillStyle = snowGrad;
  ctx.fillRect(0, GROUND_Y - 2, ww, 8);
  // Snow sparkles
  ctx.fillStyle = '#fff';
  for (let sx = Math.floor((cam - 10) / 30) * 30; sx < cam + W + 10; sx += 30) {
    const sparkle = Math.sin(gameTime / 300 + sx * 0.1) * 0.5 + 0.5;
    ctx.globalAlpha = sparkle * 0.7;
    ctx.beginPath(); ctx.arc(sx + 15, GROUND_Y - 1, 1.5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Draw pine trees (obstacles)
  for (const tree of level5.trees) {
    if (tree.x < cam - 100 || tree.x > cam + W + 100) continue;
    drawAlpsPineTree(tree.x, tree.size, tree.hit);
  }

  // Draw cornices (snow ledges)
  for (const c of level5.cornices) {
    if (c.x < cam - 200 || c.x > cam + W + 200) continue;
    drawCornice(c.x, c.y, c.w);
  }

  // Draw diamonds
  for (const d of level5.diamonds) {
    if (d.collected) continue;
    if (d.x < cam - 50 || d.x > cam + W + 50) continue;
    const bob = Math.sin(gameTime / 350 + d.bobPhase) * 3;
    drawDiamond(d.x, d.y + bob);
  }

  // Chalet at the end
  if (ALPS_WORLD_W - 150 > cam - 200 && ALPS_WORLD_W - 150 < cam + W + 200) {
    drawChalet(ALPS_WORLD_W - 150);
  }

  for (const npc of alpsNpcs) drawKitty(npc.x, npc.y, npc.color, npc.facing, npc.walkFrame, npc.accessory);
  drawPlayerAndUI();
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

function drawKitty(x, y, color, facing, walkFrame, accessory) {
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
  ctx.fillStyle = '#1e1b4b';
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
    const hornGrad = ctx.createLinearGradient(0, -50 + bounce, 0, -58 + bounce);
    hornGrad.addColorStop(0, '#fbbf24');
    hornGrad.addColorStop(0.5, '#f472b6');
    hornGrad.addColorStop(1, '#a78bfa');
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
  for (const p of levelOriental.platforms) {
    ctx.fillStyle = 'rgba(0,0,0,0.1)'; ctx.fillRect(p.x + 3, p.y + 3, p.w, 14);
    const pGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + 14);
    pGrad.addColorStop(0, '#92400e'); pGrad.addColorStop(1, '#78350f');
    ctx.fillStyle = pGrad; ctx.beginPath(); ctx.roundRect(p.x, p.y, p.w, 14, 4); ctx.fill();
    // Dock plank lines
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 0.5;
    for (let i = 0; i < 3; i++) {
      const gx = p.x + 8 + i * (p.w - 16) / 2;
      ctx.beginPath(); ctx.moveTo(gx, p.y + 2); ctx.lineTo(gx, p.y + 12); ctx.stroke();
    }
  }
}

function drawOrientalYarnBalls() {
  for (const yb of levelOriental.yarnBalls) {
    if (yb.collected) continue;
    const bob = Math.sin(gameTime / 400 + yb.bobPhase) * 3;
    const yx = yb.x, yy = yb.y + bob;
    ctx.globalAlpha = 0.25; ctx.fillStyle = yb.color;
    ctx.beginPath(); ctx.arc(yx, yy, 18, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
    ctx.fillStyle = yb.color; ctx.beginPath(); ctx.arc(yx, yy, 12, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(yx, yy, 10, 0.3, 1.8); ctx.stroke();
    ctx.beginPath(); ctx.arc(yx, yy, 8, 2.0, 3.5); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath(); ctx.arc(yx - 3, yy - 4, 3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = yb.color; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(yx + 10, yy + 5);
    ctx.quadraticCurveTo(yx + 16, yy + 12 + bob, yx + 12, yy + 18); ctx.stroke();
  }
}

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
  drawKitty(cx, cy + 5 + bob, player.color, player.facing, player.walkFrame, 'horn');
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
    const by = npc.y - 50 - boxH;
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
  drawKitty(px, py, player.color, player.facing, player.walkFrame, 'horn');
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
  for (const p of level6.platforms) {
    ctx.fillStyle = 'rgba(0,0,0,0.1)'; ctx.fillRect(p.x + 3, p.y + 3, p.w, 14);
    const pGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + 14);
    pGrad.addColorStop(0, '#8B7355'); pGrad.addColorStop(1, '#6B5440');
    ctx.fillStyle = pGrad; ctx.beginPath(); ctx.roundRect(p.x, p.y, p.w, 14, 4); ctx.fill();
    // Moss on platforms
    ctx.fillStyle = '#5c9c4a';
    for (let i = 0; i < 2; i++) {
      const mx = p.x + 8 + i * (p.w - 16);
      ctx.beginPath(); ctx.arc(mx, p.y + 2, 3, Math.PI, 0); ctx.fill();
    }
  }
}

function drawCampgroundYarnBalls() {
  for (const yb of level6.yarnBalls) {
    if (yb.collected) continue;
    const bob = Math.sin(gameTime / 400 + yb.bobPhase) * 3;
    const yx = yb.x, yy = yb.y + bob;
    ctx.globalAlpha = 0.25; ctx.fillStyle = yb.color;
    ctx.beginPath(); ctx.arc(yx, yy, 18, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
    ctx.fillStyle = yb.color; ctx.beginPath(); ctx.arc(yx, yy, 12, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(yx, yy, 10, 0.3, 1.8); ctx.stroke();
    ctx.beginPath(); ctx.arc(yx, yy, 8, 2.0, 3.5); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath(); ctx.arc(yx - 3, yy - 4, 3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = yb.color; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(yx + 10, yy + 5);
    ctx.quadraticCurveTo(yx + 16, yy + 12 + bob, yx + 12, yy + 18); ctx.stroke();
  }
}

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
  if (campCamperImg.complete && campCamperImg.naturalWidth > 0) {
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
  for (const p of level7.platforms) {
    ctx.fillStyle = 'rgba(0,0,0,0.1)'; ctx.fillRect(p.x + 3, p.y + 3, p.w, 14);
    const pGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + 14);
    pGrad.addColorStop(0, '#a0845a'); pGrad.addColorStop(1, '#8a6e44');
    ctx.fillStyle = pGrad; ctx.beginPath(); ctx.roundRect(p.x, p.y, p.w, 14, 4); ctx.fill();
    // Rocky texture
    ctx.fillStyle = '#b89a6a';
    ctx.fillRect(p.x + 5, p.y + 2, 6, 3);
    ctx.fillRect(p.x + p.w - 15, p.y + 4, 8, 2);
  }
}

function drawSafariYarnBalls() {
  for (const yb of level7.yarnBalls) {
    if (yb.collected) continue;
    const bob = Math.sin(gameTime / 400 + yb.bobPhase) * 3;
    const yx = yb.x, yy = yb.y + bob;
    ctx.globalAlpha = 0.25; ctx.fillStyle = yb.color;
    ctx.beginPath(); ctx.arc(yx, yy, 18, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
    ctx.fillStyle = yb.color; ctx.beginPath(); ctx.arc(yx, yy, 12, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(yx, yy, 10, 0.3, 1.8); ctx.stroke();
    ctx.beginPath(); ctx.arc(yx, yy, 8, 2.0, 3.5); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath(); ctx.arc(yx - 3, yy - 4, 3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = yb.color; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(yx + 10, yy + 5);
    ctx.quadraticCurveTo(yx + 16, yy + 12 + bob, yx + 12, yy + 18); ctx.stroke();
  }
}

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
  // Swimming scene — similar to fountain swimming
  const cx = cam + W / 2;
  const cy = GROUND_Y - 80;
  // Background
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
  // Player splashing
  drawKitty(cx, cy + 45, player.color, player.facing, player.walkFrame, 'horn');
  // Splash effects
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  for (let i = 0; i < 3; i++) {
    const sx = cx + Math.sin(gameTime / 200 + i * 2) * 30;
    const sy = cy + 40 + Math.cos(gameTime / 300 + i) * 5;
    ctx.beginPath(); ctx.arc(sx, sy, 3, 0, Math.PI * 2); ctx.fill();
  }
  // Instructions
  ctx.fillStyle = '#fff'; ctx.font = 'bold 14px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('Splashing in the watering hole! Press S to get out', cx, cy - 10);
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
