const fs = require('fs')
const lines = fs
  .readFileSync('data.txt', 'utf8')
  .split('\n')

const map = new Map()

for (const line of lines) {
  const [from, to] = line.split('-')

  if (!map.has(from)) {
    map.set(from, [])
  }

  if (!map.has(to)) {
    map.set(to, [])
  }

  map.get(from).push(to)
  map.get(to).push(from)
}

let numPaths = 0

const dfs = (isPart1, from = 'start', to = 'end', path = [from], visitedSmallTwice = false) => {
  if (!map.has(from)) return

  for (const p of map.get(from)) {
    const _path = [...path, p]

    if (p === to) {
      numPaths++
    } else if ((p.toUpperCase() === p) || !path.includes(p)) {
      dfs(isPart1, p, to, _path, visitedSmallTwice)
    } else if (!isPart1 && !visitedSmallTwice && p.toLowerCase() === p && p !== 'start') {
      dfs(isPart1, p, to, _path, true)
    }
  }
}

dfs(true)
console.log('Part 1: ' + numPaths)

numPaths = 0

dfs(false)
console.log('Part 2: ' + numPaths)
