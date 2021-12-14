const fs = require('fs')
const [template, rules] = fs
  .readFileSync('data.txt', 'utf8')
  .split('\n\n')

const getDiff = (hist) => {
  const freq = new Map()
  freq.set(template[0], 1)

  for (const [key, count] of hist) {
    freq.set(key[1], (freq.get(key[1]) ?? 0) + count)
  }

  const max = Math.max(...freq.values())
  const min = Math.min(...freq.values())

  return max - min
}

const rulesMap = new Map()

for (const rule of rules.split('\n')) {
  const [, from, to] = /([A-Z]{2}) -> ([A-Z]{1})/.exec(rule)
  rulesMap.set(from, to)
}

let hist = new Map()

for (let i = 0; i < template.length - 1; i++) {
  const key = template.substring(i, i + 2)
  hist.set(key, (hist.get(key) ?? 0) + 1)
}

for (let i = 1; i <= 40; i++) {
  const newHist = new Map()

  for (const [key, count] of hist) {
    const [a, b] = key.split('')
    const c = rulesMap.get(key)

    const keyA = a + c
    const keyB = c + b

    newHist.set(keyA, (newHist.get(keyA) ?? 0) + count)
    newHist.set(keyB, (newHist.get(keyB) ?? 0) + count)
  }

  hist = newHist

  if (i === 10) console.log('Part 1: ' + getDiff(hist))
  if (i === 40) console.log('Part 2: ' + getDiff(hist))
}
