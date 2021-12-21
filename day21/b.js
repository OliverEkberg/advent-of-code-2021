const fs = require('fs')
const input = fs
  .readFileSync('data.txt', 'utf8')
  .split('\n')

const inputRx = /^Player \d+ starting position: (\d+)$/

const pawns = input.map(row => {
  const [, pos] = inputRx.exec(row)
  return { pos: Number(pos), score: 0 }
})

const memoize = (func) => {
  const cache = new Map()

  return (...args) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)

    const value = func(...args)
    cache.set(key, value)

    return value
  }
}

const NUM_POSITIONS = 10
const WINNING_SCORE = 21
const OUTCOMES = [1, 2, 3]

const recurse = memoize((pawns, turn) => {
  const pawnId = pawns.findIndex(pawn => pawn.score >= WINNING_SCORE)
  if (pawnId !== -1) return new Map([[pawnId, 1]])

  const pawnWins = new Map()

  for (const o1 of OUTCOMES) {
    for (const o2 of OUTCOMES) {
      for (const o3 of OUTCOMES) {
        const clonedPawns = pawns.map(pawn => ({ ...pawn }))
        const toMove = (o1 + o2 + o3) % NUM_POSITIONS

        clonedPawns[turn].pos += toMove
        if (clonedPawns[turn].pos > NUM_POSITIONS) clonedPawns[turn].pos -= NUM_POSITIONS
        clonedPawns[turn].score += clonedPawns[turn].pos

        for (const [pawnId, numWins] of recurse(clonedPawns, (turn + 1) % pawns.length)) {
          pawnWins.set(pawnId, (pawnWins.get(pawnId) ?? 0) + numWins)
        }
      }
    }
  }

  return pawnWins
})

const wins = recurse(pawns, 0).values()
console.log(Math.max(...wins))
