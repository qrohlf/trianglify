/*
 * Pattern.js
 * Contains rendering implementations for trianglify-generated geometry
 */

// conditionally load jsdom if we don't have a browser environment available.
var doc = (typeof document !== "undefined") ? document : require('jsdom').jsdom('<html/>');

function Pattern(polys, opts) {

  // SVG rendering method
  function render_svg() {
    var svg = doc.createElementNS("http://www.w3.org/2000/svg", 'svg');
    svg.setAttribute('width', opts.width);
    svg.setAttribute('height', opts.height);

    polys.forEach(function(poly) {
      var path = doc.createElementNS("http://www.w3.org/2000/svg", 'path');
      path.setAttribute("d", "M" + poly[1].join("L") + "Z");
      path.setAttribute("fill", poly[0]);
      path.setAttribute("stroke", poly[0]);
      path.setAttribute("stroke-width", opts.stroke_width);
      svg.appendChild(path);
    });

    return svg;
  }

  // Canvas rendering method
  function render_canvas(canvas) {
    // check for canvas support
    if (typeof process !== "undefined") {
      try {
        require('canvas');
      } catch (e) {
        throw Error('The optional node-canvas dependency is needed for Trianglify to render using canvas in node.');
      }
    }

    if (!canvas) {
      canvas = doc.createElement('canvas');
    }

    canvas.setAttribute('width', opts.width);
    canvas.setAttribute('height', opts.height);
    ctx = canvas.getContext("2d");
    ctx.canvas.width = opts.width;
    ctx.canvas.height = opts.height;

    polys.forEach(function(poly) {
      ctx.fillStyle = ctx.strokeStyle = poly[0];
      ctx.lineWidth = opts.stroke_width;
      ctx.beginPath();
      ctx.moveTo.apply(ctx, poly[1][0]);
      ctx.lineTo.apply(ctx, poly[1][1]);
      ctx.lineTo.apply(ctx, poly[1][2]);
      ctx.fill();
      ctx.stroke();
    });

    return canvas;
  }

  // PNG rendering method
  // currently returns a data url as a string since toBlob support really isn't there yet...
  function render_png() {
    return render_canvas().toDataURL("image/png");
  }

  // Return an object with all the relevant functions/properties attached to it
  return {
    polys: polys,
    opts: opts,
    svg: render_svg,
    canvas: render_canvas,
    png: render_png
  };
}

module.exports = Pattern;