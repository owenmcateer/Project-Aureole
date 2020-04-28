/**
 * Taus Arc
 *
 * From my Motus Art channel.
 * @see https://www.instagram.com/p/BvKRZQxHBnv/
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
let circleOffset;


/**
 * Setup
 */
function setup() {
  createCanvas(matrix.width, matrix.height);
  colorMode(HSB, 360, 100, 100, 1);
  pixelDensity(1);
  frameRate(30);

  circleOffset = -PI;
}


/**
 * Draw tick
 */
function draw() {
  background(0);
  noFill();
  stroke('white');
  strokeWeight(10);

  // Draw rings
  for (let i = 0; i < 21; i++) {
    stroke(map(sin((i / 21) + (frameCount / 50) * PI), -1, 1, 172, 310), 100, 100);

    const size = i * 20 + 100;
    const startAmount = map(sin(((i * 6) + frameCount) / 50), -1, 1, 0, HALF_PI);
    const amount = map(sin(((i * 6) + frameCount) / 50), -1, 1, 0, TWO_PI * 1.05);

    // Entity type
    if (amount === TWO_PI) {
      // Full circle
      ellipse(cx, cx, size);
    } else {
      // Arc
      arc(cx, cx, size, size, circleOffset + startAmount, circleOffset + amount + 0.01);
      // Note: I add on 0.01 to avoid the arm not appearing at all.
    }
  }

  // Move offset
  circleOffset += (TWO_PI / 1250);

  // Cast data
  const p5canvas = document.getElementById('defaultCanvas0');
  canvasCast.cast(p5canvas);
  // Custom pixel map guide
  canvasCast.guide(p5canvas, 5, 'p5js');
}
