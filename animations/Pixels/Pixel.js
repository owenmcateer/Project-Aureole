/**
 * Pixel class.
 */
class Pixel {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.h = 360;
    this.s = 100;
    this.b = 0;
  }

  setColour(colour) {
    this.h = colour[0];
    this.s = colour[1];
    this.b = colour[2];
  }

  update() {
    // Lower brightness
    this.b -= degradeSpeed;
    if (this.b < 0) this.b = 0;

    // Check emtters
    emitters.forEach((e) => {
      if (dist(e.x, e.y, this.x, this.y) <= 5) {
        this.setColour(e.getColour());
      }
    });
  }

  render() {
    fill(this.h, this.s, this.b);
    ellipse(this.x, this.y, 10);
  }
}
