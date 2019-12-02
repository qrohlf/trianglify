// conditionally load jsdom if we don't have a browser environment available.
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

    this.polys.forEach(poly => {
      // TODO - round to 1 decimal place
      const xy = poly.vertices.map(v => v.slice(0, 2).join(','))
      const d = "M" + xy.join("L") + "Z"
      const fill = poly.color.css()
      // shape-rendering crispEdges resolves the antialiasing issues
      s('path', {d, fill, 'shape-rendering': 'crispEdges'}, svg)
    })

    return svg
  }
}
