export const apple = (level, totalLevels) => {
  const positions = []
  const height = totalLevels
  const radius = Math.min(3, height / 2)
  
  if (level < height * 0.8) {
    // 동그란 형태
    for (let x = -radius; x <= radius; x++) {
      for (let z = -radius; z <= radius; z++) {
        if (x*x + z*z <= radius*radius) {
          positions.push([x, level, z])
        }
      }
    }
  } else if (level === Math.floor(height * 0.9)) {
    // 꼭지
    positions.push([0, level, 0])
  }
  
  return positions
}
