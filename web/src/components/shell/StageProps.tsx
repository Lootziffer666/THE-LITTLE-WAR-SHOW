/**
 * The controllable stage props. Each reads its live transform + visibility from
 * the store (the tech console writes them), so the lighting desk can travel a
 * cardboard cannon, hoist the moon, etc. The selected prop gets a gilt ring.
 *
 * Deliberately cardboard/tin — this is The Little War Show's set, not ordnance.
 */
import { useMemo } from 'react'
import { STAGE_PROPS } from '../../config/theater.config'
import { useTheaterStore } from '../../state/useTheaterStore'
import { fabricMaterial, darkWoodMaterial, brassMaterial, emissiveMaterial } from '../../materials'

function PropShape({ id }: { id: string }) {
  const cardboard = useMemo(() => fabricMaterial({ color: '#b88a4e', foldScale: 8 }), [])
  const dark = useMemo(() => darkWoodMaterial({ tone: '#5a3f24' }), [])
  const cloth = useMemo(() => fabricMaterial({ color: '#9a2b2f' }), [])
  const pale = useMemo(() => fabricMaterial({ color: '#d9d2c2' }), [])
  const metal = useMemo(() => brassMaterial(), [])
  const moonMat = useMemo(() => emissiveMaterial('#cfe0ff', 1.1), [])

  switch (id) {
    case 'cannon':
      return (
        <group>
          <mesh position={[0, 0.32, 0]} rotation={[Math.PI / 2, 0, 0]} material={cardboard} castShadow>
            <cylinderGeometry args={[0.17, 0.2, 0.95, 18]} />
          </mesh>
          <mesh position={[0, 0.16, 0.1]} material={dark} castShadow>
            <boxGeometry args={[0.5, 0.22, 0.6]} />
          </mesh>
          {[-0.3, 0.3].map((x) => (
            <mesh key={x} position={[x, 0.16, 0.1]} rotation={[0, 0, Math.PI / 2]} material={dark} castShadow>
              <cylinderGeometry args={[0.18, 0.18, 0.08, 16]} />
            </mesh>
          ))}
        </group>
      )
    case 'crate':
      return (
        <mesh position={[0, 0.3, 0]} material={dark} castShadow>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
        </mesh>
      )
    case 'flag':
      return (
        <group>
          <mesh position={[0, 1.1, 0]} material={metal} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 2.2, 10]} />
          </mesh>
          <mesh position={[0.5, 1.8, 0]} material={cloth} castShadow>
            <boxGeometry args={[0.95, 0.6, 0.02]} />
          </mesh>
        </group>
      )
    case 'cloud':
      return (
        <group>
          {[
            [0, 0, 0, 0.55],
            [0.5, -0.05, 0, 0.4],
            [-0.5, -0.05, 0, 0.42],
            [0.2, 0.18, 0, 0.36],
          ].map(([x, y, z, r], i) => (
            <mesh key={i} position={[x, y, z]} scale={[1, 0.7, 0.5]} material={pale} castShadow>
              <sphereGeometry args={[r, 16, 12]} />
            </mesh>
          ))}
        </group>
      )
    case 'moon':
      return (
        <mesh rotation={[Math.PI / 2, 0, 0]} material={moonMat} castShadow={false}>
          <cylinderGeometry args={[0.6, 0.6, 0.06, 28]} />
        </mesh>
      )
    default:
      return null
  }
}

export function StageProps() {
  const overrides = useTheaterStore((s) => s.propOverrides)
  const selected = useTheaterStore((s) => s.selectedPropId)
  const ringMat = useMemo(() => emissiveMaterial('#ffcf6a', 2.2), [])

  return (
    <group name="StageProps">
      {STAGE_PROPS.map((p) => {
        const o = overrides[p.id]
        if (!o || !o.visible) return null
        return (
          <group key={p.id} position={o.pos} rotation={[0, o.rotY, 0]}>
            <PropShape id={p.id} />
            {selected === p.id && (
              <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} material={ringMat} castShadow={false}>
                <ringGeometry args={[0.62, 0.74, 32]} />
              </mesh>
            )}
          </group>
        )
      })}
    </group>
  )
}
