const fs = require('fs')
const data = fs.readFileSync('data.txt', 'utf8')
  .split('\n')
  .map(row => row.split(''))
  .map(row => row.map(Number))

const histogram = arr => {
  const hist = new Map()
  for (const val of arr) {
    hist.set(val, (hist.get(val) ?? 0) + 1)
  }

  return hist
}

const toDecimal = bits => parseInt(bits.join(''), 2)

const g = []
const e = []

// All rows are of same length
for (const colIdx in data[0]) {
  const currentBits = data.map(row => row[colIdx])
  const hist = histogram(currentBits)

  if (hist.get(0) > hist.get(1)) {
    g.push(1)
    e.push(0)
  } else {
    g.push(0)
    e.push(1)
  }
}

console.log(toDecimal(g) * toDecimal(e))
