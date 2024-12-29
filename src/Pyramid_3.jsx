import { useState, useRef } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, Edges, SoftShadows, RoundedBox } from '@react-three/drei'
import { TextureLoader } from 'three'
import * as THREE from 'three'
import { EffectComposer, SSAO } from '@react-three/postprocessing'

const Brick = ({ position, timeScale }) => {
  const texture = useLoader(TextureLoader, './src/assets/noise.jpg')
  const normalMap = useLoader(TextureLoader, './src/assets/noise.jpg')
  
  // 텍스처 설정
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(1, 1)
  
  normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping
  normalMap.repeat.set(1, 1)

  // 시간에 따른 회전 강도 계산
  const maxRotation = Math.PI / 8; // 최대 회전 각도
  const rotationScale = timeScale * maxRotation; // 0~π/2
  const randomRotation = [
    (Math.random() - 0.5) * rotationScale,
    (Math.random() - 0.5) * rotationScale,
    (Math.random() - 0.5) * rotationScale
  ]

  // 시간에 따른 코너 라운딩 계산
  const maxRadius = 0.02; // 최대 라운딩 반경
  const radius = timeScale * maxRadius;

  return (
    <group
      position={[position[0], position[1] + 0.5, position[2]]} 
      rotation={randomRotation}
    >
      <RoundedBox 
        args={[1, 1, 1]} 
        radius={radius} 
        smoothness={4} 
        castShadow 
        receiveShadow
      >
        <meshStandardMaterial 
          color="#dfd7bc"
          map={texture}
          normalMap={normalMap}
          normalScale={[0.7, 0.7]}
          roughness={0.8}
          metalness={0.2}
        />
      </RoundedBox>
      <Edges
        threshold={15}
        color="#746c50"
        opacity={0.9 - (timeScale * 0.5)} // 시간이 지날수록 엣지가 흐려짐
        scale={1}
        lineWidth={0.1}
      />
    </group>
  )
}

const PyramidLayer = ({ level, totalLevels, timeScale }) => {
  const bricks = []
  const size = 2 * (totalLevels - level) + 1 // 현재 층의 한 변의 벽돌 개수
  const offset = size / 2 - 0.5 // 중앙 정렬을 위한 오프셋

  for (let x = 0; x < size; x++) {
    for (let z = 0; z < size; z++) {
      bricks.push(
        <Brick
          key={`brick-${level}-${x}-${z}`}
          position={[
            x - offset,
            level,
            z - offset
          ]}
          timeScale={timeScale}
        />
      )
    }
  }

  return <>{bricks}</>
}

const Pyramid = ({ levels, timeScale }) => {
  const pyramid = []
  for (let i = 0; i < levels; i++) {
    pyramid.push(
      <PyramidLayer
        key={`layer-${i}`}
        level={i}
        totalLevels={levels}
        timeScale={timeScale}
      />
    )
  }
  return <>{pyramid}</>
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
  const [levels, setLevels] = useState(1)
  const [showPyramid, setShowPyramid] = useState(false)
  const [timeScale, setTimeScale] = useState(0)

  const handleCreate = () => {
    setShowPyramid(true)
  }

  return (
    <div style={{ width: '90vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <input
          type="number"
          min="1"
          value={levels}
          onChange={(e) => setLevels(parseInt(e.target.value))}
        />
        <button onClick={handleCreate}>피라미드 제작</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
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
      <div style={{ flex: 1 }}>
        <Canvas shadows camera={{ position: [10, 10, 10] }}>
          <SoftShadows 
            size={50}     // 그림자 블러 크기
            samples={16}    // 샘플링 수 (높을수록 부드럽지만 성능 저하)
            focus={0.5}     // 초점 거리
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
          {showPyramid && <Pyramid levels={levels} timeScale={timeScale} />}
          <Ground />
          <OrbitControls />
          <gridHelper args={[20, 20]} />
          <EffectComposer>
            <SSAO 
              samples={31} // AO 품질
              radius={0.3} // AO 반경
              intensity={20} // AO 강도
              luminanceInfluence={0.6} // 밝기에 따른 영향
              color="black"
            />
          </EffectComposer>
        </Canvas>
      </div>
    </div>
  )
}

export default PyramidEditor
