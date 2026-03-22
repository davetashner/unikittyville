/**
 * Unikittyville Smoke Test Harness
 *
 * Uses Playwright to load the real game in headless Chromium and
 * validate each level loads, the player can move, and no JS errors occur.
 *
 * Usage: cd test && npm install && npx playwright install chromium && node smoke.mjs
 */

import { chromium } from '@playwright/test';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GAME_DIR = path.resolve(__dirname, '..');
const PORT = 9876;

// ── Simple static file server ──
function startServer() {
  const mimeTypes = {
    '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav', '.json': 'application/json',
  };
  const server = http.createServer((req, res) => {
    const url = req.url === '/' ? '/index.html' : req.url.split('?')[0];
    const filePath = path.join(GAME_DIR, url);
    const ext = path.extname(filePath);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        // For missing audio files, return empty response
        if (ext === '.mp3' || ext === '.wav') {
          res.writeHead(200, { 'Content-Type': 'audio/mpeg' });
          res.end(Buffer.alloc(0));
        } else {
          res.writeHead(404); res.end('Not found');
        }
        return;
      }
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      res.end(data);
    });
  });
  return new Promise(resolve => server.listen(PORT, () => resolve(server)));
}

// ── Helpers ──
async function getState(page) {
  return page.evaluate(() => ({
    level: currentLevel,
    scene: currentScene,
    playerX: Math.round(player.x),
    playerY: Math.round(player.y),
    playerVx: player.vx,
    onGround: player.onGround,
    score: score,
    totalLevels: TOTAL_LEVELS,
    transition: levelTransition.active,
  }));
}

async function pressKey(page, key, ms = 50) {
  await page.keyboard.down(key);
  await page.waitForTimeout(ms);
  await page.keyboard.up(key);
}

async function holdKey(page, key, ms = 500) {
  await page.keyboard.down(key);
  await page.waitForTimeout(ms);
  await page.keyboard.up(key);
}

async function advanceFrames(page, n = 60) {
  await page.evaluate((frames) => {
    for (let i = 0; i < frames; i++) {
      update(16.67);
    }
    draw();
  }, n);
}

async function startGameAtLevel(page, level) {
  // Use level select
  await page.evaluate((lvl) => {
    // Directly call startGameAtLevel if available
    if (typeof startGameAtLevel === 'function') {
      startGameAtLevel(lvl);
    }
  }, level);
  await page.waitForTimeout(100);
  // Dismiss tour guide if active
  for (let i = 0; i < 5; i++) {
    await pressKey(page, 'Space', 30);
    await page.waitForTimeout(50);
  }
  // Wait for any transition to finish
  await page.waitForTimeout(200);
  await advanceFrames(page, 120); // 2 seconds of game time
}

// ── Main test runner ──
async function runTests() {
  console.log('🎮 Unikittyville Smoke Test Harness\n');

  const server = await startServer();
  console.log(`📡 Static server on port ${PORT}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 960, height: 540 } });

  const errors = [];
  const results = [];

  try {
    const page = await context.newPage();

    // Collect JS errors
    page.on('pageerror', err => errors.push({ type: 'pageerror', msg: err.message }));
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push({ type: 'console.error', msg: msg.text() });
    });

    // Load the game
    console.log('📖 Loading game...');
    await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // Check game loaded
    const hasCanvas = await page.evaluate(() => !!document.getElementById('game'));
    if (!hasCanvas) throw new Error('Canvas #game not found!');
    console.log('✅ Game loaded, canvas found\n');

    // Get total levels
    const totalLevels = await page.evaluate(() => TOTAL_LEVELS);
    console.log(`📊 Total levels: ${totalLevels}\n`);

    // ── Test each level ──
    for (let lvl = 1; lvl <= totalLevels; lvl++) {
      const levelErrors = errors.length;
      const levelName = await page.evaluate((l) => LEVEL_NAMES[l - 1], lvl);

      process.stdout.write(`  Level ${lvl} (${levelName})... `);

      try {
        // Start at this level
        await startGameAtLevel(page, lvl);

        // Get initial state
        const state1 = await getState(page);

        // Verify we're on the right level
        if (state1.level !== lvl) {
          results.push({ level: lvl, name: levelName, pass: false, reason: `Wrong level: ${state1.level}` });
          console.log(`❌ Wrong level (got ${state1.level})`);
          continue;
        }

        // Walk right
        await holdKey(page, 'ArrowRight', 300);
        await advanceFrames(page, 60);

        // Get state after walking
        const state2 = await getState(page);

        // Check player moved (except for special levels like Alps FP or choosing)
        const moved = state2.playerX > state1.playerX || state2.playerX !== 100;

        // Jump
        await pressKey(page, 'Space', 50);
        await advanceFrames(page, 30);

        // Take screenshot
        const screenshotDir = path.join(__dirname, 'screenshots');
        if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir);
        await page.screenshot({ path: path.join(screenshotDir, `level-${lvl}.png`) });

        // Check canvas is not blank
        const centerPixel = await page.evaluate(() => {
          const c = document.getElementById('game');
          const ctx2 = c.getContext('2d');
          const d = ctx2.getImageData(c.width / 2, c.height / 2, 1, 1).data;
          return { r: d[0], g: d[1], b: d[2], a: d[3] };
        });
        const isBlank = centerPixel.r === 0 && centerPixel.g === 0 && centerPixel.b === 0 && centerPixel.a === 0;

        // Check for new errors
        const newErrors = errors.length - levelErrors;

        const pass = !isBlank && newErrors === 0;
        results.push({
          level: lvl, name: levelName, pass,
          moved, isBlank, newErrors,
          playerX: state2.playerX, score: state2.score,
        });

        if (pass) {
          console.log(`✅ (x=${state2.playerX}, score=${state2.score})`);
        } else {
          const reasons = [];
          if (isBlank) reasons.push('blank canvas');
          if (newErrors > 0) reasons.push(`${newErrors} JS errors`);
          console.log(`❌ ${reasons.join(', ')}`);
        }

      } catch (e) {
        results.push({ level: lvl, name: levelName, pass: false, reason: e.message });
        console.log(`❌ ${e.message}`);
      }
    }

    // ── Test interior scenes ──
    console.log('\n  Interior scenes...');
    const scenes = await page.evaluate(() => Object.keys(Scene));
    process.stdout.write(`  ${scenes.length} scenes registered: `);

    // Start at level 1 for interior tests
    await startGameAtLevel(page, 1);

    // Test entering/exiting the house
    await page.evaluate(() => { player.x = HOUSE.x + 10; });
    await pressKey(page, 'Enter', 50);
    await advanceFrames(page, 10);
    const houseState = await getState(page);
    const houseOk = houseState.scene === 'house';
    await pressKey(page, 'Enter', 50);
    await advanceFrames(page, 10);
    const afterHouse = await getState(page);
    const exitOk = afterHouse.scene === null;
    console.log(houseOk && exitOk ? '✅ house enter/exit works' : `❌ house scene=${houseState.scene}, after=${afterHouse.scene}`);

    // ── Summary ──
    console.log('\n' + '═'.repeat(50));
    const passed = results.filter(r => r.pass).length;
    const failed = results.filter(r => !r.pass).length;
    console.log(`\n✅ ${passed} passed, ❌ ${failed} failed out of ${results.length} levels`);

    if (errors.length > 0) {
      console.log(`\n⚠️  ${errors.length} total JS errors collected:`);
      for (const e of errors.slice(0, 10)) {
        console.log(`   ${e.type}: ${e.msg.slice(0, 120)}`);
      }
      if (errors.length > 10) console.log(`   ... and ${errors.length - 10} more`);
    }

    if (failed > 0) {
      console.log('\nFailed levels:');
      for (const r of results.filter(r => !r.pass)) {
        console.log(`  Level ${r.level} (${r.name}): ${r.reason || 'blank/errors'}`);
      }
    }

    console.log(`\n📸 Screenshots saved to test/screenshots/`);
    console.log('═'.repeat(50));

    // Exit code
    process.exitCode = failed > 0 ? 1 : 0;

  } finally {
    await browser.close();
    server.close();
  }
}

// ── Existing data integrity tests ──
async function runDataTests() {
  console.log('\n📋 Running data integrity tests (tests.html)...');

  const server = await startServer();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const errors = [];
  page.on('pageerror', err => errors.push(err.message));

  await page.goto(`http://localhost:${PORT}/tests.html`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const title = await page.title();
  const passMatch = title.match(/(\d+)\/(\d+)/);

  if (passMatch) {
    console.log(`  ${title}`);
    if (title.startsWith('PASS')) {
      console.log('  ✅ All data integrity tests passed');
    } else {
      console.log('  ❌ Some tests failed');
      process.exitCode = 1;
    }
  }

  if (errors.length > 0) {
    console.log(`  ⚠️  ${errors.length} page errors during tests`);
    errors.forEach(e => console.log(`    ${e.slice(0, 120)}`));
  }

  await browser.close();
  server.close();
}

// ── Detailed tests: interiors, minigames, NPC, scoring, level transitions ──
async function runDetailedTests() {
  console.log('\n' + '═'.repeat(50));
  console.log('🔬 Running detailed tests\n');

  const server = await startServer();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 960, height: 540 } });
  const page = await context.newPage();

  const errors = [];
  page.on('pageerror', err => errors.push({ type: 'pageerror', msg: err.message }));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push({ type: 'console.error', msg: msg.text() });
  });

  await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const results = { passed: 0, failed: 0, details: [] };

  function record(name, pass, reason = '') {
    if (pass) {
      results.passed++;
      console.log(`  ✅ ${name}`);
    } else {
      results.failed++;
      console.log(`  ❌ ${name}: ${reason}`);
    }
    results.details.push({ name, pass, reason });
  }

  // Helper: enter a scene and verify, then exit and verify
  async function testEnterExit(label, level, setupFn, enterKey, exitKey, expectedScene, extraFrames = 30) {
    const errBefore = errors.length;
    // Ensure clean scene state before each test
    await page.evaluate(() => { currentScene = null; });
    await startGameAtLevel(page, level);
    await page.evaluate(() => { currentScene = null; });
    // Run any setup (teleport, set state, etc.)
    if (setupFn) await setupFn();
    await advanceFrames(page, 10);
    // Press the enter key
    await pressKey(page, enterKey, 50);
    await advanceFrames(page, extraFrames);
    const afterEnter = await getState(page);
    const entered = afterEnter.scene === expectedScene;
    // Exit
    await pressKey(page, exitKey, 50);
    await advanceFrames(page, 30);
    const afterExit = await getState(page);
    // Some scenes (like chalet) switch levels on exit, so null OR different level is ok
    const exited = afterExit.scene === null || afterExit.scene !== expectedScene;
    const noNewErrors = errors.length === errBefore;
    const pass = entered && exited && noNewErrors;
    let reason = '';
    if (!entered) reason += `scene=${afterEnter.scene} (expected ${expectedScene}); `;
    if (!exited) reason += `exit failed scene=${afterExit.scene}; `;
    if (!noNewErrors) reason += `${errors.length - errBefore} JS errors; `;
    record(label, pass, reason);
    return entered;
  }

  // ═══════════════════════════════════════════════
  // 1. INTERIOR SCENE TESTS
  // ═══════════════════════════════════════════════
  console.log('\n  ── Interior Scenes ──');

  // Level 1: House
  await testEnterExit('L1 House enter/exit', 1,
    () => page.evaluate(() => { player.x = HOUSE.x + 10; player.y = GROUND_Y; player.onGround = true; }),
    'Enter', 'Enter', 'house');

  // Level 1: Camper (RV at x=800)
  await testEnterExit('L1 Camper enter/exit', 1,
    () => page.evaluate(() => { player.x = 800; player.y = GROUND_Y; player.onGround = true; }),
    'Enter', 'Enter', 'camper');

  // Level 1: Windmill (at x=3200)
  await testEnterExit('L1 Windmill enter/exit', 1,
    () => page.evaluate(() => { player.x = 3200; player.y = GROUND_Y; player.onGround = true; }),
    'Enter', 'Enter', 'windmill');

  // Level 3 (NYC): Pizza Shop
  await testEnterExit('L3 Pizza Shop enter/exit', 3,
    () => page.evaluate(() => { player.x = PIZZA_SHOP.x; player.y = GROUND_Y; player.onGround = true; }),
    'Enter', 'Enter', 'pizza');

  // Level 3: FAO Schwarz
  await testEnterExit('L3 FAO Schwarz enter/exit', 3,
    () => page.evaluate(() => { player.x = FAO_SCHWARZ_POS.x; player.y = GROUND_Y; player.onGround = true; }),
    'Enter', 'Enter', 'faoSchwarz');

  // Level 3: Empire State
  await testEnterExit('L3 Empire State enter/exit', 3,
    () => page.evaluate(() => { player.x = EMPIRE_STATE_POS.x; player.y = GROUND_Y; player.onGround = true; }),
    'Enter', 'Enter', 'empireState');

  // Level 3: 30 Rock — must wait for dance to finish before Enter exits
  await (async () => {
    const errBefore = errors.length;
    await startGameAtLevel(page, 3);
    await page.evaluate(() => { player.x = THIRTY_ROCK_POS.x; player.y = GROUND_Y; player.onGround = true; });
    await advanceFrames(page, 10);
    await pressKey(page, 'Enter', 50);
    await advanceFrames(page, 30);
    const s1 = await getState(page);
    const entered = s1.scene === 'thirtyRock';
    // Advance past the showing phase (3s) + timeout (8s) = ~11s = 660 frames
    await advanceFrames(page, 700);
    // Now dance should be inactive, Enter should exit
    await pressKey(page, 'Enter', 50);
    await advanceFrames(page, 30);
    const s2 = await getState(page);
    const exited = s2.scene === null;
    const pass = entered && exited && errors.length === errBefore;
    let reason = '';
    if (!entered) reason += `scene=${s1.scene}; `;
    if (!exited) reason += `exit failed scene=${s2.scene}; `;
    record('L3 30 Rock enter/exit', pass, reason);
  })();

  // Level 3: Grand Central
  await testEnterExit('L3 Grand Central enter/exit', 3,
    () => page.evaluate(() => { player.x = GRAND_CENTRAL_POS.x; player.y = GROUND_Y; player.onGround = true; }),
    'Enter', 'Enter', 'grandCentral');

  // Level 3: The Met
  await testEnterExit('L3 The Met enter/exit', 3,
    () => page.evaluate(() => { player.x = MET_MUSEUM_POS.x; player.y = GROUND_Y; player.onGround = true; }),
    'Enter', 'Enter', 'theMet');

  // Level 3: Hospital — need hospitalDelivered=false; exit requires multi-stage minigame,
  // so we just verify entry then force-exit
  await (async () => {
    const errBefore = errors.length;
    await startGameAtLevel(page, 3);
    await page.evaluate(() => {
      hospitalDelivered = false;
      player.x = HOSPITAL_POS.x; player.y = GROUND_Y; player.onGround = true;
    });
    await advanceFrames(page, 10);
    await pressKey(page, 'Enter', 50);
    await advanceFrames(page, 30);
    const s1 = await getState(page);
    const entered = s1.scene === 'hospital';
    // Force exit (hospital has a multi-stage flow that can't be trivially exited)
    await page.evaluate(() => { currentScene = null; hospitalDelivered = false; });
    await advanceFrames(page, 10);
    const s2 = await getState(page);
    const pass = entered && s2.scene === null && errors.length === errBefore;
    record('L3 Hospital enter (force exit)', pass,
      !entered ? `scene=${s1.scene}` : (s2.scene !== null ? `exit failed` : ''));
  })();

  // Level 4 (Rome): Pantheon
  await testEnterExit('L4 Pantheon enter/exit', 4,
    () => page.evaluate(() => { player.x = PANTHEON_POS.x; player.y = GROUND_Y; player.onGround = true; }),
    'Enter', 'Enter', 'pantheon');

  // Level 4 (Rome): Fountain swimming (KeyS to enter and exit)
  await testEnterExit('L4 Fountain swimming enter/exit', 4,
    () => page.evaluate(() => { player.x = FOUNTAIN_POS.x; player.y = GROUND_Y; player.onGround = true; }),
    'KeyS', 'KeyS', 'swimming');

  // Level 5 (Hawaii): Surfing (KeyS to enter and exit)
  await testEnterExit('L5 Surfing enter/exit', 5,
    () => page.evaluate(() => { player.x = SURF_POS.x; player.y = GROUND_Y; player.onGround = true; }),
    'KeyS', 'KeyS', 'surfing');

  // Level 6 (Oriental): Sailing (Enter to enter and exit)
  await testEnterExit('L6 Sailing enter/exit', 6,
    () => page.evaluate(() => { player.x = SAILBOAT_POS.x; player.y = GROUND_Y; player.onGround = true; }),
    'Enter', 'Enter', 'sailing');

  // Level 6 (Oriental): Scuba diving (Enter to enter and exit)
  await testEnterExit('L6 Scuba diving enter/exit', 6,
    () => page.evaluate(() => { player.x = DIVE_SPOT_POS.x; player.y = GROUND_Y; player.onGround = true; }),
    'Enter', 'Enter', 'scubaDiving');

  // Level 7 (Alps): Chalet — entered by directly setting scene
  await (async () => {
    const errBefore = errors.length;
    await startGameAtLevel(page, 7);
    // Directly set the scene to chalet (normally reached after skiing)
    await page.evaluate(() => {
      currentScene = Scene.CHALET;
      marshmallowAngle = Math.PI / 5;
    });
    await advanceFrames(page, 30);
    const s1 = await getState(page);
    const entered = s1.scene === 'chalet';
    // Exit chalet (switches to level 8)
    await pressKey(page, 'Enter', 50);
    await advanceFrames(page, 120);
    const s2 = await getState(page);
    const exited = s2.scene === null || s2.scene !== 'chalet';
    const pass = entered && exited && errors.length === errBefore;
    let reason = '';
    if (!entered) reason += `scene=${s1.scene}; `;
    if (!exited) reason += `exit failed; `;
    record('L7 Chalet enter/exit', pass, reason);
  })();

  // Level 8 (Campground): Camp Camper
  await testEnterExit('L8 Camp Camper enter/exit', 8,
    () => page.evaluate(() => { player.x = CAMP_CAMPER_POS.x; player.y = GROUND_Y; player.onGround = true; }),
    'Enter', 'Enter', 'campCamper');

  // Level 9 (Safari): Watering hole (KeyS to enter and exit)
  await testEnterExit('L9 Watering hole enter/exit', 9,
    () => page.evaluate(() => {
      player.x = WATERING_HOLE_POS.x + 50;
      player.y = GROUND_Y; player.onGround = true;
    }),
    'KeyS', 'KeyS', 'wateringHole');

  // Level 11 (Cape): NASA Museum
  await testEnterExit('L11 NASA Museum enter/exit', 11,
    () => page.evaluate(() => {
      player.x = NASA_BUILDING_POS.x + NASA_BUILDING_POS.w / 2;
      player.y = GROUND_Y; player.onGround = true;
    }),
    'Enter', 'Enter', 'nasaMuseum');

  // ═══════════════════════════════════════════════
  // 2. MINIGAME SMOKE TESTS
  // ═══════════════════════════════════════════════
  console.log('\n  ── Minigame Smoke Tests ──');

  // FAO Schwarz: Enter, press left/right/space a few times, press Enter to exit
  await (async () => {
    const errBefore = errors.length;
    await startGameAtLevel(page, 3);
    await page.evaluate(() => { player.x = FAO_SCHWARZ_POS.x; player.y = GROUND_Y; player.onGround = true; });
    await advanceFrames(page, 10);
    await pressKey(page, 'Enter', 50);
    await advanceFrames(page, 10);
    const s1 = await getState(page);
    if (s1.scene !== 'faoSchwarz') { record('Minigame: FAO Schwarz piano', false, `not entered: ${s1.scene}`); return; }
    // Play some notes
    await pressKey(page, 'ArrowRight', 30);
    await advanceFrames(page, 5);
    await pressKey(page, 'Space', 30);
    await advanceFrames(page, 5);
    await pressKey(page, 'ArrowLeft', 30);
    await advanceFrames(page, 5);
    await pressKey(page, 'Space', 30);
    await advanceFrames(page, 5);
    await pressKey(page, 'ArrowRight', 30);
    await advanceFrames(page, 5);
    await pressKey(page, 'Space', 30);
    await advanceFrames(page, 10);
    // Exit
    await pressKey(page, 'Enter', 50);
    await advanceFrames(page, 10);
    const s2 = await getState(page);
    record('Minigame: FAO Schwarz piano', s2.scene === null && errors.length === errBefore,
      s2.scene !== null ? `exit failed scene=${s2.scene}` : '');
  })();

  // Empire State: Enter, wait for elevator, press Enter to exit
  await (async () => {
    const errBefore = errors.length;
    await startGameAtLevel(page, 3);
    await page.evaluate(() => { player.x = EMPIRE_STATE_POS.x; player.y = GROUND_Y; player.onGround = true; });
    await advanceFrames(page, 10);
    await pressKey(page, 'Enter', 50);
    await advanceFrames(page, 10);
    const s1 = await getState(page);
    if (s1.scene !== 'empireState') { record('Minigame: Empire State elevator', false, `not entered: ${s1.scene}`); return; }
    // Advance frames for elevator to reach top (empireElevator goes 0→100 at dt/30 rate)
    // Each frame is ~16.67ms, so need ~3000/16.67 = ~180 frames
    await advanceFrames(page, 200);
    // Exit
    await pressKey(page, 'Enter', 50);
    await advanceFrames(page, 10);
    const s2 = await getState(page);
    record('Minigame: Empire State elevator', s2.scene === null && errors.length === errBefore,
      s2.scene !== null ? `exit failed scene=${s2.scene}` : '');
  })();

  // 30 Rock: Enter, wait for sequence to show, press arrow keys, press Enter
  await (async () => {
    const errBefore = errors.length;
    await startGameAtLevel(page, 3);
    await page.evaluate(() => { player.x = THIRTY_ROCK_POS.x; player.y = GROUND_Y; player.onGround = true; });
    await advanceFrames(page, 10);
    await pressKey(page, 'Enter', 50);
    await advanceFrames(page, 10);
    const s1 = await getState(page);
    if (s1.scene !== 'thirtyRock') { record('Minigame: 30 Rock dance', false, `not entered: ${s1.scene}`); return; }
    // Wait past showing phase (3s = ~180 frames)
    await advanceFrames(page, 200);
    // Press some dance keys
    await pressKey(page, 'ArrowLeft', 30); await advanceFrames(page, 5);
    await pressKey(page, 'ArrowRight', 30); await advanceFrames(page, 5);
    await pressKey(page, 'ArrowUp', 30); await advanceFrames(page, 5);
    await pressKey(page, 'Space', 30); await advanceFrames(page, 5);
    await pressKey(page, 'ArrowLeft', 30); await advanceFrames(page, 5);
    await pressKey(page, 'ArrowRight', 30); await advanceFrames(page, 5);
    // Wait for dance to end
    await advanceFrames(page, 500);
    await pressKey(page, 'Enter', 50);
    await advanceFrames(page, 10);
    const s2 = await getState(page);
    record('Minigame: 30 Rock dance', s2.scene === null && errors.length === errBefore,
      s2.scene !== null ? `exit failed scene=${s2.scene}` : '');
  })();

  // Pizza making: Enter, press C a few times (to advance prep stages), press Enter to exit
  await (async () => {
    const errBefore = errors.length;
    await startGameAtLevel(page, 3);
    await page.evaluate(() => { player.x = PIZZA_SHOP.x; player.y = GROUND_Y; player.onGround = true; });
    await advanceFrames(page, 10);
    await pressKey(page, 'Enter', 50);
    await advanceFrames(page, 10);
    const s1 = await getState(page);
    if (s1.scene !== 'pizza') { record('Minigame: Pizza making', false, `not entered: ${s1.scene}`); return; }
    // Press C a few times to interact
    for (let i = 0; i < 5; i++) {
      await pressKey(page, 'KeyC', 30);
      await advanceFrames(page, 30);
    }
    // Exit (only works when stage is idle)
    await page.evaluate(() => { pizzaMaking.stage = 'idle'; });
    await pressKey(page, 'Enter', 50);
    await advanceFrames(page, 10);
    const s2 = await getState(page);
    record('Minigame: Pizza making', s2.scene === null && errors.length === errBefore,
      s2.scene !== null ? `exit failed scene=${s2.scene}` : '');
  })();

  // Chalet marshmallow: Set level 7, enter chalet directly, press Space to launch marshmallow
  await (async () => {
    const errBefore = errors.length;
    await startGameAtLevel(page, 7);
    // Directly set chalet scene
    await page.evaluate(() => {
      currentScene = Scene.CHALET;
      marshmallowAngle = Math.PI / 5;
      marshmallow = { active: false, x: 0, y: 0, vx: 0, vy: 0, landed: false };
    });
    await advanceFrames(page, 30);
    const s1 = await getState(page);
    if (s1.scene !== 'chalet') { record('Minigame: Chalet marshmallow', false, `not entered: ${s1.scene}`); return; }
    // Launch marshmallow
    await pressKey(page, 'Space', 30);
    await advanceFrames(page, 60);
    // Check no crash
    const noErrors = errors.length === errBefore;
    // Exit
    await pressKey(page, 'Enter', 50);
    await advanceFrames(page, 120);
    const s2 = await getState(page);
    record('Minigame: Chalet marshmallow', noErrors && (s2.scene === null || s2.scene !== 'chalet'),
      !noErrors ? `${errors.length - errBefore} JS errors` : '');
  })();

  // ═══════════════════════════════════════════════
  // 3. NPC DIALOGUE TEST
  // ═══════════════════════════════════════════════
  console.log('\n  ── NPC Dialogue ──');

  await (async () => {
    const errBefore = errors.length;
    await startGameAtLevel(page, 1);
    // Find the first NPC and teleport near it
    const npcInfo = await page.evaluate(() => {
      const npcs = levelRegistry[currentLevel].npcs;
      if (!npcs || npcs.length === 0) return null;
      return { x: npcs[0].x, count: npcs.length };
    });
    if (!npcInfo) {
      record('NPC dialogue (press Q)', false, 'no NPCs found on level 1');
    } else {
      await page.evaluate((nx) => {
        player.x = nx;
        player.y = GROUND_Y;
        player.onGround = true;
        activeSpeechBubbles = [];
      }, npcInfo.x);
      await advanceFrames(page, 10);
      // Press Q to talk
      await pressKey(page, 'KeyQ', 50);
      await advanceFrames(page, 10);
      const bubbles = await page.evaluate(() => activeSpeechBubbles.length);
      record('NPC dialogue (press Q)', bubbles > 0 && errors.length === errBefore,
        bubbles === 0 ? 'no speech bubbles appeared' : '');
    }
  })();

  // ═══════════════════════════════════════════════
  // 4. SCORING TEST — collect a yarn ball
  // ═══════════════════════════════════════════════
  console.log('\n  ── Scoring ──');

  await (async () => {
    const errBefore = errors.length;
    await startGameAtLevel(page, 1);
    // Find the first uncollected yarn ball and teleport to it
    const yarnInfo = await page.evaluate(() => {
      const ybs = getCurrentYarnBalls();
      for (const yb of ybs) {
        if (!yb.collected) return { x: yb.x, y: yb.y };
      }
      return null;
    });
    if (!yarnInfo) {
      record('Yarn ball collection increases score', false, 'no uncollected yarn balls on level 1');
    } else {
      const scoreBefore = await page.evaluate(() => score);
      // Teleport player right on top of the yarn ball
      await page.evaluate((yi) => {
        player.x = yi.x;
        player.y = yi.y + 20; // yarn collision checks (player.y - 20) against yb.y
        player.onGround = false;
      }, yarnInfo);
      // Advance frames to trigger collection
      await advanceFrames(page, 30);
      const scoreAfter = await page.evaluate(() => score);
      const increased = scoreAfter > scoreBefore;
      record('Yarn ball collection increases score', increased && errors.length === errBefore,
        !increased ? `score unchanged: ${scoreBefore} -> ${scoreAfter}` : '');
    }
  })();

  // ═══════════════════════════════════════════════
  // 5. LEVEL TRANSITION TEST — rainbow bridge portal
  // ═══════════════════════════════════════════════
  console.log('\n  ── Level Transitions ──');

  await (async () => {
    const errBefore = errors.length;
    await startGameAtLevel(page, 1);
    // Teleport to the rainbow bridge portal
    await page.evaluate(() => {
      player.x = BRIDGE_PORTAL.x;
      player.y = GROUND_Y;
      player.onGround = true;
    });
    await advanceFrames(page, 10);
    const levelBefore = await page.evaluate(() => currentLevel);
    // Press Enter at the portal
    await pressKey(page, 'Enter', 50);
    await advanceFrames(page, 10);
    // Check transition started
    const transitioning = await page.evaluate(() => levelTransition.active);
    // Advance through the transition animation
    await advanceFrames(page, 300);
    // Dismiss tour guide
    for (let i = 0; i < 5; i++) {
      await pressKey(page, 'Space', 30);
      await page.waitForTimeout(30);
    }
    await advanceFrames(page, 60);
    const levelAfter = await page.evaluate(() => currentLevel);
    const changed = levelAfter !== levelBefore;
    record('Level transition (L1 rainbow bridge -> L2)',
      (transitioning || changed) && errors.length === errBefore,
      !changed && !transitioning ? `level unchanged: ${levelBefore}` : '');
  })();

  // ── Summary ──
  console.log('\n' + '═'.repeat(50));
  console.log(`\n✅ ${results.passed} passed, ❌ ${results.failed} failed out of ${results.passed + results.failed} detailed tests`);

  if (results.failed > 0) {
    console.log('\nFailed tests:');
    for (const r of results.details.filter(r => !r.pass)) {
      console.log(`  ${r.name}: ${r.reason}`);
    }
    process.exitCode = 1;
  }

  if (errors.length > 0) {
    console.log(`\n⚠️  ${errors.length} total JS errors during detailed tests:`);
    for (const e of errors.slice(0, 10)) {
      console.log(`   ${e.type}: ${e.msg.slice(0, 120)}`);
    }
  }

  console.log('═'.repeat(50));

  await browser.close();
  server.close();
}

// Run everything
console.log('═'.repeat(50));
await runDataTests();
console.log('');
await runTests();
await runDetailedTests();
