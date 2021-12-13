const fs = require('fs')
const data = fs
  .readFileSync('data.txt', 'utf8')
  .split('\n\n')

const stringifyCoord = (x, y) => `${x},${y}`
const parseCoord = (key) => key.split(',').map(Number)

let points = new Set()

const [rows, commands] = data

for (const row of rows.split('\n')) {
  const [x, y] = row.split(',').map(Number)
  points.add(stringifyCoord(x, y))
}

let firstFold = true
for (const command of commands.split('\n')) {
  let [, axis, value] = /^fold along ([xy])=(\d+)$/.exec(command)
  value = Number(value)

  const newPoints = new Set()

  for (const point of points) {
    const [x, y] = parseCoord(point)

    if (axis === 'y') {
      if (y < value) {
        newPoints.add(point)
      } else {
        newPoints.add(stringifyCoord(x, value * 2 - y))
      }
    } else {
      if (x < value) {
        newPoints.add(point)
      } else {
        newPoints.add(stringifyCoord(value * 2 - x, y))
      }
    }
  }

  points = newPoints

  if (firstFold) {
    console.log('Part 1: ' + points.size)
    firstFold = false
  }
}

const maxX = Math.max(...Array.from(points).map(p => parseCoord(p)[0]))
const maxY = Math.max(...Array.from(points).map(p => parseCoord(p)[1]))

const matrix = new Array(maxY + 1)
for (let i = 0; i < matrix.length; i++) {
  matrix[i] = new Array(maxX + 1).fill(' ')
}

for (const point of points) {
  const [x, y] = parseCoord(point)
  matrix[y][x] = '#'
}

console.log('Part 2:')
for (const row of matrix) {
  console.log(row.join(''))
}
