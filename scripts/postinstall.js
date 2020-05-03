try {
  require('canvas')
} catch (e) {
  console.log('\n\n\nTrianglify has been installed successfully with SVG support.\n' +
    'For canvas support, you will need to install Cairo & node-canvas\n' +
    'On OSX, you can install node-canvas and Cairo with the following commands:`\n\n' +
    '    brew install cairo\n' +
    '    PKG_CONFIG_PATH=/usr/local/lib/pkgconfig:/opt/X11/lib/pkgconfig npm install -S canvas\n\n' +
    'See https://github.com/Automattic/node-canvas for more info')
}
