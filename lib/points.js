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

function _map(num, in_range, out_range ) {
    return ( num - in_range[0] ) * ( out_range[1] - out_range[0] ) / ( in_range[1] - in_range[0] ) + out_range[0];
}

// generate points on a randomized grid
function _generate_points(width, height, bleed_x, bleed_y, opts, variance, rand) {

	var points = [];
	for (var i = - bleed_x; i < width + bleed_x; i += opts.cell_size) {
	  for (var j = - bleed_y; j < height + bleed_y; j += opts.cell_size) {
	    var x = i + opts.cell_size/2 + _map(rand(), [0, 1], [-variance, variance]);
	    var y = j + opts.cell_size/2 + _map(rand(), [0, 1], [-variance, variance]);
	    points.push([x, y].map(Math.floor));
	  }
	}

	return points;
}


module.exports = {
	generateGrid: generate_grid,
	generatePoints: _generate_points
};
