// Basic command-line example
// Usage: node save-as-png.js
var fs = require('fs')
var trianglify = require('../dist/trianglify.js')

// Generate a pattern and then grab the PNG data uri
const canvas = trianglify({
  width: 1920,
  height: 1080,
  cellSize: Math.random() * 200 + 40,
  xColors: 'random',
  variance: Math.random()
}).toCanvas()

// Save the buffer to a file. See the node-canvas docs for a full
// list of all the things you can do with this Canvas object:
// https://github.com/Automattic/node-canvas
const file = fs.createWriteStream('trianglify.png')
canvas.createPNGStream().pipe(file)
