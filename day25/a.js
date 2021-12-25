const fs = require('fs')
const rows = fs
  .readFileSync('data.txt', 'utf8')
  .split('\n')

const xLen = rows[0].length
const yLen = rows.length

const nextEast = (x, y) => [(x + 1) % xLen, y]
const nextSouth = (x, y) => [x, (y + 1) % yLen]

let east = new Set()
let south = new Set()

const toStr = (x, y) => `${x},${y}`
const fromStr = (str) => str.split(',').map(Number)

for (const y in rows) {
  for (const x in rows[y]) {
    const coord = toStr(x, y)
    if (rows[y][x] === '>') east.add(coord)
    if (rows[y][x] === 'v') south.add(coord)
  }
}

let step = 1
while (true) {
  const _east = new Set()
  const _south = new Set()
  let anyChanged = false

  for (const coord of east) {
    const [x, y] = fromStr(coord)
    const nextCoord = toStr(...nextEast(x, y))

    if (!east.has(nextCoord) && !south.has(nextCoord)) {
      anyChanged = true
      _east.add(nextCoord)
    } else {
      _east.add(coord)
    }
  }

  for (const coord of south) {
    const [x, y] = fromStr(coord)
    const nextCoord = toStr(...nextSouth(x, y))

    if (!_east.has(nextCoord) && !south.has(nextCoord)) {
      anyChanged = true
      _south.add(nextCoord)
    } else {
      _south.add(coord)
    }
  }

  east = _east
  south = _south

  if (!anyChanged) break
  step++
}

console.log(step)
