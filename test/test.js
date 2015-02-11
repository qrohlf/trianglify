var should = require('chai').should();
var expect = require('chai').expect;
var Trianglify = require('../lib/trianglify');

var Pattern = require('../lib/pattern');

describe('Trianglify', function(){

  it('should export the colorbrewer palette', function() {
    Trianglify.colorbrewer.should.have.property('YlGn');
  });

  it('should throw an error on invalid options', function() {
    (function() {Trianglify(100, 100, {bad_option: true});}).should.throw(Error);
  });

  it('should throw an error on invalid dimensions', function() {
    (function() {Trianglify();}).should.throw(Error);
    (function() {Trianglify(-1, 100);}).should.throw(Error);
    (function() {Trianglify(100, -1);}).should.throw(Error);
  });

  it('return a Pattern given valid options', function() {
    Trianglify(100, 100).should.include.keys(['opts', 'data', 'svg', 'canvas']);
  });

  it('should populate opts with defaults', function() {
    var default_props = Object.keys(Trianglify.defaults);
    Trianglify(100, 100).opts.should.have.keys(default_props);
  });

  it('should override opts with user-provided options', function() {
    Trianglify(100, 100, {cell_size: 1234}).opts.cell_size.should.not.equal(Trianglify.defaults.cell_size);
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
