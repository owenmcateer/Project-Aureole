/**
 * Test patterns
 *
 * A simple animation test all pixels are working correctly.
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
const offset = 20;
let testMode = 0;


/**
 * Setup
 */
function setup() {
  createCanvas(matrix.width, matrix.height);
  colorMode(RGB, 255, 255, 255, 1);
  rectMode(CENTER);
  frameRate(30);
  pixelDensity(1);
}


/**
 * Draw tick
 */
function draw() {
  background(0);

  // Test mode
  colorMode(HSB, 100);
  background(
    map(cos(frameCount / 500), -1, 1, 0, 100),
    100,
    25,
  );

  const testColour = color(255);
  // Test animations
  switch (testMode) {
    // Arms
    case 0:
      noStroke();
      fill(testColour);
      translate(cx, cx);
      rotate(map(cos(frameCount / 200), 1, -1, 0, TWO_PI) - HALF_PI);
      quad(0, 0, cx, -35, cx, 35);
    break;

    // Rings
    case 1:
      noFill();
      stroke(testColour);
      strokeWeight(10);
      const ringSize = map(cos(frameCount / 90), -1, 1, 80, 460);
      ellipse(cx, cx, ringSize, ringSize);
    break;

    // Swipe
    case 2:
      noStroke();
      fill(testColour);
      const x = map(cos(frameCount / 100), 1, -1, 0, canvasSize);
      rect(x, cx, 20, canvasSize);
      rect(cx, x, canvasSize, 20);
    break;

    default:
      testMode = 0;
  }

  // Change test most
  if (frameCount % (60 * 10) === 0) {
    testMode++;
  }

  // Cast data
  resetMatrix();
  const p5canvas = document.getElementById('defaultCanvas0');
  canvasCast.cast(p5canvas);
  // Custom pixel map guide
  canvasCast.guide(p5canvas, 5, 'p5js');
}
