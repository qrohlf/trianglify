// Mostly taken from http://bl.ocks.org/mbostock/4341156

var width = 960,
    height = 500,
    bleed = 400,
    cellsize = 175,
    cellpadding = 20,
    cellsX = Math.ceil((width+bleed*2)/cellsize),
    cellsY = Math.ceil((height+bleed*2)/cellsize);

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

// svg.selectAll("circle")
//     .data(vertices.slice(1))
//   .enter().append("circle")
//     .attr("transform", function(d) { return "translate(" + d + ")"; })
//     .attr("r", 2);

redraw();

function redraw() {
  path = path.data(d3.geom.delaunay(vertices).map(function(d) { return "M" + d.join("L") + "Z"; }), String);
  path.exit().remove();
  // path.enter().append("path").attr("fill", function(d, i) { return colorbrewer.YlOrBr[9][i%9]}).attr("d", String);
  // exlude lighter values:
  path.enter().append("path").attr("fill", function(d, i) { return colorbrewer.YlOrBr[9][2+i%7]}).attr("d", String);
}

// var width = 960,
//     height = 500;

// var vertices = d3.range(100).map(function(d) {
//   return [Math.random() * width, Math.random() * height];
// });

// var voronoi = d3.geom.voronoi()
//     .clipExtent([[0, 0], [width, height]]);

// var svg = d3.select("body").append("svg")
//     .attr("width", width)
//     .attr("height", height)
//     .on("mousemove", function() { vertices[0] = d3.mouse(this); redraw(); });

// var path = svg.append("g").selectAll("path");

// svg.selectAll("circle")
//     .data(vertices.slice(1))
//   .enter().append("circle")
//     .attr("transform", function(d) { return "translate(" + d + ")"; })
//     .attr("r", 1.5);

// redraw();

// function redraw() {
//   path = path
//       .data(voronoi(vertices), polygon);

//   path.exit().remove();

//   path.enter().append("path")
//       .attr("class", function(d, i) { return "q" + (i % 9) + "-9"; })
//       .attr("d", polygon);

//   path.order();
// }

// function polygon(d) {
//   return "M" + d.join("L") + "Z";
// }