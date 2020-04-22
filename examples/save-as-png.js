// Basic command-line example
// Usage: node save-as-png.js
var fs = require('fs')
var trianglify = require('../dist/trianglify.js')

// Generate a pattern and then grab the PNG data uri
const canvas = trianglify({
  width: 1920,
  height: 1080,
  cellSize: Math.random()*200 + 40,
  xColors: 'random',
  variance: Math.random(),
}).toCanvas()

// Strip off the uri part of the data uri, leaving the data
const data = pngURI.substr(pngURI.indexOf('base64') + 7)

// Decode the base64 encoded blob into a buffer
const buffer = new Buffer.from(data, 'base64')

// Save the buffer to a file
fs.writeFileSync(process.argv[2], buffer)
