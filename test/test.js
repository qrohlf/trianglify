var should = require('chai').should();
var expect = require('chai').expect;
var Trianglify = require('../lib/trianglify');

describe('Trianglify', function(){

  it('should export the colorbrewer palette', function() {
    Trianglify.colorbrewer.should.have.property('YlGn');
  });

  describe('constructor', function(){

    it('should have default options', function() {
      var t = Trianglify();
      expect(Trianglify.defaults).to.not.be.undefined();

      for (var key in Trianglify.defaults) {
        t.opts.should.have.property(key);
      }
    });

    it('should override defaults with provided options', function() {
      var t = Trianglify({cell_size: 1234, cell_padding: 567});
      t.opts.cell_size.should.equal(1234);
      t.opts.cell_padding.should.equal(567);
      t.opts.should.not.equal(Trianglify.defaults);
    });

    it('should throw an error on invalid options', function() {
      (function() {Trianglify({bad_option: true});}).should.throw(Error);
    });

    it('should give a random color from the colorbrewer palette if no colors are provided', function() {
      var t = Trianglify();
      t.opts.x_colors.should.have.length.within(3,11);
      t.opts.y_colors.should.have.length.within(3,11);
    });

    it('should not give a random color from the colorbrewer palette if colors are provided', function() {
      var whiteblack = ['#FFF', '#000'];
      var blackwhite = ['#000', '#FFF'];
      var t = Trianglify({
        x_colors: whiteblack,
        y_colors: blackwhite
      });
      t.opts.x_colors.should.equal(whiteblack);
      t.opts.y_colors.should.equal(blackwhite);
    });

  });

  describe('#generate', function() {
    var t = Trianglify();

    it('should return an array of colors & polygons', function() {
      var geom = t.generate(600, 300);
      geom.should.be.instanceof(Array);
      var datum = geom[0];
      datum.should.be.instanceof(Array);
      datum[0].should.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
      datum[1].should.be.instanceof(Array);
      datum[1].should.have.length(3);
      datum[1][0].should.have.length(2);
    });

    it('should throw an error if no dimensions are provided', function() {
      (function() { t.generate(); }).should.throw(Error);
    });

    it("really should be returning a Pattern closure", function() {
      throw new Error("wub wub wub wub");
    });
  });

});
