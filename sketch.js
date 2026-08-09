```javascript
/*
============================================================
CELESTIAL POWERS RPG
JŪNITEN ELEMENTAL DYNAMICS
============================================================

MOVEMENT
W / ↑ = UP
A / ← = LEFT
S / ↓ = DOWN
D / → = RIGHT

POWER FORMS
SUN:
Q = Solar Knight
E = Solar Lion
R = Solar Phoenix

MOON:
T = Lunar Knight
Y = Lunar Wolf
U = Lunar Owl

FIRE:
I = Flame Warrior
O = Flame Fox
P = Flame Dragon

WATER:
F = Tide Warrior
G = Aqua Dolphin
H = Ocean Serpent

WIND:
J = Sky Warrior
K = Wind Hawk
L = Storm Eagle

EARTH:
Z = Earth Guardian
X = Earth Bear
C = Stone Rhino

THUNDER:
V = Thunder Warrior
B = Thunder Tiger
N = Lightning Dragon

OTHER
1-7 = Switch powers
M = Toggle guide
SPACE = Reset
F = Fullscreen

============================================================
*/

// ============================================================
// GLOBAL GAME STATE
// ============================================================

let particles = [];

let mode = "SUN";
let currentForm = "Q";

let player;
let companion;

let keys = {};
let showGuide = false;

let buttons = [];

let worldTime = 0;


// ============================================================
// POWER DATA
// ============================================================

const powerData = {

  SUN: {
    color: [255, 200, 50],
    forms: [
      { key: "Q", name: "SOLAR KNIGHT", animal: "LION" },
      { key: "E", name: "SOLAR LION", animal: "LION" },
      { key: "R", name: "SOLAR PHOENIX", animal: "PHOENIX" }
    ]
  },

  MOON: {
    color: [150, 200, 255],
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
    color: [160, 210, 255],
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

  resetParticles(200);

  createGameButtons();

}


// ============================================================
// RESPONSIVE CANVAS
// ============================================================

function windowResized() {

  resizeCanvas(windowWidth, windowHeight);

  if (player) {
    player.keepInside();
  }

}


// ============================================================
// MAIN DRAW
// ============================================================

function draw() {

  worldTime += 0.01;

  drawBackground();

  updateGame();

  drawPowerEffects();

  drawCompanion();

  drawPlayer();

  drawHUD();

  if (showGuide) {
    drawGuide();
  }

}


// ============================================================
// BACKGROUND
// ============================================================

function drawBackground() {

  background(5, 9, 20);

  // Grid

  stroke(30, 50, 75, 80);
  strokeWeight(1);

  for (let x = 0; x < width; x += 50) {
    line(x, 0, x, height);
  }

  for (let y = 0; y < height; y += 50) {
    line(0, y, width, y);
  }

  // Arena

  noFill();

  let c = powerData[mode].color;

  stroke(c[0], c[1], c[2], 35);
  strokeWeight(3);

  ellipse(
    width / 2,
    height / 2,
    min(width * 0.75, 900),
    min(height * 0.7, 600)
  );

  // Stars

  noStroke();

  for (let i = 0; i < 90; i++) {

    let x = (i * 97 + frameCount * 0.15) % width;
    let y = (i * 47) % height;

    fill(130, 180, 230, 45);

    circle(x, y, 2);

  }

}


// ============================================================
// GAME UPDATE
// ============================================================

function updateGame() {

  player.update();

  companion.update();

}


// ============================================================
// PLAYER
// ============================================================

class Player {

  constructor() {

    this.x = width / 2;
    this.y = height / 2;

    this.speed = 4.5;

    this.walkCycle = 0;

    this.direction = "DOWN";

  }


  update() {

    let dx = 0;
    let dy = 0;


    // WASD

    if (keys["w"]) {
      dy -= 1;
      this.direction = "UP";
    }

    if (keys["s"]) {
      dy += 1;
      this.direction = "DOWN";
    }

    if (keys["a"]) {
      dx -= 1;
      this.direction = "LEFT";
    }

    if (keys["d"]) {
      dx += 1;
      this.direction = "RIGHT";
    }


    // Arrow keys

    if (keys["arrowup"]) {
      dy -= 1;
      this.direction = "UP";
    }

    if (keys["arrowdown"]) {
      dy += 1;
      this.direction = "DOWN";
    }

    if (keys["arrowleft"]) {
      dx -= 1;
      this.direction = "LEFT";
    }

    if (keys["arrowright"]) {
      dx += 1;
      this.direction = "RIGHT";
    }


    // Normalize diagonal movement

    if (dx !== 0 || dy !== 0) {

      let length = Math.sqrt(dx * dx + dy * dy);

      dx /= length;
      dy /= length;

      this.x += dx * this.speed;
      this.y += dy * this.speed;

      this.walkCycle += 0.3;

    }


    this.keepInside();

  }


  keepInside() {

    this.x = constrain(this.x, 55, width - 55);
    this.y = constrain(this.y, 110, height - 55);

  }

}


// ============================================================
// COMPANION
// ============================================================

class Companion {

  constructor() {

    this.x = player.x - 65;
    this.y = player.y;

    this.angle = 0;

  }


  update() {

    let targetX = player.x - 65;
    let targetY = player.y + 20;

    this.x = lerp(this.x, targetX, 0.08);
    this.y = lerp(this.y, targetY, 0.08);

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

  for (let r = 70; r > 20; r -= 8) {

    fill(
      c[0],
      c[1],
      c[2],
      map(r, 70, 20, 5, 35)
    );

    circle(0, 0, r);

  }


  // Shadow

  fill(0, 0, 0, 120);

  ellipse(0, 34, 50, 13);


  // Walking legs

  let walk = sin(player.walkCycle) * 5;

  stroke(25);

  strokeWeight(7);

  line(-8, 14, -8 + walk, 32);

  line(8, 14, 8 - walk, 32);


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

  fill(225, 180, 140);

  circle(0, -29, 30);


  // Hair

  fill(25);

  arc(0, -34, 32, 28, PI, TWO_PI);


  // Eyes

  fill(10);

  circle(-5, -29, 3);
  circle(5, -29, 3);


  drawHeadgear();


  // Direction indicator

  noFill();

  stroke(255, 255, 255, 80);

  strokeWeight(1);

  circle(0, 0, 65);

  pop();

}


// ============================================================
// HEADGEAR
// ============================================================

function drawHeadgear() {

  let c = powerData[mode].color;

  noStroke();

  if (mode === "SUN") {

    fill(255, 210, 60);

    for (let i = 0; i < 8; i++) {

      let a = TWO_PI * i / 8;

      triangle(
        cos(a) * 18,
        -29 + sin(a) * 18,
        cos(a + 0.15) * 12,
        -29 + sin(a + 0.15) * 12,
        cos(a - 0.15) * 12,
        -29 + sin(a - 0.15) * 12
      );

    }

  }


  if (mode === "MOON") {

    fill(180, 220, 255);

    arc(
      0,
      -43,
      30,
      30,
      -HALF_PI,
      HALF_PI
    );

  }


  if (mode === "FIRE") {

    fill(255, 70, 20);

    triangle(
      -12,
      -41,
      0,
      -57,
      10,
      -40
    );

  }


  if (mode === "WATER") {

    fill(70, 190, 255);

    arc(
      0,
      -42,
      32,
      20,
      PI,
      TWO_PI
    );

  }


  if (mode === "WIND") {

    fill(100, 240, 180);

    triangle(-10, -40, -25, -52, -7, -32);
    triangle(10, -40, 25, -52, 7, -32);

  }


  if (mode === "EARTH") {

    fill(150, 100, 55);

    rect(-15, -49, 30, 9, 3);

  }


  if (mode === "THUNDER") {

    fill(200, 230, 255);

    beginShape();

    vertex(-8, -39);
    vertex(3, -56);
    vertex(0, -44);
    vertex(13, -49);
    vertex(4, -35);

    endShape(CLOSE);

  }

}


// ============================================================
// COMPANION
// ============================================================

function drawCompanion() {

  push();

  translate(companion.x, companion.y);

  let c = powerData[mode].color;

  noStroke();

  fill(c[0], c[1], c[2], 40);

  circle(0, 0, 65);

  let form = getCurrentForm();

  drawAnimal(form.animal, c);

  pop();

}


// ============================================================
// ANIMAL DISPATCHER
// ============================================================

function drawAnimal(animal, c) {

  if (animal === "LION") drawLion(c);
  if (animal === "WOLF") drawWolf(c);
  if (animal === "PHOENIX") drawPhoenix(c);
  if (animal === "OWL") drawOwl(c);
  if (animal === "FOX") drawFox(c);
  if (animal === "DRAGON") drawDragon(c);
  if (animal === "DOLPHIN") drawDolphin(c);
  if (animal === "SERPENT") drawSerpent(c);
  if (animal === "HAWK") drawHawk(c);
  if (animal === "EAGLE") drawEagle(c);
  if (animal === "BEAR") drawBear(c);
  if (animal === "RHINO") drawRhino(c);
  if (animal === "TIGER") drawTiger(c);

}


// ============================================================
// ANIMAL DRAWINGS
// ============================================================

function animalHead(c) {

  noStroke();

  fill(c[0], c[1], c[2], 220);

  ellipse(0, 0, 36, 29);

  fill(20);

  circle(-7, -2, 4);
  circle(7, -2, 4);

}


function drawLion(c) {

  fill(230, 160, 45, 190);

  circle(0, 0, 50);

  animalHead(c);

  triangle(-13, -10, -20, -23, -5, -14);
  triangle(13, -10, 20, -23, 5, -14);

}


function drawWolf(c) {

  animalHead(c);

  fill(c[0], c[1], c[2]);

  triangle(-12, -10, -19, -26, -2, -15);
  triangle(12, -10, 19, -26, 2, -15);

}


function drawPhoenix(c) {

  noStroke();

  fill(c[0], c[1], c[2], 180);

  triangle(0, 0, -45, -25, -20, 8);
  triangle(0, 0, 45, -25, 20, 8);

  animalHead(c);

}


function drawOwl(c) {

  animalHead(c);

  fill(240);

  circle(-7, -2, 9);
  circle(7, -2, 9);

  fill(20);

  circle(-7, -2, 3);
  circle(7, -2, 3);

  fill(c[0], c[1], c[2]);

  triangle(0, 2, -5, 8, 5, 8);

}


function drawFox(c) {

  animalHead(c);

  fill(c[0], c[1], c[2]);

  triangle(-13, -10, -21, -27, -3, -16);
  triangle(13, -10, 21, -27, 3, -16);

}


function drawDragon(c) {

  animalHead(c);

  stroke(c[0], c[1], c[2]);

  strokeWeight(4);

  line(-12, -10, -26, -23);
  line(12, -10, 26, -23);

  noStroke();

}


function drawDolphin(c) {

  fill(c[0], c[1], c[2]);

  ellipse(0, 0, 48, 22);

  triangle(18, 0, 40, -11, 36, 9);

  triangle(-5, -5, -20, -19, 2, -10);

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

  triangle(20, -5, 43, -13, 28, 5);

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

    stroke(c[0], c[1], c[2], 120);

    strokeWeight(2);

    for (let i = 0; i < 12; i++) {

      let a =
        worldTime * 2 +
        i * TWO_PI / 12;

      line(
        player.x + cos(a) * 25,
        player.y + sin(a) * 25,
        player.x + cos(a) * 70,
        player.y + sin(a) * 70
      );

    }

  }


  // MOON

  if (mode === "MOON") {

    noFill();

    stroke(c[0], c[1], c[2], 120);

    ellipse(player.x, player.y, 100, 50);
    ellipse(player.x, player.y, 140, 70);

  }


  // FIRE

  if (mode === "FIRE") {

    noStroke();

    fill(255, 70, 10, 80);

    ellipse(
      player.x,
      player.y + 10,
      65,
      90
    );

    fill(255, 170, 20, 100);

    ellipse(
      player.x - 12,
      player.y - 15,
      18,
      40
    );

    ellipse(
      player.x + 12,
      player.y - 8,
      18,
      35
    );

  }


  // WATER

  if (mode === "WATER") {

    noFill();

    stroke(c[0], c[1], c[2], 120);

    ellipse(player.x, player.y, 100, 35);
    ellipse(player.x, player.y, 140, 55);
    ellipse(player.x, player.y, 175, 75);

  }


  // WIND

  if (mode === "WIND") {

    noFill();

    stroke(c[0], c[1], c[2], 130);

    arc(
      player.x,
      player.y,
      130,
      80,
      worldTime,
      worldTime + PI
    );

    arc(
      player.x,
      player.y,
      160,
      100,
      worldTime + PI,
      worldTime + TWO_PI
    );

  }


  // EARTH

  if (mode === "EARTH") {

    noStroke();

    fill(c[0], c[1], c[2], 80);

    circle(player.x, player.y + 25, 65);

    fill(c[0], c[1], c[2], 40);

    circle(player.x, player.y + 25, 100);

  }


  // THUNDER

  if (mode === "THUNDER") {

    if (frameCount % 7 === 0) {

      stroke(210, 240, 255);

      strokeWeight(3);

      drawLightning(
        player.x - 55,
        player.y - 70,
        player.x,
        player.y
      );

      drawLightning(
        player.x + 55,
        player.y - 70,
        player.x,
        player.y
      );

    }

  }

  noStroke();

}


// ============================================================
// LIGHTNING
// ============================================================

function drawLightning(x1, y1, x2, y2) {

  let midX =
    (x1 + x2) / 2 +
    random(-18, 18);

  let midY =
    (y1 + y2) / 2 +
    random(-18, 18);

  line(x1, y1, midX, midY);
  line(midX, midY, x2, y2);

}


// ============================================================
// HUD
// ============================================================

function drawHUD() {

  // Top bar

  fill(4, 10, 20, 235);

  noStroke();

  rect(0, 0, width, 82);


  // Title

  textAlign(LEFT, CENTER);

  textStyle(BOLD);

  textSize(22);

  fill(255, 210, 120);

  text(
    "CELESTIAL POWERS",
    22,
    25
  );


  textSize(11);

  fill(100, 200, 240);

  text(
    "JŪNITEN ELEMENTAL DYNAMICS",
    24,
    52
  );


  // Current form

  let form = getCurrentForm();

  textAlign(RIGHT, CENTER);

  textSize(16);

  fill(
    powerData[mode].color[0],
    powerData[mode].color[1],
    powerData[mode].color[2]
  );

  text(
    form.name,
    width - 25,
    26
  );


  textSize(11);

  fill(220);

  text(
    mode + " • " + form.animal,
    width - 25,
    51
  );


  textStyle(NORMAL);


  // Movement box

  fill(5, 15, 28, 220);

  stroke(60, 100, 130);

  rect(
    18,
    height - 75,
    210,
    55,
    8
  );

  noStroke();

  textAlign(CENTER, CENTER);

  textSize(11);

  fill(220);

  text(
    "MOVE: WASD / ARROW KEYS",
    123,
    height - 57
  );

  fill(120, 210, 255);

  text(
    "1-7 POWERS   •   M GUIDE   •   SPACE RESET",
    123,
    height - 38
  );

}


// ============================================================
// GAME GUIDE
// ============================================================

function drawGuide() {

  fill(0, 5, 15, 220);

  noStroke();

  rect(0, 0, width, height);


  let gw = min(width - 40, 1000);
  let gh = min(height - 60, 650);

  let gx = (width - gw) / 2;
  let gy = (height - gh) / 2;


  fill(7, 15, 28, 250);

  stroke(80, 150, 210);

  strokeWeight(2);

  rect(gx, gy, gw, gh, 12);


  textAlign(CENTER, CENTER);

  noStroke();

  textStyle(BOLD);

  textSize(26);

  fill(255, 205, 100);

  text(
    "JŪNITEN GAME GUIDE",
    width / 2,
    gy + 35
  );


  textStyle(NORMAL);

  textSize(13);

  fill(160, 210, 240);

  text(
    "PRESS M TO CLOSE",
    width / 2,
    gy + 65
  );


  // Movement

  textAlign(LEFT, TOP);

  textStyle(BOLD);

  textSize(18);

  fill(255, 195, 60);

  text(
    "MOVEMENT",
    gx + 35,
    gy + 105
  );


  textStyle(NORMAL);

  textSize(14);

  fill(230);

  text(
    "W / ↑ = UP",
    gx + 35,
    gy + 140
  );

  text(
    "A / ← = LEFT",
    gx + 35,
    gy + 165
  );

  text(
    "S / ↓ = DOWN",
    gx + 35,
    gy + 190
  );

  text(
    "D / → = RIGHT",
    gx + 35,
    gy + 215
  );


  // Powers

  textStyle(BOLD);

  textSize(18);

  fill(255, 195, 60);

  text(
    "POWER FORMS",
    gx + 330,
    gy + 105
  );


  textStyle(NORMAL);

  textSize(13);


  let powers = Object.keys(powerData);

  for (let i = 0; i < powers.length; i++) {

    let p = powers[i];

    let data = powerData[p];

    let y = gy + 140 + i * 45;

    fill(
      data.color[0],
      data.color[1],
      data.color[2]
    );

    textStyle(BOLD);

    text(
      (i + 1) + "  " + p,
      gx + 330,
      y
    );

    textStyle(NORMAL);

    fill(225);

    for (let j = 0; j < data.forms.length; j++) {

      let form = data.forms[j];

      text(
        form.key + " " + form.name,
        gx + 440 + j * 145,
        y
      );

    }

  }


  // Bottom information

  textStyle(BOLD);

  textSize(18);

  fill(255, 195, 60);

  text(
    "GAME CONTROLS",
    gx + 35,
    gy + gh - 135
  );


  textStyle(NORMAL);

  textSize(14);

  fill(225);

  text(
    "1-7 = Change elemental power",
    gx + 35,
    gy + gh - 105
  );

  text(
    "Form keys = Change warrior form",
    gx + 35,
    gy + gh - 80
  );

  text(
    "SPACE = Reset character",
    gx + 35,
    gy + gh - 55
  );


  fill(100, 210, 255);

  text(
    "M = Close guide",
    gx + 350,
    gy + gh - 55
  );

}


// ============================================================
// CURRENT FORM
// ============================================================

function getCurrentForm() {

  let forms = powerData[mode].forms;

  for (let i = 0; i < forms.length; i++) {

    if (forms[i].key === currentForm) {
      return forms[i];
    }

  }

  return forms[0];

}


// ============================================================
// MODE SWITCHING
// ============================================================

function setMode(newMode) {

  mode = newMode;

  currentForm =
    powerData[newMode].forms[0].key;

  resetParticles(200);

}


// ============================================================
// FORM SWITCHING
// ============================================================

function setForm(formKey) {

  let powers = Object.keys(powerData);

  for (let i = 0; i < powers.length; i++) {

    let p = powers[i];

    for (let j = 0; j < powerData[p].forms.length; j++) {

      let form = powerData[p].forms[j];

      if (form.key === formKey) {

        mode = p;

        currentForm = formKey;

        resetParticles(200);

        return;

      }

    }

  }

}


// ============================================================
// PARTICLES
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
// PARTICLE CLASS
// ============================================================

class Particle {

  constructor(x, y, type) {

    this.pos =
      createVector(
        x,
        y
      );

    this.vel =
      createVector(
        random(-1, 1),
        random(-1, 1)
      );

    this.acc =
      createVector(0, 0);

    this.lifespan = 255;

    this.type = type;


    if (type === "SUN") {

      let angle = random(TWO_PI);

      let speed = random(1, 4);

      this.vel =
        p5.Vector
          .fromAngle(angle)
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


  isDead() {

    return this.lifespan <= 0;

  }


  show(col, size) {

    noStroke();

    fill(col);

    circle(
      this.pos.x,
      this.pos.y,
      size
    );

  }

}


// ============================================================
// HTML BUTTONS
// ============================================================

function createGameButtons() {

  // These buttons are intentionally simple.
  // Your CSS can style them.

  let modes = [
    "SUN",
    "MOON",
    "FIRE",
    "WATER",
    "WIND",
    "EARTH",
    "THUNDER"
  ];


  for (let i = 0; i < modes.length; i++) {

    let btn =
      createButton(
        (i + 1) + " " + modes[i]
      );

    btn.position(
      10 + i * 90,
      height - 30
    );

    btn.mousePressed(
      () => setMode(modes[i])
    );

    buttons.push(btn);

  }

}


// ============================================================
// KEYBOARD CONTROL
// ============================================================

function keyPressed() {

  let k =
    key.toLowerCase();

  // Movement

  if (
    k === "w" ||
    k === "a" ||
    k === "s" ||
    k === "d"
  ) {

    keys[k] = true;

  }


  // Arrow movement

  if (
    keyCode === UP_ARROW ||
    keyCode === DOWN_ARROW ||
    keyCode === LEFT_ARROW ||
    keyCode === RIGHT_ARROW
  ) {

    if (keyCode === UP_ARROW)
      keys["arrowup"] = true;

    if (keyCode === DOWN_ARROW)
      keys["arrowdown"] = true;

    if (keyCode === LEFT_ARROW)
      keys["arrowleft"] = true;

    if (keyCode === RIGHT_ARROW)
      keys["arrowright"] = true;

    return false;

  }


  // Numbers

  if (k === "1") setMode("SUN");
  if (k === "2") setMode("MOON");
  if (k === "3") setMode("FIRE");
  if (k === "4") setMode("WATER");
  if (k === "5") setMode("WIND");
  if (k === "6") setMode("EARTH");
  if (k === "7") setMode("THUNDER");


  // Form keys

  let formKeys =
    [
      "q", "e", "r",
      "t", "y", "u",
      "i", "o", "p",
      "f", "g", "h",
      "j", "k", "l",
      "z", "x", "c",
      "v", "b", "n"
    ];


  if (formKeys.includes(k)) {

    setForm(k.toUpperCase());

  }


  // Guide

  if (k === "m") {

    showGuide = !showGuide;

  }


  // Reset

  if (keyCode === 32) {

    resetGame();

    return false;

  }


  // Fullscreen

  if (k === "f") {

    toggleFullscreen();

  }

}


// ============================================================
// KEY RELEASE
// ============================================================

function keyReleased() {

  let k =
    key.toLowerCase();


  if (
    k === "w" ||
    k === "a" ||
    k === "s" ||
    k === "d"
  ) {

    keys[k] = false;

  }


  if (keyCode === UP_ARROW)
    keys["arrowup"] = false;

  if (keyCode === DOWN_ARROW)
    keys["arrowdown"] = false;

  if (keyCode === LEFT_ARROW)
    keys["arrowleft"] = false;

  if (keyCode === RIGHT_ARROW)
    keys["arrowright"] = false;

}


// ============================================================
// EXTRA BROWSER KEYBOARD SUPPORT
// ============================================================

// This listener makes movement more reliable in fullscreen.

window.addEventListener(
  "keydown",
  function(event) {

    let k =
      event.key.toLowerCase();

    if (
      [
        "w",
        "a",
        "s",
        "d",
        "arrowup",
        "arrowdown",
        "arrowleft",
        "arrowright"
      ].includes(k)
    ) {

      keys[k] = true;

      event.preventDefault();

    }

  },
  { passive: false }
);


window.addEventListener(
  "keyup",
  function(event) {

    let k =
      event.key.toLowerCase();

    keys[k] = false;

  }
);


// ============================================================
// RESET GAME
// ============================================================

function resetGame() {

  player.x = width / 2;
  player.y = height / 2;

  player.direction = "DOWN";

  player.walkCycle = 0;

  companion.x = player.x - 65;
  companion.y = player.y + 20;

  resetParticles(200);

}


// ============================================================
// FULLSCREEN
// ============================================================

function toggleFullscreen() {

  if (!document.fullscreenElement) {

    let element =
      document.documentElement;

    if (element.requestFullscreen) {

      element.requestFullscreen();

    } else if (element.webkitRequestFullscreen) {

      element.webkitRequestFullscreen();

    }

  } else {

    if (document.exitFullscreen) {

      document.exitFullscreen();

    }

  }

}


// ============================================================
// MOUSE
// ============================================================

function mousePressed() {

  // Prevent guide from accidentally interacting
  // with the game.

  if (showGuide) {

    return false;

  }

}
```
