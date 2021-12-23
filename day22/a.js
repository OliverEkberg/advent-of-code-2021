const fs = require('fs')
const input = fs
  .readFileSync('data.txt', 'utf8')
  .split('\n')

const inputRx = /^(on|off) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)$/

const MAX = 50
const MIN = -50

const on = new Set()

const toStr = (x, y, z) => `${x},${y},${z}`

for (const row of input) {
  let [, state, fromX, toX, fromY, toY, fromZ, toZ] = inputRx.exec(row)
  state = state === 'on'
  ;[fromX, toX, fromY, toY, fromZ, toZ] = [fromX, toX, fromY, toY, fromZ, toZ].map(Number)

  for (let x = Math.max(MIN, fromX); x <= Math.min(MAX, toX); x++) {
    for (let y = Math.max(MIN, fromY); y <= Math.min(MAX, toY); y++) {
      for (let z = Math.max(MIN, fromZ); z <= Math.min(MAX, toZ); z++) {
        const key = toStr(x, y, z)
        if (state) on.add(key)
        else on.delete(key)
      }
    }
  }
}

console.log(on.size)
