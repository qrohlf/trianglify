import * as math from 'mathjs'
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
  constructor (polys, opts) {
    this.polys = polys
    this.opts = opts
  }

  toSVG = (svgOpts) => {
    const {width, height} = this.opts
    const svg = s('svg', {width, height})
    const suppressNamespace = svgOpts && svgOpts.includeNamespace === false
    if (!suppressNamespace) {
      // needed for many graphics editing programs to support the file properly,
      // can be stripped out in most cases on the web.
      svg.setAttribute('xmlns','http://www.w3.org/2000/svg');
    }

    this.polys.forEach((poly, index) => {
      // TODO - round to 1 decimal place
      const normal = getNormal(poly)
      poly.normal = normal
      const xy = poly.vertices.map(v => v.slice(0, 2).join(','))
      const d = "M" + xy.join("L") + "Z"
      const fill = poly.color.css()
      // shape-rendering crispEdges resolves the antialiasing issues
      s('path', {
        d,
        fill,
        'data-index': index,
        'shape-rendering': 'crispEdges'
      }, svg)
    })

    svg.addEventListener('mousemove', e => {
      const LIGHT_LOCATION = [e.clientX, e.clientY, width / 3]
      Array.from(svg.children).forEach(path => {
        const poly = this.polys[parseInt(path.dataset.index, 10)]
        const polyCenter = math.mean(poly.vertices, 0)
        const lightVector = math.subtract(LIGHT_LOCATION, polyCenter)
        const lightAngle = Math.max(0, math.dot(poly.normal, lightVector))
        path.setAttribute('fill', poly.color.darken(0.5).brighten(lightAngle / 400).css())
      })
    })

    return svg
  }
}

const getNormal = (poly) => {
  const a = poly.vertices[0]
  const b = poly.vertices[1]
  const c = poly.vertices[2]
  const ab = math.subtract(b, a)
  const ac = math.subtract(c, a)
  // get cross product
  const cross = math.cross(ac, ab)
  // normalize
  const length = Math.sqrt(cross[0] * cross[0] + cross[1] * cross[1] + cross[2] * cross[2])
  const norm = [cross[0] / length, cross[1] / length, cross[2] / length]
  return norm
}
