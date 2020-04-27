/**
 * Audio graphic equalizer
 *
 * I build this display with a graphic equalizer in mind.
 * The 24 arms of LEDs to display 24 bands of frequency
 * ranges with falloff, changing colours, patterns,
 * whatever you can think of to bring music to life. 
 *   
 * The audio processing (FFT) is done on the computer
 * playing the music in this JavaScript file.
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

// Script config
const cx = Math.round(matrix.width / 2);
const plasmaScale = 0.04;
let audioIn;
let effect = 0;
const fftSettings = {
  fallOff: 0.1,
  bins: 2048 * 2,
  range: {
    start: 0,
    end: 2048,
  },
};
let audioInAmp = 20;
const fallOff = new Array(24).fill(0);
const fallOffRate = 0.4;


// Setup
function setup() {
  createCanvas(matrix.width, matrix.height);
  pixelDensity(1);
  colorMode(HSB, 360, 100, 100, 1);
  frameRate(30);

  // Open audio channel
  audioIn = new p5.AudioIn();
  audioIn.start();
  audioIn.amp(audioInAmp);
  fft = new p5.FFT(fftSettings.fallOff, fftSettings.bins);
  fft.setInput(audioIn);
}

// Draw tick
function draw() {
  background(0);

  // FFT analyze
  let spectrum = fft.analyze();

  // Frequency ranges
  for (i = 0; i < 24; i++) {
    const ii = round(map(i, 0, 24, fftSettings.range.start, fftSettings.range.end));
    const strength = round(map(spectrum[ii], 0, 255, 0, 21));
    processFallOff(i, strength);

    // Effects
    switch (effect) {
      case 0:
        // UV meter
        drawUvArm(i, strength);
        fill(0, 0, 100, map(sin(frameCount / 4), -1, 1, 0.6, 1));
        drawArm(i, round(fallOff[i]));
        break;

      case 1:
        // Rainbox effect
        fill(map(sin(map(i, 0, 24, 0, PI) + (frameCount / 40)), -1, 1, 0, 360), 100, 100);
        drawArm(i, strength, true);
      break;

      case 2:
        // Cool blue
        fill(map(sin(map(i, 0, 24, 0, PI) + (frameCount / -80)), -1, 1, 160, 312), 100, 100);
        drawArm(i, strength, true);
        fill(0, 0, 100, map(sin(frameCount / 4), -1, 1, 0.6, 1));
        drawArm(i, round(fallOff[i]));
        break;

      case 3:
        // Plasma
        drawPlasmaArm(i, strength);
        break;

      case 4:
        // Cool blue no peek
        fill(map(sin(map(i, 0, 24, 0, PI) + (frameCount / -80)), -1, 1, 160, 312), 100, 100);
        drawArm(i, strength, true);
        break;
    }
  }

  // Cast data
  const p5canvas = document.getElementById('defaultCanvas0');
  canvasCast.cast(p5canvas);
  // Custom pixel map guide
  canvasCast.guide(p5canvas, 5);
}


/**
 * Click to change effects
 */
function mouseClicked() {
  effect++;
  if (effect > 4) {
    effect = 0;
  }
}


/**
 * Draw arm. No colour set
 */
function drawArm(arm, amount, fill = false) {
  const armAngle = (TWO_PI / 24);
  const angleOffset = HALF_PI;

  const angle = armAngle * -arm + angleOffset;

  // Arm pixels
  for(j = (fill ? 0 : amount - 1); j < amount; j++) {
    const radius = (j * 10) + 50;
    const x = (Math.cos(-angle) * radius) + cx;
    const y = (Math.sin(-angle) * radius) + cx;

    ellipse(x, y, 10);
  }
}


/**
 * Draw plasma arm.
 */
function drawPlasmaArm(arm, amount) {
  fill('white');
  const armAngle = (TWO_PI / 24);
  const angleOffset = HALF_PI;

  const angle = armAngle * -arm + angleOffset;

  // Arm pixels
  for (j = (fill ? 0 : amount - 1); j < amount; j++) {
    // Position
    const radius = (j * 10) + 50;
    const x = (Math.cos(-angle) * radius) + cx;
    const y = (Math.sin(-angle) * radius) + cx;

    // Colour
    const px = x * plasmaScale;
    const py = y * plasmaScale;
    const s1 = sin(px + (frameCount / 12));
    const s2 = sin(py + (frameCount / 25));
    const s3 = sin((px + py + frameCount * 0.1) / 2);
    const s = (s1 + s2 + s3) / 3;
    const c = map(s, -1, 1, 140, 340);
    fill(c, 100, 100);

    // Draw
    ellipse(x, y, 10);
  }
}


/**
 * UV meter
 * Classic green/red UV meter.
 */
function drawUvArm(arm, amount) {
  const armAngle = (TWO_PI / 24);
  const angleOffset = HALF_PI;
  const angle = armAngle * -arm + angleOffset;

  // Arm pixels
  for(j = (fill ? 0 : amount - 1); j < amount; j++) {
    fill(map(j, 0, 16, 123, 0), 100, 100);
    const radius = (j * 10) + 50;
    const x = (Math.cos(-angle) * radius) + cx;
    const y = (Math.sin(-angle) * radius) + cx;

    ellipse(x, y, 10);
  }
}

/**
 * Process falloff.
 *
 * @param {int} entity 
 * @param {int} strength 
 */
function processFallOff(entity, strength) {
  if (strength >= fallOff[entity]) {
    fallOff[entity] = strength;
  }
  else if ( fallOff[entity] > 0) {
    fallOff[entity] -= fallOffRate;
  }
}
