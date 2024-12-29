import { useState, useRef, useEffect } from 'react'
import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import { OrbitControls, Edges, SoftShadows } from '@react-three/drei'
import { TextureLoader } from 'three'
import * as THREE from 'three'
import { MODELS } from './models'

// 보간 헬퍼 함수
const lerp = (start, end, t) => start + (end - start) * t

const AnimatedBrick = ({ position, timeScale, targetPosition }) => {
  const ref = useRef()
  const texture = useLoader(TextureLoader, './src/assets/noise.jpg')
  const normalMap = useLoader(TextureLoader, './src/assets/noise.jpg')
  
  useFrame(() => {
    if (ref.current && targetPosition) {
      // 부드러운 이동
      ref.current.position.x = lerp(ref.current.position.x, targetPosition[0], 0.05)
      ref.current.position.y = lerp(ref.current.position.y, targetPosition[1] + 0.5, 0.05)
      ref.current.position.z = lerp(ref.current.position.z, targetPosition[2], 0.05)
    }
  })

  // 시간에 따른 회전 강도 계산
  const maxRotation = Math.PI / 4;
  const rotationScale = timeScale * maxRotation;
  const randomRotation = [
    (Math.random() - 0.5) * rotationScale,
    (Math.random() - 0.5) * rotationScale,
    (Math.random() - 0.5) * rotationScale
  ]

  return (
    <group
      ref={ref}
      position={[position[0], position[1] + 0.5, position[2]]}
      rotation={randomRotation}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color="#dfd7bc"
          map={texture}
          normalMap={normalMap}
          normalScale={[0.7, 0.7]}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      {/* <Edges
        threshold={15}
        color="#746c50"
        opacity={0.9 - (timeScale * 0.5)}
        scale={1}
        lineWidth={0.3}
      /> */}
    </group>
  )
}

const Ground = () => {
  return (
    <mesh receiveShadow rotation-x={-Math.PI * 0.5} position-y={0}>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#c2b484" />
    </mesh>
  )
}

const PyramidEditor = () => {
  const [levels, setLevels] = useState(8)
  const [showPyramid, setShowPyramid] = useState(false)
  const [timeScale, setTimeScale] = useState(0)
  const [selectedShape, setSelectedShape] = useState('pyramid')
  const [currentPositions, setCurrentPositions] = useState([])
  const [targetPositions, setTargetPositions] = useState([])
  const [bricks, setBricks] = useState([])

  // 새로운 벽돌 위치 생성 함수
  const createRandomPosition = () => {
    const range = 5
    return [
      (Math.random() - 0.5) * range,
      -2,
      (Math.random() - 0.5) * range
    ]
  }

  useEffect(() => {
    if (showPyramid) {
      const newTargetPositions = []
      for (let i = 0; i < levels; i++) {
        const levelPositions = MODELS[selectedShape](i, levels)
        newTargetPositions.push(...levelPositions)
      }

      // 현재 벽돌 수와 필요한 벽돌 수 비교
      if (bricks.length === 0) {
        // 초기 생성
        setBricks(newTargetPositions.map(pos => ({
          currentPos: [...pos],
          targetPos: [...pos]
        })))
      } else if (newTargetPositions.length > bricks.length) {
        // 벽돌이 부족한 경우: 새 벽돌 추가
        const additionalBricks = newTargetPositions.slice(bricks.length).map(targetPos => ({
          currentPos: createRandomPosition(), // 화면 바깥에서 시작
          targetPos: targetPos
        }))
        setBricks([
          ...bricks.map((brick, i) => ({
            ...brick,
            targetPos: newTargetPositions[i]
          })),
          ...additionalBricks
        ])
      } else if (newTargetPositions.length < bricks.length) {
        // 벽돌이 남는 경우: 남는 벽돌은 화면 밖으로 이동
        setBricks(bricks.map((brick, i) => ({
          ...brick,
          targetPos: i < newTargetPositions.length 
            ? newTargetPositions[i]
            : createRandomPosition() // 화면 밖으로 이동
        })))
      } else {
        // 벽돌 수가 같은 경우: 타겟 위치만 업데이트
        setBricks(bricks.map((brick, i) => ({
          ...brick,
          targetPos: newTargetPositions[i]
        })))
      }
    }
  }, [selectedShape, showPyramid, levels])

  const handleCreate = () => {
    setShowPyramid(true)
  }

  const handleShapeChange = (e) => {
    setSelectedShape(e.target.value)
  }

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <Canvas shadows camera={{ position: [10, 10, 10] }}>
          <SoftShadows 
            size={50}
            samples={16}
            focus={0.5}
          />
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={0.3}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          {showPyramid && bricks.map((brick, idx) => (
            <AnimatedBrick
              key={`brick-${idx}`}
              position={brick.currentPos}
              targetPosition={brick.targetPos}
              timeScale={timeScale}
            />
          ))}
          <Ground />
          <OrbitControls />
          {/* <gridHelper args={[20, 20]} /> */}
        </Canvas>
      </div>
      
      <div style={{ 
        width: '200px', 
        padding: '20px',
        backgroundColor: '#050505',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label>레벨 설정</label>
          <input
            type="number"
            min="1"
            value={levels}
            onChange={(e) => setLevels(parseInt(e.target.value))}
            style={{ padding: '8px', width: '90%' }}
          />
          <button 
            onClick={handleCreate}
            style={{ 
              padding: '8px', 
              backgroundColor: '#4a4a4a', 
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            제작
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ color: 'white' }}>모양 선택</label>
          <select 
            value={selectedShape} 
            onChange={handleShapeChange}
            style={{ 
              padding: '8px',
              width: '100%',
              backgroundColor: 'darkgray',
              borderRadius: '4px'
            }}
          >
            <option value="pyramid">피라미드</option>
            <option value="man">남자</option>
            <option value="woman">여자</option>
            <option value="lion">사자</option>
            <option value="apple">사과</option>
            <option value="face">얼굴</option>
            <option value="building">빌딩</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label>시간 설정</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>과거</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={timeScale}
              onChange={(e) => setTimeScale(parseFloat(e.target.value))}
              style={{ flex: 1 }}
            />
            <span>미래</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PyramidEditor
