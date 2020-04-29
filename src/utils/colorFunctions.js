import chroma from 'chroma-js'
import * as geom from './geom'
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
  ({xPercent, yPercent, xScale, yScale, opts}) =>
    chroma.mix(xScale(xPercent), yScale(yPercent), bias, opts.colorSpace)
)

export const sparkle = (jitterFactor = 0.15) => (
  ({xPercent, yPercent, xScale, yScale, opts, random}) => {
    const jitter = () => (random() - 0.5) * jitterFactor
    const a = xScale(xPercent + jitter())
    const b = yScale(yPercent + jitter())
    return chroma.mix(a, b, 0.5, opts.colorSpace)
  }
)

export const shadows = (shadowIntensity = 0.8) => {
  return ({vertexIndices, xPercent, yPercent, xScale, yScale, opts, points, random}) => {
    const a = xScale(xPercent)
    const b = yScale(yPercent)
    const color = chroma.mix(a, b, 0.5, opts.colorSpace)
    return color.darken(shadowIntensity * random())
  }
}
