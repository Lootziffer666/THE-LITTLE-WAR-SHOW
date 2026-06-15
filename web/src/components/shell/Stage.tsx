/**
 * The stage box: a redder, scuffed plank deck raised above the house, its dark
 * apron face, the tall black stage-house side walls, a painted cyclorama back
 * wall, and a high dark grid ceiling.
 */
import { useMemo } from 'react'
import { Box } from '../primitives'
import { STAGE, PALETTE } from '../../config/theater.config'
import { stageDeckMaterial, darkWoodMaterial, plasterMaterial } from '../../materials'

export function Stage() {
  const deckMat = useMemo(() => stageDeckMaterial(), [])
  const apronMat = useMemo(() => darkWoodMaterial({ tone: PALETTE.woodDark }), [])
  const houseMat = useMemo(() => darkWoodMaterial({ tone: '#1b1612', planks: false }), [])
  const cycMat = useMemo(() => plasterMaterial({ color: '#39312b', grime: 0.3, cracks: 0.2 }), [])
  const hw = STAGE.width / 2

  return (
    <group name="Stage">
      <Box
        name="StageDeck"
        args={[STAGE.width, STAGE.deckThickness, STAGE.depth]}
        position={[0, STAGE.deckY - STAGE.deckThickness / 2, 0]}
        material={deckMat}
      />
      <Box
        name="Apron"
        args={[STAGE.width, STAGE.deckY, 0.2]}
        position={[0, STAGE.deckY / 2, STAGE.frontZ - 0.1]}
        material={apronMat}
        castShadow={false}
      />

      {[-1, 1].map((s) => (
        <Box
          key={`house-${s}`}
          args={[0.3, 8, STAGE.depth]}
          position={[s * (hw + 0.15), STAGE.deckY + 4, 0]}
          material={houseMat}
          castShadow={false}
        />
      ))}

      <Box
        name="Cyclorama"
        args={[STAGE.width + 0.6, 8, 0.3]}
        position={[0, STAGE.deckY + 4, STAGE.backZ]}
        material={cycMat}
        castShadow={false}
      />
      <Box
        name="GridCeiling"
        args={[STAGE.width + 0.6, 0.3, STAGE.depth]}
        position={[0, STAGE.deckY + 8, 0]}
        material={houseMat}
        castShadow={false}
      />
    </group>
  )
}
