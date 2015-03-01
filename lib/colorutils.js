  // Take an array of colors and return an interpolation function on the domain [0, 1]

var colorutils = module.exports = {};
var chroma = require("chroma-js");


// Take two color scales and return an interpolation function on the domain [0, 1] [0, 1]
colorutils.get_2d_gradient = function get_2d_gradient(x_colors, y_colors) {
  var x_color = chroma.scale(x_colors).mode('lab');
  var y_color = chroma.scale(y_colors).mode('lab');

  return function(x, y) {
    return chroma.interpolate(x_color(x), y_color(y), 0.5, 'lab');
  };
};