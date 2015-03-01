var t = require('./lib/index');
var fs = require('fs');

// fs.writeFile('foo.svg', t({width: 50, height: 50, cell_size: 3, cell_padding: 0}).svg().outerHTML);
fs.writeFile('foo.svg', t({width: 600, height: 400}).svg().outerHTML);