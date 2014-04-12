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

    this.append = function(width, height) {
        var svg = this.svg(width, height);
        document.body.appendChild(svg);
    }
    this.svg = function(width, height) {
        var pattern = new Trianglify.Pattern(this.options, width, height);
        return pattern.generate();
    }
    this.svgString = function(width, height) {
        return this.svg(width, height).outerHTML;
    }
    this.base64 = function(width, height) {
        return btoa(this.svgString(width, height));
    }
    this.dataUri = function (width, height) {
        return 'data:image/svg+xml;base64,' + this.base64(width, height);
    };
    this.dataUrl = function () {
        return 'url('+this.dataUri(600, 600)+')';
    };
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

        var elem = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        // elem.setAttribute("width", this.width+"px");
        // elem.setAttribute("height", this.height+"px");
        var svg = d3.select(elem);
        // var svg = d3.select("body").append("svg")
        svg.attr("width", this.width);
        svg.attr("height", this.height);
        svg.attr('xmlns', 'http://www.w3.org/2000/svg');
        var group = svg.append("g");


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
        var polys = d3.geom.delaunay(vertices);
        // path = path.data(polys); //.map(function(d) { return "M" + d.join("L") + "Z"; }), String
        console.log(polys);
        polys.forEach(function(d) {
            var x = (d[0][0] + d[1][0] + d[2][0])/3;
            var y = (d[0][1] + d[1][1] + d[2][1])/3;
            var c = color(x, y);
            group.append("path").attr("d", "M" + d.join("L") + "Z").attr({ fill: c, stroke: c});
        })
        return svg.node();
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