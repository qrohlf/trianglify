var should = require('chai').should();
var Trianglify = require('../trianglify');

describe('Trianglify', function(){

  describe('::randomColor', function() {
    it('should return an array of 2 or more colors', function(){
      Trianglify.randomColor().should.be.a('array').and.have.length.greaterThan(1);
    });
  });

  describe('constructor', function(){
    it('should have default options', function(){
      var t = new Trianglify();
      t.should.have.property('options');
    });
  });

  describe('#generate', function() {
    it('should return a Pattern', function() {
      new Trianglify().generate(300, 300).should.be.an.instanceof(Trianglify.Pattern);
    });

    it('should return an SVG with the specified dimensions');
  });

});

describe('Trianglify.Pattern', function(){

  describe('::gradient_2d', function() {
    it('should return a function', function() {
      Trianglify.Pattern.gradient_2d.should.be.a('function');
    });
  });

  describe('constructor', function() {

    it('should have width');

    it('should have height');

    it('should generate polygons');

    it('should generate a valid SVG');

    it('should generate an SVG String');

  });
});
