const fs = require('fs')
const input = fs
  .readFileSync('data.txt', 'utf8')
  .split('\n')
  .map(row => row.split(''))

const copyMatrix = (matrix) => matrix.map(row => [...row])

const EMPTY = '.'
const WALL = '#'

const toStr = (x, y) => `${x},${y}`
const fromStr = (str) => str.split(',').map(Number)

const TYPE_DETAILS = {
  A: { SIDE_ROOM: 3, COST: 1 },
  B: { SIDE_ROOM: 5, COST: 10 },
  C: { SIDE_ROOM: 7, COST: 100 },
  D: { SIDE_ROOM: 9, COST: 1000 }
}

const DIRECTIONS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0]
]

const isDone = matrix => {
  for (const type in TYPE_DETAILS) {
    let y = 2
    while (matrix[y + 1][TYPE_DETAILS[type].SIDE_ROOM] !== WALL) {
      if (matrix[y][TYPE_DETAILS[type].SIDE_ROOM] !== type) return false
      y++
    }
  }

  return true
}

const getReachablePositions = (matrix, [_x, _y], cost = 0, visited = new Map()) => {
  visited.set(toStr(_x, _y), cost)

  const neighbours = DIRECTIONS.map(([dx, dy]) => [dx + _x, dy + _y])

  for (const [x, y] of neighbours) {
    if (visited.has(toStr(x, y)) || matrix[y][x] !== EMPTY) continue
    getReachablePositions(matrix, [x, y], cost + 1, visited)
  }

  return visited
}

const getValidMoves = (matrix, [x, y]) => {
  const type = matrix[y][x]
  const isHallway = y === 1

  // If amphipod already in correct side room and not blocking anyone
  if (!isHallway) {
    if (x === TYPE_DETAILS[type].SIDE_ROOM) {
      let prevCorrect = true
      for (let _y = y + 1; _y < matrix.length - 1; _y++) {
        prevCorrect &&= matrix[_y][x] === type
      }

      if (prevCorrect) return new Map()
    }
  }

  const reachablePos = getReachablePositions(matrix, [x, y])

  // Cannot stay in current pos
  reachablePos.delete(toStr(x, y))

  // Cannot stay in front of side room in hallway
  for (const _type in TYPE_DETAILS) {
    reachablePos.delete(toStr(TYPE_DETAILS[_type].SIDE_ROOM, 1))
  }

  // If in hallway, only allow moving to deepest, non-occupied part of correct side room if it is not blocked
  if (isHallway) {
    const hx = TYPE_DETAILS[type].SIDE_ROOM

    let prevCorrect = true
    for (let _y = matrix.length - 2; _y > 1 && prevCorrect; _y--) {
      const potentialPos = toStr(hx, _y)
      if (reachablePos.has(potentialPos)) return new Map([[potentialPos, reachablePos.get(potentialPos)]])
      prevCorrect &&= matrix[_y][hx] === type
    }

    return new Map()
  } else {
    // If in side room, only allow moving into hallway (Y = 1)
    return new Map(
      Array.from(reachablePos.entries())
        .filter(([key]) => fromStr(key)[1] === 1)
    )
  }
}

const cache = new Map()

const recurse = (matrix) => {
  const key = matrix.map(row => row.join('')).join('')
  if (cache.has(key)) return cache.get(key)

  if (isDone(matrix)) {
    cache.set(key, 0)
    return 0
  }

  let lowestCost = Infinity

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] in TYPE_DETAILS) { // Found amphipod
        for (const [coord, cost] of getValidMoves(matrix, [x, y])) {
          const [toX, toY] = fromStr(coord)

          const _matrix = copyMatrix(matrix)

          const val = _matrix[y][x]
          _matrix[y][x] = EMPTY
          _matrix[toY][toX] = val

          const partialCost = cost * TYPE_DETAILS[val].COST + recurse(_matrix)
          lowestCost = Math.min(lowestCost, partialCost)
        }
      }
    }
  }

  cache.set(key, lowestCost)
  return lowestCost
}

console.log('Part 1: ' + recurse(input))

const input2 = [
  ...input.slice(0, 3),
  '  #D#C#B#A#'.split(''),
  '  #D#B#A#C#'.split(''),
  ...input.slice(3)
]

console.log('Part 2: ' + recurse(input2))
