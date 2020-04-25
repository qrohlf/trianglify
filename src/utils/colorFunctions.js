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
// the above snippet would give you a trianglify pattern with a 20% random
// jitter applied to the x and y gradient scales

export const interpolateLinear = (bias = 0.5) => (
  (xPercent, yPercent, vertices, xScale, yScale, opts) =>
    chroma.mix(xScale(xPercent), yScale(yPercent), bias, opts.colorSpace)
)

export const sparkle = (jitterFactor = 0.15) => (normalizedX, normalizedY, vertices, xGradient, yGradient, opts) => {
  const jitter = () => (Math.random() - 0.5) * jitterFactor
  const a = xGradient(normalizedX + jitter())
  const b = yGradient(normalizedY + jitter())
  return chroma.mix(a, b, 0.5, opts.colorSpace)
}
