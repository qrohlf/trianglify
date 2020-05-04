// Fast seeded RNG adapted from the public-domain implementation
// by @byrc: https://github.com/bryc/code/blob/master/jshash/PRNGs.md
//
// Usage:
// const randFn = mulberry32('string seed')
// const randomNumber = randFn() // [0, 1] random float
export default function mulberry32 (seed) {
  if (!seed) { seed = Math.random().toString(36) } // support no-seed usage
  var a = xmur3(seed)()
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0
    var t = Math.imul(a ^ a >>> 15, 1 | a)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

function xmur3 (str) {
  for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = h << 13 | h >>> 19
  }
  return function () {
    h = Math.imul(h ^ h >>> 16, 2246822507)
    h = Math.imul(h ^ h >>> 13, 3266489909)
    return (h ^= h >>> 16) >>> 0
  }
}
