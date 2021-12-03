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

const find = (keepWithValue) => {
  let rowsLeft = [...data]
  let colIdx = 0

  while (rowsLeft.length > 1) {
    const currentBits = rowsLeft.map(row => row[colIdx])
    const hist = histogram(currentBits)

    const toKeep = keepWithValue(hist)
    rowsLeft = rowsLeft.filter(row => row[colIdx] === toKeep)

    colIdx++
  }

  return rowsLeft[0]
}

console.log(
  toDecimal(find((hist) => hist.get(1) >= hist.get(0) ? 1 : 0)) *
  toDecimal(find((hist) => hist.get(0) <= hist.get(1) ? 0 : 1))
)
