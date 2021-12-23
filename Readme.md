# Trianglify ![Build Status](https://github.com/qrohlf/trianglify/workflows/build/badge.svg)


Trianglify is a library that I wrote to generate nice SVG background images like this one:

![](https://cloud.githubusercontent.com/assets/347189/6771063/f8b0af46-d090-11e4-8d4c-6c7ef5bd9d37.png)

# Contents
[📦 Getting Trianglify](#-getting-trianglify)  
[🏎 Quickstart](#-quickstart)  
[⚖️ Licensing](#%EF%B8%8F-licensing)  
[📖 API](#-api)  
[🎨 Configuration](#-configuration)

# 📦 Getting Trianglify

You can grab Trianglify with npm/yarn (recommended):

```
npm install --save trianglify
```

Include it in your application via the unpkg CDN:

```
<script src='https://unpkg.com/trianglify@^4/dist/trianglify.bundle.js'></script>
```

Or download a .zip from the [**releases page**](https://github.com/qrohlf/trianglify/releases).


# 🏎 Quickstart

**Browsers**
```html
<script src='https://unpkg.com/trianglify@^4/dist/trianglify.bundle.js'></script>
<script>
  const pattern = trianglify({
    width: window.innerWidth,
    height: window.innerHeight
  })
  document.body.appendChild(pattern.toCanvas())
</script>
```

**Node**
```js
const trianglify = require('trianglify')
const fs = require('fs')

const canvas = trianglify({
  width: 1920,
  height: 1080
}).toCanvas()

const file = fs.createWriteStream('trianglify.png')
canvas.createPNGStream().pipe(file)
```

You can see the [`examples/`](./examples) folder for more usage examples.

The https://trianglify.io/ GUI is a good place to play around with the various configuration parameters and see their effect on the generated output, live.

# ⚖️ Licensing

The source code of Trianglify is licensed under version 3 of the GNU General Public License ([GPLv3](https://www.gnu.org/licenses/gpl-3.0.html)). This means that any websites, apps, or other projects that include the Trianglify javascript library need to be released under a compatible open-source license. If you are interested in using Trianglify in a closed-source project, please email qr@qrohlf.com to purchase a commercial license.

**However**, it's worth noting that you own the copyright to the output image files which you create using Trianglify, just like you own the copyright to an image created using something like [GIMP](https://www.gimp.org/). If you just want to use an image file that was generated using Trianglify in your project, and do not plan to distribute the Trianglify source code or compiled versions of it, you do not need to worry about the license restrictions described above.


# 📖 API

Trianglify is primarily used by calling the `trianglify` function, which returns a `trianglify.Pattern` object.

```js
// load the library, either via a window global (browsers) or require call (node)
// in es-module environments, you can `import trianglify from 'trianglify'` as well
const trianglify = window.trianglify || require('trianglify')

const options = { height: 400, width: 600 }
const pattern = trianglify(options)
console.log(pattern instanceof trianglify.Pattern) // true
```

## pattern

This object holds the generated geometry and colors, and exposes a number of methods for rendering this geometry to the DOM or a Canvas.


**`pattern.opts`**

Object containing the options used to generate the pattern.


**`pattern.points`**

The pseudo-random point grid used for the pattern geometry, in the following format:

```js
[
  [x, y],
  [x, y],
  [x, y],
  // and so on...
]
```


**`pattern.polys`**

The array of colored polygons that make up the pattern, in the following format:

```js
// {x, y} center of the first polygon in the pattern
pattern.polys[0].centroid

// [i, i, i] three indexes into the pattern.points array, 
// defining the shape corners
pattern.polys[0].vertexIndices

// Chroma.js color object defining the color of the polygon
pattern.polys[0].color
```


**`pattern.toSVG(destSVG?, svgOpts?)`**

Rendering function for SVG. In browser or browser-like (e.g. JSDOM) environments, this will return a SVGElement DOM node. In node environments, this will return a lightweight node tree structure that can be serialized to a valid SVG string using the `toString()` function.

If an existing svg element is passed as the `destSVG`, this function will render the pattern to the pre-existing element instead of creating a new one.

The `svgOpts` option allows for some svg-specific customizations to the output:

```js
const svgOpts = {
  // Include or exclude the xmlns='http://www.w3.org/2000/svg' attribute on
  // the root <svg> tag. See https://github.com/qrohlf/trianglify/issues/41
  // for additional details on why this is sometimes important
  includeNamespace: true,
  // Controls how many decimals to round coordinate values to.
  // You can set this to -1 to disable rounding. Default is 1.
  coordinateDecimals: 1
}
```


**`pattern.toSVGTree(svgOpts?)`**

Alternate rendering function for SVG. Returns a lightweight node tree structure that can be seralized to a valid SVG string using the `toString()` function. In node environments, this is an alias for
`pattern.toSVG()`.


**`pattern.toCanvas(destCanvas?, canvasOpts?)`**

Rendering function for canvas. In browser and browser-like environments, returns a Canvas HTMLElement node. In node environments, this will return a node-canvas object which follows [a superset of the Web Canvas API](https://github.com/Automattic/node-canvas#documentation).

If an existing canvas element is passed as the `destCanvas`, this function will render the pattern to the pre-existing element instead of creating a new one.

To use this in a node.js environment, the optional dependency [node-canvas](https://github.com/Automattic/node-canvas) needs to be installed as a dependency of your project `npm install -save canvas`.

The `canvasOpts` option allows for some canvas-specific customizations to the output:

```js
const canvasOpts = {
  // determines how the canvas is rendered on high-DPI (aka "retina") devices.
  // - 'auto' will automatically render the canvas at the appropriate scale ratio
  //   for pixel-perfect display.
  // - a numeric value will render the canvas at that specific scale factor
  //   for example, 2.0 will render it at 2x resolution, wheras 0.5 will render
  //   at half resolution
  // - 'false' will disable scaling, and the canvas will be rendered at the 
  //   exact resolution specified by `width, height`
  scaling: 'auto',
  // if the canvas is rendered at a different resolution than the {width, height}
  // trianglify will apply some inline style attributes to scale it back to
  // the requested {width, height} options. Set applyCssScaling to false to 
  // disable this behavior.
  applyCssScaling: true
}
```

# 🎨 Configuration

Trianglify is configured by an options object passed in as the only argument. The following option keys are supported, see below for a complete description of what each option does.

```js
const defaultOptions = {
  width: 600,
  height: 400,
  cellSize: 75,
  variance: 0.75,
  seed: null,
  xColors: 'random',
  yColors: 'match',
  fill: true,
  palette: trianglify.colorbrewer,
  colorSpace: 'lab',
  colorFunction: trianglify.colorFunctions.interpolateLinear(0.5),
  strokeWidth: 0,
  points: null
}
```

**`width`**

Integer, defaults to `600`. Specify the width in pixels of the pattern to generate.

**`height`**

Integer, defaults to `400`. Specify the height in pixels of the pattern to generate.

**`cellSize`**

Integer, defaults to `75`. Specify the size in pixels of the mesh used to generate triangles. Larger values will result in coarser patterns, smaller values will result in finer patterns. Note that very small values may dramatically increase the runtime of Trianglify.

**`variance`**

Decimal value between 0 and 1 (inclusive), defaults to `0.75`. Specify the amount of randomness used when generating triangles. You may set this higher than 1, but doing so may result in patterns that include "gaps" at the edges.

**`seed`**

String, defaults to `null`. Seeds the random number generator to create repeatable patterns. When set to null, the RNG will be seeded with random values from the environment. An example usage would be passing in blog post titles as the seed to generate unique but consistient trianglify patterns for every post on a blog site.

**`xColors`**

False, string, or array of CSS-formatted colors, default is `'random'`. Specify the color gradient used on the x axis.

Valid string values are 'random', or the name of a [colorbrewer palette](http://bl.ocks.org/mbostock/5577023) (i.e. 'YlGnBu' or 'RdBu'). When set to 'random', a gradient will be randomly selected from the colorbrewer library.

Valid array values should specify the color stops in any CSS format (i.e. `['#000000', '#4CAFE8', '#FFFFFF']`).

**`yColors`**

False, string or array of CSS-formatted colors, default is `'match'`. When set to 'match' the x-axis color gradient will be used on both axes. Otherwise, accepts the same options as xColors.

**`palette`**

The array of color combinations to pick from when using `random` for the xColors or yColors. See [`src/utils/colorbrewer.js`](./src/utils/colorbrewer.js) for the format of this data.

**`colorSpace`**

String, defaults to `'lab'`. Set the color space used for generating gradients. Supported values are rgb, hsv, hsl, hsi, lab and hcl. See this [blog post](https://vis4.net/blog/posts/avoid-equidistant-hsv-colors/) for some background on why this matters.

**`colorFunction`**

Specify a custom function for coloring triangles, defaults to `null`. Accepts a function to override the standard gradient coloring, which is passed a variety of data about the pattern and each polygon and must return a Chroma.js color object.

See [`examples/color-function-example.html`](./examples/color-function-example.html) and [`utils/colorFunctions.js`](./utils/colorFunctions.js) for more information about the built-in color functions, and how to write custom color functions.

**`fill`**

Boolean, defaults to `true`. Specifies whether the polygons generated by Trianglify should be filled in.

**`strokeWidth`**

Number, defaults to 0. Specify the width of the strokes used to outline the polygons. This can be used in conjunction with `fill: false` to generate weblike patterns.

**`points`**

Array of points ([x, y]) to triangulate, defaults to null. When not specified an array randomised points is generated filling the space. Points must be within the coordinate space defined by `width` and `height`. See [`examples/custom-points-example.html`](./examples/custom-points-example.html) for a demonstration of how this option can be used to generate circular trianglify patterns.
