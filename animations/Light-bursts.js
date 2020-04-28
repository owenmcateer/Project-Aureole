/**
 * Light Bursts
 *
 * @ref https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.0.0/p5.min.js
 * @ref https://cdn.jsdelivr.net/gh/owenmcateer/canvas-cast/dist/App.js
 * @ref ./pixel-map.js
 * @ref ./Pixels/Pixel.js
 * @ref ./Pixels/Emitter.js
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

const pixels = [];
let emitters = [];
let degradeSpeed;

/**
 * Setup
 */
function setup() {
  createCanvas(matrix.width, matrix.height);
  colorMode(HSB, 360, 100, 100, 1);
  pixelDensity(1);
  frameRate(30);

  // Create mapped pixels
  gFxMap(520).forEach((p) => pixels.push(new Pixel(p.x, p.y)));
}


/**
 * Draw tick
 */
function draw() {
  background(0);

  // Render pixels
  pixels.forEach((p) => {
    p.update();
    p.render();
  });

  // emitters guide
  emitters.forEach((e) => {
    e.update();
  });

  // Remove dead emitters
  emitters = emitters.filter((e) => e.alive);

  // Settings
  degradeSpeed = 8;
  const bmp = round((30 * 60) / 128);

  // Add ring emitters
  if (frameCount % bmp === 0) {
    const randomColour = round(random(360));
    for (let i = 0; i < 24; i++) {
      emitters.push(new Emitter(ARM, 0, i, 0.02, [randomColour, 100, 100]));
    }
  }

  // Cast data
  const p5canvas = document.getElementById('defaultCanvas0');
  canvasCast.cast(p5canvas);
  // Custom pixel map guide
  canvasCast.guide(p5canvas, 5, 'p5js');
}
