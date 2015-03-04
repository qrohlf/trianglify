var should = require('chai').should();
var expect = require('chai').expect;

var Trianglify = require('../lib/trianglify');
var Pattern = require('../lib/pattern');

describe('Trianglify', function(){

  it('should export the colorbrewer palette', function() {
    Trianglify.colorbrewer.should.have.property('YlGn');
  });

  it('should throw an error on invalid options', function() {
    (function() {Trianglify({width: 100, height: 100, bad_option: true});}).should.throw(Error);
  });

  it('should throw an error on invalid dimensions', function() {
    (function() {Trianglify({width: -1, height: 100});}).should.throw(Error);
    (function() {Trianglify({width: 100, height: -1});}).should.throw(Error);
  });

  it('return a Pattern given valid options', function() {
    Trianglify().should.include.keys(['opts', 'polys', 'svg', 'canvas']);
  });

  it('should populate opts with defaults', function() {
    var default_props = Object.keys(Trianglify.defaults);
    Trianglify().opts.should.have.keys(default_props);
  });

  it('should override opts with user-provided options', function() {
    Trianglify({cell_size: 1234}).opts.cell_size.should.equal(1234);
  });


  it('should pass well-formed geometry to the Pattern', function() {
    var data = Trianglify(400, 400).polys;

    data.should.be.instanceof(Array);
      var datum = data[0];
      datum.should.be.instanceof(Array);
      datum[0].should.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
      datum[1].should.be.instanceof(Array);
      datum[1].should.have.length(3);
      datum[1][0].should.have.length(2);
  });

  it('should behave as a pure function when given a seed for the RNG', function() {
    var svg1 = Trianglify({seed: 'foobar', x_colors: 'random', y_colors: 'random'}).svg().outerHTML;
    var svg2 = Trianglify({seed: 'foobar', x_colors: 'random', y_colors: 'random'}).svg().outerHTML;
    svg1.should.equal(svg2);
  });

  it('should seed with random data by default', function() {
    Trianglify().svg().outerHTML.should.not.equal(Trianglify().svg().outerHTML);
  });

  it('should support custom color functions', function() {
    var rothko = function(x, y) {
      return '#000000'; //
    };

    Trianglify({color_function: rothko}).polys.forEach(function(p) {
      p[0].should.equal('#000000');
    });

  });

  it('should randomize colors when asked to');

  it('should match_x when asked to');

  it('should draw from a random palette if provided');

  it('should do all interpolation in the specified color space');

});


describe('Pattern', function() {
  describe('#svg', function() {
    //Not 100% sure how to test this
    it('should return an SVG DOM node');
  });

  describe('#canvas', function() {
    it('should return a canvas DOM node');
  });

  describe('#png', function() {
    it('should return a png file');
  });
});
