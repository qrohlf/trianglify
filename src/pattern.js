import {createCanvas} from 'canvas' // this is a simple shim in browsers

const isBrowser = (typeof window !== 'undefined' && typeof document !== 'undefined')
const doc = isBrowser && document

// utility for building up SVG node trees with the DOM API
const sDOM = (tagName, attrs = {}, children) => {
  const elem = doc.createElementNS("http://www.w3.org/2000/svg", tagName)
  Object.keys(attrs).forEach(
    k => attrs[k] !== undefined && elem.setAttribute(k, attrs[k])
  )
  children && children.forEach(c => elem.appendChild(c))
  return elem
}

// serialize attrs object to XML attributes. Assumes everything is already
// escaped.
const serializeAttrs = attrs => (
  Object.entries(attrs)
    .filter(([_, v]) => v != undefined)
    .map(([k, v]) => `${k}='${v}'`)
    .join(' ')
)

// minimal XML-tree builder for use in Node
const sNode = (tagName, attrs = {}, children) => ({
  tagName,
  attrs,
  children,
  toString: () => `<${tagName} ${serializeAttrs(attrs)}>${children ? children.join('') : ''}</${tagName}>`
})

const s = isBrowser
  ? sDOM
  : sNode

export default class Pattern {
  constructor (points, polys, opts) {
    this.points = points
    this.polys = polys
    this.opts = opts
  }

  toSVG = (destSVG, _svgOpts = {}) => {
    const defaultSVGOptions = {includeNamespace: true, coordinateDecimals: 1}
    const svgOpts = {...defaultSVGOptions, ..._svgOpts}
    const {points, opts, polys} = this
    const {width, height} = opts

    // only round points if the coordinateDecimals option is non-negative
    // set coordinateDecimals to -1 to disable point rounding
    const roundedPoints = (svgOpts.coordinateDecimals < 0) ? points : points.map(
      p => p.map(x => +x.toFixed(svgOpts.coordinateDecimals))
    )

    const paths = this.polys.map((poly) => {
      const xys = poly.vertexIndices.map(i => `${roundedPoints[i][0]},${roundedPoints[i][1]}`)
      const d = "M" + xys.join("L") + "Z"
      // shape-rendering crispEdges resolves the antialiasing issues
      return s('path', {
        d,
        fill: opts.fill ? poly.color.css() : undefined,
        stroke: opts.strokeWidth > 0 ? poly.color.css() : undefined,
        'stroke-width': opts.strokeWidth > 0 ? opts.strokeWidth : undefined,
        'shape-rendering': opts.fill ? 'crispEdges' : undefined
      })
    })

    const svg = s(
      'svg',
      {
        xmlns: svgOpts.includeNamespace ? 'http://www.w3.org/2000/svg' : undefined,
        width,
        height
      },
      paths
    )

    return svg
  }

  toCanvas = (destCanvas, _canvasOpts = {}) => {
    const defaultCanvasOptions = {retina: !!isBrowser}
    const canvasOpts = {...defaultCanvasOptions, _canvasOpts}
    const {points, polys, opts} = this

    const canvas = destCanvas || createCanvas(opts.width, opts.height) // doc.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (canvasOpts.retina) {
      // adapted from https://gist.github.com/callumlocke/cc258a193839691f60dd
      const backingStoreRatio = (
        ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio || 1
      )

      const devicePixelRatio = (typeof window !== undefined && window.devicePixelRatio) || 1
      const drawRatio = devicePixelRatio / backingStoreRatio
      if (devicePixelRatio !== backingStoreRatio) {
        // set the 'real' canvas size to the higher width/height
        canvas.width = opts.width * drawRatio
        canvas.height = opts.height * drawRatio

        // ...then scale it back down with CSS
        canvas.style.width = opts.width + 'px'
        canvas.style.height = opts.height + 'px'
      } else {
        // this is a normal 1:1 device: don't apply scaling
        canvas.width = opts.width
        canvas.height = opts.height
        canvas.style.width = ''
        canvas.style.height = ''
      }
      ctx.scale(drawRatio, drawRatio)
    }

    const drawPoly = (poly, fill, stroke) => {
      const vertexIndices = poly.vertexIndices
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(points[vertexIndices[0]][0], points[vertexIndices[0]][1])
      ctx.lineTo(points[vertexIndices[1]][0], points[vertexIndices[1]][1])
      ctx.lineTo(points[vertexIndices[2]][0], points[vertexIndices[2]][1])
      ctx.closePath()
      if (fill) {
        ctx.fillStyle = fill.color.css()
        ctx.fill()
      }
      if (stroke) {
        ctx.strokeStyle = stroke.color.css()
        ctx.lineWidth = stroke.width
        ctx.stroke()
      }
    }

    if (opts.fill && opts.strokeWidth < 1) {
      // draw background strokes at edge bounds to solve for white gaps due to
      // canvas antialiasing. See https://stackoverflow.com/q/19319963/381299
      polys.forEach(poly => drawPoly(poly, null, {color: poly.color, width: 2}))
    }

    // draw visible fills and strokes
    polys.forEach(poly => drawPoly(
      poly,
      opts.fill && {color: poly.color},
      (opts.strokeWidth > 0) && {color: poly.color, width: opts.strokeWidth}
    ))

    return canvas
  }
}
