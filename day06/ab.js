const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8')
  .split(',')
  .map(row => parseInt(row))

const DAYS = [80, 256]
const RESET_TIMER = 6
const NEWBORN_TIMER = 8

const incHistogram = (hist, value, inc) => {
  hist.set(value, (hist.get(value) ?? 0) + inc)
}

for (const MAX_DAY of DAYS) {
  let state = new Map()

  for (const value of data) {
    incHistogram(state, value, 1)
  }

  for (let i = 0; i < MAX_DAY; i++) {
    const nextState = new Map()

    for (const [value, num] of state) {
      if (value === 0) {
        incHistogram(nextState, NEWBORN_TIMER, num)
      }

      const nextValue = value === 0 ? RESET_TIMER : value - 1
      incHistogram(nextState, nextValue, num)
    }

    state = nextState
  }

  let popSize = 0
  for (const num of state.values()) {
    popSize += num
  }

  console.log(`After ${MAX_DAY} days: ${popSize}`)
}
