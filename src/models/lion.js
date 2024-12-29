export const lion = (level, totalLevels) => {
  const positions = []
  const height = totalLevels
  
  if (level < height * 0.3) {
    // 몸통
    for (let x = -2; x <= 2; x++) {
      for (let z = -1; z <= 1; z++) {
        positions.push([x, level, z])
      }
    }
  } else if (level < height * 0.6) {
    // 머리 부분
    for (let x = -1; x <= 1; x++) {
      for (let z = -1; z <= 1; z++) {
        positions.push([x, level + 1, z])
      }
    }
    // 갈기
    if (level === Math.floor(height * 0.4)) {
      for (let x = -2; x <= 2; x++) {
        for (let z = -2; z <= 2; z++) {
          if (Math.abs(x) + Math.abs(z) === 3) {
            positions.push([x, level, z])
          }
        }
      }
    }
  }
  
  return positions
}
