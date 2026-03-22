// ── Difficulty Tiers ──
// 'easy' (ages 5-7), 'medium' (ages 8-10), 'hard' (ages 11-13)
let gameDifficulty = localStorage.getItem('unikittyville_difficulty') || 'medium';

function setGameDifficulty(diff) {
  gameDifficulty = diff;
  try { localStorage.setItem('unikittyville_difficulty', diff); } catch (e) { /* storage unavailable */ }
}

function getDifficultyMultiplier() {
  switch (gameDifficulty) {
    case 'easy':   return { timeLimit: 1.5, hintLevel: 2, pointBonus: 0.5 };
    case 'hard':   return { timeLimit: 0.7, hintLevel: 0, pointBonus: 1.5 };
    case 'medium':
    default:       return { timeLimit: 1.0, hintLevel: 1, pointBonus: 1.0 };
  }
}

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
  SNOWBALL: 15, STICK: 5, CAMPFIRE_BUILD: 25, SMORE: 30, GEOMETRY_BONUS: 200,
  MARSHMALLOW_CHALET: 20, COCOA: 50, HAMMOCK_NAP: 20,
  BIGFOOT_MILK: 40, DIG_POOL: 15, FILL_POOL: 15, SHELL: 10,
  PEARL: 15, SCUBA_COMPLETE: 50, COOKED_FISH: 20,
  CAMPER_NAP: 10, PHONE_ANSWER: 5, CAMP_PASTA: 25,
  CAMP_SHOWER: 20, TREE_HIT: 10, SNOWMAN_HIT: 10,
  YARN_BONUS: 100, LEPRECHAUN_GOLD: 50,
  FRUIT: 10, ELEPHANT_BOOST: 15, RHINO_HIT: 15,
  SAFARI_PHOTO: 30, SAFARI_PHOTO_DUP: 5, SAFARI_COLLECTION: 100,
  CHEETAH_RIDE: 50, GIRAFFE_LIFT: 10, JOURNAL_BONUS: 20,
  TRAIN_PUZZLE: 25, TRAIN_PUZZLE_BONUS: 100,
  HOTDOG_MATH: 25,
  STORY_TYPING: 40, STORY_SPEED_BONUS: 30,
  LIGHT_SHOW_CHALLENGE: 40, LIGHT_SHOW_BONUS: 150,
  TELEGRAM_BASE: 30,
  SCROLL: 35, SCROLL_BONUS: 100,
  PANTHEON_PUZZLE: 100,

  BUG_CORRECT: 15, BUG_WRONG: 5,
  DIVE_LOG_PIECE: 30, DIVE_LOG_BONUS: 150,
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
  CAPE_LAUNCH: 'capeLaunch',
  SMOOTHIE_SHOP: 'smoothieShop',
  TOPGOLF: 'topGolf',
  HOSPITAL: 'hospital',
  FAO_SCHWARZ: 'faoSchwarz',
  EMPIRE_STATE: 'empireState',
  THIRTY_ROCK: 'thirtyRock',
  GRAND_CENTRAL: 'grandCentral',
  THE_MET: 'theMet',
  NASA_MUSEUM: 'nasaMuseum',
  MISSION_CONTROL: 'missionControl',
  TELEGRAM: 'telegram',

  APOLLO_MISSION: 'apolloMission',

  GELATO_SHOP: 'gelatoShop',
};
let currentScene = null;

// ── Postcard Writer ──
const POSTCARD_THEMES = {
  1:  { color: '#4ade80', greeting: 'Greetings from the Meadow!' },
  2:  { color: '#93c5fd', greeting: 'Greetings from the Mountains!' },
  3:  { color: '#94a3b8', greeting: 'Greetings from New York City!' },
  4:  { color: '#c2410c', greeting: 'Greetings from Roma!' },
  5:  { color: '#2dd4bf', greeting: 'Aloha from Hawaii!' },
  6:  { color: '#3b82f6', greeting: 'Greetings from Oriental, NC!' },
  7:  { color: '#e2e8f0', greeting: 'Greetings from the Alps!' },
  8:  { color: '#65a30d', greeting: 'Greetings from Camp!' },
  9:  { color: '#f59e0b', greeting: 'Greetings from Africa!' },
  10: { color: '#7dd3fc', greeting: 'Greetings from 30,000 feet!' },
  11: { color: '#6b7280', greeting: 'Greetings from NASA!' },
  12: { color: '#1e3a5f', greeting: 'Greetings from Outer Space!' },
  13: { color: '#c0c0c0', greeting: 'Greetings from the Moon!' },
};
const POSTCARD_POINTS = 25;
let postcardOpen = false;
let postcardMode = 'write'; // 'write' | 'gallery'
let postcardText = '';
let postcardsSent = []; // {level, text, levelName}
let postcardSentLevels = new Set();
let postcardGalleryScroll = 0;
let postcardJustSent = false; // brief flash after sending
let postcardSentTimer = 0;

function loadPostcards() {
  try {
    const data = JSON.parse(localStorage.getItem('unikittyville_postcards') || '[]');
    postcardsSent = data;
    postcardSentLevels = new Set(data.map(p => p.level));
  } catch (e) { /* ignore corrupt data */ }
}
function savePostcards() {
  try {
    localStorage.setItem('unikittyville_postcards', JSON.stringify(postcardsSent));
  } catch (e) { /* storage full or unavailable */ }
}

// ── Fact Notebook ──
let factNotebook = JSON.parse(localStorage.getItem('factNotebook') || '[]');
let notebookOpen = false;
let notebookCategory = 'All';
let notebookScroll = 0;
const NOTEBOOK_CATEGORIES = ['All', 'Geography', 'History', 'Science', 'Culture', 'Language'];
const NOTEBOOK_LINES_PER_PAGE = 8;

function categorizeFact(text) {
  const t = text.toLowerCase();
  // History keywords
  if (/\b(years? old|ancient|centur|history|built in|founded|histor|dynasty|empire|medieval|pharaoh|king|queen|war|battle|invented)\b/.test(t)) return 'History';
  // Geography keywords
  if (/\b(miles?|meters?|feet|mountain|ocean|river|island|continent|country|lake|valley|volcano|desert|north|south|east|west|elevation|altitude|tall|deep|wide|long)\b/.test(t)) return 'Geography';
  // Science keywords
  if (/\b(species|animal|fish|bird|turtle|whale|dolphin|elephant|giraffe|rhino|cheetah|coral|reef|plant|tree|flower|mineral|crystal|fossil|dinosaur|star|planet|moon|sun|gravity|orbit|rocket|space|atom|cell|dna|evolv)\b/.test(t)) return 'Science';
  // Language keywords
  if (/\b(means?|word for|translat|language|dialect|speak|phrase|say|greeting|hello|goodbye|aloha|mahalo|ciao|bongiorno|guten|bonjour|merci|gracias|danke)\b/.test(t)) return 'Language';
  // Culture keywords
  if (/\b(tradition|festival|celebrat|custom|music|dance|art|food|recipe|cook|dish|cuisine|temple|shrine|church|cathedral|museum|paint|sculpt|legend|myth|folk|story|song)\b/.test(t)) return 'Culture';
  return 'Culture'; // default
}

function addFactToNotebook(text, level) {
  // Don't add duplicates
  if (factNotebook.some(f => f.text === text)) return;
  const category = categorizeFact(text);
  const levelName = levelRegistry[level] ? levelRegistry[level].name : ('Level ' + level);
  factNotebook.push({ text, level, levelName, category });
  localStorage.setItem('factNotebook', JSON.stringify(factNotebook));
}

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
// Hot Dog Math minigame state
const HOTDOG_MATH_PRICES = [1.50, 2.75, 3.25, 4.10, 6.50];
let hotdogMath = {
  active: false,
  round: 0,       // 0-4 (5 rounds)
  price: 0,       // current round price
  paid: 0,        // amount paid so far (in cents to avoid float issues)
  complete: false, // all 5 rounds done
  feedback: '',    // feedback message (correct/overpaid)
  feedbackTimer: 0,
  vendorX: 0,     // which vendor triggered the minigame
};
const CENTRAL_PARK_POS = { x: 2200, w: 160 };
const HOSPITAL_POS = { x: 1800, w: 120 };
const FAO_SCHWARZ_POS = { x: 700, w: 100 };
const EMPIRE_STATE_POS = { x: 1500, w: 80 };
const THIRTY_ROCK_POS = { x: 2800, w: 100 };
const GRAND_CENTRAL_POS = { x: 3200, w: 120 };
const MET_MUSEUM_POS = { x: 3800, w: 120 };
// FAO Schwarz piano state
let faoPlayerX = 0; // 0-6 (7 piano keys: C D E F G A B)
let faoNoteTimer = 0;
let faoMelody = []; // notes the player has played
// Twinkle Twinkle Little Star — first 2 measures: C C G G A A G, F F E E D D C
const FAO_MELODY_TARGET = [0, 0, 4, 4, 5, 5, 4, 3, 3, 2, 2, 1, 1, 0];
let faoMelodyScore = 0;
let faoComplete = false;
// Web Audio piano note frequencies (C4 to B4)
const FAO_FREQS = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88];
let faoAudioCtx = null;
function faoPlayNote(noteIdx) {
  if (!faoAudioCtx) faoAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = faoAudioCtx.createOscillator();
  const gain = faoAudioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.value = FAO_FREQS[noteIdx];
  gain.gain.setValueAtTime(0.3, faoAudioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, faoAudioCtx.currentTime + 0.5);
  osc.connect(gain);
  gain.connect(faoAudioCtx.destination);
  osc.start();
  osc.stop(faoAudioCtx.currentTime + 0.5);
}
// Empire State elevator
let empireElevator = 0; // 0-100 progress
let empireAtTop = false;
// 30 Rock dance
let thirtyRockDance = { active: false, sequence: [], input: [], timer: 0, score: 0, showing: true };
// Grand Central
let grandCentralWhisper = '';
// Grand Central Telegram
const TELEGRAM_MESSAGES = [
  // Level 1 — easy (3-5 word phrases, uppercase)
  'HELLO NEW YORK', 'SEND HELP SOON', 'ARRIVED SAFELY STOP',
  'MEET ME AT NOON', 'YARN SHIPMENT COMING', 'ALL IS WELL HERE',
  'NEED MORE FISH', 'WEATHER IS GREAT',
  // Level 2 — medium (short sentences)
  'THE TRAIN ARRIVES AT NOON', 'PLEASE SEND SUPPLIES QUICKLY',
  'GRAND CENTRAL IS BEAUTIFUL', 'THE CITY NEVER SLEEPS',
  'SPARKLE LOVES NEW YORK CITY', 'UNICORNS ARE REAL I SAW ONE',
  // Level 3 — hard (longer with punctuation)
  'Dear Mom, NYC is amazing! Love, Sparkle.',
  'The fog rolled in at midnight, hiding the stars.',
  'Pack the yarn, fish, and bacon for the trip!',
  'Wish you were here! The city lights are magical.',
];
const TELEGRAM_LEVEL_RANGES = [[0, 8], [8, 14], [14, 18]]; // [start, end) indices per difficulty
let telegramActive = false;
let telegramText = '';
let telegramTyped = '';
let telegramErrors = 0;
let telegramStartTime = 0;
let telegramComplete = false;
let telegramLevel = 0; // 0-2 (difficulty)
let telegramErrorFlash = 0; // timestamp of last error for red flash
// Met Museum
let metPaintingIndex = 0;
let artDescActive = false;
let artDescText = '';
let artDescPaintingIdx = -1;
let artDescriptions = JSON.parse(localStorage.getItem('unikittyville_artDescriptions') || '{}');
function saveArtDescriptions() { localStorage.setItem('unikittyville_artDescriptions', JSON.stringify(artDescriptions)); }
const MET_PAINTINGS = [
  { title: 'Meadow at Sunrise', artist: 'Claude Meownet', level: 'Meadow', color: '#86efac', draw: 'meadow' },
  { title: 'Starry Sled Night', artist: 'Vincent van Paw', level: 'Sledding', color: '#1e3a5f', draw: 'sled' },
  { title: 'City That Never Sleeps', artist: 'Andy Pawrhol', level: 'NYC', color: '#1a1a2e', draw: 'nyc' },
  { title: 'The Colosseum Cat', artist: 'Meowchelangelo', level: 'Rome', color: '#fde68a', draw: 'rome' },
  { title: 'Aloha Paradise', artist: 'Georgia O\'Kitty', level: 'Hawaii', color: '#38bdf8', draw: 'hawaii' },
  { title: 'Sailors at Sunset', artist: 'J.M.W. Purrer', level: 'Oriental', color: '#f59e0b', draw: 'oriental' },
  { title: 'The Great Wave off Alps', artist: 'Katushika Hokusai', level: 'Alps', color: '#e0f2fe', draw: 'alps' },
  { title: 'Campfire Under Stars', artist: 'Bob Paws', level: 'Campground', color: '#0f172a', draw: 'camp' },
  { title: 'Safari Sunset', artist: 'Henri Meowtisse', level: 'Safari', color: '#f97316', draw: 'safari' },
];

// Hospital delivery minigame
let hospitalStage = 'idle'; // 'idle' | 'prep' | 'vitals' | 'breathing' | 'delivery' | 'celebrate' | 'color_pick' | 'name_pick'
let hospitalProgress = 0;
let hospitalPrepStations = 0; // 0-3, stations prepared
let hospitalVitalsZone = 0; // current heartbeat position (oscillates)
let hospitalBreathingPhase = 0; // current breathing phase
let hospitalBreathingHits = 0; // successful rhythm hits
let hospitalDeliveryPower = 0; // delivery push power
let hospitalDelivered = false; // has Kit been delivered this session?
let kitFurColor = '#fda4af'; // baby Kit's chosen fur color (default pink)
let kitName = 'Kit'; // baby's name (default Kit)
let kitNameInput = ''; // typing buffer for name input
let hasStroller = false; // does player have the stroller?
let kitParkBonus = false; // has player taken Kit to Central Park?
let picnic = { active: false, fed: 0, feeding: false, feedTimer: 0 }; // park picnic with Kit
const TAXI_POSITIONS = [300, 1200, 2400, 3600];
// Rome interactions
let gelatoCount = 0;
const FOUNTAIN_POS = { x: 1500 };
const GELATO_POSITIONS = [1000, 2800];
const PANTHEON_POS = { x: 2600 };
// Pantheon architecture puzzle
let pantheonPuzzle = {
  active: false,
  placed: 0, // 0-5 pieces placed (bottom to top)
  feedback: '',
  feedbackTimer: 0,
  animating: false,
  animProgress: 0,
  complete: false,
};
const PANTHEON_PIECES = [
  { name: 'Foundation', fact: "The Pantheon's foundation is 24 feet thick \u2014 made of Roman concrete!" },
  { name: 'Walls', fact: "The walls are 20 feet thick and get thinner as they go up, saving weight!" },
  { name: 'Lower Dome', fact: "Roman concrete gets lighter higher up \u2014 they mixed in volcanic pumice!" },
  { name: 'Upper Dome', fact: "The dome spans 142 feet \u2014 the largest unreinforced concrete dome ever built!" },
  { name: 'Oculus', fact: "The oculus (eye) at the top is 27 feet wide \u2014 the only source of light!" },
];
const FIAT_POS = { x: 4500 };
// Scroll transcription minigame (Pantheon)
const SCROLL_TEXTS = [
  { text: 'All roads lead to Rome', fact: 'The Roman road network stretched over 250,000 miles!' },
  { text: 'Veni Vidi Vici', fact: '"I came, I saw, I conquered" — Julius Caesar, 47 BC' },
  { text: 'When in Rome do as the Romans do', fact: 'This proverb dates back to Saint Augustine in 390 AD!' },
  { text: 'Rome was not built in a day', fact: 'It took over 1,000 years to build the Roman Empire!' },
  { text: 'The Roman Empire lasted over 1000 years', fact: 'From 27 BC to 476 AD in the West — and even longer in the East!' },
];
let scrollActive = false;
let scrollRound = 0; // 0-4
let scrollText = '';
let scrollTyped = 0; // index into scrollText
let scrollErrors = 0;
let scrollStartTime = 0;
let scrollComplete = false; // current scroll complete
let scrollAllDone = false; // all 5 scrolls done
let scrollShowFact = false; // showing fact after completion
let scrollFactTimer = 0;
let scrollFlashRed = 0; // timer for red flash on wrong key
let scrollTotalErrors = 0; // total errors across all scrolls
let scrollBonusAwarded = false; // all-5 bonus

// Gelato Shop minigame state
const GELATO_FLAVORS = [
  { name: 'Strawberry', color: '#ef4444' },
  { name: 'Chocolate', color: '#92400e' },
  { name: 'Pistachio', color: '#22c55e' },
  { name: 'Vanilla', color: '#fef3c7' },
  { name: 'Lemon', color: '#fde047' },
  { name: 'Blueberry', color: '#6366f1' },
];
const GELATO_ORDERS = [
  { desc: '1/2 Strawberry, 1/2 Chocolate', fractions: { Strawberry: 2, Chocolate: 2 } },
  { desc: '1/2 Vanilla, 1/4 Pistachio, 1/4 Lemon', fractions: { Vanilla: 2, Pistachio: 1, Lemon: 1 } },
  { desc: '1/3 Blueberry, 1/3 Strawberry, 1/3 Chocolate', fractions: { Blueberry: 1, Strawberry: 1, Chocolate: 1 }, thirds: true },
  { desc: '3/4 Pistachio, 1/4 Vanilla', fractions: { Pistachio: 3, Vanilla: 1 } },
  { desc: '1/4 Strawberry, 1/4 Chocolate, 1/4 Pistachio, 1/4 Vanilla', fractions: { Strawberry: 1, Chocolate: 1, Pistachio: 1, Vanilla: 1 } },
];
let gelatoRound = 0;
let gelatoCup = [];          // array of flavor names (each entry = 1 scoop = 1/4 cup, or 1/3 for thirds orders)
let gelatoOrder = null;       // current GELATO_ORDERS entry
let gelatoComplete = false;   // all 5 rounds done
let gelatoMessage = '';       // feedback message
let gelatoMsgTimer = 0;       // how long to show message
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

// NPC Quiz system — triggered randomly after NPC dialogue
let quizActive = false;
let quizQuestion = '';
let quizAnswers = [];
let quizCorrect = 0;       // index of correct answer (0, 1, or 2)
let quizResultTimer = 0;   // countdown for result message display
let quizResultText = '';    // "Correct! +50" or "Not quite! The answer is..."
let quizResultColor = '';   // color for the result message
const QUIZ_CHANCE = 0.33;  // ~1 in 3 chance of quiz after dialogue
const QUIZ_BONUS = 50;
const QUIZ_RESULT_DURATION = 2000; // 2 seconds
const SLED_WORLD_W = 5000;

// Sledding terrain height function — slopes downhill with rolling bumps
function sledTerrainY(x) {
  const progress = x / SLED_WORLD_W; // 0 to 1
  const baseY = 250 + progress * 150; // slopes from 250 to 400
  // Rolling hills/bumps
  const bump1 = Math.sin(x * 0.008) * 25;
  const bump2 = Math.sin(x * 0.003 + 1) * 15;
  const bump3 = Math.sin(x * 0.015) * 10; // small ripples
  // A few big dips and a launch ramp
  const bigDip1 = (x > 1200 && x < 1400) ? Math.sin((x - 1200) / 200 * Math.PI) * -40 : 0;
  const bigDip2 = (x > 2800 && x < 3000) ? Math.sin((x - 2800) / 200 * Math.PI) * -35 : 0;
  const bigJump = (x > 3800 && x < 4000) ? Math.sin((x - 3800) / 200 * Math.PI) * 30 : 0;
  return Math.min(GROUND_Y, baseY + bump1 + bump2 + bump3 + bigDip1 + bigDip2 - bigJump);
}

// Space flight alien collection — persists to Moon level
let collectedAlienCount = 0;
const MAX_SPACE_ALIENS = 8;
let spaceInvulnTimer = 0; // brief invulnerability after asteroid hit

// Mission Control typing minigame state
const MISSION_COMMANDS = [
  'SYSTEMS CHECK',
  'ALL ENGINES GO',
  'IGNITION SEQUENCE START',
  'MAIN ENGINE THROTTLE UP',
  'WE HAVE LIFTOFF',
];
let missionControl = {
  active: false,
  round: 0,        // 0-4
  typed: '',        // what the player has typed so far
  errors: 0,       // total errors
  startTime: 0,    // Date.now() when minigame started
  complete: false,  // all 5 commands done
  timeLeft: 60000,  // 60 seconds in ms
  failed: false,    // ran out of time
  rocketY: 0,       // for launch animation
  showResult: 0,    // timer for showing result before exit
};

// Cape Canaveral state
let capeSpaceSuit = false;
let capeFueling = 0;
let capeFueled = false;
let capeLaunching = false;
let capeCountdown = 10000; // 10 seconds
let capeLaunchPower = 0;

// Fuel calculator math problems
let fuelCalcActive = false;
let fuelCalcProblem = 0; // 0-2
let fuelCalcAnswer = '';
let fuelCalcCorrect = 0; // how many solved
let fuelCalcFeedback = ''; // 'correct' | 'wrong' | ''
let fuelCalcFeedbackTimer = 0;
const FUEL_CALC_PROBLEMS = [
  { question: 'Each fuel tank holds 5 gallons.\nWe need 4 tanks.\nHow many gallons total?', answer: 20 },
  { question: '30 oxygen canisters split equally\namong 6 astronauts.\nHow many each?', answer: 5 },
  { question: 'The rocket burns 8 gallons per minute.\nHow many gallons for a 7-minute burn?', answer: 56 },
];

// Moon level constants
const MOON_GRAVITY = 0.1;
const MOON_JUMP_VEL = -12;
const MOON_MOVE_SPEED = 3;

// Smoothie minigame state
let smoothieIngredients = 0;
let smoothieYogurt = false;
let smoothieBlending = false;
let smoothieProgress = 0;
let smoothieCount = 0;

// Recipe Mode state
let recipeModeActive = false;
let recipeRound = 0;       // 0-2
let recipeSteps = [];       // current shuffled order
let recipeCorrectOrder = [];
let recipeFirstSwap = null; // null or index of first selected step
let recipeComplete = false; // current round solved
let recipeSolved = 0;       // count of rounds solved (0-3)
let recipeCompleteTimer = 0; // animation timer after solving
let recipeAllDone = false;  // all 3 rounds finished
let recipeBlendAnim = 0;    // blender spin animation frame

const RECIPE_DATA = [
  {
    name: 'Strawberry Smoothie',
    color: '#ef4444',
    steps: ['Add strawberries', 'Add yogurt', 'Add ice', 'Blend']
  },
  {
    name: 'Tropical Smoothie',
    color: '#f59e0b',
    steps: ['Peel banana', 'Slice mango', 'Add coconut milk', 'Add ice', 'Blend']
  },
  {
    name: 'Power Smoothie',
    color: '#22c55e',
    steps: ['Add spinach', 'Add blueberries', 'Add protein powder', 'Add almond milk', 'Add honey', 'Blend']
  }
];

function shuffleRecipeSteps(correctSteps) {
  const arr = correctSteps.slice();
  // Do 3-4 random swaps to ensure it's shuffled but solvable
  const swaps = 3 + Math.floor(Math.random() * 2);
  for (let s = 0; s < swaps; s++) {
    const i = Math.floor(Math.random() * arr.length);
    let j = Math.floor(Math.random() * arr.length);
    while (j === i) j = Math.floor(Math.random() * arr.length);
    const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
  }
  // Ensure it's actually different from correct order
  const same = arr.every((s, i) => s === correctSteps[i]);
  if (same) {
    // swap first two
    const tmp = arr[0]; arr[0] = arr[1]; arr[1] = tmp;
  }
  return arr;
}

function startRecipeRound(round) {
  recipeRound = round;
  recipeCorrectOrder = RECIPE_DATA[round].steps.slice();
  recipeSteps = shuffleRecipeSteps(recipeCorrectOrder);
  recipeFirstSwap = null;
  recipeComplete = false;
  recipeCompleteTimer = 0;
  recipeBlendAnim = 0;
}

function checkRecipeOrder() {
  return recipeSteps.every((s, i) => s === recipeCorrectOrder[i]);
}

// TopGolf state
let golfBall = { active: false, x: 0, y: 0, vx: 0, vy: 0 };
let golfAngle = Math.PI / 4;
let golfScore = 0;
let golfPower = 0;
let golfCharging = false;

// Apollo Mission minigame state
let apolloMission = {
  active: false,
  step: 0,        // 0-3: first step, plant flag, collect rocks, salute
  progress: 0,    // generic progress for current step
  rocksCollected: 0,
  rockPositions: [],  // x positions of rocks to collect
  rockPlayerX: 0,     // player x within rock collection scene
  bootY: 0,           // boot descent position for step 1
  complete: false,
  celebrateTimer: 0,
  stepTimer: 0,       // timing for step 1 press-at-right-moment
};

// Space flight alien collection — persists to Moon level (defined in level 12 section)

// Train signal puzzle state (end of sledding level)
let trainPuzzleActive = false;
let trainPuzzleRound = 0; // 0-4 (5 puzzles)
let trainPuzzleFeedback = ''; // '' | 'correct' | 'wrong'
let trainPuzzleFeedbackTimer = 0;
let trainPuzzleComplete = false;
let trainPuzzleScore = 0; // track per-puzzle session score

const TRAIN_PUZZLES = [
  {
    rule: 'IF the light is RED, THEN press 1 to STOP.\nIF GREEN, press 2 to GO.',
    condition: 'RED light',
    visual: 'red_light',
    answer: 1,
    hint: 'The light is RED — that means STOP!'
  },
  {
    rule: 'IF the track goes LEFT, THEN press 1.\nIF RIGHT, press 2.',
    condition: 'Track goes RIGHT',
    visual: 'right_track',
    answer: 2,
    hint: 'The track points RIGHT — press 2!'
  },
  {
    rule: 'IF train is FAST AND track is CURVED,\nTHEN press 1 to SLOW DOWN.\nOtherwise press 2.',
    condition: 'FAST + CURVED',
    visual: 'fast_curved',
    answer: 1,
    hint: 'The train is FAST and the track is CURVED — slow down!'
  },
  {
    rule: 'IF it\'s SNOWING OR track is ICY,\nTHEN press 1 for SAND.\nOtherwise press 2.',
    condition: 'SNOWING',
    visual: 'snowing',
    answer: 1,
    hint: 'It\'s SNOWING — lay down sand!'
  },
  {
    rule: 'IF NOT daytime,\nTHEN press 1 for HEADLIGHTS.\nOtherwise press 2.',
    condition: 'NIGHTTIME',
    visual: 'night',
    answer: 1,
    hint: 'It\'s NOT daytime — turn on the headlights!'
  }
];

// ── Achievement Badges ──
const ACHIEVEMENT_BONUS = 200;
const achievements = [
  { id: 'junior_geographer', name: 'Junior Geographer', description: 'Visit 5 different levels', icon: '\u{1F30D}', earned: false, hint: 'Explore more levels!' },
  { id: 'marine_biologist', name: 'Marine Biologist', description: 'Complete the scuba diving level', icon: '\u{1F420}', earned: false, hint: 'Dive deep in the Oriental level' },
  { id: 'chefs_kiss', name: "Chef's Kiss", description: 'Make 3 pizzas, 3 s\'mores, and 3 smoothies', icon: '\u{1F468}\u200D\u{1F373}', earned: false, hint: 'Cook in NYC, Campground & Moon' },
  { id: 'shutterfly', name: 'Shutterfly', description: 'Take 5 safari photos', icon: '\u{1F4F8}', earned: false, hint: 'Photograph animals on safari' },
  { id: 'astronaut', name: 'Astronaut', description: 'Reach the Moon', icon: '\u{1F680}', earned: false, hint: 'Blast off from Cape Canaveral' },
  { id: 'world_traveler', name: 'World Traveler', description: 'Visit all 13 levels', icon: '\u2708\uFE0F', earned: false, hint: 'See every destination' },
  { id: 'kits_best_friend', name: "Kit's Best Friend", description: 'Complete the hospital delivery and picnic', icon: '\u{1F37C}', earned: false, hint: 'Deliver Kit and visit the park' },
  { id: 'high_scorer', name: 'High Scorer', description: 'Reach 10,000 points', icon: '\u2B50', earned: false, hint: 'Keep collecting and exploring!' },
];
let levelsVisited = new Set();
let achievementScreenOpen = false;
let achievementCheckCounter = 0;
let achievementPopup = null; // { name, icon, timer }
const ACHIEVEMENT_POPUP_DURATION = 3000;

// Load earned achievements from localStorage
function loadAchievements() {
  try {
    const saved = JSON.parse(localStorage.getItem('unikittyville_achievements') || '{}');
    for (const a of achievements) {
      if (saved[a.id]) a.earned = true;
    }
    const savedLevels = JSON.parse(localStorage.getItem('unikittyville_levels_visited') || '[]');
    for (const lv of savedLevels) levelsVisited.add(lv);
  } catch (e) { /* ignore corrupt data */ }
}

function saveAchievements() {
  try {
    const data = {};
    for (const a of achievements) { if (a.earned) data[a.id] = true; }
    localStorage.setItem('unikittyville_achievements', JSON.stringify(data));
    localStorage.setItem('unikittyville_levels_visited', JSON.stringify([...levelsVisited]));
  } catch (e) { /* storage full or unavailable */ }
}

function awardAchievement(id) {
  const a = achievements.find(b => b.id === id);
  if (!a || a.earned) return;
  a.earned = true;
  score += ACHIEVEMENT_BONUS;
  addPopup(player.x, player.y - 60, '+' + ACHIEVEMENT_BONUS + ' Achievement!', '#fbbf24');
  achievementPopup = { name: a.name, icon: a.icon, timer: ACHIEVEMENT_POPUP_DURATION };
  playChaChing();
  saveAchievements();
}

function checkAchievements() {
  // Track current level visit
  levelsVisited.add(currentLevel);

  // Junior Geographer — visit 5 different levels
  if (levelsVisited.size >= 5) awardAchievement('junior_geographer');

  // World Traveler — visit all 13 levels
  if (levelsVisited.size >= 13) awardAchievement('world_traveler');

  // Astronaut — reach the Moon (level 13)
  if (currentLevel === 13) awardAchievement('astronaut');

  // High Scorer — reach 10,000 points
  if (score >= 10000) awardAchievement('high_scorer');

  // Chef's Kiss — 3 pizzas, 3 s'mores, 3 smoothies
  if (pizzaMaking.pizzaCount >= 3 && smoreCount >= 3 && smoothieCount >= 3) {
    awardAchievement('chefs_kiss');
  }

  // Shutterfly — take 5+ safari photos (4 unique species + any duplicates, or just total count)
  if (safariPhotoCount >= 4) awardAchievement('shutterfly');

  // Kit's Best Friend — hospital delivery and picnic
  if (hospitalDelivered && kitParkBonus) awardAchievement('kits_best_friend');

  // Marine Biologist — checked when exiting scuba (set a flag)
  // (awarded inline when exiting scuba scene)

  saveAchievements();
  }

// ── Bug Catcher minigame (level 1) ──
const BUG_NET_POS = { x: 2520 }; // near the flower garden at x=2450
let hasBugNet = false;
let bugCatcherActive = false;
let bugCatcherRound = 0; // 0-4 (5 rounds total)
let bugCatcherBugs = []; // array of bug objects
let bugCatcherRule = null; // { text, matchFn }
let bugCatcherCorrect = 0;
let bugCatcherWrong = 0;
let bugCatcherRoundComplete = false;
let bugCatcherRoundTimer = 0;
let bugCatcherFinished = false;
const BUG_COLORS = ['red', 'blue', 'green', 'yellow'];
const BUG_SIZES = ['big', 'small'];
const BUG_PATTERNS = ['spots', 'stripes', 'plain'];
const BUG_TYPES = ['butterfly', 'beetle', 'ladybug', 'caterpillar'];
const BUG_COLOR_HEX = { red: '#ef4444', blue: '#3b82f6', green: '#22c55e', yellow: '#facc15' };

const BUG_CATCHER_RULES = [
  { text: 'Find RED bugs!', matchFn: b => b.color === 'red' },
  { text: 'Find BIG bugs!', matchFn: b => b.size === 'big' },
  { text: 'Find RED AND SMALL bugs!', matchFn: b => b.color === 'red' && b.size === 'small' },
  { text: 'Find bugs with SPOTS OR STRIPES!', matchFn: b => b.pattern === 'spots' || b.pattern === 'stripes' },
  { text: 'Find bugs that are NOT BLUE!', matchFn: b => b.color !== 'blue' },
];

function generateBugCatcherBugs() {
  const bugs = [];
  for (let i = 0; i < 10; i++) {
    bugs.push({
      x: 100 + Math.random() * 760,
      y: 80 + Math.random() * 300,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 1.5,
      color: BUG_COLORS[Math.floor(Math.random() * BUG_COLORS.length)],
      size: BUG_SIZES[Math.floor(Math.random() * BUG_SIZES.length)],
      pattern: BUG_PATTERNS[Math.floor(Math.random() * BUG_PATTERNS.length)],
      type: BUG_TYPES[Math.floor(Math.random() * BUG_TYPES.length)],
      caught: false,
      wobble: Math.random() * Math.PI * 2,
    });
  }
  // Ensure at least 2 matching bugs for current rule
  const rule = BUG_CATCHER_RULES[bugCatcherRound];
  let matchCount = bugs.filter(b => rule.matchFn(b)).length;
  let idx = 0;
  while (matchCount < 2 && idx < bugs.length) {
    // Force some bugs to match
    if (!rule.matchFn(bugs[idx])) {
      if (bugCatcherRound === 0) bugs[idx].color = 'red';
      else if (bugCatcherRound === 1) bugs[idx].size = 'big';
      else if (bugCatcherRound === 2) { bugs[idx].color = 'red'; bugs[idx].size = 'small'; }
      else if (bugCatcherRound === 3) bugs[idx].pattern = Math.random() < 0.5 ? 'spots' : 'stripes';
      else if (bugCatcherRound === 4) { if (bugs[idx].color === 'blue') bugs[idx].color = 'red'; }
      if (rule.matchFn(bugs[idx])) matchCount++;
    }
    idx++;
  }
  return bugs;
}

function startBugCatcherRound() {
  bugCatcherRule = BUG_CATCHER_RULES[bugCatcherRound];
  bugCatcherBugs = generateBugCatcherBugs();
  bugCatcherRoundComplete = false;
  bugCatcherRoundTimer = 0;
}

function updateBugCatcher(dt) {
  if (!bugCatcherActive || bugCatcherFinished) return;

  // Advance round after brief pause
  if (bugCatcherRoundComplete) {
    bugCatcherRoundTimer += dt;
    if (bugCatcherRoundTimer > 1500) {
      bugCatcherRound++;
      if (bugCatcherRound >= 5) {
        bugCatcherFinished = true;
        bugCatcherActive = false;
        const bonus = Math.max(0, bugCatcherCorrect * 15 - bugCatcherWrong * 5);
        score += bonus;
        addPopup(player.x, player.y - 60, `+${bonus} Bug Catcher Complete!`, '#a78bfa');
        playChaChing();
        return;
      }
      startBugCatcherRound();
    }
    return;
  }

  // Move bugs with wandering AI
  for (const bug of bugCatcherBugs) {
    if (bug.caught) continue;
    bug.wobble += 0.05;
    // Wandering: slight random direction changes
    bug.vx += (Math.random() - 0.5) * 0.1;
    bug.vy += (Math.random() - 0.5) * 0.08;
    // Clamp speed
    bug.vx = Math.max(-2.5, Math.min(2.5, bug.vx));
    bug.vy = Math.max(-2, Math.min(2, bug.vy));
    bug.x += bug.vx;
    bug.y += bug.vy;
    // Bounce off screen edges
    if (bug.x < 30) { bug.x = 30; bug.vx = Math.abs(bug.vx); }
    if (bug.x > 930) { bug.x = 930; bug.vx = -Math.abs(bug.vx); }
    if (bug.y < 60) { bug.y = 60; bug.vy = Math.abs(bug.vy); }
    if (bug.y > 420) { bug.y = 420; bug.vy = -Math.abs(bug.vy); }
  }

  // Catch bug with Space (collision with player)
  if (keys['Space']) {
    keys['Space'] = false;
    const cam = Math.max(0, Math.min(getCurrentWorldW() - canvas.width, player.x - canvas.width / 2));
    const playerScreenX = player.x - cam;
    const playerScreenY = player.y - 20; // center of player
    for (const bug of bugCatcherBugs) {
      if (bug.caught) continue;
      const dx = bug.x - playerScreenX;
      const dy = bug.y - playerScreenY;
      const catchRadius = bug.size === 'big' ? 35 : 28;
      if (dx * dx + dy * dy < catchRadius * catchRadius) {
        bug.caught = true;
        if (bugCatcherRule.matchFn(bug)) {
          bugCatcherCorrect++;
          score += 15;
          addPopup(player.x, player.y - 40, '+15 Correct!', '#4ade80');
          playChaChing();
        } else {
          bugCatcherWrong++;
          score = Math.max(0, score - 5);
          addPopup(player.x, player.y - 40, '-5 Wrong bug!', '#ef4444');
        }
        break; // only catch one at a time
      }
    }
  }

  // Check if all matching bugs caught = round complete
  const uncaughtMatches = bugCatcherBugs.filter(b => !b.caught && bugCatcherRule.matchFn(b));
  if (uncaughtMatches.length === 0) {
    bugCatcherRoundComplete = true;
    bugCatcherRoundTimer = 0;
    addPopup(player.x, player.y - 60, `Round ${bugCatcherRound + 1} complete!`, '#fbbf24');
  }
}

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

// Tour Guide Mode — educational introductions per level
let tourGuideActive = false;
let tourGuideStep = 0; // 0, 1, or 2 (which fact is showing)
const tourGuideSeen = new Set(); // levels already introduced this session
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

let nextMeowCooldown = 9000 + Math.random() * 6000;
function playMeow() {
  if (muted) return;
  const now = performance.now();
  if (now - lastMeowTime < nextMeowCooldown) return;
  lastMeowTime = now;
  nextMeowCooldown = 9000 + Math.random() * 6000; // 9-15s random interval
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
  if (currentMusicId) {
    const el = document.getElementById(currentMusicId);
    if (el) {
      el.volume = mv;
      // Resume music when unmuting, pause when muting
      if (muted) {
        el.pause();
      } else if (el.paused) {
        ensureLoaded(el).then(() => el.play().catch(() => {}));
      }
    }
  }
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
  // Stop previous track
  if (currentMusicId) {
    const prev = document.getElementById(currentMusicId);
    if (prev) { prev.pause(); prev.currentTime = 0; }
  }
  const el = document.getElementById(id);
  if (!el) return;
  currentMusicId = id;
  el.volume = getMusicVolume();
  el.currentTime = 0;
  if (!muted) {
    ensureLoaded(el).then(() => el.play().catch(() => {}));
  }
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
  if (!inEl) return;
  inEl.volume = 0;
  inEl.currentTime = 0;
  if (!muted) {
    ensureLoaded(inEl).then(() => inEl.play().catch(() => {}));
  }
  musicFade = { out: outEl, inEl: inEl, inId: newId, timer: 0 };
}

function updateMusicFade(dt) {
  if (!musicFade) return;
  musicFade.timer += dt;
  const t = Math.min(1, musicFade.timer / FADE_DURATION);
  if (!muted) {
    const mv = getMusicVolume();
    if (musicFade.out) musicFade.out.volume = mv * (1 - t);
    musicFade.inEl.volume = mv * t;
  }
  if (t >= 1) {
    if (musicFade.out) { musicFade.out.pause(); musicFade.out.currentTime = 0; }
    currentMusicId = musicFade.inId;
    musicFade = null;
  }
}

// Character customization — set by character creator
let playerEyeColor = '#1e1b4b';
let playerHornColors = ['#fbbf24', '#f472b6', '#a78bfa'];

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
  // Flight levels: start mid-screen instead of on the ground
  if (currentLevel === 10 || currentLevel === 12) {
    player.y = 200;
    player.onGround = false;
  } else if (currentLevel === 2) {
    // Sledding level: start at terrain height
    player.y = sledTerrainY(100);
    player.onGround = true;
  } else {
    player.y = GROUND_Y;
    player.onGround = true;
  }
  player.vy = 0;
  popups = [];
  cooking.active = false;
  fishing.active = false;
  currentScene = null;
  skiing = false;
  alpsEquipment = null;
  alpsChoosing = (levelTransition.toLevel === 7);
  alpsScrollZ = 0;
  alpsPlayerLane = 0;
  alpsAirborne = false;
  alpsAirTimer = 0;
  sledding = false;
  trainPuzzleActive = false;
  trainPuzzleRound = 0;
  trainPuzzleFeedback = '';
  trainPuzzleFeedbackTimer = 0;
  trainPuzzleComplete = false;
  trainPuzzleScore = 0;
  hammockNapping = false;
  hammockNapTimer = 0;
  bigfootDrinking = false;
  bigfootDrinkTimer = 0;
  roasting = { active: false, progress: 0, done: false };
  activeSpeechBubbles = [];
  quizActive = false;
  quizResultTimer = 0;
  pizzaMaking.stage = 'idle';
  pizzaMaking.progress = 0;
  // Reset hot dog math minigame
  hotdogMath.active = false;
  hotdogMath.round = 0;
  hotdogMath.paid = 0;
  hotdogMath.complete = false;
  hotdogMath.feedback = '';
  hotdogMath.feedbackTimer = 0;
  // Reset hospital minigame stage (but keep delivery/stroller/color state)
  hospitalStage = 'idle';
  hospitalProgress = 0;
  hospitalPrepStations = 0;
  hospitalBreathingHits = 0;
  hospitalDeliveryPower = 0;
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
  scrollActive = false;
  scrollComplete = false;
  scrollShowFact = false;
  journalActive = false;
  journalAnimal = '';
  journalResult = '';
  journalResultTimer = 0;
  cheetahSpeech = { text: '', timer: 0 };
  dustParticles = [];
  missionControl = { active: false, round: 0, typed: '', errors: 0, startTime: 0, complete: false, timeLeft: 60000, failed: false, rocketY: 0, showResult: 0 };
  // Keep space suit on for levels 11-13 (Cape → Space → Moon)
  if (!(levelTransition.toLevel >= 11 && levelTransition.toLevel <= 13 && capeSpaceSuit)) {
    capeSpaceSuit = false;
  }
  capeFueling = 0;
  capeFueled = false;
  capeLaunching = false;
  capeCountdown = 10000;
  capeLaunchPower = 0;
  fuelCalcActive = false;
  fuelCalcProblem = 0;
  fuelCalcAnswer = '';
  fuelCalcCorrect = 0;
  fuelCalcFeedback = '';
  fuelCalcFeedbackTimer = 0;
  // Reset space flight obstacles when re-entering level 12
  if (levelTransition.toLevel === 12) {
    spaceInvulnTimer = 0;
    for (const ast of level12Space.asteroids) ast.hit = false;
    for (const alien of level12Space.aliens) alien.collected = false;
    for (const yb of level12Space.yarnBalls) yb.collected = false;
    collectedAlienCount = 0;
  }
  // Reset Moon state
  smoothieIngredients = 0;
  smoothieYogurt = false;
  smoothieBlending = false;
  smoothieProgress = 0;
  smoothieCount = 0;
  recipeModeActive = false;
  recipeRound = 0;
  recipeSteps = [];
  recipeCorrectOrder = [];
  recipeFirstSwap = null;
  recipeComplete = false;
  recipeSolved = 0;
  recipeCompleteTimer = 0;
  recipeAllDone = false;
  recipeBlendAnim = 0;
  golfBall = { active: false, x: 0, y: 0, vx: 0, vy: 0 };
  golfScore = 0;
  golfPower = 0;
  golfCharging = false;
  apolloMission = {
    active: false, step: 0, progress: 0, rocksCollected: 0,
    rockPositions: [], rockPlayerX: 0, bootY: 0, complete: false,
    celebrateTimer: 0, stepTimer: 0,
  };

  // Reset bug catcher (keep hasBugNet and bugCatcherFinished across level switches)
  bugCatcherActive = false;
  bugCatcherRound = 0;
  bugCatcherBugs = [];
  bugCatcherRule = null;
  bugCatcherCorrect = 0;
  bugCatcherWrong = 0;
  bugCatcherRoundComplete = false;
  bugCatcherRoundTimer = 0;
  // Stop any looping SFX from previous level
  stopLoopSfx('sfxSailWind');
  stopLoopSfx('sfxWaterLapping');
  stopLoopSfx('sfxBubblesSwim');
  stopLoopSfx('sfxCheetahSprint');
  stopLoopSfx('sfxGrassRustle');
  stopLoopSfx('sfxSavannaWind');
  stopLoopSfx('sfxFlightWind');

  // Activate tour guide for first visit to each level
  if (!tourGuideSeen.has(levelTransition.toLevel)) {
    tourGuideActive = true;
    tourGuideStep = 0;
    tourGuideSeen.add(levelTransition.toLevel);
  }
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
const SCUBA_WORLD_W = 2200;
const SCUBA_WORLD_H = 500;
const SCUBA_BUOYANCY = -0.04;
const SCUBA_SWIM_FORCE = 0.45;
const SCUBA_DRAG = 0.92;
let scubaCollectibles = [];
let scubaPearlCount = 0;
// USS Oriental Dive Log — timeline pieces
const DIVE_LOG_PIECES = [
  { x: 400, y: 200, year: '1861', event: 'The Civil War begins. The Union Navy needs transport ships.' },
  { x: 800, y: 280, year: '1862', event: 'The USS Oriental is captured by Confederate forces near Hatteras.' },
  { x: 1200, y: 160, year: '1862', event: 'The ship sinks in the Neuse River during a storm.' },
  { x: 1600, y: 320, year: '1953', event: 'Local divers discover the wreck and begin documenting artifacts.' },
  { x: 2000, y: 240, year: '2010', event: 'The site becomes a protected underwater heritage trail.' },
];
let diveLogFound = new Set();
let diveLogShowingTimeline = false;
let diveLogTimelineTimer = 0;
// Level select
let levelSelectUnlocked = true; // permanently unlocked for dev/debug
// LEVEL_NAMES and TOTAL_LEVELS are now derived from levelRegistry (defined in drawing.js)

// ── Level 7: Alps ──
// The Alps is a first-person downhill skiing level.
// Player sees the slope rushing toward them, dodging trees and collecting diamonds.
let skiing = false;
let diamondCount = 0;
let alpsScrollZ = 0; // distance traveled down the mountain
const ALPS_WORLD_W = 960; // minimal — the FP view doesn't use world scrolling
const ALPS_FP_SPEED = 5; // z-units per frame (how fast slope rushes toward player)
const ALPS_RUN_LENGTH = 3000; // total z-distance of the run
const ALPS_LANE_SPEED = 6; // how fast player moves left/right in screen pixels
let alpsPlayerLane = 0; // screen-space x offset from center (-200 to 200)
let alpsAirborne = false; // true when launched off a cornice
let alpsAirTimer = 0; // ms in the air
const ALPS_AIR_DURATION = 1500; // ms of air time from a jump
// Alps equipment choice
let alpsEquipment = null; // 'skis' or 'snowboard' — null means choosing
let alpsChoosing = false; // true when the equipment selection UI is showing

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
// Campfire Light Show minigame
let lightShowActive = false;
let lightShowProgram = '';     // string of color codes: R, B, G, Y, W
let lightShowRepeat = false;   // whether X (repeat x3) was added
let lightShowRunning = false;
let lightShowStep = 0;
let lightShowTimer = 0;
let lightShowChallenge = 0;    // 0-4 (which challenge)
let lightShowChallengesCompleted = [false, false, false, false, false];
let lightShowFeedback = { text: '', timer: 0, color: '#fff' };
const LIGHT_SHOW_STEP_MS = 500; // ms per color step when running
const LIGHT_SHOW_TARGETS = [
  { desc: 'Make the fire go: Red, Blue, Red, Blue', pattern: 'RBRB' },
  { desc: 'Make the fire go: Red, Green, Blue', pattern: 'RGB' },
  { desc: 'Make a rainbow: R, Y, G, B, W', pattern: 'RYGBW' },
  { desc: 'Use REPEAT: make Red, Blue loop 3 times', pattern: 'RBRBRBRBRBRB', needsRepeat: true, basePattern: 'RBRB' },
  { desc: 'Free mode: create your own light show!', pattern: null },
];
const LIGHT_SHOW_COLORS = {
  R: '#ef4444', B: '#3b82f6', G: '#22c55e', Y: '#facc15', W: '#ffffff'
};
// Campfire Story Typing minigame
const CAMPFIRE_STORIES = [
  "Once upon a time a brave little kitten climbed the tallest tree in the forest. From the top she could see the whole world sparkling below.",
  "The stars twinkled above the campfire as the crickets sang their nightly song. It was the perfect end to a perfect adventure day.",
  "Deep in the woods there lived a friendly bear who loved to share honey with all the forest animals. Everyone called him Sunny.",
];
let storyTyping = { active: false, storyIndex: 0, typed: 0, errors: 0, startTime: 0, complete: false, completeTimer: 0, sessionPick: -1 };

// Camp camper (end of campground level)
let campCamperPlayerX = 0;
let campCamperSleeping = false;
let campCamperSleepTimer = 0;
let campCamperPasta = { cooking: false, progress: 0, eaten: 0 };
let campCamperShowering = false;
let campCamperShowerTimer = 0;
const CAMP_CAMPER_POS = { x: 4700 };

// ── Level 8: Campfire Geometry minigame ──
let geometryActive = false;
let geometryShapeIndex = 0; // 0-4 (triangle, square, pentagon, hexagon, star)
let geometrySticks = []; // placed sticks [{x1, y1, x2, y2}]
let geometryAngle = 0; // current stick rotation in radians
let geometryComplete = false; // true when current shape is done
let geometryAllComplete = false; // true when all 5 shapes completed
let geometryCompletionTimer = 0; // timer for showing completion message
const GEOMETRY_SHAPES = [
  { name: 'Triangle', sides: 3, fact: 'A triangle has 3 sides and 3 angles that add up to 180 degrees!' },
  { name: 'Square', sides: 4, fact: 'A square has 4 equal sides and 4 right angles (90 degrees each)!' },
  { name: 'Pentagon', sides: 5, fact: 'A pentagon has 5 sides. The Pentagon building in Washington DC has this shape!' },
  { name: 'Hexagon', sides: 6, fact: 'Hexagons are found in beehives! Bees are natural geometers!' },
  { name: 'Star', sides: 5, fact: 'A five-pointed star is made of 5 triangles around a pentagon!', isStar: true },
];
const GEOMETRY_COMPLETION_DISPLAY = 3000; // ms to show fact before advancing

// ── Level 8: Africa Safari ──
let fruitCount = 0;
let safariPhotoCount = 0;
let cheetahYarnGiven = 0;
let ridingCheetah = false;
let cheetahSpeech = { text: '', timer: 0 };
let safariPhotography = { active: false, timer: 0, targetAnimal: '' };
const SAFARI_PHOTO_DURATION = 1500; // 1.5s timing window
let safariPhotosTaken = { elephant: false, rhino: false, antelope: false, giraffe: false, cheetah: false };
let photoGalleryOpen = false;
// Safari Field Journal — fill-in-the-blank observations after photos
const JOURNAL_ENTRIES = {
  elephant: { sentence: 'The elephant uses its long ____ to drink water.', choices: ['tail', 'trunk', 'ears'], correct: 1 },
  giraffe:  { sentence: 'Giraffes have ____ spots, and no two patterns are alike.', choices: ['striped', 'brown', 'square'], correct: 1 },
  cheetah:  { sentence: 'The cheetah is the ____ land animal on Earth.', choices: ['slowest', 'biggest', 'fastest'], correct: 2 },
  rhino:    { sentence: "A rhino's horn is made of the same material as your ____.", choices: ['fingernails', 'teeth', 'bones'], correct: 0 },
  antelope: { sentence: 'Antelopes can ____ very high to escape predators.', choices: ['swim', 'dig', 'jump'], correct: 2 },
};
let journalActive = false;
let journalAnimal = '';
let journalResult = ''; // '', 'correct', 'wrong'
let journalResultTimer = 0;
const JOURNAL_RESULT_DURATION = 1500;
let journalCompleted = new Set(); // animals whose journal entry is done
let dustParticles = []; // cheetah ride dust trail
const CHEETAH_SPEED = 6.5; // faster than normal 4px
const CHEETAH_YARN_MAGNET = 80; // auto-collect radius while riding
const SAFARI_JEEP_POS_GAME = { x: 5200 };
// Watering hole crocodile and parrot
let wateringHoleTimer = 0; // ms spent in the watering hole
let crocVisible = false;
let crocSpeech = { text: '', timer: 0 };
const crocDialogs = [
  "Hey there! Remember to floss every day!",
  "Did you know crocodiles have been around for 200 million years? We're basically dinosaurs!",
  "I only bite on Tuesdays. Today is... uh... not Tuesday. Probably.",
  "My dentist says I have the best teeth in the river. All 80 of them!",
  "Drink plenty of water! ...Well, I guess you're IN the water. Good job!",
  "Always eat your vegetables! I eat fish but the principle is the same!",
  "Be kind to others! Even if they're a different species!",
  "Get 8 hours of sleep! I nap with one eye open. Very efficient!",
  "Sunscreen is important! My scales are naturally UV-resistant though. Lucky me!",
  "Read a book every week! I can't hold books but I respect the hustle!",
  "Exercise daily! I do tail curls. Very effective!",
  "Wash behind your ears! I don't have ears but I support the message!",
];
let parrotState = 'hidden'; // 'hidden' | 'arriving' | 'shoulder' | 'naming' | 'named'
let parrotName = '';
let parrotArrivalTimer = 0;
let parrotBobPhase = 0;

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
    { x: 1400, y: 250, type: 'Pearl', color: '#e9d5ff', collected: false },
    { x: 1700, y: 150, type: 'Shell', color: '#fda4af', collected: false },
    { x: 1900, y: 350, type: 'Pearl', color: '#e9d5ff', collected: false },
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

  // Postcard "just sent" timer
  if (postcardJustSent) {
    postcardSentTimer -= dt;
    if (postcardSentTimer <= 0) {
      postcardJustSent = false;
      postcardOpen = false;
    }
  }

  // Block all game input while postcard is open
  if (postcardOpen) return;

  // Tour guide overlay — block normal input while active
  if (tourGuideActive) {
    if (keys['Space']) {
      keys['Space'] = false;
      tourGuideStep++;
      if (tourGuideStep >= 3) {
        tourGuideActive = false;
      }
    }
    if (keys['Enter']) {
      keys['Enter'] = false;
      tourGuideActive = false;
    }
    return;
  }

  // Fact Notebook overlay — N to toggle (only when not in a scene/minigame)
  if (notebookOpen) {
    if (keys['KeyN'] || keys['Enter'] || keys['Escape']) {
      keys['KeyN'] = false;
      keys['Enter'] = false;
      keys['Escape'] = false;
      notebookOpen = false;
    }
    if (keys['ArrowUp']) { keys['ArrowUp'] = false; notebookScroll = Math.max(0, notebookScroll - 1); }
    if (keys['ArrowDown']) { keys['ArrowDown'] = false; notebookScroll++; }
    if (keys['ArrowLeft']) {
      keys['ArrowLeft'] = false;
      const idx = NOTEBOOK_CATEGORIES.indexOf(notebookCategory);
      notebookCategory = NOTEBOOK_CATEGORIES[(idx - 1 + NOTEBOOK_CATEGORIES.length) % NOTEBOOK_CATEGORIES.length];
      notebookScroll = 0;
    }
    if (keys['ArrowRight']) {
      keys['ArrowRight'] = false;
      const idx = NOTEBOOK_CATEGORIES.indexOf(notebookCategory);
      notebookCategory = NOTEBOOK_CATEGORIES[(idx + 1) % NOTEBOOK_CATEGORIES.length];
      notebookScroll = 0;
    }
    return; // freeze the game while notebook is open
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
    // Bathroom — shower (left side of camper)
    if (campCamperPlayerX < -40 && keys['KeyS']) {
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
    // USS Oriental Dive Log — timeline piece collection (T key)
    if (diveLogShowingTimeline) {
      // Dismiss timeline overlay with Enter or Escape
      if (keys['Enter'] || keys['Escape']) {
        keys['Enter'] = false;
        keys['Escape'] = false;
        diveLogShowingTimeline = false;
      }
      hud.score.textContent = score;
      return; // freeze movement while viewing timeline
    }
    for (let i = 0; i < DIVE_LOG_PIECES.length; i++) {
      if (diveLogFound.has(i)) continue;
      const piece = DIVE_LOG_PIECES[i];
      const dx = scubaPlayer.x - piece.x;
      const dy = scubaPlayer.y - piece.y;
      if (dx * dx + dy * dy < 2500) { // 50px proximity
        if (keys['KeyT']) {
          keys['KeyT'] = false;
          diveLogFound.add(i);
          score += POINTS.DIVE_LOG_PIECE;
          addPopup(player.x, player.y - 40, '+' + POINTS.DIVE_LOG_PIECE + ' ' + piece.year + ' found!', '#fbbf24');
          playChaChing();
          if (diveLogFound.size === DIVE_LOG_PIECES.length) {
            // All 5 pieces collected — bonus and show timeline
            score += POINTS.DIVE_LOG_BONUS;
            addPopup(player.x, player.y - 60, '+' + POINTS.DIVE_LOG_BONUS + ' Timeline Complete!', '#f59e0b');
            diveLogShowingTimeline = true;
            diveLogTimelineTimer = gameTime;
          }
        }
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
            addFactToNotebook(text, 6); // Oriental level
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
      awardAchievement('marine_biologist');
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

  // Hospital delivery minigame
  if (currentScene === Scene.HOSPITAL) {

    // Stage 1: PREP ROOM — Press C at 3 stations to prepare supplies
    if (hospitalStage === 'prep') {
      if (keys['KeyC']) {
        keys['KeyC'] = false;
        hospitalPrepStations++;
        addPopup(player.x, player.y - 30, 'Station ready!', '#60a5fa');
        if (hospitalPrepStations >= 3) {
          hospitalStage = 'vitals';
          hospitalProgress = 0;
          hospitalVitalsZone = 0;
          addPopup(player.x, player.y - 40, 'Room prepared! Monitor vitals...', '#22c55e');
        }
      }
    }

    // Stage 2: VITALS — Heartbeat oscillates, press Space when in green zone
    else if (hospitalStage === 'vitals') {
      hospitalProgress += dt;
      hospitalVitalsZone = Math.sin(hospitalProgress / 400) * 0.5 + 0.5;

      if (keys['Space']) {
        keys['Space'] = false;
        if (hospitalVitalsZone > 0.35 && hospitalVitalsZone < 0.65) {
          hospitalStage = 'breathing';
          hospitalProgress = 0;
          hospitalBreathingHits = 0;
          hospitalBreathingPhase = 0;
          addPopup(player.x, player.y - 40, 'Vitals stable! Coach breathing...', '#22c55e');
          playChaChing();
        } else {
          hospitalProgress = 0;
          addPopup(player.x, player.y - 40, 'Missed! Try again...', '#ef4444');
        }
      }
    }

    // Stage 3: BREATHING — Rhythmic button presses in sync with indicator
    else if (hospitalStage === 'breathing') {
      hospitalProgress += dt;
      hospitalBreathingPhase = (hospitalProgress % 2000) / 2000;

      if (keys['Space']) {
        keys['Space'] = false;
        const nearPeak = hospitalBreathingPhase < 0.15 || hospitalBreathingPhase > 0.85;
        if (nearPeak) {
          hospitalBreathingHits++;
          addPopup(player.x, player.y - 30, 'Good rhythm!', '#22c55e');
          if (hospitalBreathingHits >= 5) {
            hospitalStage = 'delivery';
            hospitalProgress = 0;
            hospitalDeliveryPower = 0;
            addPopup(player.x, player.y - 40, 'Ready to deliver!', '#fbbf24');
            playChaChing();
          }
        } else {
          addPopup(player.x, player.y - 30, 'Off beat!', '#f59e0b');
        }
      }
    }

    // Stage 4: DELIVERY — Hold Space to build power, release at right moment
    else if (hospitalStage === 'delivery') {
      hospitalProgress += dt;
      if (keys['Space']) {
        hospitalDeliveryPower = Math.min(1, hospitalDeliveryPower + 0.012);
      } else if (hospitalDeliveryPower > 0) {
        if (hospitalDeliveryPower > 0.7 && hospitalDeliveryPower < 0.95) {
          hospitalStage = 'celebrate';
          hospitalProgress = 0;
          hospitalDelivered = true;
          score += 200;
          addPopup(player.x, player.y - 40, '+200 Baby Kit is here!', '#f472b6');
          playChaChing();
        } else if (hospitalDeliveryPower > 0.4) {
          hospitalStage = 'celebrate';
          hospitalProgress = 0;
          hospitalDelivered = true;
          score += 100;
          addPopup(player.x, player.y - 40, '+100 Welcome Kit!', '#f472b6');
          playChaChing();
        } else {
          hospitalDeliveryPower = 0;
          addPopup(player.x, player.y - 40, 'More push needed!', '#ef4444');
        }
      }
    }

    // Stage 5: CELEBRATION — brief confetti moment, then color pick
    else if (hospitalStage === 'celebrate') {
      hospitalProgress += dt;
      if (hospitalProgress > 3000) {
        hospitalStage = 'color_pick';
        hospitalProgress = 0;
      }
    }

    // Stage 6: COLOR PICK — Choose Kit's fur color
    else if (hospitalStage === 'color_pick') {
      const kitColors = ['#fda4af','#93c5fd','#86efac','#fde047','#c4b5fd','#fdba74','#f0abfc','#67e8f9'];
      for (let i = 0; i < 8; i++) {
        if (keys['Digit' + (i + 1)]) {
          keys['Digit' + (i + 1)] = false;
          kitFurColor = kitColors[i];
          hospitalStage = 'name_pick';
          kitNameInput = '';
          break;
        }
      }
      if (keys['Enter']) {
        keys['Enter'] = false;
        hospitalStage = 'name_pick';
        kitNameInput = '';
      }
    }

    // Stage 7: NAME PICK — Name the baby
    else if (hospitalStage === 'name_pick') {
      // Name input is handled by keydown listener (kitNameTyping)
      if (keys['Enter']) {
        keys['Enter'] = false;
        kitName = kitNameInput.trim() || 'Kit';
        hasStroller = true;
        currentScene = null;
        player.y = GROUND_Y;
        player.vy = 0;
        player.onGround = true;
        addPopup(player.x, player.y - 40, kitName + ' says meow!', kitFurColor);
      }
    }

    return;
  }

  // FAO Schwarz — giant floor piano (play Twinkle Twinkle)
  if (currentScene === Scene.FAO_SCHWARZ) {
    // Pause background music while on the piano
    if (currentMusicId) {
      const musicEl = document.getElementById(currentMusicId);
      if (musicEl && !musicEl.paused && !muted) musicEl.pause();
    }
    // Move between keys
    if (keys['ArrowLeft']) { keys['ArrowLeft'] = false; faoPlayerX = Math.max(0, faoPlayerX - 1); }
    if (keys['ArrowRight']) { keys['ArrowRight'] = false; faoPlayerX = Math.min(6, faoPlayerX + 1); }
    if (faoNoteTimer > 0) faoNoteTimer -= dt;
    // Space bar plays the current key
    if (keys['Space'] && !faoComplete) {
      keys['Space'] = false;
      faoPlayNote(faoPlayerX);
      faoNoteTimer = 400;
      faoMelody.push(faoPlayerX);
      // Check if the note matches the expected next note
      const idx = faoMelody.length - 1;
      if (faoPlayerX === FAO_MELODY_TARGET[idx]) {
        addPopup(player.x, player.y - 30, '\u266A', '#4ade80');
      } else {
        addPopup(player.x, player.y - 30, '\u2717', '#ef4444');
      }
      // Check if melody is complete
      if (faoMelody.length >= FAO_MELODY_TARGET.length) {
        let correct = 0;
        for (let i = 0; i < FAO_MELODY_TARGET.length; i++) {
          if (faoMelody[i] === FAO_MELODY_TARGET[i]) correct++;
        }
        faoComplete = true;
        if (correct >= 10) {
          score += 100;
          addPopup(player.x, player.y - 50, '+100 Twinkle Twinkle!', '#f472b6');
          playChaChing();
        } else {
          score += 25;
          addPopup(player.x, player.y - 50, '+25 Good try! ' + correct + '/' + FAO_MELODY_TARGET.length, '#fbbf24');
        }
      }
    }
    // Exit — resume music
    if (keys['Enter']) {
      keys['Enter'] = false;
      currentScene = null;
      faoComplete = false;
      // Resume music
      if (currentMusicId && !muted) {
        const musicEl = document.getElementById(currentMusicId);
        if (musicEl) ensureLoaded(musicEl).then(() => musicEl.play().catch(() => {}));
      }
    }
    return;
  }

  // Empire State Building — elevator ride
  if (currentScene === Scene.EMPIRE_STATE) {
    if (!empireAtTop) {
      empireElevator = Math.min(100, empireElevator + dt / 30);
      if (empireElevator >= 100) {
        empireAtTop = true;
        score += 50;
        addPopup(player.x, player.y - 40, '+50 Top of the world!', '#fbbf24');
        playChaChing();
      }
    }
    if (keys['Enter']) { keys['Enter'] = false; currentScene = null; }
    return;
  }

  // 30 Rock — dance sequence
  if (currentScene === Scene.THIRTY_ROCK) {
    if (thirtyRockDance.active) {
      thirtyRockDance.timer += dt;
      if (thirtyRockDance.showing) {
        if (thirtyRockDance.timer > 3000) {
          thirtyRockDance.showing = false;
          thirtyRockDance.timer = 0;
        }
      } else {
        // Player input phase — check for matching keys
        const expectedIdx = thirtyRockDance.input.length;
        if (expectedIdx < thirtyRockDance.sequence.length) {
          for (const k of ['ArrowLeft','ArrowRight','ArrowUp','Space']) {
            if (keys[k]) {
              keys[k] = false;
              thirtyRockDance.input.push(k);
              if (k === thirtyRockDance.sequence[expectedIdx]) {
                thirtyRockDance.score++;
                addPopup(player.x, player.y - 30, 'Hit!', '#4ade80');
              } else {
                addPopup(player.x, player.y - 30, 'Miss!', '#ef4444');
              }
              break;
            }
          }
        }
        if (thirtyRockDance.input.length >= thirtyRockDance.sequence.length) {
          thirtyRockDance.active = false;
          const pts = thirtyRockDance.score * 15;
          score += pts;
          addPopup(player.x, player.y - 40, '+' + pts + ' Great show!', '#fbbf24');
          if (pts > 0) playChaChing();
        }
        // Timeout
        if (thirtyRockDance.timer > 8000) {
          thirtyRockDance.active = false;
          addPopup(player.x, player.y - 40, 'Time\'s up!', '#94a3b8');
        }
      }
    }
    if (keys['Enter'] && !thirtyRockDance.active) { keys['Enter'] = false; currentScene = null; }
    return;
  }

  // Grand Central — whispering gallery
  if (currentScene === Scene.GRAND_CENTRAL) {
    if (!grandCentralWhisper && keys['KeyW']) {
      keys['KeyW'] = false;
      const whispers = ['I love yarn!', 'Sparkle forever!', 'Meow meow meow!', 'Pizza is life!', 'NYC is magical!'];
      grandCentralWhisper = whispers[Math.floor(Math.random() * whispers.length)];
      score += 15;
      addPopup(player.x, player.y - 40, '+15 Echo!', '#a78bfa');
    }
    // Enter telegram office
    if (keys['KeyT']) {
      keys['KeyT'] = false;
      currentScene = Scene.TELEGRAM;
      telegramActive = false;
      telegramComplete = false;
      telegramTyped = '';
      telegramErrors = 0;
      grandCentralWhisper = '';
    }
    if (keys['Enter']) { keys['Enter'] = false; currentScene = null; grandCentralWhisper = ''; }
    return;
  }

  // Grand Central Telegram — typing practice
  if (currentScene === Scene.TELEGRAM) {
    if (!telegramActive && !telegramComplete) {
      // Start a new telegram when player presses Enter
      if (keys['Enter']) {
        keys['Enter'] = false;
        const range = TELEGRAM_LEVEL_RANGES[telegramLevel];
        const idx = range[0] + Math.floor(Math.random() * (range[1] - range[0]));
        telegramText = TELEGRAM_MESSAGES[idx];
        telegramTyped = '';
        telegramErrors = 0;
        telegramStartTime = performance.now();
        telegramActive = true;
        telegramComplete = false;
        telegramErrorFlash = 0;
      }
      // Change difficulty with left/right
      if (keys['ArrowLeft']) { keys['ArrowLeft'] = false; telegramLevel = Math.max(0, telegramLevel - 1); }
      if (keys['ArrowRight']) { keys['ArrowRight'] = false; telegramLevel = Math.min(2, telegramLevel + 1); }
      // Exit with Escape
      if (keys['Escape']) { keys['Escape'] = false; currentScene = Scene.GRAND_CENTRAL; }
    } else if (telegramActive && !telegramComplete) {
      // Typing is handled by the keydown listener in ui.js
      // Check completion
      if (telegramTyped.length === telegramText.length) {
        telegramComplete = true;
        telegramActive = false;
        const elapsed = (performance.now() - telegramStartTime) / 1000; // seconds
        const words = telegramText.split(' ').length;
        const wpm = Math.round((words / elapsed) * 60);
        const accuracy = Math.round(((telegramText.length - telegramErrors) / telegramText.length) * 100);
        const speedBonus = Math.max(0, Math.min(20, Math.round(wpm / 5)));
        const accuracyBonus = accuracy === 100 ? 10 : 0;
        const pts = POINTS.TELEGRAM_BASE + speedBonus + accuracyBonus;
        score += pts;
        addPopup(player.x, player.y - 40, '+' + pts + ' Telegram sent!', '#fbbf24');
        // Unlock next difficulty after completing current
        if (telegramLevel < 2) telegramLevel++;
      }
      // Allow Escape to cancel current telegram
      if (keys['Escape']) { keys['Escape'] = false; telegramActive = false; telegramTyped = ''; }
    } else if (telegramComplete) {
      // After completion, Enter starts a new telegram or Escape goes back
      if (keys['Enter']) { keys['Enter'] = false; telegramComplete = false; }
      if (keys['Escape']) { keys['Escape'] = false; currentScene = Scene.GRAND_CENTRAL; telegramComplete = false; }
    }
    return;
  }

  // The Met Museum — art gallery
  if (currentScene === Scene.THE_MET) {
    if (artDescActive) {
      // Art description mode — input handled by keydown listener
      return;
    }
    if (keys['ArrowRight']) { keys['ArrowRight'] = false; metPaintingIndex = Math.min(MET_PAINTINGS.length - 1, metPaintingIndex + 1); }
    if (keys['ArrowLeft']) { keys['ArrowLeft'] = false; metPaintingIndex = Math.max(0, metPaintingIndex - 1); }
    if (keys['KeyD']) {
      keys['KeyD'] = false;
      artDescActive = true;
      artDescText = '';
      artDescPaintingIdx = metPaintingIndex;
    }
    if (keys['Enter']) {
      keys['Enter'] = false;
      score += 10;
      addPopup(player.x, player.y - 40, '+10 Art appreciated!', '#c084fc');
      currentScene = null;
    }
    return;
  }

  // NASA Museum — aircraft and spacecraft exhibit
  if (currentScene === Scene.NASA_MUSEUM) {
    if (keys['Enter']) {
      keys['Enter'] = false;
      score += 30;
      addPopup(player.x, player.y - 40, '+30 Space history!', '#60a5fa');
      currentScene = null;
    }
    return;
  }

  // Mission Control typing minigame
  if (currentScene === Scene.MISSION_CONTROL) {
    const mc = missionControl;
    if (mc.complete || mc.failed) {
      // Show result then exit
      mc.showResult += 16;
      if (mc.complete) {
        mc.rocketY += 3; // animate rocket going up
      }
      if (mc.showResult > 3000 || keys['Enter']) {
        keys['Enter'] = false;
        currentScene = null;
        mc.active = false;
      }
    } else {
      // Count down timer
      mc.timeLeft -= 16;
      if (mc.timeLeft <= 0) {
        mc.timeLeft = 0;
        mc.failed = true;
        mc.showResult = 0;
      }
      // Typing is handled by keydown listener in ui.js
      // Check if current command is complete
      const currentCmd = MISSION_COMMANDS[mc.round];
      if (mc.typed === currentCmd) {
        // Command completed!
        score += 30;
        addPopup(player.x, player.y - 40, '+30 ' + currentCmd + '!', '#22c55e');
        playChaChing();
        mc.round++;
        mc.typed = '';
        if (mc.round >= MISSION_COMMANDS.length) {
          // All commands done!
          mc.complete = true;
          mc.showResult = 0;
          const elapsed = 60000 - mc.timeLeft;
          if (elapsed <= 60000) {
            // Under time limit — bonus!
            score += 100;
            addPopup(player.x, player.y - 60, '+100 All commands! LIFTOFF!', '#fbbf24');
          }
        }
      }
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
    // Picnic with Kit
    if (hasStroller && keys['KeyP'] && !picnic.active) {
      keys['KeyP'] = false;
      picnic.active = true;
      picnic.fed = 0;
      picnic.feeding = false;
      picnic.feedTimer = 0;
    }
    if (picnic.active) {
      if (picnic.feeding) {
        picnic.feedTimer += dt;
        if (picnic.feedTimer >= 800) {
          picnic.feeding = false;
          picnic.feedTimer = 0;
          picnic.fed++;
          score += 30;
          addPopup(player.x, player.y - 40, '+30 ' + kitName + ' loves it!', '#f472b6');
          playChaChing();
          if (picnic.fed >= 3) {
            score += 100;
            addPopup(player.x, player.y - 60, '+100 Picnic complete!', '#22c55e');
            picnic.active = false;
            kitParkBonus = true;
          }
        }
      } else if (keys['KeyF']) {
        keys['KeyF'] = false;
        picnic.feeding = true;
        picnic.feedTimer = 0;
      }
    }
    if (keys['Enter'] && !picnic.feeding) {
      keys['Enter'] = false;
      currentScene = null;
      picnic.active = false;
      player.y = GROUND_Y;
      player.vy = 0;
      player.onGround = true;
    }
    return;
  }

  if (currentScene === Scene.PANTHEON) {
    // Scroll transcription minigame
    if (scrollActive) {
      if (scrollFlashRed > 0) scrollFlashRed -= dt;
      if (scrollComplete) {
        scrollFactTimer += dt;
        if (scrollFactTimer > 3000) {
          // Move to next scroll or finish
          scrollRound++;
          if (scrollRound >= SCROLL_TEXTS.length) {
            scrollAllDone = true;
            scrollActive = false;
            if (!scrollBonusAwarded) {
              scrollBonusAwarded = true;
              score += POINTS.SCROLL_BONUS;
              addPopup(player.x, player.y - 40, '+' + POINTS.SCROLL_BONUS + ' All scrolls complete!', '#fbbf24');
              playChaChing();
            }
          } else {
            scrollText = SCROLL_TEXTS[scrollRound].text;
            scrollTyped = 0;
            scrollErrors = 0;
            scrollComplete = false;
            scrollShowFact = false;
            scrollFactTimer = 0;
          }
        }
      }
      // Enter during fact display skips wait
      if (scrollComplete && keys['Enter']) {
        keys['Enter'] = false;
        scrollFactTimer = 3001;
      }
      // Escape to cancel scroll mode
      if (keys['Escape']) {
        keys['Escape'] = false;
        scrollActive = false;
      }
    } else {
      // T starts scroll transcription (if not all done)
      if (keys['KeyT'] && !scrollAllDone) {
        keys['KeyT'] = false;
        scrollActive = true;
        scrollRound = 0;
        scrollText = SCROLL_TEXTS[0].text;
        scrollTyped = 0;
        scrollErrors = 0;
        scrollComplete = false;
        scrollShowFact = false;
        scrollFactTimer = 0;
        scrollFlashRed = 0;
        scrollTotalErrors = 0;
        scrollBonusAwarded = false;
        scrollStartTime = Date.now();
      }
      if (keys['Enter']) {
        keys['Enter'] = false;
        currentScene = null;
        player.y = GROUND_Y;
        player.vy = 0;
        player.onGround = true;
      }
    }
    // Animate piece placement
    if (pantheonPuzzle.animating) {
      pantheonPuzzle.animProgress += dt / 600; // ~0.6s animation
      if (pantheonPuzzle.animProgress >= 1) {
        pantheonPuzzle.animating = false;
        pantheonPuzzle.animProgress = 0;
      }
      return;
    }
    // Feedback timer
    if (pantheonPuzzle.feedbackTimer > 0) {
      pantheonPuzzle.feedbackTimer -= dt;
      if (pantheonPuzzle.feedbackTimer <= 0) pantheonPuzzle.feedback = '';
    }
    // Start puzzle with A
    if (!pantheonPuzzle.active && !scrollActive && keys['KeyA']) {
      keys['KeyA'] = false;
      pantheonPuzzle.active = true;
      pantheonPuzzle.placed = 0;
      pantheonPuzzle.feedback = '';
      pantheonPuzzle.complete = false;
    }
    // Puzzle piece placement with 1-5
    if (pantheonPuzzle.active && !pantheonPuzzle.complete) {
      for (let i = 1; i <= 5; i++) {
        if (keys['Digit' + i]) {
          keys['Digit' + i] = false;
          if (i === pantheonPuzzle.placed + 1) {
            // Correct piece
            pantheonPuzzle.animating = true;
            pantheonPuzzle.animProgress = 0;
            pantheonPuzzle.placed = i;
            pantheonPuzzle.feedback = PANTHEON_PIECES[i - 1].fact;
            pantheonPuzzle.feedbackTimer = 5000;
            if (i === 5) {
              // Puzzle complete
              pantheonPuzzle.complete = true;
              score += POINTS.PANTHEON_PUZZLE;
              addPopup(player.x, player.y - 40, '+' + POINTS.PANTHEON_PUZZLE + ' Master Architect!', '#fbbf24');
              playChaChing();
            }
          } else {
            // Wrong order
            pantheonPuzzle.feedback = 'Try a lower piece first!';
            pantheonPuzzle.feedbackTimer = 2000;
          }
          break;
        }
      }
    }
    // Exit with Enter (when not in scroll mode)
    if (!scrollActive && keys['Enter']) {
      keys['Enter'] = false;
      pantheonPuzzle.active = false;
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

  // Geometry minigame update (overlay — blocks normal movement)
  if (geometryActive) {
    updateGeometryMinigame(dt);
    hud.score.textContent = score;
    return;
  }

  // Movement (blocked during hotdog math, light show and fuel calculator overlay)
  player.vx = 0;
  if (journalActive) {
    // Block all movement/jumping during journal
  } else {
  const effectiveMoveSpeed = currentLevel === 13 ? MOON_MOVE_SPEED : MOVE_SPEED;
  if (!hotdogMath.active && !lightShowActive && !fuelCalcActive && keys['ArrowLeft']) { player.vx = -effectiveMoveSpeed; player.facing = -1; }
  if (!hotdogMath.active && !lightShowActive && !fuelCalcActive && keys['ArrowRight']) { player.vx = effectiveMoveSpeed; player.facing = 1; }
  if (keys['ArrowUp']) { player.vx += 0; } // up on land is no-op for now
  if (keys['ArrowDown']) { player.vx += 0; }

  // Jump (blocked during light show and fuel calculator)
  if (!lightShowActive && !fuelCalcActive && keys['Space'] && player.onGround) {
    player.vy = currentLevel === 13 ? MOON_JUMP_VEL : JUMP_VEL;
    player.onGround = false;
    playMeow();
  }
  } // end journalActive else block

  // Flight levels: override velocity and gravity before physics
  if (currentLevel === 10) {
    player.vx = Math.max(player.vx, FLIGHT_SPEED);
    if (keys['ArrowUp']) player.y = Math.max(60, player.y - 3);
    if (keys['ArrowDown']) player.y = Math.min(GROUND_Y - 80, player.y + 3);
    player.vy = 0;
    player.onGround = false;
  }
  if (currentLevel === 12) {
    player.vx = Math.max(player.vx, SPACE_SPEED);
    if (keys['ArrowUp']) player.y = Math.max(40, player.y - 3.5);
    if (keys['ArrowDown']) player.y = Math.min(canvas.height - 40, player.y + 3.5);
    if (keys['ArrowLeft']) player.vx = Math.max(SPACE_SPEED - 1.5, player.vx - 0.5);
    if (keys['ArrowRight']) player.vx = Math.min(SPACE_SPEED + 2, player.vx + 0.3);
    player.vy = 0;
    player.onGround = false;
  }

  // Physics
  const effectiveGravity = currentLevel === 13 ? MOON_GRAVITY : GRAVITY;
  player.vy = applyGravity(player.vy, effectiveGravity);
  player.x += player.vx;
  player.y += player.vy;

  // Moon: prevent jumping off the top of the screen
  if (currentLevel === 13 && player.y < 40) {
    player.y = 40;
    player.vy = 0;
  }

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
    // Big glitter celebration from the horn (cap at 120 particles)
    if (!prefersReducedMotion && glitterParticles.length < 120) {
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

  // Bug net pickup (level 1 — near flower garden)
  let nearBugNet = false;
  if (currentLevel === 1 && !hasBugNet && Math.abs(player.x - BUG_NET_POS.x) < INTERACT_RANGE) {
    nearBugNet = true;
    if (keys['Space']) {
      keys['Space'] = false;
      hasBugNet = true;
      addPopup(BUG_NET_POS.x, GROUND_Y - 60, 'Got Bug Net!', '#a78bfa');
    }
  }

  // Bug catcher activation (level 1 — B key when you have the net)
  if (currentLevel === 1 && hasBugNet && !bugCatcherActive && !bugCatcherFinished && keys['KeyB']) {
    keys['KeyB'] = false;
    bugCatcherActive = true;
    bugCatcherRound = 0;
    bugCatcherCorrect = 0;
    bugCatcherWrong = 0;
    bugCatcherFinished = false;
    startBugCatcherRound();
  }

  // Update bug catcher minigame
  if (bugCatcherActive) {
    updateBugCatcher(dt);
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

  // Hospital entry (level 2 — NYC)
  const nearHospital = currentLevel === 3 && Math.abs(player.x - HOSPITAL_POS.x) < BUILDING_RANGE && !hospitalDelivered;
  if (keys['Enter'] && nearHospital && currentScene === null) {
    keys['Enter'] = false;
    currentScene = Scene.HOSPITAL;
    hospitalStage = 'prep';
    hospitalProgress = 0;
    hospitalPrepStations = 0;
  }

  // FAO Schwarz entry
  const nearFao = currentLevel === 3 && Math.abs(player.x - FAO_SCHWARZ_POS.x) < BUILDING_RANGE;
  if (keys['Enter'] && nearFao && currentScene === null) {
    keys['Enter'] = false;
    currentScene = Scene.FAO_SCHWARZ;
    faoPlayerX = 0;
    faoMelodyScore = 0;
    faoMelody = [];
    faoComplete = false;
  }
  // Empire State Building entry
  const nearEmpire = currentLevel === 3 && Math.abs(player.x - EMPIRE_STATE_POS.x) < BUILDING_RANGE;
  if (keys['Enter'] && nearEmpire && currentScene === null) {
    keys['Enter'] = false;
    currentScene = Scene.EMPIRE_STATE;
    empireElevator = 0;
    empireAtTop = false;
  }
  // 30 Rock entry
  const nearThirtyRock = currentLevel === 3 && Math.abs(player.x - THIRTY_ROCK_POS.x) < BUILDING_RANGE;
  if (keys['Enter'] && nearThirtyRock && currentScene === null) {
    keys['Enter'] = false;
    currentScene = Scene.THIRTY_ROCK;
    thirtyRockDance = { active: true, sequence: [], input: [], timer: 0, score: 0, showing: true };
    for (let i = 0; i < 6; i++) thirtyRockDance.sequence.push(['ArrowLeft','ArrowRight','ArrowUp','Space'][Math.floor(Math.random() * 4)]);
  }
  // Grand Central entry
  const nearGrandCentral = currentLevel === 3 && Math.abs(player.x - GRAND_CENTRAL_POS.x) < BUILDING_RANGE;
  if (keys['Enter'] && nearGrandCentral && currentScene === null) {
    keys['Enter'] = false;
    currentScene = Scene.GRAND_CENTRAL;
    grandCentralWhisper = '';
  }
  // Met Museum entry
  const nearMet = currentLevel === 3 && Math.abs(player.x - MET_MUSEUM_POS.x) < BUILDING_RANGE;
  if (keys['Enter'] && nearMet && currentScene === null) {
    keys['Enter'] = false;
    currentScene = Scene.THE_MET;
    metPaintingIndex = 0;
  }

  // Hot dog stands (level 3 — math minigame with H key)
  let nearHotdog = false;
  if (currentLevel === 3 && !hotdogMath.active) {
    for (const hx of HOTDOG_POSITIONS) {
      if (Math.abs(player.x - hx) < INTERACT_RANGE) {
        nearHotdog = true;
        if (keys['KeyH'] && !hotdogMath.complete) {
          keys['KeyH'] = false;
          hotdogMath.active = true;
          hotdogMath.round = 0;
          hotdogMath.price = HOTDOG_MATH_PRICES[0];
          hotdogMath.paid = 0;
          hotdogMath.feedback = '';
          hotdogMath.feedbackTimer = 0;
          hotdogMath.vendorX = hx;
        }
        break;
      }
    }
  }

  // Hot dog math minigame update
  if (hotdogMath.active) {
    updateHotdogMath();
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
        // Enter gelato shop minigame
        if (keys['Enter'] && currentScene === null && !gelatoComplete) {
          keys['Enter'] = false;
          currentScene = Scene.GELATO_SHOP;
          gelatoRound = 0;
          gelatoCup = [];
          gelatoOrder = GELATO_ORDERS[0];
          gelatoMessage = '';
          gelatoMsgTimer = 0;
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
        pantheonPuzzle.active = false;
        pantheonPuzzle.placed = 0;
        pantheonPuzzle.feedback = '';
        pantheonPuzzle.feedbackTimer = 0;
        pantheonPuzzle.animating = false;
        pantheonPuzzle.animProgress = 0;
        pantheonPuzzle.complete = false;
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

  // Alps interactions (level 7) — first-person downhill view
  let nearChalet = false;
  if (currentLevel === 7) {
    // Equipment selection phase
    if (alpsChoosing) {
      player.vx = 0;
      if (keys['Digit1'] || keys['KeyS']) {
        keys['Digit1'] = false; keys['KeyS'] = false;
        alpsEquipment = 'skis';
        alpsChoosing = false;
        skiing = true;
        addPopup(player.x, player.y - 40, 'Skis equipped!', '#60a5fa');
      }
      if (keys['Digit2'] || keys['KeyB']) {
        keys['Digit2'] = false; keys['KeyB'] = false;
        alpsEquipment = 'snowboard';
        alpsChoosing = false;
        skiing = true;
        addPopup(player.x, player.y - 40, 'Snowboard equipped!', '#a78bfa');
      }
    }

    if (alpsChoosing) {
      // Skip game logic while choosing equipment
    } else {
      // Advance down the mountain
      alpsScrollZ += ALPS_FP_SPEED;
      player.vx = 0; // no world-space movement — it's all in the FP view

      // Left/right lane movement
      const laneSpeed = alpsEquipment === 'snowboard' ? ALPS_LANE_SPEED * 1.3 : ALPS_LANE_SPEED;
      if (keys['ArrowLeft']) alpsPlayerLane = Math.max(-200, alpsPlayerLane - laneSpeed);
      if (keys['ArrowRight']) alpsPlayerLane = Math.min(200, alpsPlayerLane + laneSpeed);
      // Friction — drift back toward center slightly
      if (!keys['ArrowLeft'] && !keys['ArrowRight']) alpsPlayerLane *= 0.98;

      // Jump off cornices
      if (keys['Space'] && !alpsAirborne) {
        // Check if near a cornice z-position
        for (const c of level5.cornices) {
          if (Math.abs(alpsScrollZ - c.z) < 40) {
            alpsAirborne = true;
            alpsAirTimer = 0;
            player.vy = JUMP_VEL;
            break;
          }
        }
      }
      if (alpsAirborne) {
        alpsAirTimer += dt;
        if (alpsAirTimer >= ALPS_AIR_DURATION) {
          alpsAirborne = false;
          alpsAirTimer = 0;
        }
      }

      // Diamond collection — check z-proximity and lane proximity
      for (const d of level5.diamonds) {
        if (d.collected) continue;
        const dz = d.z - alpsScrollZ;
        if (dz > -20 && dz < 40) {
          const dlane = d.lane - alpsPlayerLane;
          // Wider pickup when airborne (jumping through diamond arcs)
          const pickupW = alpsAirborne ? 60 : 35;
          if (Math.abs(dlane) < pickupW) {
            d.collected = true;
            diamondCount++;
            score += POINTS.DIAMOND;
            addPopup(player.x, player.y - 40, '+' + POINTS.DIAMOND + ' Diamond!', '#60a5fa');
            playChaChing();
          }
        }
      }

      // Tree collision — check z-proximity and lane proximity
      for (const tree of level5.trees) {
        if (tree.hit) continue;
        const tz = tree.z - alpsScrollZ;
        if (tz > -10 && tz < 20 && !alpsAirborne) {
          const tlane = tree.lane - alpsPlayerLane;
          if (Math.abs(tlane) < 25) {
            tree.hit = true;
            score = Math.max(0, score - POINTS.TREE_HIT);
            addPopup(player.x, player.y - 40, '-' + POINTS.TREE_HIT + ' Ouch!', '#ef4444');
          }
        }
      }

      // End of run — reach the chalet
      if (alpsScrollZ >= ALPS_RUN_LENGTH) {
        nearChalet = true;
        skiing = false;
        if (keys['Enter']) {
          keys['Enter'] = false;
          currentScene = Scene.CHALET;
          marshmallowAngle = Math.PI / 5;
          crossfadeToMusic(CHALET_MUSIC_ID);
        }
      }
    } // end else (not choosing)
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
        diveLogFound = new Set();
        diveLogShowingTimeline = false;
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
  let nearGeometry = false;
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
      // Roast marshmallow near lit campfire (not during light show)
      if (campfire.lit && !lightShowActive && !roasting.active && !roasting.done && keys['KeyR']) {
        keys['KeyR'] = false;
        roasting.active = true;
        roasting.progress = 0;
        roasting.done = false;
      }
      // Enter light show mode (L key near lit campfire)
      if (campfire.lit && !lightShowActive && !roasting.active && keys['KeyL']) {
        keys['KeyL'] = false;
        lightShowActive = true;
        lightShowProgram = '';
        lightShowRepeat = false;
        lightShowRunning = false;
        lightShowStep = 0;
        lightShowTimer = 0;
      }
      // Story Typing minigame — press Y near lit campfire
      if (campfire.lit && !lightShowActive && !roasting.active && !storyTyping.active && !geometryActive && keys['KeyY']) {
        keys['KeyY'] = false;
        if (storyTyping.sessionPick < 0) storyTyping.sessionPick = Math.floor(Math.random() * CAMPFIRE_STORIES.length);
        storyTyping.active = true;
        storyTyping.storyIndex = storyTyping.sessionPick;
        storyTyping.typed = 0;
        storyTyping.errors = 0;
        storyTyping.startTime = performance.now();
        storyTyping.complete = false;
        storyTyping.completeTimer = 0;
      }
      // Geometry minigame — press G near fire pit with 5+ sticks
      if (stickCount >= 5 && !geometryActive && !geometryAllComplete) nearGeometry = true;
      if (nearGeometry && keys['KeyG']) {
        keys['KeyG'] = false;
        geometryActive = true;
        geometryShapeIndex = 0;
        geometrySticks = [];
        geometryAngle = 0;
        geometryComplete = false;
        geometryCompletionTimer = 0;
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
    // Light show minigame update
    if (lightShowActive) {
      updateLightShowMinigame(dt);
    }
    // Story typing completion timer
    if (storyTyping.active && storyTyping.complete) {
      storyTyping.completeTimer += dt;
      if (storyTyping.completeTimer >= 3000) {
        storyTyping.active = false;
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
    if (currentScene === Scene.WATERING_HOLE) {
      wateringHoleTimer += dt;
      // Crocodile appears after 3 seconds
      if (wateringHoleTimer >= 3000 && !crocVisible) {
        crocVisible = true;
        crocSpeech.text = crocDialogs[Math.floor(Math.random() * crocDialogs.length)];
        crocSpeech.timer = TIMING.SPEECH_BUBBLE_LIFE;
      }
      // Cycle croc dialogue
      if (crocVisible) {
        crocSpeech.timer -= dt;
        if (crocSpeech.timer <= 0) {
          crocSpeech.text = crocDialogs[Math.floor(Math.random() * crocDialogs.length)];
          crocSpeech.timer = TIMING.SPEECH_BUBBLE_LIFE;
        }
      }
      // Parrot arrives after 5 seconds
      if (wateringHoleTimer >= 5000 && parrotState === 'hidden') {
        parrotState = 'arriving';
        parrotArrivalTimer = 0;
      }
      if (parrotState === 'arriving') {
        parrotArrivalTimer += dt;
        if (parrotArrivalTimer >= 1500) {
          parrotState = 'shoulder';
          addPopup(player.x, player.y - 60, 'A parrot landed on your shoulder!', '#22c55e');
        }
      }
      // Press N to name the parrot
      if (parrotState === 'shoulder' && keys['KeyN']) {
        keys['KeyN'] = false;
        parrotState = 'naming';
        const name = prompt('Name your parrot:');
        if (name && name.trim()) {
          parrotName = name.trim().slice(0, 16);
          parrotState = 'named';
          addPopup(player.x, player.y - 60, parrotName + ' will fly with you!', '#fbbf24');
          score += 25;
        } else {
          parrotState = 'shoulder';
        }
      }
      // Exit watering hole
      if (keys['KeyS']) {
        keys['KeyS'] = false;
        currentScene = null;
        wateringHoleTimer = 0;
        crocVisible = false;
        crocSpeech.timer = 0;
        // If parrot was on shoulder but not named, it flies away
        if (parrotState === 'shoulder' || parrotState === 'arriving') {
          parrotState = 'hidden';
        }
      }
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

    // Photo gallery toggle — press V to view/close (not during journal)
    if (keys['KeyV'] && !journalActive) {
      keys['KeyV'] = false;
      photoGalleryOpen = !photoGalleryOpen;
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
            // Activate field journal entry if not already completed
            if (JOURNAL_ENTRIES[animal] && !journalCompleted.has(animal)) {
              journalActive = true;
              journalAnimal = animal;
              journalResult = '';
              journalResultTimer = 0;
            }
            // Bonus for all 5 species
            if (safariPhotoCount >= 5) {
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
    if (!safariPhotography.active && !journalActive && keys['KeyP']) {
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
      if (Math.abs(player.x - CHEETAH_POS.x) < 80 && !ridingCheetah) targetAnimal = 'cheetah';
      if (targetAnimal) {
        safariPhotography.active = true;
        safariPhotography.timer = 0;
        safariPhotography.targetAnimal = targetAnimal;
        playSfx('sfxCameraShutter');
      }
    }

    // Safari Field Journal — handle answer input
    if (journalActive) {
      if (journalResult === '') {
        // Waiting for player to pick 1, 2, or 3
        for (let i = 0; i < 3; i++) {
          if (keys['Digit' + (i + 1)]) {
            keys['Digit' + (i + 1)] = false;
            const entry = JOURNAL_ENTRIES[journalAnimal];
            if (i === entry.correct) {
              journalResult = 'correct';
              journalCompleted.add(journalAnimal);
              score += POINTS.JOURNAL_BONUS;
              addPopup(player.x, player.y - 40, '+' + POINTS.JOURNAL_BONUS + ' Journal complete!', '#4ade80');
              playChaChing();
            } else {
              journalResult = 'wrong';
            }
            journalResultTimer = JOURNAL_RESULT_DURATION;
            break;
          }
        }
      } else {
        // Showing result feedback
        journalResultTimer -= dt;
        if (journalResultTimer <= 0) {
          if (journalResult === 'wrong') {
            // Let them try again
            journalResult = '';
          } else {
            // Correct — close journal
            journalActive = false;
            journalAnimal = '';
          }
        }
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

  // ── Cape Canaveral interactions (level 11) ──
  if (currentLevel === 11) {
    // NASA Museum entry
    if (Math.abs(player.x - NASA_BUILDING_POS.x - NASA_BUILDING_POS.w / 2) < BUILDING_RANGE && keys['Enter'] && currentScene === null) {
      keys['Enter'] = false;
      currentScene = Scene.NASA_MUSEUM;
    }
    // Mission Control entry
    if (Math.abs(player.x - MISSION_CONTROL_POS.x - MISSION_CONTROL_POS.w / 2) < BUILDING_RANGE && keys['Enter'] && currentScene === null) {
      keys['Enter'] = false;
      currentScene = Scene.MISSION_CONTROL;
      missionControl = {
        active: true, round: 0, typed: '', errors: 0,
        startTime: Date.now(), complete: false,
        timeLeft: 60000, failed: false, rocketY: 0, showResult: 0,
      };
    }
    // Space suit
    if (!capeSpaceSuit && Math.abs(player.x - SPACE_SUIT_POS.x) < BUILDING_RANGE && keys['KeyS']) {
      keys['KeyS'] = false;
      capeSpaceSuit = true;
      addPopup(player.x, player.y - 30, 'Space Suit ON!', '#60a5fa');
    }

    // Fuel rocket — start fuel calculator
    if (Math.abs(player.x - ROCKET_POS.x) < BUILDING_RANGE && !capeFueled && !fuelCalcActive) {
      if (keys['KeyP']) {
        keys['KeyP'] = false;
        fuelCalcActive = true;
        fuelCalcProblem = 0;
        fuelCalcAnswer = '';
        fuelCalcCorrect = 0;
        fuelCalcFeedback = '';
        fuelCalcFeedbackTimer = 0;
      }
    }

    // Fuel calculator logic
    if (fuelCalcActive) {
      // Feedback timer
      if (fuelCalcFeedbackTimer > 0) {
        fuelCalcFeedbackTimer -= 16;
        if (fuelCalcFeedbackTimer <= 0) {
          fuelCalcFeedback = '';
          if (fuelCalcCorrect >= 3) {
            // All problems solved — rocket fully fueled!
            fuelCalcActive = false;
            capeFueled = true;
            capeFueling = 3000;
            addPopup(ROCKET_POS.x, GROUND_Y - 200, 'Rocket Fueled!', '#22c55e');
          }
        }
      }
    }

    // Board rocket
    if (capeFueled && capeSpaceSuit && Math.abs(player.x - ROCKET_POS.x) < BUILDING_RANGE && keys['Enter'] && !capeLaunching) {
      keys['Enter'] = false;
      capeLaunching = true;
      currentScene = Scene.CAPE_LAUNCH;
      capeCountdown = 10000;
      capeLaunchPower = 0;
    }
  }

  // Cape Canaveral Launch minigame
  if (currentScene === Scene.CAPE_LAUNCH) {
    capeCountdown -= 16; // ~dt
    if (keys['Space']) {
      capeLaunchPower = Math.min(1, capeLaunchPower + 0.015);
    } else {
      capeLaunchPower = Math.max(0, capeLaunchPower - 0.005);
    }

    if (capeCountdown <= 0) {
      if (capeLaunchPower > 0.7) {
        // Successful launch!
        score += 100;
        addPopup(player.x, player.y - 40, '+100 LIFTOFF!', '#fbbf24');
        currentScene = null;
        capeLaunching = false;
        switchToLevel(12);
      } else {
        // Failed — retry
        capeCountdown = 10000;
        capeLaunchPower = 0;
        addPopup(player.x, player.y - 40, 'Not enough power! Try again!', '#ef4444');
      }
    }
  }

  // ── Space Flight interactions (level 12) ──
  if (currentLevel === 12) {
    // Invulnerability timer
    if (spaceInvulnTimer > 0) spaceInvulnTimer -= 16;

    // Asteroid collision
    for (const ast of level12Space.asteroids) {
      if (ast.hit) continue;
      if (spaceInvulnTimer > 0) continue;
      const dx = player.x - ast.x;
      const dy = player.y - ast.y;
      if (dx * dx + dy * dy < (ast.radius + 15) * (ast.radius + 15)) {
        ast.hit = true;
        score = Math.max(0, score - 20);
        spaceInvulnTimer = 1000; // 1 second invulnerability
        addPopup(ast.x, ast.y, '-20 Asteroid!', '#ef4444');
      }
    }

    // Alien collection
    for (let i = 0; i < level12Space.aliens.length; i++) {
      const alien = level12Space.aliens[i];
      if (alien.collected) continue;
      const dx = player.x - alien.x;
      const dy = player.y - alien.y;
      if (dx * dx + dy * dy < COLLECT_RADIUS_SQ * 2) { // slightly larger radius
        alien.collected = true;
        level12Space.yarnBalls[i].collected = true; // sync
        collectedAlienCount++;
        score += 30;
        addPopup(alien.x, alien.y - 20, '+30 Alien friend!', alien.color);
        playChaChing();
      }
    }

    // Level exit — reach the Moon
    if (player.x > level12Space.worldW - 500 && keys['Enter']) {
      keys['Enter'] = false;
      switchToLevel(13);
    }
  }

  // ── Moon interactions (level 13) ──
  if (currentLevel === 13) {
    // Smoothie Shop entry
    if (Math.abs(player.x - SMOOTHIE_SHOP_POS.x) < BUILDING_RANGE && keys['Enter'] && currentScene === null) {
      keys['Enter'] = false;
      currentScene = Scene.SMOOTHIE_SHOP;
      smoothieIngredients = 0;
      smoothieYogurt = false;
      smoothieBlending = false;
      smoothieProgress = 0;
    }

    // TopGolf entry
    if (Math.abs(player.x - TOPGOLF_POS.x) < BUILDING_RANGE && keys['Enter'] && currentScene === null) {
      keys['Enter'] = false;
      currentScene = Scene.TOPGOLF;
      golfBall.active = false;
      golfAngle = Math.PI / 4;
    }

    // Apollo Landing Site entry
    if (Math.abs(player.x - APOLLO_SITE_POS.x) < BUILDING_RANGE && keys['Enter'] && currentScene === null && !apolloMission.complete) {
      keys['Enter'] = false;
      currentScene = Scene.APOLLO_MISSION;
      apolloMission.active = true;
      apolloMission.step = 0;
      apolloMission.progress = 0;
      apolloMission.rocksCollected = 0;
      apolloMission.bootY = 0;
      apolloMission.stepTimer = 0;
      apolloMission.celebrateTimer = 0;
      // Generate 5 random rock positions spread across the scene
      apolloMission.rockPositions = [];
      for (let i = 0; i < 5; i++) {
        apolloMission.rockPositions.push(-150 + i * 75 + Math.random() * 30);
      }
      apolloMission.rockPlayerX = 0;
    }

    // Game completion at end of level
    if (player.x > level13Moon.worldW - 200 && keys['Enter']) {
      keys['Enter'] = false;
      addPopup(player.x, player.y - 40, 'ADVENTURE COMPLETE! +500', '#fbbf24');
      score += 500;
    }
  }

  // Smoothie Shop minigame
  if (currentScene === Scene.SMOOTHIE_SHOP) {
    if (recipeModeActive) {
      // Recipe Mode logic
      if (recipeComplete) {
        recipeCompleteTimer += 16;
        recipeBlendAnim += 0.3;
        if (recipeCompleteTimer >= 2000) {
          // Move to next round or finish
          if (recipeRound < 2) {
            startRecipeRound(recipeRound + 1);
          } else {
            // All rounds done
            recipeAllDone = true;
            if (recipeSolved === 3) {
              score += 100;
              addPopup(player.x, player.y - 40, '+100 All Recipes Bonus!', '#fbbf24');
              playChaChing();
            }
            recipeModeActive = false;
          }
        }
      } else {
        // Handle number key presses for swapping steps
        const maxStep = recipeSteps.length;
        for (let n = 1; n <= maxStep; n++) {
          const keyCode = 'Digit' + n;
          if (keys[keyCode]) {
            keys[keyCode] = false;
            const idx = n - 1;
            if (recipeFirstSwap === null) {
              recipeFirstSwap = idx;
            } else if (recipeFirstSwap === idx) {
              // Deselect if same step pressed
              recipeFirstSwap = null;
            } else {
              // Swap the two steps
              const tmp = recipeSteps[recipeFirstSwap];
              recipeSteps[recipeFirstSwap] = recipeSteps[idx];
              recipeSteps[idx] = tmp;
              recipeFirstSwap = null;
              // Check if order is now correct
              if (checkRecipeOrder()) {
                recipeComplete = true;
                recipeCompleteTimer = 0;
                recipeSolved++;
                score += 50;
                addPopup(player.x, player.y - 40, '+50 Recipe Fixed!', '#22c55e');
                playChaChing();
              }
            }
          }
        }
      }
      // Exit recipe mode with Escape
      if (keys['Escape']) {
        keys['Escape'] = false;
        recipeModeActive = false;
      }
      // Exit shop with Enter when not completing
      if (keys['Enter'] && !recipeComplete) {
        keys['Enter'] = false;
        recipeModeActive = false;
      }
    } else {
      // Normal smoothie shop mode
      if (keys['KeyR'] && !smoothieBlending && !recipeAllDone) {
        keys['KeyR'] = false;
        recipeModeActive = true;
        recipeSolved = 0;
        startRecipeRound(0);
      }
      if (keys['KeyC'] && !smoothieBlending && smoothieIngredients < 3) {
        keys['KeyC'] = false;
        smoothieIngredients++;
        addPopup(player.x, player.y - 30, 'Added fruit!', '#f59e0b');
      }
      if (keys['KeyY'] && !smoothieYogurt && !smoothieBlending) {
        keys['KeyY'] = false;
        smoothieYogurt = true;
        addPopup(player.x, player.y - 30, 'Added yogurt!', '#f8fafc');
      }
      if (keys['KeyB'] && smoothieIngredients >= 2 && smoothieYogurt && !smoothieBlending) {
        keys['KeyB'] = false;
        smoothieBlending = true;
        smoothieProgress = 0;
      }
      if (smoothieBlending) {
        smoothieProgress += 16;
        if (smoothieProgress >= 2000) {
          smoothieBlending = false;
          smoothieCount++;
          score += 75;
          addPopup(player.x, player.y - 40, '+75 Smoothie!', '#a78bfa');
          playChaChing();
          smoothieIngredients = 0;
          smoothieYogurt = false;
          smoothieProgress = 0;
        }
      }
      if (keys['Enter'] && !smoothieBlending) {
        keys['Enter'] = false;
        currentScene = null;
      }
    }
  }

  // Gelato Shop minigame
  if (currentScene === Scene.GELATO_SHOP) {
    if (gelatoMsgTimer > 0) gelatoMsgTimer -= 16;

    const maxScoops = gelatoOrder && gelatoOrder.thirds ? 3 : 4;

    // Number keys 1-6 add scoops
    for (let i = 0; i < 6; i++) {
      const key = 'Digit' + (i + 1);
      if (keys[key] && gelatoCup.length < maxScoops && !gelatoComplete) {
        keys[key] = false;
        gelatoCup.push(GELATO_FLAVORS[i].name);
        addPopup(player.x, player.y - 30, '+' + GELATO_FLAVORS[i].name, GELATO_FLAVORS[i].color);
      }
    }

    // Check if cup is full — compare with order
    if (gelatoCup.length === maxScoops && gelatoMsgTimer <= 0) {
      // Count scoops by flavor
      const cupCounts = {};
      for (const f of gelatoCup) cupCounts[f] = (cupCounts[f] || 0) + 1;
      // Compare with order
      const orderFracs = gelatoOrder.fractions;
      let match = true;
      for (const [flavor, count] of Object.entries(orderFracs)) {
        if ((cupCounts[flavor] || 0) !== count) { match = false; break; }
      }
      // Also check no extra flavors
      for (const [flavor, count] of Object.entries(cupCounts)) {
        if ((orderFracs[flavor] || 0) !== count) { match = false; break; }
      }

      if (match) {
        score += 40;
        addPopup(player.x, player.y - 40, '+40 Perfect order!', '#22c55e');
        playChaChing();
        gelatoMessage = 'Perfetto! The customer loves it!';
        gelatoMsgTimer = 1500;
        gelatoRound++;
        if (gelatoRound >= GELATO_ORDERS.length) {
          score += 100;
          addPopup(player.x, player.y - 60, '+100 All orders complete!', '#fbbf24');
          gelatoComplete = true;
          gelatoMessage = 'Magnifico! All 5 orders complete! +100 bonus!';
          gelatoMsgTimer = 3000;
        } else {
          gelatoOrder = GELATO_ORDERS[gelatoRound];
        }
        gelatoCup = [];
      } else {
        gelatoMessage = 'Wrong mix! Try again...';
        gelatoMsgTimer = 1200;
        gelatoCup = [];
      }
    }

    // Escape / Enter to exit
    if (keys['Escape'] || (keys['Enter'] && gelatoComplete)) {
      keys['Escape'] = false;
      keys['Enter'] = false;
      currentScene = null;
    }
  }

  // TopGolf minigame
  if (currentScene === Scene.TOPGOLF) {
    // Use world-space coordinates (matching drawing.js ctx.translate(-cam,0))
    const W = canvas.width, H = canvas.height;
    const ww = getCurrentWorldW();
    const tgCam = Math.max(0, Math.min(ww - W, player.x - W / 2));
    const tgCx = tgCam + W / 2;
    const tgCy = H / 2;

    if (!golfBall.active) {
      // Aiming
      if (keys['ArrowUp']) golfAngle = Math.min(Math.PI * 0.45, golfAngle + 0.02);
      if (keys['ArrowDown']) golfAngle = Math.max(Math.PI * 0.08, golfAngle - 0.02);

      // Charging
      if (keys['Space']) {
        golfCharging = true;
        golfPower = Math.min(1, golfPower + 0.02);
      } else if (golfCharging) {
        // Release — fire!
        golfCharging = false;
        golfBall.active = true;
        golfBall.x = tgCx - 160;
        golfBall.y = tgCy + 50;
        const speed = 3 + golfPower * 5;
        golfBall.vx = Math.cos(golfAngle) * speed;
        golfBall.vy = -Math.sin(golfAngle) * speed;
        golfPower = 0;
      }
    } else {
      // Ball physics (low gravity!)
      golfBall.x += golfBall.vx;
      golfBall.y += golfBall.vy;
      golfBall.vy += 0.08; // low moon gravity for golf

      // Check target hits
      const targets = [
        { x: tgCx + 50, y: tgCy + 10, pts: 20 },
        { x: tgCx + 130, y: tgCy + 10, pts: 30 },
        { x: tgCx + 220, y: tgCy + 10, pts: 50 },
      ];
      for (const tgt of targets) {
        const dx = golfBall.x - tgt.x;
        const dy = golfBall.y - tgt.y;
        if (dx * dx + dy * dy < 225) { // 15px radius
          golfBall.active = false;
          golfScore += tgt.pts;
          score += tgt.pts;
          addPopup(tgt.x, tgt.y - 20, '+' + tgt.pts + ' Target!', '#22c55e');
          playChaChing();
          break;
        }
      }

      // Out of bounds
      if (golfBall.y > tgCy + 100 || golfBall.x > tgCx + 280 || golfBall.x < tgCx - 250) {
        golfBall.active = false;
        addPopup(golfBall.x, golfBall.y, 'Miss!', '#ef4444');
      }
    }

    if (keys['Enter'] && !golfBall.active) {
      keys['Enter'] = false;
      currentScene = null;
    }
  }

  // Apollo Mission minigame
  if (currentScene === Scene.APOLLO_MISSION) {
    const am = apolloMission;

    if (am.celebrateTimer > 0) {
      // Celebration phase after completing all 4 steps
      am.celebrateTimer -= 16;
      if (am.celebrateTimer <= 0) {
        currentScene = null;
        am.active = false;
        am.complete = true;
      }
    } else if (am.step === 0) {
      // Step 1: "First Step" — boot descends, press Space at the right moment
      am.bootY += 0.8; // boot descends slowly
      am.stepTimer += 16;
      // Sweet spot: bootY between 70 and 90 (near the ground)
      if (keys['Space']) {
        keys['Space'] = false;
        if (am.bootY >= 65 && am.bootY <= 95) {
          // Perfect timing!
          addPopup(player.x, player.y - 30, 'Perfect step!', '#fbbf24');
          am.step = 1;
          am.progress = 0;
        } else {
          // Missed — reset boot
          addPopup(player.x, player.y - 30, 'Too early! Try again', '#ef4444');
          am.bootY = 0;
          am.stepTimer = 0;
        }
      }
      // If boot goes past the zone, reset
      if (am.bootY > 110) {
        am.bootY = 0;
        am.stepTimer = 0;
      }
    } else if (am.step === 1) {
      // Step 2: "Plant the Flag" — hold Space to drive flag into ground
      if (keys['Space']) {
        am.progress = Math.min(100, am.progress + 1.2);
      } else {
        am.progress = Math.max(0, am.progress - 0.3);
      }
      if (am.progress >= 100) {
        addPopup(player.x, player.y - 30, 'Flag planted!', '#fbbf24');
        am.step = 2;
        am.progress = 0;
        am.rocksCollected = 0;
        am.rockPlayerX = 0;
        am.stepTimer = 15000; // 15 seconds timer
      }
    } else if (am.step === 2) {
      // Step 3: "Collect Moon Rocks" — move left/right to collect 5 rocks in 15s
      am.stepTimer -= 16;
      if (keys['ArrowLeft']) am.rockPlayerX = Math.max(-180, am.rockPlayerX - 4);
      if (keys['ArrowRight']) am.rockPlayerX = Math.min(180, am.rockPlayerX + 4);
      // Check collection
      for (let i = 0; i < am.rockPositions.length; i++) {
        if (am.rockPositions[i] !== null && Math.abs(am.rockPlayerX - am.rockPositions[i]) < 20) {
          am.rockPositions[i] = null;
          am.rocksCollected++;
          addPopup(player.x, player.y - 30, 'Rock ' + am.rocksCollected + '/5!', '#fbbf24');
        }
      }
      if (am.rocksCollected >= 5) {
        addPopup(player.x, player.y - 30, 'All rocks collected!', '#22c55e');
        am.step = 3;
        am.progress = 0;
      } else if (am.stepTimer <= 0) {
        // Time's up — reset step
        addPopup(player.x, player.y - 30, 'Time up! Try again', '#ef4444');
        am.rocksCollected = 0;
        am.rockPlayerX = 0;
        am.stepTimer = 15000;
        for (let i = 0; i < 5; i++) {
          am.rockPositions[i] = -150 + i * 75 + Math.random() * 30;
        }
      }
    } else if (am.step === 3) {
      // Step 4: "Salute" — press S to salute the flag
      if (keys['KeyS']) {
        keys['KeyS'] = false;
        // All 4 steps complete!
        am.step = 4;
        score += 300;
        addPopup(player.x, player.y - 40, '+300 Apollo Mission Complete!', '#fbbf24');
        playChaChing();
        am.celebrateTimer = 3000; // 3 second celebration
      }
    }

    // Exit with Escape (abort mission)
    if (keys['Escape']) {
      keys['Escape'] = false;
      currentScene = null;
      am.active = false;
      am.step = 0;
      am.progress = 0;
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
    // Auto-sled: push player right, speed varies with terrain slope
    const terrainSlope = (sledTerrainY(player.x + 5) - sledTerrainY(player.x - 5)) / 10;
    const slopeBoost = terrainSlope * 2; // positive slope = downhill = faster
    player.vx = Math.max(player.vx, SLED_SPEED + slopeBoost);
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
      if (!trainPuzzleActive && !trainPuzzleComplete && keys['Enter']) {
        keys['Enter'] = false;
        trainPuzzleActive = true;
        trainPuzzleRound = 0;
        trainPuzzleFeedback = '';
        trainPuzzleFeedbackTimer = 0;
        trainPuzzleScore = 0;
      }
    }

    // Train signal puzzle input handling
    if (trainPuzzleActive && trainPuzzleFeedback !== 'correct' && trainPuzzleFeedback !== 'wrong') {
      const puzzle = TRAIN_PUZZLES[trainPuzzleRound];
      if (keys['Digit1'] || keys['Digit2']) {
        const pressed = keys['Digit1'] ? 1 : 2;
        keys['Digit1'] = false;
        keys['Digit2'] = false;
        if (pressed === puzzle.answer) {
          trainPuzzleFeedback = 'correct';
          trainPuzzleFeedbackTimer = 1200;
          trainPuzzleScore += POINTS.TRAIN_PUZZLE;
          score += POINTS.TRAIN_PUZZLE;
          addPopup(player.x, player.y - 40, '+' + POINTS.TRAIN_PUZZLE + ' Correct!', '#4ade80');
          playChaChing();
        } else {
          trainPuzzleFeedback = 'wrong';
          trainPuzzleFeedbackTimer = 2000;
        }
      }
    }

    // Train puzzle feedback timer
    if (trainPuzzleActive && trainPuzzleFeedbackTimer > 0) {
      trainPuzzleFeedbackTimer -= dt;
      if (trainPuzzleFeedbackTimer <= 0) {
        if (trainPuzzleFeedback === 'correct') {
          trainPuzzleRound++;
          if (trainPuzzleRound >= TRAIN_PUZZLES.length) {
            // All puzzles complete!
            trainPuzzleActive = false;
            trainPuzzleComplete = true;
            score += POINTS.TRAIN_PUZZLE_BONUS;
            addPopup(player.x, player.y - 60, '+' + POINTS.TRAIN_PUZZLE_BONUS + ' All signals set!', '#fbbf24');
            playChaChing();
            switchToLevel(3); // board the train to NYC
          }
        }
        trainPuzzleFeedback = '';
        trainPuzzleFeedbackTimer = 0;
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
    // Keep NPCs on terrain for sledding level
    if (currentLevel === 2) npc.y = sledTerrainY(npc.x);
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
            addFactToNotebook(text, currentLevel);
          }
        }
        break;
      }
    }
  }

  // Notebook toggle — N key when not in a scene
  if (currentScene === null && keys['KeyN']) {
    keys['KeyN'] = false;
    notebookOpen = true;
    notebookScroll = 0;
  }

  // Update speech bubbles
  for (let i = activeSpeechBubbles.length - 1; i >= 0; i--) {
    activeSpeechBubbles[i].life -= dt;
    if (activeSpeechBubbles[i].life <= 0) {
      activeSpeechBubbles.splice(i, 1);
      // Chance to trigger a quiz after dialogue ends
      if (!quizActive && quizResultTimer <= 0) {
        const quizzes = npcQuizzes[currentLevel];
        if (quizzes && quizzes.length > 0 && Math.random() < QUIZ_CHANCE) {
          const q = quizzes[Math.floor(Math.random() * quizzes.length)];
          quizActive = true;
          quizQuestion = q.question;
          quizAnswers = q.answers;
          quizCorrect = q.correct;
        }
      }
    }
  }

  // Handle quiz input (1, 2, 3 keys)
  if (quizActive) {
    for (let i = 0; i < 3; i++) {
      if (keys['Digit' + (i + 1)]) {
        keys['Digit' + (i + 1)] = false;
        quizActive = false;
        if (i === quizCorrect) {
          score += QUIZ_BONUS;
          quizResultText = 'Correct! +' + QUIZ_BONUS + ' points!';
          quizResultColor = '#4ade80';
          addPopup(player.x, player.y - 40, '+' + QUIZ_BONUS + ' Quiz bonus!', '#4ade80');
        } else {
          quizResultText = 'Not quite! The answer is: ' + quizAnswers[quizCorrect];
          quizResultColor = '#fbbf24';
        }
        quizResultTimer = QUIZ_RESULT_DURATION;
        break;
      }
    }
  }

  // Update quiz result timer
  if (quizResultTimer > 0) {
    quizResultTimer -= dt;
  }

  // Popups
  for (let i = popups.length - 1; i >= 0; i--) {
    popups[i].y -= 1;
    popups[i].life -= dt;
    if (popups[i].life <= 0) popups.splice(i, 1);
  }

  // Hot dog math feedback timer
  updateHotdogMathFeedback(dt);

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

  // Achievement check (every 60 frames ~ once per second)
  achievementCheckCounter++;
  if (achievementCheckCounter >= 60) {
    achievementCheckCounter = 0;
    checkAchievements();
  }

  // Achievement popup countdown
  if (achievementPopup) {
    achievementPopup.timer -= dt;
    if (achievementPopup.timer <= 0) achievementPopup = null;
  }

  // Toggle achievement screen with B (only when not in a scene and not in Alps equipment choice)
  // B key may have been consumed earlier by level-specific handlers (campfire, smoothie blend)
  if (keys['KeyB'] && currentScene === null && !alpsChoosing) {
    keys['KeyB'] = false;
    achievementScreenOpen = !achievementScreenOpen;
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

  // Postcard toggle — W key when outdoors and W wasn't consumed by a level-specific action
  // (pool fill on level 8, Grand Central whisper, etc. already consumed KeyW above)
  if (keys['KeyW'] && currentScene === null) {
    keys['KeyW'] = false;
    postcardOpen = true;
    postcardMode = 'write';
    postcardText = '';
    postcardJustSent = false;
  }

  // Prompt
  updatePrompt({
    inPond, nearGrill, nearHouse, nearCamper, nearWindmill, nearBeehive,
    nearPizza, nearHotdog, nearPark, nearTaxi, nearFountain, nearGelato,
    nearPantheonDoor, nearFiat, nearTiki, nearCoconut, nearSurf, nearAirport,
    nearChalet, nearTrain, nearNpc, nearStick, nearFirePit, nearHammock,
    nearBigfoot, nearDigSite, nearWaterPump, nearPool, nearCampCamper, nearGeometry,
    nearSailboat, nearDiveSpot, nearBaobab, nearCheetah, nearSafariJeep,
    nearWateringHole, nearElephant, nearHospital,
    nearFao, nearEmpire, nearThirtyRock, nearGrandCentral, nearMet,
    nearBugNet
  });
}

function getGroundLevel(x) {
  // Sledding level: terrain follows downhill slope
  if (currentLevel === 2) {
    return sledTerrainY(x);
  }
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

function updateHotdogMath() {
  // Show feedback for a moment before advancing
  if (hotdogMath.feedbackTimer > 0) return;

  const priceCents = Math.round(hotdogMath.price * 100);

  // Coin/bill key inputs
  const coinKeys = [
    { code: 'Digit1', value: 100, label: '$1' },
    { code: 'Digit5', value: 500, label: '$5' },
    { code: 'KeyQ', value: 25, label: '25\u00a2' },
    { code: 'KeyD', value: 10, label: '10\u00a2' },
    { code: 'KeyN', value: 5, label: '5\u00a2' },
    { code: 'KeyP', value: 1, label: '1\u00a2' },
  ];

  for (const ck of coinKeys) {
    if (keys[ck.code]) {
      keys[ck.code] = false;
      hotdogMath.paid += ck.value;
      playChaChing();
      break;
    }
  }

  // Check if paid enough
  if (hotdogMath.paid >= priceCents) {
    const overpay = hotdogMath.paid - priceCents;
    hotdogCount++;
    score += POINTS.HOTDOG_MATH;
    hud.score.textContent = score;
    hud.hotdog.textContent = hotdogCount;

    if (overpay === 0) {
      hotdogMath.feedback = 'Exact change! +' + POINTS.HOTDOG_MATH + ' Math Bonus!';
    } else {
      const changeDollars = (overpay / 100).toFixed(2);
      hotdogMath.feedback = 'Overpaid! Change: $' + changeDollars +
        ' ($' + (hotdogMath.paid / 100).toFixed(2) + ' - $' + hotdogMath.price.toFixed(2) +
        ' = $' + changeDollars + ') +' + POINTS.HOTDOG_MATH + ' pts!';
    }
    hotdogMath.feedbackTimer = 2500;
    addPopup(player.x, player.y - 40, '+' + POINTS.HOTDOG_MATH + ' Math Bonus!', '#22c55e');
  }

  // Escape to cancel
  if (keys['Escape']) {
    keys['Escape'] = false;
    hotdogMath.active = false;
    hotdogMath.paid = 0;
  }
}

function updateHotdogMathFeedback(dt) {
  if (!hotdogMath.active || hotdogMath.feedbackTimer <= 0) return;
  hotdogMath.feedbackTimer -= dt;
  if (hotdogMath.feedbackTimer <= 0) {
    hotdogMath.feedbackTimer = 0;
    // Advance to next round
    hotdogMath.round++;
    if (hotdogMath.round >= HOTDOG_MATH_PRICES.length) {
      // All rounds complete
      hotdogMath.active = false;
      hotdogMath.complete = true;
      addPopup(player.x, player.y - 60, 'All 5 hot dogs bought!', '#fbbf24');
    } else {
      hotdogMath.price = HOTDOG_MATH_PRICES[hotdogMath.round];
      hotdogMath.paid = 0;
      hotdogMath.feedback = '';
    }
  }
}

// ── Campfire Geometry Minigame ──
function getGeometryTargetEdges(shapeIndex) {
  const shape = GEOMETRY_SHAPES[shapeIndex];
  const cx = canvas.width / 2;
  const cy = canvas.height / 2 - 20;
  const radius = 80;
  const edges = [];
  if (shape.isStar) {
    // 5-pointed star: alternate outer/inner vertices
    const outerR = radius;
    const innerR = radius * 0.38;
    const points = [];
    for (let i = 0; i < 10; i++) {
      const angle = -Math.PI / 2 + (i / 10) * Math.PI * 2;
      const r = i % 2 === 0 ? outerR : innerR;
      points.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
    }
    for (let i = 0; i < 10; i++) {
      edges.push({ x1: points[i].x, y1: points[i].y, x2: points[(i + 1) % 10].x, y2: points[(i + 1) % 10].y });
    }
  } else {
    const n = shape.sides;
    const points = [];
    for (let i = 0; i < n; i++) {
      const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
      points.push({ x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius });
    }
    for (let i = 0; i < n; i++) {
      edges.push({ x1: points[i].x, y1: points[i].y, x2: points[(i + 1) % n].x, y2: points[(i + 1) % n].y });
    }
  }
  return edges;
}

function updateGeometryMinigame(dt) {
  if (geometryComplete) {
    geometryCompletionTimer += dt;
    if (geometryCompletionTimer >= GEOMETRY_COMPLETION_DISPLAY) {
      geometryComplete = false;
      geometryCompletionTimer = 0;
      geometryShapeIndex++;
      geometrySticks = [];
      geometryAngle = 0;
      if (geometryShapeIndex >= GEOMETRY_SHAPES.length) {
        // All shapes completed!
        geometryActive = false;
        geometryAllComplete = true;
        score += POINTS.GEOMETRY_BONUS;
        addPopup(player.x, player.y - 40, '+' + POINTS.GEOMETRY_BONUS + ' Geometry Master!', '#a855f7');
        playChaChing();
      }
    }
    return;
  }

  // Rotate current stick with left/right arrows
  if (keys['ArrowLeft']) { geometryAngle -= 0.05; }
  if (keys['ArrowRight']) { geometryAngle += 0.05; }

  // Place stick with Space
  if (keys['Space']) {
    keys['Space'] = false;
    const edges = getGeometryTargetEdges(geometryShapeIndex);
    const nextEdgeIndex = geometrySticks.length;
    if (nextEdgeIndex < edges.length) {
      // Snap to target position
      const target = edges[nextEdgeIndex];
      // Check if the player's angle is close enough to the target edge angle
      const targetAngle = Math.atan2(target.y2 - target.y1, target.x2 - target.x1);
      let angleDiff = geometryAngle - targetAngle;
      // Normalize to [-PI, PI]
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      // Accept if within ~45 degrees
      if (Math.abs(angleDiff) < Math.PI / 4) {
        geometrySticks.push({ x1: target.x1, y1: target.y1, x2: target.x2, y2: target.y2 });
        playChaChing();
        // Check if shape is complete
        if (geometrySticks.length >= edges.length) {
          geometryComplete = true;
          geometryCompletionTimer = 0;
          score += 25;
          addPopup(player.x, player.y - 40, '+25 ' + GEOMETRY_SHAPES[geometryShapeIndex].name + '!', '#a855f7');
        }
      } else {
        addPopup(player.x, player.y - 40, 'Rotate closer to the guide!', '#f87171');
      }
    }
  }

  // Exit geometry mode with Escape
  if (keys['Escape']) {
    keys['Escape'] = false;
    geometryActive = false;
  }
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

function updateLightShowMinigame(dt) {
  // Feedback timer
  if (lightShowFeedback.timer > 0) {
    lightShowFeedback.timer -= dt;
  }

  // If running the program, animate through steps
  if (lightShowRunning) {
    lightShowTimer += dt;
    const expanded = lightShowRepeat ? (lightShowProgram + lightShowProgram + lightShowProgram) : lightShowProgram;
    if (lightShowTimer >= LIGHT_SHOW_STEP_MS) {
      lightShowTimer -= LIGHT_SHOW_STEP_MS;
      lightShowStep++;
      if (lightShowStep >= expanded.length) {
        // Finished running — check result
        lightShowRunning = false;
        lightShowStep = -1;
        checkLightShowResult(expanded);
      }
    }
    // Escape to stop early
    if (keys['Escape']) {
      keys['Escape'] = false;
      lightShowRunning = false;
      lightShowStep = -1;
    }
    return; // no editing while running
  }

  // Exit light show (Escape)
  if (keys['Escape']) {
    keys['Escape'] = false;
    lightShowActive = false;
    return;
  }

  // Add color letters
  const colorKeys = { KeyR: 'R', KeyB: 'B', KeyG: 'G', KeyY: 'Y', KeyW: 'W' };
  for (const [code, letter] of Object.entries(colorKeys)) {
    if (keys[code]) {
      keys[code] = false;
      if (lightShowProgram.length < 12) {
        lightShowProgram += letter;
      }
    }
  }

  // X = toggle repeat
  if (keys['KeyX']) {
    keys['KeyX'] = false;
    lightShowRepeat = !lightShowRepeat;
  }

  // Backspace = delete last
  if (keys['Backspace']) {
    keys['Backspace'] = false;
    lightShowProgram = lightShowProgram.slice(0, -1);
  }

  // Space or Enter = run program
  if ((keys['Space'] || keys['Enter']) && lightShowProgram.length > 0) {
    keys['Space'] = false;
    keys['Enter'] = false;
    lightShowRunning = true;
    lightShowStep = 0;
    lightShowTimer = 0;
  }

  // N = next challenge
  if (keys['KeyN']) {
    keys['KeyN'] = false;
    if (lightShowChallenge < 4) {
      lightShowChallenge++;
      lightShowProgram = '';
      lightShowRepeat = false;
      lightShowFeedback = { text: '', timer: 0, color: '#fff' };
    }
  }
}

function checkLightShowResult(expanded) {
  const challenge = LIGHT_SHOW_TARGETS[lightShowChallenge];

  // Free mode (challenge 5) — always awards points
  if (challenge.pattern === null) {
    if (!lightShowChallengesCompleted[lightShowChallenge] && expanded.length >= 2) {
      lightShowChallengesCompleted[lightShowChallenge] = true;
      score += POINTS.LIGHT_SHOW_CHALLENGE;
      lightShowFeedback = { text: '+' + POINTS.LIGHT_SHOW_CHALLENGE + ' Beautiful light show!', timer: 3000, color: '#fbbf24' };
      playChaChing();
      checkLightShowAllComplete();
    } else if (lightShowChallengesCompleted[lightShowChallenge]) {
      lightShowFeedback = { text: 'Great show! Already completed.', timer: 2000, color: '#86efac' };
    } else {
      lightShowFeedback = { text: 'Add at least 2 colors!', timer: 2000, color: '#fca5a5' };
    }
    return;
  }

  // Check if expanded matches the target
  if (expanded === challenge.pattern) {
    if (!lightShowChallengesCompleted[lightShowChallenge]) {
      lightShowChallengesCompleted[lightShowChallenge] = true;
      score += POINTS.LIGHT_SHOW_CHALLENGE;
      lightShowFeedback = { text: '+' + POINTS.LIGHT_SHOW_CHALLENGE + ' Pattern matched!', timer: 3000, color: '#86efac' };
      addPopup(FIRE_PIT_POS.x, player.y - 40, '+' + POINTS.LIGHT_SHOW_CHALLENGE + ' Light Show!', '#fbbf24');
      playChaChing();
      checkLightShowAllComplete();
    } else {
      lightShowFeedback = { text: 'Already completed! Press N for next.', timer: 2000, color: '#86efac' };
    }
  } else {
    lightShowFeedback = { text: 'Not quite! Try again.', timer: 2000, color: '#fca5a5' };
  }
}

function checkLightShowAllComplete() {
  if (lightShowChallengesCompleted.every(c => c)) {
    score += POINTS.LIGHT_SHOW_BONUS;
    addPopup(FIRE_PIT_POS.x, player.y - 60, '+' + POINTS.LIGHT_SHOW_BONUS + ' All challenges complete!', '#a78bfa');
    playChaChing();
  }
  hud.score.textContent = score;
}
