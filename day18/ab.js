const fs = require('fs')
const rows = fs
  .readFileSync('data.txt', 'utf8')
  .split('\n')

const explode = (input) => {
  const lastNumberRx = /^(?<b>.*\D)(?<m>\d+)(?<e>\D*)$/
  const firstNumberRx = /^(?<b>\D*)(?<m>\d+)(?<e>\D.*)$/

  let level = 0
  for (let i = 0; i < input.length; i++) {
    if (input[i] === '[') level++
    if (input[i] === ']') level--

    if (level >= 4) {
      const start = input.substring(0, i + 1)
      const rest = input.substring(i + 1)

      const match = /^(\[\d+,\d+\])(.*)$/.exec(rest)
      if (!match) continue
      const [, strPair, leftover] = match

      const l = start
      const r = leftover
      const pair = JSON.parse(strPair).map(Number)

      const lastNbrMatch = lastNumberRx.exec(l)
      let left = ''
      if (lastNbrMatch) {
        left = lastNbrMatch.groups.b + (Number(lastNbrMatch.groups.m) + pair[0]) + lastNbrMatch.groups.e
      } else {
        left = l
      }

      const firstNbrMatch = firstNumberRx.exec(r)
      let right = ''
      if (firstNbrMatch) {
        right = firstNbrMatch.groups.b + (Number(firstNbrMatch.groups.m) + pair[1]) + firstNbrMatch.groups.e
      } else {
        right = r
      }

      return (left + '0' + right)
    }
  }

  return null
}

const split = (input) => {
  const splitRx = /^(?<b>(\d?(\[|\]|,))*)(?<m>\d{2,})(?<e>.*)$/
  const groups = splitRx.exec(input)?.groups

  if (!groups) return null

  const half = Number(groups.m) / 2
  return groups.b + `[${Math.floor(half)},${Math.ceil(half)}]` + groups.e
}

const reduce = (number) => {
  while (true) {
    const res1 = explode(number)
    if (res1) {
      number = res1
      continue
    }

    const res2 = split(number)
    if (res2) {
      number = res2
      continue
    }

    break
  }

  return number
}

const add = (a, b) => reduce(`[${a},${b}]`)

const magnitude = (str) => {
  const rx = /\[(\d+),(\d+)\]/

  while (true) {
    const match = rx.exec(str)
    if (!match) return Number(str)
    const [whole, a, b] = match
    const value = 3 * Number(a) + 2 * Number(b)

    str = str.replaceAll(whole, value)
  }
}

// Part 1
let sum = rows[0]
for (let i = 1; i < rows.length; i++) {
  sum = add(sum, rows[i])
}

console.log('Part 1: ' + magnitude(sum))

// Part 2
let max = -Infinity
for (const a of rows) {
  for (const b of rows) {
    if (a === b) continue

    max = Math.max(max, magnitude(add(a, b)))
    max = Math.max(max, magnitude(add(b, a)))
  }
}

console.log('Part 2: ' + max)
