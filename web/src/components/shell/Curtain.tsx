/**
 * The great house curtain — two velvet travelers that part on a spring. Driven
 * by `store.curtain` (0 shut → 1 open); react-spring eases the motion and the
 * panels gather (scale-x) as they slide into the wings.
 */
import { useMemo } from 'react'
import { a, useSpring } from '@react-spring/three'
import { STAGE, PROSCENIUM } from '../../config/theater.config'
import { curtainVelvetMaterial } from '../../materials'
import { useTheaterStore } from '../../state/useTheaterStore'

export function Curtain() {
  const target = useTheaterStore((s) => s.curtain)
  const mat = useMemo(() => curtainVelvetMaterial(), [])
  const { open } = useSpring({ open: target, config: { mass: 1.2, tension: 80, friction: 26 } })

  const panelW = PROSCENIUM.openingWidth / 2 + 0.4
  const panelH = PROSCENIUM.openingHeight + 0.3
  const cy = STAGE.deckY + panelH / 2
  const z = PROSCENIUM.z - 0.35
  const travel = panelW - 0.4

  return (
    <a.group name="Curtain">
      {[-1, 1].map((s) => (
        <a.group
          key={`panel-${s}`}
          position-x={open.to((o: number) => s * (panelW / 2 - 0.4) + s * o * travel)}
          position-y={cy}
          position-z={z}
          scale-x={open.to((o: number) => 1 - o * 0.5)}
        >
          <mesh material={mat} castShadow>
            <boxGeometry args={[panelW, panelH, 0.25]} />
          </mesh>
        </a.group>
      ))}
    </a.group>
  )
}
