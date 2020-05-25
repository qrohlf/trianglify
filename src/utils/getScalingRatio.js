export default function (ctx) {
  // adapted from https://gist.github.com/callumlocke/cc258a193839691f60dd
  const backingStoreRatio = (
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio || 1
  )

  const devicePixelRatio = (typeof window !== 'undefined' && window.devicePixelRatio) || 1
  const drawRatio = devicePixelRatio / backingStoreRatio
  return drawRatio
}
