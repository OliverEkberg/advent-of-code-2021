const fs = require('fs')
const data = fs
  .readFileSync('data.txt', 'utf8')
  .split('\n')

// key => digit, value => num segments required to display the digit
const digitSegmentCountMap = new Map([
  [1, 2],
  [4, 4],
  [7, 3],
  [8, 7]
])

const segmentCounts = Array.from(digitSegmentCountMap.values())

let count = 0

for (const row of data) {
  const [, output] = row.split(' | ')

  for (const outputStr of output.split(' ')) {
    if (segmentCounts.includes(outputStr.length)) count++
  }
}

console.log(count)
