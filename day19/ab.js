const fs = require('fs')
const input = fs
  .readFileSync('data.txt', 'utf8')
  .split('\n\n')
  .map(row => row.split('\n'))

const toStr = (coord) => `${coord.x},${coord.y},${coord.z}`

const fromStr = (str) => {
  const [x, y, z] = str.split(',').map(Number)
  return { x, y, z }
}

const add = (a, b) => {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z }
}

const subtract = (a, b) => {
  return { x: b.x - a.x, y: b.y - a.y, z: b.z - a.z }
}

const manhattanDistance = (a, b) => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z)
}

const getPotentialOffset = (aBeacons, bBeacons) => {
  const offsets = new Map()

  // Compute all candidate offsets
  for (const aBeacon of aBeacons) {
    for (const bBeacon of bBeacons) {
      const offset = toStr(subtract(aBeacon, bBeacon))
      offsets.set(offset, (offsets.get(offset) ?? 0) + 1)
    }
  }

  // Find most frequent offset
  let maxOffset = null
  let maxOccurrences = -Infinity

  for (const [offset, occurrences] of offsets) {
    if (occurrences > maxOccurrences) {
      maxOccurrences = occurrences
      maxOffset = offset
    }
  }

  return [maxOffset, maxOccurrences]
}

const getRotations = (points) => {
  // [cos, sin] for 0, 90, 180 and 270 degrees
  const convertedAngles = [[1, 0], [0, 1], [-1, 0], [-0, -1]]

  const uniqueRotations = []

  let j = 0
  for (const [cosB, sinB] of convertedAngles) {
    for (const [cosC, sinC] of convertedAngles) {
      for (const [cosA, sinA] of convertedAngles) {
        j++
        // In total there are 64 permutations, but only some (24) are unique
        if (!(j < 21 || (j > 48 && j < 53))) continue

        const Axx = cosA * cosB
        const Axy = cosA * sinB * sinC - sinA * cosC
        const Axz = cosA * sinB * cosC + sinA * sinC

        const Ayx = sinA * cosB
        const Ayy = sinA * sinB * sinC + cosA * cosC
        const Ayz = sinA * sinB * cosC - cosA * sinC

        const Azx = -sinB
        const Azy = cosB * sinC
        const Azz = cosB * cosC

        const rotatedPoints = points.map(point => {
          const { x: px, y: py, z: pz } = point

          return {
            x: Axx * px + Axy * py + Axz * pz,
            y: Ayx * px + Ayy * py + Ayz * pz,
            z: Azx * px + Azy * py + Azz * pz
          }
        })

        uniqueRotations.push(rotatedPoints)
      }
    }
  }

  return uniqueRotations
}

const scannerInputs = []
for (const [, ...beacons] of input) {
  scannerInputs.push(beacons.map(b => fromStr(b)))
}

let [scanner0, ...notFoundScanners] = scannerInputs

const foundScanners = new Map()
foundScanners.set('0,0,0', scanner0)

let potentiallyMatchingScanners = [scanner0]

while (notFoundScanners.length > 0) {
  const _notFoundScanners = []
  const _potentiallyMatchingScanners = []

  notFoundScannersLoop:
  for (const scanner of notFoundScanners) {
    for (const rotatedScanner of getRotations(scanner)) {
      for (const potentiallyMatchingScanner of potentiallyMatchingScanners) {
        const [strOffset, offsetOccurrences] = getPotentialOffset(rotatedScanner, potentiallyMatchingScanner)

        if (offsetOccurrences >= 12) {
          const offset = fromStr(strOffset)
          const offsetBeaconLocations = rotatedScanner.map(beacon => add(beacon, offset))

          foundScanners.set(strOffset, offsetBeaconLocations)
          _potentiallyMatchingScanners.push(offsetBeaconLocations)

          continue notFoundScannersLoop
        }
      }
    }

    _notFoundScanners.push(scanner)
  }

  notFoundScanners = _notFoundScanners
  potentiallyMatchingScanners = _potentiallyMatchingScanners
}

// Part 1
const beacons = new Set()
for (const scannerBeacons of foundScanners.values()) {
  for (const beacon of scannerBeacons) {
    beacons.add(toStr(beacon))
  }
}

console.log('Part 1: ' + beacons.size)

// Part 2
const scannerPositions = Array.from(foundScanners.keys()).map(fromStr)

let maxDistance = -Infinity

for (const aPos of scannerPositions) {
  for (const bPos of scannerPositions) {
    if (aPos === bPos) continue
    const distance = manhattanDistance(aPos, bPos)
    if (distance > maxDistance) maxDistance = distance
  }
}

console.log('Part 2: ' + maxDistance)
