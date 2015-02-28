/*

Thoughts on the 0.2.0 API:

- The main use case for Trianglify so far has been to render a single image. Optimize for that use case.

Instead of:

var t = new Trianglify(options); var pattern = t.generate(100, 100); var svg = pattern.svgString

Do this:

var svg = Trianglify(100, 100, options).svg()


*/



// Trianglify. Made by (and copyright) @qrohlf, licensed under the GPLv3.
var Delaunay = require('delaunay-fast');
var Color = require("color");

var colorbrewer = require('./colorbrewer');
var Pattern = require('./pattern');
var colorutils = require('./colorutils');

var defaults = {
  cell_size: 50,
  cell_padding: 10,
  x_colors: ['#222', '#AAA'],
  y_colors: ['#222', '#AAA'],
  color_function: null,
  width: 600,
  height: 400
};

/*********************************************************
*
* Main function that is exported to the global namespace
*
**********************************************************/

function Trianglify(opts) {
  // merge the user-supplied options with the defaults,
  // overriding the default colors with a random colorbrewer
  // color
  var c = _random_colorbrewer();
  var pretty_defaults = _merge_opts(defaults, {
    x_colors: c,
    y_colors: c
  });
  opts = _merge_opts(pretty_defaults, opts);

  // Figure out key dimensions

  // it's a pain to prefix width and height with opts all the time, so let's
  // give them proper variables to refer to
  var width = opts.width;
  var height = opts.height;
  // How many cells we're going to have on each axis
  var cells_x = Math.floor((width + 2 * opts.cell_size) / opts.cell_size);
  var cells_y = Math.floor((height + 2 * opts.cell_size) / opts.cell_size);
  // figure out the bleed widths to center our grid
  var bleed_x = ((cells_x * opts.cell_size) - width)/2;
  var bleed_y = ((cells_y * opts.cell_size) - height)/2;
  // how much can out points wiggle (+/-) given the cell padding?
  var variance = (opts.cell_size - (opts.cell_padding * 2))/2;

  // Get a 2d gradient on the domain [0, 1], [0, 1]
  var gradient = colorutils.get_2d_gradient(opts.x_colors, opts.y_colors);

  // Set up normalizers
  var norm_x = function(x) {
    return _map(x, [-bleed_x, width+bleed_x], [0, 1]);
  };

  var norm_y = function(y) {
    return _map(y, [-bleed_y, height+bleed_y], [0, 1]);
  };

  // generate a point mesh
  if (!(width > 0 && height > 0)) {
    throw new Error("Width and height must be numbers greater than 0");
  }
  var points = _generate_points(width, height);
  var delaunay = Delaunay.triangulate(points);
  var triangles = [];
  var lookup_point = function(i) { return points[i];};

  for (var i=0; i < delaunay.length; i += 3) {
    var vertices = [delaunay[i], delaunay[i+1], delaunay[i+2]].map(lookup_point);
    var centroid = _centroid(vertices);
    var color = gradient(norm_x(centroid.x), norm_y(centroid.y)).hexString();
    triangles.push([color, vertices]);
  }
  return Pattern(triangles, opts);


  /*********************************************************
  *
  * Private functions
  *
  **********************************************************/

  function _map(num, in_range, out_range ) {
    return ( num - in_range[0] ) * ( out_range[1] - out_range[0] ) / ( in_range[1] - in_range[0] ) + out_range[0];
  }

  // generate points on a randomized grid
  function _generate_points(width, height) {

    var points = [];
    for (var i = - bleed_x; i < width + bleed_x; i += opts.cell_size) {
      for (var j = - bleed_y; j < height + bleed_y; j += opts.cell_size) {
        var x = i + opts.cell_size/2 + _map(Math.random(), [0, 1], [-variance, variance]);
        var y = j + opts.cell_size/2 + _map(Math.random(), [0, 1], [-variance, variance]);
        points.push([x, y]);
      }
    }

    return points;
  }

  //triangles only!
  function _centroid(d) {
    return {
      x: (d[0][0] + d[1][0] + d[2][0])/3,
      y: (d[0][1] + d[1][1] + d[2][1])/3
    };
  }

  // select a random palette from colorbrewer
  function _random_colorbrewer() {
    var keys = Object.keys(colorbrewer);
    var palette = colorbrewer[keys[Math.floor(Math.random()*keys.length)]];
    keys = Object.keys(palette);
    var colors = palette[keys[Math.floor(Math.random()*keys.length)]];
    return colors;
  }

  // shallow extend (sort of) for option defaults
  function _merge_opts(defaults, options) {
    var out = {};

    // shallow-copy defaults
    for (var key in defaults) {
      out[key] = defaults[key];
    }

    for (key in options) {
      if (defaults.hasOwnProperty(key)) {
        out[key] = options[key]; // override defaults with options
      } else {
        throw new Error(key+" is not a configuration option for Trianglify. Check your spelling?");
      }
    }
    return out;
  }

} //end of Trianglify function closure


Trianglify.colorbrewer = colorbrewer;
Trianglify.defaults = defaults;
module.exports = Trianglify;