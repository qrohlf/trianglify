import chroma from 'chroma-js'
// Built in color functions provided for your convenience.
//
// Usage example:
//
// const pattern = trianglify({
//  width: 300,
//  height: 200,
//  colorFunction: trianglify.colorFunctions.sparkle(0.2)
// })
//
// the snippet above gives you a trianglify pattern with a 20% random
// jitter applied to the x and y gradient scales

export const interpolateLinear = (bias = 0.5) => (
  (centroid, xPercent, yPercent, vertices, xScale, yScale, opts) =>
    chroma.mix(xScale(xPercent), yScale(yPercent), bias, opts.colorSpace)
)

export const sparkle = (jitterFactor = 0.15) => (centroid, normalizedX, normalizedY, vertices, xGradient, yGradient, opts, random) => {
  const jitter = () => (random() - 0.5) * jitterFactor
  const a = xGradient(normalizedX + jitter())
  const b = yGradient(normalizedY + jitter())
  return chroma.mix(a, b, 0.5, opts.colorSpace)
}
