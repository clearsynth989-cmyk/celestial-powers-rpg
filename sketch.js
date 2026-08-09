# /*

CELESTIAL POWERS RPG
JŪNITEN ELEMENTAL DYNAMICS
==========================

MOVEMENT
W A S D = Move

POWERS
1 = SUN
2 = MOON
3 = FIRE
4 = WATER
5 = WIND
6 = EARTH
7 = THUNDER

21 FORMS
SUN     Q E R
MOON    T Y U
FIRE    I O P
WATER   F G H
WIND    J K L
EARTH   Z X C
THUNDER V B N

OTHER
M = Guide
SPACE = Reset
F = Fullscreen
==============

*/

let player;
let companion;
let particles = [];

let currentPower = "SUN";
let currentForm = 0;

let showGuide = true;
let worldTime = 0;

let keys = {};

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
color: [255, 80, 25],
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

const powerOrder = [
"SUN",
"MOON",
"FIRE",
"WATER",
"WIND",
"EARTH",
"THUNDER"
];

// ============================================================
// SETUP
// ============================================================

function setup() {
createCanvas(windowWidth, windowHeight);

player = new Player();
companion = new Companion();

resetGame();
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
// MAIN LOOP
// ============================================================

function draw() {
worldTime += 0.01;

drawWorld();

player.update();
companion.update();

drawPowerEffects();
drawCompanion();
drawPlayer();

drawHUD();

if (showGuide) {
drawGuide();
}
}

// ============================================================
// PLAYER
// ============================================================

class Player {

constructor() {
this.x = width / 2;
this.y = height / 2 + 50;

```
this.speed = 4.2;

this.direction = "DOWN";
this.walkCycle = 0;
```

}

update() {

```
if (showGuide) {
  return;
}

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

  let length = sqrt(dx * dx + dy * dy);

  dx /= length;
  dy /= length;

  this.x += dx * this.speed;
  this.y += dy * this.speed;

  this.walkCycle += 0.3;
}

this.keepInside();
```

}

keepInside() {
this.x = constrain(this.x, 55, width - 55);
this.y = constrain(this.y, 115, height - 55);
}
}

// ============================================================
// COMPANION
// ============================================================

class Companion {

constructor() {
this.x = width / 2 - 60;
this.y = height / 2 + 80;

```
this.angle = 0;
```

}

update() {

```
if (!player) {
  return;
}

let targetX = player.x - 60;
let targetY = player.y + 25;

this.x = lerp(this.x, targetX, 0.07);
this.y = lerp(this.y, targetY, 0.07);

this.angle += 0.04;
```

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

// Arena
let c = powers[currentPower].color;

noFill();
stroke(c[0], c[1], c[2], 45);
strokeWeight(2);

ellipse(
width / 2,
height / 2 + 40,
min(width * 0.8, 900),
min(height * 0.65, 520)
);

// Celestial particles
noStroke();

for (let i = 0; i < 90; i++) {

```
let x =
  (i * 97 + frameCount * 0.15) %
  width;

let y =
  100 + ((i * 47) % max(100, height - 100));

fill(120, 170, 220, 40);

circle(x, y, 2);
```

}
}

// ============================================================
// PLAYER DRAWING
// ============================================================

function drawPlayer() {

push();

translate(player.x, player.y);

let c = powers[currentPower].color;

// Aura
noStroke();

for (let r = 80; r > 25; r -= 8) {

```
fill(
  c[0],
  c[1],
  c[2],
  map(r, 80, 25, 5, 30)
);

circle(0, 0, r);
```

}

// Shadow
fill(0, 0, 0, 110);

ellipse(0, 34, 48, 13);

// Legs
let walking = sin(player.walkCycle) * 5;

stroke(25);
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

fill(c[0], c[1], c[2], 230);

ellipse(0, 0, 31, 39);

// Arms
stroke(c[0], c[1], c[2]);
strokeWeight(7);

line(-14, -2, -25, 10);
line(14, -2, 25, 10);

// Head
noStroke();

fill(220, 175, 135);

circle(0, -28, 30);

// Hair
fill(25);

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

// Direction ring
noFill();

stroke(255, 255, 255, 100);
strokeWeight(1);

circle(0, 0, 65);

pop();
}

// ============================================================
// HEADGEAR
// ============================================================

function drawHeadgear() {

let c = powers[currentPower].color;

noStroke();

if (currentPower === "SUN") {

```
fill(255, 205, 60);

for (let i = 0; i < 8; i++) {

  let a = TWO_PI * i / 8;

  triangle(
    cos(a) * 18,
    -30 + sin(a) * 18,

    cos(a + 0.15) * 12,
    -30 + sin(a + 0.15) * 12,

    cos(a - 0.15) * 12,
    -30 + sin(a - 0.15) * 12
  );
}
```

}

else if (currentPower === "MOON") {

```
fill(180, 215, 255);

arc(
  0,
  -45,
  28,
  28,
  -HALF_PI,
  HALF_PI
);
```

}

else if (currentPower === "FIRE") {

```
fill(255, 80, 20);

triangle(
  -12,
  -40,
  0,
  -55,
  10,
  -38
);
```

}

else if (currentPower === "WATER") {

```
fill(60, 190, 255);

arc(
  0,
  -42,
  30,
  22,
  PI,
  TWO_PI
);
```

}

else if (currentPower === "WIND") {

```
fill(100, 240, 180);

triangle(-10, -40, -25, -50, -7, -32);
triangle(10, -40, 25, -50, 7, -32);
```

}

else if (currentPower === "EARTH") {

```
fill(150, 100, 55);

rect(
  -14,
  -48,
  28,
  8,
  3
);
```

}

else if (currentPower === "THUNDER") {

```
fill(190, 225, 255);

beginShape();

vertex(-8, -38);
vertex(2, -55);
vertex(0, -43);
vertex(12, -48);
vertex(4, -35);

endShape(CLOSE);
```

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

let c = powers[currentPower].color;

noStroke();

fill(c[0], c[1], c[2], 40);

circle(0, 0, 65);

let animal =
powers[currentPower].forms[currentForm][2];

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

pop();
}

// ============================================================
// ANIMAL HELPERS
// ============================================================

function animalHead(c) {

noStroke();

fill(c[0], c[1], c[2], 225);

ellipse(0, 0, 36, 29);

fill(20);

circle(-7, -2, 4);
circle(7, -2, 4);
}

function drawLion(c) {

fill(230, 160, 45, 190);

circle(0, 0, 50);

animalHead(c);

triangle(-13, -10, -21, -23, -5, -14);
triangle(13, -10, 21, -23, 5, -14);
}

function drawWolf(c) {

animalHead(c);

fill(c[0], c[1], c[2]);

triangle(-12, -10, -19, -25, -2, -15);
triangle(12, -10, 19, -25, 2, -15);
}

function drawOwl(c) {

fill(c[0], c[1], c[2]);

ellipse(0, 0, 45, 38);

fill(15);

circle(-9, -3, 10);
circle(9, -3, 10);

fill(255);

circle(-9, -3, 4);
circle(9, -3, 4);

fill(c[0], c[1], c[2]);

triangle(0, 2, -5, 8, 5, 8);
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

line(-12, -10, -25, -23);
line(12, -10, 25, -23);

noStroke();
}

function drawDolphin(c) {

fill(c[0], c[1], c[2]);

ellipse(0, 0, 45, 20);

triangle(18, 0, 40, -10, 36, 9);

triangle(
-5,
-5,
-18,
-18,
2,
-10
);
}

function drawSerpent(c) {

noFill();

stroke(c[0], c[1], c[2]);
strokeWeight(8);

beginShape();

for (let x = -35; x <= 35; x += 5) {

```
vertex(
  x,
  sin(x * 0.15 + worldTime) * 10
);
```

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

let c = powers[currentPower].color;

push();

// SUN
if (currentPower === "SUN") {

```
noFill();

stroke(c[0], c[1], c[2], 110);
strokeWeight(2);

let angle = worldTime * 2;

for (let i = 0; i < 12; i++) {

  let a =
    angle +
    TWO_PI * i / 12;

  line(
    player.x + cos(a) * 28,
    player.y + sin(a) * 28,

    player.x + cos(a) * 70,
    player.y + sin(a) * 70
  );
}
```

}

// MOON
else if (currentPower === "MOON") {

```
noFill();

stroke(c[0], c[1], c[2], 100);
strokeWeight(2);

ellipse(
  player.x,
  player.y,
  100,
  50
);

ellipse(
  player.x,
  player.y,
  145,
  75
);
```

}

// FIRE
else if (currentPower === "FIRE") {

```
noStroke();

fill(255, 70, 10, 80);

ellipse(
  player.x,
  player.y + 10,
  65,
  90
);

for (let i = 0; i < 12; i++) {

  let px =
    player.x + random(-30, 30);

  let py =
    player.y + random(-55, 20);

  fill(
    255,
    random(70, 180),
    10,
    120
  );

  circle(
    px,
    py,
    random(4, 10)
  );
}
```

}

// WATER
else if (currentPower === "WATER") {

```
noFill();

stroke(c[0], c[1], c[2], 110);
strokeWeight(2);

ellipse(player.x, player.y, 105, 40);
ellipse(player.x, player.y, 145, 60);
ellipse(player.x, player.y, 180, 80);
```

}

// WIND
else if (currentPower === "WIND") {

```
noFill();

stroke(c[0], c[1], c[2], 120);
strokeWeight(2);

arc(
  player.x,
  player.y,
  130,
  85,
  worldTime,
  worldTime + PI
);

arc(
  player.x,
  player.y,
  165,
  105,
  worldTime + PI,
  worldTime + TWO_PI
);
```

}

// EARTH
else if (currentPower === "EARTH") {

```
noStroke();

fill(c[0], c[1], c[2], 70);

circle(
  player.x,
  player.y + 25,
  65
);

fill(c[0], c[1], c[2], 35);

circle(
  player.x,
  player.y + 25,
  105
);
```

}

// THUNDER
else if (currentPower === "THUNDER") {

```
if (frameCount % 8 === 0) {

  stroke(
    200,
    235,
    255,
    220
  );

  strokeWeight(3);

  drawLightning(
    player.x - 60,
    player.y - 70,
    player.x,
    player.y
  );

  drawLightning(
    player.x + 60,
    player.y - 70,
    player.x,
    player.y
  );
}
```

}

pop();
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

let c = powers[currentPower].color;

// Top bar
noStroke();

fill(4, 10, 20, 245);

rect(
0,
0,
width,
82
);

// Title
textAlign(LEFT, CENTER);

textStyle(BOLD);

textSize(
min(24, width * 0.035)
);

fill(255, 210, 120);

text(
"CELESTIAL POWERS",
22,
27
);

textSize(11);

fill(100, 200, 240);

text(
"JŪNITEN ELEMENTAL DYNAMICS",
24,
53
);

// Current form
let form =
powers[currentPower].forms[currentForm];

textAlign(RIGHT, CENTER);

textSize(
min(17, width * 0.025)
);

fill(c[0], c[1], c[2]);

text(
form[1],
width - 22,
27
);

textSize(11);

fill(220);

text(
currentPower +
" • " +
form[2],
width - 22,
53
);

textStyle(NORMAL);

// Movement panel
fill(8, 18, 30, 230);

stroke(70, 100, 130);

rect(
18,
height - 92,
185,
70,
8
);

noStroke();

textAlign(CENTER, CENTER);

fill(220);

textSize(11);

text(
"WASD  MOVE",
110,
height - 76
);

fill(120, 210, 255);

textSize(13);

text(
"1-7 POWERS   •   F FULLSCREEN",
110,
height - 50
);
}

// ============================================================
// GUIDE
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

let gw =
min(width - 40, 1100);

let gh =
min(height - 40, 690);

let gx =
(width - gw) / 2;

let gy =
(height - gh) / 2;

fill(7, 15, 28, 250);

stroke(80, 150, 210);

strokeWeight(2);

rect(
gx,
gy,
gw,
gh,
14
);

// Header
noStroke();

textAlign(CENTER, CENTER);

textStyle(BOLD);

textSize(
min(28, width * 0.045)
);

fill(255, 205, 100);

text(
"JŪNITEN GAME GUIDE",
width / 2,
gy + 38
);

textStyle(NORMAL);

textSize(13);

fill(150, 210, 240);

text(
"PRESS M TO START",
width / 2,
gy + 68
);

// Movement
textAlign(LEFT, TOP);

textStyle(BOLD);

textSize(18);

fill(255, 195, 60);

text(
"MOVEMENT",
gx + 30,
gy + 105
);

textStyle(NORMAL);

textSize(14);

fill(230);

text(
"W = UP",
gx + 30,
gy + 140
);

text(
"A = LEFT",
gx + 30,
gy + 165
);

text(
"S = DOWN",
gx + 30,
gy + 190
);

text(
"D = RIGHT",
gx + 30,
gy + 215
);

text(
"SPACE = RESET",
gx + 30,
gy + 245
);

text(
"F = FULLSCREEN",
gx + 30,
gy + 270
);

// Powers
textStyle(BOLD);

textSize(18);

fill(255, 195, 60);

text(
"POWER FORMS",
gx + gw * 0.48,
gy + 105
);

textStyle(NORMAL);

textSize(13);

for (let i = 0; i < powerOrder.length; i++) {

```
let power =
  powerOrder[i];

let data =
  powers[power];

let y =
  gy + 140 + i * 42;

fill(
  data.color[0],
  data.color[1],
  data.color[2]
);

textStyle(BOLD);

text(
  power,
  gx + gw * 0.48,
  y
);

textStyle(NORMAL);

fill(225);

for (let j = 0; j < 3; j++) {

  let form =
    data.forms[j];

  text(
    form[0] +
    "  " +
    form[1],

    gx + gw * 0.57 +
    j * 105,

    y
  );
}
```

}

// Current form
let active =
powers[currentPower].forms[currentForm];

fill(15, 30, 45);

stroke(60, 100, 130);

rect(
gx + 30,
gy + gh - 105,
gw - 60,
65,
8
);

noStroke();

textAlign(CENTER, CENTER);

textStyle(BOLD);

textSize(17);

fill(
powers[currentPower].color[0],
powers[currentPower].color[1],
powers[currentPower].color[2]
);

text(
"CURRENT FORM: " +
active[1],
width / 2,
gy + gh - 80
);

textStyle(NORMAL);

textSize(12);

fill(220);

text(
"COMPANION: " +
active[2] +
"  •  PRESS M TO PLAY",
width / 2,
gy + gh - 58
);
}

// ============================================================
// GAME RESET
// ============================================================

function resetGame() {

if (!player || !companion) {
return;
}

player.x = width / 2;
player.y = height / 2 + 50;

player.direction = "DOWN";
player.walkCycle = 0;

companion.x =
player.x - 60;

companion.y =
player.y + 25;
}

// ============================================================
// KEYBOARD
// ============================================================

function keyPressed() {

let k =
String(key).toUpperCase();

keys[k] = true;

// Guide
if (k === "M") {

```
showGuide =
  !showGuide;

return false;
```

}

// Reset
if (keyCode === 32) {

```
resetGame();

return false;
```

}

// Fullscreen
if (k === "F") {

```
toggleFullscreen();

return false;
```

}

// Powers
if (k >= "1" && k <= "7") {

```
let index =
  int(k) - 1;

setPower(
  powerOrder[index]
);

return false;
```

}

// Forms
for (let i = 0; i < powerOrder.length; i++) {

```
let power =
  powerOrder[i];

let forms =
  powers[power].forms;

for (let j = 0; j < forms.length; j++) {

  if (k === forms[j][0]) {

    currentPower = power;
    currentForm = j;

    return false;
  }
}
```

}

return false;
}

function keyReleased() {

let k =
String(key).toUpperCase();

keys[k] = false;

return false;
}

// ============================================================
// POWER SWITCH
// ============================================================

function setPower(power) {

currentPower = power;
currentForm = 0;
}

// ============================================================
// FULLSCREEN
// ============================================================

function toggleFullscreen() {

let element =
document.documentElement;

if (!document.fullscreenElement) {

```
if (element.requestFullscreen) {
  element.requestFullscreen();
}
```

} else {

```
if (document.exitFullscreen) {
  document.exitFullscreen();
}
```

}
}

// ============================================================
// MOUSE
// ============================================================

function mousePressed() {

// Clicking the canvas while guide
// is visible starts the game.

if (showGuide) {
showGuide = false;
}
}
