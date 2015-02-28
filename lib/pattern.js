// rendering methods here!
var doc = document || require('jsdom');

function Pattern(polys, opts) {

  return {
    polys: polys,
    opts: opts,
    svg: function() {
      var svgNode = doc.createElementNS("http://www.w3.org/2000/svg", 'svg');
      svgNode.setAttribute('width', opts.width);
      svgNode.setAttribute('height', opts.height);

      polys.forEach(function(poly) {
        var path = doc.createElementNS("http://www.w3.org/2000/svg", 'path');
        path.setAttribute("d", "M" + poly[1].join("L") + "Z");
        path.setAttribute("fill", poly[0]);
        path.setAttribute("stroke", poly[0]);
        svgNode.appendChild(path);
      });

      return svgNode;
    },

    canvas: function() {

    }
  };
}

module.exports = Pattern;