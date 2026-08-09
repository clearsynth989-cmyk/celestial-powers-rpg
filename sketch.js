/*
============================================================
CELESTIAL POWERS RPG
JUNITEN ELEMENTAL DYNAMICS
============================================================

MOVEMENT
W A S D

POWERS
1 = SUN
2 = MOON
3 = FIRE
4 = WATER
5 = WIND
6 = EARTH
7 = THUNDER

FORMS
SUN:    Q E R
MOON:   T Y U
FIRE:   I O P
WATER:  F G H
WIND:   J K L
EARTH:  Z X C
THUNDER: V B N

M = GAME GUIDE
SPACE = RESET
F = FULLSCREEN

============================================================
*/

// ============================================================
// GLOBAL VARIABLES
// ============================================================

let particles = [];
let mode = "SUN";
let formIndex = 0;

let player;
let companion;

let showGuide = true;
let fullscreenButton;

let worldTime = 0;

// ============================================================
// POWER DATA
// ============================================================

const powerData = {
  SUN: {
    color: [255, 195, 45],
    forms: [
      { key: "Q", name: "SOLAR KNIGHT", animal: "LION" },
      { key: "E", name: "SOLAR LION", animal: "LION" },
      { key: "R", name: "SOLAR PHOENIX", animal: "PHOENIX" }
    ]
  },

  MOON: {
    color: [140, 190, 255],
    forms: [
      { key: "T", name: "LUNAR KNIGHT", animal: "WOLF" },
      { key: "Y", name: "LUNAR WOLF", animal: "WOLF" },
      { key: "U", name: "LUNAR OWL", animal: "OWL" }
    ]
  },

  FIRE: {
    color: [255, 80, 25],
    forms: [
      { key: "I", name: "FLAME WARRIOR", animal: "FOX" },
      { key: "O", name: "FLAME FOX", animal: "FOX" },
      { key: "P", name: "FLAME DRAGON", animal: "DRAGON" }
    ]
  },

  WATER: {
    color: [50, 170, 255],
    forms: [
      { key: "F", name: "TIDE WARRIOR", animal: "DOLPHIN" },
      { key: "G", name: "AQUA DOLPHIN", animal: "DOLPHIN" },
      { key: "H", name: "OCEAN SERPENT", animal: "SERPENT" }
    ]
  },

  WIND: {
    color: [80, 220, 170],
    forms: [
      { key: "J", name: "SKY WARRIOR", animal: "HAWK" },
      { key: "K", name: "WIND HAWK", animal: "HAWK" },
      { key: "L", name: "STORM EAGLE", animal: "EAGLE" }
    ]
  },

  EARTH: {
    color: [180, 125, 70],
    forms: [
      { key: "Z", name: "EARTH GUARDIAN", animal: "BEAR" },
      { key: "X", name: "EARTH BEAR", animal: "BEAR" },
      { key: "C", name: "STONE RHINO", animal: "RHINO" }
    ]
  },

  THUNDER: {
    color: [150, 200, 255],
    forms: [
      { key: "V", name: "THUNDER WARRIOR", animal: "TIGER" },
      { key: "B", name: "THUNDER TIGER", animal: "TIGER" },
      { key: "N", name: "LIGHTNING DRAGON", animal: "DRAGON" }
    ]
  }
};

// ============================================================
// SETUP
// ============================================================

function setup() {
  createCanvas(windowWidth, windowHeight);

  player = new Player();
  companion = new Companion();

  resetGame();

  createFullscreenButton();

  textFont("Arial");
}

// ============================================================
// RESPONSIVE CANVAS
// ============================================================

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  if (player) {
    player.x = constrain(player.x, 40, width - 40);
    player.y = constrain(player.y, 120, height - 40);
  }

  resetParticles(200);
}

// ============================================================
// MAIN DRAW LOOP
// ============================================================

function draw() {
  worldTime += 0.01;

  drawWorld();

  if (!showGuide) {
    updatePlayer();
    updateCompanion();

    drawPowerEffects();
    drawCompanion();
    drawPlayer();
  } else {
    drawPowerEffectsPreview();
  }

  drawHUD();

  if (showGuide) {
    drawGuide();
  }
}

// ============================================================
// WORLD
// ============================================================

function drawWorld() {
  background(4, 8, 17);

  // Grid
  stroke(30, 50, 70, 75);
  strokeWeight(1);

  for (let x = 0; x < width; x += 50) {
    line(x, 85, x, height);
  }

  for (let y = 100; y < height; y += 50) {
    line(0, y, width, y);
  }

  // Central arena
  let c = powerData[mode].color;

  noFill();
  stroke(c[0], c[1], c[2], 35);
  strokeWeight(2);

  ellipse(
    width / 2,
    height / 2 + 40,
    min(850, width * 0.85),
    min(500, height * 0.65)
  );

  // Background stars
  noStroke();

  for (let i = 0; i < 90; i++) {
    let x = (i * 97 + frameCount * 0.15) % width;
    let y = 100 + ((i * 47) % max(100, height - 100));

    fill(120, 170, 220, 40);
    circle(x, y, 2);
  }
}

// ============================================================
// PLAYER
// ============================================================

class Player {
  constructor() {
    this.x = width / 2;
    this.y = height / 2 + 70;
    this.speed = 4;
    this.direction = "DOWN";
    this.walkCycle = 0;
  }

  update() {
    let dx = 0;
    let dy = 0;

    if (keyIsDown(87)) {
      dy -= 1;
      this.direction = "UP";
    }

    if (keyIsDown(83)) {
      dy += 1;
      this.direction = "DOWN";
    }

    if (keyIsDown(65)) {
      dx -= 1;
      this.direction = "LEFT";
    }

    if (keyIsDown(68)) {
      dx += 1;
      this.direction = "RIGHT";
    }

    if (dx !== 0 || dy !== 0) {
      let magnitude = sqrt(dx * dx + dy * dy);

      dx /= magnitude;
      dy /= magnitude;

      this.x += dx * this.speed;
      this.y += dy * this.speed;

      this.walkCycle += 0.3;
    }

    this.x = constrain(this.x, 45, width - 45);
    this.y = constrain(this.y, 120, height - 45);
  }
}

// ============================================================
// COMPANION
// ============================================================

class Companion {
  constructor() {
    this.x = width / 2 - 55;
    this.y = height / 2 + 100;
    this.angle = 0;
  }

  update() {
    let targetX = player.x - 55;
    let targetY = player.y + 25;

    this.x = lerp(this.x, targetX, 0.06);
    this.y = lerp(this.y, targetY, 0.06);

    this.angle += 0.04;
  }
}

// ============================================================
// PLAYER DRAWING
// ============================================================

function drawPlayer() {
  push();

  translate(player.x, player.y);

  let c = powerData[mode].color;

  // Aura
  noStroke();

  for (let r = 80; r > 25; r -= 8) {
    fill(
      c[0],
      c[1],
      c[2],
      map(r, 80, 25, 5, 25)
    );

    circle(0, 0, r);
  }

  // Shadow
  fill(0, 0, 0, 110);
  ellipse(0, 34, 50, 14);

  // Walking legs
  let walking = sin(player.walkCycle) * 5;

  stroke(30);
  strokeWeight(7);

  line(-8, 15, -8 + walking, 32);
  line(8, 15, 8 - walking, 32);

  // Body
  noStroke();

  fill(c[0], c[1], c[2], 220);
  ellipse(0, 0, 32, 40);

  // Arms
  stroke(c[0], c[1], c[2]);
  strokeWeight(7);

  line(-14, -2, -25, 10);
  line(14, -2, 25, 10);

  // Head
  noStroke();

  fill(220, 175, 135);
  circle(0, -29, 30);

  // Hair
  fill(30);

  arc(
    0,
    -33,
    32,
    28,
    PI,
    TWO_PI
  );

  // Eyes
  fill(10);

  circle(-5, -29, 3);
  circle(5, -29, 3);

  drawHeadgear();

  // Direction ring
  noFill();

  stroke(255, 255, 255, 90);
  strokeWeight(1);

  circle(0, 0, 66);

  pop();
}

// ============================================================
// HEADGEAR
// ============================================================

function drawHeadgear() {
  let c = powerData[mode].color;

  noStroke();

  if (mode === "SUN") {
    fill(255, 205, 60);

    for (let i = 0; i < 8; i++) {
      let a = (TWO_PI * i) / 8;

      triangle(
        cos(a) * 18,
        -30 + sin(a) * 18,

        cos(a + 0.15) * 12,
        -30 + sin(a + 0.15) * 12,

        cos(a - 0.15) * 12,
        -30 + sin(a - 0.15) * 12
      );
    }
  }

  if (mode === "MOON") {
    fill(180, 215, 255);

    arc(
      0,
      -45,
      30,
      30,
      -HALF_PI,
      HALF_PI
    );
  }

  if (mode === "FIRE") {
    fill(255, 80, 20);

    triangle(
      -12,
      -40,
      0,
      -55,
      8,
      -38
    );
  }

  if (mode === "WATER") {
    fill(60, 190, 255);

    arc(
      0,
      -42,
      30,
      22,
      PI,
      TWO_PI
    );
  }

  if (mode === "WIND") {
    fill(100, 240, 180);

    triangle(
      -10,
      -40,
      -25,
      -50,
      -7,
      -32
    );

    triangle(
      10,
      -40,
      25,
      -50,
      7,
      -32
    );
  }

  if (mode === "EARTH") {
    fill(150, 100, 55);

    rect(
      -14,
      -48,
      28,
      8,
      3
    );
  }

  if (mode === "THUNDER") {
    fill(190, 225, 255);

    beginShape();

    vertex(-8, -38);
    vertex(2, -55);
    vertex(0, -43);
    vertex(12, -48);
    vertex(4, -35);

    endShape(CLOSE);
  }

  // Form-specific decoration
  if (formIndex === 1) {
    stroke(c[0], c[1], c[2], 180);
    strokeWeight(2);
    noFill();

    circle(0, -29, 42);
  }

  if (formIndex === 2) {
    fill(c[0], c[1], c[2], 150);

    triangle(
      -18,
      -35,
      -35,
      -45,
      -18,
      -20
    );

    triangle(
      18,
      -35,
      35,
      -45,
      18,
      -20
    );
  }
}

// ============================================================
// COMPANION
// ============================================================

function drawCompanion() {
  push();

  translate(companion.x, companion.y);

  rotate(sin(companion.angle) * 0.08);

  let c = powerData[mode].color;

  noStroke();

  fill(c[0], c[1], c[2], 35);
  circle(0, 0, 65);

  let animal =
    powerData[mode].forms[formIndex].animal;

  if (animal === "LION") drawLion(c);
  else if (animal === "WOLF") drawWolf(c);
  else if (animal === "OWL") drawOwl(c);
  else if (animal === "PHOENIX") drawPhoenix(c);
  else if (animal === "FOX") drawFox(c);
  else if (animal === "DRAGON") drawDragon(c);
  else if (animal === "DOLPHIN") drawDolphin(c);
  else if (animal === "SERPENT") drawSerpent(c);
  else if (animal === "HAWK") drawHawk(c);
  else if (animal === "EAGLE") drawEagle(c);
  else if (animal === "BEAR") drawBear(c);
  else if (animal === "RHINO") drawRhino(c);
  else if (animal === "TIGER") drawTiger(c);

  pop();
}

// ============================================================
// ANIMAL HELPERS
// ============================================================

function animalHead(c) {
  noStroke();

  fill(c[0], c[1], c[2], 220);

  ellipse(0, 0, 35, 28);

  fill(20);

  circle(-7, -2, 4);
  circle(7, -2, 4);
}

function drawLion(c) {
  fill(230, 160, 45, 180);
  circle(0, 0, 48);

  animalHead(c);

  triangle(-13, -10, -20, -22, -5, -14);
  triangle(13, -10, 20, -22, 5, -14);
}

function drawWolf(c) {
  animalHead(c);

  fill(c[0], c[1], c[2]);

  triangle(-12, -10, -18, -25, -2, -15);
  triangle(12, -10, 18, -25, 2, -15);
}

function drawOwl(c) {
  fill(c[0], c[1], c[2], 220);

  ellipse(0, 0, 42, 34);

  fill(10);

  circle(-8, -3, 9);
  circle(8, -3, 9);

  fill(255);

  circle(-8, -3, 4);
  circle(8, -3, 4);

  fill(220, 170, 50);

  triangle(
    0,
    2,
    -5,
    8,
    5,
    8
  );

  fill(c[0], c[1], c[2]);

  triangle(-16, 5, -35, 18, -15, 17);
  triangle(16, 5, 35, 18, 15, 17);
}

function drawPhoenix(c) {
  fill(c[0], c[1], c[2], 180);

  triangle(0, 0, -45, -25, -20, 8);
  triangle(0, 0, 45, -25, 20, 8);

  animalHead(c);
}

function drawFox(c) {
  animalHead(c);

  triangle(-12, -10, -20, -25, -3, -15);
  triangle(12, -10, 20, -25, 3, -15);
}

function drawDragon(c) {
  animalHead(c);

  stroke(c[0], c[1], c[2]);
  strokeWeight(4);

  line(-12, -10, -25, -22);
  line(12, -10, 25, -22);

  noStroke();
}

function drawDolphin(c) {
  fill(c[0], c[1], c[2]);

  ellipse(0, 0, 45, 20);

  triangle(18, 0, 38, -10, 35, 8);
  triangle(-5, -5, -18, -18, 2, -10);
}

function drawSerpent(c) {
  noFill();

  stroke(c[0], c[1], c[2]);
  strokeWeight(8);

  beginShape();

  for (let x = -35; x <= 35; x += 5) {
    vertex(
      x,
      sin(x * 0.15 + worldTime) * 10
    );
  }

  endShape();

  noStroke();
}

function drawHawk(c) {
  fill(c[0], c[1], c[2]);

  triangle(0, 0, -45, -25, -10, 5);
  triangle(0, 0, 45, -25, 10, 5);

  animalHead(c);
}

function drawEagle(c) {
  drawHawk(c);
}

function drawBear(c) {
  animalHead(c);

  fill(c[0], c[1], c[2]);

  circle(-13, -12, 13);
  circle(13, -12, 13);
}

function drawRhino(c) {
  fill(c[0], c[1], c[2]);

  ellipse(0, 0, 48, 30);

  triangle(
    20,
    -5,
    42,
    -12,
    28,
    4
  );
}

function drawTiger(c) {
  animalHead(c);

  stroke(20);
  strokeWeight(3);

  line(-10, -5, -16, 3);
  line(10, -5, 16, 3);
  line(-5, -10, -10, -17);
  line(5, -10, 10, -17);

  noStroke();
}

// ============================================================
// POWER EFFECTS
// ============================================================

function drawPowerEffects() {
  let c = powerData[mode].color;

  // SUN
  if (mode === "SUN") {
    stroke(c[0], c[1], c[2], 100);
    strokeWeight(2);

    let angle = worldTime * 2;

    for (let i = 0; i < 12; i++) {
      let a = angle + (i * TWO_PI) / 12;

      line(
        player.x + cos(a) * 25,
        player.y + sin(a) * 25,
        player.x + cos(a) * 65,
        player.y + sin(a) * 65
      );
    }
  }

  // MOON
  else if (mode === "MOON") {
    noFill();

    stroke(c[0], c[1], c[2], 100);
    strokeWeight(2);

    ellipse(player.x, player.y, 100, 50);
    ellipse(player.x, player.y, 135, 70);
  }

  // FIRE
  else if (mode === "FIRE") {
    noStroke();

    fill(c[0], c[1], c[2], 80);

    ellipse(
      player.x,
      player.y + 10,
      65,
      85
    );

    fill(255, 150, 20, 130);

    ellipse(
      player.x - 12,
      player.y - 12,
      20,
      40
    );

    ellipse(
      player.x + 12,
      player.y - 8,
      18,
      36
    );
  }

  // WATER
  else if (mode === "WATER") {
    noFill();

    stroke(c[0], c[1], c[2], 110);
    strokeWeight(2);

    ellipse(player.x, player.y, 100, 35);
    ellipse(player.x, player.y, 135, 55);
    ellipse(player.x, player.y, 165, 75);
  }

  // WIND
  else if (mode === "WIND") {
    noFill();

    stroke(c[0], c[1], c[2], 120);
    strokeWeight(2);

    arc(
      player.x,
      player.y,
      120,
      80,
      worldTime,
      worldTime + PI
    );

    arc(
      player.x,
      player.y,
      150,
      100,
      worldTime + PI,
      worldTime + TWO_PI
    );
  }

  // EARTH
  else if (mode === "EARTH") {
    noStroke();

    fill(c[0], c[1], c[2], 80);

    circle(
      player.x,
      player.y + 25,
      60
    );

    fill(c[0], c[1], c[2], 45);

    circle(
      player.x,
      player.y + 25,
      95
    );
  }

  // THUNDER
  else if (mode === "THUNDER") {
    if (frameCount % 8 === 0) {
      stroke(200, 235, 255, 220);
      strokeWeight(3);

      drawLightning(
        player.x - 45,
        player.y - 65,
        player.x,
        player.y
      );

      drawLightning(
        player.x + 45,
        player.y - 65,
        player.x,
        player.y
      );
    }
  }

  noStroke();
}

// ============================================================
// GUIDE PREVIEW
// ============================================================

function drawPowerEffectsPreview() {
  push();

  translate(width / 2, height / 2 + 70);

  let c = powerData[mode].color;

  noStroke();

  fill(c[0], c[1], c[2], 20);

  circle(0, 0, 180);

  noFill();

  stroke(c[0], c[1], c[2], 100);
  strokeWeight(2);

  circle(
    0,
    0,
    140 + sin(worldTime * 2) * 10
  );

  pop();
}

// ============================================================
// LIGHTNING
// ============================================================

function drawLightning(x1, y1, x2, y2) {
  let midX =
    (x1 + x2) / 2 +
    random(-20, 20);

  let midY =
    (y1 + y2) / 2 +
    random(-20, 20);

  line(x1, y1, midX, midY);
  line(midX, midY, x2, y2);
}

// ============================================================
// PARTICLES
// ============================================================

class Particle {
  constructor(x, y, type) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.lifespan = 255;
    this.type = type;

    if (type === "SUN") {
      let angle = random(TWO_PI);
      let speed = random(2, 6);

      this.vel =
        p5.Vector.fromAngle(angle)
          .mult(speed);
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    this.lifespan -= 2;
  }

  updateSun() {
    this.pos.add(this.vel);
    this.lifespan -= 3;
  }

  isDead() {
    return this.lifespan <= 0;
  }

  show(col, size) {
    noStroke();
    fill(col);

    ellipse(
      this.pos.x,
      this.pos.y,
      size
    );
  }

  showSun() {
    let r = map(
      this.lifespan,
      255,
      0,
      255,
      150
    );

    let g = map(
      this.lifespan,
      255,
      0,
      200,
      0
    );

    fill(r, g, 0, this.lifespan);

    noStroke();

    ellipse(
      this.pos.x,
      this.pos.y,
      map(
        this.lifespan,
        255,
        0,
        8,
        1
      )
    );
  }
}

// ============================================================
// PARTICLE RESET
// ============================================================

function resetParticles(count) {
  particles = [];

  for (let i = 0; i < count; i++) {
    particles.push(
      new Particle(
        random(width),
        random(height),
        mode
      )
    );
  }
}

// ============================================================
// GAME UPDATE
// ============================================================

function updatePlayer() {
  player.update();
}

function updateCompanion() {
  companion.update();
}

// ============================================================
// POWER MODE LOGIC
// ============================================================

function runPowerSimulation() {
  for (let p of particles) {
    p.update();
  }
}

// ============================================================
// HUD
// ============================================================

function drawHUD() {
  let form =
    powerData[mode].forms[formIndex];

  let c =
    powerData[mode].color;

  // Top bar
  noStroke();

  fill(4, 10, 20, 235);

  rect(
    0,
    0,
    width,
    85
  );

  // Title
  textAlign(LEFT, CENTER);
  textStyle(BOLD);

  fill(255, 210, 120);

  textSize(22);

  text(
    "CELESTIAL POWERS",
    20,
    25
  );

  textSize(11);

  fill(100, 200, 240);

  text(
    "JUNITEN ELEMENTAL DYNAMICS",
    22,
    52
  );

  // Current form
  textAlign(RIGHT, CENTER);

  fill(
    c[0],
    c[1],
    c[2]
  );

  textSize(16);

  text(
    form.name,
    width - 20,
    25
  );

  textSize(11);

  fill(220);

  text(
    "POWER " +
      mode +
      "  •  " +
      form.animal,
    width - 20,
    51
  );

  textStyle(NORMAL);

  // Controls box
  let boxW = min(430, width - 40);

  fill(8, 16, 28, 230);

  rect(
    20,
    height - 75,
    boxW,
    50,
    8
  );

  fill(220);

  textAlign(LEFT, CENTER);

  textSize(11);

  text(
    "WASD MOVE   •   1-7 POWERS   •   FORM KEYS   •   M GUIDE   •   F FULLSCREEN",
    32,
    height - 50
  );
}

// ============================================================
// GAME GUIDE
// ============================================================

function drawGuide() {
  // Overlay
  noStroke();

  fill(0, 5, 15, 215);

  rect(
    0,
    0,
    width,
    height
  );

  // Guide dimensions
  let gw = min(
    1000,
    width - 40
  );

  let gh = min(
    680,
    height - 40
  );

  let gx =
    (width - gw) / 2;

  let gy =
    (height - gh) / 2;

  // Panel
  fill(7, 15, 28, 250);

  stroke(80, 150, 210);

  strokeWeight(2);

  rect(
    gx,
    gy,
    gw,
    gh,
    12
  );

  // Header
  noStroke();

  textAlign(CENTER, CENTER);

  textStyle(BOLD);

  fill(255, 205, 100);

  textSize(26);

  text(
    "JUNITEN GAME GUIDE",
    width / 2,
    gy + 35
  );

  textStyle(NORMAL);

  fill(150, 210, 240);

  textSize(12);

  text(
    "PRESS M TO CLOSE",
    width / 2,
    gy + 62
  );

  // Two columns
  let leftX = gx + 30;
  let rightX = gx + gw / 2 + 10;

  textAlign(LEFT, TOP);

  textStyle(BOLD);

  textSize(17);

  fill(255, 195, 60);

  text(
    "MOVEMENT",
    leftX,
    gy + 95
  );

  textStyle(NORMAL);

  textSize(13);

  fill(225);

  text("W = UP", leftX, gy + 125);
  text("A = LEFT", leftX, gy + 148);
  text("S = DOWN", leftX, gy + 171);
  text("D = RIGHT", leftX, gy + 194);

  text(
    "SPACE = RESET",
    leftX,
    gy + 230
  );

  text(
    "F = FULLSCREEN",
    leftX,
    gy + 253
  );

  textStyle(BOLD);

  textSize(17);

  fill(255, 195, 60);

  text(
    "POWER FORMS",
    rightX,
    gy + 95
  );

  let powers =
    Object.keys(powerData);

  for (let i = 0; i < powers.length; i++) {
    let power =
      powers[i];

    let data =
      powerData[power];

    let y =
      gy + 125 + i * 45;

    fill(
      data.color[0],
      data.color[1],
      data.color[2]
    );

    textStyle(BOLD);

    text(
      power,
      rightX,
      y
    );

    textStyle(NORMAL);

    fill(225);

    let forms =
      data.forms;

    text(
      forms[0].key +
        " " +
        forms[0].name,
      rightX + 70,
      y
    );

    text(
      forms[1].key +
        " " +
        forms[1].name,
      rightX + 210,
      y
    );

    text(
      forms[2].key +
        " " +
        forms[2].name,
      rightX + 350,
      y
    );
  }

  // Gameplay
  textStyle(BOLD);

  textSize(17);

  fill(255, 195, 60);

  text(
    "GAMEPLAY",
    leftX,
    gy + 315
  );

  textStyle(NORMAL);

  textSize(13);

  fill(225);

  text(
    "Your character is the active celestial warrior.",
    leftX,
    gy + 345
  );

  text(
    "Your animal companion follows you.",
    leftX,
    gy + 370
  );

  text(
    "Switch forms at any time.",
    leftX,
    gy + 395
  );

  text(
    "Each power changes your aura and effects.",
    leftX,
    gy + 420
  );

  text(
    "Move around the celestial arena with WASD.",
    leftX,
    gy + 445
  );

  // Current form panel
  fill(15, 30, 45);

  stroke(60, 100, 130);

  rect(
    gx + 30,
    gy + gh - 95,
    gw - 60,
    60,
    8
  );

  noStroke();

  let active =
    powerData[mode]
      .forms[formIndex];

  fill(
    powerData[mode].color[0],
    powerData[mode].color[1],
    powerData[mode].color[2]
  );

  textAlign(CENTER, CENTER);

  textStyle(BOLD);

  textSize(16);

  text(
    "CURRENT FORM: " +
      active.name,
    width / 2,
    gy + gh - 70
  );

  textStyle(NORMAL);

  textSize(11);

  fill(220);

  text(
    "Animal: " +
      active.animal +
      "  •  Press M to return",
    width / 2,
    gy + gh - 48
  );
}

// ============================================================
// KEYBOARD
// ============================================================

function keyPressed() {
  let k =
    String(key).toUpperCase();

  // Guide
  if (k === "M") {
    showGuide = !showGuide;
    return false;
  }

  // Fullscreen
  if (k === "F") {
    toggleFullscreen();
    return false;
  }

  // Reset
  if (keyCode === 32) {
    resetGame();
    return false;
  }

  // Power switching
  if (k === "1") {
    setPower("SUN");
    return false;
  }

  if (k === "2") {
    setPower("MOON");
    return false;
  }

  if (k === "3") {
    setPower("FIRE");
    return false;
  }

  if (k === "4") {
    setPower("WATER");
    return false;
  }

  if (k === "5") {
    setPower("WIND");
    return false;
  }

  if (k === "6") {
    setPower("EARTH");
    return false;
  }

  if (k === "7") {
    setPower("THUNDER");
    return false;
  }

  // Form switching
  let forms =
    powerData[mode].forms;

  for (let i = 0; i < forms.length; i++) {
    if (k === forms[i].key) {
      formIndex = i;
      resetParticles(200);
      return false;
    }
  }

  return false;
}

// ============================================================
// POWER SETTER
// ============================================================

function setPower(newPower) {
  mode = newPower;
  formIndex = 0;

  resetParticles(200);
}

// ============================================================
// RESET
// ============================================================

function resetGame() {
  if (!player || !companion) {
    return;
  }

  player.x = width / 2;
  player.y = height / 2 + 70;

  player.direction = "DOWN";
  player.walkCycle = 0;

  companion.x =
    player.x - 55;

  companion.y =
    player.y + 25;

  resetParticles(200);
}

// ============================================================
// FULLSCREEN
// ============================================================

function createFullscreenButton() {
  fullscreenButton =
    createButton("FULLSCREEN");

  fullscreenButton.position(
    20,
    92
  );

  fullscreenButton.style(
    "background",
    "#0b1728"
  );

  fullscreenButton.style(
    "color",
    "#9edcff"
  );

  fullscreenButton.style(
    "border",
    "1px solid #4d87aa"
  );

  fullscreenButton.style(
    "border-radius",
    "6px"
  );

  fullscreenButton.style(
    "padding",
    "8px 14px"
  );

  fullscreenButton.style(
    "cursor",
    "pointer"
  );

  fullscreenButton.mousePressed(
    toggleFullscreen
  );
}

function toggleFullscreen() {
  let fs =
    fullscreen();

  fullscreen(!fs);

  setTimeout(
    function () {
      resizeCanvas(
        windowWidth,
        windowHeight
      );
    },
    100
  );
}

// ============================================================
// MOUSE
// ============================================================

function mousePressed() {
  // Clicking the fullscreen button
  // is handled by the HTML button.

  if (showGuide) {
    return false;
  }

  return false;
}

// ============================================================
// TOUCH
// ============================================================

function touchStarted() {
  return false;
}
