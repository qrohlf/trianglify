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
      t.options.should.equal(Trianglify.defaults);
    });

    it('should override defaults with provided options', function() {
      var t = new Trianglify({cell_size: 1234, cell_padding: 567});
      t.options.cell_size.should.equal(1234);
      t.options.cell_padding.should.equal(567);
    });

    it('should throw an error on invalid options', function() {
      (function() {new Trianglify({bad_option: true});}).should.throw(Error);
    });
  });

});
