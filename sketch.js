/*
============================================================
CELESTIAL POWERS RPG
JŪNITEN ELEMENTAL DYNAMICS
============================================================

CONTROLS
WASD       Move
1-7        Select elemental power
Q E R      SUN forms
T Y U      MOON forms
I O P      FIRE forms
F G H      WATER forms
J K L      WIND forms
Z X C      EARTH forms
V B N      THUNDER forms
M          Toggle guide
SPACE      Reset character
F11        Browser fullscreen
============================================================
*/

let player;
let companion;
let particles = [];

let currentPower = "SUN";
let currentForm = 0;

let showGuide = true;
let worldTime = 0;

let keys = {};
let fullscreenButton;

// ============================================================
// POWER DATA
// ============================================================

const powers = {
  SUN: {
    color: [255, 195, 45],
    forms: [
      ["Q", "SOLAR KNIGHT", "LION"],
      ["E", "SOLAR LION", "LION"],
      ["R", "SOLAR PHOENIX", "PHOENIX"]
    ]
  },

  MOON: {
    color: [140, 190, 255],
    forms: [
      ["T", "LUNAR KNIGHT", "WOLF"],
      ["Y", "LUNAR WOLF", "WOLF"],
      ["U", "LUNAR OWL", "OWL"]
    ]
  },

  FIRE: {
    color: [255, 75, 25],
    forms: [
      ["I", "FLAME WARRIOR", "FOX"],
      ["O", "FLAME FOX", "FOX"],
      ["P", "FLAME DRAGON", "DRAGON"]
    ]
  },

  WATER: {
    color: [50, 170, 255],
    forms: [
      ["F", "TIDE WARRIOR", "DOLPHIN"],
      ["G", "AQUA DOLPHIN", "DOLPHIN"],
      ["H", "OCEAN SERPENT", "SERPENT"]
    ]
  },

  WIND: {
    color: [80, 220, 170],
    forms: [
      ["J", "SKY WARRIOR", "HAWK"],
      ["K", "WIND HAWK", "HAWK"],
      ["L", "STORM EAGLE", "EAGLE"]
    ]
  },

  EARTH: {
    color: [180, 125, 70],
    forms: [
      ["Z", "EARTH GUARDIAN", "BEAR"],
      ["X", "EARTH BEAR", "BEAR"],
      ["C", "STONE RHINO", "RHINO"]
    ]
  },

  THUNDER: {
    color: [150, 200, 255],
    forms: [
      ["V", "THUNDER WARRIOR", "TIGER"],
      ["B", "THUNDER TIGER", "TIGER"],
      ["N", "LIGHTNING DRAGON", "DRAGON"]
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

  createFullscreenButton();
  resetGame();
}

// ============================================================
// MAIN LOOP
// ============================================================

function draw() {
  worldTime += 0.015;

  drawBackground();

  updatePlayer();
  updateCompanion();

  updateParticles();
  drawPowerEffects();

  drawCompanion();
  drawPlayer();

  drawHUD();

  if (showGuide) {
    drawGuide();
  }
}

// ============================================================
// RESPONSIVE CANVAS
// ============================================================

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  if (player) {
    player.x = constrain(player.x, 50, width - 50);
    player.y = constrain(player.y, 110, height - 50);
  }
}

// ============================================================
// PLAYER
// ============================================================

class Player {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.speed = 4;
    this.direction = "DOWN";
    this.walkCycle = 0;
  }

  update() {
    let dx = 0;
    let dy = 0;

    if (keys["W"]) {
      dy -= 1;
      this.direction = "UP";
    }

    if (keys["S"]) {
      dy += 1;
      this.direction = "DOWN";
    }

    if (keys["A"]) {
      dx -= 1;
      this.direction = "LEFT";
    }

    if (keys["D"]) {
      dx += 1;
      this.direction = "RIGHT";
    }

    if (dx !== 0 || dy !== 0) {
      let magnitude = sqrt(dx * dx + dy * dy);

      dx /= magnitude;
      dy /= magnitude;

      this.x += dx * this.speed;
      this.y += dy * this.speed;

      this.walkCycle += 0.25;
    }

    this.x = constrain(this.x, 55, width - 55);
    this.y = constrain(this.y, 115, height - 55);
  }
}

// ============================================================
// COMPANION
// ============================================================

class Companion {
  constructor() {
    this.x = width / 2 - 65;
    this.y = height / 2 + 20;
    this.angle = 0;
  }

  update() {
    let targetX = player.x - 55;
    let targetY = player.y + 20;

    this.x = lerp(this.x, targetX, 0.08);
    this.y = lerp(this.y, targetY, 0.08);

    this.angle += 0.04;
  }
}

// ============================================================
// BACKGROUND
// ============================================================

function drawBackground() {
  let c = powers[currentPower].color;

  background(4, 8, 18);

  // Grid
  stroke(25, 45, 65, 90);
  strokeWeight(1);

  for (let x = 0; x < width; x += 50) {
    line(x, 80, x, height);
  }

  for (let y = 100; y < height; y += 50) {
    line(0, y, width, y);
  }

  // Arena
  noFill();

  stroke(c[0], c[1], c[2], 40);
  strokeWeight(2);

  ellipse(
    width / 2,
    height / 2 + 35,
    min(width * 0.85, 1000),
    min(height * 0.65, 600)
  );

  // Stars
  noStroke();

  for (let i = 0; i < 80; i++) {
    let x = (i * 97 + frameCount * 0.15) % width;
    let y = 90 + ((i * 47) % max(100, height - 90));

    fill(120, 180, 230, 45);
    circle(x, y, 2);
  }
}

// ============================================================
// PARTICLES
// ============================================================

class Particle {
  constructor(x, y, type) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.acc = createVector(0, 0);
    this.life = random(120, 255);
    this.type = type;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);

    this.acc.mult(0);
    this.life -= 2;
  }

  dead() {
    return this.life <= 0;
  }

  show(c, size) {
    noStroke();
    fill(c[0], c[1], c[2], this.life);
    circle(this.pos.x, this.pos.y, size);
  }
}

// ============================================================
// PARTICLE MANAGEMENT
// ============================================================

function resetParticles() {
  particles = [];

  for (let i = 0; i < 140; i++) {
    particles.push(
      new Particle(
        random(width),
        random(100, height),
        currentPower
      )
    );
  }
}

function updateParticles() {
  if (particles.length === 0) {
    resetParticles();
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];

    switch (currentPower) {
      case "SUN":
        updateSunParticle(p);
        break;

      case "MOON":
        updateMoonParticle(p);
        break;

      case "FIRE":
        updateFireParticle(p);
        break;

      case "WATER":
        updateWaterParticle(p);
        break;

      case "WIND":
        updateWindParticle(p);
        break;

      case "EARTH":
        updateEarthParticle(p);
        break;

      case "THUNDER":
        updateThunderParticle(p);
        break;
    }

    p.update();

    if (p.dead()) {
      particles[i] = new Particle(
        random(width),
        random(100, height),
        currentPower
      );
    }
  }
}

// ============================================================
// PARTICLE POWER BEHAVIOR
// ============================================================

function updateSunParticle(p) {
  let center = createVector(player.x, player.y);

  let dir = p5.Vector.sub(p.pos, center);

  if (dir.mag() < 50) {
    dir.normalize();
    dir.mult(0.8);
    p.applyForce(dir);
  }

  if (
    p.pos.x < 0 ||
    p.pos.x > width ||
    p.pos.y < 80 ||
    p.pos.y > height
  ) {
    p.pos.set(player.x, player.y);
    p.vel = p5.Vector.random2D().mult(random(1, 4));
  }
}

function updateMoonParticle(p) {
  let center = createVector(player.x, player.y);

  let force = p5.Vector.sub(center, p.pos);

  let distance = constrain(force.mag(), 30, 350);

  force.normalize();

  force.mult(100 / (distance * distance));

  p.applyForce(force);

  let orbit = createVector(-force.y, force.x);
  orbit.mult(0.8);

  p.applyForce(orbit);
}

function updateFireParticle(p) {
  let upward = createVector(
    random(-0.5, 0.5),
    -1.4
  );

  p.applyForce(upward);

  if (p.pos.y < 90) {
    p.pos.set(
      player.x + random(-30, 30),
      player.y + 30
    );

    p.life = 255;
  }
}

function updateWaterParticle(p) {
  let wave = sin(
    p.pos.x * 0.02 +
    worldTime * 4
  );

  p.applyForce(
    createVector(
      0.25,
      wave * 0.02
    )
  );

  if (p.pos.x > width + 20) {
    p.pos.x = -20;
  }
}

function updateWindParticle(p) {
  let angle =
    noise(
      p.pos.x * 0.004,
      p.pos.y * 0.004,
      worldTime * 0.3
    ) * TWO_PI * 4;

  let flow =
    p5.Vector.fromAngle(angle).mult(0.6);

  p.applyForce(flow);

  if (p.pos.x < -20) p.pos.x = width + 20;
  if (p.pos.x > width + 20) p.pos.x = -20;

  if (p.pos.y < 90) p.pos.y = height;
  if (p.pos.y > height) p.pos.y = 90;
}

function updateEarthParticle(p) {
  let target = createVector(
    player.x,
    player.y
  );

  let force = p5.Vector.sub(
    target,
    p.pos
  );

  if (force.mag() > 30) {
    force.setMag(0.08);
    p.applyForce(force);
  }

  p.vel.mult(0.96);
}

function updateThunderParticle(p) {
  p.applyForce(
    p5.Vector.random2D().mult(0.7)
  );

  if (
    p.pos.x < 0 ||
    p.pos.x > width ||
    p.pos.y < 80 ||
    p.pos.y > height
  ) {
    p.pos.set(
      player.x + random(-100, 100),
      player.y + random(-100, 100)
    );
  }
}

// ============================================================
// POWER EFFECTS
// ============================================================

function drawPowerEffects() {
  switch (currentPower) {
    case "SUN":
      drawSunEffect();
      break;

    case "MOON":
      drawMoonEffect();
      break;

    case "FIRE":
      drawFireEffect();
      break;

    case "WATER":
      drawWaterEffect();
      break;

    case "WIND":
      drawWindEffect();
      break;

    case "EARTH":
      drawEarthEffect();
      break;

    case "THUNDER":
      drawThunderEffect();
      break;
  }
}

// ============================================================
// SUN EFFECT
// ============================================================

function drawSunEffect() {
  let c = powers.SUN.color;

  noFill();

  stroke(c[0], c[1], c[2], 100);
  strokeWeight(2);

  let rotation = worldTime * 2;

  for (let i = 0; i < 12; i++) {
    let a =
      rotation +
      (TWO_PI * i) / 12;

    line(
      player.x + cos(a) * 30,
      player.y + sin(a) * 30,
      player.x + cos(a) * 70,
      player.y + sin(a) * 70
    );
  }

  noStroke();

  fill(255, 210, 70, 50);
  circle(player.x, player.y, 120);
}

// ============================================================
// MOON EFFECT
// ============================================================

function drawMoonEffect() {
  let c = powers.MOON.color;

  noFill();

  stroke(c[0], c[1], c[2], 100);
  strokeWeight(2);

  ellipse(
    player.x,
    player.y,
    130,
    70
  );

  ellipse(
    player.x,
    player.y,
    180,
    95
  );
}

// ============================================================
// FIRE EFFECT
// ============================================================

function drawFireEffect() {
  let c = powers.FIRE.color;

  noStroke();

  fill(c[0], c[1], c[2], 40);
  ellipse(
    player.x,
    player.y + 15,
    100,
    140
  );

  fill(255, 140, 20, 80);
  ellipse(
    player.x,
    player.y - 10,
    55,
    100
  );
}

// ============================================================
// WATER EFFECT
// ============================================================

function drawWaterEffect() {
  let c = powers.WATER.color;

  noFill();

  stroke(c[0], c[1], c[2], 100);
  strokeWeight(2);

  ellipse(
    player.x,
    player.y,
    130,
    55
  );

  ellipse(
    player.x,
    player.y,
    180,
    80
  );

  ellipse(
    player.x,
    player.y,
    230,
    105
  );
}

// ============================================================
// WIND EFFECT
// ============================================================

function drawWindEffect() {
  let c = powers.WIND.color;

  noFill();

  stroke(c[0], c[1], c[2], 120);
  strokeWeight(2);

  arc(
    player.x,
    player.y,
    170,
    110,
    worldTime,
    worldTime + PI
  );

  arc(
    player.x,
    player.y,
    220,
    140,
    worldTime + PI,
    worldTime + TWO_PI
  );
}

// ============================================================
// EARTH EFFECT
// ============================================================

function drawEarthEffect() {
  let c = powers.EARTH.color;

  noStroke();

  fill(c[0], c[1], c[2], 60);

  circle(
    player.x,
    player.y + 25,
    110
  );

  fill(c[0], c[1], c[2], 30);

  circle(
    player.x,
    player.y + 25,
    170
  );
}

// ============================================================
// THUNDER EFFECT
// ============================================================

function drawThunderEffect() {
  if (frameCount % 8 !== 0) {
    return;
  }

  stroke(190, 230, 255, 230);
  strokeWeight(3);

  drawLightning(
    player.x - 80,
    player.y - 100,
    player.x,
    player.y,
    25
  );

  drawLightning(
    player.x + 80,
    player.y - 100,
    player.x,
    player.y,
    25
  );

  noStroke();
}

function drawLightning(x1, y1, x2, y2, amount) {
  if (amount < 3) {
    line(x1, y1, x2, y2);
    return;
  }

  let midX =
    (x1 + x2) / 2 +
    random(-amount, amount);

  let midY =
    (y1 + y2) / 2 +
    random(-amount, amount);

  drawLightning(
    x1,
    y1,
    midX,
    midY,
    amount / 2
  );

  drawLightning(
    midX,
    midY,
    x2,
    y2,
    amount / 2
  );
}

// ============================================================
// PLAYER DRAWING
// ============================================================

function drawPlayer() {
  push();

  translate(
    player.x,
    player.y
  );

  let c =
    powers[currentPower].color;

  // Aura
  noStroke();

  for (let r = 80; r >= 30; r -= 10) {
    fill(
      c[0],
      c[1],
      c[2],
      map(r, 80, 30, 5, 30)
    );

    circle(0, 0, r);
  }

  // Shadow
  fill(0, 0, 0, 120);
  ellipse(0, 32, 50, 14);

  // Walking legs
  let walking =
    sin(player.walkCycle) * 5;

  stroke(30);
  strokeWeight(7);

  line(
    -8,
    15,
    -8 + walking,
    32
  );

  line(
    8,
    15,
    8 - walking,
    32
  );

  // Body
  noStroke();

  fill(
    c[0],
    c[1],
    c[2],
    230
  );

  ellipse(
    0,
    0,
    34,
    42
  );

  // Arms
  stroke(
    c[0],
    c[1],
    c[2]
  );

  strokeWeight(7);

  line(
    -15,
    -2,
    -26,
    10
  );

  line(
    15,
    -2,
    26,
    10
  );

  // Head
  noStroke();

  fill(220, 175, 135);

  circle(
    0,
    -28,
    30
  );

  // Hair
  fill(30);

  arc(
    0,
    -32,
    32,
    27,
    PI,
    TWO_PI
  );

  // Eyes
  fill(10);

  circle(-5, -28, 3);
  circle(5, -28, 3);

  drawHeadgear();

  pop();
}

// ============================================================
// HEADGEAR
// ============================================================

function drawHeadgear() {
  let c =
    powers[currentPower].color;

  noStroke();

  if (currentPower === "SUN") {
    fill(255, 205, 60);

    for (let i = 0; i < 8; i++) {
      let a =
        TWO_PI * i / 8;

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

  else if (currentPower === "MOON") {
    fill(
      c[0],
      c[1],
      c[2]
    );

    arc(
      0,
      -44,
      30,
      30,
      -HALF_PI,
      HALF_PI
    );
  }

  else if (currentPower === "FIRE") {
    fill(255, 70, 20);

    triangle(
      -12,
      -40,
      0,
      -56,
      10,
      -38
    );
  }

  else if (currentPower === "WATER") {
    fill(
      c[0],
      c[1],
      c[2]
    );

    arc(
      0,
      -42,
      32,
      22,
      PI,
      TWO_PI
    );
  }

  else if (currentPower === "WIND") {
    fill(
      c[0],
      c[1],
      c[2]
    );

    triangle(
      -10,
      -40,
      -26,
      -50,
      -7,
      -32
    );

    triangle(
      10,
      -40,
      26,
      -50,
      7,
      -32
    );
  }

  else if (currentPower === "EARTH") {
    fill(
      c[0],
      c[1],
      c[2]
    );

    rect(
      -15,
      -48,
      30,
      8,
      3
    );
  }

  else if (currentPower === "THUNDER") {
    fill(
      c[0],
      c[1],
      c[2]
    );

    beginShape();

    vertex(-8, -38);
    vertex(2, -55);
    vertex(0, -43);
    vertex(12, -48);
    vertex(4, -35);

    endShape(CLOSE);
  }
}

// ============================================================
// COMPANION
// ============================================================

function drawCompanion() {
  push();

  translate(
    companion.x,
    companion.y
  );

  let c =
    powers[currentPower].color;

  noStroke();

  fill(
    c[0],
    c[1],
    c[2],
    40
  );

  circle(0, 0, 65);

  let animal =
    powers[currentPower]
      .forms[currentForm][2];

  drawAnimal(
    animal,
    c
  );

  pop();
}

// ============================================================
// ANIMAL DRAWING
// ============================================================

function drawAnimal(animal, c) {
  if (animal === "LION") {
    drawLion(c);
  }

  else if (animal === "WOLF") {
    drawWolf(c);
  }

  else if (animal === "PHOENIX") {
    drawPhoenix(c);
  }

  else if (animal === "OWL") {
    drawOwl(c);
  }

  else if (animal === "FOX") {
    drawFox(c);
  }

  else if (animal === "DRAGON") {
    drawDragon(c);
  }

  else if (animal === "DOLPHIN") {
    drawDolphin(c);
  }

  else if (animal === "SERPENT") {
    drawSerpent(c);
  }

  else if (animal === "HAWK") {
    drawHawk(c);
  }

  else if (animal === "EAGLE") {
    drawEagle(c);
  }

  else if (animal === "BEAR") {
    drawBear(c);
  }

  else if (animal === "RHINO") {
    drawRhino(c);
  }

  else if (animal === "TIGER") {
    drawTiger(c);
  }
}

// ============================================================
// BASIC ANIMAL HEAD
// ============================================================

function animalHead(c) {
  noStroke();

  fill(
    c[0],
    c[1],
    c[2],
    230
  );

  ellipse(
    0,
    0,
    38,
    30
  );

  fill(20);

  circle(-7, -2, 4);
  circle(7, -2, 4);
}

// ============================================================
// ANIMALS
// ============================================================

function drawLion(c) {
  noStroke();

  fill(230, 160, 45, 190);
  circle(0, 0, 52);

  animalHead(c);

  triangle(
    -13,
    -10,
    -20,
    -23,
    -4,
    -14
  );

  triangle(
    13,
    -10,
    20,
    -23,
    4,
    -14
  );
}

function drawWolf(c) {
  animalHead(c);

  fill(
    c[0],
    c[1],
    c[2]
  );

  triangle(
    -12,
    -9,
    -19,
    -25,
    -2,
    -15
  );

  triangle(
    12,
    -9,
    19,
    -25,
    2,
    -15
  );
}

function drawPhoenix(c) {
  fill(
    c[0],
    c[1],
    c[2],
    180
  );

  triangle(
    0,
    0,
    -48,
    -28,
    -18,
    8
  );

  triangle(
    0,
    0,
    48,
    -28,
    18,
    8
  );

  animalHead(c);
}

function drawOwl(c) {
  noStroke();

  fill(
    c[0],
    c[1],
    c[2],
    220
  );

  ellipse(
    0,
    0,
    40,
    45
  );

  fill(15);

  circle(-9, -4, 12);
  circle(9, -4, 12);

  fill(255);

  circle(-9, -4, 5);
  circle(9, -4, 5);

  fill(255, 190, 40);

  triangle(
    -4,
    4,
    4,
    4,
    0,
    12
  );
}

function drawFox(c) {
  animalHead(c);

  fill(
    c[0],
    c[1],
    c[2]
  );

  triangle(
    -12,
    -10,
    -21,
    -26,
    -3,
    -15
  );

  triangle(
    12,
    -10,
    21,
    -26,
    3,
    -15
  );
}

function drawDragon(c) {
  animalHead(c);

  stroke(
    c[0],
    c[1],
    c[2]
  );

  strokeWeight(4);

  line(
    -12,
    -10,
    -26,
    -24
  );

  line(
    12,
    -10,
    26,
    -24
  );

  noStroke();
}

function drawDolphin(c) {
  fill(
    c[0],
    c[1],
    c[2]
  );

  ellipse(
    0,
    0,
    48,
    22
  );

  triangle(
    18,
    0,
    40,
    -10,
    36,
    8
  );

  triangle(
    -5,
    -5,
    -18,
    -18,
    3,
    -10
  );
}

function drawSerpent(c) {
  noFill();

  stroke(
    c[0],
    c[1],
    c[2]
  );

  strokeWeight(8);

  beginShape();

  for (
    let x = -38;
    x <= 38;
    x += 5
  ) {
    vertex(
      x,
      sin(
        x * 0.15 +
        worldTime
      ) * 10
    );
  }

  endShape();

  noStroke();
}

function drawHawk(c) {
  fill(
    c[0],
    c[1],
    c[2]
  );

  triangle(
    0,
    0,
    -48,
    -27,
    -10,
    6
  );

  triangle(
    0,
    0,
    48,
    -27,
    10,
    6
  );

  animalHead(c);
}

function drawEagle(c) {
  drawHawk(c);
}

function drawBear(c) {
  animalHead(c);

  fill(
    c[0],
    c[1],
    c[2]
  );

  circle(-14, -13, 14);
  circle(14, -13, 14);
}

function drawRhino(c) {
  fill(
    c[0],
    c[1],
    c[2]
  );

  ellipse(
    0,
    0,
    50,
    32
  );

  triangle(
    20,
    -5,
    44,
    -14,
    29,
    5
  );
}

function drawTiger(c) {
  animalHead(c);

  stroke(20);
  strokeWeight(3);

  line(-10, -5, -17, 4);
  line(10, -5, 17, 4);
  line(-5, -10, -10, -18);
  line(5, -10, 10, -18);

  noStroke();
}

// ============================================================
// HUD
// ============================================================

function drawHUD() {
  let c =
    powers[currentPower].color;

  let form =
    powers[currentPower]
      .forms[currentForm];

  // Top bar
  noStroke();

  fill(4, 10, 20, 235);

  rect(
    0,
    0,
    width,
    82
  );

  // Title
  textAlign(LEFT, CENTER);

  textStyle(BOLD);

  fill(255, 210, 120);

  textSize(
    min(23, width * 0.025)
  );

  text(
    "CELESTIAL POWERS",
    20,
    25
  );

  textStyle(NORMAL);

  textSize(11);

  fill(100, 200, 240);

  text(
    "JŪNITEN ELEMENTAL DYNAMICS",
    22,
    52
  );

  // Current form
  textAlign(RIGHT, CENTER);

  textSize(17);

  fill(
    c[0],
    c[1],
    c[2]
  );

  text(
    form[1],
    width - 20,
    25
  );

  textSize(11);

  fill(220);

  text(
    currentPower +
    " • " +
    form[2] +
    " • KEY " +
    form[0],
    width - 20,
    52
  );

  // Bottom movement HUD
  fill(5, 15, 28, 220);

  rect(
    20,
    height - 75,
    190,
    55,
    8
  );

  textAlign(CENTER, CENTER);

  textSize(12);

  fill(220);

  text(
    "WASD • MOVE",
    115,
    height - 56
  );

  textSize(10);

  fill(140, 200, 230);

  text(
    "M GUIDE • SPACE RESET",
    115,
    height - 35
  );
}

// ============================================================
// GAME GUIDE
// ============================================================

function drawGuide() {
  fill(0, 5, 15, 215);

  noStroke();

  rect(
    0,
    0,
    width,
    height
  );

  let panelW =
    min(
      width - 40,
      1050
    );

  let panelH =
    min(
      height - 40,
      700
    );

  let gx =
    (width - panelW) / 2;

  let gy =
    (height - panelH) / 2;

  fill(7, 15, 30, 250);

  stroke(80, 150, 220);

  strokeWeight(2);

  rect(
    gx,
    gy,
    panelW,
    panelH,
    12
  );

  noStroke();

  textAlign(
    CENTER,
    CENTER
  );

  textStyle(BOLD);

  textSize(
    min(28, width * 0.035)
  );

  fill(255, 205, 100);

  text(
    "JŪNITEN GAME GUIDE",
    width / 2,
    gy + 38
  );

  textStyle(NORMAL);

  textSize(12);

  fill(150, 210, 240);

  text(
    "PRESS M TO CLOSE",
    width / 2,
    gy + 67
  );

  // Movement
  textAlign(LEFT, TOP);

  textStyle(BOLD);

  textSize(17);

  fill(255, 195, 60);

  text(
    "MOVEMENT",
    gx + 30,
    gy + 105
  );

  textStyle(NORMAL);

  textSize(13);

  fill(230);

  text(
    "W = UP",
    gx + 30,
    gy + 138
  );

  text(
    "A = LEFT",
    gx + 30,
    gy + 162
  );

  text(
    "S = DOWN",
    gx + 30,
    gy + 186
  );

  text(
    "D = RIGHT",
    gx + 30,
    gy + 210
  );

  // Powers
  textStyle(BOLD);

  textSize(17);

  fill(255, 195, 60);

  text(
    "POWER FORMS",
    gx + panelW * 0.48,
    gy + 105
  );

  let names =
    Object.keys(powers);

  let startY =
    gy + 138;

  textSize(12);

  for (
    let i = 0;
    i < names.length;
    i++
  ) {
    let name =
      names[i];

    let data =
      powers[name];

    let y =
      startY + i * 32;

    fill(
      data.color[0],
      data.color[1],
      data.color[2]
    );

    textStyle(BOLD);

    text(
      name,
      gx + panelW * 0.48,
      y
    );

    textStyle(NORMAL);

    fill(225);

    let forms =
      data.forms;

    for (
      let j = 0;
      j < forms.length;
      j++
    ) {
      let x =
        gx +
        panelW * 0.60 +
        j * 125;

      text(
        forms[j][0] +
        " " +
        forms[j][1],
        x,
        y
      );
    }
  }

  // Gameplay
  textStyle(BOLD);

  textSize(17);

  fill(255, 195, 60);

  text(
    "GAMEPLAY",
    gx + 30,
    gy + 395
  );

  textStyle(NORMAL);

  textSize(13);

  fill(225);

  text(
    "• Move your celestial warrior with WASD.",
    gx + 30,
    gy + 425
  );

  text(
    "• Switch between seven elemental powers.",
    gx + 30,
    gy + 450
  );

  text(
    "• Each power contains three playable forms.",
    gx + 30,
    gy + 475
  );

  text(
    "• Every form has an animal companion.",
    gx + 30,
    gy + 500
  );

  text(
    "• SPACE resets your character.",
    gx + 30,
    gy + 525
  );

  text(
    "• Use the fullscreen button or browser F11.",
    gx + 30,
    gy + 550
  );

  // Active form
  let active =
    powers[currentPower]
      .forms[currentForm];

  fill(15, 30, 45);

  rect(
    gx + 30,
    gy + panelH - 80,
    panelW - 60,
    55,
    8
  );

  textAlign(
    CENTER,
    CENTER
  );

  textStyle(BOLD);

  textSize(16);

  fill(
    powers[currentPower]
      .color[0],
    powers[currentPower]
      .color[1],
    powers[currentPower]
      .color[2]
  );

  text(
    "CURRENT FORM: " +
    active[1] +
    " • " +
    active[2],
    width / 2,
    gy + panelH - 58
  );

  textStyle(NORMAL);
}

// ============================================================
// FULLSCREEN
// ============================================================

function createFullscreenButton() {
  fullscreenButton =
    createButton("FULLSCREEN");

  fullscreenButton.id(
    "fullscreen-button"
  );

  fullscreenButton.mousePressed(
    toggleFullscreen
  );
}

function toggleFullscreen() {
  let fs =
    fullscreen();

  fullscreen(
    !fs
  );

  setTimeout(
    () => {
      resizeCanvas(
        windowWidth,
        windowHeight
      );
    },
    100
  );
}

// ============================================================
// KEYBOARD
// ============================================================

function keyPressed() {
  let k =
    key.toUpperCase();

  keys[k] = true;

  // GUIDE
  if (k === "M") {
    showGuide =
      !showGuide;

    return false;
  }

  // RESET
  if (keyCode === 32) {
    resetGame();

    return false;
  }

  // POWER NUMBER KEYS
  if (k === "1") {
    selectPower("SUN", 0);
    return false;
  }

  if (k === "2") {
    selectPower("MOON", 0);
    return false;
  }

  if (k === "3") {
    selectPower("FIRE", 0);
    return false;
  }

  if (k === "4") {
    selectPower("WATER", 0);
    return false;
  }

  if (k === "5") {
    selectPower("WIND", 0);
    return false;
  }

  if (k === "6") {
    selectPower("EARTH", 0);
    return false;
  }

  if (k === "7") {
    selectPower("THUNDER", 0);
    return false;
  }

  // FORM KEYS
  selectFormByKey(k);

  return false;
}

function keyReleased() {
  let k =
    key.toUpperCase();

  keys[k] = false;

  return false;
}

// ============================================================
// FORM SELECTION
// ============================================================

function selectFormByKey(k) {
  let names =
    Object.keys(powers);

  for (
    let i = 0;
    i < names.length;
    i++
  ) {
    let power =
      names[i];

    let forms =
      powers[power].forms;

    for (
      let j = 0;
      j < forms.length;
      j++
    ) {
      if (
        forms[j][0] === k
      ) {
        selectPower(
          power,
          j
        );

        return;
      }
    }
  }
}

function selectPower(
  power,
  formIndex
) {
  currentPower =
    power;

  currentForm =
    formIndex;

  resetParticles();
}

// ============================================================
// RESET
// ============================================================

function resetGame() {
  if (!player) {
    return;
  }

  player.x =
    width / 2;

  player.y =
    height / 2;

  player.direction =
    "DOWN";

  player.walkCycle =
    0;

  companion.x =
    player.x - 55;

  companion.y =
    player.y + 20;

  resetParticles();
}

// ============================================================
// MOUSE
// ============================================================

function mousePressed() {
  // Don't let the guide
  // accidentally interact
  // with the game.

  if (showGuide) {
    return;
  }
}
