/*
What I'd like the 3D API to be able to handle:

1. custom lighting setups
2. altering lighting, coloring without re-computing the polygons
3. loading the geometry into three.js
4. custom face-shading stuff
5. simple 2d renders without computing any normals, etc
*/

// possibly looks like

// constructor only takes options that affect the basic underlying geometry
// (height, width, cellSize, variance)
const pattern = trianglify(geometryOpts)

// render takes options that affect the actual rendering of the geometry.
// "ambient" light only gives you a 2d render, while adding point light
// sources gives you a 3d-shaded render
pattern.render({colorOpts, lightingOpts}).asCanvas()
pattern.render({colorOpts, lightingOpts}).asSVG()
pattern.render({colorOpts, lightingOpts}).asPNG()

// PAID FEATURE - animation
//
// users with trianglify-animate paid addon can use it like so
import trianglifyAnimate from 'trianglify-animate'

// define a 10-second animation with orbital lighting
// and lighting keyframes
const animation = trianglifyAnimate.animation(10 * 1000)
                    .orbitLighting(orbitOptions)
                    .keyframeLightOptions(lightOptions)

// and apply it
const animationInstance = animation.apply(pattern, canvasDOMElement)
// animation starts when applied, use animationInstance to control it
setTimeout(animationInstance.pause, 30 * 1000)
