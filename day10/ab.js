const fs = require('fs')
const lines = fs
  .readFileSync('data.txt', 'utf8')
  .split('\n')

const pairs = new Map([
  ['<', '>'],
  ['[', ']'],
  ['{', '}'],
  ['(', ')']
])

const pointMapA = new Map([
  [')', 3],
  [']', 57],
  ['}', 1197],
  ['>', 25137]
])

const pointMapB = new Map([
  [')', 1],
  [']', 2],
  ['}', 3],
  ['>', 4]
])

let pointsA = 0
const scoresB = []

for (const line of lines) {
  const history = []

  let valid = true

  for (const char of line) {
    if (pairs.has(char)) {
      history.push(char)
    } else {
      if (pairs.get(history.at(-1)) === char) {
        history.pop()
      } else {
        pointsA += pointMapA.get(char)
        valid = false
        break
      }
    }
  }

  if (valid) {
    const missing = history
      .reverse()
      .map(char => pairs.get(char))

    let score = 0
    for (const char of missing) {
      score *= 5
      score += pointMapB.get(char)
    }

    scoresB.push(score)
  }
}

console.log('Part 1: ' + pointsA)

scoresB.sort((a, b) => a - b)

const middleScore = scoresB[Math.floor(scoresB.length / 2)]
console.log('Part 2: ' + middleScore)
