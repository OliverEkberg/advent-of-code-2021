const fs = require('fs')
let [numbers, ...boards] = fs.readFileSync('data.txt', 'utf8')
  .split('\n\n')

numbers = numbers.split(',').map(Number)
boards = boards.map(board => {
  const rows = board
    .split('\n')
    .map(row => row.split(' '))

  return rows.map(row => {
    return row
      .filter(r => r !== '')
      .map(Number)
  })
})

const hasBingo = (board, calledNumbers) => {
  // Check rows
  for (const row of board) {
    if (row.every(nbr => calledNumbers.has(nbr))) return true
  }

  // Check cols
  for (const colIdx in board[0]) {
    if (board.every(row => calledNumbers.has(row[colIdx]))) return true
  }

  return false
}

// Ordered in order of getting bingo
const boardScores = []
const called = new Set()

for (const number of numbers) {
  called.add(number)

  for (const board of boards) {
    if (hasBingo(board, called)) {
      const sumUnmarked = board.reduce((acc, row) => {
        return acc + row
          .filter(val => !called.has(val))
          .reduce((a, c) => a + c, 0)
      }, 0)

      boardScores.push(sumUnmarked * number)
      boards = boards.filter(b => b !== board)
    }
  }
}

console.log('A: ' + boardScores.at(0))
console.log('B: ' + boardScores.at(-1))
