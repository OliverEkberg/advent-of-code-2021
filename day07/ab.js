const fs = require('fs')
const data = fs
  .readFileSync('data.txt', 'utf8')
  .split(',')
  .map((row) => parseInt(row))

const minPos = Math.min(...data)
const maxPos = Math.max(...data)

let best = Infinity

// Uncomment this for A
// const computeCost = (pos1, pos2) => Math.abs(pos1 - pos2)
// Uncomment this for B
const computeCost = (pos1, pos2) => {
  const diff = Math.abs(pos1 - pos2)
  return (diff * (1 + diff)) / 2
}

for (let proposedPos = minPos; proposedPos <= maxPos; proposedPos++) {
  let totalFuel = 0

  for (const pos of data) {
    totalFuel += computeCost(pos, proposedPos)
  }

  if (totalFuel < best) best = totalFuel
}

console.log(best)
