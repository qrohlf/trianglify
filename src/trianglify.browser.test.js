/**
 * @jest-environment jsdom
 */
/* eslint-env jest */
// Because Trianglify is authored using ES modules syntax (which Rollup likes)
// it can't be unit-tested on a per-file basis using Jest without maintaining
// a separate compiler configuration for test files.
//
// In the interest of sanity, this means that instead of unit-testing Trianglify,
// I'm importing the built `dist` files and running a set of integration tests
// against the public API only.
//
// I hope to start unit-testing in the future, when native support for ES modules
// lands in Node and Jest (See https://github.com/facebook/jest/issues/9430)

// pull in the transpiled, browser-bundle version of trianglify.
// this is needed so that we get the browser-targeted Canvas shim, and
// NOT the node library
const trianglify = require('../dist/trianglify.bundle.debug.js')
const Pattern = trianglify.Pattern

describe('Public API', () => {
  test('default export should be a function', () => {
    expect(trianglify).toBeInstanceOf(Function)
  })

  test('should export the colorbrewer palette', () => {
    expect(trianglify.utils.colorbrewer).toBeDefined()
    expect(trianglify.utils.colorbrewer.YlGn).toBeDefined()
  })

  test('should export the mix utility', () => {
    expect(trianglify.utils.mix).toBeDefined()
    expect(trianglify.utils.mix).toBeInstanceOf(Function)
  })

  test('should export the color function generators', () => {
    expect(trianglify.colorFunctions.interpolateLinear).toBeDefined()
    expect(trianglify.colorFunctions.interpolateLinear).toBeInstanceOf(Function)
    expect(trianglify.colorFunctions.sparkle).toBeInstanceOf(Function)
    expect(trianglify.colorFunctions.shadows).toBeInstanceOf(Function)
  })
})

describe('Options Parsing', () => {
  test('should throw an error on unrecognized options', () => {
    expect(
      () => trianglify({ height: 100, width: 100, bad_option: true })
    ).toThrow()
  })

  test('should throw an error on invalid dimensions', () => {
    expect(
      () => trianglify({ height: 100, width: -1 })
    ).toThrow()

    expect(
      () => trianglify({ height: -1, width: 100 })
    ).toThrow()
  })
})

describe('Pattern generation', () => {
  test('return a Pattern given valid options', () => {
    expect(trianglify({ height: 100, width: 100 })).toBeInstanceOf(Pattern)
  })

  test('should use default options when invoked', () => {
    const pattern = trianglify()
    expect(pattern.opts).toEqual(trianglify.defaultOptions)
  })

  test('should override opts with user-provided options', () => {
    const pattern = trianglify({ height: 100, width: 100, cellSize: 1234 })
    expect(pattern.opts.cellSize).toEqual(1234)
  })

  test('should accept the random color option without erroring', () => {
    expect(() => {
      trianglify({ xColors: 'random' })
      trianglify({ yColors: 'random' })
    }).not.toThrow()
  })

  test('should accept the match color option without erroring', () => {
    expect(() => {
      trianglify({ xColors: 'random', yColors: 'match' })
    }).not.toThrow()
  })

  test('should accept a named colorbrewer palette without erroring', () => {
    expect(() => {
      trianglify({ xColors: 'RdBu' })
      trianglify({ yColors: 'OrRd' })
    }).not.toThrow()
  })

  test('should error on a names palette that does not exist', () => {
    expect(() => {
      trianglify({ xColors: 'Foo' })
      trianglify({ yColors: 'Bar' })
    }).toThrow()
  })

  test('should generate well-formed geometry', () => {
    const pattern = trianglify({ height: 100, width: 100, cellSize: 20 })
    // we care about pattern.points and pattern.polys here
    expect(pattern.points).toBeInstanceOf(Array)
    // assert that points is an array of [x, y] tuples
    pattern.points.forEach(point => {
      expect(point).toBeInstanceOf(Array)
      expect(point).toHaveLength(2)
    })

    // asset the polys looks right
    expect(pattern.polys).toBeInstanceOf(Array)
    pattern.polys.forEach(poly => {
      expect(poly).toBeInstanceOf(Object)
      expect(Object.keys(poly)).toEqual(['vertexIndices', 'centroid', 'color'])
    })
  })

  test('should be random by default', () => {
    const pattern1 = trianglify()
    const pattern2 = trianglify()
    expect(pattern1.toSVG()).not.toEqual(pattern2.toSVG())
  })

  test('should be deterministic when seeded', () => {
    const pattern1 = trianglify({ seed: 'deadbeef' })
    const pattern2 = trianglify({ seed: 'deadbeef' })
    expect(pattern1.toSVG()).toEqual(pattern2.toSVG())
  })

  test('should match snapshot for non-breaking version bumps', () => {
    expect(trianglify({ seed: 'snapshotText' }).toSVG()).toMatchSnapshot()
  })
})

describe('Pattern outputs in browser environment', () => {
  describe('#toSVG', () => {
    test('returns a well-formed SVG node', () => {
      const pattern = trianglify()
      const svgDOM = pattern.toSVG()
      expect(svgDOM.tagName).toEqual('svg')
      expect(svgDOM.children).toBeInstanceOf(global.HTMLCollection)
      Array.from(svgDOM.children).forEach(node => {
        expect(node.tagName).toEqual('path')
      })
      expect(svgDOM.children).toHaveLength(pattern.polys.length)
    })

    test('supports rendering to the destSVG target', () => {
      const destSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      expect(destSVG.children).toHaveLength(0)
      const pattern = trianglify({ seed: 'destSVG works' })
      // side-effect-ful render to destSVG
      pattern.toSVG(destSVG)
      expect(destSVG.children).toHaveLength(pattern.polys.length)
      expect(destSVG).toMatchSnapshot()
    })
  })

  describe('#toSVGTree', () => {
    const pattern = trianglify({ seed: 'foobar' })
    const svgTree = pattern.toSVGTree()

    test('returns a synthetic tree of object literals', () => {
      expect(Object.keys(svgTree)).toEqual(['tagName', 'attrs', 'children', 'toString'])
    })

    test('serializes to an SVG string', () => {
      expect(svgTree.toString()).toMatchSnapshot()
    })
  })

  describe('#toCanvas', () => {
    test('returns a Canvas node', () => {
      const pattern = trianglify()
      const canvas = pattern.toCanvas()
      expect(canvas).toBeInstanceOf(global.HTMLElement)
      expect(canvas.tagName).toEqual('CANVAS')
      // there's not really any way to test the canvas contents here
    })
  })
})
