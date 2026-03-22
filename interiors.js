function drawHouseInterior(cam, W, H) {
  // Simple cozy interior
  const cx = player.x;
  const cy = GROUND_Y - 80;

  // Floor
  ctx.fillStyle = '#d4a574';
  ctx.fillRect(cx - 200, cy, 400, 160);

  // Back wall
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(cx - 200, cy - 140, 400, 140);

  // Rug
  ctx.fillStyle = '#c084fc';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 40, 80, 30, 0, 0, Math.PI * 2);
  ctx.fill();

  // Fireplace
  ctx.fillStyle = '#78350f';
  ctx.fillRect(cx - 40, cy - 80, 80, 80);
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.moveTo(cx - 20, cy);
  ctx.quadraticCurveTo(cx, cy - 50, cx + 20, cy);
  ctx.fill();
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.moveTo(cx - 10, cy);
  ctx.quadraticCurveTo(cx, cy - 30, cx + 10, cy);
  ctx.fill();

  // Cozy text
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 18px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('Home sweet home!', cx, cy - 110);
  ctx.font = '14px system-ui';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText('Press Enter to go outside', cx, cy + 130);

  // Draw player inside
  drawKitty(cx, cy + 60, player.color, 1, 0, 'horn', playerEyeColor, playerHornColors);
}

function drawCamperInterior(cam, W, H) {
  const cx = player.x;
  const cy = GROUND_Y - 80;
  const kittyX = cx + camperPlayerX;

  // Floor (wood)
  ctx.fillStyle = '#c4a882';
  ctx.fillRect(cx - 200, cy, 400, 160);
  // Wood grain
  ctx.strokeStyle = '#b8976e'; ctx.lineWidth = 0.5;
  for (let i = 0; i < 10; i++) ctx.strokeRect(cx - 200 + i * 40, cy, 40, 160);

  // Back wall
  ctx.fillStyle = '#fef9c3';
  ctx.fillRect(cx - 200, cy - 140, 400, 140);

  // Window with curtains
  ctx.fillStyle = '#bae6fd';
  ctx.fillRect(cx - 80, cy - 110, 60, 40);
  ctx.fillRect(cx + 20, cy - 110, 60, 40);
  ctx.fillStyle = '#f9a8d4';
  ctx.fillRect(cx - 80, cy - 110, 12, 40);
  ctx.fillRect(cx - 32, cy - 110, 12, 40);
  ctx.fillRect(cx + 20, cy - 110, 12, 40);
  ctx.fillRect(cx + 68, cy - 110, 12, 40);

  // Bunk bed
  ctx.fillStyle = '#92400e';
  ctx.fillRect(cx + 120, cy - 60, 60, 60);
  ctx.fillStyle = '#c084fc';
  ctx.fillRect(cx + 124, cy - 56, 52, 20);
  ctx.fillStyle = '#818cf8';
  ctx.fillRect(cx + 124, cy - 20, 52, 16);
  // Pillow
  ctx.fillStyle = '#e0e7ff';
  ctx.beginPath(); ctx.roundRect(cx + 127, cy - 54, 16, 14, 4); ctx.fill();

  // Small kitchenette / stove
  ctx.fillStyle = '#d1d5db';
  ctx.fillRect(cx - 180, cy - 40, 50, 40);
  ctx.fillStyle = '#1f2937';
  ctx.beginPath(); ctx.arc(cx - 165, cy - 30, 6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx - 145, cy - 30, 6, 0, Math.PI * 2); ctx.fill();

  // Cooking on stove
  if (camperCooking.active) {
    // Fish on stove
    const cookProgress = Math.min(camperCooking.progress / 4500, 1);
    const fishR = Math.floor(255 - cookProgress * 130);
    const fishG = Math.floor(180 - cookProgress * 100);
    const fishB = Math.floor(100 - cookProgress * 60);
    ctx.fillStyle = `rgb(${fishR},${fishG},${fishB})`;
    ctx.beginPath(); ctx.ellipse(cx - 155, cy - 30, 10, 5, 0, 0, Math.PI * 2); ctx.fill();
    // Tail
    ctx.beginPath(); ctx.moveTo(cx - 165, cy - 30); ctx.lineTo(cx - 172, cy - 36); ctx.lineTo(cx - 172, cy - 24); ctx.fill();
    // Steam/smoke
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1.5;
    for (let i = 0; i < 3; i++) {
      const sx = cx - 160 + i * 8;
      const sway = Math.sin(gameTime / 300 + i * 2) * 4;
      ctx.beginPath(); ctx.moveTo(sx, cy - 38); ctx.quadraticCurveTo(sx + sway, cy - 50, sx - sway, cy - 60); ctx.stroke();
    }
    // Progress indicator
    if (camperCooking.progress >= 2500 && camperCooking.progress < 4500) {
      ctx.fillStyle = '#4ade80'; ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('Ready! Press C', cx - 155, cy - 65);
    }
  }

  // Phone on the wall (between windows)
  const phoneX = cx - 10, phoneY = cy - 95;
  // Phone body
  ctx.fillStyle = '#374151';
  ctx.beginPath(); ctx.roundRect(phoneX - 5, phoneY, 10, 16, 2); ctx.fill();
  // Handset
  ctx.fillStyle = '#1f2937';
  ctx.beginPath(); ctx.roundRect(phoneX - 6, phoneY + 2, 12, 5, 2); ctx.fill();
  // Cord
  ctx.strokeStyle = '#4b5563'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(phoneX, phoneY + 16);
  const cordSway = Math.sin(gameTime / 400) * 3;
  ctx.quadraticCurveTo(phoneX + cordSway, phoneY + 26, phoneX - 2, phoneY + 35);
  ctx.stroke();
  // Ringing animation
  if (camperPhone.ringing) {
    const shake = Math.sin(gameTime / 50) * 3;
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('RING!', phoneX + shake, phoneY - 8);
    // Ring lines
    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(phoneX - 10, phoneY - 2, 8 + Math.sin(gameTime / 80) * 3, Math.PI * 0.7, Math.PI * 1.3); ctx.stroke();
    ctx.beginPath(); ctx.arc(phoneX + 10, phoneY - 2, 8 + Math.sin(gameTime / 80 + 1) * 3, -Math.PI * 0.3, Math.PI * 0.3); ctx.stroke();
  }
  // Phone dialogue bubble
  if (camperPhone.answered && camperPhone.dialogue) {
    const bubbleW = 280;
    const bubbleH = 50;
    const bubbleX = cx - bubbleW / 2;
    const bubbleY = cy - 140 - bubbleH;
    // Bubble background
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath(); ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 8); ctx.fill();
    ctx.strokeStyle = '#d1d5db'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 8); ctx.stroke();
    // Pointer
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath();
    ctx.moveTo(phoneX - 6, bubbleY + bubbleH);
    ctx.lineTo(phoneX, bubbleY + bubbleH + 10);
    ctx.lineTo(phoneX + 6, bubbleY + bubbleH);
    ctx.fill();
    // Text
    ctx.fillStyle = '#1f2937';
    ctx.font = '11px system-ui'; ctx.textAlign = 'center';
    // Word wrap
    const words = camperPhone.dialogue.split(' ');
    let line = '', lineY = bubbleY + 18;
    for (const word of words) {
      const test = line + word + ' ';
      if (ctx.measureText(test).width > bubbleW - 20 && line.length > 0) {
        ctx.fillText(line.trim(), cx, lineY);
        line = word + ' ';
        lineY += 16;
      } else {
        line = test;
      }
    }
    ctx.fillText(line.trim(), cx, lineY);
  }

  // Napping animation
  if (camperNapping) {
    // Kitty in bed
    drawKitty(cx + 140, cy - 40, player.color, 1, 0, 'horn', playerEyeColor, playerHornColors);
    // Zzz
    const napPhase = camperNapTimer / CAMPER_NAP_DURATION;
    ctx.fillStyle = '#fff'; ctx.font = 'bold 14px system-ui'; ctx.textAlign = 'center';
    for (let i = 0; i < 3; i++) {
      const zAlpha = Math.sin(gameTime / 300 + i * 1.5) * 0.3 + 0.7;
      ctx.globalAlpha = zAlpha;
      ctx.fillText('z', cx + 160 + i * 12, cy - 60 - i * 15);
    }
    ctx.globalAlpha = 1;
    // Progress bar
    ctx.fillStyle = '#1f2937'; ctx.fillRect(cx - 40, cy + 100, 80, 8);
    ctx.fillStyle = '#a78bfa'; ctx.fillRect(cx - 40, cy + 100, 80 * napPhase, 8);
    ctx.fillStyle = '#fff'; ctx.font = '13px system-ui';
    ctx.fillText('Napping...', cx, cy + 125);
  } else {
    // Draw player walking around
    drawKitty(kittyX, cy + 60, player.color, player.facing, player.walkFrame, 'horn', playerEyeColor, playerHornColors);
  }

  // Text
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 18px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('Cozy camper vibes!', cx, cy - 120);
  ctx.font = '13px system-ui';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  if (camperPhone.ringing && !camperNapping) {
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('Phone is ringing! Press P to answer', cx, cy + 130);
  } else if (camperPlayerX < -100 && fishCount > 0 && !camperCooking.active && !camperNapping) {
    ctx.fillText('Press C to cook fish  |  Enter to go outside', cx, cy + 130);
  } else if (camperPlayerX > 80 && !camperCooking.active && !camperNapping) {
    ctx.fillText('Press N to nap  |  Enter to go outside', cx, cy + 130);
  } else if (!camperNapping && !camperPhone.answered) {
    ctx.fillText('Walk around!  |  Enter to go outside', cx, cy + 130);
  }
}

function drawWindmillInterior(cam, W, H) {
  const cx = player.x;
  const cy = GROUND_Y - 80;

  // Floor (stone)
  ctx.fillStyle = '#9ca3af';
  ctx.fillRect(cx - 180, cy, 360, 160);
  // Stone pattern
  ctx.strokeStyle = '#6b7280';
  ctx.lineWidth = 1;
  for (let sx = -180; sx < 180; sx += 30) {
    for (let sy = 0; sy < 160; sy += 25) {
      ctx.strokeRect(cx + sx, cy + sy, 30, 25);
    }
  }

  // Curved stone walls
  ctx.fillStyle = '#e5e7eb';
  ctx.fillRect(cx - 180, cy - 150, 360, 150);

  // Gear mechanism on the wall
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 3;
  const gearX = cx, gearY = cy - 90;
  const gAngle = gameTime / 1500;
  ctx.beginPath(); ctx.arc(gearX, gearY, 25, 0, Math.PI * 2); ctx.stroke();
  for (let i = 0; i < 8; i++) {
    const a = gAngle + (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(gearX + Math.cos(a) * 20, gearY + Math.sin(a) * 20);
    ctx.lineTo(gearX + Math.cos(a) * 30, gearY + Math.sin(a) * 30);
    ctx.stroke();
  }

  // Flour sacks
  ctx.fillStyle = '#fef3c7';
  ctx.beginPath(); ctx.roundRect(cx - 140, cy - 30, 35, 30, 4); ctx.fill();
  ctx.beginPath(); ctx.roundRect(cx - 100, cy - 30, 35, 30, 4); ctx.fill();
  ctx.fillStyle = '#92400e';
  ctx.font = '10px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('FLOUR', cx - 122, cy - 10);
  ctx.fillText('FLOUR', cx - 82, cy - 10);

  // Grindstone
  ctx.fillStyle = '#6b7280';
  ctx.beginPath(); ctx.arc(cx + 100, cy - 15, 20, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#4b5563';
  ctx.beginPath(); ctx.arc(cx + 100, cy - 15, 10, 0, Math.PI * 2); ctx.fill();

  // Text
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 18px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('The old windmill!', cx, cy - 130);
  ctx.font = '14px system-ui';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText('Press Enter to go outside', cx, cy + 130);

  drawKitty(cx, cy + 60, player.color, 1, 0, 'horn', playerEyeColor, playerHornColors);
}

function drawPizzaInterior(cam, W, H) {
  const cx = cam + W / 2;
  const cy = GROUND_Y - 80;

  // Kitchen floor (checkered)
  ctx.fillStyle = '#f5f5f4';
  ctx.fillRect(cam, cy, W, H);
  ctx.fillStyle = '#e7e5e4';
  for (let tx = -220; tx < 220; tx += 20) {
    for (let ty = 0; ty < 160; ty += 20) {
      if ((Math.floor(tx / 20) + Math.floor(ty / 20)) % 2 === 0) {
        ctx.fillRect(cx + tx, cy + ty, 20, 20);
      }
    }
  }

  // Back wall (red)
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(cam, 0, W, cy);

  // Italian flag stripe
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(cx - 220, cy - 140, 146, 8);
  ctx.fillStyle = '#fff';
  ctx.fillRect(cx - 74, cy - 140, 148, 8);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(cx + 74, cy - 140, 146, 8);

  // Pizza oven (brick)
  ctx.fillStyle = '#92400e';
  ctx.beginPath();
  ctx.arc(cx + 100, cy - 30, 50, Math.PI, 0);
  ctx.fillRect(cx + 50, cy - 30, 100, 30);
  ctx.fill();
  // Oven opening
  ctx.fillStyle = '#1f2937';
  ctx.beginPath();
  ctx.arc(cx + 100, cy - 10, 25, Math.PI, 0);
  ctx.fill();
  // Fire glow inside oven
  if (pizzaMaking.stage === 'oven') {
    ctx.fillStyle = '#f97316';
    ctx.globalAlpha = 0.6 + Math.sin(gameTime / 150) * 0.2;
    ctx.beginPath();
    ctx.arc(cx + 100, cy - 10, 22, Math.PI, 0);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // Counter
  ctx.fillStyle = '#78350f';
  ctx.fillRect(cx - 150, cy - 10, 180, 10);
  // Counter top
  ctx.fillStyle = '#d6d3d1';
  ctx.fillRect(cx - 150, cy - 14, 180, 6);

  // Pizza being made on counter
  const pizzaX = cx - 60;
  const pizzaY = cy - 24;

  if (pizzaMaking.stage === 'dough') {
    // Dough ball expanding
    const doughSize = Math.min(20, 8 + pizzaMaking.progress / 100);
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.ellipse(pizzaX, pizzaY, doughSize, doughSize * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Rolling pin
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.roundRect(pizzaX - 25, pizzaY - 6, 50, 5, 2);
    ctx.fill();
  } else if (pizzaMaking.stage === 'toppings') {
    // Flat dough
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.ellipse(pizzaX, pizzaY, 22, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    // Sauce
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.ellipse(pizzaX, pizzaY, 18, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    // Cheese
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.ellipse(pizzaX, pizzaY, 16, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    // Toppings appearing
    const numToppings = Math.min(6, Math.floor(pizzaMaking.progress / 200));
    const toppingColors = ['#ef4444','#16a34a','#78350f','#f97316','#6b7280','#22c55e'];
    for (let i = 0; i < numToppings; i++) {
      const a = (i / 6) * Math.PI * 2 + 0.3;
      ctx.fillStyle = toppingColors[i];
      ctx.beginPath();
      ctx.arc(pizzaX + Math.cos(a) * 10, pizzaY + Math.sin(a) * 5, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (pizzaMaking.stage === 'oven') {
    // Pizza in oven — show timer bar (positioned above counter, clear of prompt)
    const pct = pizzaMaking.progress / 4500;
    const barW = 160;
    const barH = 20;
    const barX = cx - barW / 2;
    const barY = cy - 80;
    // Bar background
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath(); ctx.roundRect(barX, barY, barW, barH, 6); ctx.fill();
    // Zone backgrounds for colorblind clarity
    const zoneW = barW - 4;
    // Undercooked zone (blue) 0-66%
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath(); ctx.roundRect(barX + 2, barY + 2, zoneW * 0.66, barH - 4, [4, 0, 0, 4]); ctx.fill();
    // Perfect zone (bright green) 66-100%
    ctx.fillStyle = '#22c55e';
    ctx.beginPath(); ctx.roundRect(barX + 2 + zoneW * 0.66, barY + 2, zoneW * 0.34, barH - 4, 0); ctx.fill();
    // Burn zone (red/dark) beyond 100%
    ctx.fillStyle = '#991b1b';
    ctx.beginPath(); ctx.roundRect(barX + 2 + zoneW, barY + 2, zoneW * 0.33, barH - 4, [0, 4, 4, 0]); ctx.fill();
    // Fill indicator (white line showing current position)
    const fillX = barX + 2 + Math.min(zoneW * 1.33, zoneW * pct);
    ctx.fillStyle = '#fff';
    ctx.fillRect(fillX - 2, barY - 2, 4, barH + 4);
    // Zone divider lines
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillRect(barX + 2 + zoneW * 0.66, barY, 2, barH);
    ctx.fillRect(barX + 2 + zoneW, barY, 2, barH);
    // Labels
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 10px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('TOO EARLY', barX + 2 + zoneW * 0.33, barY - 6);
    ctx.fillText('PERFECT', barX + 2 + zoneW * 0.83, barY - 6);
  }

  // Completed pizzas on shelf
  for (let i = 0; i < Math.min(5, pizzaMaking.pizzaCount); i++) {
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.ellipse(cx - 180 + i * 28, cy - 90, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.ellipse(cx - 180 + i * 28, cy - 90, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Title
  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 18px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('Pizza Kitchen!', cx, cy - 115);

  // Instructions
  ctx.font = '13px system-ui';
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  if (pizzaMaking.stage === 'idle') {
    ctx.fillText('Press C to start making a pizza', cx, cy + 120);
    ctx.fillText('Press Enter to leave', cx, cy + 138);
  } else if (pizzaMaking.stage === 'oven') {
    ctx.fillText('Press C in the green zone!', cx, cy + 120);
  }

  // Draw player
  drawKitty(cx - 60, cy + 60, player.color, 1, 0, 'horn', playerEyeColor, playerHornColors);

  // Popups
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

function drawParkInterior(cam, W, H) {
  ctx.globalAlpha = 1;
  const cx = cam + W / 2;
  const cy = GROUND_Y - 80;
  const hw = W / 2 + 20; // half-width with margin

  // Sky — cover full visible area
  ctx.fillStyle = '#87ceeb';
  ctx.fillRect(cam - 10, 0, W + 20, cy);
  // Grass ground
  ctx.fillStyle = '#4ade80';
  ctx.fillRect(cam - 10, cy, W + 20, H);
  // Walking path
  ctx.fillStyle = '#d4a574';
  ctx.beginPath();
  ctx.moveTo(cx - hw, cy + 60);
  ctx.quadraticCurveTo(cx, cy + 40, cx + hw, cy + 70);
  ctx.lineTo(cx + hw, cy + 80);
  ctx.quadraticCurveTo(cx, cy + 60, cx - hw, cy + 70);
  ctx.fill();
  // Trees
  for (let i = -2; i <= 2; i++) {
    const tx = cx + i * 90;
    ctx.fillStyle = '#78350f';
    ctx.fillRect(tx - 4, cy - 50, 8, 50);
    ctx.fillStyle = '#16a34a';
    ctx.beginPath(); ctx.arc(tx, cy - 60, 25, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.beginPath(); ctx.arc(tx + 8, cy - 68, 18, 0, Math.PI * 2); ctx.fill();
  }
  // Pond with ducks
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath(); ctx.ellipse(cx + 80, cy + 20, 40, 18, 0, 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < 3; i++) {
    const dx = cx + 65 + i * 15 + Math.sin(gameTime / 600 + i) * 5;
    const dy = cy + 18 + Math.cos(gameTime / 800 + i) * 3;
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath(); ctx.ellipse(dx, dy, 5, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f97316';
    ctx.beginPath(); ctx.moveTo(dx + 4, dy - 1); ctx.lineTo(dx + 7, dy); ctx.lineTo(dx + 4, dy + 1); ctx.fill();
  }
  // Squirrel
  ctx.fillStyle = '#92400e';
  const sq1x = cx - 100 + Math.sin(gameTime / 700) * 15;
  ctx.beginPath(); ctx.ellipse(sq1x, cy + 90, 5, 4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(sq1x + 4, cy + 86, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(sq1x - 6, cy + 85, 4, 0, Math.PI * 2); ctx.fill();
  // Butterfly
  const bfx = cx - 50 + Math.sin(gameTime / 500) * 40;
  const bfy = cy - 20 + Math.cos(gameTime / 400) * 15;
  ctx.fillStyle = '#e879f9';
  const wing = Math.abs(Math.sin(gameTime / 100)) * 4;
  ctx.beginPath(); ctx.ellipse(bfx - 3, bfy, 1 + wing, 5, -0.3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(bfx + 3, bfy, 1 + wing, 5, 0.3, 0, Math.PI * 2); ctx.fill();
  // Title and instructions
  ctx.fillStyle = '#fff'; ctx.font = 'bold 18px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('Central Park', cx, cy - 130);

  // Draw player
  drawKitty(cx - 40, cy + 60, player.color, 1, 0, 'horn', playerEyeColor, playerHornColors);

  // Kit's stroller next to player
  if (hasStroller) {
    drawStroller(cx - 15, cy + 60, kitFurColor);

    // Picnic blanket and food
    if (picnic.active || kitParkBonus) {
      // Blanket
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.ellipse(cx + 60, cy + 75, 45, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef2f2';
      // Checkerboard pattern
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 4; c++) {
          if ((r + c) % 2 === 0) {
            ctx.fillRect(cx + 30 + c * 15, cy + 63 + r * 8, 15, 8);
          }
        }
      }
      // Food items
      // Sandwich
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(cx + 40, cy + 65, 12, 6);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(cx + 40, cy + 67, 12, 2);
      // Apple
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(cx + 65, cy + 70, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#166534';
      ctx.fillRect(cx + 64, cy + 64, 2, 3);
      // Juice box
      ctx.fillStyle = '#f97316';
      ctx.fillRect(cx + 80, cy + 64, 8, 12);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(cx + 81, cy + 66, 6, 4);
    }

    // Picnic interaction
    if (picnic.active) {
      const foods = ['Sandwich', 'Apple', 'Juice'];
      ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 14px system-ui';
      ctx.fillText('Picnic with ' + kitName + '!', cx, cy - 100);
      ctx.fillStyle = '#fff'; ctx.font = '12px system-ui';
      ctx.fillText('Press F to feed ' + kitName + ' (' + picnic.fed + '/3)', cx, cy + 130);
      if (picnic.feeding) {
        ctx.fillStyle = '#f472b6';
        ctx.fillText(kitName + ' is eating the ' + foods[picnic.fed] + '...', cx, cy + 145);
        // Feeding progress bar
        const pct = picnic.feedTimer / 800;
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(cx - 40, cy + 100, 80, 6);
        ctx.fillStyle = '#f472b6';
        ctx.fillRect(cx - 40, cy + 100, 80 * pct, 6);
      }
    } else if (kitParkBonus) {
      ctx.fillStyle = '#f472b6'; ctx.font = '12px system-ui';
      ctx.fillText(kitName + ' had a wonderful picnic!', cx, cy + 130);
      ctx.font = '13px system-ui'; ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillText('Press Enter to leave', cx, cy + 150);
    } else {
      ctx.fillStyle = '#f472b6'; ctx.font = '12px system-ui';
      ctx.fillText('Press P for a picnic with ' + kitName + '!', cx, cy + 130);
      ctx.font = '13px system-ui'; ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fillText('Press Enter to leave', cx, cy + 150);
    }
  } else {
    ctx.font = '13px system-ui'; ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillText('Press Enter to leave', cx, cy + 150);
  }
  ctx.textAlign = 'left';
}

function drawPantheonInterior(cam, W, H) {
  const cx = cam + W / 2;
  const cy = GROUND_Y - 80;
  // Stone walls
  ctx.fillStyle = '#d6d3d1';
  ctx.fillRect(cam, 0, W, H);
  // Marble floor
  ctx.fillStyle = '#e7e5e4';
  ctx.fillRect(cam, cy, W, H);
  // Floor pattern (radial marble tiles)
  ctx.strokeStyle = '#a8a29e';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(cx, cy + 60, 80, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy + 60, 50, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy + 60, 20, 0, Math.PI * 2); ctx.stroke();
  // Dome with oculus (ceiling)
  ctx.fillStyle = '#a8a29e';
  ctx.beginPath(); ctx.arc(cx, cy - 60, 150, Math.PI, 0); ctx.fill();
  // Oculus (hole in dome)
  ctx.fillStyle = '#87ceeb';
  ctx.beginPath(); ctx.arc(cx, cy - 100, 30, 0, Math.PI * 2); ctx.fill();
  // Sunbeam from oculus
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = '#fde68a';
  ctx.beginPath();
  ctx.moveTo(cx - 28, cy - 100);
  ctx.lineTo(cx - 40, cy + 80);
  ctx.lineTo(cx + 40, cy + 80);
  ctx.lineTo(cx + 28, cy - 100);
  ctx.fill();
  ctx.globalAlpha = 1;
  // Dome coffers (indented squares)
  ctx.strokeStyle = '#78716c';
  ctx.lineWidth = 1;
  for (let ring = 0; ring < 4; ring++) {
    const r = 60 + ring * 25;
    const num = 8 + ring * 2;
    for (let i = 0; i < num; i++) {
      const a = Math.PI + (i / num) * Math.PI;
      const ax = cx + Math.cos(a) * r;
      const ay = cy - 60 + Math.sin(a) * r * 0.5;
      ctx.strokeRect(ax - 5, ay - 4, 10, 8);
    }
  }
  // Columns along walls
  ctx.fillStyle = '#c4b5a0';
  for (let i = 0; i < 8; i++) {
    const colX = cx - 180 + i * 52;
    ctx.fillRect(colX, cy - 50, 8, 130);
    ctx.fillRect(colX - 2, cy - 52, 12, 4);
  }
  // Statues in niches
  ctx.fillStyle = '#d6d3d1';
  for (let i = 0; i < 3; i++) {
    const sx = cx - 120 + i * 120;
    ctx.fillRect(sx - 8, cy - 30, 16, 30);
    ctx.beginPath(); ctx.arc(sx, cy - 35, 6, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#fff'; ctx.font = 'bold 18px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('The Pantheon', cx, cy - 130);
  if (!scrollActive) {
    ctx.font = '13px system-ui'; ctx.fillStyle = 'rgba(100,100,100,0.8)';
    if (scrollAllDone) {
      ctx.fillText('All scrolls transcribed! Press Enter to leave', cx, cy + 145);
    } else {
      ctx.fillText('Press T to transcribe scrolls | Enter to leave', cx, cy + 145);
    }
  }
  drawKitty(cx, cy + 60, player.color, 1, 0, 'horn', playerEyeColor, playerHornColors);

  // ── Scroll transcription overlay ──
  if (scrollActive) {
    const sw = Math.min(W * 0.8, 500); // scroll width
    const sh = 200;
    const sx = cx - sw / 2;
    const sy = cy - 80;

    // Parchment background with aged edges
    ctx.save();
    // Outer darker edge (aged look)
    ctx.fillStyle = '#c4a96a';
    ctx.beginPath();
    ctx.roundRect(sx - 4, sy - 4, sw + 8, sh + 8, 8);
    ctx.fill();
    // Inner parchment
    const parchGrad = ctx.createRadialGradient(cx, sy + sh / 2, 20, cx, sy + sh / 2, sw * 0.6);
    parchGrad.addColorStop(0, '#fdf6e3'); // cream center
    parchGrad.addColorStop(1, '#f0e4c8'); // slightly darker edges
    ctx.fillStyle = parchGrad;
    ctx.beginPath();
    ctx.roundRect(sx, sy, sw, sh, 6);
    ctx.fill();
    // Subtle border
    ctx.strokeStyle = '#a08050';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(sx, sy, sw, sh, 6);
    ctx.stroke();

    // Scroll roll decorations (top and bottom)
    ctx.fillStyle = '#b8944a';
    ctx.fillRect(sx - 6, sy - 2, sw + 12, 8);
    ctx.fillRect(sx - 6, sy + sh - 6, sw + 12, 8);
    // Roll end circles
    ctx.fillStyle = '#a08040';
    ctx.beginPath(); ctx.arc(sx - 6, sy + 2, 6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(sx + sw + 6, sy + 2, 6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(sx - 6, sy + sh - 2, 6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(sx + sw + 6, sy + sh - 2, 6, 0, Math.PI * 2); ctx.fill();

    // Header: scroll number
    ctx.fillStyle = '#5c3a1e';
    ctx.font = 'bold 14px Georgia, "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.fillText('Scroll ' + (scrollRound + 1) + ' of 5', cx, sy + 28);

    if (!scrollComplete) {
      // Draw the scroll text character by character
      ctx.font = '20px Georgia, "Times New Roman", serif';
      ctx.textAlign = 'left';
      const textY = sy + 70;
      // Measure to center the text
      const fullWidth = ctx.measureText(scrollText).width;
      let textX = cx - fullWidth / 2;

      for (let i = 0; i < scrollText.length; i++) {
        const ch = scrollText[i];
        const charW = ctx.measureText(ch).width;
        if (i < scrollTyped) {
          // Already typed — green
          ctx.fillStyle = '#16a34a';
        } else if (i === scrollTyped) {
          // Current cursor position — show blinking cursor
          if (scrollFlashRed > 0) {
            ctx.fillStyle = '#dc2626'; // red flash on error
          } else {
            ctx.fillStyle = '#1e293b'; // dark for current
          }
          // Blinking underline cursor
          if (Math.floor(Date.now() / 400) % 2 === 0) {
            ctx.fillRect(textX, textY + 4, charW, 2);
          }
        } else {
          // Not yet typed — gray
          ctx.fillStyle = '#9ca3af';
        }
        ctx.fillText(ch, textX, textY);
        textX += charW;
      }

      // Accuracy display
      const totalTyped = scrollTyped + scrollErrors;
      const accuracy = totalTyped > 0 ? Math.round((scrollTyped / totalTyped) * 100) : 100;
      ctx.font = '12px system-ui';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#78716c';
      ctx.fillText('Accuracy: ' + accuracy + '%  |  Errors: ' + scrollErrors, cx, sy + sh - 20);

      // Hint
      ctx.font = '11px system-ui';
      ctx.fillStyle = '#a08050';
      ctx.fillText('Type each character to transcribe the scroll', cx, sy + sh - 6);
    } else {
      // Completed — show the text in green and the fun fact
      ctx.font = '20px Georgia, "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#16a34a';
      ctx.fillText(scrollText, cx, sy + 65);

      // Checkmark
      ctx.font = 'bold 24px system-ui';
      ctx.fillText('\u2713', cx, sy + 95);

      // Accuracy
      const totalTyped = scrollText.length + scrollErrors;
      const accuracy = totalTyped > 0 ? Math.round((scrollText.length / totalTyped) * 100) : 100;
      ctx.font = '13px system-ui';
      ctx.fillStyle = '#5c3a1e';
      ctx.fillText('Accuracy: ' + accuracy + '% | +' + POINTS.SCROLL + ' points', cx, sy + 115);

      // Fun fact
      ctx.font = 'italic 13px Georgia, "Times New Roman", serif';
      ctx.fillStyle = '#78716c';
      const fact = SCROLL_TEXTS[scrollRound].fact;
      ctx.fillText(fact, cx, sy + 140);

      // Continue prompt
      ctx.font = '11px system-ui';
      ctx.fillStyle = '#a08050';
      const continueText = scrollRound < SCROLL_TEXTS.length - 1 ? 'Next scroll coming...' : 'Final scroll complete!';
      ctx.fillText(continueText, cx, sy + sh - 10);
    }
    ctx.restore();
  }

  // ── Pantheon Architecture Puzzle ──
  if (pantheonPuzzle.active) {
    // Draw puzzle overlay — cross-section of the Pantheon dome
    // Background overlay
    ctx.fillStyle = 'rgba(30,20,10,0.85)';
    ctx.fillRect(cam + 20, 20, W - 40, H - 40);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 16px system-ui';
    ctx.fillText('Pantheon Architecture Puzzle', cx, 50);

    // Dome cross-section dimensions
    const domeX = cx;
    const domeBottom = cy + 50;
    const bandHeight = 36;
    const domeW = 240; // full width at base

    // Piece colors (placed)
    const pieceColors = ['#78716c', '#a8a29e', '#d6d3d1', '#e7e5e4', '#87ceeb'];
    // Piece outline colors (unplaced)
    const outlineColor = 'rgba(200,180,140,0.4)';

    for (let i = 0; i < 5; i++) {
      const y = domeBottom - (i + 1) * bandHeight;
      const isPlaced = i < pantheonPuzzle.placed;
      const isAnimating = i === pantheonPuzzle.placed - 1 && pantheonPuzzle.animating;

      // Each band gets narrower as we go up (dome shape)
      let bw;
      if (i === 0) bw = domeW;          // Foundation — full width
      else if (i === 1) bw = domeW - 20; // Walls
      else if (i === 2) bw = domeW - 60; // Lower dome
      else if (i === 3) bw = domeW - 110; // Upper dome
      else bw = 54;                       // Oculus — small circle

      if (i === 4) {
        // Oculus — draw as circle at top
        if (isPlaced) {
          let drawY = y + bandHeight / 2;
          if (isAnimating) {
            const t = pantheonPuzzle.animProgress;
            drawY = drawY - 60 * (1 - t); // slide down from above
          }
          ctx.fillStyle = pieceColors[i];
          ctx.beginPath(); ctx.arc(domeX, drawY, 27, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#fde68a';
          ctx.globalAlpha = 0.3;
          ctx.beginPath(); ctx.arc(domeX, drawY, 27, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#1e293b';
          ctx.font = 'bold 10px system-ui';
          ctx.fillText('OCULUS', domeX, drawY + 4);
        } else {
          ctx.strokeStyle = outlineColor;
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.beginPath(); ctx.arc(domeX, y + bandHeight / 2, 27, 0, Math.PI * 2); ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = 'rgba(200,180,140,0.3)';
          ctx.font = '9px system-ui';
          ctx.fillText('5: Oculus', domeX, y + bandHeight / 2 + 4);
        }
      } else {
        // Rectangular/trapezoidal bands
        const nextBw = (i === 0) ? domeW - 20 : (i === 1) ? domeW - 60 : (i === 2) ? domeW - 110 : 54;
        if (isPlaced) {
          let drawY = y;
          if (isAnimating) {
            const t = pantheonPuzzle.animProgress;
            drawY = drawY - 60 * (1 - t);
          }
          // Draw as trapezoid
          ctx.fillStyle = pieceColors[i];
          ctx.beginPath();
          ctx.moveTo(domeX - bw / 2, drawY + bandHeight);
          ctx.lineTo(domeX + bw / 2, drawY + bandHeight);
          ctx.lineTo(domeX + nextBw / 2, drawY);
          ctx.lineTo(domeX - nextBw / 2, drawY);
          ctx.closePath();
          ctx.fill();
          // Label
          ctx.fillStyle = '#1e293b';
          ctx.font = 'bold 10px system-ui';
          ctx.fillText(PANTHEON_PIECES[i].name.toUpperCase(), domeX, drawY + bandHeight / 2 + 4);
        } else {
          // Dotted outline
          ctx.strokeStyle = outlineColor;
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(domeX - bw / 2, y + bandHeight);
          ctx.lineTo(domeX + bw / 2, y + bandHeight);
          ctx.lineTo(domeX + nextBw / 2, y);
          ctx.lineTo(domeX - nextBw / 2, y);
          ctx.closePath();
          ctx.stroke();
          ctx.setLineDash([]);
          // Hint label
          ctx.fillStyle = 'rgba(200,180,140,0.3)';
          ctx.font = '9px system-ui';
          ctx.fillText((i + 1) + ': ' + PANTHEON_PIECES[i].name, domeX, y + bandHeight / 2 + 4);
        }
      }
    }

    // Draw ground line
    ctx.strokeStyle = '#a8a29e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - domeW / 2 - 20, domeBottom);
    ctx.lineTo(cx + domeW / 2 + 20, domeBottom);
    ctx.stroke();

    // Feedback text
    if (pantheonPuzzle.feedback) {
      ctx.fillStyle = '#fde68a';
      ctx.font = '12px system-ui';
      ctx.textAlign = 'center';
      // Word-wrap the fact text
      const words = pantheonPuzzle.feedback.split(' ');
      let lines = [];
      let line = '';
      for (const w of words) {
        if ((line + ' ' + w).length > 50) { lines.push(line); line = w; }
        else { line = line ? line + ' ' + w : w; }
      }
      if (line) lines.push(line);
      for (let li = 0; li < lines.length; li++) {
        ctx.fillText(lines[li], cx, domeBottom + 30 + li * 16);
      }
    }

    // Instructions
    ctx.fillStyle = '#d6d3d1';
    ctx.font = '11px system-ui';
    if (pantheonPuzzle.complete) {
      ctx.fillText('Complete! You rebuilt the Pantheon dome!', cx, H - 50);
    } else {
      ctx.fillText('Press 1-5 to place pieces (bottom to top)', cx, H - 50);
    }
    ctx.fillStyle = 'rgba(100,100,100,0.8)';
    ctx.font = '11px system-ui';
    ctx.fillText('Press Enter to leave', cx, H - 30);
  } else {
    // Normal Pantheon interior — show puzzle prompt
    ctx.font = '13px system-ui'; ctx.fillStyle = 'rgba(100,100,100,0.8)';
    ctx.fillText('Press A to start Architecture Puzzle', cx, cy + 130);
    ctx.fillText('Press Enter to leave', cx, cy + 145);
    drawKitty(cx, cy + 60, player.color, 1, 0, 'horn', playerEyeColor, playerHornColors);
  }
}

function drawSwimmingScene(cam, W, H) {
  const cx = cam + W / 2;
  const cy = GROUND_Y - 40;

  // ── Warm Italian sky ──
  const skyGrad = ctx.createLinearGradient(cam, 0, cam, cy - 20);
  skyGrad.addColorStop(0, '#fcd34d');
  skyGrad.addColorStop(0.4, '#fbbf24');
  skyGrad.addColorStop(1, '#87ceeb');
  ctx.fillStyle = skyGrad; ctx.fillRect(cam, 0, W, cy - 20);

  // ── Cobblestone ground ──
  ctx.fillStyle = '#a8a29e';
  ctx.fillRect(cam, cy - 20, W, H);
  ctx.strokeStyle = '#78716c'; ctx.lineWidth = 0.5;
  for (let rx = Math.floor(cam / 20) * 20; rx < cam + W; rx += 20) {
    for (let ry = 0; ry < 4; ry++) {
      const offset = ry % 2 === 0 ? 0 : 10;
      ctx.beginPath(); ctx.roundRect(rx + offset, cy - 18 + ry * 10, 16, 8, 2); ctx.stroke();
    }
  }

  // ── Italian cypress trees (tall, narrow) ──
  const cypressPositions = [cam + 40, cam + W - 40, cam + 100, cam + W - 100];
  for (const tx of cypressPositions) {
    // Trunk
    ctx.fillStyle = '#5c3a1e';
    ctx.fillRect(tx - 3, cy - 90, 6, 70);
    // Cypress canopy — tall narrow cone
    ctx.fillStyle = '#1a5c1a';
    ctx.beginPath();
    ctx.moveTo(tx - 10, cy - 25);
    ctx.quadraticCurveTo(tx - 12, cy - 70, tx, cy - 120);
    ctx.quadraticCurveTo(tx + 12, cy - 70, tx + 10, cy - 25);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.moveTo(tx - 7, cy - 30);
    ctx.quadraticCurveTo(tx - 9, cy - 75, tx, cy - 115);
    ctx.quadraticCurveTo(tx + 9, cy - 75, tx + 7, cy - 30);
    ctx.closePath(); ctx.fill();
  }

  // ── Olive trees (shorter, rounder) ──
  const olivePositions = [cam + W * 0.25, cam + W * 0.75];
  for (const ox of olivePositions) {
    // Twisted trunk
    ctx.strokeStyle = '#6B5210'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(ox, cy - 20);
    ctx.quadraticCurveTo(ox + 5, cy - 40, ox - 3, cy - 55); ctx.stroke();
    // Silvery-green canopy
    ctx.fillStyle = '#7c9a5e';
    ctx.beginPath(); ctx.arc(ox - 3, cy - 70, 22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#9ab87a';
    ctx.beginPath(); ctx.arc(ox + 8, cy - 75, 16, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(ox - 12, cy - 65, 14, 0, Math.PI * 2); ctx.fill();
    // Olives
    ctx.fillStyle = '#4a7c3f';
    for (let i = 0; i < 5; i++) {
      const olx = ox - 15 + Math.sin(i * 2.3) * 18;
      const oly = cy - 60 + Math.cos(i * 1.7) * 12;
      ctx.beginPath(); ctx.arc(olx, oly, 2.5, 0, Math.PI * 2); ctx.fill();
    }
  }

  // ── Roman statue (left of fountain) ──
  const stX = cx - 160;
  const stY = cy - 20;
  // Pedestal
  ctx.fillStyle = '#d6d3d1';
  ctx.fillRect(stX - 15, stY - 10, 30, 12);
  ctx.fillRect(stX - 12, stY - 12, 24, 4);
  // Statue body (marble white figure)
  ctx.fillStyle = '#e5e7eb';
  // Torso
  ctx.beginPath(); ctx.roundRect(stX - 8, stY - 55, 16, 30, 3); ctx.fill();
  // Head
  ctx.beginPath(); ctx.arc(stX, stY - 62, 8, 0, Math.PI * 2); ctx.fill();
  // Raised arm
  ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(stX + 6, stY - 48); ctx.lineTo(stX + 18, stY - 70); ctx.stroke();
  // Other arm
  ctx.beginPath(); ctx.moveTo(stX - 6, stY - 45); ctx.lineTo(stX - 14, stY - 35); ctx.stroke();
  // Legs
  ctx.beginPath(); ctx.moveTo(stX - 4, stY - 25); ctx.lineTo(stX - 6, stY - 12); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(stX + 4, stY - 25); ctx.lineTo(stX + 6, stY - 12); ctx.stroke();

  // ── Second statue (right of fountain) ──
  const st2X = cx + 160;
  ctx.fillStyle = '#d6d3d1';
  ctx.fillRect(st2X - 15, stY - 10, 30, 12);
  ctx.fillRect(st2X - 12, stY - 12, 24, 4);
  ctx.fillStyle = '#e5e7eb';
  ctx.beginPath(); ctx.roundRect(st2X - 8, stY - 55, 16, 30, 3); ctx.fill();
  ctx.beginPath(); ctx.arc(st2X, stY - 62, 8, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 4;
  // Pointing arm
  ctx.beginPath(); ctx.moveTo(st2X - 6, stY - 48); ctx.lineTo(st2X - 22, stY - 55); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(st2X + 6, stY - 45); ctx.lineTo(st2X + 12, stY - 35); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(st2X - 4, stY - 25); ctx.lineTo(st2X - 6, stY - 12); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(st2X + 4, stY - 25); ctx.lineTo(st2X + 6, stY - 12); ctx.stroke();

  // ── Distant buildings silhouette ──
  ctx.fillStyle = 'rgba(180,160,140,0.4)';
  const bldgs = [
    { x: cam + 20, w: 40, h: 60 },
    { x: cam + 70, w: 30, h: 45 },
    { x: cam + W - 60, w: 35, h: 55 },
    { x: cam + W - 110, w: 45, h: 40 },
  ];
  for (const b of bldgs) {
    ctx.fillRect(b.x, cy - 20 - b.h, b.w, b.h);
  }
  // Dome silhouette (like St. Peter's)
  ctx.beginPath(); ctx.arc(cam + W / 2 + 80, cy - 80, 30, Math.PI, 0); ctx.fill();

  // ── Fountain ──
  // Fountain basin (ornate)
  ctx.fillStyle = '#d6d3d1';
  ctx.beginPath(); ctx.ellipse(cx, cy + 10, 200, 50, 0, 0, Math.PI * 2); ctx.fill();
  // Basin rim detail
  ctx.strokeStyle = '#a8a29e'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(cx, cy + 10, 200, 50, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = '#c4b5a0'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.ellipse(cx, cy + 10, 195, 47, 0, 0, Math.PI * 2); ctx.stroke();
  // Water
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath(); ctx.ellipse(cx, cy + 8, 190, 45, 0, 0, Math.PI * 2); ctx.fill();
  // Animated waves
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    const wx = cx - 150 + i * 40 + Math.sin(gameTime / 300 + i) * 10;
    const wy = cy + Math.sin(gameTime / 400 + i * 0.8) * 5;
    ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx + 20, wy); ctx.stroke();
  }
  // Water jets
  ctx.strokeStyle = '#93c5fd'; ctx.lineWidth = 3;
  const jt = Math.sin(gameTime / 200) * 4;
  ctx.beginPath(); ctx.moveTo(cx, cy - 10);
  ctx.quadraticCurveTo(cx, cy - 60 + jt, cx, cy - 50); ctx.stroke();
  for (let i = -1; i <= 1; i += 2) {
    ctx.beginPath(); ctx.moveTo(cx, cy - 10);
    ctx.quadraticCurveTo(cx + i * 30, cy - 50 + jt, cx + i * 50, cy); ctx.stroke();
  }
  // Splash particles
  ctx.fillStyle = '#bae6fd';
  for (let i = 0; i < 6; i++) {
    const sx = cx - 60 + Math.cos(gameTime / 200 + i * 1.1) * 80;
    const sy = cy - 10 + Math.sin(gameTime / 250 + i * 1.5) * 15;
    ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.arc(sx, sy, 3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  // Kitty bobbing in the water
  const kittyBob = Math.sin(gameTime / 300) * 4;
  drawKitty(cx, cy + kittyBob, player.color, 1, Math.floor(gameTime / 200) % 4, 'horn', playerEyeColor, playerHornColors);
  // Water overlay (kitty partially submerged)
  ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.beginPath(); ctx.ellipse(cx, cy + 8, 190, 45, 0, 0, Math.PI * 2); ctx.fill();
  // Title
  ctx.fillStyle = '#fff'; ctx.font = 'bold 18px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('Splashing in the fountain!', cx, cy - 130);
  ctx.font = '13px system-ui'; ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.fillText('Press S to get out', cx, cy + 80);
}


function drawChaletInterior(cam, W, H) {
  const cx = cam + W / 2;
  const cy = GROUND_Y - 80;

  // Wooden floor
  ctx.fillStyle = '#92400e';
  ctx.fillRect(cx - 240, cy + 20, 480, 140);
  // Floor plank lines
  ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1;
  for (let fy = cy + 30; fy < cy + 160; fy += 18) {
    ctx.beginPath(); ctx.moveTo(cx - 240, fy); ctx.lineTo(cx + 240, fy); ctx.stroke();
  }

  // Stone back wall
  ctx.fillStyle = '#d6d3d1';
  ctx.fillRect(cx - 240, cy - 160, 480, 180);
  // Log cabin wall (warm wood)
  ctx.fillStyle = '#b45309';
  ctx.fillRect(cx - 240, cy - 160, 160, 180);
  ctx.fillRect(cx + 80, cy - 160, 160, 180);
  // Log lines
  ctx.strokeStyle = '#92400e'; ctx.lineWidth = 1;
  for (let ly = cy - 155; ly < cy + 20; ly += 12) {
    ctx.beginPath(); ctx.moveTo(cx - 238, ly); ctx.lineTo(cx - 82, ly); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + 82, ly); ctx.lineTo(cx + 238, ly); ctx.stroke();
  }

  // Fireplace (center)
  ctx.fillStyle = '#57534e';
  ctx.fillRect(cx - 60, cy - 100, 120, 120);
  // Fireplace arch
  ctx.fillStyle = '#44403c';
  ctx.beginPath();
  ctx.arc(cx, cy - 30, 45, Math.PI, 0);
  ctx.lineTo(cx + 45, cy + 20);
  ctx.lineTo(cx - 45, cy + 20);
  ctx.fill();
  // Fire inside
  ctx.fillStyle = '#1c1917';
  ctx.beginPath();
  ctx.arc(cx, cy - 20, 38, Math.PI, 0);
  ctx.lineTo(cx + 38, cy + 18);
  ctx.lineTo(cx - 38, cy + 18);
  ctx.fill();
  // Flames (animated)
  const flicker1 = Math.sin(gameTime / 80) * 6;
  const flicker2 = Math.sin(gameTime / 120 + 1) * 4;
  const flicker3 = Math.cos(gameTime / 100) * 5;
  // Big flame
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.moveTo(cx - 25, cy + 15);
  ctx.quadraticCurveTo(cx - 10, cy - 40 + flicker1, cx, cy - 50 + flicker2);
  ctx.quadraticCurveTo(cx + 10, cy - 40 + flicker3, cx + 25, cy + 15);
  ctx.fill();
  // Inner flame
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.moveTo(cx - 15, cy + 15);
  ctx.quadraticCurveTo(cx - 5, cy - 25 + flicker2, cx, cy - 35 + flicker1);
  ctx.quadraticCurveTo(cx + 5, cy - 25 + flicker3, cx + 15, cy + 15);
  ctx.fill();
  // Core flame
  ctx.fillStyle = '#fef3c7';
  ctx.beginPath();
  ctx.moveTo(cx - 6, cy + 15);
  ctx.quadraticCurveTo(cx, cy - 15 + flicker3, cx + 6, cy + 15);
  ctx.fill();
  // Embers
  ctx.fillStyle = '#f97316';
  for (let i = 0; i < 5; i++) {
    const ex = cx - 15 + Math.sin(gameTime / 200 + i * 1.7) * 20;
    const ey = cy - 30 - Math.abs(Math.sin(gameTime / 300 + i * 2.3)) * 30;
    ctx.globalAlpha = Math.sin(gameTime / 150 + i) * 0.3 + 0.4;
    ctx.beginPath(); ctx.arc(ex, ey, 1.5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Fireplace mantle
  ctx.fillStyle = '#78350f';
  ctx.fillRect(cx - 68, cy - 105, 136, 8);
  // Mantle decorations
  ctx.fillStyle = '#22c55e'; // small wreath
  ctx.beginPath(); ctx.arc(cx - 30, cy - 115, 8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(cx - 30, cy - 121, 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fbbf24'; // candle
  ctx.fillRect(cx + 25, cy - 118, 5, 12);
  ctx.fillStyle = '#f97316';
  ctx.beginPath(); ctx.arc(cx + 27.5, cy - 120, 3, 0, Math.PI * 2); ctx.fill();

  // Warm glow from fire
  ctx.globalAlpha = 0.08 + Math.sin(gameTime / 200) * 0.03;
  ctx.fillStyle = '#f97316';
  ctx.beginPath(); ctx.arc(cx, cy - 20, 120, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;

  // Bear rug
  ctx.fillStyle = '#78350f';
  ctx.beginPath(); ctx.ellipse(cx, cy + 80, 70, 25, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#92400e';
  ctx.beginPath(); ctx.ellipse(cx, cy + 80, 60, 20, 0, 0, Math.PI * 2); ctx.fill();

  // Hot chocolate mug (target) — positioned relative to scene center
  const mx = cx + 50, my = cy + 60;
  // Mug body
  ctx.fillStyle = '#dc2626';
  ctx.beginPath(); ctx.roundRect(mx - 14, my - 20, 28, 30, 3); ctx.fill();
  // Mug handle
  ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(mx + 18, my - 5, 8, -Math.PI / 2, Math.PI / 2); ctx.stroke();
  // Hot chocolate inside
  ctx.fillStyle = '#5c2d0e';
  ctx.beginPath(); ctx.ellipse(mx, my - 18, 11, 5, 0, 0, Math.PI * 2); ctx.fill();
  // Steam
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1.5;
  for (let i = 0; i < 3; i++) {
    const sx = mx - 6 + i * 6;
    const sway = Math.sin(gameTime / 300 + i * 2) * 4;
    ctx.beginPath();
    ctx.moveTo(sx, my - 22);
    ctx.quadraticCurveTo(sx + sway, my - 34, sx - sway, my - 44);
    ctx.stroke();
  }
  // Landed marshmallows in the mug
  ctx.fillStyle = '#fef3c7';
  for (let i = 0; i < Math.min(marshmallowScore, 5); i++) {
    ctx.beginPath();
    ctx.arc(mx - 6 + i * 3, my - 20 - i * 1.5, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Flying marshmallow
  if (marshmallow.active && !marshmallow.landed) {
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath(); ctx.roundRect(marshmallow.x - 5, marshmallow.y - 5, 10, 10, 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath(); ctx.roundRect(marshmallow.x - 3, marshmallow.y - 3, 4, 4, 1); ctx.fill();
  }

  // Drinking animation
  if (drinkingCocoa) {
    // Draw kitty next to mug, "drinking"
    drawKitty(mx - 30, cy + 60, player.color, 1, 0, 'horn', playerEyeColor, playerHornColors);
    // Drinking progress bar
    const drinkProgress = cocoaDrinkTimer / COCOA_DRINK_DURATION;
    ctx.fillStyle = '#1f2937'; ctx.fillRect(cx - 40, cy + 100, 80, 8);
    ctx.fillStyle = '#fbbf24'; ctx.fillRect(cx - 40, cy + 100, 80 * drinkProgress, 8);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 14px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Drinking cocoa... mmm!', cx, cy + 125);
    // Hearts floating up
    for (let i = 0; i < 3; i++) {
      const hx = mx - 10 + Math.sin(gameTime / 300 + i * 2) * 15;
      const hy = my - 30 - ((gameTime / 10 + i * 20) % 40);
      ctx.globalAlpha = 0.7 - ((gameTime / 10 + i * 20) % 40) / 60;
      ctx.fillStyle = '#f472b6'; ctx.font = '12px system-ui';
      ctx.fillText('\u2764', hx, hy);
    }
    ctx.globalAlpha = 1;
  } else {
    // Kitty sitting by fire
    drawKitty(cx - 80, cy + 70, player.color, 1, 0, 'horn', playerEyeColor, playerHornColors);

    // Aim trajectory preview (dotted arc)
    if (!marshmallow.active) {
      const launchX = cx - 65;
      const launchY = cy + 55;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      let pvx = Math.cos(marshmallowAngle) * MARSHMALLOW_SPEED;
      let pvy = -Math.sin(marshmallowAngle) * MARSHMALLOW_SPEED;
      let px = launchX, py = launchY;
      ctx.moveTo(px, py);
      for (let t = 0; t < 30; t++) {
        px += pvx;
        py += pvy;
        pvy += MARSHMALLOW_GRAVITY;
        ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  // Score display
  ctx.fillStyle = '#fff'; ctx.font = 'bold 16px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('Marshmallows landed: ' + marshmallowScore, cx, cy - 140);
  ctx.font = '13px system-ui'; ctx.fillStyle = 'rgba(255,255,255,0.7)';
  if (marshmallowScore >= 10 && !marshmallow.active && !drinkingCocoa) {
    ctx.fillText('D: Drink cocoa    Enter: Leave', cx, cy + 140);
  } else if (!drinkingCocoa) {
    ctx.fillText('Up/Down: Aim    Space: Toss    Enter: Leave', cx, cy + 140);
  }
}

function drawSurfingScene(cam, W, H) {
  const cx = cam + W / 2;
  const cy = GROUND_Y - 20;
  // Sky
  const grad = ctx.createLinearGradient(cam, 0, cam, cy - 60);
  grad.addColorStop(0, '#38bdf8'); grad.addColorStop(1, '#7dd3fc');
  ctx.fillStyle = grad; ctx.fillRect(cam, 0, W, cy - 60);
  // Ocean
  ctx.fillStyle = '#0284c7'; ctx.fillRect(cam, cy - 60, W, H);
  // Animated waves
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 3;
  for (let i = 0; i < 12; i++) {
    const wx = cx - 250 + i * 45 + Math.sin(gameTime / 300 + i) * 15;
    const wy = cy - 30 + Math.sin(gameTime / 350 + i * 0.7) * 8;
    ctx.beginPath(); ctx.moveTo(wx, wy);
    ctx.quadraticCurveTo(wx + 15, wy - 8, wx + 30, wy); ctx.stroke();
  }
  // Big wave behind kitty
  ctx.fillStyle = '#0369a1';
  ctx.beginPath(); ctx.moveTo(cx - 100, cy);
  ctx.quadraticCurveTo(cx - 50, cy - 50, cx, cy - 40);
  ctx.quadraticCurveTo(cx + 50, cy - 50, cx + 100, cy);
  ctx.lineTo(cx + 100, cy + 40); ctx.lineTo(cx - 100, cy + 40); ctx.closePath(); ctx.fill();
  // Wave foam
  ctx.strokeStyle = '#bae6fd'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(cx - 100, cy);
  ctx.quadraticCurveTo(cx - 50, cy - 50, cx, cy - 40);
  ctx.quadraticCurveTo(cx + 50, cy - 50, cx + 100, cy); ctx.stroke();
  // Surfboard under kitty
  ctx.fillStyle = '#f472b6';
  ctx.save(); ctx.translate(cx, cy - 15);
  ctx.rotate(Math.sin(gameTime / 400) * 0.1);
  ctx.beginPath(); ctx.roundRect(-20, -3, 40, 6, 3); ctx.fill();
  ctx.fillStyle = '#fbbf24'; ctx.fillRect(-12, -2, 6, 4);
  ctx.fillStyle = '#22d3ee'; ctx.fillRect(6, -2, 6, 4);
  ctx.restore();
  // Kitty on surfboard
  const kittyBob = Math.sin(gameTime / 400) * 3;
  drawKitty(cx, cy - 20 + kittyBob, player.color, 1, Math.floor(gameTime / 200) % 4, 'horn', playerEyeColor, playerHornColors);
  // Splash effects
  ctx.fillStyle = '#bae6fd';
  for (let i = 0; i < 8; i++) {
    ctx.globalAlpha = 0.4 + Math.sin(gameTime / 200 + i * 1.2) * 0.3;
    const sx = cx - 30 + Math.cos(gameTime / 250 + i * 0.9) * 50;
    const sy = cy - 5 + Math.sin(gameTime / 200 + i * 1.5) * 10;
    ctx.beginPath(); ctx.arc(sx, sy, 2.5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#fff'; ctx.font = 'bold 18px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('Cowabunga!', cx, cy - 90);
  ctx.font = '13px system-ui'; ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.fillText('Press S to paddle back', cx, cy + 70);
}

function drawPoolSwimmingScene(cam, W, H) {
  const cx = cam + W / 2;
  const cy = GROUND_Y - 60;

  // Sky background — bright blue
  const skyGrad = ctx.createLinearGradient(cam, 0, cam, H);
  skyGrad.addColorStop(0, '#60a5fa');
  skyGrad.addColorStop(0.5, '#93c5fd');
  skyGrad.addColorStop(1, '#4a7c3f');
  ctx.fillStyle = skyGrad; ctx.fillRect(cam, 0, W, H);

  // Ground
  ctx.fillStyle = '#4a7c3f';
  ctx.fillRect(cam, cy + 80, W, H);

  // ── Rainbow arc across the sky ──
  const rbCx = cx; // rainbow center x
  const rbCy = cy + 100; // rainbow center y (low so arc is overhead)
  const rbR = 220; // radius
  const rainbowColors = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#6366f1','#a855f7'];
  for (let i = 0; i < rainbowColors.length; i++) {
    ctx.strokeStyle = rainbowColors[i];
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(rbCx, rbCy, rbR - i * 8, Math.PI, 0);
    ctx.stroke();
  }

  // ── Unikitties sitting on the rainbow ──
  const kittyColors = ['#fda4af','#c4b5fd','#a5f3fc','#fde68a','#bbf7d0','#fbcfe8'];
  const kittyAngles = [0.15, 0.3, 0.45, 0.55, 0.7, 0.85]; // spread across the arc
  for (let i = 0; i < 6; i++) {
    const angle = Math.PI - kittyAngles[i] * Math.PI; // map 0-1 to PI-0
    const kr = rbR - 28; // sit on middle of rainbow
    const kx = rbCx + Math.cos(angle) * kr;
    const ky = rbCy + Math.sin(angle) * kr;
    const bobble = Math.sin(gameTime / 500 + i * 1.2) * 2;
    drawKitty(kx, ky + bobble, kittyColors[i], i < 3 ? 1 : -1, 0, 'horn');
  }

  // ── Leprechaun at bottom-right of rainbow ──
  const lepX = rbCx + rbR - 20;
  const lepY = cy + 75;
  const lepBounce = Math.sin(gameTime / 700) * 2;

  // Pot of gold behind leprechaun
  ctx.fillStyle = '#1f2937';
  ctx.beginPath();
  ctx.moveTo(lepX + 20, lepY + 5);
  ctx.quadraticCurveTo(lepX + 35, lepY - 15, lepX + 50, lepY + 5);
  ctx.lineTo(lepX + 48, lepY + 20);
  ctx.quadraticCurveTo(lepX + 35, lepY + 25, lepX + 22, lepY + 20);
  ctx.closePath(); ctx.fill();
  // Gold coins in pot
  ctx.fillStyle = '#fbbf24';
  for (let i = 0; i < 5; i++) {
    const gx = lepX + 28 + i * 5;
    const gy = lepY - 2 + Math.sin(i * 1.5) * 3;
    ctx.beginPath(); ctx.arc(gx, gy, 4, 0, Math.PI * 2); ctx.fill();
  }
  // Gold sparkle
  ctx.fillStyle = '#fef3c7';
  const spk = Math.sin(gameTime / 200) * 2;
  ctx.beginPath(); ctx.arc(lepX + 35, lepY - 8 + spk, 2, 0, Math.PI * 2); ctx.fill();

  // Leprechaun body
  ctx.fillStyle = '#16a34a'; // green coat
  ctx.beginPath(); ctx.roundRect(lepX - 8, lepY - 10 + lepBounce, 16, 22, 3); ctx.fill();
  // Legs
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(lepX - 6, lepY + 12 + lepBounce, 5, 10);
  ctx.fillRect(lepX + 1, lepY + 12 + lepBounce, 5, 10);
  // Shoes (black with buckle)
  ctx.fillStyle = '#1f2937';
  ctx.fillRect(lepX - 8, lepY + 20 + lepBounce, 8, 4);
  ctx.fillRect(lepX - 1, lepY + 20 + lepBounce, 8, 4);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(lepX - 5, lepY + 21 + lepBounce, 3, 2);
  ctx.fillRect(lepX + 2, lepY + 21 + lepBounce, 3, 2);
  // Head
  ctx.fillStyle = '#fde68a'; // skin
  ctx.beginPath(); ctx.arc(lepX, lepY - 18 + lepBounce, 10, 0, Math.PI * 2); ctx.fill();
  // Eyes
  ctx.fillStyle = '#1f2937';
  ctx.beginPath(); ctx.arc(lepX - 3, lepY - 20 + lepBounce, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(lepX + 3, lepY - 20 + lepBounce, 1.5, 0, Math.PI * 2); ctx.fill();
  // Grin
  ctx.strokeStyle = '#1f2937'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(lepX, lepY - 15 + lepBounce, 4, 0.2, Math.PI - 0.2); ctx.stroke();
  // Red beard
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.moveTo(lepX - 6, lepY - 13 + lepBounce);
  ctx.quadraticCurveTo(lepX, lepY - 5 + lepBounce, lepX + 6, lepY - 13 + lepBounce);
  ctx.fill();
  // Hat (green top hat)
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(lepX - 12, lepY - 28 + lepBounce, 24, 4); // brim
  ctx.fillRect(lepX - 8, lepY - 42 + lepBounce, 16, 16); // top
  // Hat buckle
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(lepX - 4, lepY - 30 + lepBounce, 8, 4);
  ctx.fillStyle = '#1f2937';
  ctx.fillRect(lepX - 2, lepY - 29 + lepBounce, 4, 2);
  // Arms
  ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(lepX - 8, lepY - 5 + lepBounce); ctx.lineTo(lepX - 15, lepY + 5 + lepBounce); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(lepX + 8, lepY - 5 + lepBounce); ctx.lineTo(lepX + 18, lepY + 2 + lepBounce); ctx.stroke();

  // Leprechaun speech bubble
  if (leprechaunSpeech.timer > 0) {
    const bubbleAlpha = Math.min(1, leprechaunSpeech.timer / 500);
    ctx.globalAlpha = bubbleAlpha;
    ctx.fillStyle = '#fff';
    const tw = ctx.measureText(leprechaunSpeech.text).width;
    const bw = Math.min(tw + 20, W * 0.6);
    ctx.beginPath(); ctx.roundRect(lepX - bw / 2, lepY - 65 + lepBounce, bw, 24, 8); ctx.fill();
    // Bubble tail
    ctx.beginPath();
    ctx.moveTo(lepX - 5, lepY - 41 + lepBounce);
    ctx.lineTo(lepX, lepY - 35 + lepBounce);
    ctx.lineTo(lepX + 5, lepY - 41 + lepBounce);
    ctx.fill();
    ctx.fillStyle = '#1f2937'; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
    ctx.fillText(leprechaunSpeech.text, lepX, lepY - 49 + lepBounce);
    ctx.globalAlpha = 1;
  }

  // ── Pool ──
  ctx.fillStyle = '#6b7280';
  ctx.beginPath(); ctx.roundRect(cx - 70, cy + 25, 140, 60, 8); ctx.fill();
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath(); ctx.roundRect(cx - 65, cy + 29, 130, 52, 5); ctx.fill();
  // Water ripples
  ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const rx = cx - 45 + i * 22;
    const ry = cy + 50 + Math.sin(gameTime / 300 + i) * 3;
    ctx.beginPath(); ctx.moveTo(rx - 10, ry); ctx.quadraticCurveTo(rx, ry - 4, rx + 10, ry); ctx.stroke();
  }
  // Splash particles
  ctx.fillStyle = '#93c5fd';
  for (let i = 0; i < 6; i++) {
    const sx = cx + Math.sin(gameTime / 200 + i * 1.2) * 35;
    const sy = cy + 38 + Math.cos(gameTime / 250 + i) * 8;
    ctx.globalAlpha = 0.5 + Math.sin(gameTime / 300 + i) * 0.3;
    ctx.beginPath(); ctx.arc(sx, sy, 2 + Math.random(), 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Kitty bobbing in pool
  const bobY = Math.sin(gameTime / 400) * 4;
  drawKitty(cx, cy + 47 + bobY, player.color || '#c4b5fd', 1, 0, 'horn', playerEyeColor, playerHornColors);

  // Gold count display
  if (leprechaunGold > 0) {
    ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 13px system-ui'; ctx.textAlign = 'left';
    ctx.fillText('Gold: ' + leprechaunGold, cam + 15, 25);
  }
  ctx.textAlign = 'left';
}

function drawCampCamperInterior(cam, W, H) {
  const cx = cam + W / 2;
  const cy = GROUND_Y - 80;
  const kittyX = cx + campCamperPlayerX;

  // Camper walls — warm wood interior
  ctx.fillStyle = '#d4a574';
  ctx.fillRect(cam, 0, W, H);
  // Back wall (lighter)
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(cam, cy - 100, W, 180);
  // Floor
  ctx.fillStyle = '#8B7355';
  ctx.fillRect(cam, cy + 80, W, H);
  // Wood floor planks
  ctx.strokeStyle = '#6B5440'; ctx.lineWidth = 0.5;
  for (let fx = Math.floor(cam / 40) * 40; fx < cam + W; fx += 40) {
    ctx.beginPath(); ctx.moveTo(fx, cy + 80); ctx.lineTo(fx, cy + 160); ctx.stroke();
  }

  // ── Left bed (x < -100) ──
  const lbx = cx - 140;
  const lby = cy + 30;
  // Bed frame
  ctx.fillStyle = '#5c3a1e';
  ctx.fillRect(lbx - 30, lby, 60, 35);
  // Mattress
  ctx.fillStyle = '#e9d5ff';
  ctx.fillRect(lbx - 28, lby + 2, 56, 16);
  // Pillow
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(lbx - 15, lby + 8, 10, 5, 0, 0, Math.PI * 2); ctx.fill();
  // Blanket
  ctx.fillStyle = '#7c3aed';
  ctx.fillRect(lbx - 10, lby + 10, 38, 10);
  // Label
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '9px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('Bed', lbx, lby + 50);

  // ── Right bed (x > 100) ──
  const rbx = cx + 140;
  const rby = cy + 30;
  ctx.fillStyle = '#5c3a1e';
  ctx.fillRect(rbx - 30, rby, 60, 35);
  ctx.fillStyle = '#fda4af';
  ctx.fillRect(rbx - 28, rby + 2, 56, 16);
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(rbx + 15, rby + 8, 10, 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f472b6';
  ctx.fillRect(rbx - 28, rby + 10, 38, 10);
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '9px system-ui';
  ctx.fillText('Bed', rbx, rby + 50);

  // ── Fridge (center) ──
  const fridgeX = cx;
  const fridgeY = cy - 50;
  ctx.fillStyle = '#d1d5db';
  ctx.beginPath(); ctx.roundRect(fridgeX - 20, fridgeY, 40, 70, 4); ctx.fill();
  // Fridge door line
  ctx.strokeStyle = '#9ca3af'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(fridgeX - 18, fridgeY + 30); ctx.lineTo(fridgeX + 18, fridgeY + 30); ctx.stroke();
  // Handle
  ctx.fillStyle = '#6b7280';
  ctx.fillRect(fridgeX + 14, fridgeY + 10, 3, 12);
  ctx.fillRect(fridgeX + 14, fridgeY + 38, 3, 12);
  // Label
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '9px system-ui';
  ctx.fillText('Fridge', fridgeX, fridgeY + 82);

  // ── Bathroom (left of fridge, -50 to -100) ──
  const bathX = cx - 75;
  const bathY = cy - 40;
  // Shower stall
  ctx.fillStyle = '#bfdbfe';
  ctx.beginPath(); ctx.roundRect(bathX - 20, bathY, 40, 60, 4); ctx.fill();
  // Shower curtain
  ctx.fillStyle = '#93c5fd';
  ctx.fillRect(bathX - 18, bathY + 2, 36, 8);
  // Shower head
  ctx.fillStyle = '#6b7280';
  ctx.beginPath(); ctx.arc(bathX, bathY + 8, 5, 0, Math.PI * 2); ctx.fill();
  // Water drops (if showering)
  if (campCamperShowering) {
    ctx.fillStyle = '#60a5fa';
    for (let i = 0; i < 8; i++) {
      const dx = bathX - 8 + Math.random() * 16;
      const dy = bathY + 15 + Math.random() * 35;
      ctx.beginPath(); ctx.ellipse(dx, dy, 1.5, 3, 0, 0, Math.PI * 2); ctx.fill();
    }
  }
  // Label
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '9px system-ui';
  ctx.fillText('Shower', bathX, bathY + 72);

  // ── Door (far right edge) ──
  ctx.fillStyle = '#92400e';
  ctx.fillRect(cam + W - 40, cy - 20, 30, 80);
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath(); ctx.arc(cam + W - 16, cy + 20, 3, 0, Math.PI * 2); ctx.fill();

  // ── Sleeping animation ──
  if (campCamperSleeping) {
    const bedX = campCamperPlayerX > 0 ? rbx : lbx;
    const bedY = campCamperPlayerX > 0 ? rby : lby;
    const blanketColor = campCamperPlayerX > 0 ? '#f472b6' : '#7c3aed';
    // Blanket over kitty
    ctx.fillStyle = blanketColor;
    ctx.beginPath(); ctx.roundRect(bedX - 25, bedY + 2, 50, 18, 4); ctx.fill();
    // Kitty head peeking
    drawKitty(bedX - 10, bedY - 5, player.color || '#c4b5fd', 1, 0, 'horn', playerEyeColor, playerHornColors);
    // Zzz
    ctx.fillStyle = '#c4b5fd'; ctx.font = 'bold 14px system-ui'; ctx.textAlign = 'center';
    const zFloat = (gameTime / 600) % 1;
    for (let i = 0; i < 3; i++) {
      ctx.globalAlpha = Math.sin(gameTime / 300 + i * 1.5) * 0.3 + 0.7;
      ctx.fillText(i === 2 ? 'Z' : 'z', bedX + 20 + i * 10, bedY - 15 - i * 14 - zFloat * 6);
    }
    ctx.globalAlpha = 1;
  } else if (campCamperShowering) {
    // Kitty in shower (just head visible)
    drawKitty(bathX, bathY + 35, player.color || '#c4b5fd', 1, 0, 'horn', playerEyeColor, playerHornColors);
    // Steam
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    for (let i = 0; i < 5; i++) {
      const sx = bathX - 10 + Math.sin(gameTime / 300 + i) * 8;
      const sy = bathY - 5 - (gameTime / 200 + i * 10) % 20;
      ctx.beginPath(); ctx.arc(sx, sy, 3 + Math.random() * 2, 0, Math.PI * 2); ctx.fill();
    }
  } else {
    // Kitty walking around
    drawKitty(kittyX, cy + 60, player.color || '#c4b5fd', player.facing, player.walkFrame, 'horn', playerEyeColor, playerHornColors);
  }

  // Pasta on counter if cooking
  if (campCamperPasta.cooking) {
    const potX = cx + 5;
    const potY = cy - 15;
    ctx.fillStyle = '#6b7280';
    ctx.beginPath(); ctx.roundRect(potX - 10, potY, 20, 15, 2); ctx.fill();
    // Steam from pot
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    for (let i = 0; i < 3; i++) {
      const sx = potX - 5 + i * 5;
      const sy = potY - 5 - (gameTime / 200 + i * 8) % 12;
      ctx.beginPath(); ctx.arc(sx, sy, 2, 0, Math.PI * 2); ctx.fill();
    }
    // Progress bar
    const pct = campCamperPasta.progress / 3000;
    ctx.fillStyle = '#1f2937'; ctx.fillRect(cx - 40, cy + 100, 80, 8);
    ctx.fillStyle = '#fbbf24'; ctx.fillRect(cx - 40, cy + 100, 80 * pct, 8);
  }

  // Title
  ctx.fillStyle = '#fff'; ctx.font = 'bold 16px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('Camp Camper', cx, cy - 110);
  ctx.textAlign = 'left';
}

function drawHospitalInterior(cam, W, H) {
  const cx = cam + W / 2;
  const cy = GROUND_Y - 80;

  // Hospital floor (light teal tiles)
  ctx.fillStyle = '#f0fdfa';
  ctx.fillRect(cam, cy, W, H);
  // Tile grid
  ctx.strokeStyle = '#ccfbf1';
  ctx.lineWidth = 0.5;
  for (let tx = -220; tx < 220; tx += 25) {
    for (let ty = 0; ty < 160; ty += 25) {
      ctx.strokeRect(cx + tx, cy + ty, 25, 25);
    }
  }

  // Back wall (pale blue)
  ctx.fillStyle = '#e0f2fe';
  ctx.fillRect(cam, 0, W, cy);
  // Wainscoting
  ctx.fillStyle = '#bae6fd';
  ctx.fillRect(cam, cy - 30, W, 30);

  // Mom unikitty on hospital bed (right side)
  const bedX = cx + 60;
  const bedY = cy - 10;
  // Bed
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.roundRect(bedX - 30, bedY, 60, 20, 4);
  ctx.fill();
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;
  ctx.stroke();
  // Pillow
  ctx.fillStyle = '#e0f2fe';
  ctx.beginPath();
  ctx.roundRect(bedX + 15, bedY - 5, 18, 8, 3);
  ctx.fill();
  // Mom (larger unikitty, lying down)
  ctx.fillStyle = '#f9a8d4';
  ctx.beginPath();
  ctx.ellipse(bedX + 5, bedY - 2, 12, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  // Mom's head
  ctx.beginPath();
  ctx.arc(bedX + 18, bedY - 5, 8, 0, Math.PI * 2);
  ctx.fill();
  // Mom's eyes
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(bedX + 16, bedY - 6, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(bedX + 20, bedY - 6, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath();
  ctx.arc(bedX + 16.5, bedY - 5.5, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(bedX + 20.5, bedY - 5.5, 1, 0, Math.PI * 2);
  ctx.fill();

  // Heart monitor (left side)
  const monitorX = cx - 120;
  const monitorY = cy - 80;
  ctx.fillStyle = '#1f2937';
  ctx.beginPath();
  ctx.roundRect(monitorX, monitorY, 80, 50, 4);
  ctx.fill();
  // Screen
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(monitorX + 4, monitorY + 4, 72, 35);
  // Heartbeat line
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  const lineY = monitorY + 22;
  for (let i = 0; i < 70; i += 2) {
    const hx = monitorX + 5 + i;
    let hy = lineY;
    const phase = (i + gameTime / 50) % 30;
    if (phase > 10 && phase < 13) hy -= 8;
    if (phase > 13 && phase < 16) hy += 5;
    if (i === 0) ctx.moveTo(hx, hy);
    else ctx.lineTo(hx, hy);
  }
  ctx.stroke();
  // "HR: 120" text
  ctx.fillStyle = '#22c55e';
  ctx.font = '8px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('HR: 120', monitorX + 6, monitorY + 46);

  // IV drip stand
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(cx + 100, cy - 100, 2, 90);
  ctx.fillStyle = '#bfdbfe';
  ctx.beginPath();
  ctx.roundRect(cx + 94, cy - 105, 14, 18, 3);
  ctx.fill();
  // Drip line
  ctx.strokeStyle = '#bfdbfe';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx + 101, cy - 87);
  ctx.lineTo(cx + 101, cy - 75);
  ctx.quadraticCurveTo(cx + 90, cy - 60, bedX + 25, bedY - 3);
  ctx.stroke();

  // Player as nurse (left side of room)
  const nurseX = cx - 60;
  const nurseY = cy - 20;
  drawKitty(nurseX, nurseY, player.color, 1, 0, 'horn', playerEyeColor, playerHornColors);
  // Nurse hat (white cap with red cross)
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.roundRect(nurseX - 8, nurseY - 42, 16, 8, 2);
  ctx.fill();
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(nurseX - 1, nurseY - 41, 2, 6);
  ctx.fillRect(nurseX - 3, nurseY - 39, 6, 2);

  // ── Stage-specific visuals ──

  // ── Step progress indicator (top of screen) ──
  const stages = ['Prep Room', 'Vitals', 'Breathing', 'Deliver!', 'Celebrate', 'Color', 'Name'];
  const stageIndex = { prep: 0, vitals: 1, breathing: 2, delivery: 3, celebrate: 4, color_pick: 5, name_pick: 6 };
  const curIdx = stageIndex[hospitalStage] || 0;

  // Progress bar background
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.roundRect(cx - 180, 8, 360, 32, 8);
  ctx.fill();

  // Step dots and labels
  for (let i = 0; i < 4; i++) {
    const dotX = cx - 120 + i * 80;
    const dotY = 18;
    // Connector line
    if (i < 3) {
      ctx.strokeStyle = i < curIdx ? '#22c55e' : '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(dotX + 8, dotY + 6);
      ctx.lineTo(dotX + 72, dotY + 6);
      ctx.stroke();
    }
    // Dot
    ctx.fillStyle = i < curIdx ? '#22c55e' : i === curIdx ? '#fbbf24' : '#475569';
    ctx.beginPath();
    ctx.arc(dotX, dotY + 6, 6, 0, Math.PI * 2);
    ctx.fill();
    // Checkmark or number
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 8px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(i < curIdx ? '\u2713' : (i + 1).toString(), dotX, dotY + 9);
    // Label
    ctx.fillStyle = i === curIdx ? '#fbbf24' : 'rgba(255,255,255,0.6)';
    ctx.font = '7px system-ui';
    ctx.fillText(stages[i], dotX, dotY + 22);
  }

  // Story context line
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '10px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText("Helping Mom deliver your baby sibling!", cx, 52);
  ctx.textAlign = 'left';

  // PREP STAGE
  if (hospitalStage === 'prep') {
    const stations = ['Blankets', 'Supplies', 'Equipment'];
    for (let i = 0; i < 3; i++) {
      const sx = cx - 160 + i * 80;
      const sy = cy - 120;
      ctx.fillStyle = i < hospitalPrepStations ? '#86efac' : '#e2e8f0';
      ctx.beginPath();
      ctx.roundRect(sx, sy, 50, 30, 4);
      ctx.fill();
      ctx.fillStyle = '#1f2937';
      ctx.font = '8px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(stations[i], sx + 25, sy + 18);
      if (i < hospitalPrepStations) {
        ctx.fillStyle = '#16a34a';
        ctx.font = 'bold 14px system-ui';
        ctx.fillText('\u2713', sx + 25, sy + 12);
      }
    }
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Step 1: Prepare the delivery room!', cx, cy - 140);
    ctx.font = '11px system-ui';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText('Get everything ready for Mom before the baby arrives.', cx, cy - 122);
    ctx.font = 'bold 13px system-ui';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('Press C to prepare each station (' + hospitalPrepStations + '/3)', cx, cy + 130);
    ctx.font = '10px system-ui';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText('C = Prepare Station', cx, cy + 148);
  }

  // VITALS STAGE
  else if (hospitalStage === 'vitals') {
    const barW = 200;
    const barX = cx - barW / 2;
    const barY = cy - 130;
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, 24, 6);
    ctx.fill();
    // Green zone (center)
    ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';
    ctx.fillRect(barX + barW * 0.35, barY + 2, barW * 0.3, 20);
    // Moving indicator
    const indicatorX = barX + hospitalVitalsZone * barW;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(indicatorX, barY + 12, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 8px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('\u2665', indicatorX, barY + 15);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px system-ui';
    ctx.fillText("Step 2: Monitor Mom's vitals!", cx, barY - 8);
    ctx.font = '11px system-ui';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText('Watch the heart — press Space at just the right moment!', cx, barY + 30);
    ctx.font = 'bold 13px system-ui';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('Press SPACE when the heart is in the GREEN zone', cx, cy + 130);
    ctx.font = '10px system-ui';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText('Space = Check Vitals', cx, cy + 148);
  }

  // BREATHING STAGE
  else if (hospitalStage === 'breathing') {
    const breathSize = 20 + Math.sin(hospitalBreathingPhase * Math.PI * 2) * 15;
    const nearPeak = hospitalBreathingPhase < 0.15 || hospitalBreathingPhase > 0.85;
    ctx.strokeStyle = nearPeak ? '#22c55e' : '#94a3b8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy - 90, breathSize, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = nearPeak ? 'rgba(34, 197, 94, 0.2)' : 'rgba(148, 163, 184, 0.1)';
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(nearPeak ? 'NOW!' : 'wait...', cx, cy - 87);

    // Progress dots
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = i < hospitalBreathingHits ? '#22c55e' : '#475569';
      ctx.beginPath();
      ctx.arc(cx - 30 + i * 15, cy - 55, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px system-ui';
    ctx.fillText('Step 3: Coach breathing!', cx, cy - 130);
    ctx.font = '11px system-ui';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText('Help Mom breathe! Press Space when the circle is biggest.', cx, cy - 112);
    ctx.font = 'bold 13px system-ui';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('Press SPACE at the peak (' + hospitalBreathingHits + '/5)', cx, cy + 130);
    ctx.font = '10px system-ui';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText('Space = Breathe (when circle is GREEN)', cx, cy + 148);
  }

  // DELIVERY STAGE
  else if (hospitalStage === 'delivery') {
    const barW = 200;
    const barX = cx - barW / 2;
    const barY = cy - 130;
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, 24, 6);
    ctx.fill();
    // Sweet spot zone (70-95%)
    ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';
    ctx.fillRect(barX + barW * 0.7, barY + 2, barW * 0.25, 20);
    // "Too much" zone (>95%)
    ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
    ctx.fillRect(barX + barW * 0.95, barY + 2, barW * 0.05, 20);
    // Fill
    ctx.fillStyle = hospitalDeliveryPower > 0.95 ? '#ef4444' : hospitalDeliveryPower > 0.7 ? '#22c55e' : '#60a5fa';
    ctx.beginPath();
    ctx.roundRect(barX + 2, barY + 2, (barW - 4) * hospitalDeliveryPower, 20, 4);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Step 4: Time to deliver!', cx, barY - 8);
    ctx.font = '11px system-ui';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText('Hold Space to build power — release in the green sweet spot!', cx, barY + 30);
    ctx.font = 'bold 13px system-ui';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('HOLD Space \u2192 release in GREEN zone (70-95%)', cx, cy + 130);
    ctx.font = '10px system-ui';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText('Hold Space = Build Power | Release = Deliver!', cx, cy + 148);
  }

  // CELEBRATE STAGE
  else if (hospitalStage === 'celebrate') {
    // Confetti particles
    const confettiColors = ['#ef4444','#f59e0b','#22c55e','#3b82f6','#a855f7','#ec4899'];
    for (let i = 0; i < 20; i++) {
      ctx.fillStyle = confettiColors[i % confettiColors.length];
      const cx2 = cx - 100 + (i * 67 + Math.sin(hospitalProgress / 200 + i) * 30) % 200;
      const cy2 = cy - 120 + ((hospitalProgress / 5 + i * 40) % 200);
      ctx.fillRect(cx2, cy2, 4, 4);
    }
    // "It's a Kit!" banner
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.roundRect(cx - 80, cy - 130, 160, 40, 8);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText("It's a Kit!", cx, cy - 105);

    // Baby Kit on the bed next to mom
    drawBabyKit(bedX - 10, bedY - 5, kitFurColor);

    // Hearts above mom
    ctx.fillStyle = '#f472b6';
    ctx.font = '10px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('\u2665', bedX + 5, bedY - 15);
  }

  // COLOR PICK STAGE
  else if (hospitalStage === 'color_pick') {
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText("Choose Kit's color!", cx, cy - 130);

    const kitColors = ['#fda4af','#93c5fd','#86efac','#fde047','#c4b5fd','#fdba74','#f0abfc','#67e8f9'];
    const kitColorNames = ['Pink','Blue','Green','Yellow','Lilac','Peach','Magenta','Cyan'];
    for (let i = 0; i < 8; i++) {
      const sx = cx - 140 + i * 38;
      const sy = cy - 100;
      const isSelected = kitColors[i] === kitFurColor;
      ctx.fillStyle = kitColors[i];
      ctx.beginPath();
      ctx.roundRect(sx, sy, 28, 28, 6);
      ctx.fill();
      if (isSelected) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 10px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText((i + 1).toString(), sx + 14, sy + 18);
    }

    // Preview baby Kit with current color
    drawBabyKit(cx, cy + 20, kitFurColor);
    ctx.fillStyle = '#fff';
    ctx.font = '14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Baby ' + kitName, cx, cy + 45);

    ctx.font = '12px system-ui';
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillText('Press 1-8 to pick a color, Enter to confirm', cx, cy + 140);
  }

  // NAME PICK STAGE
  else if (hospitalStage === 'name_pick') {
    // Preview baby Kit with chosen color
    drawBabyKit(cx, cy - 30, kitFurColor);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText("Name your baby!", cx, cy - 130);

    // Name input box
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.roundRect(cx - 100, cy + 10, 200, 36, 8);
    ctx.fill();
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Typed name (or placeholder)
    if (kitNameInput.length > 0) {
      ctx.fillStyle = '#1f2937';
      ctx.font = '18px system-ui';
      ctx.fillText(kitNameInput, cx, cy + 34);
    } else {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '18px system-ui';
      ctx.fillText('Kit', cx, cy + 34);
    }

    // Blinking cursor
    if (Math.floor(gameTime / 500) % 2 === 0) {
      const textW = ctx.measureText(kitNameInput || 'Kit').width;
      ctx.fillStyle = kitNameInput.length > 0 ? '#1f2937' : '#94a3b8';
      ctx.fillRect(cx + textW / 2 + 2, cy + 18, 2, 20);
    }

    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '12px system-ui';
    ctx.fillText('Type a name, then press Enter', cx, cy + 140);
  }

  ctx.textAlign = 'left';
}

// ── FAO Schwarz — Giant Floor Piano ──
function drawFaoSchwarzInterior(cam, W, H) {
  const cx = cam + W / 2;
  // Toy store floor
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(cam, 0, W, H);
  for (let r = 0; r < H / 30; r++) {
    for (let c2 = 0; c2 < W / 30; c2++) {
      ctx.fillStyle = (r + c2) % 2 === 0 ? '#fde68a' : '#fef9c3';
      ctx.fillRect(cam + c2 * 30, r * 30, 30, 30);
    }
  }
  // Header
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(cam, 0, W, 55);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 24px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('FAO Schwarz', cx, 38);
  // Piano keys
  const keyW = W / 8;
  const keyY = H * 0.55;
  const keyH = H * 0.35;
  const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const keyColors = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#6366f1','#a855f7'];
  for (let i = 0; i < 7; i++) {
    const kx = cam + keyW * 0.5 + i * keyW;
    const isActive = faoPlayerX === i;
    ctx.fillStyle = isActive ? keyColors[i] : '#f1f5f9';
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
    ctx.fillRect(kx, keyY, keyW - 4, keyH);
    ctx.strokeRect(kx, keyY, keyW - 4, keyH);
    ctx.fillStyle = isActive ? '#fff' : '#64748b';
    ctx.font = 'bold 18px system-ui';
    ctx.fillText(noteNames[i], kx + keyW / 2 - 2, keyY + keyH - 20);
    if (isActive && faoNoteTimer > 0) {
      ctx.fillStyle = keyColors[i] + '40';
      ctx.fillRect(kx - 5, keyY - 10, keyW + 6, keyH + 20);
    }
  }
  // Twinkle Twinkle target notes — show which note to play next
  ctx.fillStyle = '#1e1b4b'; ctx.font = 'bold 14px system-ui';
  ctx.fillText('\u266B Twinkle, Twinkle, Little Star \u266B', cx, 65);
  ctx.font = '12px system-ui'; ctx.fillStyle = '#78716c';
  ctx.fillText('Left/Right to move, Space to play note', cx, 80);
  // Note sequence display
  const seqY = keyY - 15;
  const noteSpacing = Math.min(28, (W - 60) / FAO_MELODY_TARGET.length);
  const seqStartX = cx - (FAO_MELODY_TARGET.length * noteSpacing) / 2;
  for (let i = 0; i < FAO_MELODY_TARGET.length; i++) {
    const nx = seqStartX + i * noteSpacing + noteSpacing / 2;
    if (i < faoMelody.length) {
      // Played — green if correct, red if wrong
      ctx.fillStyle = faoMelody[i] === FAO_MELODY_TARGET[i] ? '#4ade80' : '#ef4444';
    } else if (i === faoMelody.length) {
      // Next note to play — highlighted
      ctx.fillStyle = keyColors[FAO_MELODY_TARGET[i]];
    } else {
      ctx.fillStyle = '#cbd5e1';
    }
    ctx.font = 'bold 14px system-ui';
    ctx.fillText(noteNames[FAO_MELODY_TARGET[i]], nx, seqY);
    // Measure bar after note 7
    if (i === 6) {
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(nx + noteSpacing / 2 + 2, seqY - 10);
      ctx.lineTo(nx + noteSpacing / 2 + 2, seqY + 4); ctx.stroke();
    }
  }
  // Complete message
  if (faoComplete) {
    ctx.fillStyle = '#f472b6'; ctx.font = 'bold 18px system-ui';
    ctx.fillText('Bravo! Press Enter to leave', cx, keyY - 40);
  }
  // Player on current key
  drawKitty(cam + keyW * 0.5 + faoPlayerX * keyW + keyW / 2, keyY - 15, player.color, 1, player.walkFrame, 'horn', playerEyeColor, playerHornColors);
  ctx.textAlign = 'left';
}

// ── Empire State Building ──
function drawEmpireStateInterior(cam, W, H) {
  const cx = cam + W / 2;
  if (!empireAtTop) {
    // Elevator shaft — dark walls with moving floor indicator lights
    ctx.fillStyle = '#52525b';
    ctx.fillRect(cam, 0, W, H);
    // Shaft wall panels
    ctx.fillStyle = '#3f3f46';
    ctx.fillRect(cam, 0, 30, H);
    ctx.fillRect(cam + W - 30, 0, 30, H);
    // Moving floor lights (scroll up as elevator rises)
    ctx.fillStyle = '#fbbf2440';
    for (let i = 0; i < 20; i++) {
      const ly = ((i * H / 10) - empireElevator * 5) % H;
      if (ly > 0) {
        ctx.fillRect(cam + 8, ly, 14, 3);
        ctx.fillRect(cam + W - 22, ly, 14, 3);
      }
    }
    // Elevator car — brass and mahogany style
    ctx.fillStyle = '#92400e';
    ctx.fillRect(cx - 80, H * 0.25, 160, 200);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(cx - 75, H * 0.27, 150, 190);
    // Wood paneling
    ctx.fillStyle = '#a0845a';
    ctx.fillRect(cx - 70, H * 0.3, 140, 10);
    ctx.fillRect(cx - 70, H * 0.55, 140, 10);
    // Mirror on back wall
    ctx.fillStyle = '#bfdbfe';
    ctx.fillRect(cx - 40, H * 0.32, 80, 60);
    ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2;
    ctx.strokeRect(cx - 40, H * 0.32, 80, 60);
    // Floor indicator display
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(cx - 25, H * 0.22, 50, 25);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 18px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('F' + Math.round(empireElevator), cx, H * 0.22 + 18);
    // Progress bar on side
    ctx.fillStyle = '#374151';
    ctx.fillRect(cam + 45, H * 0.3, 15, H * 0.45);
    ctx.fillStyle = '#fbbf24';
    const barFill = H * 0.45 * (empireElevator / 100);
    ctx.fillRect(cam + 45, H * 0.3 + H * 0.45 - barFill, 15, barFill);
    // Elevator floor
    ctx.fillStyle = '#78716c';
    ctx.fillRect(cx - 75, H * 0.68, 150, 8);
    // Player standing in elevator
    drawKitty(cx, H * 0.65, player.color, 1, 0, 'horn', playerEyeColor, playerHornColors);
    // Elevator doors (top)
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(cx - 80, H * 0.25, 8, 200);
    ctx.fillRect(cx + 72, H * 0.25, 8, 200);
  } else {
    // Observation deck — sky above, city far below
    // Sky gradient
    const skyGrad = ctx.createLinearGradient(cam, 0, cam, H * 0.55);
    skyGrad.addColorStop(0, '#3b82f6');
    skyGrad.addColorStop(1, '#93c5fd');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(cam, 0, W, H * 0.55);
    // Clouds (we're above some of them!)
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    for (let i = 0; i < 6; i++) {
      const cloudX = cam + (i * 170 + 30 + Math.sin(gameTime / 3000 + i) * 20) % W;
      const cloudY = H * 0.35 + i * 15;
      ctx.beginPath();
      ctx.ellipse(cloudX, cloudY, 40, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cloudX - 20, cloudY + 5, 25, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // City skyline far below — tiny buildings
    for (let i = 0; i < 50; i++) {
      const bx = cam + (i * 97 + 10) % W;
      const bh = 15 + (i * 53) % 40;
      ctx.fillStyle = ['#64748b','#475569','#94a3b8','#334155','#6b7280'][i % 5];
      ctx.fillRect(bx, H * 0.55 + 50 - bh, 12, bh);
      // Tiny windows
      ctx.fillStyle = '#fef08a';
      for (let wy = H * 0.55 + 50 - bh + 3; wy < H * 0.55 + 48; wy += 6) {
        ctx.fillRect(bx + 2, wy, 3, 2);
        ctx.fillRect(bx + 7, wy, 3, 2);
      }
    }
    // Central Park (green rectangle in the distance)
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(cam + W * 0.35, H * 0.52, W * 0.15, 8);
    // Rivers on sides
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(cam, H * 0.54, W * 0.08, 6);
    ctx.fillRect(cam + W * 0.92, H * 0.54, W * 0.08, 6);

    // Observation deck floor and walls
    ctx.fillStyle = '#78716c';
    ctx.fillRect(cam, H * 0.6, W, H * 0.4);
    // Deck surface
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(cam, H * 0.6, W, 6);
    // Tile pattern on floor
    ctx.strokeStyle = '#6b7280'; ctx.lineWidth = 0.5;
    for (let tx = cam; tx < cam + W; tx += 25) {
      ctx.beginPath(); ctx.moveTo(tx, H * 0.65); ctx.lineTo(tx, H); ctx.stroke();
    }
    for (let ty = H * 0.65; ty < H; ty += 25) {
      ctx.beginPath(); ctx.moveTo(cam, ty); ctx.lineTo(cam + W, ty); ctx.stroke();
    }

    // Safety fence/railing with mesh
    ctx.strokeStyle = '#6b7280'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cam, H * 0.55); ctx.lineTo(cam + W, H * 0.55); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cam, H * 0.6); ctx.lineTo(cam + W, H * 0.6); ctx.stroke();
    // Vertical fence bars
    ctx.lineWidth = 1.5;
    for (let fx = cam; fx < cam + W; fx += 20) {
      ctx.beginPath(); ctx.moveTo(fx, H * 0.55); ctx.lineTo(fx, H * 0.6); ctx.stroke();
    }
    // Mesh pattern
    ctx.strokeStyle = '#9ca3af'; ctx.lineWidth = 0.5;
    for (let fx = cam; fx < cam + W; fx += 8) {
      ctx.beginPath(); ctx.moveTo(fx, H * 0.55); ctx.lineTo(fx + 4, H * 0.6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(fx + 4, H * 0.55); ctx.lineTo(fx, H * 0.6); ctx.stroke();
    }

    // Coin-operated telescope
    const telX = cam + W * 0.8;
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(telX - 2, H * 0.62, 4, 20);
    ctx.fillStyle = '#6b7280';
    ctx.beginPath(); ctx.ellipse(telX, H * 0.62, 8, 5, -0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#475569';
    ctx.fillRect(telX - 1, H * 0.82, 6, 6);

    // Player on the deck
    drawKitty(cx, H * 0.78, player.color, 1, 0, 'horn', playerEyeColor, playerHornColors);

    // Title
    ctx.fillStyle = '#fff'; ctx.font = 'bold 18px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('102nd Floor — Top of the Empire State Building!', cx, 35);
    ctx.fillStyle = '#bfdbfe'; ctx.font = '12px system-ui';
    ctx.fillText('1,454 feet above the streets of Manhattan', cx, 52);
  }
  ctx.textAlign = 'left';
}

// ── 30 Rock / NBC Studios ──
function drawThirtyRockInterior(cam, W, H) {
  const cx = cam + W / 2;
  ctx.fillStyle = '#1e1b4b'; ctx.fillRect(cam, 0, W, H);
  for (let i = 0; i < 5; i++) {
    const lx = cam + W * 0.15 + i * W * 0.175;
    ctx.fillStyle = ['#ef4444','#3b82f6','#22c55e','#fbbf24','#a855f7'][i];
    ctx.globalAlpha = 0.3 + Math.sin(gameTime / 300 + i * 1.5) * 0.2;
    ctx.beginPath(); ctx.moveTo(lx - 30, 0); ctx.lineTo(lx + 30, 0); ctx.lineTo(lx + 80, H); ctx.lineTo(lx - 80, H); ctx.closePath(); ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#312e81'; ctx.fillRect(cam, H * 0.7, W, H * 0.3);
  ctx.fillStyle = '#fff'; ctx.font = 'bold 28px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('NBC Studios — 30 Rock', cx, 40);
  if (thirtyRockDance.active) {
    const arrowMap = { 'ArrowLeft': '\u2190', 'ArrowRight': '\u2192', 'ArrowUp': '\u2191', 'Space': '\u2B24' };
    ctx.font = 'bold 24px system-ui';
    ctx.fillStyle = thirtyRockDance.showing ? '#fbbf24' : '#4ade80';
    ctx.fillText(thirtyRockDance.showing ? 'Watch the moves!' : 'Your turn!', cx, H * 0.32);
    for (let i = 0; i < thirtyRockDance.sequence.length; i++) {
      const ax = cx - (thirtyRockDance.sequence.length - 1) * 25 + i * 50;
      if (thirtyRockDance.showing || i < thirtyRockDance.input.length) {
        const correct = !thirtyRockDance.showing && thirtyRockDance.input[i] === thirtyRockDance.sequence[i];
        ctx.fillStyle = thirtyRockDance.showing ? '#fff' : (correct ? '#4ade80' : '#ef4444');
      } else { ctx.fillStyle = '#6366f1'; }
      ctx.font = 'bold 30px system-ui';
      ctx.fillText(arrowMap[thirtyRockDance.sequence[i]], ax, H * 0.45);
    }
  } else {
    ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 20px system-ui';
    ctx.fillText('Score: ' + thirtyRockDance.score + '/' + thirtyRockDance.sequence.length, cx, H * 0.4);
  }
  drawKitty(cx, H * 0.65, player.color, 1, player.walkFrame, 'horn', playerEyeColor, playerHornColors);
  ctx.textAlign = 'left';
}

// ── Grand Central Terminal ──
function drawGrandCentralInterior(cam, W, H) {
  const cx = cam + W / 2;
  ctx.fillStyle = '#fef3c7'; ctx.fillRect(cam, 0, W, H);
  // Arched star ceiling
  ctx.fillStyle = '#1e3a5f';
  ctx.beginPath(); ctx.moveTo(cam, H * 0.5); ctx.quadraticCurveTo(cx, 0, cam + W, H * 0.5);
  ctx.lineTo(cam + W, 0); ctx.lineTo(cam, 0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#fbbf24';
  for (let i = 0; i < 30; i++) {
    ctx.beginPath(); ctx.arc(cam + (i * 137 + 50) % W, 20 + (i * 89) % (H * 0.35), 1.5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#e2e8f0'; ctx.fillRect(cam, H * 0.7, W, H * 0.3);
  // Clock
  ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(cx, H * 0.55, 25, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#92400e'; ctx.lineWidth = 3; ctx.stroke();
  // Whisper echo effect
  if (grandCentralWhisper) {
    ctx.fillStyle = 'rgba(167,139,250,0.15)';
    ctx.beginPath(); ctx.arc(cx, H * 0.55, 100 + Math.sin(gameTime / 300) * 20, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#7c3aed'; ctx.font = 'italic 16px system-ui'; ctx.textAlign = 'center';
    ctx.globalAlpha = 0.5 + Math.sin(gameTime / 400) * 0.3;
    ctx.fillText(grandCentralWhisper + '... ' + grandCentralWhisper + '...', cx, H * 0.45);
    ctx.globalAlpha = 1;
  }
  ctx.fillStyle = '#1e1b4b'; ctx.font = 'bold 20px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('Grand Central Terminal', cx, H * 0.65);
  drawKitty(cx, H * 0.82, player.color, 1, player.walkFrame, 'horn', playerEyeColor, playerHornColors);
  ctx.textAlign = 'left';
}

// ── Grand Central Telegram Office ──
function drawTelegramOffice(cam, W, H) {
  const cx = cam + W / 2;

  // Warm wood-paneled office background
  ctx.fillStyle = '#78350f'; ctx.fillRect(cam, 0, W, H);
  // Wainscoting / lighter upper wall
  ctx.fillStyle = '#a16207'; ctx.fillRect(cam, 0, W, H * 0.55);
  // Decorative trim line
  ctx.fillStyle = '#fbbf24'; ctx.fillRect(cam, H * 0.54, W, 3);

  // Floor — dark hardwood
  ctx.fillStyle = '#5c2d0e'; ctx.fillRect(cam, H * 0.75, W, H * 0.25);
  // Floor boards
  ctx.strokeStyle = '#4a2508'; ctx.lineWidth = 1;
  for (let i = 0; i < 8; i++) {
    const bx = cam + i * (W / 8);
    ctx.beginPath(); ctx.moveTo(bx, H * 0.75); ctx.lineTo(bx, H); ctx.stroke();
  }

  // Wooden desk
  ctx.fillStyle = '#92400e';
  ctx.fillRect(cx - 120, H * 0.6, 240, 20);
  // Desk legs
  ctx.fillRect(cx - 115, H * 0.62, 8, 50);
  ctx.fillRect(cx + 107, H * 0.62, 8, 50);
  // Desk surface highlight
  ctx.fillStyle = '#a8590b';
  ctx.fillRect(cx - 118, H * 0.6, 236, 4);

  // Telegraph machine on desk
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(cx - 30, H * 0.52, 60, 30); // base
  ctx.fillStyle = '#334155';
  ctx.fillRect(cx - 25, H * 0.48, 50, 20); // body
  // Brass key lever
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(cx - 15, H * 0.56, 30, 6);
  ctx.beginPath(); ctx.arc(cx + 18, H * 0.56 + 3, 5, 0, Math.PI * 2); ctx.fill();
  // Brass knobs
  ctx.beginPath(); ctx.arc(cx - 10, H * 0.50, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + 10, H * 0.50, 3, 0, Math.PI * 2); ctx.fill();
  // Wire from telegraph
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx + 25, H * 0.50);
  ctx.quadraticCurveTo(cx + 80, H * 0.35, cx + 100, H * 0.1); ctx.stroke();

  // Paper tape roll
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(cx - 60, H * 0.55, 25, 25);
  ctx.fillStyle = '#92400e';
  ctx.beginPath(); ctx.arc(cx - 47, H * 0.55 + 12, 5, 0, Math.PI * 2); ctx.fill();

  // Title
  ctx.fillStyle = '#fbbf24'; ctx.font = 'bold 18px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('Telegram Office', cx, H * 0.08);

  // Difficulty indicator
  const levels = ['Easy', 'Medium', 'Hard'];
  const levelColors = ['#4ade80', '#fbbf24', '#f87171'];
  ctx.font = '13px system-ui';
  ctx.fillStyle = levelColors[telegramLevel];
  ctx.fillText('Difficulty: ' + levels[telegramLevel], cx, H * 0.13);

  if (telegramActive || telegramComplete) {
    // Paper / telegram display area
    const paperX = cx - W * 0.38;
    const paperW = W * 0.76;
    const paperY = H * 0.16;
    const paperH = H * 0.32;

    // Paper background
    ctx.fillStyle = '#fefce8';
    ctx.fillRect(paperX, paperY, paperW, paperH);
    ctx.strokeStyle = '#d4a574'; ctx.lineWidth = 2;
    ctx.strokeRect(paperX, paperY, paperW, paperH);

    // Dotted lines on paper
    ctx.strokeStyle = '#e5d5b0'; ctx.lineWidth = 0.5;
    ctx.setLineDash([4, 4]);
    for (let ly = paperY + 30; ly < paperY + paperH - 10; ly += 22) {
      ctx.beginPath(); ctx.moveTo(paperX + 15, ly); ctx.lineTo(paperX + paperW - 15, ly); ctx.stroke();
    }
    ctx.setLineDash([]);

    // "TELEGRAM" header on paper
    ctx.fillStyle = '#78350f'; ctx.font = 'bold 14px "Courier New", monospace'; ctx.textAlign = 'center';
    ctx.fillText('=== TELEGRAM ===', cx, paperY + 18);

    // Target text (what player needs to type)
    const fontSize = Math.min(16, Math.round(W * 0.025));
    ctx.font = fontSize + 'px "Courier New", monospace';
    const maxCharsPerLine = Math.floor((paperW - 30) / (fontSize * 0.6));
    const lines = [];
    for (let i = 0; i < telegramText.length; i += maxCharsPerLine) {
      lines.push(telegramText.substring(i, i + maxCharsPerLine));
    }

    // Draw each character with coloring
    let charIdx = 0;
    const lineHeight = 22;
    const startY = paperY + 38;
    const errorFlashActive = (performance.now() - telegramErrorFlash) < 300;

    for (let lineNum = 0; lineNum < lines.length; lineNum++) {
      const line = lines[lineNum];
      const lineX = paperX + 20;
      const lineY = startY + lineNum * lineHeight;

      for (let c = 0; c < line.length; c++) {
        const ch = line[c];
        const x = lineX + c * (fontSize * 0.6);

        if (charIdx < telegramTyped.length) {
          // Already typed — green
          ctx.fillStyle = '#16a34a';
          ctx.fillText(ch, x, lineY);
        } else if (charIdx === telegramTyped.length) {
          // Current character — cursor
          // Blinking cursor background
          const blink = Math.sin(performance.now() / 300) > 0;
          if (blink) {
            ctx.fillStyle = errorFlashActive ? 'rgba(239,68,68,0.3)' : 'rgba(59,130,246,0.3)';
            ctx.fillRect(x - 1, lineY - fontSize + 2, fontSize * 0.6 + 2, fontSize + 2);
          }
          ctx.fillStyle = errorFlashActive ? '#ef4444' : '#1e40af';
          ctx.font = 'bold ' + fontSize + 'px "Courier New", monospace';
          ctx.fillText(ch, x, lineY);
          ctx.font = fontSize + 'px "Courier New", monospace';
        } else {
          // Not yet reached — gray
          ctx.fillStyle = '#94a3b8';
          ctx.fillText(ch, x, lineY);
        }
        charIdx++;
      }
    }

    // Stats below paper
    if (telegramActive) {
      const elapsed = (performance.now() - telegramStartTime) / 1000;
      const words = telegramTyped.split(' ').filter(w => w).length || 0;
      const wpm = elapsed > 1 ? Math.round((words / elapsed) * 60) : 0;
      const typed = telegramTyped.length;
      const accuracy = typed > 0 ? Math.round(((typed - telegramErrors) / typed) * 100) : 100;

      ctx.font = '13px system-ui';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('WPM: ' + wpm + '  |  Accuracy: ' + accuracy + '%  |  Errors: ' + telegramErrors, cx, paperY + paperH + 18);
    }

    // Completion overlay
    if (telegramComplete) {
      const elapsed = (performance.now() - telegramStartTime) / 1000;
      const words = telegramText.split(' ').length;
      const wpm = Math.round((words / elapsed) * 60);
      const accuracy = Math.round(((telegramText.length - telegramErrors) / telegramText.length) * 100);

      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(paperX, paperY + paperH + 5, paperW, 40);
      ctx.fillStyle = '#4ade80'; ctx.font = 'bold 15px system-ui';
      ctx.fillText('Telegram Sent!  WPM: ' + wpm + '  Accuracy: ' + accuracy + '%', cx, paperY + paperH + 28);
    }
  } else {
    // Idle — instruction on paper
    ctx.fillStyle = '#fefce8';
    const idlePX = cx - 100, idlePY = H * 0.20, idlePW = 200, idlePH = 80;
    ctx.fillRect(idlePX, idlePY, idlePW, idlePH);
    ctx.strokeStyle = '#d4a574'; ctx.lineWidth = 1; ctx.strokeRect(idlePX, idlePY, idlePW, idlePH);
    ctx.fillStyle = '#78350f'; ctx.font = '13px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('Press Enter to', cx, idlePY + 28);
    ctx.fillText('send a telegram!', cx, idlePY + 48);
    ctx.font = '11px system-ui'; ctx.fillStyle = '#94a3b8';
    ctx.fillText('Left/Right to change difficulty', cx, idlePY + 66);
  }

  // Draw player
  drawKitty(cx, H * 0.82, player.color, 1, player.walkFrame, 'horn', playerEyeColor, playerHornColors);
  ctx.textAlign = 'left';
}

// ── The Metropolitan Museum of Art ──
function drawMetMuseumInterior(cam, W, H) {
  const cx = cam + W / 2;
  // Museum walls
  ctx.fillStyle = '#f5f5f4'; ctx.fillRect(cam, 0, W, H);
  ctx.fillStyle = '#d6d3d1'; ctx.fillRect(cam, H * 0.75, W, H * 0.25);
  // Red banner
  ctx.fillStyle = '#dc2626'; ctx.fillRect(cam, 0, W, 45);
  ctx.fillStyle = '#fff'; ctx.font = 'bold 22px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('The Metropolitan Museum of Art', cx, 30);

  const p = MET_PAINTINGS[metPaintingIndex];
  const frameW = W * 0.55, frameH = H * 0.42;
  const frameX = cx - frameW / 2, frameY = H * 0.13;

  // Ornate gilded frame
  ctx.fillStyle = '#92400e'; ctx.fillRect(frameX - 12, frameY - 12, frameW + 24, frameH + 24);
  ctx.fillStyle = '#b45309'; ctx.fillRect(frameX - 6, frameY - 6, frameW + 12, frameH + 12);
  // Inner gold edge
  ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2;
  ctx.strokeRect(frameX - 3, frameY - 3, frameW + 6, frameH + 6);

  // Canvas background
  ctx.fillStyle = p.color;
  ctx.fillRect(frameX, frameY, frameW, frameH);

  // Save and clip to frame
  ctx.save();
  ctx.beginPath();
  ctx.rect(frameX, frameY, frameW, frameH);
  ctx.clip();

  // Draw the actual painting scene
  drawMetPaintingScene(p.draw, frameX, frameY, frameW, frameH);

  ctx.restore();

  // Title plaque
  ctx.fillStyle = '#fbbf24'; ctx.fillRect(cx - 90, frameY + frameH + 18, 180, 35);
  ctx.strokeStyle = '#92400e'; ctx.lineWidth = 1;
  ctx.strokeRect(cx - 90, frameY + frameH + 18, 180, 35);
  ctx.fillStyle = '#1e1b4b'; ctx.font = 'bold 12px system-ui';
  ctx.fillText('"' + p.title + '"', cx, frameY + frameH + 33);
  ctx.fillStyle = '#78716c'; ctx.font = 'italic 10px system-ui';
  ctx.fillText(p.artist, cx, frameY + frameH + 47);

  // Navigation arrows
  ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 30px system-ui';
  if (metPaintingIndex > 0) ctx.fillText('\u2190', cam + 30, H * 0.38);
  if (metPaintingIndex < MET_PAINTINGS.length - 1) ctx.fillText('\u2192', cam + W - 50, H * 0.38);
  // Counter
  ctx.fillStyle = '#78716c'; ctx.font = '14px system-ui';
  ctx.fillText((metPaintingIndex + 1) + ' of ' + MET_PAINTINGS.length, cx, H * 0.72);
  // Player viewing
  drawKitty(cx, H * 0.85, player.color, 1, 0, 'horn', playerEyeColor, playerHornColors);
  ctx.textAlign = 'left';
}

// ── Art Description Overlay (Met Museum) ──
function drawArtDescOverlay(W, H) {
  const cx = W / 2;
  const cardW = W * 0.7, cardH = H * 0.55;
  const cardX = cx - cardW / 2, cardY = H * 0.18;

  // Dimmed backdrop
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, W, H);

  // Card background — cream/parchment
  ctx.fillStyle = '#fef3c7';
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.strokeStyle = '#92400e'; ctx.lineWidth = 3;
  ctx.strokeRect(cardX, cardY, cardW, cardH);

  // Inner border
  ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1;
  ctx.strokeRect(cardX + 6, cardY + 6, cardW - 12, cardH - 12);

  ctx.textAlign = 'center';

  // Painting title
  const p = MET_PAINTINGS[artDescPaintingIdx];
  ctx.fillStyle = '#1e1b4b'; ctx.font = 'bold 16px system-ui';
  ctx.fillText('"' + p.title + '"', cx, cardY + 30);

  // Prompt
  ctx.fillStyle = '#78716c'; ctx.font = 'italic 13px system-ui';
  ctx.fillText('Describe this painting in your own words!', cx, cardY + 52);

  // Lined writing area
  const areaX = cardX + 20, areaY = cardY + 66;
  const areaW = cardW - 40, areaH = cardH - 110;
  ctx.fillStyle = '#fff'; ctx.fillRect(areaX, areaY, areaW, areaH);
  ctx.strokeStyle = '#d6d3d1'; ctx.lineWidth = 1;
  ctx.strokeRect(areaX, areaY, areaW, areaH);

  // Horizontal ruled lines
  ctx.strokeStyle = '#e7e5e4';
  const lineSpacing = 22;
  for (let ly = areaY + lineSpacing; ly < areaY + areaH - 5; ly += lineSpacing) {
    ctx.beginPath(); ctx.moveTo(areaX + 5, ly); ctx.lineTo(areaX + areaW - 5, ly); ctx.stroke();
  }

  // Typed text with word wrapping
  ctx.fillStyle = '#1e1b4b'; ctx.font = '14px system-ui'; ctx.textAlign = 'left';
  const maxLineW = areaW - 20;
  const words = artDescText.split(' ');
  let lines = [];
  let currentLine = '';
  for (const word of words) {
    const test = currentLine ? currentLine + ' ' + word : word;
    if (ctx.measureText(test).width > maxLineW && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = test;
    }
  }
  lines.push(currentLine);

  for (let i = 0; i < lines.length && i < 4; i++) {
    ctx.fillText(lines[i], areaX + 10, areaY + 18 + i * lineSpacing);
  }

  // Blinking cursor
  const cursorLine = Math.min(lines.length - 1, 3);
  const cursorText = lines[cursorLine] || '';
  const cursorX = areaX + 10 + ctx.measureText(cursorText).width + 2;
  const cursorY = areaY + 6 + cursorLine * lineSpacing;
  if (Math.floor(gameTime / 400) % 2 === 0) {
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(cursorX, cursorY, 2, 16);
  }

  // Character count
  ctx.textAlign = 'right'; ctx.font = '11px system-ui';
  ctx.fillStyle = artDescText.length >= 90 ? '#dc2626' : '#94a3b8';
  ctx.fillText(artDescText.length + '/100', areaX + areaW - 5, areaY + areaH + 14);

  // Submit / cancel hints
  ctx.textAlign = 'center'; ctx.font = '13px system-ui';
  ctx.fillStyle = '#78716c';
  ctx.fillText('Enter: Submit | Esc: Cancel', cx, cardY + cardH - 10);

  // Show previously saved description count for this painting
  const key = 'painting_' + artDescPaintingIdx;
  const saved = artDescriptions[key] || [];
  if (saved.length > 0) {
    ctx.fillStyle = '#a78bfa'; ctx.font = 'italic 11px system-ui';
    ctx.fillText('You\'ve written ' + saved.length + ' description' + (saved.length > 1 ? 's' : '') + ' for this painting', cx, cardY + cardH + 8);
  }

  ctx.textAlign = 'left';
}

function drawMetPaintingScene(type, fx, fy, fw, fh) {
  const cx = fx + fw / 2;
  const t = gameTime;

  if (type === 'meadow') {
    // Impressionist meadow — soft sky, rolling green hills, wildflowers, sun
    const skyGrad = ctx.createLinearGradient(fx, fy, fx, fy + fh * 0.5);
    skyGrad.addColorStop(0, '#fef3c7'); skyGrad.addColorStop(1, '#bef264');
    ctx.fillStyle = skyGrad; ctx.fillRect(fx, fy, fw, fh * 0.5);
    // Sun
    ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(fx + fw * 0.8, fy + fh * 0.15, fh * 0.08, 0, Math.PI * 2); ctx.fill();
    // Sun rays
    ctx.strokeStyle = '#fde68a'; ctx.lineWidth = 1.5;
    for (let r = 0; r < 8; r++) {
      const a = r * Math.PI / 4;
      ctx.beginPath(); ctx.moveTo(fx + fw * 0.8 + Math.cos(a) * fh * 0.1, fy + fh * 0.15 + Math.sin(a) * fh * 0.1);
      ctx.lineTo(fx + fw * 0.8 + Math.cos(a) * fh * 0.14, fy + fh * 0.15 + Math.sin(a) * fh * 0.14); ctx.stroke();
    }
    // Rolling hills
    ctx.fillStyle = '#86efac';
    ctx.beginPath(); ctx.moveTo(fx, fy + fh * 0.5);
    for (let hx = fx; hx <= fx + fw; hx += 10) ctx.lineTo(hx, fy + fh * 0.5 + Math.sin((hx - fx) / fw * Math.PI * 2) * fh * 0.05 - 5);
    ctx.lineTo(fx + fw, fy + fh); ctx.lineTo(fx, fy + fh); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#4ade80';
    ctx.beginPath(); ctx.moveTo(fx, fy + fh * 0.6);
    for (let hx = fx; hx <= fx + fw; hx += 10) ctx.lineTo(hx, fy + fh * 0.6 + Math.sin((hx - fx) / fw * Math.PI * 3 + 1) * fh * 0.04);
    ctx.lineTo(fx + fw, fy + fh); ctx.lineTo(fx, fy + fh); ctx.closePath(); ctx.fill();
    // Wildflowers (dots)
    const flowerColors = ['#ef4444','#f472b6','#fbbf24','#a855f7','#3b82f6','#fff'];
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = flowerColors[i % flowerColors.length];
      const flx = fx + (i * 67 + 20) % fw;
      const fly = fy + fh * 0.55 + (i * 31) % (fh * 0.35);
      ctx.beginPath(); ctx.arc(flx, fly, 2 + (i % 3), 0, Math.PI * 2); ctx.fill();
    }
    // Butterfly
    ctx.fillStyle = '#c084fc';
    const bx = cx + Math.sin(t / 1000) * fw * 0.15;
    const by = fy + fh * 0.35 + Math.sin(t / 700) * 10;
    ctx.beginPath(); ctx.ellipse(bx - 4, by, 4, 3, -0.3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(bx + 4, by, 4, 3, 0.3, 0, Math.PI * 2); ctx.fill();

  } else if (type === 'sled') {
    // Van Gogh-style starry night with snowy mountain
    // Swirly dark sky
    ctx.fillStyle = '#1e3a5f'; ctx.fillRect(fx, fy, fw, fh);
    // Stars with swirl halos
    const starColors = ['#fef08a', '#fbbf24', '#fff'];
    for (let i = 0; i < 15; i++) {
      const sx = fx + (i * 97 + 30) % fw;
      const sy = fy + (i * 53 + 15) % (fh * 0.5);
      ctx.fillStyle = starColors[i % 3];
      ctx.beginPath(); ctx.arc(sx, sy, 2 + (i % 3), 0, Math.PI * 2); ctx.fill();
      // Swirl
      ctx.strokeStyle = starColors[i % 3] + '60'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(sx, sy, 5 + (i % 4) * 2, i * 0.5, i * 0.5 + 3); ctx.stroke();
    }
    // Moon
    ctx.fillStyle = '#fef9c3'; ctx.beginPath(); ctx.arc(fx + fw * 0.2, fy + fh * 0.2, fh * 0.08, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1e3a5f'; ctx.beginPath(); ctx.arc(fx + fw * 0.18, fy + fh * 0.18, fh * 0.06, 0, Math.PI * 2); ctx.fill();
    // Snowy mountains
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath(); ctx.moveTo(fx, fy + fh * 0.7); ctx.lineTo(fx + fw * 0.3, fy + fh * 0.35); ctx.lineTo(fx + fw * 0.5, fy + fh * 0.55);
    ctx.lineTo(fx + fw * 0.7, fy + fh * 0.3); ctx.lineTo(fx + fw, fy + fh * 0.6);
    ctx.lineTo(fx + fw, fy + fh); ctx.lineTo(fx, fy + fh); ctx.closePath(); ctx.fill();
    // Snow caps
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.moveTo(fx + fw * 0.25, fy + fh * 0.4); ctx.lineTo(fx + fw * 0.3, fy + fh * 0.35); ctx.lineTo(fx + fw * 0.35, fy + fh * 0.42); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(fx + fw * 0.65, fy + fh * 0.35); ctx.lineTo(fx + fw * 0.7, fy + fh * 0.3); ctx.lineTo(fx + fw * 0.75, fy + fh * 0.37); ctx.closePath(); ctx.fill();
    // Tiny sled figure
    ctx.fillStyle = '#e879f9';
    ctx.beginPath(); ctx.arc(fx + fw * 0.6, fy + fh * 0.65, 4, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(fx + fw * 0.56, fy + fh * 0.68); ctx.lineTo(fx + fw * 0.64, fy + fh * 0.68); ctx.stroke();

  } else if (type === 'nyc') {
    // Warhol-style pop art NYC skyline — bold colors, repeated pattern
    ctx.fillStyle = '#1a1a2e'; ctx.fillRect(fx, fy, fw, fh);
    // Grid of colored skyline squares
    const popColors = [['#ef4444','#1a1a2e'],['#3b82f6','#1a1a2e'],['#fbbf24','#1a1a2e'],['#22c55e','#1a1a2e']];
    const qw = fw / 2, qh = fh / 2;
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        const qx = fx + c * qw, qy = fy + r * qh;
        const pc = popColors[r * 2 + c];
        ctx.fillStyle = pc[1]; ctx.fillRect(qx, qy, qw, qh);
        // Skyline in each quadrant
        ctx.fillStyle = pc[0];
        for (let i = 0; i < 8; i++) {
          const bx = qx + i * qw / 8;
          const bh = qh * 0.2 + (i * 31 % 17) * qh / 60;
          ctx.fillRect(bx + 1, qy + qh - bh, qw / 8 - 2, bh);
        }
        // Stars
        ctx.fillStyle = '#fff';
        for (let s = 0; s < 4; s++) {
          ctx.beginPath(); ctx.arc(qx + (s * 47 + 15) % qw, qy + 5 + (s * 23) % (qh * 0.4), 1, 0, Math.PI * 2); ctx.fill();
        }
      }
    }
    // Grid lines
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx, fy); ctx.lineTo(cx, fy + fh); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(fx, fy + fh / 2); ctx.lineTo(fx + fw, fy + fh / 2); ctx.stroke();

  } else if (type === 'rome') {
    // Warm golden scene with Colosseum
    const skyGrad = ctx.createLinearGradient(fx, fy, fx, fy + fh * 0.5);
    skyGrad.addColorStop(0, '#fef3c7'); skyGrad.addColorStop(1, '#fed7aa');
    ctx.fillStyle = skyGrad; ctx.fillRect(fx, fy, fw, fh * 0.5);
    ctx.fillStyle = '#d4a76a'; ctx.fillRect(fx, fy + fh * 0.5, fw, fh * 0.5);
    // Colosseum arches
    ctx.fillStyle = '#c8a06e';
    ctx.fillRect(cx - fw * 0.3, fy + fh * 0.25, fw * 0.6, fh * 0.35);
    ctx.fillStyle = '#a0845a';
    for (let i = 0; i < 5; i++) {
      const ax = cx - fw * 0.25 + i * fw * 0.12;
      ctx.beginPath(); ctx.arc(ax, fy + fh * 0.42, fw * 0.04, Math.PI, 0); ctx.fill();
    }
    for (let i = 0; i < 4; i++) {
      const ax = cx - fw * 0.2 + i * fw * 0.13;
      ctx.beginPath(); ctx.arc(ax, fy + fh * 0.32, fw * 0.03, Math.PI, 0); ctx.fill();
    }
    // Cat silhouette on top
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath(); ctx.arc(cx + fw * 0.15, fy + fh * 0.22, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + fw * 0.15, fy + fh * 0.27, 4, 6, 0, 0, Math.PI * 2); ctx.fill();
    // Ears
    ctx.beginPath(); ctx.moveTo(cx + fw * 0.15 - 4, fy + fh * 0.18); ctx.lineTo(cx + fw * 0.15 - 2, fy + fh * 0.14); ctx.lineTo(cx + fw * 0.15, fy + fh * 0.18); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx + fw * 0.15, fy + fh * 0.18); ctx.lineTo(cx + fw * 0.15 + 2, fy + fh * 0.14); ctx.lineTo(cx + fw * 0.15 + 4, fy + fh * 0.18); ctx.fill();

  } else if (type === 'hawaii') {
    // Vivid tropical beach with palm and wave
    ctx.fillStyle = '#38bdf8'; ctx.fillRect(fx, fy, fw, fh * 0.55);
    // Ocean
    ctx.fillStyle = '#0ea5e9'; ctx.fillRect(fx, fy + fh * 0.55, fw, fh * 0.15);
    // Waves
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
    for (let w = 0; w < 3; w++) {
      ctx.beginPath();
      for (let wx = fx; wx < fx + fw; wx += 5) {
        ctx.lineTo(wx, fy + fh * (0.56 + w * 0.04) + Math.sin((wx - fx) / 20 + w) * 3);
      }
      ctx.stroke();
    }
    // Sand
    ctx.fillStyle = '#fbbf24'; ctx.fillRect(fx, fy + fh * 0.7, fw, fh * 0.3);
    // Palm tree
    ctx.fillStyle = '#92400e'; ctx.fillRect(fx + fw * 0.2, fy + fh * 0.2, 5, fh * 0.55);
    ctx.fillStyle = '#22c55e';
    for (let leaf = 0; leaf < 5; leaf++) {
      const la = leaf * Math.PI / 2.5 - Math.PI / 2;
      ctx.beginPath(); ctx.ellipse(fx + fw * 0.2 + 2, fy + fh * 0.2, fw * 0.08, 5, la, 0, Math.PI * 2); ctx.fill();
    }
    // Sunset
    ctx.fillStyle = '#f97316'; ctx.beginPath(); ctx.arc(fx + fw * 0.75, fy + fh * 0.55, fh * 0.1, Math.PI, 0); ctx.fill();
    // Surfboard in sand
    ctx.fillStyle = '#ef4444'; ctx.save();
    ctx.translate(fx + fw * 0.65, fy + fh * 0.8); ctx.rotate(-0.3);
    ctx.beginPath(); ctx.ellipse(0, 0, 4, 18, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

  } else if (type === 'oriental') {
    // Turner-style sunset over water — golden light, silhouette boats
    const skyGrad = ctx.createLinearGradient(fx, fy, fx, fy + fh);
    skyGrad.addColorStop(0, '#fbbf24'); skyGrad.addColorStop(0.3, '#f97316'); skyGrad.addColorStop(0.5, '#ef4444');
    skyGrad.addColorStop(0.6, '#0ea5e9'); skyGrad.addColorStop(1, '#1e3a5f');
    ctx.fillStyle = skyGrad; ctx.fillRect(fx, fy, fw, fh);
    // Sun reflection on water
    ctx.fillStyle = '#fbbf2440';
    ctx.fillRect(cx - 15, fy + fh * 0.5, 30, fh * 0.5);
    // Sun
    ctx.fillStyle = '#fef08a'; ctx.beginPath(); ctx.arc(cx, fy + fh * 0.35, fh * 0.07, 0, Math.PI * 2); ctx.fill();
    // Silhouette sailboats
    ctx.fillStyle = '#1e1b4b';
    for (let i = 0; i < 3; i++) {
      const bx = fx + fw * 0.2 + i * fw * 0.25;
      const by = fy + fh * 0.55 + i * 5;
      ctx.fillRect(bx - 8, by, 16, 5);
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by - 20 + i * 3); ctx.lineTo(bx + 10, by); ctx.closePath(); ctx.fill();
    }

  } else if (type === 'alps') {
    // Hokusai-style great wave but with snow
    ctx.fillStyle = '#e0f2fe'; ctx.fillRect(fx, fy, fw, fh);
    // Large wave/snow drift
    ctx.fillStyle = '#bae6fd';
    ctx.beginPath(); ctx.moveTo(fx, fy + fh * 0.6);
    ctx.bezierCurveTo(fx + fw * 0.2, fy + fh * 0.1, fx + fw * 0.4, fy + fh * 0.15, fx + fw * 0.5, fy + fh * 0.3);
    ctx.bezierCurveTo(fx + fw * 0.55, fy + fh * 0.35, fx + fw * 0.5, fy + fh * 0.5, fx + fw * 0.45, fy + fh * 0.45);
    ctx.lineTo(fx + fw, fy + fh * 0.7); ctx.lineTo(fx + fw, fy + fh); ctx.lineTo(fx, fy + fh); ctx.closePath(); ctx.fill();
    // Wave crest curl
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.moveTo(fx + fw * 0.45, fy + fh * 0.28);
    ctx.quadraticCurveTo(fx + fw * 0.52, fy + fh * 0.22, fx + fw * 0.48, fy + fh * 0.35);
    ctx.quadraticCurveTo(fx + fw * 0.44, fy + fh * 0.32, fx + fw * 0.45, fy + fh * 0.28);
    ctx.fill();
    // Spray drops
    for (let i = 0; i < 8; i++) {
      ctx.beginPath(); ctx.arc(fx + fw * 0.42 + (i * 7) % 30, fy + fh * 0.2 + (i * 11) % 15, 2, 0, Math.PI * 2); ctx.fill();
    }
    // Mountain in background
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath(); ctx.moveTo(fx + fw * 0.6, fy + fh * 0.6); ctx.lineTo(fx + fw * 0.75, fy + fh * 0.25); ctx.lineTo(fx + fw * 0.9, fy + fh * 0.5); ctx.lineTo(fx + fw, fy + fh * 0.6); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.moveTo(fx + fw * 0.72, fy + fh * 0.3); ctx.lineTo(fx + fw * 0.75, fy + fh * 0.25); ctx.lineTo(fx + fw * 0.78, fy + fh * 0.3); ctx.closePath(); ctx.fill();

  } else if (type === 'camp') {
    // Bob Ross-style — dark sky, happy little trees, campfire glow
    ctx.fillStyle = '#0f172a'; ctx.fillRect(fx, fy, fw, fh);
    // Stars
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 20; i++) {
      ctx.beginPath(); ctx.arc(fx + (i * 83 + 20) % fw, fy + 5 + (i * 47) % (fh * 0.4), 1 + (i % 2), 0, Math.PI * 2); ctx.fill();
    }
    // Milky Way band
    ctx.fillStyle = 'rgba(167,139,250,0.15)';
    ctx.beginPath();
    ctx.moveTo(fx, fy + fh * 0.1);
    ctx.quadraticCurveTo(cx, fy + fh * 0.25, fx + fw, fy + fh * 0.05);
    ctx.lineTo(fx + fw, fy + fh * 0.15); ctx.quadraticCurveTo(cx, fy + fh * 0.35, fx, fy + fh * 0.2);
    ctx.closePath(); ctx.fill();
    // Dark tree silhouettes — happy little trees
    ctx.fillStyle = '#1e3a2f';
    for (let i = 0; i < 6; i++) {
      const tx = fx + fw * 0.1 + i * fw * 0.15;
      const th = fh * 0.2 + (i * 17 % 11) * fh / 80;
      ctx.beginPath(); ctx.moveTo(tx - 8, fy + fh * 0.65); ctx.lineTo(tx, fy + fh * 0.65 - th); ctx.lineTo(tx + 8, fy + fh * 0.65); ctx.closePath(); ctx.fill();
    }
    // Ground
    ctx.fillStyle = '#1a3320'; ctx.fillRect(fx, fy + fh * 0.65, fw, fh * 0.35);
    // Campfire glow
    ctx.fillStyle = '#f9731640'; ctx.beginPath(); ctx.arc(cx, fy + fh * 0.75, fh * 0.15, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fbbf2430'; ctx.beginPath(); ctx.arc(cx, fy + fh * 0.75, fh * 0.1, 0, Math.PI * 2); ctx.fill();
    // Campfire
    ctx.fillStyle = '#f97316'; ctx.beginPath(); ctx.moveTo(cx - 6, fy + fh * 0.78); ctx.lineTo(cx, fy + fh * 0.68); ctx.lineTo(cx + 6, fy + fh * 0.78); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.moveTo(cx - 3, fy + fh * 0.78); ctx.lineTo(cx, fy + fh * 0.72); ctx.lineTo(cx + 3, fy + fh * 0.78); ctx.closePath(); ctx.fill();
    // Reflection in lake
    ctx.fillStyle = '#1e3a5f'; ctx.fillRect(fx + fw * 0.6, fy + fh * 0.7, fw * 0.35, fh * 0.2);
    ctx.fillStyle = '#fbbf2420'; ctx.fillRect(cx + fw * 0.08, fy + fh * 0.72, 6, fh * 0.15);

  } else if (type === 'safari') {
    // Matisse-style bold cutout shapes — safari sunset
    const grad = ctx.createLinearGradient(fx, fy, fx, fy + fh);
    grad.addColorStop(0, '#f97316'); grad.addColorStop(0.4, '#ef4444'); grad.addColorStop(0.6, '#1e1b4b');
    ctx.fillStyle = grad; ctx.fillRect(fx, fy, fw, fh);
    // Large sun
    ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(cx, fy + fh * 0.4, fh * 0.12, 0, Math.PI * 2); ctx.fill();
    // Ground
    ctx.fillStyle = '#92400e'; ctx.fillRect(fx, fy + fh * 0.65, fw, fh * 0.35);
    // Acacia tree silhouette (flat African style)
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(fx + fw * 0.3, fy + fh * 0.35, 4, fh * 0.3);
    ctx.beginPath(); ctx.ellipse(fx + fw * 0.3 + 2, fy + fh * 0.35, fw * 0.08, fh * 0.06, 0, 0, Math.PI * 2); ctx.fill();
    // Giraffe silhouette
    ctx.fillRect(fx + fw * 0.65, fy + fh * 0.35, 4, fh * 0.3);
    ctx.beginPath(); ctx.arc(fx + fw * 0.65 + 2, fy + fh * 0.33, 5, 0, Math.PI * 2); ctx.fill();
    // Elephant silhouette
    ctx.beginPath(); ctx.ellipse(fx + fw * 0.5, fy + fh * 0.6, 15, 10, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(fx + fw * 0.5 - 12, fy + fh * 0.62, 4, 10);
    ctx.fillRect(fx + fw * 0.5 + 8, fy + fh * 0.62, 4, 10);
    // Birds in V formation
    ctx.strokeStyle = '#1e1b4b'; ctx.lineWidth = 1.5;
    for (let b = 0; b < 5; b++) {
      const bx = fx + fw * 0.55 + b * 12 - 24;
      const by = fy + fh * 0.2 + Math.abs(b - 2) * 6;
      ctx.beginPath(); ctx.moveTo(bx - 4, by + 2); ctx.lineTo(bx, by); ctx.lineTo(bx + 4, by + 2); ctx.stroke();
    }
  }
}

// ── NASA Museum — Aircraft & Spacecraft Exhibit ──
function drawNasaMuseumInterior(cam, W, H) {
  const cx = cam + W / 2;
  const t = gameTime;

  // High ceiling hall — dark blue-gray walls
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(cam, 0, W, H);
  // Polished floor
  const floorGrad = ctx.createLinearGradient(cam, H * 0.75, cam, H);
  floorGrad.addColorStop(0, '#334155');
  floorGrad.addColorStop(1, '#1e293b');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(cam, H * 0.75, W, H * 0.25);
  // Floor reflections
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  ctx.fillRect(cam, H * 0.75, W, 3);

  // Banner
  ctx.fillStyle = '#1e40af';
  ctx.fillRect(cam, 0, W, 50);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('Kennedy Space Center Visitor Complex', cx, 33);

  // Thin support wires from ceiling
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
  ctx.lineWidth = 1;

  // ── Aircraft 1: Wright Flyer (leftmost) ──
  const w1x = cam + W * 0.12;
  const w1y = H * 0.22;
  ctx.beginPath(); ctx.moveTo(w1x, 0); ctx.lineTo(w1x, w1y); ctx.stroke();
  // Biplane wings
  ctx.fillStyle = '#d4a76a';
  ctx.fillRect(w1x - 30, w1y, 60, 4);
  ctx.fillRect(w1x - 28, w1y + 12, 56, 4);
  // Struts
  ctx.strokeStyle = '#92400e'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(w1x - 20, w1y + 4); ctx.lineTo(w1x - 18, w1y + 12); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(w1x + 20, w1y + 4); ctx.lineTo(w1x + 18, w1y + 12); ctx.stroke();
  // Body
  ctx.fillStyle = '#b8860b';
  ctx.fillRect(w1x - 4, w1y + 5, 20, 5);
  // Propeller
  const propAngle = t / 100;
  ctx.fillStyle = '#78350f';
  ctx.save(); ctx.translate(w1x + 16, w1y + 7); ctx.rotate(propAngle);
  ctx.fillRect(-1, -8, 2, 16); ctx.restore();
  // Label
  ctx.fillStyle = '#94a3b8'; ctx.font = '9px system-ui';
  ctx.fillText('Wright Flyer', w1x, w1y + 28);

  // ── Aircraft 2: X-15 (left-center) ──
  const x15x = cam + W * 0.32;
  const x15y = H * 0.3;
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x15x, 0); ctx.lineTo(x15x, x15y); ctx.stroke();
  // Sleek black body
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath();
  ctx.moveTo(x15x - 35, x15y + 4); ctx.lineTo(x15x + 25, x15y); ctx.lineTo(x15x + 35, x15y + 4);
  ctx.lineTo(x15x + 25, x15y + 8); ctx.lineTo(x15x - 35, x15y + 8); ctx.closePath(); ctx.fill();
  // Wings
  ctx.fillStyle = '#312e81';
  ctx.beginPath(); ctx.moveTo(x15x - 5, x15y); ctx.lineTo(x15x + 5, x15y - 12); ctx.lineTo(x15x + 15, x15y); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x15x - 5, x15y + 8); ctx.lineTo(x15x + 5, x15y + 20); ctx.lineTo(x15x + 15, x15y + 8); ctx.closePath(); ctx.fill();
  // Tail fin
  ctx.beginPath(); ctx.moveTo(x15x - 30, x15y); ctx.lineTo(x15x - 35, x15y - 10); ctx.lineTo(x15x - 25, x15y); ctx.closePath(); ctx.fill();
  // NASA text
  ctx.fillStyle = '#fff'; ctx.font = 'bold 5px system-ui';
  ctx.fillText('NASA', x15x, x15y + 6);
  ctx.fillStyle = '#94a3b8'; ctx.font = '9px system-ui';
  ctx.fillText('X-15 Rocket Plane', x15x, x15y + 30);

  // ── Spacecraft 3: Space Shuttle (center, largest) ──
  const ssx = cx;
  const ssy = H * 0.18;
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(ssx - 15, 0); ctx.lineTo(ssx - 15, ssy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ssx + 15, 0); ctx.lineTo(ssx + 15, ssy); ctx.stroke();
  // Main body (white)
  ctx.fillStyle = '#f1f5f9';
  ctx.beginPath();
  ctx.moveTo(ssx - 15, ssy + 50); ctx.lineTo(ssx - 12, ssy); ctx.lineTo(ssx, ssy - 15);
  ctx.lineTo(ssx + 12, ssy); ctx.lineTo(ssx + 15, ssy + 50); ctx.closePath(); ctx.fill();
  // Nose cone
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath(); ctx.moveTo(ssx - 5, ssy); ctx.lineTo(ssx, ssy - 15); ctx.lineTo(ssx + 5, ssy); ctx.closePath(); ctx.fill();
  // Wings (delta)
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath(); ctx.moveTo(ssx - 12, ssy + 30); ctx.lineTo(ssx - 40, ssy + 55); ctx.lineTo(ssx - 15, ssy + 50); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(ssx + 12, ssy + 30); ctx.lineTo(ssx + 40, ssy + 55); ctx.lineTo(ssx + 15, ssy + 50); ctx.closePath(); ctx.fill();
  // Tail
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath(); ctx.moveTo(ssx - 3, ssy + 40); ctx.lineTo(ssx, ssy + 25); ctx.lineTo(ssx + 3, ssy + 40); ctx.closePath(); ctx.fill();
  // USA flag stripe
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(ssx - 8, ssy + 15, 16, 3);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(ssx - 8, ssy + 19, 16, 3);
  // Windows
  ctx.fillStyle = '#60a5fa';
  ctx.beginPath(); ctx.arc(ssx - 3, ssy + 5, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(ssx + 3, ssy + 5, 2, 0, Math.PI * 2); ctx.fill();
  // Engines
  ctx.fillStyle = '#6b7280';
  ctx.beginPath(); ctx.arc(ssx - 5, ssy + 52, 4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(ssx + 5, ssy + 52, 4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(ssx, ssy + 54, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#94a3b8'; ctx.font = '10px system-ui';
  ctx.fillText('Space Shuttle Discovery', ssx, ssy + 72);

  // ── Spacecraft 4: Mercury Capsule (right-center) ──
  const mcx = cam + W * 0.68;
  const mcy = H * 0.28;
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(mcx, 0); ctx.lineTo(mcx, mcy); ctx.stroke();
  // Capsule body (cone shape)
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.moveTo(mcx - 12, mcy + 20); ctx.lineTo(mcx - 6, mcy); ctx.lineTo(mcx + 6, mcy);
  ctx.lineTo(mcx + 12, mcy + 20); ctx.closePath(); ctx.fill();
  // Heat shield
  ctx.fillStyle = '#78716c';
  ctx.fillRect(mcx - 14, mcy + 20, 28, 5);
  // Window
  ctx.fillStyle = '#60a5fa';
  ctx.beginPath(); ctx.arc(mcx, mcy + 8, 3, 0, Math.PI * 2); ctx.fill();
  // Antenna
  ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(mcx, mcy); ctx.lineTo(mcx, mcy - 10); ctx.stroke();
  ctx.fillStyle = '#94a3b8'; ctx.font = '9px system-ui';
  ctx.fillText('Mercury Friendship 7', mcx, mcy + 35);

  // ── Aircraft 5: SR-71 Blackbird (rightmost) ──
  const srx = cam + W * 0.88;
  const sry = H * 0.24;
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(srx, 0); ctx.lineTo(srx, sry); ctx.stroke();
  // Long sleek black body
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(srx - 40, sry + 5); ctx.lineTo(srx + 20, sry + 2); ctx.lineTo(srx + 40, sry + 5);
  ctx.lineTo(srx + 20, sry + 8); ctx.lineTo(srx - 40, sry + 8); ctx.closePath(); ctx.fill();
  // Twin engines
  ctx.beginPath(); ctx.arc(srx + 8, sry + 2, 4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(srx + 8, sry + 10, 4, 0, Math.PI * 2); ctx.fill();
  // Wings (swept back)
  ctx.fillStyle = '#1e293b';
  ctx.beginPath(); ctx.moveTo(srx - 10, sry); ctx.lineTo(srx + 10, sry - 8); ctx.lineTo(srx + 20, sry + 2); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(srx - 10, sry + 10); ctx.lineTo(srx + 10, sry + 18); ctx.lineTo(srx + 20, sry + 8); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#94a3b8'; ctx.font = '9px system-ui';
  ctx.fillText('SR-71 Blackbird', srx, sry + 30);

  // Informational displays along the wall
  const displays = [
    { x: cam + W * 0.1, label: '1903', desc: 'First Flight' },
    { x: cam + W * 0.3, label: '1961', desc: 'First American in Space' },
    { x: cam + W * 0.5, label: '1969', desc: 'Moon Landing' },
    { x: cam + W * 0.7, label: '1981', desc: 'First Shuttle Launch' },
    { x: cam + W * 0.9, label: '2020', desc: 'Commercial Crew' },
  ];
  for (const d of displays) {
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(d.x - 30, H * 0.6, 60, 35);
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 12px system-ui';
    ctx.fillText(d.label, d.x, H * 0.62 + 12);
    ctx.fillStyle = '#bfdbfe';
    ctx.font = '8px system-ui';
    ctx.fillText(d.desc, d.x, H * 0.62 + 25);
  }

  // Player on museum floor
  drawKitty(cx, H * 0.85, player.color, 1, player.walkFrame, 'horn', playerEyeColor, playerHornColors);

  // Prompt
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 14px system-ui';
  ctx.fillText('Kennedy Space Center — Press Enter to leave', cx, H * 0.73);

  ctx.textAlign = 'left';
}

// ── Mission Control — Command Typing Minigame ──
function drawMissionControlInterior(cam, W, H) {
  const cx = cam + W / 2;
  const mc = missionControl;
  const t = gameTime;

  // Dark room background
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(cam, 0, W, H);

  // Subtle grid floor
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.05)';
  ctx.lineWidth = 1;
  for (let gx = cam; gx < cam + W; gx += 40) {
    ctx.beginPath(); ctx.moveTo(gx, H * 0.75); ctx.lineTo(gx, H); ctx.stroke();
  }
  for (let gy = H * 0.75; gy < H; gy += 20) {
    ctx.beginPath(); ctx.moveTo(cam, gy); ctx.lineTo(cam + W, gy); ctx.stroke();
  }

  // Console desk
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(cam + W * 0.05, H * 0.68, W * 0.9, H * 0.08);
  // Desk edge highlight
  ctx.fillStyle = '#334155';
  ctx.fillRect(cam + W * 0.05, H * 0.68, W * 0.9, 3);

  // Side monitors (ambient screens)
  const sideMonitors = [
    { x: cam + W * 0.08, y: H * 0.12, w: W * 0.15, h: H * 0.18, label: 'TELEMETRY' },
    { x: cam + W * 0.77, y: H * 0.12, w: W * 0.15, h: H * 0.18, label: 'TRACKING' },
    { x: cam + W * 0.08, y: H * 0.35, w: W * 0.12, h: H * 0.14, label: 'COMMS' },
    { x: cam + W * 0.80, y: H * 0.35, w: W * 0.12, h: H * 0.14, label: 'VITALS' },
  ];
  for (const mon of sideMonitors) {
    // Monitor frame
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(mon.x - 3, mon.y - 3, mon.w + 6, mon.h + 6);
    // Screen
    ctx.fillStyle = '#0a1a0a';
    ctx.fillRect(mon.x, mon.y, mon.w, mon.h);
    // Scrolling data lines
    ctx.fillStyle = '#15803d';
    ctx.font = '8px monospace';
    for (let l = 0; l < 6; l++) {
      const dataY = mon.y + 12 + l * 10;
      if (dataY < mon.y + mon.h - 4) {
        const scrollOff = ((t / 50 + l * 17) % 30) | 0;
        const dataStr = (scrollOff + l * 1234).toString(16).toUpperCase().padStart(8, '0');
        ctx.fillText(dataStr, mon.x + 4, dataY);
      }
    }
    // Label
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(mon.label, mon.x + mon.w / 2, mon.y - 6);
  }
  ctx.textAlign = 'left';

  // ── Main screen (center) ──
  const mainX = cam + W * 0.25;
  const mainY = H * 0.1;
  const mainW = W * 0.5;
  const mainH = H * 0.52;

  // Monitor frame
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(mainX - 5, mainY - 5, mainW + 10, mainH + 10);
  // Screen background
  ctx.fillStyle = '#0a1a0a';
  ctx.fillRect(mainX, mainY, mainW, mainH);
  // Scanline effect
  ctx.fillStyle = 'rgba(0, 255, 0, 0.02)';
  for (let sl = 0; sl < mainH; sl += 3) {
    ctx.fillRect(mainX, mainY + sl, mainW, 1);
  }

  ctx.textAlign = 'center';

  if (mc.complete) {
    // ── Success: Rocket launch animation ──
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('LAUNCH SUCCESSFUL', cx, mainY + 40);

    // Rocket
    const rocketX = cx;
    const rocketBaseY = mainY + mainH - 30 - mc.rocketY;

    if (rocketBaseY > mainY - 40) {
      // Rocket body
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.moveTo(rocketX - 10, rocketBaseY);
      ctx.lineTo(rocketX - 8, rocketBaseY - 40);
      ctx.lineTo(rocketX, rocketBaseY - 55);
      ctx.lineTo(rocketX + 8, rocketBaseY - 40);
      ctx.lineTo(rocketX + 10, rocketBaseY);
      ctx.closePath();
      ctx.fill();
      // Nose cone
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(rocketX - 5, rocketBaseY - 40);
      ctx.lineTo(rocketX, rocketBaseY - 55);
      ctx.lineTo(rocketX + 5, rocketBaseY - 40);
      ctx.closePath();
      ctx.fill();
      // Fins
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.moveTo(rocketX - 10, rocketBaseY);
      ctx.lineTo(rocketX - 18, rocketBaseY + 10);
      ctx.lineTo(rocketX - 10, rocketBaseY - 10);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(rocketX + 10, rocketBaseY);
      ctx.lineTo(rocketX + 18, rocketBaseY + 10);
      ctx.lineTo(rocketX + 10, rocketBaseY - 10);
      ctx.closePath();
      ctx.fill();
      // Flame
      const flameH = 15 + Math.sin(t / 30) * 8;
      const flameGrad = ctx.createLinearGradient(rocketX, rocketBaseY, rocketX, rocketBaseY + flameH);
      flameGrad.addColorStop(0, '#fbbf24');
      flameGrad.addColorStop(0.5, '#f97316');
      flameGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.moveTo(rocketX - 8, rocketBaseY);
      ctx.lineTo(rocketX, rocketBaseY + flameH);
      ctx.lineTo(rocketX + 8, rocketBaseY);
      ctx.closePath();
      ctx.fill();
    }

    // Score
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('+250 MISSION COMPLETE!', cx, mainY + mainH - 15);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px monospace';
    ctx.fillText('Press Enter to exit', cx, mainY + mainH + 25);

  } else if (mc.failed) {
    // ── Failure screen ──
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('TIME EXPIRED', cx, mainY + mainH / 2 - 20);
    ctx.fillStyle = '#fca5a5';
    ctx.font = '14px monospace';
    ctx.fillText('Commands completed: ' + mc.round + '/5', cx, mainY + mainH / 2 + 10);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px monospace';
    ctx.fillText('Press Enter to exit', cx, mainY + mainH / 2 + 40);

  } else {
    // ── Active typing screen ──
    const currentCmd = MISSION_COMMANDS[mc.round];

    // Header
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('NASA MISSION CONTROL', cx, mainY + 20);

    // Round indicator
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('Command ' + (mc.round + 1) + '/5', cx, mainY + 42);

    // Timer
    const timeSeconds = Math.ceil(mc.timeLeft / 1000);
    const timerColor = timeSeconds <= 10 ? '#ef4444' : timeSeconds <= 20 ? '#fbbf24' : '#22c55e';
    ctx.fillStyle = timerColor;
    ctx.font = 'bold 20px monospace';
    ctx.fillText('T-' + timeSeconds + 's', cx, mainY + 70);

    // Instruction
    ctx.fillStyle = '#475569';
    ctx.font = '11px monospace';
    ctx.fillText('Type the command below:', cx, mainY + 95);

    // Command to type (large, prominent)
    ctx.font = 'bold 22px monospace';
    const cmdY = mainY + 135;

    // Measure text width for centering character-by-character
    const charW = ctx.measureText('M').width; // monospace
    const cmdStartX = cx - (currentCmd.length * charW) / 2;

    for (let i = 0; i < currentCmd.length; i++) {
      const charX = cmdStartX + i * charW;
      if (i < mc.typed.length) {
        // Typed correctly
        ctx.fillStyle = '#22c55e';
        ctx.textAlign = 'left';
        ctx.fillText(currentCmd[i], charX, cmdY);
      } else if (i === mc.typed.length) {
        // Cursor position — blinking
        const blink = Math.sin(t / 100) > 0;
        if (blink) {
          ctx.fillStyle = '#22c55e';
          ctx.fillRect(charX, cmdY + 3, charW - 2, 3);
        }
        ctx.fillStyle = '#4ade80';
        ctx.textAlign = 'left';
        ctx.fillText(currentCmd[i], charX, cmdY);
      } else {
        // Not yet typed
        ctx.fillStyle = '#374151';
        ctx.textAlign = 'left';
        ctx.fillText(currentCmd[i], charX, cmdY);
      }
    }

    // Player's typed text below
    ctx.fillStyle = '#166534';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('> ' + mc.typed + '_', cx, cmdY + 35);

    // Error flash
    if (mc.errors > 0 && mc.errors > (mc._lastDrawnErrors || 0)) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
      ctx.fillRect(mainX, mainY, mainW, mainH);
    }
    mc._lastDrawnErrors = mc.errors;

    // Progress bar
    const progY = mainY + mainH - 35;
    const progW = mainW * 0.6;
    const progX = cx - progW / 2;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(progX, progY, progW, 10);
    const progFill = (mc.round + mc.typed.length / currentCmd.length) / MISSION_COMMANDS.length;
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(progX, progY, progW * progFill, 10);
    // Progress labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px monospace';
    ctx.fillText('Progress', cx, progY - 4);

    // Errors count
    if (mc.errors > 0) {
      ctx.fillStyle = '#ef4444';
      ctx.font = '10px monospace';
      ctx.fillText('Errors: ' + mc.errors, cx, progY + 25);
    }
  }

  // Player at console
  drawKitty(cx, H * 0.85, player.color, 1, 0, 'horn', playerEyeColor, playerHornColors);

  // Console keyboard in front of player
  ctx.fillStyle = '#334155';
  ctx.fillRect(cx - 25, H * 0.78, 50, 8);
  // Key highlights when typing
  if (!mc.complete && !mc.failed && mc.typed.length > 0) {
    const flashIntensity = Math.max(0, 1 - (t % 200) / 200);
    ctx.fillStyle = 'rgba(34, 197, 94, ' + (flashIntensity * 0.5) + ')';
    ctx.fillRect(cx - 23, H * 0.78 + 1, 46, 6);
  }

  ctx.textAlign = 'left';
}
