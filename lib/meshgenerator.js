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
    bleed = 400,
    cellsize = 175,
    cellpadding = 20,
    cellsX = Math.ceil((width+bleed*2)/cellsize),
    cellsY = Math.ceil((height+bleed*2)/cellsize),
    colors = palettes.Blues;

function color(i) { 
  // figure out which cell we are in
  // var col = i % cellsX;
  // var row = Math.floor(i / cellsX);
  // get the distance from top-left
  // var dist = Math.sqrt(col*col + row*row);
  return colors[i%colors.length];
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
    .attr("height", height)
    .attr("class", "PiYG");

//svg.on("mousemove", function() { vertices[0] = d3.mouse(this); redraw(); });

var path = svg.append("g").selectAll("path");
redraw();

function redraw() {
  path = path.data(d3.geom.delaunay(vertices).map(function(d) { return "M" + d.join("L") + "Z"; }), String);

  path.exit().remove();

  path.enter().append("path").attr("d", String).each(function(d, i) {
    var c = color(i);
    d3.select(this).attr({ fill: c, stroke: c})
  });
}