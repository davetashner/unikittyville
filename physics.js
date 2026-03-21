// physics.js — Pure physics functions (no global state)

function applyGravity(vy, gravity) {
  return vy + gravity;
}

function checkPlatformCollision(playerX, playerY, playerVY, platforms) {
  // Returns { y, vy, onGround } or null if no collision
  if (playerVY < 0) return null; // only check when falling
  for (const p of platforms) {
    if (playerX > p.x - 10 && playerX < p.x + p.w + 10 &&
        playerY >= p.y && playerY - playerVY <= p.y) {
      return { y: p.y, vy: 0, onGround: true };
    }
  }
  return null;
}

function applyWorldBounds(x, worldW) {
  return Math.max(20, Math.min(worldW - 20, x));
}

function applySwimmingPhysics(pos, vel, keys, buoyancy, swimForce, drag) {
  let vx = vel.vx, vy = vel.vy;
  if (keys.left) vx -= swimForce;
  if (keys.right) vx += swimForce;
  if (keys.up) vy -= swimForce;
  if (keys.down) vy += swimForce;
  vy += buoyancy;
  vx *= drag;
  vy *= drag;
  return { x: pos.x + vx, y: pos.y + vy, vx, vy };
}

function applySwimmingBounds(x, y, worldW, worldH) {
  return {
    x: Math.max(20, Math.min(worldW - 20, x)),
    y: Math.max(20, Math.min(worldH - 40, y))
  };
}
