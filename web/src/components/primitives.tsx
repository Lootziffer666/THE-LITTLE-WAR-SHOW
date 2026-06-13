/**
 * Tiny declarative primitives shared by every component (and the sub-agent
 * modules) so geometry stays terse and consistent. A material instance from the
 * library is passed via `material=`; shadows default sensibly.
 */
import type { ReactNode } from 'react'
import * as THREE from 'three/webgpu'

export type V3 = [number, number, number]

interface BoxProps {
  args: V3
  position?: V3
  rotation?: V3
  material?: THREE.Material
  castShadow?: boolean
  receiveShadow?: boolean
  renderOrder?: number
  name?: string
  children?: ReactNode
}
export function Box({
  args,
  position,
  rotation,
  material,
  castShadow = true,
  receiveShadow = true,
  renderOrder,
  name,
  children,
}: BoxProps) {
  return (
    <mesh
      name={name}
      position={position}
      rotation={rotation}
      material={material}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      renderOrder={renderOrder}
    >
      <boxGeometry args={args} />
      {children}
    </mesh>
  )
}

interface PlaneProps {
  args: [number, number]
  position?: V3
  rotation?: V3
  material?: THREE.Material
  castShadow?: boolean
  receiveShadow?: boolean
  name?: string
  children?: ReactNode
}
export function Plane({
  args,
  position,
  rotation,
  material,
  castShadow = false,
  receiveShadow = true,
  name,
  children,
}: PlaneProps) {
  return (
    <mesh
      name={name}
      position={position}
      rotation={rotation}
      material={material}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
    >
      <planeGeometry args={args} />
      {children}
    </mesh>
  )
}
