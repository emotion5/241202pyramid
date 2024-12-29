export const woman = (level, totalLevels) => {
  const positions = []
  const height = totalLevels
  
  // 치마 부분 (맨 아래 층: 0% ~ 35%)
  if (level < height * 0.35) {
    const baseSize = 6
    const skirtSize = baseSize - Math.floor(level * 0.5)
    
    // 원형 치마 형태
    for (let x = -skirtSize; x <= skirtSize; x++) {
      for (let z = -skirtSize; z <= skirtSize; z++) {
        const distance = Math.sqrt(x*x + z*z)
        if (distance <= skirtSize + 0.8) {
          positions.push([x, level, z])
          // 치마 주름 표현
          if (level < height * 0.1 && distance > skirtSize - 1) {
            positions.push([x, level + 0.5, z])
          }
        }
      }
    }
    
    // 치마 앞쪽 주름 디테일
    if (level === Math.floor(height * 0.2)) {
      for (let x = -2; x <= 2; x++) {
        positions.push([x, level, skirtSize - 1])
      }
    }
  }
  
  // 허리 부분 (35% ~ 45%)
  else if (level < height * 0.45) {
    const waistSize = 2
    // 허리 기본 형태
    for (let x = -waistSize; x <= waistSize; x++) {
      for (let z = -waistSize; z <= waistSize; z++) {
        if (Math.abs(x) + Math.abs(z) <= waistSize * 1.8) {
          positions.push([x, level, z])
        }
      }
    }
    
    // 옷 주름 디테일
    if (level === Math.floor(height * 0.4)) {
      positions.push([-2, level, -1], [2, level, -1])
      positions.push([-2, level, 1], [2, level, 1])
    }
  }
  
  // 상체 부분 (45% ~ 65%)
  else if (level < height * 0.65) {
    // 몸통
    for (let x = -2; x <= 2; x++) {
      for (let z = -1; z <= 1; z++) {
        positions.push([x, level, z])
      }
    }
    
    // 팔 디테일
    if (level >= height * 0.5 && level < height * 0.6) {
      // 왼팔
      positions.push([-3, level, 0], [-4, level, 0])
      if (level === Math.floor(height * 0.55)) {
        positions.push([-3, level, 1], [-4, level, 1])
        positions.push([-3, level, -1], [-4, level, -1])
      }
      
      // 오른팔
      positions.push([3, level, 0], [4, level, 0])
      if (level === Math.floor(height * 0.55)) {
        positions.push([3, level, 1], [4, level, 1])
        positions.push([3, level, -1], [4, level, -1])
      }
    }
  }
  
  // 목과 어깨 부분 (65% ~ 75%)
  else if (level < height * 0.75) {
    // 목
    positions.push([0, level, 0])
    
    // 어깨 라인
    if (level === Math.floor(height * 0.7)) {
      for (let x = -2; x <= 2; x++) {
        if (Math.abs(x) >= 1) {
          positions.push([x, level, 0])
          positions.push([x, level, 1])
          positions.push([x, level, -1])
        }
      }
    }
  }
  
  // 머리 부분 (75% ~ 90%)
  else if (level < height * 0.9) {
    // 얼굴
    const faceSize = 2
    for (let x = -faceSize; x <= faceSize; x++) {
      for (let z = -faceSize; z <= faceSize; z++) {
        const distance = Math.sqrt(x*x + z*z)
        if (distance <= faceSize) {
          positions.push([x, level, z])
        }
      }
    }
    
    // 헤어스타일
    if (level >= height * 0.8) {
      // 앞머리
      for (let x = -2; x <= 2; x++) {
        positions.push([x, level, 2])
      }
      
      // 옆머리
      positions.push([-2, level, 1], [-2, level, 0], [-2, level, -1])
      positions.push([2, level, 1], [2, level, 0], [2, level, -1])
      
      // 뒷머리
      for (let x = -2; x <= 2; x++) {
        positions.push([x, level, -2])
      }
      
      // 머리 볼륨
      if (level === Math.floor(height * 0.85)) {
        for (let x = -3; x <= 3; x++) {
          if (Math.abs(x) >= 2) {
            positions.push([x, level, 0])
            positions.push([x, level, 1])
            positions.push([x, level, -1])
          }
        }
      }
    }
  }
  
  // 머리 장식 (90% ~ 100%)
  else {
    // 리본이나 장식
    if (level === Math.floor(height * 0.95)) {
      positions.push([0, level, 0])
      positions.push([-1, level, 0], [1, level, 0])
      positions.push([0, level, 1], [0, level, -1])
      positions.push([-1, level, 1], [1, level, 1])
    }
  }
  
  return positions
}
