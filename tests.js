// Unikittyville — Data Integrity Smoke Tests
// Open tests.html in a browser to run.

let passed = 0, failed = 0, total = 0;

function section(name) { log('<div class="section">' + name + '</div>'); }

function assert(desc, condition) {
  total++;
  if (condition) {
    passed++;
    log('<div class="pass">&#10003; ' + desc + '</div>');
  } else {
    failed++;
    log('<div class="fail">&#10007; ' + desc + '</div>');
  }
}

function log(html) {
  document.getElementById('results').innerHTML += html;
}

// ============================================================
// Level Registry Tests
// ============================================================
section('Level Registry');
assert('levelRegistry exists', typeof levelRegistry === 'object');
assert('TOTAL_LEVELS is ' + TOTAL_LEVELS, TOTAL_LEVELS === Object.keys(levelRegistry).length);
assert('TOTAL_LEVELS >= 9', TOTAL_LEVELS >= 9);

for (var i = 1; i <= TOTAL_LEVELS; i++) {
  var l = levelRegistry[i];
  assert('Level ' + i + ' exists in registry', !!l);
  if (!l) continue;
  assert('Level ' + i + ' (' + l.name + ') has name', typeof l.name === 'string' && l.name.length > 0);
  assert('Level ' + i + ' has worldW > 0', typeof l.worldW === 'number' && l.worldW > 0);
  assert('Level ' + i + ' has platforms array', Array.isArray(l.platforms));
  assert('Level ' + i + ' has yarnBalls array', Array.isArray(l.yarnBalls));
  assert('Level ' + i + ' has npcs array', Array.isArray(l.npcs));
  assert('Level ' + i + ' has musicId string', typeof l.musicId === 'string' && l.musicId.length > 0);
  assert('Level ' + i + ' has drawSky function', typeof l.drawSky === 'function');
  assert('Level ' + i + ' has drawWorld function', typeof l.drawWorld === 'function');
}

// ============================================================
// NPC Dialog Tests
// ============================================================
section('NPC Dialogs');
assert('npcDialogs exists', typeof npcDialogs === 'object');
for (var i = 1; i <= TOTAL_LEVELS; i++) {
  assert('npcDialogs[' + i + '] exists', Array.isArray(npcDialogs[i]));
  assert('npcDialogs[' + i + '] is non-empty', npcDialogs[i] && npcDialogs[i].length > 0);
}

// ============================================================
// Platform Data Integrity
// ============================================================
section('Platform Data');
for (var i = 1; i <= TOTAL_LEVELS; i++) {
  var plats = levelRegistry[i].platforms;
  var worldW = levelRegistry[i].worldW;
  // Flying levels (10, 12) have no platforms — skip minimum check for them
  var isFlyingLevel = (i === 10 || i === 12);
  assert('Level ' + i + ' has at least 1 platform (or is flying level)', isFlyingLevel || plats.length >= 1);
  for (var j = 0; j < plats.length; j++) {
    var p = plats[j];
    assert('Level ' + i + ' plat[' + j + '] has valid x', typeof p.x === 'number' && p.x >= 0);
    assert('Level ' + i + ' plat[' + j + '] has valid y', typeof p.y === 'number' && p.y > 0);
    assert('Level ' + i + ' plat[' + j + '] has valid w', typeof p.w === 'number' && p.w > 0);
    assert('Level ' + i + ' plat[' + j + '] within world bounds', p.x + p.w <= worldW);
  }
}

// ============================================================
// NPC Data
// ============================================================
section('NPC Data');
for (var i = 1; i <= TOTAL_LEVELS; i++) {
  var npcList = levelRegistry[i].npcs;
  var worldW = levelRegistry[i].worldW;
  assert('Level ' + i + ' has at least 3 NPCs', npcList.length >= 3);
  for (var k = 0; k < npcList.length; k++) {
    var npc = npcList[k];
    assert('Level ' + i + ' NPC[' + k + '] at x=' + Math.round(npc.x) + ' has color', typeof npc.color === 'string' && npc.color.length > 0);
    assert('Level ' + i + ' NPC[' + k + '] within world bounds', npc.x >= 0 && npc.x <= worldW);
  }
}

// ============================================================
// Yarn Ball Data
// ============================================================
section('Yarn Ball Data');
for (var i = 1; i <= TOTAL_LEVELS; i++) {
  var yb = levelRegistry[i].yarnBalls;
  var worldW = levelRegistry[i].worldW;
  assert('Level ' + i + ' has at least 1 yarn ball', yb.length >= 1);
  for (var j = 0; j < yb.length; j++) {
    assert('Level ' + i + ' yarn[' + j + '] has valid x', typeof yb[j].x === 'number' && yb[j].x >= 0);
    assert('Level ' + i + ' yarn[' + j + '] has valid y', typeof yb[j].y === 'number' && yb[j].y > 0);
    assert('Level ' + i + ' yarn[' + j + '] within world bounds', yb[j].x <= worldW);
  }
}

// ============================================================
// Scene Enum
// ============================================================
section('Scene Enum');
assert('Scene object exists', typeof Scene === 'object');
assert('Scene.HOUSE === "house"', Scene.HOUSE === 'house');
assert('Scene.SCUBA_DIVING === "scubaDiving"', Scene.SCUBA_DIVING === 'scubaDiving');
assert('Scene.SURFING === "surfing"', Scene.SURFING === 'surfing');
assert('Scene.CHALET === "chalet"', Scene.CHALET === 'chalet');
assert('Scene.CAMP_CAMPER === "campCamper"', Scene.CAMP_CAMPER === 'campCamper');
assert('Scene.WATERING_HOLE === "wateringHole"', Scene.WATERING_HOLE === 'wateringHole');

// ============================================================
// LEVEL_NAMES
// ============================================================
section('Level Names');
assert('LEVEL_NAMES exists', Array.isArray(LEVEL_NAMES));
assert('LEVEL_NAMES length matches TOTAL_LEVELS', LEVEL_NAMES.length === TOTAL_LEVELS);
for (var i = 0; i < LEVEL_NAMES.length; i++) {
  assert('LEVEL_NAMES[' + i + '] ("' + LEVEL_NAMES[i] + '") is non-empty', typeof LEVEL_NAMES[i] === 'string' && LEVEL_NAMES[i].length > 0);
}

// ============================================================
// Game Constants
// ============================================================
section('Game Constants');
assert('WORLD_W is defined and > 0', typeof WORLD_W === 'number' && WORLD_W > 0);
assert('GROUND_Y is defined and > 0', typeof GROUND_Y === 'number' && GROUND_Y > 0);
assert('GRAVITY is defined and > 0', typeof GRAVITY === 'number' && GRAVITY > 0);
assert('JUMP_VEL is defined and < 0', typeof JUMP_VEL === 'number' && JUMP_VEL < 0);
assert('MOVE_SPEED is defined and > 0', typeof MOVE_SPEED === 'number' && MOVE_SPEED > 0);

// ============================================================
// Cross-reference: NPC count matches dialog count
// ============================================================
section('NPC / Dialog Cross-Reference');
for (var i = 1; i <= TOTAL_LEVELS; i++) {
  var npcCount = levelRegistry[i].npcs.length;
  var dialogCount = npcDialogs[i] ? npcDialogs[i].length : 0;
  assert('Level ' + i + ' has more dialogs (' + dialogCount + ') than NPCs (' + npcCount + ')', dialogCount >= npcCount);
}

// ============================================================
// Summary
// ============================================================
var summaryClass = failed === 0 ? 'all-pass' : 'has-fail';
log('<div class="summary ' + summaryClass + '">Results: ' + passed + '/' + total + ' passed, ' + failed + ' failed</div>');

// Set document title to reflect results (useful for automation)
// ============================================================
// Platform Reachability Tests
// ============================================================
section('Platform Reachability');

// Physics constants for reachability calculation
var g = GRAVITY;       // 0.6
var jumpV = -JUMP_VEL; // 12 (positive = upward speed)
var moveSpd = MOVE_SPEED; // 4

// Calculate whether a player can jump from one surface to another.
// srcY/dstY are screen Y coords (lower value = higher on screen).
// hGap = horizontal distance the player must cross in the air (edge-to-edge).
function canReach(srcY, dstY, hGap) {
  var heightNeeded = srcY - dstY; // positive = jumping up
  if (heightNeeded < 0) {
    // Jumping/falling down — always reachable if horizontal gap is crossable.
    var airTime = 2 * jumpV / g;
    return hGap <= moveSpd * airTime;
  }
  // Jumping up: need enough velocity to reach heightNeeded
  var maxH = (jumpV * jumpV) / (2 * g);
  if (heightNeeded > maxH) return false;

  // Time to reach heightNeeded on the way down (more air time = more horizontal range)
  var disc = jumpV * jumpV - 2 * g * heightNeeded;
  if (disc < 0) return false;
  var tDown = (jumpV + Math.sqrt(disc)) / g;
  return hGap <= moveSpd * tDown;
}

for (var lvl = 1; lvl <= TOTAL_LEVELS; lvl++) {
  var reg = levelRegistry[lvl];
  var plats = reg.platforms;
  if (!plats || plats.length === 0) continue;

  // BFS: mark platforms reachable from the ground, then from other reachable platforms
  var reached = [];
  for (var j = 0; j < plats.length; j++) reached[j] = false;

  // First pass: mark all platforms reachable directly from the ground
  for (var j = 0; j < plats.length; j++) {
    if (canReach(GROUND_Y, plats[j].y, 0)) reached[j] = true;
  }

  // BFS: repeatedly check unreached platforms against reached ones
  var changed = true;
  while (changed) {
    changed = false;
    for (var j = 0; j < plats.length; j++) {
      if (reached[j]) continue;
      for (var k = 0; k < plats.length; k++) {
        if (!reached[k]) continue;
        var src = plats[k], dst = plats[j];
        var hGap = 0;
        if (dst.x > src.x + src.w) hGap = dst.x - (src.x + src.w);
        else if (src.x > dst.x + dst.w) hGap = src.x - (dst.x + dst.w);
        if (canReach(src.y, dst.y, hGap)) {
          reached[j] = true;
          changed = true;
          break;
        }
      }
    }
  }

  for (var j = 0; j < plats.length; j++) {
    assert(
      'Level ' + lvl + ' (' + reg.name + ') plat[' + j + '] at (' + plats[j].x + ',' + plats[j].y + ') reachable',
      reached[j]
    );
  }
}

// ============================================================
// Summary
// ============================================================
// ============================================================
// Tour Guide Facts
// ============================================================
section('Tour Guide Facts');
assert('tourGuideFacts exists', typeof tourGuideFacts === 'object');
assert('tourGuideFacts has entry for every level', Object.keys(levelRegistry).every(function(k) { return tourGuideFacts[k] && tourGuideFacts[k].length === 3; }));
for (var tg = 1; tg <= TOTAL_LEVELS; tg++) {
  assert('tourGuideFacts[' + tg + '] has 3 string facts', tourGuideFacts[tg] && tourGuideFacts[tg].length === 3 && tourGuideFacts[tg].every(function(f) { return typeof f === 'string' && f.length > 10; }));
}

// ============================================================
// Whale Song Transcription
// ============================================================
section('Whale Song Transcription');
assert('WHALE_TRANSMISSIONS exists and has 5 entries', Array.isArray(WHALE_TRANSMISSIONS) && WHALE_TRANSMISSIONS.length === 5);
assert('Each transmission has x and text', WHALE_TRANSMISSIONS.every(function(t) { return typeof t.x === 'number' && typeof t.text === 'string' && t.text.length > 0; }));
assert('Transmission x positions are ascending', WHALE_TRANSMISSIONS.every(function(t, i) { return i === 0 || t.x > WHALE_TRANSMISSIONS[i - 1].x; }));
assert('All transmission x positions within flight world bounds', WHALE_TRANSMISSIONS.every(function(t) { return t.x > 0 && t.x < level10Flight.worldW; }));
assert('WHALE_TRANSCRIPTION_POINTS is 25', WHALE_TRANSCRIPTION_POINTS === 25);
assert('WHALE_TRANSCRIPTION_BONUS is 75', WHALE_TRANSCRIPTION_BONUS === 75);
assert('WHALE_TRANSCRIPTION_TIMEOUT is 15000', WHALE_TRANSCRIPTION_TIMEOUT === 15000);
assert('whaleTranscription state object exists', typeof whaleTranscription === 'object' && whaleTranscription.completed instanceof Set);

var summaryClass = failed === 0 ? 'all-pass' : 'has-fail';
log('<div class="summary ' + summaryClass + '">Results: ' + passed + '/' + total + ' passed, ' + failed + ' failed</div>');

document.title = (failed === 0 ? 'PASS' : 'FAIL') + ' - Unikittyville Tests (' + passed + '/' + total + ')';
