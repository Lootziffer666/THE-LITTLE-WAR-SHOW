/**
 * The gilded proscenium arch, the velvet valance/pelmet, the fly bar, and the
 * footlight trough with its row of bulbs. The bulbs read from the shared
 * `glow.foot` uniform, so they're dark unless the footlights are up.
 */
import { useMemo } from 'react'
import { Box } from '../primitives'
import { STAGE, PROSCENIUM, PALETTE } from '../../config/theater.config'
import { giltMaterial, curtainVelvetMaterial, steelMaterial, darkWoodMaterial, emissiveMaterial } from '../../materials'
import { glow } from '../../systems/lightUniforms'

export function Proscenium() {
  const gilt = useMemo(() => giltMaterial(), [])
  const valance = useMemo(() => curtainVelvetMaterial(), [])
  const bar = useMemo(() => steelMaterial({ rough: 0.4 }), [])
  const trough = useMemo(() => darkWoodMaterial({ tone: '#15110e', planks: false }), [])
  const bulbMat = useMemo(() => emissiveMaterial(PALETTE.footWarm, 5, glow.foot), [])

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
    </group>
  )
}
