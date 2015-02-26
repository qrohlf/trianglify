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
    Trianglify().should.include.keys(['opts', 'data', 'svg', 'canvas']);
  });

  it('should populate opts with defaults', function() {
    var default_props = Object.keys(Trianglify.defaults);
    Trianglify().opts.should.have.keys(default_props);
  });

  it('should override opts with user-provided options', function() {
    Trianglify({cell_size: 1234}).opts.cell_size.should.equal(1234);
  });


  it('should pass well-formed geometry to the Pattern', function() {
    var data = Trianglify(400, 400).data;

    data.should.be.instanceof(Array);
      var datum = data[0];
      datum.should.be.instanceof(Array);
      datum[0].should.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
      datum[1].should.be.instanceof(Array);
      datum[1].should.have.length(3);
      datum[1][0].should.have.length(2);
  });

});

var colorutils = require('../lib/colorutils');
var Color = require('color');
describe('colorutils', function() {
  describe('#get_gradient', function() {

    it('should return an all-black gradient given black inputs', function() {
      var rothko = colorutils.get_gradient(['#000', '#000']);
      rothko(0).rgb().should.eql({r: 0, g: 0, b: 0});
    });

    it('should return a greyscale gradient given white/black inputs', function() {
      var greyscale = colorutils.get_gradient(['#FFF', '#000']);
      greyscale(0).rgb().should.eql({r: 255, g: 255, b: 255});
      greyscale(0.5).rgb().should.eql({r: 128, g: 128, b: 128});
      greyscale(1).rgb().should.eql({r: 0, g: 0, b: 0});
    });

    it('should do gradients with an arbitrary number of stops', function() {
      var colors = ["#ffffcc","#a1dab4","#41b6c4","#225ea8"];
      var gradient = colorutils.get_gradient(colors);

      // check on stops
      var target, result, x;
      for (var i = 0; i < colors.length; i++) {
        target = Color(colors[i]);
        x = i/(colors.length - 1);
        result = gradient(x);
        result.rgb().should.eql(target.rgb());
      }

      for (i = 0; i < colors.length - 1; i++) {
        target = Color(colors[i]).mix(Color(colors[i+1]));
        x = i/(colors.length - 1) + 1/(colors.length - 1) * 0.5;
        result = gradient(x);
        result.rgb().should.eql(target.rgb());
      }
    });
  });

  describe('#get_2d_gradient', function() {
    it('should return a function that takes two color arrays and returns a 2d interpolation function', function() {
      var grad2d = colorutils.get_2d_gradient(["#000", "#FFF"], ["#000", "#FFF"]);
      grad2d(0, 0).rgb().should.eql({r: 0, g: 0, b: 0});
      grad2d(0.5, 0.5).rgb().should.eql({r: 128, g: 128, b: 128});
      grad2d(1, 1).rgb().should.eql({r: 255, g: 255, b: 255});
    });
  });
});
