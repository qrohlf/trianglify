// Inspired by http://bl.ocks.org/mbostock/4341156


// Todo:
// Larger color palettes
// Better color assignment (rtl gradient?)
// Wrap it all up into a function
var palettes = {
  RedOrange: ["#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"], // modified colorbrewer YlOrBr
  Blues: ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"] // colorbrewer blues
}

var width = 960,
    height = 500,
    cellsize = 150,
    bleed = 1.5*cellsize,
    cellpadding = cellsize/10,
    cellsX = Math.ceil((width+bleed*2)/cellsize),
    cellsY = Math.ceil((height+bleed*2)/cellsize),
    colors = palettes.RedOrange,
    noiseIntensity = 0.3; //0.3 works well here

// function color(row, col) { //todo: color gradient!
//   var c = colors[Math.floor(Math.random()*colors.length)];
//   return d3.rgb(c).brighter((Math.random()-0.5)*0.6); //Mutate colors slightly. todo: make this better
// }

// color = gradient_2d(colorbrewer.RdYlBu[9], colorbrewer.RdYlBu[9]);
color = gradient_2d(colorbrewer.RdYlBu[9], colorbrewer.RdYlBu[9].map(function(c){return d3.rgb(c).brighter(.5)}));


function gradient_2d(x_gradient, y_gradient) {
  var color_x = d3.scale.linear()
    .range(x_gradient)
    .domain(d3.range(0, width, width/x_gradient.length)); //[-bleed, width+bleed]
  var color_y = d3.scale.linear()
    .range(y_gradient)
    .domain(d3.range(0, width, width/y_gradient.length)); //[-bleed, width+bleed]

  return function(x, y) {
    return d3.interpolateRgb(color_x(x), color_y(y))(0.5);
  }
}

var vertices = d3.range(cellsX*cellsY).map(function(d) {
  // figure out which cell we are in
  var col = d % cellsX;
  var row = Math.floor(d / cellsX);
  var x = -bleed + col*cellsize + Math.random() * (cellsize - cellpadding*2) + cellpadding;
  var y = -bleed + row*cellsize + Math.random() * (cellsize - cellpadding*2) + cellpadding;
  // return [x*cellsize, y*cellsize];
  return [x, y]; // Populate the actual background with points
});

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
var path = svg.append("g").selectAll("path");

// svg.selectAll("circle")
//     .data(vertices.slice(1))
//   .enter().append("circle")
//     .attr("transform", function(d) { return "translate(" + d + ")"; })
//     .attr("r", 2);


if (noiseIntensity > 0) {
  var filter = svg.append("filter").attr("id", "noise");

  var noise = filter.append('feTurbulence').attr('type', 'fractalNoise').attr('in', 'fillPaint').attr('fill', '#F00').attr('baseFrequency', 0.7).attr('numOctaves', '10').attr('stitchTiles', 'stitch');
  var transfer = filter.append('feComponentTransfer');
  transfer.append('feFuncR').attr('type', 'linear').attr('slope', '2').attr('intercept', '-.5');
  transfer.append('feFuncG').attr('type', 'linear').attr('slope', '2').attr('intercept', '-.5');
  transfer.append('feFuncB').attr('type', 'linear').attr('slope', '2').attr('intercept', '-.5');
  filter.append('feColorMatrix').attr('type', 'matrix').attr('values', "0.3333 0.3333 0.3333 0 0 \n 0.3333 0.3333 0.3333 0 0 \n 0.3333 0.3333 0.3333 0 0 \n 0 0 0 1 0")
  var filterRect = svg.append("rect").attr("opacity", noiseIntensity).attr('width', '100%').attr('height', '100%').attr("filter", "url(#noise)");
}
redraw();

function redraw() {
  path = path.data(d3.geom.delaunay(vertices).map(function(d) { return "M" + d.join("L") + "Z"; }), String);

  path.exit().remove();

  path.enter().append("path").attr("d", String).each(function(d, i) {
    var box = this.getBBox();
    var x = box.x + box.width / 2;
    var y = box.y + box.height / 2;
    console.log("x: "+x+" y: "+y);
    var c = color(x, y);
    d3.select(this).attr({ fill: c, stroke: c})
  });
}