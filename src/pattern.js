// conditionally load jsdom if we don't have a browser environment available.
// note that this is done via require(), which is less than ideal.
//
// Since all we're doing here is really just constructing an SVG tree, seems
// like we could maybe eliminate JSDOM?
var doc = (typeof document !== "undefined") ? document : require('jsdom').jsdom('<html/>');

// utility for building up SVG node trees
const s = (tagName, attrs = {}, parent) => {
  const elem = doc.createElementNS("http://www.w3.org/2000/svg", tagName)
  Object.keys(attrs).forEach(k => elem.setAttribute(k, attrs[k]))
  parent && parent.appendChild(elem)
  return elem
}

export default class Pattern {
  constructor (points, polys, opts) {
    this.points = points
    this.polys = polys
    this.opts = opts
  }

  toSVG = (svgOpts) => {
    const points = this.points
    const {width, height} = this.opts
    const svg = s('svg', {width, height})
    const suppressNamespace = svgOpts && svgOpts.includeNamespace === false
    if (!suppressNamespace) {
      // needed for many graphics editing programs to support the file properly,
      // can be stripped out in most cases on the web.
      svg.setAttribute('xmlns','http://www.w3.org/2000/svg');
    }

    this.polys.forEach((poly, index) => {
      const xys = poly.vertexIndices.map(i => `${points[i][0]},${points[i][1]}`)
      const d = "M" + xys.join("L") + "Z"
      const fill = poly.color.css()
      // shape-rendering crispEdges resolves the antialiasing issues
      s('path', {
        d,
        fill,
        'shape-rendering': 'crispEdges'
      }, svg)
    })

    return svg
  }

  toCanvas = (destCanvas, _canvasOpts = {}) => {
    const defaultCanvasOptions = {retina: true}
    const canvasOpts = {...defaultCanvasOptions, _canvasOpts}
    const {points, polys, opts} = this
    const canvas = destCanvas || doc.createElement('canvas')

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

    // this works to fix antialiasing with two adjacent edges, but it fails
    // horribly at corners...
    // ctx.globalCompositeOperation = canvasOpts.compositing || 'lighter' // https://stackoverflow.com/a/53292886/381299

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

    // draw strokes at edge bounds to solve for white gaps while compositing
    polys.forEach(poly => drawPoly(poly, null, {color: poly.color, width: 2}))

    // draw fills
    polys.forEach(poly => drawPoly(poly, {color: poly.color}, null))

    return canvas
  }
}
