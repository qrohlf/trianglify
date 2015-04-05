# Trianglify

[![Dependency Status](https://david-dm.org/qrohlf/trianglify.svg)](https://david-dm.org/qrohlf/trianglify) [![Build Status](https://travis-ci.org/qrohlf/trianglify.svg?branch=master)](https://travis-ci.org/qrohlf/trianglify)


Trianglify is a library that I wrote to generate nice SVG background images like this one:

![](https://cloud.githubusercontent.com/assets/347189/6771063/f8b0af46-d090-11e4-8d4c-6c7ef5bd9d37.png)

It was inspired by [btmills/geopattern](https://github.com/btmills/geopattern) and the initial version was written in a single day because I got fed up with Adobe Illustrator.

v0.2.0 represents a ground-up rewrite of the original, eliminating the dependency on d3.js and adding the ability to render to PNG or canvas. **v0.1.x users should note that the API has changed and v0.2.0 is not backwards-compatible**.

# Getting Started

See https://qrohlf.com/trianglify for a overview on getting started and a demonstration of some configuration options.

# API Documentation

Trianglify exposes a single function into the global namespace, called `Trianglify`. This takes a single options object as an argument and returns a pattern object.

```js
var Trianglify = require('trianglify'); // only needed in node.js
var pattern = Trianglify({width: 200, height: 200})
```

The pattern object contains data about the generated pattern's options and geometry, as well as rending implementations.

### pattern.opts

The options used to generate the pattern

### pattern.polys

The colors and vertices of the polygons that make up the pattern, in the following format:

```js
[
  ['color', [vertex, vertex, vertex]],
  ['color', [vertex, vertex, vertex]],
  ...
]
```

### pattern.svg()

Rendering function for SVG. Returns an SVGElement DOM node.

### pattern.canvas([HTMLCanvasElement])

Rendering function for canvas. When called with no arguments returns a HTMLCanvasElement DOM node. When passed an existing canvas element as an argument, renders the pattern to the existing canvas.

### pattern.png()

Rendering function for PNG. Returns a data URI with the PNG data in base64 encoding. See [examples/save-as-png.js](examples/save-as-png.js) for an example of decoding this into a file.

# Options Documentation

# License