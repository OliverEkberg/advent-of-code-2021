const fs = require('fs')
const input = fs
  .readFileSync('data.txt', 'utf8')

const hexMap = {
  0: '0000',
  1: '0001',
  2: '0010',
  3: '0011',
  4: '0100',
  5: '0101',
  6: '0110',
  7: '0111',
  8: '1000',
  9: '1001',
  A: '1010',
  B: '1011',
  C: '1100',
  D: '1101',
  E: '1110',
  F: '1111'
}

const op = (typeId, vals) => {
  switch (typeId) {
    case 0:
      return vals.reduce((acc, curr) => acc + curr, 0)
    case 1:
      return vals.reduce((acc, curr) => acc * curr, 1)
    case 2:
      return Math.min(...vals)
    case 3:
      return Math.max(...vals)
    case 5:
      return vals[0] > vals[1] ? 1 : 0
    case 6:
      return vals[0] < vals[1] ? 1 : 0
    case 7:
      return vals[0] === vals[1] ? 1 : 0
  }
}

const COMMON_HEADER_SIZE = 6
const LENGTH_TYPE_ID_HEADER_SIZE = 1
const LENGTH_0_HEADER_SIZE = 15
const LENGTH_1_HEADER_SIZE = 11
const CHUNK_SIZE = 4
const CHUNK_PADDING = 1

let binaryInputStr = ''
for (const char of input) {
  binaryInputStr += hexMap[char]
}

let versionSum = 0

function parse (binaryStr) {
  const version = parseInt(binaryStr.slice(0, 3), 2)
  const typeId = parseInt(binaryStr.slice(3, 6), 2)

  versionSum += version

  if (typeId === 4) {
    const payload = binaryStr.slice(COMMON_HEADER_SIZE)

    let idx = 0
    let bits = ''
    while (true) {
      const chunk = payload.slice(idx, idx + CHUNK_PADDING + CHUNK_SIZE)
      bits += chunk.slice(CHUNK_PADDING)

      idx += CHUNK_PADDING + CHUNK_SIZE
      if (chunk[0] === '0') break
    }

    return [parseInt(bits, 2), COMMON_HEADER_SIZE + idx]
  } else {
    const lengthTypeId = parseInt(binaryStr.slice(COMMON_HEADER_SIZE, COMMON_HEADER_SIZE + LENGTH_TYPE_ID_HEADER_SIZE), 2)

    if (lengthTypeId === 0) {
      const subPkgsLen = parseInt(binaryStr.slice(COMMON_HEADER_SIZE + LENGTH_TYPE_ID_HEADER_SIZE, COMMON_HEADER_SIZE + LENGTH_TYPE_ID_HEADER_SIZE + LENGTH_0_HEADER_SIZE), 2)
      const payload = binaryStr.slice(COMMON_HEADER_SIZE + LENGTH_TYPE_ID_HEADER_SIZE + LENGTH_0_HEADER_SIZE, COMMON_HEADER_SIZE + LENGTH_TYPE_ID_HEADER_SIZE + LENGTH_0_HEADER_SIZE + subPkgsLen)

      const vals = []
      let idx = 0
      while (idx < payload.length) {
        const [val, movedIdx] = parse(payload.slice(idx))
        idx += movedIdx
        vals.push(val)
      }

      return [op(typeId, vals), COMMON_HEADER_SIZE + LENGTH_TYPE_ID_HEADER_SIZE + LENGTH_0_HEADER_SIZE + idx]
    } else {
      const numPkgs = parseInt(binaryStr.slice(COMMON_HEADER_SIZE + LENGTH_TYPE_ID_HEADER_SIZE, COMMON_HEADER_SIZE + LENGTH_TYPE_ID_HEADER_SIZE + LENGTH_1_HEADER_SIZE), 2)
      const payload = binaryStr.slice(COMMON_HEADER_SIZE + LENGTH_TYPE_ID_HEADER_SIZE + LENGTH_1_HEADER_SIZE)

      const vals = []
      let idx = 0
      while (vals.length < numPkgs) {
        const [val, movedIdx] = parse(payload.slice(idx))
        idx += movedIdx
        vals.push(val)
      }

      return [op(typeId, vals), COMMON_HEADER_SIZE + LENGTH_TYPE_ID_HEADER_SIZE + LENGTH_1_HEADER_SIZE + idx]
    }
  }
}

const [value] = parse(binaryInputStr)
console.log('Part 1: ' + versionSum)
console.log('Part 2: ' + value)
