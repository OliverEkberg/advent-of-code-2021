const fs = require('fs')
const input = fs
  .readFileSync('data.txt', 'utf8')

const parsed = /target area: x=([-\d]+)..([-\d]+), y=([-\d]+)..([-\d]+)/.exec(input).map(Number)

const targetX = parsed.slice(1, 3)
const targetY = parsed.slice(3, 5)

const inRange = (nbr, range) => {
  return nbr >= Math.min(...range) && nbr <= Math.max(...range)
}

const moveX = (speed) => {
  let coord = 0
  let step = 0
  const steps = []

  while (speed !== 0) {
    coord += speed
    step++

    if (speed > 0) speed -= 1
    if (speed < 0) speed += 1

    if (inRange(coord, targetX)) {
      if (speed !== 0) {
        steps.push(step)
      } else {
        // This is just an number large enough to include all further thinkable steps
        for (let s = step; s < step + 1000; s++) {
          steps.push(s)
        }
      }
    }
  }

  return steps
}

const moveY = (speed) => {
  let coord = 0
  let maxY = 0
  let step = 0
  const steps = []

  while (coord >= Math.min(...targetY)) {
    coord += speed
    maxY = Math.max(maxY, coord)
    step++

    if (inRange(coord, targetY)) {
      steps.push(step)
    }

    speed -= 1
  }

  return { steps, maxY }
}

const xSteps = new Map()

for (let xv = 0; xv <= Math.max(...targetX); xv++) {
  for (const step of moveX(xv)) {
    if (!xSteps.has(step)) xSteps.set(step, [])
    xSteps.get(step).push(xv)
  }
}

const startingVectors = new Set()
let globalYMax = -Infinity

for (let yv = Math.min(...targetY); yv <= Math.abs(Math.min(...targetY)); yv++) {
  const { steps, maxY } = moveY(yv)

  for (const step of steps) {
    const validXV = xSteps.get(step)
    if (!validXV) continue

    globalYMax = Math.max(globalYMax, maxY)

    for (const xv of validXV) {
      startingVectors.add(`${xv},${yv}`)
    }
  }
}

console.log('Part 1: ' + globalYMax)
console.log('Part 2: ' + startingVectors.size)
