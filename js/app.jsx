require("babel/register");
let React = require('react');
let Hero = require('./components/Hero.jsx');
let TrianglifyOptionDemo = require('./components/TrianglifyOptionDemo.jsx');
let highlight = require('highlight.js');


React.render(<Hero />, document.getElementById('hero'));

// React.render(<TrianglifyOptionDemo demo='other'/>, document.getElementById('demo-cell-size'));

var demos = document.getElementsByClassName('trianglify-demo');
for (var i=0; i<demos.length; i++) {
  var demo = demos[i];
  console.log(demo.dataset.demo);
  React.render(<TrianglifyOptionDemo demo={demo.dataset.demo} />, demo);
}


//Syntax highlighting
highlight.initHighlightingOnLoad();