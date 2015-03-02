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

});


describe('Pattern', function() {
  describe('#svg', function() {
    //Not 100% sure how to test this
    it('should return an SVG DOM node');


  })
})

var colorutils = require('../lib/colorutils');
describe('colorutils', function() {
  describe('#get_2d_gradient', function() {
    it('should return a function that takes two color arrays and returns a 2d interpolation function', function() {
      var grad2d = colorutils.get_2d_gradient(["#000", "#FFF"], ["#000", "#FFF"]);
      grad2d(0, 0).rgb().should.eql([0, 0, 0]);
      // grad2d(0.5, 0.5).rgb().should.eql([128, 128, 128]); not the case in LAB
      grad2d(1, 1).rgb().should.eql([255, 255, 255]);
    });
  });
});
