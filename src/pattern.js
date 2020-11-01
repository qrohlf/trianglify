import { createCanvas } from 'canvas' // this is a simple shim in browsers
import getScalingRatio from './utils/getScalingRatio'
const isBrowser = (typeof window !== 'undefined' && typeof document !== 'undefined')
const doc = isBrowser && document

// utility for building up SVG node trees with the DOM API
const sDOM = (tagName, attrs = {}, children, existingRoot) => {
  const elem = existingRoot || doc.createElementNS('http://www.w3.org/2000/svg', tagName)
  Object.keys(attrs).forEach(
    k => attrs[k] !== undefined && elem.setAttribute(k, attrs[k])
  )
  children && children.forEach(c => elem.appendChild(c))
  return elem
}

// serialize attrs object to XML attributes. Assumes everything is already
// escaped (safe input).
const serializeAttrs = attrs => (
  Object.entries(attrs)
    .filter(([_, v]) => v !== undefined)
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

export default class Pattern {
  constructor (points, polys, opts) {
    this.points = points
    this.polys = polys
    this.opts = opts
  }

  _toSVG = (serializer, destSVG, _svgOpts = {}) => {
    const s = serializer
    const defaultSVGOptions = { includeNamespace: true, coordinateDecimals: 1 }
    const svgOpts = { ...defaultSVGOptions, ..._svgOpts }
    const { points, opts, polys } = this
    const { width, height } = opts

    // only round points if the coordinateDecimals option is non-negative
    // set coordinateDecimals to -1 to disable point rounding
    const roundedPoints = (svgOpts.coordinateDecimals < 0) ? points : points.map(
      p => p.map(x => +x.toFixed(svgOpts.coordinateDecimals))
    )

    const paths = polys.map((poly) => {
      const xys = poly.vertexIndices.map(i => `${roundedPoints[i][0]},${roundedPoints[i][1]}`)
      const d = 'M' + xys.join('L') + 'Z'
      const hasStroke = opts.strokeWidth > 0
      // shape-rendering crispEdges resolves the antialiasing issues, at the
      // potential cost of some visual degradation. For the best performance
      // *and* best visual rendering, use Canvas.
      return s('path', {
        d,
        fill: opts.fill ? poly.color.css() : undefined,
        stroke: hasStroke ? poly.color.css() : undefined,
        'stroke-width': hasStroke ? opts.strokeWidth : undefined,
        'stroke-linejoin': hasStroke ? 'round' : undefined,
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
      paths,
      destSVG
    )

    return svg
  }

  toSVGTree = (svgOpts) => this._toSVG(sNode, null, svgOpts)

  toSVG = isBrowser
    ? (destSVG, svgOpts) => this._toSVG(sDOM, destSVG, svgOpts)
    : (destSVG, svgOpts) => this.toSVGTree(svgOpts)

  toCanvas = (destCanvas, _canvasOpts = {}) => {
    const defaultCanvasOptions = {
      scaling: isBrowser ? 'auto' : false,
      applyCssScaling: !!isBrowser
    }
    const canvasOpts = { ...defaultCanvasOptions, ..._canvasOpts }
    const { points, polys, opts } = this

    const canvas = destCanvas || createCanvas(opts.width, opts.height) // doc.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (canvasOpts.scaling) {
      const drawRatio = canvasOpts.scaling === 'auto'
        ? getScalingRatio(ctx)
        : canvasOpts.scaling

      if (drawRatio !== 1) {
        // set the 'real' canvas size to the higher width/height
        canvas.width = opts.width * drawRatio
        canvas.height = opts.height * drawRatio

        if (canvasOpts.applyCssScaling) {
          // ...then scale it back down with CSS
          canvas.style.width = opts.width + 'px'
          canvas.style.height = opts.height + 'px'
        }
      } else {
        // this is a normal 1:1 device: don't apply scaling
        canvas.width = opts.width
        canvas.height = opts.height
        if (canvasOpts.applyCssScaling) {
          canvas.style.width = ''
          canvas.style.height = ''
        }
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
      polys.forEach(poly => drawPoly(poly, null, { color: poly.color, width: 2 }))
    }

    // draw visible fills and strokes
    polys.forEach(poly => drawPoly(
      poly,
      opts.fill && { color: poly.color },
      (opts.strokeWidth > 0) && { color: poly.color, width: opts.strokeWidth }
    ))

    return canvas
  }
}
