// Generate png images on the command line
// Usage: node generate-png.js filename.png

var Trianglify = require('../lib/trianglify.js');
var fs = require('fs');

var pngURI = Trianglify({
  x_colors: 'random',
  width: 600,
  height: 400,
  cell_size: 40
}).png();

var data = pngURI.substr(pngURI.indexOf('base64') + 7);
var buffer = new Buffer(data, 'base64');

fs.writeFileSync(process.argv[2], buffer);