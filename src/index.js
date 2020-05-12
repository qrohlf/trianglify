import trianglify from 'trianglify'


const target = document.getElementById('pattern')

const cycle = (overrides = {}) => trianglify({
  cellSize: window.innerWidth * 0.25 / 7,
  height: window.innerWidth * 0.25,
  width: window.innerWidth * 0.25,
  variance: Math.random() > 0.7 ? 0 : 1,
  ...overrides
}).toCanvas(target)

// force RdBu for the first cycle
cycle({xColors: trianglify.utils.colorbrewer.RdBu})
setInterval(cycle, 5000)
