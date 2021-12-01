const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8')
  .split('\n')
  .map(row => parseInt(row))

let increases = 0
let previous = data[0]

for (const depth of data) {
  if (depth > previous) increases++
  previous = depth
}

console.log(increases)
