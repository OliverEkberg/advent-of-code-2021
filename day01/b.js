const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8')
  .split('\n')
  .map(row => parseInt(row))

const WINDOW_SIZE = 3

const sumBetweenIdx = (arr, idx1, idx2) => {
  let sum = 0

  for (let i = idx1; i < idx2; i++) {
    sum += arr[i]
  }

  return sum
}

let increases = 0

for (let i = WINDOW_SIZE; i < data.length; i++) {
  const previousSum = sumBetweenIdx(data, i - WINDOW_SIZE, i)
  const currentSum = sumBetweenIdx(data, i - WINDOW_SIZE + 1, i + 1)

  if (currentSum > previousSum) increases++
}

console.log(increases)
