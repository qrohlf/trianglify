var c = require('./lib/colorutils');
var colorbrewer = require('./lib/colorbrewer');
var fs = require('fs');
var doc = require('jsdom').jsdom('<html />');
var Color = require("color");
var chroma = require("chroma-js");

var svgNode = doc.createElementNS("http://www.w3.org/2000/svg", 'svg');
svgNode.setAttribute('width', 600);
svgNode.setAttribute('height', 100);

var gradient = chroma.scale(colorbrewer.YlGnBu[9]).mode('lab');
// var a = Color('#000');
// var b = Color('#FFF');

var n = 60;
for (var i=0; i<n; i++) {
  var rect = doc.createElementNS("http://www.w3.org/2000/svg", 'rect');
  rect.setAttribute("x", i/n * 600);
  rect.setAttribute("y", 0);
  rect.setAttribute("height", 100);
  rect.setAttribute("width", 1/n * 600);
  rect.setAttribute("fill", gradient(i/n).hex());
  console.log(i/n);
  // rect.setAttribute("fill", a.mix(b, i/n).hexString());

  svgNode.appendChild(rect);
}
fs.writeFile('foo.svg', svgNode.outerHTML);