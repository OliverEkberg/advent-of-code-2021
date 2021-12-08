const fs = require('fs')
const data = fs
  .readFileSync('data.txt', 'utf8')
  .split('\n')

const intersect = (setA, setB) => {
  const ret = new Set()
  for (const el of setA) {
    if (setB.has(el)) ret.add(el)
  }
  return ret
}

// key => segments making up a digit, value => the digit
const segmentsDigitMap = new Map([
  ['abcefg', 0],
  ['cf', 1],
  ['acdeg', 2],
  ['acdfg', 3],
  ['bcdf', 4],
  ['abdfg', 5],
  ['abdefg', 6],
  ['acf', 7],
  ['abcdefg', 8],
  ['abcdfg', 9]
])

// key => times segment(s) appear, value => segment(s)
const countSegmentsMap = new Map([
  [9, 'f'],
  [6, 'b'],
  [4, 'e'],
  [8, 'ac'],
  [7, 'dg']
])

// key => num segments, value => segment combo of inferred digit
const lengthSegmentMap = new Map([
  [2, 'cf'],
  [3, 'cfa'],
  [4, 'cfdb'],
  [7, 'abcdefg']
])

let sum = 0

for (const row of data) {
  const [segmentCombosStr, outputsStr] = row.split(' | ')

  const segmentCombos = segmentCombosStr.split(' ')
  const outputs = outputsStr.split(' ')

  // key => segment, value => mixedSegment candidates
  const candidates = new Map(
    'abcdefg'.split('').map(seg => [seg, new Set()])
  )

  // key => segment, value => num times segment is used
  const segmentCounts = new Map()
  for (const segmentCombo of segmentCombos) {
    for (const segment of segmentCombo) {
      segmentCounts.set(segment, (segmentCounts.get(segment) ?? 0) + 1)
    }
  }

  // Use segment counts to narrow down candidates
  for (const [segment, count] of segmentCounts) {
    for (const potentialSegment of countSegmentsMap.get(count)) {
      candidates.get(potentialSegment).add(segment)
    }
  }

  for (const segmentCombo of segmentCombos) {
    if (lengthSegmentMap.has(segmentCombo.length)) {
      for (const segment of lengthSegmentMap.get(segmentCombo.length)) {
        const segmentCandidates = candidates.get(segment)
        const newSegmentCandidates = intersect(segmentCandidates, new Set(segmentCombo))
        candidates.set(segment, newSegmentCandidates)

        if (newSegmentCandidates.size === 1 && segmentCandidates.size > 1) {
          for (const [otherSegment, otherCandidates] of candidates) {
            if (segment === otherSegment) continue
            otherCandidates.delete(Array.from(newSegmentCandidates)[0])
          }
        }
      }
    }
  }

  // key => mixedSegment, value => segment
  const segmentMap = new Map()
  for (const [segment, mixedSegments] of candidates) {
    segmentMap.set(Array.from(mixedSegments)[0], segment) // There should only be one candidate for each
  }

  const digits = []

  for (const segments of outputs) {
    const translated = [...segments]
      .map(segment => segmentMap.get(segment))
      .sort()
      .join('')

    digits.push(segmentsDigitMap.get(translated))
  }

  sum += Number(digits.join(''))
}

console.log(sum)
