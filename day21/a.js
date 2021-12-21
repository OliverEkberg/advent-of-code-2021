const fs = require('fs')
const input = fs
  .readFileSync('data.txt', 'utf8')
  .split('\n')

const inputRx = /^Player \d+ starting position: (\d+)$/

const pawns = input.map(row => {
  const [, pos] = inputRx.exec(row)
  return { pos: Number(pos), score: 0 }
})

const DIE_MAX = 100
const ROLLS = 3
const NUM_POSITIONS = 10
const WINNING_SCORE = 1000

let die = DIE_MAX
let dieRolls = 0

let turn = 0

while (pawns.every(pawn => pawn.score < WINNING_SCORE)) {
  let sum = 0

  for (let i = 0; i < ROLLS; i++) {
    die = die + 1 > DIE_MAX ? 1 : die + 1
    dieRolls++
    sum += die
  }

  pawns[turn].pos += sum % NUM_POSITIONS
  if (pawns[turn].pos > NUM_POSITIONS) pawns[turn].pos -= NUM_POSITIONS
  pawns[turn].score += pawns[turn].pos

  turn = (turn + 1) % pawns.length
}

const scores = pawns.map(pawn => pawn.score)
console.log(Math.min(...scores) * dieRolls)
