var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var doc = (typeof document !== "undefined") ? document : require('jsdom').jsdom('<html/>');

var Trianglify = require('../lib/trianglify');
module.exports = Trianglify;
var Pattern = require('../lib/pattern');

describe('Trianglify', function(){

  it('should export the colorbrewer palette', function() {
    Trianglify.colorbrewer.should.have.property('YlGn');
  });

  it('should throw an error on invalid options', function() {
    (function() {Trianglify({width: 100, height: 100, bad_option: true});}).should.throw(Error);
  });

  it('should throw an error on unspecified colors', function() {
    (function() {Trianglify({width: 100, height: 100, x_colors: false, y_colors: false});}).should.throw(Error);
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
      datum[0].should.be.a('string');
      datum[1].should.be.instanceof(Array);
      datum[1].should.have.length(3);
      datum[1][0].should.have.length(2);
  });

  it('should behave as a pure function when given a seed for the RNG', function() {
    var svg1 = Trianglify({seed: 'foobar', x_colors: 'random', y_colors: 'random'}).svg();
    var svg2 = Trianglify({seed: 'foobar', x_colors: 'random', y_colors: 'random'}).svg();
    expect(svg1.isEqualNode(svg2)).to.equal(true);
  });

  it('should seed with random data by default', function() {
    expect(Trianglify().svg().isEqualNode(Trianglify().svg())).to.equal(false);
  });

  it('should support custom color functions', function() {
    var rothko = function(x, y) {
      return '#000000'; //
    };

    Trianglify({color_function: rothko}).polys.forEach(function(p) {
      p[0].should.equal('rgb(0,0,0)');
    });

  });

  it('should randomize colors when asked to', function() {
    // Not a perfect test, but at least we catch failures that would cause an error to be thrown if x_colors is 'random'
    Trianglify({x_colors: 'random'});
  });

  it('should match_x when asked to', function() {
    var a = Trianglify({x_colors: 'YlGn', y_colors: 'match_x', height: 100, width: 100, cell_size: 20, seed: 'foo'});
    var b = Trianglify({x_colors: 'YlGn', y_colors: 'YlGn', height: 100, width: 100, cell_size: 20, seed: 'foo'});
    a.svg().isEqualNode(b.svg()).should.equal(true);
  });

  it('should draw from a random palette if provided', function() {
    var opts = {palette: [['#000', '#000'], ['#FFF', '#FFF']]};

    for (var i = 0; i < 5; i++) {
      ['rgb(0,0,0)', 'rgb(255,255,255)'].should.include(Trianglify(opts).polys[0][0]);
    }
  });

});


describe('Pattern', function() {
  describe('#svg', function() {
    //Not 100% sure how to test this
    it('should return an SVG DOM node', function() {
      Trianglify().svg().tagName.toLowerCase().should.eql('svg');
    });

    it('should add an xmlns attribute when requested', function() {
      Trianglify().svg({includeNamespace: true}).getAttribute('xmlns').should.eql('http://www.w3.org/2000/svg');
    });
  });

  describe('#canvas', function() {
    it('should return a canvas DOM node', function() {
      Trianglify().canvas().tagName.toLowerCase().should.eql('canvas');
    });
  });

  describe('#png', function() {
    it('should return a PNG-encoded data URI', function() {
      (typeof Trianglify().png()).should.eql('string');
    });
  });
});

describe('Points', function() {
  var points = require('../lib/points');
  describe('#_generate_points', function() {
    it('generates points', function() {
        var width = 400, height = 200, cell_size = 75, variance = 0.75, bleed_x = 1, bleed_y = 1;
        var rand_fn = function(val){ return 4; };

        var generatedPoints = points(width, height, bleed_x, bleed_y, cell_size, variance, rand_fn);
        var examplePoint = generatedPoints[0];

        generatedPoints.should.be.instanceof(Array);
        examplePoint.should.be.instanceof(Array);
        examplePoint.should.have.length(2);
    });
  });
});
