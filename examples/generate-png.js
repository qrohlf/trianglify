var Trianglify = require('../lib/trianglify.js');
var fs = require('fs');

var pngURI = Trianglify({
  x_colors: 'RdYlGn',
  variance: 0,
  width: 1440,
  height: 900
}).png();

var data = pngURI.substr(pngURI.indexOf('base64') + 7);
var buffer = new Buffer(data, 'base64');


fs.writeFileSync(Math.random().toString(36).substr(2, 5)+'.png', buffer);

