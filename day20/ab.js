const fs = require('fs')
const [algo, image] = fs
  .readFileSync('data.txt', 'utf8')
  .split('\n\n')

const toStr = (x, y) => `${x},${y}`
const fromStr = (str) => str.split(',').map(Number)

const imageMatrix = image.split('\n')

// As algo.at(0) is lit and algo.at(-1) is not, the infinite surroundings will toggle between lit and dark
// If containsLit is true, coordinates contains lit coordinates and if it is false the reverse applies
let containsLit = true
let coordinates = new Set()

const LIT = '#'
const DARK = '.'

for (let y = 0; y < imageMatrix.length; y++) {
  for (let x = 0; x < imageMatrix[y].length; x++) {
    if (imageMatrix[y][x] === LIT) coordinates.add((toStr(x, y)))
  }
}

const findExtremes = (coords) => {
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity

  for (const coord of coords) {
    const [x, y] = fromStr(coord)

    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }

  return { minX, maxX, minY, maxY }
}

// We need to check two steps outside of the borders, after that the values are predictable
const BORDER_ADDON = 2

const A_ITR = 2
const B_ITR = 50

for (let itr = 1; itr <= Math.max(A_ITR, B_ITR); itr++) {
  const _coordinates = new Set()

  const { minX, maxX, minY, maxY } = findExtremes(coordinates.keys())

  for (let y = minY - BORDER_ADDON; y <= maxY + BORDER_ADDON; y++) {
    for (let x = minX - BORDER_ADDON; x <= maxX + BORDER_ADDON; x++) {
      let binary = ''

      for (const dy of [-1, 0, 1]) {
        for (const dx of [-1, 0, 1]) {
          const known = containsLit ? '1' : '0'
          const unknown = containsLit ? '0' : '1'
          const coordinate = coordinates.has(toStr(x + dx, y + dy))

          binary += coordinate ? known : unknown
        }
      }

      if (algo[parseInt(binary, 2)] === (containsLit ? DARK : LIT)) {
        _coordinates.add(toStr(x, y))
      }
    }
  }

  containsLit = !containsLit
  coordinates = _coordinates

  if (itr === A_ITR) console.log('Part 1: ' + coordinates.size)
  if (itr === B_ITR) console.log('Part 2: ' + coordinates.size)
}
