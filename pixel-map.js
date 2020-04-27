/**
 * Aureole display pixel map
 *
 * This file contains the Aureole pixel map for Canvas Cast.
 * @see https://github.com/owenmcateer/canvas-cast
 *
 * @param {Int} Matrix size
 * @return {array} Array of pixels with X&Y coordinates
 */
function gFxMap(size) {
  const pixelMap = [];
  const arms = 24;
  const armPixels = 21;
  const armAngle = ((Math.PI * 2) / arms);
  const angleOffset = Math.PI + (armAngle * 1);
  const midPoint = Math.round(size / 2);
  let led = 0;

  // Arms
  for (let i = arms; i > 0; i--) {
    const angle = armAngle * i + angleOffset;

    // Arm pixels
    for(j = 0; j < armPixels; j++) {
      const radius = (j * 10) + 50;
      const x = (Math.sin(angle) * radius) + midPoint;
      const y = (Math.cos(angle) * radius) + midPoint;
      let position = led;

      // Flip even rows
      if (i % 2 === 0) {
        position = (led - armPixels) + ((armPixels - j) * 2) -1;
      }
      // Add pixel position
      pixelMap[position] = {
        x: Math.round(x),
        y: Math.round(y),
      };

      led++;
    }
  }

  // Return pixel map.
  return pixelMap;
}
