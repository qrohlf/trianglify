// rendering methods here!
var doc = (typeof document !== "undefined") ? document : require('jsdom').jsdom('<html/>');

function Pattern(polys, opts) {

  return {
    polys: polys,
    opts: opts,

    svg: function() {
      var svg = doc.createElementNS("http://www.w3.org/2000/svg", 'svg');
      svg.setAttribute('width', opts.width);
      svg.setAttribute('height', opts.height);

      polys.forEach(function(poly) {
        var path = doc.createElementNS("http://www.w3.org/2000/svg", 'path');
        path.setAttribute("d", "M" + poly[1].join("L") + "Z");
        path.setAttribute("fill", poly[0]);
        path.setAttribute("stroke", poly[0]);
        svg.appendChild(path);
      });

      return svg;
    },

    canvas: function() {
      var canvas = doc.createElement('canvas');
      canvas.setAttribute('width', opts.width);
      canvas.setAttribute('height', opts.height);
      var ctx = canvas.getContext("2d");

      polys.forEach(function(poly) {
        ctx.fillStyle = ctx.strokeStyle = poly[0];
        ctx.beginPath();
        ctx.moveTo.apply(ctx, poly[1][0]);
        ctx.lineTo.apply(ctx, poly[1][1]);
        ctx.lineTo.apply(ctx, poly[1][2]);
        ctx.fill();
        ctx.stroke();
      });

      return canvas;
    },

    png: function() {

    }
  };
}

module.exports = Pattern;