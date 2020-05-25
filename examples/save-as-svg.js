// Basic command-line example
// Usage: node save-as-svg.js
var fs = require('fs')
var trianglify = require('../dist/trianglify.js')

// Generate a pattern and render to an SVG node tree
const svg = trianglify({
  width: 1920,
  height: 1080,
  cellSize: Math.random() * 200 + 40,
  xColors: 'random',
  variance: Math.random()
}).toSVG()

// Save the string to a file
fs.writeFileSync('trianglify.svg', svg.toString())
