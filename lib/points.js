function generate_grid(width, height, bleed_x, bleed_y, cell_size, variance, rand_fn) {
  var w = width + bleed_x;
  var h = height + bleed_y;
  var half_cell_size = cell_size * 0.5;
  var double_v = variance * 2;
  var negative_v = -variance;

  var points = [];
  for (var i = -bleed_x; i < w; i += cell_size) {
    for (var j = -bleed_y; j < h; j += cell_size) {
      var x = (i + half_cell_size) + (rand_fn() * double_v + negative_v);
      var y = (j + half_cell_size) + (rand_fn() * double_v + negative_v);
      points.push([Math.floor(x), Math.floor(y)]);
    }
  }

  return points;
}

module.exports = generate_grid;
