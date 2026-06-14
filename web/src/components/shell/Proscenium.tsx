/**
 * The gilded proscenium arch, the velvet valance/pelmet, the fly bar, and the
 * footlight trough with its row of bulbs. The bulbs read from the shared
 * `glow.foot` uniform, so they're dark unless the footlights are up.
 */
import { useMemo } from 'react'
import { Box } from '../primitives'
import { STAGE, PROSCENIUM, PALETTE } from '../../config/theater.config'
import { giltMaterial, curtainVelvetMaterial, steelMaterial, darkWoodMaterial, emissiveMaterial, plasterMaterial } from '../../materials'
import { glow } from '../../systems/lightUniforms'

export function Proscenium() {
  const gilt = useMemo(() => giltMaterial(), [])
  const valance = useMemo(() => curtainVelvetMaterial(), [])
  const bar = useMemo(() => steelMaterial({ rough: 0.4 }), [])
  const trough = useMemo(() => darkWoodMaterial({ tone: '#15110e', planks: false }), [])
  const bulbMat = useMemo(() => emissiveMaterial(PALETTE.footWarm, 5, glow.foot), [])
  const patch = useMemo(() => plasterMaterial({ color: '#c9b48f', grime: 0.2, cracks: 0.2 }), [])

  const half = PROSCENIUM.openingWidth / 2
  const colX = half + PROSCENIUM.frameThickness / 2
  const z = PROSCENIUM.z
  const top = PROSCENIUM.topY
  const N = 11

  return (
    <group name="Proscenium">
      {[-1, 1].map((s) => (
        <Box
          key={`col-${s}`}
          args={[PROSCENIUM.frameThickness, top, PROSCENIUM.frameDepth]}
          position={[s * colX, top / 2, z]}
          material={gilt}
        />
      ))}
      <Box
        args={[PROSCENIUM.openingWidth + PROSCENIUM.frameThickness * 2, PROSCENIUM.frameThickness, PROSCENIUM.frameDepth]}
        position={[0, top + PROSCENIUM.frameThickness / 2, z]}
        material={gilt}
      />

      <Box
        name="Valance"
        args={[PROSCENIUM.openingWidth, PROSCENIUM.valanceDrop, 0.18]}
        position={[0, top - PROSCENIUM.valanceDrop / 2, z - 0.2]}
        material={valance}
        castShadow={false}
      />

      <Box
        name="FlyBar"
        args={[PROSCENIUM.openingWidth * 0.98, 0.08, 0.08]}
        position={[0, PROSCENIUM.fliesBarY, z - 0.45]}
        material={bar}
        castShadow={false}
      />

      <Box
        name="FootlightTrough"
        args={[STAGE.width, 0.2, 0.22]}
        position={[0, STAGE.deckY + 0.08, STAGE.frontZ - 0.25]}
        material={trough}
        castShadow={false}
      />
      {Array.from({ length: N }).map((_, i) => {
        const t = i / (N - 1) - 0.5
        return (
          <mesh
            key={`bulb-${i}`}
            position={[t * (STAGE.width - 1.0), STAGE.deckY + 0.18, STAGE.frontZ - 0.25]}
            material={bulbMat}
            castShadow={false}
          >
            <sphereGeometry args={[0.07, 14, 10]} />
          </mesh>
        )
      })}

      {/* ornament: a cornice + finial crest, rosettes, a banner hook, and a
          corner where an older, browner paint layer shows through */}
      <Box args={[PROSCENIUM.openingWidth * 0.6, 0.34, 0.55]} position={[0, top + PROSCENIUM.frameThickness + 0.1, z]} material={gilt} />
      <mesh material={gilt} position={[0, top + PROSCENIUM.frameThickness + 0.45, z]} castShadow>
        <octahedronGeometry args={[0.32, 0]} />
      </mesh>
      {[-3.2, -1.6, 0, 1.6, 3.2].map((x, i) => (
        <mesh key={`rose-${i}`} material={gilt} position={[x, top + PROSCENIUM.frameThickness / 2, z + 0.52]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.08, 16]} />
        </mesh>
      ))}
      {/* the little hook where a banner used to hang */}
      <mesh material={bar} position={[0, top - 0.25, z + 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.05, 0.012, 8, 16, Math.PI]} />
      </mesh>
      {/* older paint layer showing at a corner of the arch */}
      <mesh material={patch} position={[-colX + 0.1, top - 0.6, z + 0.46]} rotation={[0, 0, 0.12]}>
        <planeGeometry args={[0.5, 0.7]} />
      </mesh>
    </group>
  )
}
