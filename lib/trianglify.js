// Trianglify. Made by (and copyright) @qrohlf, licensed under the GPLv3.

(function() {
  //constructor defaults
  var defaults = {
        cell_size: 50,
        cell_padding: 10,
        x_colors: ['#222', '#AAA'],
        y_colors: ['#222', '#AAA']
  };

  //constructor
  Trianglify = function(options) {
    this.options = _merge_opts(defaults, options);
  };

  //export the defaults for testing, etc
  Trianglify.defaults = defaults;

  function _merge_opts(defaults, options) {
    for (var key in options) {
      if (defaults.hasOwnProperty(key)) {
        defaults[key] = options[key]; //override defaults with options
      } else {
        throw new Error(key+" is not a configuration option for Trianglify. Check your spelling?");
      }
    }

    return defaults;
  }
})();

module.exports = Trianglify;