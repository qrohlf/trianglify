  // Take an array of colors and return an interpolation function on the domain [0, 1]

var colorutils = {};
module.exports = colorutils;
var Color = require("color");

colorutils.get_gradient = function get_gradient(colors) {
  if (colors.length == 2) {
    var a = Color(colors[0]);
    var b = Color(colors[1]);
    return function(j) {
      return a.mix(b, j);
    };
  }

  var interpolators = colors.map(function(color, i) {
    return get_gradient([color, colors[i+1 % colors.length]]);
  });

  return function(j) {
    // figure out which interpolator to use
    var pos = Math.floor(j * (interpolators.length - 1));
    // subtract the offset of the chosen interpolator
    var q = j - pos / (interpolators.length - 1);
    var u = q * (interpolators.length - 1);
    return interpolators[pos](u);
  };
};

// Take two color scales and return an interpolation function
colorutils.get_2dgradient = function get_2dgradient(x_color, y_color) {
  return function(x, y) {

  };
};