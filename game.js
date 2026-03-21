// ── Constants ──
const WORLD_W = 4800;
const GROUND_Y = 420;
const GRAVITY = 0.6;
const JUMP_VEL = -15;
const MOVE_SPEED = 4;
const DAY_LENGTH = 30000; // 30s full cycle

// ── Score awards ──
const POINTS = {
  FISH: 10, BACON: 15, YARN: 20, PIZZA: 25, HOTDOG_COST: 10,
  GELATO: 5, HONEY: 12, TIKI: 15, COCONUT: 10, DIAMOND: 25,
  SNOWBALL: 15, STICK: 5, CAMPFIRE_BUILD: 25, SMORE: 30,
  MARSHMALLOW_CHALET: 20, COCOA: 50, HAMMOCK_NAP: 20,
  BIGFOOT_MILK: 40, DIG_POOL: 15, FILL_POOL: 15, SHELL: 10,
  PEARL: 15, SCUBA_COMPLETE: 50, COOKED_FISH: 20,
  CAMPER_NAP: 10, PHONE_ANSWER: 5, CAMP_PASTA: 25,
  CAMP_SHOWER: 20, TREE_HIT: 10, SNOWMAN_HIT: 10,
  YARN_BONUS: 100, LEPRECHAUN_GOLD: 50,
  FRUIT: 10, ELEPHANT_BOOST: 15, RHINO_HIT: 15,
  SAFARI_PHOTO: 30, SAFARI_PHOTO_DUP: 5, SAFARI_COLLECTION: 100,
  CHEETAH_RIDE: 50, GIRAFFE_LIFT: 10,
};

// ── Timing durations (ms) ──
const TIMING = {
  COOK_READY: 3000, COOK_BURNT: 5000,
  CAMPER_COOK_READY: 2500, CAMPER_COOK_BURNT: 4500,
  NAP_DURATION: 3000, SHOWER_DURATION: 3000,
  PASTA_DURATION: 3000, COCOA_DRINK: 2500,
  ROAST_READY: 2000, ROAST_BURNT: 3500, ROAST_OVERBURN: 5000,
  DIG_DURATION: 3000, FILL_DURATION: 2500,
  PHONE_RING_MIN: 5000, SPEECH_BUBBLE_LIFE: 6000,
  POPUP_LIFE: 1500, LEVEL_TRANSITION: 1500,
  PIZZA_READY: 3000, PIZZA_BURNT: 4500, PIZZA_CHARRED: 6000,
};

// ── Interaction distances ──
const INTERACT_RANGE = 40;  // general proximity for interactions
const BUILDING_RANGE = 55;  // entering buildings
const COLLECT_RADIUS_SQ = 625; // 25px radius squared for collection

// Zone positions in world coords
const POND = { x: 200, w: 400, depth: 80 };
const GRILL = { x: 1000, w: 60 };
const HOUSE = { x: 1600, w: 160, h: 160 };

// ── Scene state machine ──
// Replaces 15 mutually exclusive booleans with a single enum value.
// null = outdoors/world view; any Scene value = that scene is active.
const Scene = {
  HOUSE: 'house',
  PIZZA: 'pizza',
  CAMPER: 'camper',
  WINDMILL: 'windmill',
  PARK: 'park',
  PANTHEON: 'pantheon',
  SWIMMING: 'swimming',
  SURFING: 'surfing',
  CHALET: 'chalet',
  SAILING: 'sailing',
  SCUBA_DIVING: 'scubaDiving',
  SWIMMING_IN_POOL: 'swimmingInPool',
  CAMP_CAMPER: 'campCamper',
  WATERING_HOLE: 'wateringHole',
};
let currentScene = null;

// ── State ──
let playerName = 'Sparkle';
let score = 0, fishCount = 0, baconCount = 0, yarnCount = 0;
let yarnBonusAwarded = {}; // tracks which levels have had the all-yarn bonus awarded
let gameTime = 0;
let camperPlayerX = 0; // player x position inside camper (relative to scene center)
let camperCooking = { active: false, progress: 0, burnt: false };
let camperNapping = false;
let camperNapTimer = 0;
const CAMPER_NAP_DURATION = 3000; // 3 seconds for a nap
let camperPhone = { ringing: false, answered: false, ringTimer: 0, callTimer: 0, dialogue: '' };
const CAMPER_PHONE_DIALOGUES = [
  "Hi, this is Sparkle's mom! Are you eating enough fish?",
  "HELLO?? We've been trying to reach you about your camper's extended warranty!",
  "Hey bestie! Did you see that rainbow last night? SO pretty!",
  "Meow meow meow? ...Sorry, wrong number.",
  "This is the Meadow Weather Service. Forecast: 100% chance of adventure!",
  "Hi! I found a yarn ball with your name on it. Want me to send it over?",
  "Pizza Palace here! Your order of 47 pizzas is on the way!",
  "Greetings from Rome! Wish you were here! The gelato is amazing!",
  "Hey, it's your neighbor. Can you keep the glitter down? It's everywhere!",
  "Aloha! Just calling to say the waves in Hawaii are PERFECT today!",
  "This is the Alps Ski Lodge. Your hot chocolate loyalty card is full!",
  "Hi, I'm a butterfly. I don't know how I'm using a phone. Bye!",
  "UNICORN FACTS HOTLINE: A unicorn's horn is actually called an alicorn!",
  "Hey, can you check if I left my scarf in the camper? It's pink with stars.",
  "Moo! ...I mean, meow! Totally a cat calling. Not a cow. Meow.",
];
let cooking = { active: false, progress: 0, burnt: false };
let fishing = { active: false, timer: 0, caught: false };
let honeyCount = 0;
let pizzaMaking = { active: false, progress: 0, stage: 'idle', pizzaCount: 0 };
const PIZZA_SHOP = { x: 1000, w: 80 };
let hotdogCount = 0;
const HOTDOG_POSITIONS = [600, 2000, 3400];
const CENTRAL_PARK_POS = { x: 2200, w: 160 };
const TAXI_POSITIONS = [300, 1200, 2400, 3600];
// Rome interactions
let gelatoCount = 0;
const FOUNTAIN_POS = { x: 1500 };
const GELATO_POSITIONS = [1000, 2800];
const PANTHEON_POS = { x: 2600 };
const FIAT_POS = { x: 4500 };
// Hawaii interactions
let tikiCount = 0;
let coconutCount = 0;
const TIKI_POSITIONS = [600, 1400, 2200, 3000, 3800];
const COCONUT_POSITIONS = [400, 1200, 2000, 2800, 3600, 4400];
const SURF_POS = { x: 1800 };
// Chalet mini-game
let marshmallow = { active: false, x: 0, y: 0, vx: 0, vy: 0, landed: false };
let marshmallowScore = 0;
let marshmallowAngle = Math.PI / 5; // aiming angle (radians), adjustable with Up/Down
const MARSHMALLOW_SPEED = 4.2;
const MARSHMALLOW_GRAVITY = 0.15;
let hotChocolate = { x: 0, y: 0 }; // computed each frame relative to scene center
let drinkingCocoa = false;
let cocoaDrinkTimer = 0;
const COCOA_DRINK_DURATION = 2500; // 2.5 seconds to drink
// Glitter horn effect
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let glitterParticles = [];
let lastGlitterScore = 0; // tracks the last 100-point milestone
// Sledding level
let sledding = false;
let snowballCount = 0;
const SLED_SPEED = 3.0;
// NPC dialogue system
const NPC_TALK_RANGE = 60;
let activeSpeechBubbles = []; // { npc, text, life }
const SLED_WORLD_W = 5000;

let popups = []; // floating score popups
let keys = {};
const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
let currentActionKey = null;
let currentActionLabel = '';
let currentAction2Key = null;
let currentAction2Label = '';
let lastMeowTime = 0;
let lastChaChingTime = 0;
let currentLevel = 1;
let levelTransition = { active: false, timer: 0, toLevel: 0 };
const meowSounds = [];
let chaChingSound = null;

function initMeows() {
  meowSounds.push(document.getElementById('meow1'));
  meowSounds.push(document.getElementById('meow2'));
  for (const m of meowSounds) m.volume = getSfxVolume();
  chaChingSound = document.getElementById('chaChing');
  chaChingSound.volume = getSfxVolume();
}

function playChaChing() {
  if (muted) return;
  const now = performance.now();
  if (now - lastChaChingTime < 2000) return;
  lastChaChingTime = now;
  chaChingSound.volume = getSfxVolume();
  chaChingSound.currentTime = 0;
  chaChingSound.play().catch(() => {});
}

function playMeow() {
  if (muted) return;
  const now = performance.now();
  if (now - lastMeowTime < 3000) return;
  lastMeowTime = now;
  const sound = meowSounds[Math.floor(Math.random() * meowSounds.length)];
  sound.volume = getSfxVolume();
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

// ── Generic SFX player ──
const sfxCooldowns = {};
function ensureLoaded(el) {
  if (el.readyState >= 2) return Promise.resolve();
  return new Promise(resolve => {
    el.load();
    el.addEventListener('canplay', resolve, { once: true });
  });
}

function playSfx(id, cooldownMs = 500) {
  if (muted) return;
  const now = performance.now();
  if (sfxCooldowns[id] && now - sfxCooldowns[id] < cooldownMs) return;
  sfxCooldowns[id] = now;
  const el = document.getElementById(id);
  if (!el) return;
  el.volume = getSfxVolume();
  el.currentTime = 0;
  ensureLoaded(el).then(() => el.play().catch(() => {}));
}

function startLoopSfx(id) {
  if (muted) return;
  const el = document.getElementById(id);
  if (!el || !el.paused) return;
  el.volume = getSfxVolume() * 0.5;
  ensureLoaded(el).then(() => el.play().catch(() => {}));
}

function stopLoopSfx(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.pause();
  el.currentTime = 0;
}

// ── Volume control ──
let masterVolume = 0.4; // 0..1
let muted = false;
let sliderHideTimer = null;

function getMusicVolume() { return muted ? 0 : masterVolume; }
const sfxRatio = 1.25; // sfx slightly louder than music
function getSfxVolume() { return muted ? 0 : Math.min(1, masterVolume * sfxRatio); }

// Wire up volume UI
const volBtn = document.getElementById('volumeBtn');
const sliderEl = document.getElementById('volumeSlider');
const sliderWrap = document.getElementById('volumeSliderWrap');
let volSliderOpen = false;

if (isMobile) {
  // On mobile: tap speaker icon to toggle slider visibility (no hover)
  volBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    volSliderOpen = !volSliderOpen;
    if (volSliderOpen) {
      sliderWrap.classList.add('visible');
      clearTimeout(sliderHideTimer);
      // Auto-hide after 4s of inactivity on mobile
      sliderHideTimer = setTimeout(() => {
        sliderWrap.classList.remove('visible');
        volSliderOpen = false;
      }, 4000);
    } else {
      sliderWrap.classList.remove('visible');
      clearTimeout(sliderHideTimer);
    }
  }, { passive: false });
  // Long-press speaker to toggle mute
  let volLongPress = null;
  volBtn.addEventListener('touchstart', () => {
    volLongPress = setTimeout(() => {
      muted = !muted;
      volBtn.innerHTML = muted ? '&#128263;' : '&#128264;';
      applyVolume();
    }, 500);
  }, { passive: true });
  volBtn.addEventListener('touchend', () => { clearTimeout(volLongPress); }, { passive: true });
  volBtn.addEventListener('touchcancel', () => { clearTimeout(volLongPress); }, { passive: true });
  // Keep slider open while interacting with it
  sliderWrap.addEventListener('touchstart', () => {
    clearTimeout(sliderHideTimer);
  }, { passive: true });
  sliderWrap.addEventListener('touchend', () => {
    sliderHideTimer = setTimeout(() => {
      sliderWrap.classList.remove('visible');
      volSliderOpen = false;
    }, 4000);
  }, { passive: true });
} else {
  // Desktop: click to toggle mute, hover to show slider
  volBtn.addEventListener('click', () => {
    muted = !muted;
    volBtn.innerHTML = muted ? '&#128263;' : '&#128264;';
    applyVolume();
    showSlider();
  });
  sliderWrap.addEventListener('mouseenter', () => { clearTimeout(sliderHideTimer); });
  sliderWrap.addEventListener('mouseleave', () => {
    sliderHideTimer = setTimeout(() => sliderWrap.classList.remove('visible'), 2000);
  });
}

sliderEl.addEventListener('input', () => {
  masterVolume = sliderEl.value / 100;
  if (masterVolume > 0) muted = false;
  volBtn.innerHTML = masterVolume === 0 ? '&#128263;' : '&#128264;';
  applyVolume();
  if (!isMobile) showSlider();
  else {
    // Reset auto-hide timer on interaction
    clearTimeout(sliderHideTimer);
    sliderHideTimer = setTimeout(() => {
      sliderWrap.classList.remove('visible');
      volSliderOpen = false;
    }, 4000);
  }
});

function showSlider() {
  sliderWrap.classList.add('visible');
  clearTimeout(sliderHideTimer);
  sliderHideTimer = setTimeout(() => sliderWrap.classList.remove('visible'), 2000);
}

function applyVolume() {
  const mv = getMusicVolume();
  // Update currently playing music
  if (currentMusicId) {
    document.getElementById(currentMusicId).volume = mv;
  }
  // Update SFX
  for (const m of meowSounds) m.volume = getSfxVolume();
  if (chaChingSound) chaChingSound.volume = getSfxVolume();
}

// ── Music system with crossfade ──
const FADE_DURATION = 1200; // ms
// levelMusic is now derived from levelRegistry (defined in drawing.js).
// These functions use levelRegistry[level].musicId for lookups.
const CHALET_MUSIC_ID = 'musicChalet';
const SCUBA_MUSIC_ID = 'musicScuba';
const FLIGHT_MUSIC_ID = 'musicFlight';
let currentMusicId = null;
let musicFade = null; // { out: AudioElement, in: AudioElement, timer: 0 }

function startLevelMusic(level) {
  const reg = levelRegistry[level];
  if (!reg || !reg.musicId) return;
  const id = reg.musicId;
  if (id === currentMusicId) return;
  const el = document.getElementById(id);
  if (!el) return; // audio element missing (e.g., no music file yet)
  el.volume = getMusicVolume();
  el.currentTime = 0;
  ensureLoaded(el).then(() => el.play().catch(() => {}));
  currentMusicId = id;
}

function crossfadeToLevel(level) {
  const newId = levelRegistry[level] && levelRegistry[level].musicId;
  if (!newId) return;
  crossfadeToMusic(newId);
}

function crossfadeToMusic(newId) {
  if (!newId || newId === currentMusicId) return;
  const outEl = currentMusicId ? document.getElementById(currentMusicId) : null;
  const inEl = document.getElementById(newId);
  if (!inEl) return; // audio element missing
  inEl.volume = 0;
  inEl.currentTime = 0;
  ensureLoaded(inEl).then(() => inEl.play().catch(() => {}));
  musicFade = { out: outEl, inEl: inEl, inId: newId, timer: 0 };
}

function updateMusicFade(dt) {
  if (!musicFade) return;
  const mv = getMusicVolume();
  musicFade.timer += dt;
  const t = Math.min(1, musicFade.timer / FADE_DURATION);
  if (musicFade.out) musicFade.out.volume = mv * (1 - t);
  musicFade.inEl.volume = mv * t;
  if (t >= 1) {
    if (musicFade.out) { musicFade.out.pause(); musicFade.out.currentTime = 0; }
    currentMusicId = musicFade.inId;
    musicFade = null;
  }
}

// Player
const player = {
  x: 600, y: GROUND_Y, vx: 0, vy: 0,
  w: 40, h: 48,
  onGround: true,
  facing: 1, // 1 right, -1 left
  walkFrame: 0, walkTimer: 0,
  color: '#e879f9' // pink-purple
};

function switchToLevel(lvl) {
  if (!levelRegistry[lvl]) {
    console.warn('switchToLevel: invalid level', lvl);
    return;
  }
  levelTransition.active = true;
  levelTransition.timer = 0;
  levelTransition.toLevel = lvl;
  crossfadeToLevel(lvl);
}

function completeTransition() {
  currentLevel = levelTransition.toLevel;
  levelTransition.active = false;
  player.x = 100;
  player.y = GROUND_Y;
  player.vy = 0;
  player.onGround = true;
  popups = [];
  cooking.active = false;
  fishing.active = false;
  currentScene = null;
  skiing = false;
  sledding = false;
  hammockNapping = false;
  hammockNapTimer = 0;
  bigfootDrinking = false;
  bigfootDrinkTimer = 0;
  roasting = { active: false, progress: 0, done: false };
  activeSpeechBubbles = [];
  pizzaMaking.stage = 'idle';
  pizzaMaking.progress = 0;
  camperPlayerX = 0;
  camperCooking = { active: false, progress: 0, burnt: false };
  camperNapping = false;
  camperNapTimer = 0;
  camperPhone = { ringing: false, answered: false, ringTimer: 0, callTimer: 0, dialogue: '' };
  drinkingCocoa = false;
  cocoaDrinkTimer = 0;
  campCamperPlayerX = 0;
  campCamperSleeping = false;
  campCamperSleepTimer = 0;
  campCamperPasta = { cooking: false, progress: 0, eaten: 0 };
  campCamperShowering = false;
  campCamperShowerTimer = 0;
  ridingCheetah = false;
  safariPhotography = { active: false, timer: 0, targetAnimal: '' };
  cheetahSpeech = { text: '', timer: 0 };
  dustParticles = [];
  // Stop any looping SFX from previous level
  stopLoopSfx('sfxSailWind');
  stopLoopSfx('sfxWaterLapping');
  stopLoopSfx('sfxBubblesSwim');
  stopLoopSfx('sfxCheetahSprint');
  stopLoopSfx('sfxGrassRustle');
  stopLoopSfx('sfxSavannaWind');
  stopLoopSfx('sfxFlightWind');
}

function getCurrentPlatforms() { return levelRegistry[currentLevel].platforms; }
function getCurrentYarnBalls() { return levelRegistry[currentLevel].yarnBalls; }
function getCurrentWorldW() { return levelRegistry[currentLevel].worldW; }

// ── Level 6: Oriental NC ──
let sailAngle = 0; // visual sail angle
const SAIL_SPEED = 3.5;
const ORIENTAL_WORLD_W = 5200;
const SAILBOAT_POS = { x: 4200 };
const DIVE_SPOT_POS = { x: 4800 };
let shellCount = 0;
// Scuba diving minigame
let scubaPlayer = { x: 200, y: 200, vx: 0, vy: 0 };
const SCUBA_WORLD_W = 1200;
const SCUBA_WORLD_H = 500;
const SCUBA_BUOYANCY = -0.04;
const SCUBA_SWIM_FORCE = 0.45;
const SCUBA_DRAG = 0.92;
let scubaCollectibles = [];
let scubaPearlCount = 0;
// Level select
let levelSelectUnlocked = true; // permanently unlocked for dev/debug
// LEVEL_NAMES and TOTAL_LEVELS are now derived from levelRegistry (defined in drawing.js)

// ── Level 7: Alps ──
// The Alps is a downhill skiing level — the kitty starts at the top-left
// and skis right/downhill, dodging trees, jumping cornices, collecting diamonds.
let skiing = false;
let diamondCount = 0;
let alpsScrollX = 0;
const ALPS_WORLD_W = 6000;
const ALPS_SPEED = 3.5; // auto-scroll speed while skiing

// ── Level 8: Campground ──
let stickCount = 0;
let smoreCount = 0;
let campfire = { built: false, lit: false };
let roasting = { active: false, progress: 0, done: false };
let hammockNapping = false;
let hammockNapTimer = 0;
const HAMMOCK_NAP_DURATION = 3000;
let bigfootDrinking = false;
let bigfootDrinkTimer = 0;
const BIGFOOT_DRINK_DURATION = 3000;
let campPool = { dug: false, filled: false, digging: false, digProgress: 0, filling: false, fillProgress: 0 };
let leprechaunGold = 0;
let leprechaunSpeech = { text: '', timer: 0 };
// Camp camper (end of campground level)
let campCamperPlayerX = 0;
let campCamperSleeping = false;
let campCamperSleepTimer = 0;
let campCamperPasta = { cooking: false, progress: 0, eaten: 0 };
let campCamperShowering = false;
let campCamperShowerTimer = 0;
const CAMP_CAMPER_POS = { x: 4700 };

// ── Level 8: Africa Safari ──
let fruitCount = 0;
let safariPhotoCount = 0;
let cheetahYarnGiven = 0;
let ridingCheetah = false;
let cheetahSpeech = { text: '', timer: 0 };
let safariPhotography = { active: false, timer: 0, targetAnimal: '' };
const SAFARI_PHOTO_DURATION = 1500; // 1.5s timing window
let safariPhotosTaken = { elephant: false, rhino: false, antelope: false, giraffe: false };
let dustParticles = []; // cheetah ride dust trail
const CHEETAH_SPEED = 6.5; // faster than normal 4px
const CHEETAH_YARN_MAGNET = 80; // auto-collect radius while riding
const SAFARI_JEEP_POS_GAME = { x: 5200 };

const CAMP_WORLD_W = 5000;
const FIRE_PIT_POS = { x: 1200 };
const STICK_POSITIONS = [400, 900, 1600, 2200, 2800, 3400, 4000, 4500];
const HAMMOCK_POS = { x: 2000 };
const BIGFOOT_POS = { x: 3000 };
const DIG_SITE_POS = { x: 3800 };
const WATER_PUMP_POS = { x: 4100 };


// ── Scuba diving mercats and collectibles ──
const scubaMercats = [
  { x: 300, y: 250, name: 'Coral', tailColor: '#f472b6', facing: 1, walkFrame: 0, walkTimer: 0, vx: 0, idleTimer: 100 },
  { x: 650, y: 150, name: 'Bubbles', tailColor: '#1e1b4b', facing: -1, walkFrame: 0, walkTimer: 0, vx: 0, idleTimer: 100 },
  { x: 950, y: 300, name: 'Marina', tailColor: '#38bdf8', facing: 1, walkFrame: 0, walkTimer: 0, vx: 0, idleTimer: 100 },
];

function initScubaCollectibles() {
  scubaCollectibles = [
    { x: 150, y: 150, type: 'Pearl', color: '#e9d5ff', collected: false },
    { x: 400, y: 300, type: 'Pearl', color: '#e9d5ff', collected: false },
    { x: 550, y: 100, type: 'Shell', color: '#fda4af', collected: false },
    { x: 700, y: 350, type: 'Pearl', color: '#e9d5ff', collected: false },
    { x: 850, y: 200, type: 'Shell', color: '#fda4af', collected: false },
    { x: 1050, y: 280, type: 'Pearl', color: '#e9d5ff', collected: false },
    { x: 200, y: 380, type: 'Shell', color: '#fda4af', collected: false },
    { x: 1100, y: 120, type: 'Pearl', color: '#e9d5ff', collected: false },
  ];
}
initScubaCollectibles();

// ── Canvas Setup ──
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
if (!ctx) { console.error('Failed to get canvas 2d context'); }
const campCamperImg = new Image();
let campCamperImgLoaded = false;
campCamperImg.onload = () => { campCamperImgLoaded = true; };
campCamperImg.src = 'assets/images/camper.png';

// ── Cached HUD elements (avoid per-frame getElementById) ──
const hud = {
  score: document.getElementById('hudScore'),
  fish: document.getElementById('hudFish'),
  bacon: document.getElementById('hudBacon'),
  yarn: document.getElementById('hudYarn'),
  pizza: document.getElementById('hudPizza'),
  hotdog: document.getElementById('hudHotdog'),
  gelato: document.getElementById('hudGelato'),
  honey: document.getElementById('hudHoney'),
  tiki: document.getElementById('hudTiki'),
  coconut: document.getElementById('hudCoconut'),
  diamond: document.getElementById('hudDiamond'),
  snowball: document.getElementById('hudSnowball'),
  stick: document.getElementById('hudStick'),
  smore: document.getElementById('hudSmore'),
  shell: document.getElementById('hudShell'),
  level: document.getElementById('hudLevel'),
  fruit: document.getElementById('hudFruit'),
  photo: document.getElementById('hudPhoto'),
  cheetahYarn: document.getElementById('hudCheetahYarn'),
  controls: document.getElementById('controls'),
};
const hudItems = document.querySelectorAll('.hud-item');
const ctrlItems = document.querySelectorAll('.ctrl-item');


// ── Game Loop ──
let lastTime = 0;
function loop(ts) {
  const dt = Math.min(ts - (lastTime || ts), 33);
  lastTime = ts;
  gameTime += dt;

  update(dt);
  draw();
  requestAnimationFrame(loop);
}

// ── Update ──
function update(dt) {
  updateMusicFade(dt);

  // Level transition animation
  if (levelTransition.active) {
    levelTransition.timer += dt;
    if (levelTransition.timer > TIMING.LEVEL_TRANSITION) {
      completeTransition();
    }
    return;
  }

  if (currentScene === Scene.CAMP_CAMPER) {
    // Sleeping in bed
    if (campCamperSleeping) {
      campCamperSleepTimer += dt;
      if (keys['KeyN']) {
        keys['KeyN'] = false;
        campCamperSleeping = false;
        const napSec = Math.floor(campCamperSleepTimer / 1000);
        const bonus = Math.min(50, napSec * 5);
        score += bonus;
        addPopup(player.x, player.y - 40, `+${bonus} Good sleep!`, '#a78bfa');
        playChaChing();
        campCamperSleepTimer = 0;
      }
      return;
    }
    // Showering
    if (campCamperShowering) {
      campCamperShowerTimer += dt;
      if (campCamperShowerTimer >= TIMING.SHOWER_DURATION) {
        campCamperShowering = false;
        campCamperShowerTimer = 0;
        score += POINTS.CAMP_SHOWER;
        addPopup(player.x, player.y - 40, '+' + POINTS.CAMP_SHOWER + ' So fresh!', '#38bdf8');
        playChaChing();
      }
      return;
    }
    // Walk around inside
    if (keys['ArrowLeft']) { campCamperPlayerX = Math.max(-160, campCamperPlayerX - 3); player.facing = -1; }
    if (keys['ArrowRight']) { campCamperPlayerX = Math.min(160, campCamperPlayerX + 3); player.facing = 1; }
    if (keys['ArrowLeft'] || keys['ArrowRight']) {
      player.walkTimer += dt;
      if (player.walkTimer > 120) { player.walkTimer = 0; player.walkFrame = (player.walkFrame + 1) % 4; }
    } else { player.walkFrame = 0; }
    // Sleep in bed (right side: x > 100, left side: x < -100)
    if ((campCamperPlayerX > 100 || campCamperPlayerX < -100) && keys['KeyN']) {
      keys['KeyN'] = false;
      campCamperSleeping = true;
      campCamperSleepTimer = 0;
    }
    // Fridge — get pasta (near center)
    if (Math.abs(campCamperPlayerX) < 30 && keys['KeyC'] && !campCamperPasta.cooking) {
      keys['KeyC'] = false;
      campCamperPasta.cooking = true;
      campCamperPasta.progress = 0;
    }
    if (campCamperPasta.cooking) {
      campCamperPasta.progress += dt;
      if (campCamperPasta.progress >= TIMING.PASTA_DURATION) {
        campCamperPasta.cooking = false;
        campCamperPasta.progress = 0;
        campCamperPasta.eaten++;
        score += POINTS.CAMP_PASTA;
        addPopup(player.x, player.y - 40, '+' + POINTS.CAMP_PASTA + ' Delicious pasta!', '#fbbf24');
        playChaChing();
      }
    }
    // Bathroom — shower (left of center, around -60 to -90)
    if (campCamperPlayerX < -50 && campCamperPlayerX > -100 && keys['KeyS']) {
      keys['KeyS'] = false;
      campCamperShowering = true;
      campCamperShowerTimer = 0;
    }
    // Exit
    if (keys['Enter'] && !campCamperPasta.cooking) {
      keys['Enter'] = false;
      currentScene = null;
      campCamperPlayerX = 0;
      player.y = GROUND_Y;
      player.vy = 0;
      player.onGround = true;
    }
    return;
  }

  // Scuba diving minigame
  if (currentScene === Scene.SCUBA_DIVING) {
    // Swimming physics — buoyancy + 4-directional movement
    const swimKeys = {
      left: !!keys['ArrowLeft'], right: !!keys['ArrowRight'],
      up: !!keys['ArrowUp'], down: !!keys['ArrowDown']
    };
    const swimResult = applySwimmingPhysics(
      { x: scubaPlayer.x, y: scubaPlayer.y },
      { vx: scubaPlayer.vx, vy: scubaPlayer.vy },
      swimKeys, SCUBA_BUOYANCY, SCUBA_SWIM_FORCE, SCUBA_DRAG
    );
    scubaPlayer.vx = swimResult.vx;
    scubaPlayer.vy = swimResult.vy;
    scubaPlayer.x = swimResult.x;
    scubaPlayer.y = swimResult.y;
    // Boundaries
    const swimBounds = applySwimmingBounds(scubaPlayer.x, scubaPlayer.y, SCUBA_WORLD_W, SCUBA_WORLD_H);
    scubaPlayer.x = swimBounds.x;
    scubaPlayer.y = swimBounds.y;
    // Facing direction
    if (scubaPlayer.vx > 0.3) player.facing = 1;
    if (scubaPlayer.vx < -0.3) player.facing = -1;
    // Walk animation for swimming
    player.walkTimer += dt;
    if (player.walkTimer > 200) { player.walkTimer = 0; player.walkFrame = (player.walkFrame + 1) % 4; }
    // Collect pearls/shells
    for (const c of scubaCollectibles) {
      if (c.collected) continue;
      const dx = scubaPlayer.x - c.x;
      const dy = scubaPlayer.y - c.y;
      if (dx * dx + dy * dy < COLLECT_RADIUS_SQ) {
        c.collected = true;
        scubaPearlCount++;
        score += POINTS.PEARL;
        addPopup(player.x, player.y - 40, '+' + POINTS.PEARL + ' ' + c.type + '!', c.color);
        playSfx('sfxPearlPickup');
      }
    }
    // Talk to mercats (Q key)
    for (const mc of scubaMercats) {
      if (Math.abs(scubaPlayer.x - mc.x) < 50 && Math.abs(scubaPlayer.y - mc.y) < 50) {
        if (keys['KeyQ']) {
          keys['KeyQ'] = false;
          const alreadyTalking = activeSpeechBubbles.some(b => b.npc === mc);
          if (!alreadyTalking) {
            const dialogs = npcDialogs[61]; // 61 = scuba sub-level dialogs
            const text = dialogs[Math.floor(Math.random() * dialogs.length)];
            activeSpeechBubbles.push({ npc: mc, text, life: TIMING.SPEECH_BUBBLE_LIFE });
            playSfx('sfxMercatChirp');
          }
        }
      }
    }
    // Update mercat speech bubbles
    for (let i = activeSpeechBubbles.length - 1; i >= 0; i--) {
      activeSpeechBubbles[i].life -= dt;
      if (activeSpeechBubbles[i].life <= 0) activeSpeechBubbles.splice(i, 1);
    }
    // Exit scuba — press Enter
    if (keys['Enter']) {
      keys['Enter'] = false;
      currentScene = null;
      stopLoopSfx('sfxBubblesSwim');
      // Force crossfade back to level music even if scuba fade is still in progress
      if (musicFade) {
        if (musicFade.out) { musicFade.out.pause(); musicFade.out.currentTime = 0; }
        currentMusicId = musicFade.inId;
        musicFade = null;
      }
      crossfadeToLevel(currentLevel);
      score += POINTS.SCUBA_COMPLETE;
      addPopup(player.x, player.y - 40, '+' + POINTS.SCUBA_COMPLETE + ' Great dive!', '#38bdf8');
      playChaChing();
    }
    // HUD updates during scuba
    hud.score.textContent = score;
    return;
  }

  // Sailing experience
  if (currentScene === Scene.SAILING) {
    // Player-controlled sailing on the Neuse River
    if (keys['ArrowLeft']) sailAngle -= 0.03;
    if (keys['ArrowRight']) sailAngle += 0.03;
    sailAngle = Math.max(-0.6, Math.min(0.6, sailAngle));
    // Exit sailing
    if (keys['Enter']) {
      keys['Enter'] = false;
      currentScene = null;
      stopLoopSfx('sfxSailWind');
      stopLoopSfx('sfxWaterLapping');
      player.x = SAILBOAT_POS.x;
      player.y = GROUND_Y;
      player.vy = 0;
      player.onGround = true;
    }
    return;
  }

  if (currentScene === Scene.HOUSE) {
    if (keys['Enter']) {
      keys['Enter'] = false;
      currentScene = null;
    }
    return;
  }

  if (currentScene === Scene.PIZZA) {
    updatePizzaMinigame(dt);
    if (keys['Enter'] && pizzaMaking.stage === 'idle') {
      keys['Enter'] = false;
      currentScene = null;
    }
    return;
  }

  if (currentScene === Scene.CAMPER) {
    // Nap in bed
    if (camperNapping) {
      camperNapTimer += dt;
      if (camperNapTimer >= CAMPER_NAP_DURATION) {
        camperNapping = false;
        camperNapTimer = 0;
        score += POINTS.CAMPER_NAP;
        addPopup(player.x, player.y - 40, '+' + POINTS.CAMPER_NAP + ' Refreshed!', '#a78bfa');
        playChaChing();
      }
      return;
    }
    // Walk around inside camper
    if (keys['ArrowLeft']) { camperPlayerX = Math.max(-150, camperPlayerX - 3); player.facing = -1; }
    if (keys['ArrowRight']) { camperPlayerX = Math.min(150, camperPlayerX + 3); player.facing = 1; }
    // Walk animation
    if (keys['ArrowLeft'] || keys['ArrowRight']) {
      player.walkTimer += dt;
      if (player.walkTimer > 120) { player.walkTimer = 0; player.walkFrame = (player.walkFrame + 1) % 4; }
    } else {
      player.walkFrame = 0;
    }
    // Cook fish on stove (C key, near left side where kitchenette is)
    if (keys['KeyC'] && !camperCooking.active && camperPlayerX < -100 && fishCount > 0) {
      keys['KeyC'] = false;
      camperCooking.active = true;
      camperCooking.progress = 0;
      camperCooking.burnt = false;
    }
    if (camperCooking.active) {
      camperCooking.progress += dt;
      if (camperCooking.progress >= TIMING.CAMPER_COOK_READY && camperCooking.progress < TIMING.CAMPER_COOK_BURNT) {
        // Perfect window — press C to collect or auto-collect at end
        if (keys['KeyC']) {
          keys['KeyC'] = false;
          camperCooking.active = false;
          fishCount--;
          score += POINTS.COOKED_FISH;
          addPopup(player.x, player.y - 40, '+' + POINTS.COOKED_FISH + ' Cooked fish!', '#fb923c');
          playChaChing();
        }
      }
      if (camperCooking.progress >= TIMING.CAMPER_COOK_BURNT) {
        camperCooking.active = false;
        camperCooking.burnt = true;
        addPopup(player.x, player.y - 40, 'Burnt!', '#ef4444');
      }
    }
    // Nap in bed (N key, near right side where bed is)
    if (keys['KeyN'] && camperPlayerX > 80 && !camperCooking.active) {
      keys['KeyN'] = false;
      camperNapping = true;
      camperNapTimer = 0;
    }
    // Phone logic — rings periodically, answer with P key
    if (!camperPhone.ringing && !camperPhone.answered) {
      camperPhone.ringTimer += dt;
      if (camperPhone.ringTimer > TIMING.PHONE_RING_MIN + Math.random() * 3000) {
        camperPhone.ringing = true;
        camperPhone.ringTimer = 0;
      }
    }
    if (camperPhone.answered) {
      camperPhone.callTimer += dt;
      if (camperPhone.callTimer >= TIMING.SPEECH_BUBBLE_LIFE) {
        camperPhone.answered = false;
        camperPhone.callTimer = 0;
        camperPhone.dialogue = '';
      }
    }
    if (keys['KeyP'] && camperPhone.ringing && !camperCooking.active) {
      keys['KeyP'] = false;
      camperPhone.ringing = false;
      camperPhone.answered = true;
      camperPhone.callTimer = 0;
      camperPhone.dialogue = CAMPER_PHONE_DIALOGUES[Math.floor(Math.random() * CAMPER_PHONE_DIALOGUES.length)];
      score += POINTS.PHONE_ANSWER;
      addPopup(player.x, player.y - 40, '+' + POINTS.PHONE_ANSWER + ' Answered!', '#38bdf8');
      playChaChing();
    }
    // Exit
    if (keys['Enter'] && !camperCooking.active && !camperPhone.answered) {
      keys['Enter'] = false;
      currentScene = null;
      camperPlayerX = 0;
      camperCooking = { active: false, progress: 0, burnt: false };
      camperPhone = { ringing: false, answered: false, ringTimer: 0, callTimer: 0, dialogue: '' };
    }
    return;
  }
  if (currentScene === Scene.WINDMILL) {
    if (keys['Enter']) {
      keys['Enter'] = false;
      currentScene = null;
    }
    return;
  }
  if (currentScene === Scene.PARK) {
    if (keys['Enter']) {
      keys['Enter'] = false;
      currentScene = null;
      player.y = GROUND_Y;
      player.vy = 0;
      player.onGround = true;
    }
    return;
  }

  if (currentScene === Scene.PANTHEON) {
    if (keys['Enter']) {
      keys['Enter'] = false;
      currentScene = null;
      player.y = GROUND_Y;
      player.vy = 0;
      player.onGround = true;
    }
    return;
  }

  if (currentScene === Scene.SWIMMING) {
    if (keys['KeyS']) { keys['KeyS'] = false; currentScene = null; }
    return;
  }

  if (currentScene === Scene.SURFING) {
    if (keys['KeyS']) { keys['KeyS'] = false; currentScene = null; }
    return;
  }

  if (currentScene === Scene.CHALET) {
    // Compute scene center (same as drawChaletInterior)
    const W = canvas.width;
    const chaletCam = Math.max(0, Math.min(getCurrentWorldW() - W, player.x - W / 2));
    const chaletCx = chaletCam + W / 2;
    const chaletCy = GROUND_Y - 80;
    // Position hot chocolate relative to scene center each frame
    hotChocolate.x = chaletCx + 50;
    hotChocolate.y = chaletCy + 60;
    // Kitty is at chaletCx - 80, chaletCy + 70

    // Aim angle with Up/Down
    if (!marshmallow.active) {
      if (keys['ArrowUp']) marshmallowAngle = Math.min(Math.PI * 0.45, marshmallowAngle + 0.02);
      if (keys['ArrowDown']) marshmallowAngle = Math.max(Math.PI * 0.08, marshmallowAngle - 0.02);
    }

    // Marshmallow mini-game update
    if (keys['Space'] && !marshmallow.active) {
      keys['Space'] = false;
      marshmallow.active = true;
      marshmallow.landed = false;
      // Launch from kitty's position
      marshmallow.x = chaletCx - 65;
      marshmallow.y = chaletCy + 55;
      marshmallow.vx = Math.cos(marshmallowAngle) * MARSHMALLOW_SPEED;
      marshmallow.vy = -Math.sin(marshmallowAngle) * MARSHMALLOW_SPEED;
    }
    if (marshmallow.active && !marshmallow.landed) {
      marshmallow.x += marshmallow.vx;
      marshmallow.y += marshmallow.vy;
      marshmallow.vy += MARSHMALLOW_GRAVITY; // gravity
      // Check if landed in mug
      const mugLeft = hotChocolate.x - 14;
      const mugRight = hotChocolate.x + 14;
      const mugTop = hotChocolate.y - 15;
      if (marshmallow.x > mugLeft && marshmallow.x < mugRight && marshmallow.y > mugTop && marshmallow.y < hotChocolate.y + 10 && marshmallow.vy > 0) {
        marshmallow.landed = true;
        marshmallowScore++;
        score += POINTS.MARSHMALLOW_CHALET;
        addPopup(hotChocolate.x, hotChocolate.y - 30, '+' + POINTS.MARSHMALLOW_CHALET + ' Marshmallow!', '#fef3c7');
        playChaChing();
      }
      // Missed — fell off screen
      if (marshmallow.y > GROUND_Y + 50 || marshmallow.x > chaletCx + 300) {
        marshmallow.active = false;
      }
    }
    // Reset after landing
    if (marshmallow.landed) {
      marshmallow.active = false;
    }
    // Drink hot chocolate after 10 marshmallows
    if (drinkingCocoa) {
      cocoaDrinkTimer += dt;
      if (cocoaDrinkTimer >= COCOA_DRINK_DURATION) {
        drinkingCocoa = false;
        cocoaDrinkTimer = 0;
        score += POINTS.COCOA;
        addPopup(chaletCx, chaletCy - 20, '+' + POINTS.COCOA + ' Delicious cocoa!', '#fbbf24');
        playChaChing();
        marshmallowScore = 0; // reset for another round
      }
      return;
    }
    if (keys['KeyD'] && marshmallowScore >= 10 && !marshmallow.active) {
      keys['KeyD'] = false;
      drinkingCocoa = true;
      cocoaDrinkTimer = 0;
    }
    if (keys['Enter']) {
      keys['Enter'] = false;
      currentScene = null;
      drinkingCocoa = false;
      switchToLevel(8); // onward to the campground!
    }
    return;
  }

  // Movement
  player.vx = 0;
  if (keys['ArrowLeft']) { player.vx = -MOVE_SPEED; player.facing = -1; }
  if (keys['ArrowRight']) { player.vx = MOVE_SPEED; player.facing = 1; }
  if (keys['ArrowUp']) { player.vx += 0; } // up on land is no-op for now
  if (keys['ArrowDown']) { player.vx += 0; }

  // Jump
  if (keys['Space'] && player.onGround) {
    player.vy = JUMP_VEL;
    player.onGround = false;
    playMeow();
  }

  // Physics
  player.vy = applyGravity(player.vy, GRAVITY);
  player.x += player.vx;
  player.y += player.vy;

  // Platform collision (only when falling)
  let onPlatform = false;
  const collision = checkPlatformCollision(player.x, player.y, player.vy, getCurrentPlatforms());
  if (collision) {
    player.y = collision.y;
    player.vy = collision.vy;
    player.onGround = collision.onGround;
    onPlatform = true;
  }

  // Ground collision (only if not on a platform)
  if (!onPlatform) {
    const groundLevel = getGroundLevel(player.x);
    if (player.y >= groundLevel) {
      player.y = groundLevel;
      player.vy = 0;
      player.onGround = true;
    }
  }

  // Yarn ball collection
  for (const yb of getCurrentYarnBalls()) {
    if (yb.collected) continue;
    const dx = player.x - yb.x;
    const dy = (player.y - 20) - yb.y;
    if (dx * dx + dy * dy < COLLECT_RADIUS_SQ) { // ~25px radius
      yb.collected = true;
      yarnCount++;
      score += POINTS.YARN;
      addPopup(yb.x, yb.y - 20, '+' + POINTS.YARN + ' Yarn!', yb.color);
      playChaChing();
    }
  }

  // Yarn bonus — award 100 points when all yarn in a level is collected
  const curYarn = getCurrentYarnBalls();
  if (curYarn.length > 0 && !yarnBonusAwarded[currentLevel] && curYarn.every(y => y.collected)) {
    yarnBonusAwarded[currentLevel] = true;
    score += POINTS.YARN_BONUS;
    addPopup(player.x, player.y - 60, '+' + POINTS.YARN_BONUS + ' ALL YARN BONUS!', '#fbbf24');
    playChaChing();
    // Big glitter celebration from the horn
    if (!prefersReducedMotion) {
      const colors = ['#f472b6', '#a78bfa', '#38bdf8', '#fbbf24', '#4ade80', '#fb923c', '#e879f9'];
      for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 4;
        glitterParticles.push({
          x: player.x + player.facing * 8,
          y: player.y - 48,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3,
          life: 1200 + Math.random() * 800,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 3 + Math.random() * 4
        });
      }
    }
  }

  // World bounds
  player.x = applyWorldBounds(player.x, getCurrentWorldW());

  // Walk animation
  if (Math.abs(player.vx) > 0) {
    player.walkTimer += dt;
    if (player.walkTimer > 120) {
      player.walkTimer = 0;
      player.walkFrame = (player.walkFrame + 1) % 4;
    }
  } else {
    player.walkFrame = 0;
  }

  // Fishing (level 1 only)
  const inPond = currentLevel === 1 && player.x > POND.x && player.x < POND.x + POND.w;
  if (keys['KeyF'] && inPond && !fishing.active && !cooking.active) {
    keys['KeyF'] = false;
    fishing.active = true;
    fishing.timer = 0;
    fishing.caught = false;
  }
  if (fishing.active) {
    fishing.timer += dt;
    if (fishing.timer > 1500 + Math.random() * 500) {
      fishing.active = false;
      fishing.caught = true;
      fishCount++;
      score += POINTS.FISH;
      addPopup(player.x, player.y - 40, '+' + POINTS.FISH + ' Fish!', '#38bdf8');
      playChaChing();
      // respawn a fish
      if (pondFish.length < 8) {
        const colors = ['#fb923c','#38bdf8','#4ade80','#f472b6'];
        pondFish.push({
          x: POND.x + 40 + Math.random() * (POND.w - 80),
          y: GROUND_Y + 10 + Math.random() * (POND.depth - 30),
          vx: (Math.random() - 0.5) * 1.5,
          color: colors[Math.floor(Math.random() * 4)],
          size: 14 + Math.random() * 8,
          wobble: Math.random() * Math.PI * 2
        });
      }
    }
  }

  // Cooking (level 1 only)
  const nearGrill = currentLevel === 1 && Math.abs(player.x - GRILL.x) < 60;
  if (keys['KeyC'] && nearGrill && !cooking.active && !fishing.active) {
    keys['KeyC'] = false;
    cooking.active = true;
    cooking.progress = 0;
    cooking.burnt = false;
  }
  if (cooking.active) {
    cooking.progress += dt;
    if (cooking.progress > TIMING.COOK_READY && cooking.progress < TIMING.COOK_BURNT) {
      // perfectly cooked window — auto collect
      cooking.active = false;
      baconCount++;
      score += POINTS.BACON;
      addPopup(GRILL.x, GROUND_Y - 60, '+' + POINTS.BACON + ' Bacon!', '#fb923c');
      playChaChing();
    } else if (cooking.progress >= TIMING.COOK_BURNT) {
      cooking.active = false;
      cooking.burnt = true;
      addPopup(GRILL.x, GROUND_Y - 60, 'Burnt!', '#ef4444');
    }
  }

  // House entry (level 1 only)
  const nearHouse = currentLevel === 1 && player.x > HOUSE.x - 20 && player.x < HOUSE.x + HOUSE.w + 20;
  if (keys['Enter'] && nearHouse && currentScene !== Scene.HOUSE) {
    keys['Enter'] = false;
    currentScene = Scene.HOUSE;
  }

  // Camper entry (level 1 only)
  let nearCamper = false;
  if (currentLevel === 1) {
    for (const s of bgScenes) {
      if (s.type === 'rv' && Math.abs(player.x - s.x) < 45) {
        nearCamper = true;
        if (keys['Enter'] && currentScene !== Scene.CAMPER) {
          keys['Enter'] = false;
          currentScene = Scene.CAMPER;
          camperPlayerX = 0;
          camperCooking = { active: false, progress: 0, burnt: false };
        }
        break;
      }
    }
  }

  // Windmill entry (level 1 only)
  let nearWindmill = false;
  if (currentLevel === 1) {
    for (const s of bgScenes) {
      if (s.type === 'windmill' && Math.abs(player.x - s.x) < 30) {
        nearWindmill = true;
        if (keys['Enter'] && currentScene !== Scene.WINDMILL) {
          keys['Enter'] = false;
          currentScene = Scene.WINDMILL;
        }
        break;
      }
    }
  }

  // Honey collection (level 1 only — H key near beehive)
  let nearBeehive = false;
  if (currentLevel === 1) {
    for (const s of bgScenes) {
      if (s.type === 'beehive' && Math.abs(player.x - s.x) < INTERACT_RANGE) {
        nearBeehive = true;
        if (keys['KeyH']) {
          keys['KeyH'] = false;
          honeyCount++;
          score += POINTS.HONEY;
          addPopup(s.x, GROUND_Y - 80, '+' + POINTS.HONEY + ' Honey!', '#f59e0b');
          playChaChing();
        }
        break;
      }
    }
  }

  // Pizza shop entry (level 2 only)
  const nearPizza = currentLevel === 3 && Math.abs(player.x - PIZZA_SHOP.x) < 50;
  if (keys['Enter'] && nearPizza && currentScene !== Scene.PIZZA) {
    keys['Enter'] = false;
    currentScene = Scene.PIZZA;
    pizzaMaking.stage = 'idle';
    pizzaMaking.progress = 0;
    pizzaMaking.active = false;
  }

  // Hot dog stands (level 2 — buy for 10 points)
  let nearHotdog = false;
  if (currentLevel === 3) {
    for (const hx of HOTDOG_POSITIONS) {
      if (Math.abs(player.x - hx) < INTERACT_RANGE) {
        nearHotdog = true;
        if (keys['KeyC'] && score >= POINTS.HOTDOG_COST) {
          keys['KeyC'] = false;
          score -= POINTS.HOTDOG_COST;
          hotdogCount++;
          addPopup(player.x, player.y - 40, 'Hot Dog! -10pts', '#fbbf24');
        }
        break;
      }
    }
  }

  // Central Park entry (level 2)
  const nearPark = currentLevel === 3 &&
    player.x > CENTRAL_PARK_POS.x - 80 && player.x < CENTRAL_PARK_POS.x + 80;
  if (keys['Enter'] && nearPark && currentScene === null) {
    keys['Enter'] = false;
    currentScene = Scene.PARK;
  }

  // Taxi → Rome (level 2)
  let nearTaxi = false;
  if (currentLevel === 3) {
    for (const tx of TAXI_POSITIONS) {
      if (Math.abs(player.x - tx) < INTERACT_RANGE) {
        nearTaxi = true;
        if (keys['Enter'] && currentScene === null) {
          keys['Enter'] = false;
          switchToLevel(4);
        }
        break;
      }
    }
  }

  // Rome interactions (level 3)
  let nearFountain = false;
  let nearGelato = false;
  let nearPantheonDoor = false;
  let nearFiat = false;
  if (currentLevel === 4) {
    // Fountain swimming
    if (Math.abs(player.x - FOUNTAIN_POS.x) < 45) {
      nearFountain = true;
      if (keys['KeyS']) {
        keys['KeyS'] = false;
        currentScene = Scene.SWIMMING;
      }
    }
    // Gelato
    for (const gx of GELATO_POSITIONS) {
      if (Math.abs(player.x - gx) < INTERACT_RANGE) {
        nearGelato = true;
        if (keys['KeyG']) {
          keys['KeyG'] = false;
          gelatoCount++;
          score += POINTS.GELATO;
          addPopup(player.x, player.y - 40, '+' + POINTS.GELATO + ' Gelato!', '#fda4af');
          playChaChing();
        }
        break;
      }
    }
    // Pantheon
    if (Math.abs(player.x - PANTHEON_POS.x) < BUILDING_RANGE) {
      nearPantheonDoor = true;
      if (keys['Enter']) {
        keys['Enter'] = false;
        currentScene = Scene.PANTHEON;
      }
    }
    // Fiat → Hawaii
    if (Math.abs(player.x - FIAT_POS.x) < 45) {
      nearFiat = true;
      if (keys['Enter'] && currentScene !== Scene.PANTHEON) {
        keys['Enter'] = false;
        switchToLevel(5);
      }
    }
  }

  // Hawaii interactions (level 4)
  let nearTiki = false;
  let nearCoconut = false;
  let nearSurf = false;
  let nearAirport = false;
  if (currentLevel === 5) {
    // Tiki torches
    for (const tx of TIKI_POSITIONS) {
      if (Math.abs(player.x - tx) < INTERACT_RANGE) {
        nearTiki = true;
        if (keys['KeyT']) {
          keys['KeyT'] = false;
          tikiCount++;
          score += POINTS.TIKI;
          addPopup(player.x, player.y - 40, '+' + POINTS.TIKI + ' Tiki!', '#f97316');
          playChaChing();
        }
        break;
      }
    }
    // Coconuts
    for (const cx2 of COCONUT_POSITIONS) {
      if (Math.abs(player.x - cx2) < INTERACT_RANGE) {
        nearCoconut = true;
        if (keys['KeyC']) {
          keys['KeyC'] = false;
          coconutCount++;
          score += POINTS.COCONUT;
          addPopup(player.x, player.y - 40, '+' + POINTS.COCONUT + ' Coconut!', '#92400e');
          playChaChing();
        }
        break;
      }
    }
    // Surfing
    if (Math.abs(player.x - SURF_POS.x) < 45) {
      nearSurf = true;
      if (keys['KeyS']) {
        keys['KeyS'] = false;
        currentScene = Scene.SURFING;
      }
    }
    // Airport → Oriental
    if (Math.abs(player.x - AIRPORT_POS.x) < BUILDING_RANGE) {
      nearAirport = true;
      if (keys['Enter']) {
        keys['Enter'] = false;
        switchToLevel(6);
      }
    }
  }

  // Alps interactions (level 7)
  let nearChalet = false;
  if (currentLevel === 7) {
    // Auto-ski: push player right continuously
    player.vx = Math.max(player.vx, ALPS_SPEED);

    // Diamond collection
    for (const d of level5.diamonds) {
      if (d.collected) continue;
      const ddx = player.x - d.x;
      const ddy = (player.y - 20) - d.y;
      if (ddx * ddx + ddy * ddy < 625) {
        d.collected = true;
        diamondCount++;
        score += POINTS.DIAMOND;
        addPopup(d.x, d.y - 20, '+' + POINTS.DIAMOND + ' Diamond!', '#60a5fa');
        playChaChing();
      }
    }

    // Tree collision (slow down + lose points)
    for (const tree of level5.trees) {
      if (tree.hit) continue;
      if (Math.abs(player.x - tree.x) < 12 && player.y > tree.y - 50 * tree.size) {
        tree.hit = true;
        score = Math.max(0, score - POINTS.TREE_HIT);
        addPopup(tree.x, player.y - 40, '-' + POINTS.TREE_HIT + ' Ouch!', '#ef4444');
        player.vx = 1; // slow down on hit
      }
    }

    // Reset trees that are far behind (so they can hit again on replay)
    for (const tree of level5.trees) {
      if (tree.hit && player.x - tree.x > 300) tree.hit = false;
    }

    // End of run — reach the chalet at the bottom
    if (player.x > ALPS_WORLD_W - 200) {
      nearChalet = true;
      player.vx = 0; // stop at the end
      if (keys['Enter']) {
        keys['Enter'] = false;
        currentScene = Scene.CHALET;
        marshmallowAngle = Math.PI / 5; // reset aim
        crossfadeToMusic(CHALET_MUSIC_ID); // chalet music
      }
    }
  }

  // Oriental interactions (level 6)
  let nearSailboat = false;
  let nearDiveSpot = false;
  if (currentLevel === 6 && currentScene !== Scene.SCUBA_DIVING) {
    // Sailboat boarding
    if (Math.abs(player.x - SAILBOAT_POS.x) < BUILDING_RANGE) {
      nearSailboat = true;
      if (keys['Enter'] && currentScene !== Scene.SAILING) {
        keys['Enter'] = false;
        currentScene = Scene.SAILING;
        startLoopSfx('sfxSailWind');
        startLoopSfx('sfxWaterLapping');
      }
    }
    // Dive spot — enter scuba minigame
    if (Math.abs(player.x - DIVE_SPOT_POS.x) < BUILDING_RANGE) {
      nearDiveSpot = true;
      if (keys['Enter']) {
        keys['Enter'] = false;
        currentScene = Scene.SCUBA_DIVING;
        scubaPlayer = { x: 200, y: 100, vx: 0, vy: 0 };
        scubaPearlCount = 0;
        initScubaCollectibles();
        crossfadeToMusic(SCUBA_MUSIC_ID);
        playSfx('sfxDiveSplash');
        startLoopSfx('sfxBubblesSwim');
      }
    }
    // Shell collection
    for (const s of levelOriental.scenes) {
      if (s.type === 'shell' && !s.collected && Math.abs(player.x - s.x) < INTERACT_RANGE) {
        if (keys['KeyC']) {
          keys['KeyC'] = false;
          s.collected = true;
          shellCount++;
          score += POINTS.SHELL;
          addPopup(s.x, player.y - 40, '+' + POINTS.SHELL + ' Shell!', '#fda4af');
          playChaChing();
        }
      }
    }
    // End of Oriental → Alps
    if (player.x > ORIENTAL_WORLD_W - 150) {
      if (keys['Enter']) {
        keys['Enter'] = false;
        switchToLevel(7);
      }
    }
  }

  // Campground interactions (level 8)
  let nearStick = false;
  let nearFirePit = false;
  let nearHammock = false;
  let nearBigfoot = false;
  let nearDigSite = false;
  let nearWaterPump = false;
  let nearPool = false;
  let nearCampCamper = false;
  if (currentLevel === 8) {
    // Stick collection
    for (let i = 0; i < STICK_POSITIONS.length; i++) {
      if (level6.sticksCollected[i]) continue;
      if (Math.abs(player.x - STICK_POSITIONS[i]) < INTERACT_RANGE) {
        nearStick = true;
        if (keys['KeyC']) {
          keys['KeyC'] = false;
          level6.sticksCollected[i] = true;
          stickCount++;
          score += POINTS.STICK;
          addPopup(STICK_POSITIONS[i], player.y - 40, '+' + POINTS.STICK + ' Stick!', '#92400e');
          playChaChing();
        }
      }
    }
    // Fire pit — build campfire (need 5 sticks)
    if (Math.abs(player.x - FIRE_PIT_POS.x) < 50) {
      nearFirePit = true;
      if (!campfire.built && stickCount >= 5 && keys['KeyB']) {
        keys['KeyB'] = false;
        campfire.built = true;
        campfire.lit = true;
        stickCount -= 5;
        score += POINTS.CAMPFIRE_BUILD;
        addPopup(FIRE_PIT_POS.x, player.y - 40, '+' + POINTS.CAMPFIRE_BUILD + ' Campfire built!', '#f97316');
        playChaChing();
      }
      // Roast marshmallow near lit campfire
      if (campfire.lit && !roasting.active && !roasting.done && keys['KeyR']) {
        keys['KeyR'] = false;
        roasting.active = true;
        roasting.progress = 0;
        roasting.done = false;
      }
    }
    // Roasting progress
    if (roasting.active) {
      roasting.progress += dt;
      // Perfect window: 2000-3500ms
      if (roasting.progress >= TIMING.ROAST_READY && roasting.progress < TIMING.ROAST_BURNT) {
        // Press C to make s'more
        if (keys['KeyC']) {
          keys['KeyC'] = false;
          roasting.active = false;
          roasting.done = true;
          smoreCount++;
          score += POINTS.SMORE;
          addPopup(FIRE_PIT_POS.x, player.y - 40, '+' + POINTS.SMORE + " S'more!", '#fbbf24');
          playChaChing();
          setTimeout(() => { roasting.done = false; }, 500);
        }
      }
      if (roasting.progress >= TIMING.ROAST_OVERBURN) {
        // Burnt!
        roasting.active = false;
        addPopup(FIRE_PIT_POS.x, player.y - 40, 'Burnt marshmallow!', '#ef4444');
        setTimeout(() => { roasting.done = false; }, 500);
      }
    }
    // Hammock nap
    if (Math.abs(player.x - HAMMOCK_POS.x) < 50) {
      nearHammock = true;
      if (!hammockNapping && keys['KeyN']) {
        keys['KeyN'] = false;
        hammockNapping = true;
        hammockNapTimer = 0;
      }
    }
    if (hammockNapping) {
      hammockNapTimer += dt;
      if (hammockNapTimer >= HAMMOCK_NAP_DURATION) {
        hammockNapping = false;
        hammockNapTimer = 0;
        score += POINTS.HAMMOCK_NAP;
        addPopup(player.x, player.y - 40, '+' + POINTS.HAMMOCK_NAP + ' Great nap!', '#86efac');
        playChaChing();
      }
    }
    // Bigfoot — chocolate milk
    if (Math.abs(player.x - BIGFOOT_POS.x) < 60) {
      nearBigfoot = true;
      if (!bigfootDrinking && keys['KeyM']) {
        keys['KeyM'] = false;
        bigfootDrinking = true;
        bigfootDrinkTimer = 0;
      }
    }
    if (bigfootDrinking) {
      bigfootDrinkTimer += dt;
      if (bigfootDrinkTimer >= BIGFOOT_DRINK_DURATION) {
        bigfootDrinking = false;
        bigfootDrinkTimer = 0;
        score += POINTS.BIGFOOT_MILK;
        addPopup(BIGFOOT_POS.x, player.y - 40, '+' + POINTS.BIGFOOT_MILK + ' Chocolate milk with Bigfoot!', '#92400e');
        playChaChing();
      }
    }
    // Dig site — dig a pool
    if (Math.abs(player.x - DIG_SITE_POS.x) < 50) {
      nearDigSite = true;
      if (!campPool.dug && !campPool.digging && keys['KeyD']) {
        keys['KeyD'] = false;
        campPool.digging = true;
        campPool.digProgress = 0;
      }
    }
    if (campPool.digging) {
      campPool.digProgress += dt;
      if (campPool.digProgress >= TIMING.DIG_DURATION) {
        campPool.digging = false;
        campPool.dug = true;
        score += POINTS.DIG_POOL;
        addPopup(DIG_SITE_POS.x, player.y - 40, '+' + POINTS.DIG_POOL + ' Pool dug!', '#92400e');
        playChaChing();
      }
    }
    // Water pump — fill pool
    if (Math.abs(player.x - WATER_PUMP_POS.x) < 50) {
      nearWaterPump = true;
      if (campPool.dug && !campPool.filled && !campPool.filling && keys['KeyW']) {
        keys['KeyW'] = false;
        campPool.filling = true;
        campPool.fillProgress = 0;
      }
    }
    if (campPool.filling) {
      campPool.fillProgress += dt;
      if (campPool.fillProgress >= TIMING.FILL_DURATION) {
        campPool.filling = false;
        campPool.filled = true;
        score += POINTS.FILL_POOL;
        addPopup(WATER_PUMP_POS.x, player.y - 40, '+' + POINTS.FILL_POOL + ' Pool filled!', '#38bdf8');
        playChaChing();
      }
    }
    // Swim in pool
    if (campPool.filled && Math.abs(player.x - DIG_SITE_POS.x) < 50) {
      nearPool = true;
      if (currentScene !== Scene.SWIMMING_IN_POOL && keys['KeyS']) {
        keys['KeyS'] = false;
        currentScene = Scene.SWIMMING_IN_POOL;
      }
    }
    if (currentScene === Scene.SWIMMING_IN_POOL && keys['KeyS']) {
      keys['KeyS'] = false;
      currentScene = null;
    }
    // Camp camper entry
    if (Math.abs(player.x - CAMP_CAMPER_POS.x) < BUILDING_RANGE) {
      nearCampCamper = true;
      if (keys['Enter'] && currentScene !== Scene.CAMP_CAMPER) {
        keys['Enter'] = false;
        currentScene = Scene.CAMP_CAMPER;
        campCamperPlayerX = 0;
      }
    }
    // Leprechaun interaction while swimming — press Q to ask for gold
    if (currentScene === Scene.SWIMMING_IN_POOL && keys['KeyQ']) {
      keys['KeyQ'] = false;
      if (smoreCount > 0) {
        smoreCount--;
        leprechaunGold++;
        score += POINTS.LEPRECHAUN_GOLD;
        leprechaunSpeech = { text: "A s'more! Aye, here's some gold for ye!", timer: 3000 };
        addPopup(DIG_SITE_POS.x + 60, player.y - 40, '+' + POINTS.LEPRECHAUN_GOLD + ' Leprechaun gold!', '#fbbf24');
        playChaChing();
      } else {
        leprechaunSpeech = { text: "No gold without s'mores! Bring me s'mores!", timer: 3000 };
      }
    }
    if (leprechaunSpeech.timer > 0) {
      leprechaunSpeech.timer -= dt;
    }
    // Safari jeep at end of campground → Africa
    if (Math.abs(player.x - CAMP_CAMPER_POS.x) < 55 && keys['KeyJ']) {
      keys['KeyJ'] = false;
      switchToLevel(9);
    }
  }

  // ── Africa Safari interactions (level 8) ──
  let nearBaobab = false;
  let nearCheetah = false;
  let nearSafariJeep = false;
  let nearWateringHole = false;
  let nearElephant = false;
  if (currentLevel === 9) {
    // Start ambient savanna wind if not already playing
    startLoopSfx('sfxSavannaWind');
    // Cheetah ride mode — override movement speed
    if (ridingCheetah) {
      if (keys['ArrowLeft'] || keys['ArrowRight']) {
        // Faster movement while riding
        player.vx = keys['ArrowLeft'] ? -CHEETAH_SPEED : CHEETAH_SPEED;
      }
      // Dust trail particles
      if (Math.abs(player.vx) > 2) {
        for (let i = 0; i < 2; i++) {
          dustParticles.push({
            x: player.x - player.facing * 15 + (Math.random() - 0.5) * 10,
            y: player.y + (Math.random() - 0.5) * 5,
            vx: -player.facing * (1 + Math.random() * 2),
            vy: -Math.random() * 1.5,
            life: 400 + Math.random() * 300,
            size: 2 + Math.random() * 4,
            color: '#d4a574'
          });
        }
      }
      // Yarn magnet — auto-collect nearby yarn while riding
      for (const yb of getCurrentYarnBalls()) {
        if (yb.collected) continue;
        const dx = player.x - yb.x;
        const dy = (player.y - 20) - yb.y;
        if (dx * dx + dy * dy < CHEETAH_YARN_MAGNET * CHEETAH_YARN_MAGNET) {
          yb.collected = true;
          yarnCount++;
          score += POINTS.YARN;
          addPopup(yb.x, yb.y - 20, '+' + POINTS.YARN + ' Yarn!', yb.color);
          playChaChing();
        }
      }
      // Dismount with G key
      if (keys['KeyG']) {
        keys['KeyG'] = false;
        ridingCheetah = false;
        stopLoopSfx('sfxCheetahSprint');
      }
    }

    // Update dust particles
    for (let i = dustParticles.length - 1; i >= 0; i--) {
      const p = dustParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.03;
      p.life -= dt;
      if (p.life <= 0) dustParticles.splice(i, 1);
    }

    // Baobab fruit collection
    for (const bx of BAOBAB_POSITIONS) {
      if (Math.abs(player.x - bx) < 50) {
        nearBaobab = true;
        if (keys['KeyF']) {
          keys['KeyF'] = false;
          fruitCount++;
          score += POINTS.FRUIT;
          addPopup(bx, player.y - 40, '+' + POINTS.FRUIT + ' Baobab fruit!', '#f59e0b');
          playSfx('sfxBaobabPluck');
        }
      }
    }

    // Watering hole swimming
    if (player.x > WATERING_HOLE_POS.x && player.x < WATERING_HOLE_POS.x + WATERING_HOLE_POS.w) {
      nearWateringHole = true;
      if (currentScene !== Scene.WATERING_HOLE && keys['KeyS']) {
        keys['KeyS'] = false;
        currentScene = Scene.WATERING_HOLE;
      }
    }
    if (currentScene === Scene.WATERING_HOLE && keys['KeyS']) {
      keys['KeyS'] = false;
      currentScene = null;
    }

    // Elephant water launch — press E near elephant to get launched high
    for (const ex of ELEPHANT_POSITIONS) {
      if (Math.abs(player.x - ex) < 60) {
        nearElephant = true;
        if (keys['KeyE'] && player.onGround) {
          keys['KeyE'] = false;
          player.vy = JUMP_VEL * 1.8; // super high launch!
          player.onGround = false;
          score += POINTS.ELEPHANT_BOOST;
          addPopup(ex, player.y - 60, '+' + POINTS.ELEPHANT_BOOST + ' Elephant boost!', '#94a3b8');
          playSfx('sfxElephantTrumpet');
          playSfx('sfxElephantSpray', 100);
        }
      }
    }

    // Rhino obstacles — charge when player is nearby
    for (const rh of level7.rhinos) {
      if (rh.cooldown > 0) {
        rh.cooldown -= dt;
        continue;
      }
      const dist = player.x - rh.x;
      if (!rh.charging && Math.abs(dist) < 200 && Math.abs(dist) > 30) {
        rh.charging = true;
        rh.chargeVx = dist > 0 ? 5 : -5; // charge toward player
        playSfx('sfxRhinoSnort');
        playSfx('sfxRhinoCharge', 100);
        rh.chargeTimer = 0;
      }
      if (rh.charging) {
        rh.chargeTimer += dt;
        rh.x += rh.chargeVx;
        // Hit detection
        if (!rh.hit && Math.abs(player.x - rh.x) < 20 && player.y > GROUND_Y - 50) {
          rh.hit = true;
          score = Math.max(0, score - POINTS.RHINO_HIT);
          addPopup(rh.x, player.y - 40, '-' + POINTS.RHINO_HIT + ' Rhino charge!', '#ef4444');
          player.vy = JUMP_VEL * 0.8; // knocked back
          player.onGround = false;
        }
        if (rh.chargeTimer > 2000) {
          rh.charging = false;
          rh.hit = false;
          rh.cooldown = 4000; // 4s cooldown
        }
      }
    }

    // Antelope herds — periodic running
    for (const ant of level7.antelopes) {
      if (!ant.running) {
        ant.runTimer += dt;
        if (ant.runTimer > 8000 + Math.random() * 5000) {
          ant.running = true;
          ant.runTimer = 0;
          ant.vx = (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 2);
          playSfx('sfxAntelopeGallop', 2000);
        }
      }
      if (ant.running) {
        ant.x += ant.vx;
        ant.runTimer += dt;
        if (ant.runTimer > 3000 || ant.x < 50 || ant.x > SAFARI_WORLD_W - 50) {
          ant.running = false;
          ant.runTimer = 0;
          ant.x = Math.max(50, Math.min(SAFARI_WORLD_W - 50, ant.x));
        }
      }
    }

    // Safari photography — press P near animals to photograph
    if (safariPhotography.active) {
      safariPhotography.timer += dt;
      if (safariPhotography.timer >= SAFARI_PHOTO_DURATION) {
        safariPhotography.active = false;
        // Check if timing was good (sweet spot: 500-1200ms)
        if (safariPhotography.timer < 2000) {
          const animal = safariPhotography.targetAnimal;
          if (!safariPhotosTaken[animal]) {
            safariPhotosTaken[animal] = true;
            safariPhotoCount++;
            score += POINTS.SAFARI_PHOTO;
            addPopup(player.x, player.y - 40, '+' + POINTS.SAFARI_PHOTO + ' Great photo!', '#fbbf24');
            playSfx('sfxPhotoSuccess');
            // Bonus for all 4 species
            if (safariPhotoCount >= 4) {
              score += POINTS.SAFARI_COLLECTION;
              addPopup(player.x, player.y - 60, '+' + POINTS.SAFARI_COLLECTION + ' Safari collection complete!', '#f97316');
              playChaChing();
            }
          } else {
            score += POINTS.SAFARI_PHOTO_DUP;
            addPopup(player.x, player.y - 40, '+' + POINTS.SAFARI_PHOTO_DUP + ' Nice shot!', '#86efac');
            playChaChing();
          }
        } else {
          addPopup(player.x, player.y - 40, 'Too slow! It walked away...', '#94a3b8');
          playSfx('sfxPhotoFail');
        }
      }
    }
    if (!safariPhotography.active && keys['KeyP']) {
      keys['KeyP'] = false;
      // Check if near any animal for photography
      let targetAnimal = '';
      for (const ex of ELEPHANT_POSITIONS) {
        if (Math.abs(player.x - ex) < 80) targetAnimal = 'elephant';
      }
      for (const rh of level7.rhinos) {
        if (Math.abs(player.x - rh.x) < 80) targetAnimal = 'rhino';
      }
      for (const ant of level7.antelopes) {
        if (Math.abs(player.x - ant.x) < 80) targetAnimal = 'antelope';
      }
      for (const gx of GIRAFFE_POSITIONS) {
        if (Math.abs(player.x - gx) < 80) targetAnimal = 'giraffe';
      }
      if (targetAnimal) {
        safariPhotography.active = true;
        safariPhotography.timer = 0;
        safariPhotography.targetAnimal = targetAnimal;
        playSfx('sfxCameraShutter');
      }
    }

    // Cheetah interaction — give yarn
    if (Math.abs(player.x - CHEETAH_POS.x) < 60) {
      nearCheetah = true;
      if (!ridingCheetah && cheetahYarnGiven < 5 && yarnCount > 0 && keys['KeyY']) {
        keys['KeyY'] = false;
        yarnCount--;
        cheetahYarnGiven++;
        const dialogueIdx = Math.min(cheetahYarnGiven - 1, CHEETAH_DIALOGUES.length - 1);
        cheetahSpeech = { text: CHEETAH_DIALOGUES[dialogueIdx], timer: 3000 };
        playSfx('sfxCheetahChirp');
        if (cheetahYarnGiven >= 5) {
          ridingCheetah = true;
          score += POINTS.CHEETAH_RIDE;
          addPopup(CHEETAH_POS.x, player.y - 40, '+' + POINTS.CHEETAH_RIDE + ' Cheetah ride unlocked!', '#f97316');
          playSfx('sfxCheetahPurr');
          startLoopSfx('sfxCheetahSprint');
        }
      }
      // Mount/remount cheetah
      if (!ridingCheetah && cheetahYarnGiven >= 5 && keys['KeyG']) {
        keys['KeyG'] = false;
        ridingCheetah = true;
        startLoopSfx('sfxCheetahSprint');
      }
    }
    if (cheetahSpeech.timer > 0) {
      cheetahSpeech.timer -= dt;
    }

    // Giraffe ride — press G near giraffe to reach high platforms
    for (const gx of GIRAFFE_POSITIONS) {
      if (Math.abs(player.x - gx) < 50 && keys['KeyE'] && player.onGround && !ridingCheetah) {
        keys['KeyE'] = false;
        player.vy = JUMP_VEL * 1.5; // high boost
        player.onGround = false;
        score += POINTS.GIRAFFE_LIFT;
        addPopup(gx, player.y - 40, '+' + POINTS.GIRAFFE_LIFT + ' Giraffe lift!', '#fde68a');
        playSfx('sfxGiraffeHum');
        playSfx('sfxGiraffeLift', 100);
      }
    }

    // Safari jeep — exit portal
    if (Math.abs(player.x - SAFARI_JEEP_POS_GAME.x) < BUILDING_RANGE) {
      nearSafariJeep = true;
      if (keys['Enter']) {
        keys['Enter'] = false;
        switchToLevel(10);
      }
    }

    // Tall grass slowdown
    let inTallGrass = false;
    for (const scene of level7.scenes) {
      if (scene.type === 'tall_grass' && player.x > scene.x && player.x < scene.x + scene.w) {
        inTallGrass = true;
        if (!ridingCheetah) {
          player.vx *= 0.6; // slow down in tall grass
        }
      }
    }
    if (inTallGrass) { startLoopSfx('sfxGrassRustle'); }
    else { stopLoopSfx('sfxGrassRustle'); }

    // Update HUD
    hud.fruit.textContent = fruitCount;
    hud.photo.textContent = safariPhotoCount;
    hud.cheetahYarn.textContent = cheetahYarnGiven + '/5';
  }

  // ── Transatlantic Flight interactions (level 10) ──
  if (currentLevel === 10) {
    // Auto-scroll: push player right
    player.vx = Math.max(player.vx, FLIGHT_SPEED);

    // Vertical movement — up/down keys move player vertically
    if (keys['ArrowUp']) player.y = Math.max(60, player.y - 3);
    if (keys['ArrowDown']) player.y = Math.min(GROUND_Y - 80, player.y + 3);

    // Override gravity — flying level
    player.vy = 0;
    player.onGround = false;

    // Seagull collision
    for (const sg of level10Flight.seagulls) {
      if (sg.hit) continue;
      const dx = player.x - sg.x;
      const dy = player.y - sg.y;
      if (dx * dx + dy * dy < 900) { // 30px radius
        sg.hit = true;
        score = Math.max(0, score - 15);
        addPopup(sg.x, sg.y, '-15 Seagull!', '#ef4444');
      }
    }

    // Storm collision
    for (const storm of level10Flight.storms) {
      if (storm.hit) continue;
      const dx = player.x - storm.x;
      const dy = player.y - storm.y;
      if (Math.abs(dx) < storm.w / 2 && Math.abs(dy) < storm.h / 2) {
        storm.hit = true;
        score = Math.max(0, score - 25);
        addPopup(storm.x, storm.y, '-25 Storm!', '#ef4444');
      }
    }

    // Hurricane collision
    for (const hur of level10Flight.hurricanes) {
      if (hur.hit) continue;
      const dx = player.x - hur.x;
      const dy = player.y - hur.y;
      if (dx * dx + dy * dy < hur.radius * hur.radius) {
        hur.hit = true;
        score = Math.max(0, score - 30);
        addPopup(hur.x, hur.y, '-30 Hurricane!', '#ef4444');
      }
    }

    // Ruby collection (uses yarnBalls array)
    for (const ruby of level10Flight.yarnBalls) {
      if (ruby.collected) continue;
      const dx = player.x - ruby.x;
      const dy = player.y - ruby.y;
      if (dx * dx + dy * dy < COLLECT_RADIUS_SQ) {
        ruby.collected = true;
        yarnCount++;
        score += POINTS.YARN;
        addPopup(ruby.x, ruby.y - 20, '+' + POINTS.YARN + ' Ruby!', '#ef4444');
        playChaChing();
      }
    }

    // Level exit — reach Florida
    if (player.x > level10Flight.worldW - 400 && keys['Enter']) {
      keys['Enter'] = false;
      switchToLevel(11);
    }
  }

  // Rainbow bridge portal (level 1 → level 2 sledding)
  if (currentLevel === 1) {
    const dx = player.x - BRIDGE_PORTAL.x;
    const dy = player.y - GROUND_Y;
    if (dx * dx + dy * dy < BRIDGE_PORTAL.radius * BRIDGE_PORTAL.radius && keys['Enter']) {
      keys['Enter'] = false;
      switchToLevel(2);
    }
  }

  // Sledding interactions (level 2)
  let nearTrain = false;
  if (currentLevel === 2) {
    // Auto-sled: push player right
    player.vx = Math.max(player.vx, SLED_SPEED);
    sledding = true;

    // Snowball collection
    for (const sb of level2Sled.snowballs) {
      if (sb.collected) continue;
      const sdx = player.x - sb.x;
      const sdy = (player.y - 20) - sb.y;
      if (sdx * sdx + sdy * sdy < 625) {
        sb.collected = true;
        snowballCount++;
        score += POINTS.SNOWBALL;
        addPopup(sb.x, sb.y - 20, '+' + POINTS.SNOWBALL + ' Snowball!', '#bae6fd');
        playChaChing();
      }
    }

    // Snowman collision
    for (const sm of level2Sled.snowmen) {
      if (sm.hit) continue;
      if (Math.abs(player.x - sm.x) < 15 && player.y > sm.y - 40 * sm.size) {
        sm.hit = true;
        score = Math.max(0, score - POINTS.SNOWMAN_HIT);
        addPopup(sm.x, player.y - 40, '-' + POINTS.SNOWMAN_HIT + ' Ouch!', '#ef4444');
        player.vx = 1;
      }
    }

    // Reset snowmen behind player
    for (const sm of level2Sled.snowmen) {
      if (sm.hit && player.x - sm.x > 300) sm.hit = false;
    }

    // Train at end
    if (player.x > SLED_WORLD_W - 200) {
      nearTrain = true;
      player.vx = 0;
      if (keys['Enter']) {
        keys['Enter'] = false;
        switchToLevel(3); // go to NYC
      }
    }
  }

  // Pond fish AI (level 1 only)
  if (currentLevel === 1) {
    for (const f of pondFish) {
      f.wobble += 0.03;
      f.x += f.vx;
      f.y += Math.sin(f.wobble) * 0.3;
      if (f.x < POND.x + 20 || f.x > POND.x + POND.w - 20) f.vx *= -1;
      f.y = Math.max(GROUND_Y + 5, Math.min(GROUND_Y + POND.depth - 10, f.y));
    }
  }

  // NPC AI
  const activeNpcs = levelRegistry[currentLevel].npcs;
  const worldW = getCurrentWorldW();
  for (const npc of activeNpcs) {
    npc.idleTimer -= dt / 16;
    if (npc.idleTimer <= 0) {
      npc.vx = (Math.random() - 0.5) * 2;
      npc.idleTimer = 100 + Math.random() * 200;
    }
    npc.x += npc.vx * 0.5;
    npc.x = Math.max(40, Math.min(worldW - 40, npc.x));
    npc.facing = npc.vx >= 0 ? 1 : -1;
    if (Math.abs(npc.vx) > 0.1) {
      npc.walkTimer += dt;
      if (npc.walkTimer > 150) { npc.walkTimer = 0; npc.walkFrame = (npc.walkFrame + 1) % 4; }
    } else {
      npc.walkFrame = 0;
    }
  }

  // NPC talk — Q key to chat with nearby NPCs
  let nearNpc = false;
  if (currentScene === null) {
    for (const npc of activeNpcs) {
      if (Math.abs(player.x - npc.x) < NPC_TALK_RANGE) {
        nearNpc = true;
        if (keys['KeyQ']) {
          keys['KeyQ'] = false;
          const alreadyTalking = activeSpeechBubbles.some(b => b.npc === npc);
          if (!alreadyTalking) {
            const levelDialogs = npcDialogs[currentLevel] || [];
            if (levelDialogs.length === 0) return; // no dialogs available
            const text = levelDialogs[Math.floor(Math.random() * levelDialogs.length)];
            activeSpeechBubbles.push({ npc, text, life: TIMING.SPEECH_BUBBLE_LIFE });
            npc.facing = player.x < npc.x ? -1 : 1;
          }
        }
        break;
      }
    }
  }

  // Update speech bubbles
  for (let i = activeSpeechBubbles.length - 1; i >= 0; i--) {
    activeSpeechBubbles[i].life -= dt;
    if (activeSpeechBubbles[i].life <= 0) activeSpeechBubbles.splice(i, 1);
  }

  // Popups
  for (let i = popups.length - 1; i >= 0; i--) {
    popups[i].y -= 1;
    popups[i].life -= dt;
    if (popups[i].life <= 0) popups.splice(i, 1);
  }

  // Glitter horn effect — spray when crossing a 100-point milestone
  const currentMilestone = Math.floor(score / 100);
  if (currentMilestone > lastGlitterScore && score > 0) {
    lastGlitterScore = currentMilestone;
    if (!prefersReducedMotion) {
      const colors = ['#f472b6', '#a78bfa', '#38bdf8', '#fbbf24', '#4ade80', '#fb923c', '#e879f9'];
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI - Math.PI / 2; // mostly upward
        const speed = 1.5 + Math.random() * 3;
        glitterParticles.push({
          x: player.x + player.facing * 8,
          y: player.y - 48, // horn tip
          vx: Math.cos(angle) * speed * player.facing,
          vy: Math.sin(angle) * speed - 2,
          life: 800 + Math.random() * 600,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 2 + Math.random() * 3
        });
      }
    }
  }
  // Update glitter particles
  for (let i = glitterParticles.length - 1; i >= 0; i--) {
    const p = glitterParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.05; // light gravity
    p.life -= dt;
    if (p.life <= 0) glitterParticles.splice(i, 1);
  }

  // HUD update
  hud.score.textContent = score;
  hud.fish.textContent = fishCount;
  hud.bacon.textContent = baconCount;
  hud.yarn.textContent = yarnCount;
  hud.level.textContent = levelRegistry[currentLevel].name;
  hud.pizza.textContent = pizzaMaking.pizzaCount;
  hud.hotdog.textContent = hotdogCount;
  hud.gelato.textContent = gelatoCount;
  hud.honey.textContent = honeyCount;
  hud.tiki.textContent = tikiCount;
  hud.coconut.textContent = coconutCount;
  hud.diamond.textContent = diamondCount;
  hud.snowball.textContent = snowballCount;
  hud.stick.textContent = stickCount;
  hud.smore.textContent = smoreCount;
  hud.shell.textContent = shellCount;

  // Show/hide HUD items and control hints based on current level
  for (const el of hudItems) {
    const levels = el.dataset.levels.split(',');
    el.style.display = levels.includes(String(currentLevel)) ? '' : 'none';
  }
  for (const el of ctrlItems) {
    const levels = el.dataset.levels.split(',');
    el.style.display = levels.includes(String(currentLevel)) ? '' : 'none';
  }

  // Hide controls during interior/mini-game scenes (always hidden on mobile)
  const inScene = currentScene !== null;
  if (!isMobile) {
    hud.controls.style.display = inScene ? 'none' : 'flex';
  }

  // Prompt
  updatePrompt({
    inPond, nearGrill, nearHouse, nearCamper, nearWindmill, nearBeehive,
    nearPizza, nearHotdog, nearPark, nearTaxi, nearFountain, nearGelato,
    nearPantheonDoor, nearFiat, nearTiki, nearCoconut, nearSurf, nearAirport,
    nearChalet, nearTrain, nearNpc, nearStick, nearFirePit, nearHammock,
    nearBigfoot, nearDigSite, nearWaterPump, nearPool, nearCampCamper,
    nearSailboat, nearDiveSpot, nearBaobab, nearCheetah, nearSafariJeep,
    nearWateringHole, nearElephant
  });
}

function getGroundLevel(x) {
  // Pond area is lower (level 1 only)
  if (currentLevel === 1 && x > POND.x + 20 && x < POND.x + POND.w - 20) {
    return GROUND_Y + POND.depth;
  }
  // Watering hole (Africa safari)
  if (currentLevel === 9 && x > WATERING_HOLE_POS.x + 20 && x < WATERING_HOLE_POS.x + WATERING_HOLE_POS.w - 20) {
    return GROUND_Y + WATERING_HOLE_POS.depth;
  }
  return GROUND_Y;
}

function addPopup(x, y, text, color) {
  popups.push({ x, y, text, color, life: TIMING.POPUP_LIFE });
}

function updatePizzaMinigame(dt) {
  if (pizzaMaking.stage === 'idle') {
    if (keys['KeyC']) {
      keys['KeyC'] = false;
      pizzaMaking.stage = 'dough';
      pizzaMaking.progress = 0;
    }
  } else if (pizzaMaking.stage === 'dough') {
    pizzaMaking.progress += dt;
    if (keys['KeyC'] && pizzaMaking.progress > 800) {
      keys['KeyC'] = false;
      pizzaMaking.stage = 'toppings';
      pizzaMaking.progress = 0;
    }
  } else if (pizzaMaking.stage === 'toppings') {
    pizzaMaking.progress += dt;
    if (keys['KeyC'] && pizzaMaking.progress > 800) {
      keys['KeyC'] = false;
      pizzaMaking.stage = 'oven';
      pizzaMaking.progress = 0;
    }
  } else if (pizzaMaking.stage === 'oven') {
    pizzaMaking.progress += dt;
    // Sweet spot: 3000-4500ms = perfect, >4500 = burnt
    if (keys['KeyC']) {
      keys['KeyC'] = false;
      if (pizzaMaking.progress >= TIMING.PIZZA_READY && pizzaMaking.progress < TIMING.PIZZA_BURNT) {
        // Perfect pizza!
        pizzaMaking.pizzaCount++;
        score += POINTS.PIZZA;
        addPopup(player.x, player.y - 40, '+' + POINTS.PIZZA + ' Perfect Pizza!', '#f97316');
        playChaChing();
      } else if (pizzaMaking.progress < TIMING.PIZZA_READY) {
        // Undercooked
        addPopup(player.x, player.y - 40, 'Undercooked!', '#93c5fd');
      } else {
        // Burnt
        addPopup(player.x, player.y - 40, 'Burnt pizza!', '#ef4444');
      }
      pizzaMaking.stage = 'idle';
      pizzaMaking.progress = 0;
    }
    if (pizzaMaking.progress >= TIMING.PIZZA_CHARRED) {
      // Auto-burn
      addPopup(player.x, player.y - 40, 'Burnt to a crisp!', '#ef4444');
      pizzaMaking.stage = 'idle';
      pizzaMaking.progress = 0;
    }
  }
  // HUD updates still needed
  hud.score.textContent = score;
  hud.pizza.textContent = pizzaMaking.pizzaCount;
}
