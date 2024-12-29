export const man = (level, totalLevels) => {
  const positions = []
  const height = totalLevels
  
  // 다리와 발 (0% ~ 30%)
  if (level < height * 0.3) {
    // 발 부분
    if (level < height * 0.05) {
      for (let x = -2; x <= 2; x++) {
        for (let z = -1; z <= 1; z++) {
          if (Math.abs(x) <= 1 || z === 0) {
            positions.push([x, level, z])
          }
        }
      }
    }
    // 다리 부분
    else {
      // 왼쪽 다리
      positions.push([-1, level, 0], [-1, level, -1])
      // 오른쪽 다리
      positions.push([1, level, 0], [1, level, 1])
      // 중앙 연결부
      if (level > height * 0.25) {
        positions.push([0, level, 0])
      }
    }
  }
  
  // 허리와 복부 (30% ~ 45%)
  else if (level < height * 0.45) {
    for (let x = -2; x <= 2; x++) {
      for (let z = -1; z <= 1; z++) {
        if (Math.abs(x) <= 1 || z === 0) {
          positions.push([x, level, z])
        }
      }
    }
  }
  
  // 상체 (45% ~ 65%)
  else if (level < height * 0.65) {
    // 넓은 가슴과 어깨
    for (let x = -3; x <= 3; x++) {
      for (let z = -1; z <= 1; z++) {
        if (Math.abs(x) <= 2 || z === 0) {
          positions.push([x, level, z])
        }
      }
    }
    
    // 팔 (contrapposto 자세 표현)
    if (level > height * 0.5 && level < height * 0.6) {
      // 왼팔 (들어올린 자세)
      positions.push([-3, level, -1], [-4, level, -1])
      // 오른팔 (내린 자세)
      positions.push([3, level, 1], [4, level, 1])
    }
  }
  
  // 목 (65% ~ 70%)
  else if (level < height * 0.7) {
    positions.push([0, level, 0])
    positions.push([0, level, -1])
  }
  
  // 머리 (70% ~ 90%)
  else if (level < height * 0.9) {
    // 얼굴
    const faceSize = 2
    for (let x = -faceSize; x <= faceSize; x++) {
      for (let z = -faceSize; z <= faceSize; z++) {
        const distance = Math.sqrt(x*x + z*z)
        if (distance <= faceSize - 0.5) {
          positions.push([x, level, z])
        }
      }
    }
    
    // 머리카락 (곱슬머리 표현)
    if (level > height * 0.75) {
      const hairRadius = 2.5
      for (let x = -hairRadius; x <= hairRadius; x++) {
        for (let z = -hairRadius; z <= hairRadius; z++) {
          const distance = Math.sqrt(x*x + z*z)
          if (distance <= hairRadius && distance > hairRadius - 1) {
            positions.push([x, level, z])
          }
        }
      }
    }
  }
  
  return positions
}
