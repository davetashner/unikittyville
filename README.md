# Unikittyville

A browser-based 2D adventure where unicorn kitties explore the world across 13 levels, collect items, solve puzzles, and play minigames. Built entirely with HTML5 Canvas and vanilla JavaScript — no frameworks, no build tools.

**Play it now:** [norahtashner.com/games/unikittyville](https://norahtashner.com/games/unikittyville/)

## Levels

### Level 1: Meadow
Fish in the pond, cook bacon on the grill, collect yarn balls from floating platforms, and visit the beehive for honey. A day/night cycle paints the sky as you explore. Enter the house, camper, or windmill for cozy interior scenes. Catch bugs with boolean logic in the Bug Catcher minigame.

### Level 2: Sledding
Terrain-following downhill sled run with rolling hills. Dodge snowmen and trees, jump over obstacles, and collect snowballs. Catch the train at the bottom — solve the Train Signal Puzzle with IF/THEN logic to depart.

### Level 3: NYC
Explore the city skyline with skyscrapers, taxis, and fire escapes. Enter famous buildings:
- **FAO Schwarz** — giant floor piano, play Twinkle Twinkle Little Star with real audio notes
- **Empire State Building** — elevator ride to the 102nd floor observation deck
- **30 Rock / NBC Studios** — dance sequence minigame on a lit stage
- **Grand Central Terminal** — star-painted ceiling, whispering gallery
- **The Met Museum** — 9 painted artworks in the style of famous artists (Claude Meownet, Vincent van Paw, etc.)
- **Hospital** — help deliver baby Kit in a multi-stage minigame
- **Pizza Shop** — make pizza from dough to oven
- **Central Park** — relax, swim in the fountain
- **Hot Dog Math** — coin counting minigame at hot dog stands

### Level 4: Rome
Walk the cobblestone streets past the Colosseum and Pantheon. Splash in fountains, grab gelato from the Gelateria Roma (fraction-matching minigame), and catch a Fiat to Hawaii. Explore the Pantheon architecture puzzle and transcribe ancient Roman scrolls.

### Level 5: Hawaii
Beach level with tiki torches, coconut palms, and ocean waves. Light torches, collect coconuts, and surf the waves beneath a volcano.

### Level 6: Oriental, NC
Explore the Sailing Capital of North Carolina. Sail the Neuse River, go scuba diving to meet the mercats and explore the USS Oriental shipwreck (with dive log timeline), and collect shells along the waterfront. Location-specific dialogue about blue crabs, the Intracoastal Waterway, and local fishing culture.

### Level 7: Alps
First-person downhill skiing/snowboarding. Choose your equipment (skis for precision, snowboard for wider turns), dodge trees rushing toward you in pseudo-3D perspective, and jump off cornices to collect diamond arcs. Warm up in the chalet with marshmallow tossing and hot cocoa.

### Level 8: Campground
Collect sticks, build a campfire, roast marshmallows and make s'mores, nap in a hammock, share chocolate milk with Bigfoot, dig and fill a swimming pool, and chat with the leprechaun. Campfire Light Show programming minigame and Campfire Story typing activity. Enter the camper to cook pasta, take a shower, or nap.

### Level 9: Africa Safari
Explore the savanna with elephants, rhinos, giraffes, cheetahs, and antelopes. Photograph wildlife (press P) and view your photos in the gallery (press V). Give yarn to the cheetah and ride it! Visit the watering hole to meet a friendly crocodile with life advice and adopt a shoulder parrot. Safari Field Journal for animal observations. Market haggling minigame.

### Level 10: Transatlantic Flight
Flying level from Africa to Cape Canaveral. Dodge seagulls, storms, and hurricanes while collecting rubies. Transcribe whale song radio transmissions. Land on the Cape Canaveral airstrip.

### Level 11: Cape Canaveral
Explore Kennedy Space Center. Visit the NASA Museum with aircraft hanging from the ceiling (Wright Flyer, X-15, Space Shuttle Discovery, Mercury capsule, SR-71 Blackbird). Put on a space suit (visible through remaining levels), fuel the rocket, and launch to space. Rocket Fuel Calculator and Mission Control typing minigames.

### Level 12: Space Flight
Flying level through space from Earth to the Moon. Dodge asteroids, collect star crystals, and encounter friendly aliens. Low-gravity movement with Earth shrinking behind you and the Moon growing ahead.

### Level 13: Moon
Low-gravity exploration of the lunar surface with bouncy jumping. Visit the Smoothie Shop, play TopGolf in low gravity, program the lunar rover, and write in the Captain's Log. Apollo landing site, craters, and Earth visible in the sky.

## Features

### Gameplay
- **13 levels** spanning meadows, mountains, cities, oceans, and outer space
- **30+ interior scenes** with unique visuals and activities
- **20+ minigames** including music, math, typing, logic, and physics puzzles
- **200+ NPC dialogues** with real-world facts about each location
- **Safari photo gallery** — photograph 4 animal species
- **Shoulder parrot** — name it at the watering hole and it follows you
- **Space suit** — put it on at Cape Canaveral and wear it through the Moon
- **Baby Kit stroller** — deliver a baby at the NYC hospital and push the stroller everywhere
- **Day/night cycle** with dynamic sky colors across all outdoor levels

### Educational Minigames
- **Bug Catcher** (Meadow) — boolean logic (AND, OR, NOT)
- **Hot Dog Math** (NYC) — coin counting
- **Gelato Fractions** (Rome) — fraction matching
- **Pantheon Puzzle** (Rome) — architecture engineering
- **Roman Scroll Transcription** (Rome) — typing practice
- **Train Signal Puzzle** (Sledding) — IF/THEN logic
- **Campfire Geometry** (Campground) — shape building
- **Campfire Light Show** (Campground) — sequence programming
- **Rocket Fuel Calculator** (Cape) — math operations
- **Mission Control Typing** (Cape) — typing speed
- **Rover Programming** (Moon) — command sequences
- **Whale Song Transcription** (Flight) — radio typing
- **Safari Market Haggling** (Safari) — budget math

### Writing & Creativity
- **Postcard Writer** — write and collect postcards at each level
- **Campfire Stories** — typing minigame around the campfire
- **Captain's Log** (Moon) — journal writing
- **Met Art Descriptions** (NYC) — descriptive writing about paintings
- **Safari Field Journal** — animal observation notes

### Progress Tracking
- **Time Capsules** — hidden historical artifacts in every level
- **Achievement Badges** — earned for completing activities
- **Learning Dashboard** — progress tracking from the start screen
- **Tour Guide Mode** — educational introductions to each level
- **Difficulty Tiers** — Easy, Medium, Hard selectable at start

## Controls

| Key | Action |
|-----|--------|
| Arrow Keys | Move left/right (up/down in scuba/flight) |
| Space | Jump (play note in FAO Schwarz) |
| Enter | Enter/exit buildings, portals, vehicles |
| Q | Talk to NPCs |

Level-specific controls appear in the control panel, which shows only commands available in the current level.

**Mobile:** Touch controls with 4-directional D-pad, jump button, and two context-sensitive action buttons. Auto-fullscreen and landscape orientation lock. Safe area insets for notched devices.

## Running Locally

```bash
# Serve with any static server
python3 -m http.server 8080
# Open http://localhost:8080
```

## Testing

### Playwright Test Harness

A comprehensive test suite using Playwright headless Chromium to validate the entire game:

```bash
cd test
npm install
npx playwright install chromium
node smoke.mjs
```

**What it tests:**
- **1,719 data integrity assertions** — level data, platforms, NPCs, dialogues, physics
- **13 level smoke tests** — each level loads, renders, accepts input, no JS errors
- **19 interior scene tests** — enter/exit every building across all levels
- **5 minigame tests** — FAO piano, Empire elevator, 30 Rock dance, pizza, marshmallow
- **NPC dialogue, scoring, and level transitions**
- **Screenshots** saved to `test/screenshots/` for visual inspection

Use the `/test-game` skill in Claude Code to run the harness.

### Data Integrity Tests

Open `tests.html` in a browser to run structural validation tests (platform reachability, NPC bounds, dialog coverage, etc.).

## Architecture

```
index.html      — HTML structure, CSS styles, audio elements
game.js         — game state, update loop, physics, all gameplay logic
drawing.js      — all canvas rendering, level registry, visual effects
levels.js       — level data (platforms, NPCs, dialogues, collectibles)
interiors.js    — interior scene rendering (30+ scenes)
ui.js           — input handling, HUD, touch controls, menus
physics.js      — extracted pure physics functions
tests.js        — data integrity test assertions
test/smoke.mjs  — Playwright headless game validation
```

- **Rendering:** HTML5 Canvas 2D with `requestAnimationFrame` game loop
- **Graphics:** Everything drawn with the Canvas API — no sprite sheets or image assets (except camper.png)
- **Audio:** MP3 files for background music (per-level) and 30+ sound effects
- **Mobile:** Responsive 16:9 canvas, touch D-pad, fullscreen, orientation lock, safe area insets
- **Deployment:** S3 + CloudFront via GitHub Actions CI/CD

## Claude Code Skills

| Skill | Description |
|-------|-------------|
| `/deploy` | Deploy game to norahtashner.com (sync code, upload audio to S3, push to trigger CI) |
| `/test-game` | Run the Playwright test harness to validate all levels and features |

## Backlog

Tracked with [Beads](https://github.com/mainstreetlogic/beads). Run `beads list --status open` to see current items.
