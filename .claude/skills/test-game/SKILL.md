---
name: test-game
description: Run the Unikittyville game test harness. Uses Playwright headless Chromium to load the game, validate all levels, test interiors/minigames, capture screenshots, and report any JS errors. Use after making code changes to verify nothing is broken.
allowed-tools: Read, Bash, Grep, Glob
argument-hint: "[quick|full|level N|screenshot N]"
---

# Test Game — Unikittyville Test Harness

Run the Playwright-based test harness to validate the game works correctly.

## How to Run

### Quick smoke test (all levels, ~15 seconds)
```bash
cd /Users/dave/Development/unikittyville/test && node smoke.mjs
```

### What the harness validates
1. **Data integrity tests** (tests.html) — 1700+ assertions on level data, platforms, NPCs, dialogues
2. **Level smoke tests** — All 13 levels load, player moves, canvas renders, no JS errors
3. **Interior scene tests** — Enter/exit buildings across all levels
4. **Minigame tests** — FAO piano, Empire State elevator, 30 Rock dance, pizza making
5. **NPC dialogue** — Talk to NPCs, verify speech bubbles appear
6. **Scoring** — Collect items, verify score increases
7. **Level transitions** — Navigate between levels

### Viewing screenshots
After running, screenshots are saved to `test/screenshots/`. Read them to visually inspect each level:
```
Read test/screenshots/level-1.png
Read test/screenshots/level-3.png
```

### Testing a specific level
To test just one level visually, run the harness and then read that level's screenshot.

### Prerequisites
If not yet installed:
```bash
cd /Users/dave/Development/unikittyville/test
npm install
npx playwright install chromium
```

## Interpreting Results

- **PASS** with green checkmarks = everything works
- **FAIL** with red X = check the error messages and screenshots
- **JS errors** = collected from the browser console, indicates real bugs
- **Blank canvas** = level rendering is broken
- **Player didn't move** = input or physics broken for that level

## When to Run

- After modifying game.js, drawing.js, levels.js, interiors.js, ui.js, or physics.js
- Before deploying to the live site
- After merging PRs from other agents
- When the user reports a visual bug (check the screenshot)

## Output Format

```
✅ Level 1 (Meadow)... ✅ (x=244, score=0)
❌ Level 7 (Alps)... ❌ blank canvas
```

Each level shows: pass/fail, player x position, and score.
