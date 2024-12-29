export const pyramid = (level, totalLevels) => {
  const size = 2 * (totalLevels - level) + 1
  const offset = size / 2 - 0.5
  const positions = []
  
  for (let x = 0; x < size; x++) {
    for (let z = 0; z < size; z++) {
      positions.push([x - offset, level, z - offset])
    }
  }
  return positions
}
