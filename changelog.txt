v4
- ground-up port to ES2015
- support for node-canvas 2.6
- comprehensive test suite
- support for rendering wireframe patterns (no fill, just stroke)
- colorFunction has a new method signature that allows for more powerful customization
- new built-in colorFunctions: 'sparkle' and 'shadows'
- all-new example code, see examples directory
- all option keys are now camelCase, not snake_case
- antialiasing issues resolved for both SVG and Canvas rendering engines (#87, #30, #76)
- canvas rendering is now retina-ready by default
- removed dependency on seedrandom
- removed dependency on jsdom

v3
- close paths when rendering to canvas (thanks @Allidylls)
- bump a few dependencies for security
