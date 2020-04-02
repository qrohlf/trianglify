import * as math from 'mathjs'

// Given an array of coordinates representing a triangle, find the centroid
// of the triangle and return it as an {x, y} object
// Accepts a single [[x, y], [x, y], [x, y]] argument
export const getCentroid = d => {
  return {
    x: (d[0][0] + d[1][0] + d[2][0])/3,
    y: (d[0][1] + d[1][1] + d[2][1])/3
  }
}

// // given an array of coordinates representing a triangle in 3d space,
// // find the normal vector of the triangle, normalize it to a unit vector,
// // and return it as an [x, y, z] array
// export const getNormal = (poly) => {
//   const a = poly.vertices[0]
//   const b = poly.vertices[1]
//   const c = poly.vertices[2]
//   const ab = math.subtract(b, a)
//   const ac = math.subtract(c, a)
//   // get cross product
//   const cross = math.cross(ac, ab)
//   // normalize
//   const length = Math.sqrt(cross[0] * cross[0] + cross[1] * cross[1] + cross[2] * cross[2])
//   const norm = [cross[0] / length, cross[1] / length, cross[2] / length]
//   return norm
// }
