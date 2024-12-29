export const face = (level, totalLevels) => {
  const positions = []
  const height = totalLevels
  
  // 턱과 볼 부분 (0% ~ 30%)
  if (level < height * 0.3) {
    const faceRadius = 5
    for (let x = -faceRadius; x <= faceRadius; x++) {
      for (let z = -faceRadius; z <= faceRadius; z++) {
        const distance = Math.sqrt(x*x + z*z)
        // 얼굴 윤곽선 (타원형)
        if (distance <= faceRadius && ((level < height * 0.1) || distance > faceRadius - 2)) {
          positions.push([x, level, z])
        }
      }
    }
  }
  
  // 입과 볼 부분 (30% ~ 45%)
  else if (level < height * 0.45) {
    // 볼
    positions.push([-4, level, 0], [4, level, 0])
    // 입술
    for (let x = -2; x <= 2; x++) {
      const z = Math.sin(x * Math.PI / 2) * 0.5
      positions.push([x, level, z])
    }
    // 입꼬리
    if (level === Math.floor(height * 0.4)) {
      positions.push([-2, level, 0.5], [2, level, 0.5])
    }
  }
  
  // 코 부분 (45% ~ 60%)
  else if (level < height * 0.6) {
    // 콧대
    positions.push([0, level, 1])
    // 콧볼
    if (level > height * 0.55) {
      positions.push([-1, level, 1], [1, level, 1])
      positions.push([0, level, 2])
    }
  }
  
  // 눈 부분 (60% ~ 75%)
  else if (level < height * 0.75) {
    // 눈썹
    if (level > height * 0.7) {
      for (let x = -3; x <= 3; x++) {
        if (Math.abs(x) >= 1 && Math.abs(x) <= 3) {
          positions.push([x, level, 2])
        }
      }
    }
    // 눈
    else {
      // 왼쪽 눈
      for (let x = -3; x <= -1; x++) {
        positions.push([x, level, 1])
        if (level === Math.floor(height * 0.65)) {
          positions.push([x, level, 0], [x, level, 2])
        }
      }
      // 오른쪽 눈
      for (let x = 1; x <= 3; x++) {
        positions.push([x, level, 1])
        if (level === Math.floor(height * 0.65)) {
          positions.push([x, level, 0], [x, level, 2])
        }
      }
    }
  }
  
  // 이마와 머리카락 시작 (75% ~ 85%)
  else if (level < height * 0.85) {
    const foreheadRadius = 4
    for (let x = -foreheadRadius; x <= foreheadRadius; x++) {
      for (let z = -1; z <= foreheadRadius; z++) {
        const distance = Math.sqrt(x*x + z*z)
        if (distance <= foreheadRadius) {
          positions.push([x, level, z])
        }
      }
    }
  }
  
  // 머리카락 (85% ~ 100%)
  else {
    // 웨이브가 있는 긴 머리 표현
    const hairRadius = 6
    for (let x = -hairRadius; x <= hairRadius; x++) {
      for (let z = -hairRadius; z <= hairRadius; z++) {
        const distance = Math.sqrt(x*x + z*z)
        const wave = Math.sin(x * 0.5 + level * 0.8) * Math.cos(z * 0.5) * 0.5
        if (distance <= hairRadius + wave && distance > hairRadius - 2) {
          positions.push([x, level, z])
        }
      }
    }
  }

  return positions
}
