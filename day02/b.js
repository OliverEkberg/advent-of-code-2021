const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8').split('\n')

const rx = /(forward|down|up) (\d+)/

let horizontal = 0
let depth = 0
let aim = 0

for (const command of data) {
  let [, direction, distance] = command.match(rx)
  distance = parseInt(distance)

  if (direction === 'down') aim += distance
  if (direction === 'up') aim -= distance
  if (direction === 'forward') {
    horizontal += distance
    depth += aim * distance
  }
}

console.log(horizontal * depth)
