/*

Thoughts on the 0.2.0 API:

- The main use case for Trianglify so far has been to render a single image. Optimize for that use case.

Instead of:

var t = new Trianglify(options); var pattern = t.generate(100, 100); var svg = pattern.svgString

Do this:

var svg = Trianglify(100, 100, options).svg()


*/



// Trianglify. Made by (and copyright) @qrohlf, licensed under the GPLv3.
var colorbrewer = require('./colorbrewer');
var Delaunay = require('delaunay-fast');

var defaults = {
  cell_size: 50,
  cell_padding: 10,
  x_colors: ['#222', '#AAA'],
  y_colors: ['#222', '#AAA'],
  color_function: null
};

/*********************************************************
*
* Main function that is exported to the global namespace
*
**********************************************************/

function Trianglify(width, height, opts) {
  // merge the user-supplied options with the defaults,
  // overriding the default colors with a random colorbrewer
  // color
  var c = _random_colorbrewer();
  var pretty_defaults = _merge_opts(defaults, {
    x_colors: c,
    y_colors: c
  });
  opts = _merge_opts(pretty_defaults, opts);

  // generate a point mesh
  if (!(width > 0 && height > 0)) {
    throw new Error("You must specify a width and height when generating patterns.");
  }
  var points = _generate_points(width, height);
  var delaunay = Delaunay.triangulate(points);
  var triangles = [];
  var lookup_point = function(i) { return points[i];};
  for (var i=0; i < delaunay.length; i += 3) {
    var vertices = [delaunay[i], delaunay[i+1], delaunay[i+2]].map(lookup_point);
    var centroid = _centroid(vertices);
    var color = "#000";
    triangles.push([color, vertices]);
  }
  return Pattern(triangles, opts);
}


/*********************************************************
*
* Private functions
*
**********************************************************/

// generate points on a randomized grid
function _generate_points(width, height) {
  // figure out how many cells we're going to have on each axis
  var cells_x = Math.floor((width + 2 * opts.cell_size) / opts.cell_size);
  var cells_y = Math.floor((height + 2 * opts.cell_size) / opts.cell_size);
  // figure out the bleed widths to center our grid
  var bleed_x = ((cells_x * opts.cell_size) - width)/2;
  var bleed_y = ((cells_y * opts.cell_size) - height)/2;
  // how much can out points wiggle (+/-) given the cell padding?
  var variance = opts.cell_size - opts.cell_padding * 2;

  var points = [];
  for (var i = - bleed_x; i <= width + bleed_x; i += opts.cell_size) {
    for (var j = - bleed_y; j <= height + bleed_y; j += opts.cell_size) {
      var x = Math.floor(i + Math.random() * 2 * variance - variance);
      var y = Math.floor(j + Math.random() * 2 * variance - variance);
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


Trianglify.colorbrewer = colorbrewer;
Trianglify.defaults = defaults;
module.exports = Trianglify;