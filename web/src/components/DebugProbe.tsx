import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three/webgpu'

/**
 * Bright, dependency-light visibility probe.
 *
 * Use `?probe=1` to bypass the full theater and prove whether the Canvas,
 * renderer, camera and base render loop can present anything at all.
 */
export function DebugProbe() {
  const box = useRef<THREE.Mesh>(null)

  useFrame((_, dt) => {
    if (box.current) {
      box.current.rotation.x += dt * 0.7
      box.current.rotation.y += dt * 0.9
    }
  })

  return (
    <group name="DebugProbe">
      <ambientLight intensity={2.5} />
      <directionalLight position={[3, 5, 6]} intensity={4} />
      <mesh ref={box} position={[0, 1.4, 0]}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshBasicNodeMaterial color="#ffb000" />
      </mesh>
      <mesh position={[0, 0.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.35, 48]} />
        <meshBasicNodeMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshBasicNodeMaterial color="#26201a" />
      </mesh>
    </group>
  )
}
