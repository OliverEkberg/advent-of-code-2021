const fs = require('fs')
const data = fs
  .readFileSync('data.txt', 'utf8')
  .split('\n')
  .map(row => row.split('').map(Number))

const directions = [
  [0, 1], // right
  [1, 0], // down
  [0, -1], // left
  [-1, 0] // up
]

const getKey = (i, j) => `${i}-${j}`

const basin = (i, j, visited = new Set(), result = []) => {
  visited.add(getKey(i, j))
  result.push([i, j])

  const curr = data[i][j]

  for (const [di, dj] of directions) {
    const ci = i + di
    const cj = j + dj
    if (visited.has(getKey(ci, cj))) continue

    const next = data?.[ci]?.[cj]

    if (next !== undefined && next > curr && next !== 9) {
      basin(ci, cj, visited, result)
    }
  }

  return result
}

let sum = 0
const basins = []

for (let i = 0; i < data.length; i++) {
  for (let j = 0; j < data[i].length; j++) {
    const curr = data[i][j]

    const allSmaller = directions.every(([di, dj]) => {
      const neighbour = data?.[i + di]?.[j + dj]

      return neighbour === undefined || curr < neighbour
    })

    if (allSmaller) {
      sum += curr + 1 // For part 1
      basins.push(basin(i, j)) // For part 2
    }
  }
}

console.log('Part 1: ' + sum)

basins.sort((b1, b2) => b2.length - b1.length)

let mul = 1
for (let i = 0; i < 3; i++) {
  mul *= basins[i].length
}

console.log('Part 2: ' + mul)
