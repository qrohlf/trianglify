//example: new Trianglify({noiseIntensity: 0.5, cellsize: 200, x_gradient: colorbrewer.Blues[9], y_gradient: colorbrewer.Blues[9]}).generate(800, 800)


function Trianglify(options) {
    // defaults
    var defs = {
        cellsize: options.cellsize || 150,
        bleed: 1.5*options.cellsize || 300,
        cellpadding: options.cellpadding || 0.1*options.cellsize || 15,
        noiseIntensity: options.noiseIntensity || 0.3,
        x_gradient: options.x_gradient || colorbrewer.RdYlBu[9],
        y_gradient: options.y_gradient || colorbrewer.RdYlBu[9].map(function(c){return d3.rgb(c).brighter(.5)})
    }
    this.options = defs;

    this.generate = function(width, height) {
        var pattern = new Trianglify.Pattern(this.options, width, height);
        pattern.generate();
    }
} //end of Trianglify object

Trianglify.Pattern = function(options, width, height) {
    this.width = width;
    this.height = height;

    this.generate = function() {
        var cellpadding = options.cellsize/10,
        cellsX = Math.ceil((this.width+options.bleed*2)/options.cellsize),
        cellsY = Math.ceil((this.height+options.bleed*2)/options.cellsize),
        color = Trianglify.Pattern.gradient_2d(options.x_gradient, options.y_gradient, this.width, this.height);

        var vertices = d3.range(cellsX*cellsY).map(function(d) {
        // figure out which cell we are in
        var col = d % cellsX;
        var row = Math.floor(d / cellsX);
        var x = -options.bleed + col*options.cellsize + Math.random() * (options.cellsize - cellpadding*2) + cellpadding;
        var y = -options.bleed + row*options.cellsize + Math.random() * (options.cellsize - cellpadding*2) + cellpadding;
        // return [x*cellsize, y*cellsize];
        return [x, y]; // Populate the actual background with points
        });

        var svg = d3.select("body").append("svg")
        .attr("width", this.width)
        .attr("height", this.height);
        var path = svg.append("g").selectAll("path");


        if (options.noiseIntensity > 0) {
        var filter = svg.append("filter").attr("id", "noise");

        var noise = filter.append('feTurbulence').attr('type', 'fractalNoise').attr('in', 'fillPaint').attr('fill', '#F00').attr('baseFrequency', 0.7).attr('numOctaves', '10').attr('stitchTiles', 'stitch');
        var transfer = filter.append('feComponentTransfer');
        transfer.append('feFuncR').attr('type', 'linear').attr('slope', '2').attr('intercept', '-.5');
        transfer.append('feFuncG').attr('type', 'linear').attr('slope', '2').attr('intercept', '-.5');
        transfer.append('feFuncB').attr('type', 'linear').attr('slope', '2').attr('intercept', '-.5');
        filter.append('feColorMatrix').attr('type', 'matrix').attr('values', "0.3333 0.3333 0.3333 0 0 \n 0.3333 0.3333 0.3333 0 0 \n 0.3333 0.3333 0.3333 0 0 \n 0 0 0 1 0")
        var filterRect = svg.append("rect").attr("opacity", options.noiseIntensity).attr('width', '100%').attr('height', '100%').attr("filter", "url(#noise)");
        }
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
}

Trianglify.Pattern.gradient_2d = function (x_gradient, y_gradient, width, height) {
    
    return function(x, y) {
        var color_x = d3.scale.linear()
            .range(x_gradient)
            .domain(d3.range(0, width, width/x_gradient.length)); //[-bleed, width+bleed]
        var color_y = d3.scale.linear()
            .range(y_gradient)
            .domain(d3.range(0, height, height/y_gradient.length)); //[-bleed, width+bleed]
        return d3.interpolateRgb(color_x(x), color_y(y))(0.5);
    }
}