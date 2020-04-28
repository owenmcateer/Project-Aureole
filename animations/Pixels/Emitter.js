/**
 * Emitter class.
 */
const RING = 1;
const ARM = 2;

class Emitter {
  constructor(type, position, placement, speed, colour) {
    this.type = type;
    this.position = position;
    this.placement = placement;
    this.speed = speed;
    this.alive = true;
    this.colour = colour;
  }

  update() {
    this.position += this.speed;
    switch (this.type) {
      case RING:
        this.ring_position();
        break;
      case ARM:
        this.arm_position();
        break;
      default:
    }
  }

  ring_position() {
    // Lock to an arm angle
    this.angle = round(this.position / (TWO_PI / 24)) * (TWO_PI / 24);
    this.x = cos(this.angle) * this.placement + cx;
    this.y = sin(this.angle) * this.placement + cx;
  }

  arm_position() {
    this.angle = ((TWO_PI / 24) * this.placement) - HALF_PI;
    const distance = round((this.position * cx) / 10) * 10;
    this.x = cos(this.angle) * distance + cx;
    this.y = sin(this.angle) * distance + cx;

    // Check bounds
    if (this.position < -1 || this.position > 1) {
      this.kill();
    }
  }

  getColour() {
    return this.colour;
  }

  kill() {
    this.alive = false;
  }

  render() {
    ellipse(this.x, this.y, 5);
  }
}
