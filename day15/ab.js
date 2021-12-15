const fs = require('fs')
const aMatrix = fs
  .readFileSync('data.txt', 'utf8')
  .split('\n')
  .map(row => row.split('').map(Number))

const size = 5

const yl = aMatrix.length
const xl = aMatrix[0].length

const bMatrix = new Array(yl * size).fill().map(() => new Array(xl * size).fill())

for (let i = 0; i < size; i++) {
  for (let j = 0; j < size; j++) {
    for (let y = 0; y < yl; y++) {
      for (let x = 0; x < xl; x++) {
        if (i === j && i === 0) {
          bMatrix[y][x] = aMatrix[y][x]
        } else {
          const getNextValue = v => (v + 1) > 9 ? 1 : v + 1

          if (j === 0) {
            bMatrix[y + i * yl][x + j * xl] = getNextValue(bMatrix[y + (i - 1) * yl][x + j * xl])
          } else {
            bMatrix[y + i * yl][x + j * xl] = getNextValue(bMatrix[y + i * yl][x + (j - 1) * xl])
          }
        }
      }
    }
  }
}

const stringify = (x, y) => `${x},${y}`
const parse = (str) => {
  const [x, y] = str.split(',').map(Number)
  return { x, y }
}

const directions = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0]
]

const dijkstra = (start, end, matrix) => {
  const nodes = new Map()
  nodes.set(start, { distance: 0, from: null })

  const pq = [start]
  const visited = new Set()

  while (pq.length > 0) {
    const i = pq.pop()
    const { x, y } = parse(i)

    for (const [dx, dy] of directions) {
      const cell = matrix?.[y + dy]?.[x + dx]
      if (!cell) continue

      const j = stringify(x + dx, y + dy)
      if (!nodes.has(j)) nodes.set(j, { distance: Infinity, from: null })

      const _j = nodes.get(j)
      const _i = nodes.get(i)

      if (_j.distance > (_i.distance + cell)) {
        _j.distance = (_i.distance + cell)
        _j.from = i

        let added = false
        for (let idx = 0; idx < pq.length; idx++) {
          if (_j.distance >= nodes.get(pq[idx]).distance) {
            pq.splice(idx, 0, j)
            added = true
            break
          }
        }

        if (!added) pq.push(j)
      }
    }

    visited.add(i)
  }

  return nodes.get(end).distance
}

const start = stringify(0, 0)
const endA = stringify(aMatrix[0].length - 1, aMatrix.length - 1)
const endB = stringify(bMatrix[0].length - 1, bMatrix.length - 1)

console.log('Part 1: ' + dijkstra(start, endA, aMatrix))
console.log('Part 2: ' + dijkstra(start, endB, bMatrix))
