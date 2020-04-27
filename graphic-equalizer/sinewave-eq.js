/**
 * Sinewave audio graphic equalizer
 *
 * A nice way to show the music levels.
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


/**
 * Sinewave equalizer
 */
const cx = Math.round(matrix.width / 2);
let peaks = 4;
let theta = 0;
let amplitude = cx - 50;
let period = 24;
let dx;
var sound, soundAmplitude, cnv;


/**
 * Setup
 */
function setup() {
  createCanvas(matrix.width, matrix.height);
  pixelDensity(1);
  frameRate(30);
  colorMode(HSB, 360, 100, 100, 1);

  // Audio in
  soundAmplitude = new p5.Amplitude();
  mic = new p5.AudioIn();
  mic.start();
  mic.amp(2);
  soundAmplitude.setInput(mic);
}


/**
 * Draw tick
 */
function draw() {
  background(0);

  // Audio levels
  var level = soundAmplitude.getLevel();
  var size = map(level, 0, 1, 0, 250);

  dx = (TWO_PI / period) * peaks;
  // Increment theta
  theta += 0.02;
  let xx = theta;

  // Draw wave
  for (let i = 0; i < TWO_PI; i += (TWO_PI / period)) {
    const amp = (sin(xx) * size) + ((cx / 2) + 20);
    const x = (sin(i) * amp) + cx;
    const y = (cos(i) * amp) + cx;

    // Styles
    fill(map(sin((i / 2)  + (theta / -2)), -1, 1, 0, 360), 100, 100);
    noStroke();

    push();
    translate(x, y);
    rotate(-i);
    rect(-5, -15, 10, 30);
    // rect(-5, -5, 10, 10);
    pop();

    xx += dx;
  }

  // Cast data
  const p5canvas = document.getElementById('defaultCanvas0');
  canvasCast.cast(p5canvas);
  // Custom pixel map guide
  canvasCast.guide(p5canvas, 5);
}
