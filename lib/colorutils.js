  // Take an array of colors and return an interpolation function on the domain [0, 1]

var colorutils = {};
module.exports = colorutils;
var Color = require("color");

colorutils.get_gradient = function get_gradient(colors) {
  if (colors.length == 2) {
    var a = Color(colors[0]);
    var b = Color(colors[1]);
    return function(j) {
      if (j < 0 || j > 1) {
        throw new Error('Gradient domain out of bounds.');
      }
      return a.mix(b, j);
    };
  }

  var interpolators = colors.map(function(color, i) {
    return get_gradient([color, colors[i+1 % colors.length]]);
  });

  return function(j) {
    if (j < 0 || j > 1) {
      throw new Error('Gradient '+j+' domain out of bounds.');
    }
    // figure out which interpolator to use
    var pos = Math.floor(j * (interpolators.length - 1));
    // subtract the offset of the chosen interpolator
    var q = j - pos / (interpolators.length - 1);
    var u = q * (interpolators.length - 1);
    return interpolators[pos](u);
  };
};

// Take two color scales and return an interpolation function on the domain [0, 1] [0, 1]
colorutils.get_2d_gradient = function get_2d_gradient(x_colors, y_colors) {
  var x_color = colorutils.get_gradient(x_colors);
  var y_color = colorutils.get_gradient(y_colors);

  return function(x, y) {
    return x_color(x).mix(y_color(y));
  };
};