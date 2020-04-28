/**
 * Clock
 *
 * A clock for the Aureole display.
 * Time is take from the users local system time.
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
const milliSecondLeds = 10;


/**
 * Setup
 */
function setup() {
  createCanvas(matrix.width, matrix.height);
  colorMode(HSB, 360, 100, 100, 1);
  // colorMode(RGB, 255, 255, 255, 1);
  pixelDensity(1);
  frameRate(30);
}


/**
 * Draw tick
 */
function draw() {
  background(0);
  noFill();
  stroke(170, 100, 100);
  strokeWeight(10);
  const armAngle = TWO_PI / 24;

  // Get time
  const d = new Date();

  // Second
  stroke(170, 100, 100);
  push();
  translate(cx, cx);
  rotate(-HALF_PI);
  rotate(round(map(d.getSeconds(), 0, 59, 0, 24)) * armAngle);
  line(50, 0, cx, 0);
  pop();

  // Minute
  stroke(140, 100, 100);
  push();
  translate(cx, cx);
  rotate(-HALF_PI);
  rotate(round(map(d.getMinutes(), 0, 59, 0, 24)) * armAngle);
  line(50, 0, 220, 0);
  pop();

  // Hour
  stroke(200, 100, 100);
  push();
  translate(cx, cx);
  rotate(-HALF_PI);
  rotate((TWO_PI / 12) * d.getHours());
  if (d.getMinutes() >= 30) {
    rotate(armAngle);
  }
  line(50, 0, 190, 0);
  pop();

  // Millisecond
  // const milliSecondTick = map(d.getMilliseconds(), 0, 999, 0, 24);
  // for (let i = 0; i < milliSecondLeds; i++) {
  //   const x = cos(armAngle * (i + milliSecondTick) + HALF_PI) * 50 + cx;
  //   const y = sin(armAngle * (i + milliSecondTick) + HALF_PI) * 50 + cx;
  //   stroke(0, 0, (i + 1) * (100 / milliSecondLeds));
  //   point(x, y, 10);
  // }

  // Cast data
  const p5canvas = document.getElementById('defaultCanvas0');
  canvasCast.cast(p5canvas);
  // Custom pixel map guide
  canvasCast.guide(p5canvas, 5, 'p5js');
}
