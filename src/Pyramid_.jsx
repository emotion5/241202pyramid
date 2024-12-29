import { useState, useRef } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, Edges, SoftShadows } from '@react-three/drei'
import { TextureLoader } from 'three'
import * as THREE from 'three'
import { MODELS } from './models'
import { createCustomModel } from './models/custom'

const Brick = ({ position, timeScale }) => {
  const texture = useLoader(TextureLoader, './src/assets/noise.jpg')
  const normalMap = useLoader(TextureLoader, './src/assets/noise.jpg')
  
  // 텍스처 설정
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(1, 1)
  
  normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping
  normalMap.repeat.set(1, 1)

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
      <Edges
        threshold={15}
        color="#746c50"
        opacity={0.9 - (timeScale * 0.5)}
        scale={1}
        lineWidth={0.1}
      />
    </group>
  )
}

// PyramidLayer 컴포넌트 수정
const PyramidLayer = ({ level, totalLevels, timeScale, shape = 'pyramid' }) => {
  const positions = MODELS[shape](level, totalLevels)
  
  return (
    <>
      {positions.map((pos, index) => (
        <Brick
          key={`brick-${level}-${index}`}
          position={pos}
          timeScale={timeScale}
        />
      ))}
    </>
  )
}

// Pyramid 컴포넌트 수정
const Pyramid = ({ levels, timeScale, shape = 'pyramid' }) => {
  const pyramid = []
  for (let i = 0; i < levels; i++) {
    pyramid.push(
      <PyramidLayer
        key={`layer-${i}`}
        level={i}
        totalLevels={levels}
        timeScale={timeScale}
        shape={shape}
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
  const [levels, setLevels] = useState(8)
  const [showPyramid, setShowPyramid] = useState(false)
  const [timeScale, setTimeScale] = useState(0)
  const [selectedShape, setSelectedShape] = useState('pyramid')
  const [customModelUrl, setCustomModelUrl] = useState(null)

  const handleCreate = () => {
    setShowPyramid(true)
  }

  const handleTransform = () => {
    // 기존 피라미드를 숨겼다가 새로운 모양으로 보여주기
    setShowPyramid(false)
    setTimeout(() => setShowPyramid(true), 100)
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setCustomModelUrl(url)
      setSelectedShape('custom')
      MODELS.custom = await createCustomModel(url)
    }
  }

  return (
    <div style={{ width: '90vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <input
          type="number"
          min="1"
          value={levels}
          onChange={(e) => setLevels(parseInt(e.target.value))}
        />
        <button onClick={handleCreate}>제작</button>
        <select 
          value={selectedShape} 
          onChange={(e) => setSelectedShape(e.target.value)}
          style={{ padding: '5px' }}
        >
          <option value="pyramid">피라미드</option>
          <option value="man">남자</option>
          <option value="woman">여자</option>
          <option value="lion">사자</option>
          <option value="apple">사과</option>
        </select>
        <button onClick={handleTransform}>변신</button>
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
        <input
          type="file"
          accept=".png,.jpg,.jpeg,.glb"
          onChange={handleFileUpload}
        />
      </div>
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
          {showPyramid && <Pyramid levels={levels} timeScale={timeScale} shape={selectedShape} />}
          <Ground />
          <OrbitControls />
          <gridHelper args={[20, 20]} />
        </Canvas>
      </div>
    </div>
  )
}

export default PyramidEditor
