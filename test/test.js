var should = require('chai').should();
var Trianglify = require('../lib/trianglify');

describe('Trianglify', function(){

  describe('constructor', function(){

    it('should return a Trianglify object', function() {
      var t = new Trianglify();
      t.should.be.instanceof(Trianglify);
    });

    it('should have default options', function() {
      var t = new Trianglify();
      for (var key in t.defaults) {
        t.options.should.have.property(key);
      }
    });

    it('should override defaults with provided options', function() {
      var t = new Trianglify({cell_size: 1234, cell_padding: 567});
      t.options.cell_size.should.equal(1234);
      t.options.cell_padding.should.equal(567);
      t.options.should.not.equal(Trianglify.defaults);
    });

    it('should throw an error on invalid options', function() {
      (function() {new Trianglify({bad_option: true});}).should.throw(Error);
    });

    it('should give a random color from the colorbrewer palette if no colors are provided', function() {
      var t = new Trianglify();
      t.options.x_colors.should.have.length.within(3,11);
      t.options.y_colors.should.have.length.within(3,11);
    });

  });

});
