const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8')
  .split('\n')

const lines = []

for (const row of data) {
  const [, x1, y1, x2, y2] = /^(\d+),(\d+) -> (\d+),(\d+)$/.exec(row).map(Number)
  lines.push([[x1, y1], [x2, y2]])
}

const getLinePoints = (x1, y1, x2, y2) => {
  const dx = Math.sign(x2 - x1)
  const dy = Math.sign(y2 - y1)

  const pts = [[x1, y1]]
  let x = x1
  let y = y1

  while (x !== x2 || y !== y2) {
    x += dx
    y += dy
    pts.push([x, y])
  }

  return pts
}

const fakeMatrix = new Map()
const getKey = (x, y) => `${x}-${y}`

// Uncomment this for A
// const keepLine = ([[x1, y1], [x2, y2]]) => x1 === x2 || y1 === y2
// Uncomment this for B
const keepLine = () => true

for (const [[x1, y1], [x2, y2]] of lines.filter(keepLine)) {
  for (const [x, y] of getLinePoints(x1, y1, x2, y2)) {
    const key = getKey(x, y)

    fakeMatrix.set(key, (fakeMatrix.get(key) ?? 0) + 1)
  }
}

let numOverlapping = 0
for (const cell of fakeMatrix.values()) {
  if (cell >= 2) numOverlapping++
}

console.log(numOverlapping)
