Most planters give you no feedback. You poke the soil with a finger, forget to check, and come back to something dead or waterlogged. I wanted to build something more honest.

## How it works

The planter is wheel-thrown from a standard stoneware body. Before the bisque fire, two copper wire electrodes are embedded in the wall near the base, spaced about 15mm apart. After the glaze fire the wires are connected to a small capacitive sensing circuit — a 555 timer in astable mode whose frequency shifts with the dielectric constant of the soil between the electrodes.

A microcontroller reads that frequency and maps it to a moisture percentage. An RGB LED set into a small recess on the exterior changes from red (dry) to blue (saturated), with yellow and green in between.

## What I learned

Clay is a surprisingly good dielectric host. The main challenge was sealing the wire entry points so glaze didn't wick in and create a short. I ended up using a high-temperature ceramic adhesive for the final seal.

The bigger lesson was about tolerance: the sensor needs calibration per soil type, and the relationship between capacitance and moisture is nonlinear. A lookup table works well enough for houseplant use.

## Materials

- Stoneware (cone 6)
- Celadon glaze
- ATtiny85 microcontroller
- WS2812 RGB LED
- 555 timer, passive components
