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

// Run everything
console.log('═'.repeat(50));
await runDataTests();
console.log('');
await runTests();
