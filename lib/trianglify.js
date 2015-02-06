// Trianglify. Made by (and copyright) @qrohlf, licensed under the GPLv3.

// Includes
var colorbrewer = require('./colorbrewer');

(function() {
  // constructor defaults
  var defaults = {
        cell_size: 50,
        cell_padding: 10,
        x_colors: ['#222', '#AAA'],
        y_colors: ['#222', '#AAA']
  };

  // constructor
  Trianglify = function(options) {
    // random colors override defaults
    var c = _random_colorbrewer();
    var pretty_defaults = _merge_opts(defaults, {
      x_colors: c,
      y_colors: c
    });
    // options object overrides defaults
    this.options = _merge_opts(pretty_defaults, options);

  };

  // export the defaults for testing, etc
  Trianglify.defaults = defaults;

  // private/utility functions
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

  // export the colorbrewer set
  Trianglify.colorbrewer = colorbrewer;
  function _random_colorbrewer() {
    var keys = Object.keys(Trianglify.colorbrewer);
    var palette = Trianglify.colorbrewer[keys[Math.floor(Math.random()*keys.length)]];
    keys = Object.keys(palette);
    var colors = palette[keys[Math.floor(Math.random()*keys.length)]];
    return colors;
  }
})();
// export everything
module.exports = Trianglify;