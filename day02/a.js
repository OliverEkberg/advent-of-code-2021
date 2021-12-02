const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8').split('\n')

const rx = /(forward|down|up) (\d+)/

let horizontal = 0
let depth = 0

for (const command of data) {
  let [, direction, distance] = command.match(rx)
  distance = parseInt(distance)

  if (direction === 'forward') horizontal += distance
  if (direction === 'down') depth += distance
  if (direction === 'up') depth -= distance
}

console.log(horizontal * depth)
