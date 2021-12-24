const fs = require('fs')
const [, ...subroutines] = fs
  .readFileSync('data.txt', 'utf8')
  .split('inp w')
  .map(r => r.split('\n').filter(r => !!r))

// Each subroutine is identical, except for 3 constants
const subroutineFactory = (a, b, c) => (w, z) => {
  let x = (z % 26) + b
  z = Math.floor(z / a)
  x = x === w ? 0 : 1
  return (z * ((25 * x) + 1)) + ((w + c) * x)
}

const validDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const solve = (compare) => {
  // key => return value, value => inputs from previous subroutines combined
  let previousReturnInputMap = new Map([[0, '']])
  let previousReturns = new Set([0])

  for (const subroutine of subroutines) {
    const constants = [3, 4, 14].map(idx => Number(subroutine[idx].split(' ')[2]))
    const optimizedSubroutine = subroutineFactory(...constants)

    const returns = new Set()
    const returnInputMap = new Map()

    for (const z of previousReturns) {
      const prevHigh = previousReturnInputMap.get(z)

      for (const w of validDigits) {
        const val = optimizedSubroutine(w, z)
        returns.add(val)

        const str = `${prevHigh}${w}`
        if (!returnInputMap.has(val)) {
          returnInputMap.set(val, str)
        } else {
          const nbr = Number(returnInputMap.get(val))
          if (compare(nbr, Number(str))) {
            returnInputMap.set(val, str)
          }
        }
      }
    }

    previousReturnInputMap = returnInputMap
    previousReturns = returns
  }

  return previousReturnInputMap.get(0)
}

console.log('Part 1: ' + solve((a, b) => a < b))
console.log('Part 2: ' + solve((a, b) => a > b))
