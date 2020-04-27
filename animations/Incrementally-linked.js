/**
 * Incrementally linked
 *
 * "Incrementally linked" from my Motus Art on Aureole.
 * @see https://www.instagram.com/p/Byk8B2uF9Jt/
 *
 * @ref https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.0.0/p5.min.js
 * @ref https://cdn.jsdelivr.net/gh/owenmcateer/canvas-cast/dist/App.js
 * @ref ./pixel-map.js
 */

// Canvas Cast config
const matrix = {
  // Node Serial server
  ip: '',
  // Matrix pixel size
  width: 520,
  height: 520,
  // Matrix brightness 0-255
  brightness: 10,
  // Context type (2d/webgl)
  type: '2d',
  // Custom pixel map (@see ./pixel-map.js)
  customMap: gFxMap(520),
};

// Start WS Matrix
canvasCast.init(matrix);

const cx = Math.round(matrix.width / 2);
let timer = 0;
const speed = 0.001;


/**
 * Setup
 */
function setup() {
  createCanvas(matrix.width, matrix.height);
  // colorMode(HSB, 360, 100, 100, 1);
  colorMode(RGB, 255, 255, 255, 1);
  pixelDensity(1);
  frameRate(30);
}


/**
 * Draw tick
 */
function draw() {
  background(0);
  fill(255);
  noStroke();

  // Draw waves
  for (let i = 0; i < 21; i++) {
    const radius = ((i * 10) + 50);
    const angle = round((timer * i) * 24) / 24 * TWO_PI;

    const x = cos(angle) * radius + cx;
    const y = sin(angle) * radius + cx;
    ellipse(x, y, 10);
  }

  // Timer
  timer += speed;
  if (timer >= 1) {
    timer = 0;
  }

  // Cast data
  const p5canvas = document.getElementById('defaultCanvas0');
  canvasCast.cast(p5canvas);
  // Custom pixel map guide
  canvasCast.guide(p5canvas, 5, 'p5js');
}
