# Unikittyville

A browser-based 2D side-scrolling adventure where unicorn kitties explore the world, collect items, and play mini-games. Built entirely with HTML5 Canvas and vanilla JavaScript — no frameworks, no build tools, just one `index.html`.

**Play it now:** [norahtashner.com/games/unikittyville](https://norahtashner.com/games/unikittyville/)

![Start Screen](docs/screenshots/start-screen.png)

## Levels

### Level 1: Meadow

Fish in the pond, cook bacon on the grill, collect yarn balls from floating platforms, and visit the beehive for honey. A day/night cycle paints the sky as you explore. Enter the house, camper, or windmill for cozy interior scenes.

![Meadow - Pond](docs/screenshots/level1-pond.png)
![Meadow - Farm](docs/screenshots/level1-meadow.png)

| Key | Action | Where |
|-----|--------|-------|
| F | Fish | In pond |
| C | Cook bacon | Near grill |
| H | Collect honey | Near beehive |
| Enter | Enter building | Near House, Camper, or Windmill |

**Interiors:**
- **House** — cozy fireplace scene
- **Camper** — cook fish on stove (C), nap (N), answer phone (P), drink cocoa (D)
- **Windmill** — explore gears and grindstone

**Collectibles:** Fish, Bacon, Honey, Yarn Balls

### Level 2: Sledding

Auto-scrolling downhill sled run. Dodge snowmen and trees, jump over obstacles, and collect snowballs. Catch the train at the end to head to the city.

![Sledding](docs/screenshots/level2-sledding.png)

| Key | Action |
|-----|--------|
| ←→ | Steer left/right |
| Space | Jump over obstacles |

**Collectibles:** Snowballs

### Level 3: NYC

Explore the city skyline with skyscrapers, taxis, and fire escapes. Make pizza in the pizza shop, grab hot dogs from street vendors, and stroll through Central Park.

![NYC](docs/screenshots/level3-nyc.png)

| Key | Action | Where |
|-----|--------|-------|
| C | Buy hot dog | Near hot dog carts |
| Enter | Enter Pizza Shop | Near shop door |
| C | Make/take pizza | Inside Pizza Shop (dough → toppings → bake) |
| Enter | Enter Central Park | Near park gate |
| S | Swim in fountain | Inside Central Park |

**Collectibles:** Hot Dogs, Pizza, Yarn Balls

### Level 4: Rome

Walk the cobblestone streets past the Colosseum and Pantheon. Splash in fountains, grab gelato, and catch a Fiat to your next destination.

![Rome](docs/screenshots/level4-rome.png)

| Key | Action | Where |
|-----|--------|-------|
| G | Buy gelato | Near gelato carts |
| S | Swim in fountain | Near fountain |
| Enter | Enter Pantheon | Near door |
| Enter | Enter Fiat | Near car → travels to Hawaii |

**Collectibles:** Gelato, Yarn Balls

### Level 5: Hawaii

Hit the beach with tiki torches, coconut palms, and ocean waves. Light torches, collect coconuts, and surf the waves beneath a volcano.

![Hawaii](docs/screenshots/level5-hawaii.png)

| Key | Action | Where |
|-----|--------|-------|
| T | Light tiki torch | Near torches |
| C | Collect coconut | Near coconut piles |
| S | Surf | Near surfboard |
| Enter | Enter airport | Travels to Alps |

**Collectibles:** Coconuts, Tiki Torches, Yarn Balls

### Level 6: Alps

Auto-scrolling ski downhill. Dodge pine trees, jump over cornices, and collect diamonds. Warm up in the chalet with a marshmallow-tossing mini-game.

![Alps](docs/screenshots/level6-alps.png)

| Key | Action | Where |
|-----|--------|-------|
| ←→ | Steer left/right | While skiing |
| Space | Jump over trees/cornices | While skiing |
| ↑↓ | Aim marshmallow | Inside Chalet |
| Space | Toss marshmallow | Inside Chalet |
| D | Drink cocoa | After landing 10 marshmallows |

**Collectibles:** Diamonds

### Level 7: Campground

Set up camp in the great outdoors. Collect sticks to build a campfire, roast marshmallows and make s'mores, relax in a hammock, share chocolate milk with Bigfoot, and dig a swimming pool.

| Key | Action | Where |
|-----|--------|-------|
| C | Collect sticks | Near stick piles |
| B | Build campfire | Near fire pit (need 5 sticks) |
| R | Roast marshmallow | Near lit campfire |
| C | Make s'more | After roasting marshmallow |
| N | Nap in hammock | Near hammock |
| M | Chocolate milk | Near Bigfoot |
| D | Dig pool | Near dig site |
| W | Fill pool | After digging (near water pump) |
| S | Swim in pool | After pool is filled |

**Collectibles:** Sticks, S'mores, Yarn Balls

## Controls

| Key | Action |
|-----|--------|
| Arrow Keys | Move left/right |
| Space | Jump |
| Enter | Enter/exit buildings, portals, vehicles |
| Q | Talk to NPCs |

Level-specific controls are shown in the tables above.

Touch controls with on-screen D-pad and action buttons are available on mobile devices. Tap the game to enter fullscreen mode on mobile.

## Bonus

Collect all the yarn balls in a level to earn a bonus! A celebration effect plays and you get extra points.

## Running Locally

```bash
# Serve with any static server
python3 -m http.server 8080
# Open http://localhost:8080
```

Audio files (MP3) live in `assets/music/` and `assets/sfx/`. WAV source files are in `assets/*/source/` and are not needed to run the game.

## Architecture

- **Single file:** All HTML, CSS, and JavaScript in one `index.html`
- **Rendering:** HTML5 Canvas with `requestAnimationFrame` game loop
- **Graphics:** Everything drawn with the Canvas API — no image assets
- **Audio:** MP3 files for background music (per-level tracks) and sound effects (meows, cha-ching)
- **Mobile:** Responsive canvas sizing, touch controls overlay, fullscreen mode, orientation detection
