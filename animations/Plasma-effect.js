/**
 * Plasma effect
 * 
 * Classic plasma effect on Aureole.
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
const plasmaScale = 0.1;
const arms = 24;
const pixels = 22;


/**
 * Setup
 */
function setup() {
  createCanvas(matrix.width, matrix.height);
  colorMode(HSB, 360, 100, 100, 1);
  pixelDensity(1);
  frameRate(30);
}


/**
 * Draw tick
 */
function draw() {
  background(0);
  noStroke();

  // Plasma effect
  const gridSize = round(matrix.width / 10);
  for (let ix = 0; ix < gridSize; ++ix) {
    const x = ix * plasmaScale;
    const s1 = sin(x + (frameCount / 25));

     for (let iy = 0; iy < gridSize; ++iy) {
      const y = iy * plasmaScale;
      const s2 = sin(y + (frameCount / 50));
      const s3 = sin((x + y + frameCount * 0.1) / 2);
      const s = (s1 + s2 + s3) / 3;

      const c = map(s, -1, 1, 173, 300);
      fill(c, 100, 100);
      rect(ix * 10, iy * 10, 10, 10);
    }
  }

  // Cast data
  const p5canvas = document.getElementById('defaultCanvas0');
  canvasCast.cast(p5canvas);
  // Custom pixel map guide
  canvasCast.guide(p5canvas, 5);
}
