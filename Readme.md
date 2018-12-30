# Trianglify [![Build Status](https://travis-ci.org/qrohlf/trianglify.svg?branch=master)](https://travis-ci.org/qrohlf/trianglify)


Trianglify is a library that I wrote to generate nice SVG background images like this one:

![](https://cloud.githubusercontent.com/assets/347189/6771063/f8b0af46-d090-11e4-8d4c-6c7ef5bd9d37.png)

# Getting Trianglify

You can grab Trianglify with npm/yarn (recommended):

```
npm install trianglify
```

Include it in your HTML via CDNJS:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/trianglify/2.0.0/trianglify.min.js"></script>
```

Or clone the repo:

```
git clone https://github.com/qrohlf/trianglify.git
```


# Quickstart

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/trianglify/2.0.0/trianglify.min.js"></script>
<script>
	var pattern = Trianglify({
		width: window.innerWidth,
		height: window.innerHeight
	});
	document.body.appendChild(pattern.canvas())
</script>
```

See https://qrohlf.com/trianglify for interactive examples and a walkthrough of the most commonly-used Trianglify options.

# Licensing

The source code of Trianglify is licensed under version 3 of the GNU General Public License ([GPLv3](https://www.gnu.org/licenses/gpl-3.0.html)). This means that any websites, apps, or other projects that include the Trianglify javascript library need to be released under a compatible open-source license. If you are interested in using Trianglify in a closed-source project, please email qr@qrohlf.com to purchase a commercial license.

**However**, it's worth noting that you own the copyright to the output image files which you create using Trianglify, just like you own the copyright to an image created using something like [GIMP](https://www.gimp.org/). If you just want to use an image file that was generated using Trianglify in your project, and do not plan to distribute the Trianglify source code or compiled versions of it, you do not need to worry about the license restrictions described above.


# API

Trianglify exposes a single function into the global namespace, called `Trianglify`. This takes a single options object as an argument and returns a pattern object.

```js
var Trianglify = require('trianglify'); // only needed in node.js
var pattern = Trianglify({width: 200, height: 200})
```

The pattern object contains data about the generated pattern's options and geometry, as well as rending implementations.

### pattern.opts

Object containing the options used to generate the pattern.

### pattern.polys

The colors and vertices of the polygons that make up the pattern, in the following format:

```js
[
  ['color', [vertex, vertex, vertex]],
  ['color', [vertex, vertex, vertex]],
  ...
]
```

### pattern.svg([opts])

Rendering function for SVG. Returns an SVGElement DOM node. Takes an optional options object. Currently the only supported option is `{includeNamespace: true}`, which will cause the output to include an `xmlns='http://www.w3.org/2000/svg'` attribute. This is helpful if you intend to serialize the svg string to a file, as most browsers and vector graphics programs require it. See [#41](https://github.com/qrohlf/trianglify/issues/41) for more details about this option.

### pattern.canvas([HTMLCanvasElement])

Rendering function for canvas. When called with no arguments returns a HTMLCanvasElement DOM node. When passed an existing canvas element as an argument, renders the pattern to the existing canvas.

To use this in a node.js environment, the optional dependency [node-canvas](https://github.com/Automattic/node-canvas) needs to be installed.

### pattern.png()

Rendering function for PNG. Returns a data URI with the PNG data in base64 encoding. See [examples/save-as-png.js](examples/save-as-png.js) for an example of decoding this into a file.


# Options

Trianglify is configured by an options object passed in as the only argument. The following option keys are supported:

### width

Integer, defaults to `600`. Specify the width in pixels of the pattern to generate.

### height

Integer, defaults to `400`. Specify the height in pixels of the pattern to generate.

### cell_size

Integer, defaults to `75`. Specify the size of the mesh used to generate triangles. Larger values will result in coarser patterns, smaller values will result in finer patterns. Note that very small values may dramatically increase the runtime of Trianglify.

### variance

Decimal value between 0 and 1 (inclusive), defaults to `0.75`. Specify the amount of randomness used when generating triangles.

### seed

Number or string, defaults to `null`. Seeds the random number generator to create repeatable patterns. When set to null, the random number will be seeded with random values from the environment. An example usage would be passing in blog post titles as the seed to generate unique trianglify patterns for every post on a blog that won't change when the page reloads.

### x_colors

False, string, or array of CSS-formatted colors, default is `'random'`. Specify the color gradient used on the x axis.

If false, the colors will not vary over the x axis; this requires the y_color to have a specified value.

Valid string values are 'random' or the name of a [colorbrewer palette](http://bl.ocks.org/mbostock/5577023) (i.e. 'YlGnBu' or 'RdBu'). When set to 'random', a gradient will be randomly selected from the colorbrewer library.

Valid array values should specify the color stops in any CSS format (i.e. `['#000000', '#4CAFE8', '#FFFFFF']`).

### y_colors

False, string or array of CSS-formatted colors, default is `'match_x'`. When set to 'match_x' the same gradient will be used on both axes.
If false, the colors will not vary over the y axis; this requires the x_color to have a specified value.
Otherwise, accepts the same options as x_colors.

### color_space

String, defaults to `'lab'`. Set the color space used for generating gradients. Supported values are rgb, hsv, hsl, hsi, lab and hcl. See this [blog post](https://vis4.net/blog/posts/avoid-equidistant-hsv-colors/) for some background on why this matters.

### color_function

Specify a custom function for coloring triangles, defaults to `null`. Accepts a function to override the standard gradient coloring that takes the x,y coordinates of a triangle's centroid as arguments and returns a CSS-formatted color string representing the color that triangle should have.

Here is an example color function that uses the HSL color format to generate a rainbow pattern:

```javascript
var colorFunc = function(x, y) {
	return 'hsl('+Math.floor(Math.abs(x*y)*360)+',80%,60%)';
};

var pattern = Trianglify({color_function: colorFunc})
```

### stroke_width

Number, defaults to `1.51`. Specify the width of the stroke on triangle shapes in the pattern. The default value is the ideal value for eliminating antialiasing artifacts when rendering patterns to a canvas.

### points

Array of points ([x, y]) to trianglulate. When not specified an array randomised points is generated filling the space.
