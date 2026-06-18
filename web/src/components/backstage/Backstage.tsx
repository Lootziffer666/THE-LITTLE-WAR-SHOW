/**
 * Behind the cyclorama: the working guts of the house. A crossover corridor and
 * wings (rigging, sandbags, prop table), a storage room of stacked flats and
 * dust-sheeted unused scenery, a staff/dressing room with a bulb-lit mirror, a
 * paperwork-strewn office, and a tiled restroom with a flickering tube. Lit by
 * bare practicals on the house circuit. Floor sits at stage-deck level.
 */
import { useMemo } from 'react'
import * as THREE from 'three/webgpu'
import { STAGE, BACKSTAGE, PALETTE, WORLD_SEED } from '../../config/theater.config'
import {
  concreteMaterial,
  plasterMaterial,
  fabricMaterial,
  paintedFlatMaterial,
  darkWoodMaterial,
  steelMaterial,
  blackIronMaterial,
  brassMaterial,
  chromeMaterial,
  emissiveMaterial,
} from '../../materials'
import { c } from '../../materials/tsl-helpers'
import { showPoster } from '../../textures/posters'
import { makeCanvasTexture } from '../../textures/canvasTexture'
import { glow } from '../../systems/lightUniforms'
import { Rng } from '../../utils/rng'

type V3 = [number, number, number]
const FY = STAGE.deckY // backstage floor level

function Bulb({ position }: { position: V3 }) {
  const mat = useMemo(() => emissiveMaterial(PALETTE.houseWarm, 4, glow.house), [])
  return (
    <group position={position}>
      <mesh material={mat}>
        <sphereGeometry args={[0.07, 12, 10]} />
      </mesh>
      <pointLight color={PALETTE.houseWarm} intensity={5} distance={5} decay={2} />
    </group>
  )
}

export function Backstage() {
  const mats = useMemo(() => {
    const corkTex = makeCanvasTexture(384, 256, (ctx, w, h) => {
      ctx.fillStyle = '#9c6b3a'
      ctx.fillRect(0, 0, w, h)
      const notes = [
        ['#f3ead0', 'CAST CALL 6:30. NO EXCEPTIONS.'],
        ['#fff7b0', 'PUPPET DEPT: order more cardboard'],
        ['#ffd9d2', 'Cannon misfires — it is SUPPOSED to'],
        ['#d9f0ff', 'Mgmt memo: morale is now mandatory'],
      ]
      notes.forEach(([col, txt], i) => {
        ctx.save()
        ctx.translate(20 + (i % 2) * 190, 30 + Math.floor(i / 2) * 110)
        ctx.rotate((Math.random() - 0.5) * 0.1)
        ctx.fillStyle = col as string
        ctx.fillRect(0, 0, 170, 90)
        ctx.fillStyle = '#2a2018'
        ctx.font = '600 13px Georgia, serif'
        wrap(ctx, txt as string, 10, 24, 150, 16)
        ctx.restore()
      })
    })
    return {
      concrete: concreteMaterial(),
      wall: plasterMaterial({ color: '#6e6450', grime: 0.6, cracks: 0.5 }),
      sheet: fabricMaterial({ color: '#b9ad97', foldScale: 2.5 }),
      sand: fabricMaterial({ color: '#7a6a45', foldScale: 5 }),
      cloth: fabricMaterial({ color: '#7a2b30', foldScale: 4 }),
      wood: darkWoodMaterial({ tone: '#4a3320' }),
      crate: darkWoodMaterial({ tone: '#5a3f24' }),
      steel: steelMaterial({ tone: '#33373c' }),
      iron: blackIronMaterial(),
      brass: brassMaterial(),
      chrome: chromeMaterial(),
      tile: plasterMaterial({ color: '#bcc6c2', grime: 0.4, cracks: 0.3 }),
      mirror: (() => {
        const m = new THREE.MeshStandardNodeMaterial()
        m.color = c('#aebfc4')
        m.metalness = 0.9 as unknown as number
        m.roughness = 0.08 as unknown as number
        return m
      })(),
      exit: emissiveMaterial(PALETTE.exitGreen, 3, glow.exit),
      tube: emissiveMaterial('#dfe7ff', 3, glow.flicker),
      mirrorBulb: emissiveMaterial('#fff0c0', 3, glow.house),
      flat1: paintedFlatMaterial(showPoster('occupation'), { rough: 0.9 }),
      flat2: paintedFlatMaterial(showPoster('tyrants'), { rough: 0.9 }),
      cork: paintedFlatMaterial(corkTex, { rough: 0.95 }),
    }
  }, [])

  const cz = (BACKSTAGE.z0 + BACKSTAGE.z1) / 2
  const zLen = BACKSTAGE.z0 - BACKSTAGE.z1
  const X = BACKSTAGE.width / 2
  const CY = FY + BACKSTAGE.ceilingY

  return (
    <group name="Backstage">
      {/* shell */}
      <mesh material={mats.concrete} position={[0, FY - 0.1, cz]} receiveShadow>
        <boxGeometry args={[BACKSTAGE.width, 0.2, zLen]} />
      </mesh>
      <mesh material={mats.wall} position={[0, (FY + CY) / 2, BACKSTAGE.z1]}>
        <boxGeometry args={[BACKSTAGE.width, CY - FY, 0.3]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} material={mats.wall} position={[s * X, (FY + CY) / 2, cz]}>
          <boxGeometry args={[0.3, CY - FY, zLen]} />
        </mesh>
      ))}
      <mesh material={mats.concrete} position={[0, CY, cz]}>
        <boxGeometry args={[BACKSTAGE.width, 0.3, zLen]} />
      </mesh>

      <Bulb position={[-3, CY - 0.5, -5.5]} />
      <Bulb position={[3.5, CY - 0.5, -8]} />
      <mesh material={mats.exit} position={[0, FY + 2.4, -3.5]}>
        <boxGeometry args={[0.5, 0.22, 0.08]} />
      </mesh>

      {/* WINGS beside the stage: rigging + sandbags + prop table */}
      {[-1, 1].map((s) => (
        <group key={`wing-${s}`} position={[s * BACKSTAGE.wingX, 0, 0]}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} material={mats.iron} position={[s * 0.2 * i, FY + 2.5, -0.5 - i * 0.8]} castShadow>
              <cylinderGeometry args={[0.012, 0.012, 5, 6]} />
            </mesh>
          ))}
          {[0, 1].map((i) => (
            <mesh key={`sb${i}`} material={mats.sand} position={[s * 0.2, FY + 0.25 + i * 0.001, 1 - i * 0.6]} castShadow>
              <boxGeometry args={[0.4, 0.5, 0.25]} />
            </mesh>
          ))}
        </group>
      ))}

      {/* STORAGE — stacked flats + crates + dust-sheeted unused scenery */}
      <group position={[-X + 2.2, FY, BACKSTAGE.z1 + 1.6]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} material={i % 2 ? mats.flat1 : mats.flat2} position={[i * 0.12, 1.4, i * 0.18]} rotation={[0, 0, 0.04]} castShadow>
            <boxGeometry args={[2.6, 2.8, 0.06]} />
          </mesh>
        ))}
        <mesh material={mats.crate} position={[1.6, 0.4, 0.8]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
        </mesh>
        <mesh material={mats.crate} position={[2.2, 0.3, 1.4]} rotation={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
        </mesh>
        {/* the covered, unused set piece — a draped dust sheet over a stack */}
        <mesh material={mats.sheet} position={[1.9, 0.75, 2.3]} rotation={[0, 0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.7, 1.5, 1.3]} />
        </mesh>
        <mesh material={mats.sheet} position={[1.9, 1.52, 2.3]} rotation={[0.1, 0.2, 0]} castShadow>
          <boxGeometry args={[1.85, 0.2, 1.45]} />
        </mesh>
      </group>

      {/* STAFF / DRESSING ROOM — bulb-lit mirror, counter, rail, sofa */}
      <group position={[X - 2.4, FY, BACKSTAGE.z1 + 1.4]}>
        <mesh material={mats.mirror} position={[0, 1.4, -0.02]}>
          <planeGeometry args={[1.1, 1.3]} />
        </mesh>
        {[-0.55, 0, 0.55].map((x) => (
          <group key={x} position={[x, 2.15, 0.02]}>
            <mesh material={mats.mirrorBulb}>
              <sphereGeometry args={[0.05, 10, 8]} />
            </mesh>
          </group>
        ))}
        <pointLight color="#fff0c0" intensity={3} distance={4} decay={2} position={[0, 1.7, 0.6]} />
        <mesh material={mats.wood} position={[0, 0.85, 0.4]} castShadow receiveShadow>
          <boxGeometry args={[1.3, 0.1, 0.5]} />
        </mesh>
        {/* clothes rail with costumes */}
        <group position={[1.6, 0, 0.6]}>
          <mesh material={mats.iron} position={[0, 1.7, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 1.6, 8]} />
          </mesh>
          {[-0.4, 0, 0.4].map((z) => (
            <mesh key={z} material={mats.cloth} position={[0, 1.1, z]} castShadow>
              <boxGeometry args={[0.4, 1.0, 0.18]} />
            </mesh>
          ))}
        </group>
        {/* tatty sofa */}
        <group position={[-1.4, 0, 1.8]}>
          <mesh material={mats.cloth} position={[0, 0.35, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.4, 0.7]} />
          </mesh>
          <mesh material={mats.cloth} position={[0, 0.7, -0.3]} castShadow>
            <boxGeometry args={[1.5, 0.6, 0.2]} />
          </mesh>
        </group>
      </group>

      {/* OFFICE — desk, chair, cabinet, corkboard, desk lamp */}
      <group position={[X - 2.0, FY, -4.6]}>
        <mesh material={mats.wood} position={[0, 0.72, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.08, 0.7]} />
        </mesh>
        {[
          [-0.6, -0.3],
          [0.6, -0.3],
          [-0.6, 0.3],
          [0.6, 0.3],
        ].map(([x, z], i) => (
          <mesh key={i} material={mats.wood} position={[x, 0.36, z]} castShadow>
            <boxGeometry args={[0.06, 0.72, 0.06]} />
          </mesh>
        ))}
        <mesh material={mats.steel} position={[1.1, 0.6, -0.2]} castShadow receiveShadow>
          <boxGeometry args={[0.5, 1.2, 0.6]} />
        </mesh>
        <mesh material={mats.cork} position={[0, 1.6, -0.45]}>
          <planeGeometry args={[1.4, 0.95]} />
        </mesh>
        <mesh material={mats.brass} position={[-0.4, 0.85, 0]} rotation={[0, 0, 0.3]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.4, 8]} />
        </mesh>
        <mesh material={mats.iron} position={[-0.32, 1.02, 0]} rotation={[0.6, 0, 0]} castShadow>
          <coneGeometry args={[0.07, 0.1, 12, 1, true]} />
        </mesh>
      </group>

      {/* RESTROOM — tiled, two stalls, sink + mirror, flickering tube */}
      <group position={[-X + 2.0, FY, -4.4]}>
        <mesh material={mats.tile} position={[0, 1.4, -0.6]}>
          <boxGeometry args={[3, 2.8, 0.15]} />
        </mesh>
        {[-0.5, 0.7].map((x) => (
          <mesh key={x} material={mats.steel} position={[x, 0.9, 0.2]} castShadow>
            <boxGeometry args={[0.05, 1.8, 1.2]} />
          </mesh>
        ))}
        <mesh material={mats.chrome} position={[1.0, 0.7, -0.4]} castShadow>
          <boxGeometry args={[0.5, 0.2, 0.4]} />
        </mesh>
        <mesh material={mats.mirror} position={[1.0, 1.4, -0.52]}>
          <planeGeometry args={[0.5, 0.6]} />
        </mesh>
        <mesh material={mats.tube} position={[0, 2.5, 0]}>
          <boxGeometry args={[1.4, 0.06, 0.1]} />
        </mesh>
        <pointLight color="#dfe7ff" intensity={2} distance={4} decay={2} position={[0, 2.4, 0]} />
      </group>

      {/* a fire extinguisher and a mop bucket, because regulations */}
      <mesh material={mats.exit} position={[-3, FY + 1.0, -3.6]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.4, 12]} />
      </mesh>
    </group>
  )
}

function wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number) {
  const words = text.split(' ')
  let line = ''
  let yy = y
  for (const w of words) {
    const test = line + w + ' '
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, yy)
      line = w + ' '
      yy += lh
    } else line = test
  }
  ctx.fillText(line, x, yy)
}
