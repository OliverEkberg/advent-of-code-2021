const fs = require('fs')
const input = fs
  .readFileSync('data.txt', 'utf8')
  .split('\n')

const inputRx = /^(on|off) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)$/

const steps = []
for (const row of input) {
  let [, state, fromX, toX, fromY, toY, fromZ, toZ] = inputRx.exec(row)
  ;[fromX, toX, fromY, toY, fromZ, toZ] = [fromX, toX, fromY, toY, fromZ, toZ].map(Number)

  steps.push({ fromX, toX, fromY, toY, fromZ, toZ, on: state === 'on' })
}

const volume = (a) => {
  return Math.abs(a.toX - a.fromX + 1) * Math.abs(a.toY - a.fromY + 1) * Math.abs(a.toZ - a.fromZ + 1)
}

const intersects = (a, b) => {
  return a.fromX <= b.toX && a.toX >= b.fromX &&
  a.fromY <= b.toY && a.toY >= b.fromY &&
  a.fromZ <= b.toZ && a.toZ >= b.fromZ
}

const split = (a, b) => {
  const parts = []

  // Top
  if (a.toY > b.toY) {
    parts.push({ ...a, fromY: b.toY + 1 })
  }

  // Bottom
  if (a.fromY < b.fromY) {
    parts.push({ ...a, toY: b.fromY - 1 })
  }

  // Left
  const yRange = { fromY: Math.max(a.fromY, b.fromY), toY: Math.min(a.toY, b.toY) }
  if (a.fromX < b.fromX) {
    parts.push({ ...a, ...yRange, toX: b.fromX - 1 })
  }

  // Right
  if (a.toX > b.toX) {
    parts.push({ ...a, ...yRange, fromX: b.toX + 1 })
  }

  const xRange = { fromX: Math.max(a.fromX, b.fromX), toX: Math.min(a.toX, b.toX) }

  // Back
  if (a.fromZ < b.fromZ) {
    parts.push({ ...a, ...yRange, ...xRange, toZ: b.fromZ - 1 })
  }

  // Front
  if (a.toZ > b.toZ) {
    parts.push({ ...a, ...yRange, ...xRange, fromZ: b.toZ + 1 })
  }

  return parts
}

const runSteps = (steps) => {
  let population = []

  for (const a of steps) {
    const _population = []

    for (const b of population) {
      if (intersects(a, b)) {
        _population.push(...split(b, a))
      } else {
        _population.push(b)
      }
    }

    if (a.on) _population.push(a)

    population = _population
  }

  return population.reduce((sum, curr) => sum + volume(curr), 0)
}

const MIN = -50
const MAX = 50

const part1Steps = steps.filter(step => {
  return step.fromX >= MIN && step.fromY >= MIN && step.fromY >= MIN &&
  step.toX <= MAX && step.toY <= MAX && step.toY <= MAX
})

console.log('Part 1: ' + runSteps(part1Steps))
console.log('Part 2: ' + runSteps(steps))
