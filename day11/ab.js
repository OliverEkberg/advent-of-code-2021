const fs = require('fs')
const matrix = fs
  .readFileSync('data.txt', 'utf8')
  .split('\n')
  .map(row => row.split('').map(Number))

const BLINK_POINT = 10

const incAll = () => {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      matrix[i][j] = matrix[i][j] + 1
    }
  }
}

const getKey = (i, j) => `${i}-${j}`

let visited = new Set()
const recurse = (i, j) => {
  if (visited.has(getKey(i, j))) return

  if (matrix[i][j] < BLINK_POINT) return
  visited.add(getKey(i, j))

  for (let y = Math.max(i - 1, 0); y <= Math.min(i + 1, matrix.length - 1); y++) {
    for (let x = Math.max(j - 1, 0); x <= Math.min(j + 1, matrix[y].length - 1); x++) {
      matrix[y][x] = matrix[y][x] + 1
      recurse(y, x)
    }
  }
}

let totalFlashes = 0
let itr = 0
while (true) {
  itr++
  visited = new Set()
  incAll()

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] >= BLINK_POINT) {
        recurse(i, j)
      }
    }
  }

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] >= BLINK_POINT) {
        matrix[i][j] = 0
        totalFlashes++
      }
    }
  }

  if (itr === 100) console.log('Part 1: ' + totalFlashes)

  const allZero = matrix.every(row => row.every(cell => cell === 0))
  if (allZero) {
    console.log('Part 2: ' + itr)
    break
  }
}
