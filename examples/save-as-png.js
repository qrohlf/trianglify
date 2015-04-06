// Basic command-line example
// Usage: node save-as-png.js filename.png
var fs = require('fs');
var Trianglify = require('../lib/trianglify.js');

if (process.argv.length < 3) {
  console.log('Please specify a filename');
  console.log('Usage: node save-as-png.js filename.png');
  return;
}

// Generate a pattern and then grab the PNG data uri
var pngURI = Trianglify({
  width: 1920,
  height: 1080,
  cell_size: Math.random()*200 + 40,
  x_colors: 'random',
  variance: Math.random(),
}).png();

// Strip off the uri part of the data uri, leaving the data
var data = pngURI.substr(pngURI.indexOf('base64') + 7);

// Decode the base64 encoded blob into a buffer
var buffer = new Buffer(data, 'base64');

// Save the buffer to a file
fs.writeFileSync(process.argv[2], buffer);