/**
 * The house itself: floor, side walls (aged plaster over a dark wainscot dado
 * with gilt chair-rail and crown moulding), the rear wall with its doorway to
 * the foyer, the front wall framing the proscenium, and the deep ceiling.
 */
import { useMemo } from 'react'
import { Box } from '../primitives'
import { HOUSE, STAGE, PALETTE } from '../../config/theater.config'
import {
  woodFloorMaterial,
  plasterMaterial,
  wainscotMaterial,
  ceilingMaterial,
  giltMaterial,
} from '../../materials'

export function Auditorium() {
  const floorMat = useMemo(() => woodFloorMaterial(), [])
  const wallMat = useMemo(() => plasterMaterial({ grime: 0.55, cracks: 0.6 }), [])
  const wainMat = useMemo(() => wainscotMaterial(), [])
  const ceilMat = useMemo(() => ceilingMaterial(), [])
  const giltMat = useMemo(() => giltMaterial(), [])

  const X = HOUSE.sideWallX
  const CY = HOUSE.ceilingY
  const zMid = (STAGE.frontZ + HOUSE.backZ) / 2
  const zLen = HOUSE.backZ - STAGE.frontZ
  const dado = 1.25

  return (
    <group name="Auditorium">
      <Box
        name="HouseFloor"
        args={[X * 2, 0.4, zLen]}
        position={[0, -0.2, zMid]}
        material={floorMat}
        castShadow={false}
      />

      {[-1, 1].map((s) => (
        <group key={`wall-${s}`}>
          <Box
            args={[0.3, CY - dado, zLen]}
            position={[s * X, dado + (CY - dado) / 2, zMid]}
            material={wallMat}
            castShadow={false}
          />
          <Box args={[0.36, dado, zLen]} position={[s * X, dado / 2, zMid]} material={wainMat} castShadow={false} />
          <Box args={[0.42, 0.18, zLen]} position={[s * X, CY - 0.12, zMid]} material={giltMat} castShadow={false} />
          <Box args={[0.42, 0.09, zLen]} position={[s * X, dado, zMid]} material={giltMat} castShadow={false} />
        </group>
      ))}

      {/* rear wall — left/right panels + header leave a central doorway */}
      <Box args={[X - 1.5, CY, 0.3]} position={[-(X + 1.5) / 2, CY / 2, HOUSE.backZ]} material={wallMat} castShadow={false} />
      <Box args={[X - 1.5, CY, 0.3]} position={[(X + 1.5) / 2, CY / 2, HOUSE.backZ]} material={wallMat} castShadow={false} />
      <Box args={[3, CY - 3, 0.3]} position={[0, 3 + (CY - 3) / 2, HOUSE.backZ]} material={wallMat} castShadow={false} />

      {/* front wall framing the proscenium opening */}
      <Box args={[3.3, CY, 0.4]} position={[-6.35, CY / 2, STAGE.frontZ]} material={wallMat} castShadow={false} />
      <Box args={[3.3, CY, 0.4]} position={[6.35, CY / 2, STAGE.frontZ]} material={wallMat} castShadow={false} />
      <Box args={[9.4, CY - 6.4, 0.4]} position={[0, 6.4 + (CY - 6.4) / 2, STAGE.frontZ]} material={wallMat} castShadow={false} />

      {/* ceiling */}
      <Box name="Ceiling" args={[X * 2, 0.3, zLen]} position={[0, CY + 0.15, zMid]} material={ceilMat} castShadow={false} />
      {/* a shallow gilt ceiling cove for depth */}
      <Box args={[X * 2 - 1.4, 0.12, zLen - 1.4]} position={[0, CY - 0.18, zMid]} material={giltMat} castShadow={false} receiveShadow={false} />
    </group>
  )
}
