# Unikittyville - Session Summary

## Overview
Browser-based 2D side-scrolling game where unicorn kitties explore multiple levels, collect items, and complete mini-games. Single `index.html` file using HTML5 Canvas with vanilla JavaScript — no dependencies, no build tools.

## How to Run
```bash
cd .claude/worktrees/feat/mvp-game   # or wherever index.html lives
python3 -m http.server 8080
# Open http://localhost:8080/index.html
```

## Architecture
- **Single file:** `index.html` (~3500 lines) contains all HTML, CSS, and JS
- **Rendering:** HTML5 Canvas with `requestAnimationFrame` game loop
- **No external assets for graphics** — all characters, scenes, and UI are drawn with Canvas API
- **Audio:** MP3 files in `assets/` for music and sound effects (converted from WAV sources)

## Controls
| Key | Action |
|-----|--------|
| Arrow keys | Move |
| Space | Jump (plays random meow SFX, 3s cooldown) |
| Enter | Enter/exit buildings, portals, take taxis |
| F | Fish (in pond, Level 1) |
| C | Cook bacon (at grill, Level 1) / Make pizza (in pizza shop, Level 2) / Buy hot dog (Level 2) |
| S | Swim in fountain (Level 3) |
| G | Buy gelato (Level 3) |

## Levels

### Level 1: Meadow
- **World width:** 4800px
- **Features:** Pond with fish, grill for cooking bacon, a house you can enter, camper RVs, cacti
- **Background scenes:** Mushroom grove, flower garden, campfire, windmill, crystal cluster, beehive tree with animated bees, waterfall with mist, rainbow bridge
- **Portal:** Walk to the rainbow bridge at the far right, press Enter to go to NYC
- **Day/night cycle:** 30-second full cycle, rainbows appear at night

### Level 2: NYC
- **Features:** 30+ buildings with lit windows, fire escape platforms with railings
- **Interactions:**
  - Pizza shop — Enter to play pizza-making minigame (knead dough → add toppings → oven timing game, +25 pts for perfect)
  - Hot dog stands — Buy hot dogs for 10 points (press C)
  - Central Park — Enter for scenic interior (ducks, squirrels, butterflies)
  - Yellow taxis, fire hydrants, streetlamps, subway entrance, Statue of Liberty, pigeon flocks
- **Portal:** Press Enter near any taxi to travel to Rome

### Level 3: Rome
- **Features:** Cobblestone streets, warm Mediterranean sky
- **Landmarks:** Colosseum, Pantheon (enterable interior with dome/oculus), Leaning Tower of Pisa, Trevi-style fountain, Roman columns, piazzas with obelisks
- **Interactions:**
  - Fountain swimming — Press S to splash in the fountain
  - Gelato carts — Press G for gelato (+5 pts)
  - Pantheon interior — Press Enter to explore (dome with oculus, sunbeam, coffers, statues)
  - Vespas, olive trees, pasta shops
- **Portal:** NOT YET IMPLEMENTED — User requested Fiat → Hawaii level

## Game Mechanics
- **Scoring:** Fish (+10), Bacon (+15), Yarn balls (+20), Pizza (+25), Gelato (+5), Hot dogs (-10 to buy)
- **Platforms:** Purple/metallic/stone floating platforms with yarn balls on higher ones
- **NPCs:** 4 unicorn kitties per level with different colors and accessories (bow, scarf, glasses, flower)
- **HUD:** Level name, player name, score, fish/bacon/yarn/pizza/hot dog/gelato counters
- **Sound effects:** Meow on jump (2 variants, 3s cooldown), cha-ching on scoring (2s cooldown), background music loop

## Audio Assets
| File | Purpose |
|------|---------|
| `assets/music/theme.mp3` | Background music (loops from start screen) |
| `assets/sfx/kitty-meow-01.mp3` | Jump SFX variant 1 |
| `assets/sfx/kitty-meow-02.mp3` | Jump SFX variant 2 |
| `assets/sfx/cha-ching.mp3` | Scoring SFX |
| `assets/*/source/*.wav` | Original WAV source files |

## Known Issues / Bugs Fixed
- Platforms were not solid (kitty fell through) — fixed by checking platform collision before ground collision
- Interior scenes (Central Park, pizza shop) rendered off-screen in Level 2 — fixed by using `cam + W/2` for centering instead of `player.x`

## Pending Work (User Requested)
1. **Fiat car in Rome → Hawaii level** — User wants to take a Fiat to Level 4
2. **Hawaii level** — Drive a boat from island to island collecting tiki torches
3. **Art asset generation** — Beads stories contain AI art prompts for generating real artwork (see `bd list` when beads server is running)
4. **Character creation screen** — Future: LLM-integrated character designer (from original spec)

## Beads Backlog
Epic: `unikittyville-ed0` — MVP: Unicorn Kitty Game
- Stories created for: game world setup, player character, fishing, bacon cooking, house entry, HUD/scoring/NPCs
- Each story includes an AI art generation prompt in the body
- Beads server needs to be running to query (`bd list`)

## Branch Info
- **Branch:** `feat/mvp-game`
- **Worktree:** `.claude/worktrees/feat/mvp-game`
- **Base:** `main` (initial commit with spec + beads init)
- **Status:** Not yet merged, no PR created
