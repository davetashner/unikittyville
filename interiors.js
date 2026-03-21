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
  ctx.font = '13px system-ui'; ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.fillText('Press Enter to leave', cx, cy + 150);
  // Draw player
  drawKitty(cx, cy + 60, player.color, 1, 0, 'horn', playerEyeColor, playerHornColors);
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
  ctx.font = '13px system-ui'; ctx.fillStyle = 'rgba(100,100,100,0.8)';
  ctx.fillText('Press Enter to leave', cx, cy + 145);
  drawKitty(cx, cy + 60, player.color, 1, 0, 'horn', playerEyeColor, playerHornColors);
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
  const stages = ['Prep Room', 'Vitals', 'Breathing', 'Deliver!', 'Celebrate', 'Name Kit'];
  const stageIndex = { prep: 0, vitals: 1, breathing: 2, delivery: 3, celebrate: 4, color_pick: 5 };
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
    ctx.fillText('Baby Kit', cx, cy + 45);

    ctx.font = '12px system-ui';
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillText('Press 1-8 to pick a color, Enter to confirm', cx, cy + 140);
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
    const isActive = (faoPlayerX + 3) === i;
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
  // Target melody
  ctx.fillStyle = '#1e1b4b'; ctx.font = '14px system-ui';
  ctx.fillText('Play this melody:', cx, keyY - 30);
  for (let i = 0; i < faoMelodyTarget.length; i++) {
    ctx.fillStyle = i < faoMelody.length ? '#4ade80' : keyColors[faoMelodyTarget[i]];
    ctx.font = 'bold 16px system-ui';
    ctx.fillText(noteNames[faoMelodyTarget[i]], cx - 80 + i * 35, keyY - 10);
  }
  drawKitty(cam + keyW * 0.5 + (faoPlayerX + 3) * keyW + keyW / 2, keyY - 15, player.color, 1, player.walkFrame, 'horn', playerEyeColor, playerHornColors);
  ctx.textAlign = 'left';
}

// ── Empire State Building ──
function drawEmpireStateInterior(cam, W, H) {
  const cx = cam + W / 2;
  if (!empireAtTop) {
    ctx.fillStyle = '#78716c'; ctx.fillRect(cam, 0, W, H);
    ctx.fillStyle = '#fbbf24'; ctx.fillRect(cx - 60, H * 0.3, 120, 160);
    ctx.strokeStyle = '#92400e'; ctx.lineWidth = 3; ctx.strokeRect(cx - 60, H * 0.3, 120, 160);
    ctx.fillStyle = '#1e1b4b'; ctx.fillRect(cx - 30, H * 0.2, 60, 30);
    ctx.fillStyle = '#ef4444'; ctx.font = 'bold 20px system-ui'; ctx.textAlign = 'center';
    ctx.fillText(Math.round(empireElevator), cx, H * 0.2 + 22);
    ctx.fillStyle = '#374151'; ctx.fillRect(cam + 30, H * 0.4, 20, H * 0.4);
    ctx.fillStyle = '#fbbf24'; ctx.fillRect(cam + 30, H * 0.4 + H * 0.4 * (1 - empireElevator / 100), 20, H * 0.4 * (empireElevator / 100));
    drawKitty(cx, H * 0.58, player.color, 1, 0, 'horn', playerEyeColor, playerHornColors);
  } else {
    ctx.fillStyle = '#60a5fa'; ctx.fillRect(cam, 0, W, H);
    for (let i = 0; i < 30; i++) {
      const bx = cam + (i * 137 + 20) % W;
      const bh = 40 + (i * 89) % 80;
      ctx.fillStyle = ['#64748b','#475569','#94a3b8','#334155'][i % 4];
      ctx.fillRect(bx, H - bh, 25, bh);
      ctx.fillStyle = '#fef08a';
      for (let wy = H - bh + 5; wy < H - 5; wy += 12) {
        ctx.fillRect(bx + 5, wy, 5, 5); ctx.fillRect(bx + 15, wy, 5, 5);
      }
    }
    ctx.strokeStyle = '#6b7280'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cam, H * 0.7); ctx.lineTo(cam + W, H * 0.7); ctx.stroke();
    drawKitty(cx, H * 0.67, player.color, 1, 0, 'horn', playerEyeColor, playerHornColors);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 20px system-ui'; ctx.textAlign = 'center';
    ctx.fillText('102nd Floor — Top of New York!', cx, 40);
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

// ── The Metropolitan Museum of Art ──
function drawMetMuseumInterior(cam, W, H) {
  const cx = cam + W / 2;
  ctx.fillStyle = '#f5f5f4'; ctx.fillRect(cam, 0, W, H);
  ctx.fillStyle = '#d6d3d1'; ctx.fillRect(cam, H * 0.75, W, H * 0.25);
  ctx.fillStyle = '#dc2626'; ctx.fillRect(cam, 0, W, 45);
  ctx.fillStyle = '#fff'; ctx.font = 'bold 22px system-ui'; ctx.textAlign = 'center';
  ctx.fillText('The Metropolitan Museum of Art', cx, 30);
  const p = MET_PAINTINGS[metPaintingIndex];
  const frameW = W * 0.5, frameH = H * 0.4;
  const frameX = cx - frameW / 2, frameY = H * 0.15;
  ctx.fillStyle = '#92400e'; ctx.fillRect(frameX - 10, frameY - 10, frameW + 20, frameH + 20);
  ctx.fillStyle = '#b45309'; ctx.fillRect(frameX - 5, frameY - 5, frameW + 10, frameH + 10);
  ctx.fillStyle = p.color; ctx.fillRect(frameX, frameY, frameW, frameH);
  ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.fillRect(frameX, frameY + frameH * 0.7, frameW, frameH * 0.3);
  ctx.fillStyle = '#fff'; ctx.font = 'italic 14px system-ui';
  ctx.fillText('"' + p.title + '"', cx, frameY + frameH * 0.4);
  ctx.font = '12px system-ui'; ctx.fillText('Inspired by: ' + p.level, cx, frameY + frameH * 0.55);
  ctx.fillStyle = '#fbbf24'; ctx.fillRect(cx - 60, frameY + frameH + 20, 120, 25);
  ctx.fillStyle = '#1e1b4b'; ctx.font = 'bold 11px system-ui';
  ctx.fillText(p.title, cx, frameY + frameH + 36);
  ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 30px system-ui';
  if (metPaintingIndex > 0) ctx.fillText('\u2190', cam + 40, H * 0.4);
  if (metPaintingIndex < MET_PAINTINGS.length - 1) ctx.fillText('\u2192', cam + W - 60, H * 0.4);
  ctx.fillStyle = '#78716c'; ctx.font = '14px system-ui';
  ctx.fillText((metPaintingIndex + 1) + ' of ' + MET_PAINTINGS.length, cx, H * 0.72);
  drawKitty(cx, H * 0.85, player.color, 1, 0, 'horn', playerEyeColor, playerHornColors);
  ctx.textAlign = 'left';
}
