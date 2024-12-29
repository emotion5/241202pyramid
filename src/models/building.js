export const building = (level, totalLevels) => {
  const positions = []
  const height = totalLevels
  
  // Base/Foundation (0% ~ 10%)
  if (level < height * 0.1) {
    const baseSize = 7
    for (let x = -baseSize; x <= baseSize; x++) {
      for (let z = -baseSize; z <= baseSize; z++) {
        if (Math.abs(x) <= baseSize && Math.abs(z) <= baseSize) {
          positions.push([x, level, z])
        }
      }
    }
  }
  
  // Main Building Body (10% ~ 70%)
  else if (level < height * 0.7) {
    const mainSize = 5
    // Central tower
    for (let x = -mainSize; x <= mainSize; x++) {
      for (let z = -mainSize; z <= mainSize; z++) {
        // Create setbacks for typical Art Deco style
        const setback = Math.floor((level - height * 0.1) / (height * 0.1))
        if (Math.abs(x) <= mainSize - setback && Math.abs(z) <= mainSize - setback) {
          positions.push([x, level, z])
        }
      }
    }
    
    // Vertical lines decoration
    if (level % 3 === 0) {
      const size = mainSize - Math.floor((level - height * 0.1) / (height * 0.1))
      for (let x = -size; x <= size; x++) {
        positions.push([x, level, size])
        positions.push([x, level, -size])
        positions.push([size, level, x])
        positions.push([-size, level, x])
      }
    }
  }
  
  // Upper Setbacks (70% ~ 90%)
  else if (level < height * 0.9) {
    const upperSize = 3
    const setback = Math.floor((level - height * 0.7) / (height * 0.05))
    for (let x = -upperSize + setback; x <= upperSize - setback; x++) {
      for (let z = -upperSize + setback; z <= upperSize - setback; z++) {
        positions.push([x, level, z])
      }
    }
    
    // Decorative corners
    if (level % 2 === 0) {
      const size = upperSize - setback
      positions.push([size, level, size])
      positions.push([size, level, -size])
      positions.push([-size, level, size])
      positions.push([-size, level, -size])
    }
  }
  
  // Crown/Spire (90% ~ 100%)
  else {
    // Central spire
    positions.push([0, level, 0])
    if (level === Math.floor(height * 0.95)) {
      positions.push([1, level, 0], [-1, level, 0])
      positions.push([0, level, 1], [0, level, -1])
    }
    // Decorative finials
    if (level === Math.floor(height * 0.92)) {
      for (let x = -1; x <= 1; x++) {
        for (let z = -1; z <= 1; z++) {
          if (Math.abs(x) + Math.abs(z) === 2) {
            positions.push([x, level, z])
          }
        }
      }
    }
  }
  
  return positions
}