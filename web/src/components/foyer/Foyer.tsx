/**
 * The foyer — a 1950s American small-town movie-house lobby beyond the rear
 * doorway: patterned carpet, teal walls, a brass box office, a chrome-and-
 * cherry-red snack bar with a glowing popcorn machine, neon signage, and a
 * glass storefront onto a dusk-lit street of little buildings and a parked car.
 */
import { useMemo } from 'react'
import * as THREE from 'three/webgpu'
import { FOYER, HOUSE, PALETTE, WORLD_SEED } from '../../config/theater.config'
import {
  carpetMaterial,
  plasterMaterial,
  ceilingMaterial,
  chromeMaterial,
  glassMaterial,
  brassMaterial,
  steelMaterial,
  darkWoodMaterial,
  emissiveMaterial,
  posterMaterial,
} from '../../materials'
import { texture, float } from '../../materials/tsl'
import { c, cnode } from '../../materials/tsl-helpers'
import { makeCanvasTexture } from '../../textures/canvasTexture'
import { snackMenu, boxOfficeCard, marqueeSign } from '../../textures/posters'
import { Rng } from '../../utils/rng'

type V3 = [number, number, number]

function windowTex(seed: number, cols: number, rows: number) {
  return makeCanvasTexture(128, 256, (ctx, w, h) => {
    ctx.fillStyle = '#0b0d11'
    ctx.fillRect(0, 0, w, h)
    const rng = new Rng(seed)
    const mw = w / cols
    const mh = h / rows
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const on = rng.chance(0.55)
        ctx.fillStyle = on ? (rng.chance(0.3) ? '#ffd98a' : '#ffe6b0') : '#16191f'
        ctx.fillRect(x * mw + mw * 0.2, y * mh + mh * 0.2, mw * 0.6, mh * 0.6)
      }
    }
  })
}

function facadeMaterial(tex: THREE.Texture) {
  const m = new THREE.MeshStandardNodeMaterial()
  m.colorNode = cnode('#0c0e12')
  m.emissiveNode = texture(tex).mul(1.5)
  m.roughnessNode = float(0.9)
  m.toneMapped = false
  return m
}

function Town() {
  const mats = useMemo(() => {
    const sky = makeCanvasTexture(512, 256, (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, 0, h)
      g.addColorStop(0, '#1b2b46')
      g.addColorStop(0.55, '#3a4a63')
      g.addColorStop(0.8, '#caa06a')
      g.addColorStop(1, '#e0b277')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
      // a few stars
      ctx.fillStyle = '#dfe7ff'
      for (let i = 0; i < 60; i++) ctx.fillRect(Math.random() * w, Math.random() * h * 0.5, 1, 1)
    })
    const skyMat = new THREE.MeshBasicNodeMaterial()
    skyMat.colorNode = texture(sky)
    skyMat.toneMapped = false
    return {
      sky: skyMat,
      street: steelMaterial({ tone: '#1d1f22', rough: 0.85 }),
      curb: plasterMaterial({ color: '#7a766e', grime: 0.3, cracks: 0.2 }),
      lamp: emissiveMaterial('#ffce85', 3),
      pole: steelMaterial({ tone: '#23262b', rough: 0.6 }),
      carBody: (() => {
        const m = new THREE.MeshStandardNodeMaterial()
        m.color = c('#5a8fa6')
        m.metalness = 0.5 as unknown as number
        m.roughness = 0.35 as unknown as number
        return m
      })(),
      glass: glassMaterial({ tint: '#20303a', opacity: 0.5 }),
      tail: emissiveMaterial('#ff3b30', 2),
    }
  }, [])

  const buildings = useMemo(() => {
    const rng = new Rng(WORLD_SEED ^ 0x70a0)
    const out: { pos: V3; size: V3; tex: THREE.Texture; sign?: boolean }[] = []
    let x = -9
    while (x < 9) {
      const wdt = rng.range(2.2, 3.6)
      const hgt = rng.range(3, 6.5)
      const dep = rng.range(2, 3.5)
      out.push({
        pos: [x + wdt / 2, hgt / 2, FOYER.glassZ + 2.4 + rng.range(0, 2)],
        size: [wdt, hgt, dep],
        tex: windowTex(rng.int(1, 9999), rng.int(2, 4), rng.int(3, 6)),
        sign: rng.chance(0.4),
      })
      x += wdt + rng.range(0.1, 0.5)
    }
    return out
  }, [])

  return (
    <group name="Town">
      {/* sky backdrop */}
      <mesh material={mats.sky} position={[0, 5, FOYER.glassZ + 14]}>
        <planeGeometry args={[60, 26]} />
      </mesh>
      {/* street + curb */}
      <mesh material={mats.street} position={[0, -0.02, FOYER.glassZ + 3]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 8]} />
      </mesh>
      <mesh material={mats.curb} position={[0, 0.08, FOYER.glassZ + 0.6]}>
        <boxGeometry args={[60, 0.16, 0.4]} />
      </mesh>
      {/* buildings */}
      {buildings.map((b, i) => (
        <group key={i}>
          <mesh material={facadeMaterial(b.tex)} position={b.pos}>
            <boxGeometry args={b.size} />
          </mesh>
          {b.sign && (
            <mesh material={mats.tail} position={[b.pos[0], b.pos[1] + b.size[1] / 2 + 0.1, b.pos[2] - b.size[2] / 2]}>
              <boxGeometry args={[b.size[0] * 0.5, 0.25, 0.06]} />
            </mesh>
          )}
        </group>
      ))}
      {/* streetlight */}
      <group position={[-4.5, 0, FOYER.glassZ + 1.4]}>
        <mesh material={mats.pole} position={[0, 1.9, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.06, 3.8, 10]} />
        </mesh>
        <mesh material={mats.lamp} position={[0.3, 3.7, 0]}>
          <sphereGeometry args={[0.14, 12, 10]} />
        </mesh>
        <pointLight color="#ffce85" intensity={6} distance={9} decay={2} position={[0.3, 3.6, 0]} />
      </group>
      {/* a parked 1950s car */}
      <group position={[3.6, 0, FOYER.glassZ + 2.0]} rotation={[0, -0.2, 0]}>
        <mesh material={mats.carBody} position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[1.1, 0.5, 2.6]} />
        </mesh>
        <mesh material={mats.carBody} position={[0, 0.85, -0.1]} castShadow>
          <boxGeometry args={[1.0, 0.45, 1.3]} />
        </mesh>
        <mesh material={mats.glass} position={[0, 0.86, -0.1]}>
          <boxGeometry args={[1.02, 0.4, 1.2]} />
        </mesh>
        {[
          [-0.55, 0.95],
          [0.55, 0.95],
          [-0.55, -0.95],
          [0.55, -0.95],
        ].map(([wx, wz], i) => (
          <mesh key={i} material={mats.pole} position={[wx, 0.22, wz]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.24, 0.24, 0.12, 14]} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function Storefront({ glass }: { glass: THREE.Material }) {
  const frame = useMemo(() => brassMaterial(), [])
  const mullions: V3[] = [
    [-4, 1.7, FOYER.glassZ],
    [-1.3, 1.7, FOYER.glassZ],
    [1.3, 1.7, FOYER.glassZ],
    [4, 1.7, FOYER.glassZ],
  ]
  return (
    <group name="Storefront">
      <mesh material={glass} position={[0, 1.8, FOYER.glassZ]}>
        <boxGeometry args={[FOYER.width - 1, 3.4, 0.08]} />
      </mesh>
      {mullions.map((p, i) => (
        <mesh key={i} material={frame} position={p} castShadow>
          <boxGeometry args={[0.1, 3.5, 0.16]} />
        </mesh>
      ))}
      <mesh material={frame} position={[0, 3.5, FOYER.glassZ]} castShadow>
        <boxGeometry args={[FOYER.width - 0.8, 0.16, 0.18]} />
      </mesh>
      <mesh material={frame} position={[0, 0.1, FOYER.glassZ]}>
        <boxGeometry args={[FOYER.width - 0.8, 0.2, 0.2]} />
      </mesh>
    </group>
  )
}

export function Foyer() {
  const mats = useMemo(
    () => ({
      carpet: carpetMaterial(),
      wall: plasterMaterial({ color: PALETTE.foyerWall, grime: 0.3, cracks: 0.3 }),
      ceil: ceilingMaterial(),
      chrome: chromeMaterial(),
      cherry: (() => {
        const m = new THREE.MeshStandardNodeMaterial()
        m.color = c(PALETTE.cherryRed)
        m.roughness = 0.3 as unknown as number
        return m
      })(),
      glass: glassMaterial({ tint: PALETTE.glassTint, opacity: 0.16 }),
      brass: brassMaterial(),
      wood: darkWoodMaterial({ tone: '#3a2614' }),
      popGlow: emissiveMaterial(PALETTE.footWarm, 2.5),
      neon: emissiveMaterial(PALETTE.neonPink, 2.4),
      neon2: emissiveMaterial(PALETTE.neonCyan, 2.4),
      menu: posterMaterial(snackMenu()),
      box: posterMaterial(boxOfficeCard()),
      marquee: emissiveMaterial('#ffe9b0', 1.4),
      marqueeTex: posterMaterial(marqueeSign()),
    }),
    [],
  )

  const cz = (FOYER.z0 + FOYER.z1) / 2
  const zLen = FOYER.z1 - FOYER.z0
  const X = HOUSE.sideWallX

  return (
    <group name="Foyer">
      {/* shell */}
      <mesh material={mats.carpet} position={[0, -0.02, cz]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[FOYER.width, zLen]} />
      </mesh>
      <mesh material={mats.ceil} position={[0, FOYER.ceilingY, cz]}>
        <boxGeometry args={[FOYER.width, 0.3, zLen]} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} material={mats.wall} position={[s * X, FOYER.ceilingY / 2, cz]}>
          <boxGeometry args={[0.3, FOYER.ceilingY, zLen]} />
        </mesh>
      ))}

      {/* double doors into the house, slightly ajar */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 1.5, 1.5, HOUSE.backZ + 0.3]} rotation={[0, s * 0.5, 0]}>
          <mesh material={mats.wood} position={[-s * 0.7, 0, 0]} castShadow>
            <boxGeometry args={[1.4, 3, 0.08]} />
          </mesh>
          <mesh material={mats.glass} position={[-s * 0.7, 0.7, 0.01]}>
            <cylinderGeometry args={[0.28, 0.28, 0.1, 20]} />
          </mesh>
        </group>
      ))}

      {/* box office booth (centre of the lobby) */}
      <group position={[-2.5, 0, FOYER.z0 + 2.2]}>
        <mesh material={mats.wood} position={[0, 0.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 1.2, 1.2]} />
        </mesh>
        <mesh material={mats.brass} position={[0, 1.25, 0]} castShadow>
          <boxGeometry args={[1.9, 0.12, 1.3]} />
        </mesh>
        <mesh material={mats.glass} position={[0, 1.85, -0.55]}>
          <boxGeometry args={[1.7, 1.1, 0.05]} />
        </mesh>
        <mesh material={mats.box} position={[0, 2.0, 0.62]}>
          <planeGeometry args={[1.2, 0.9]} />
        </mesh>
        <pointLight color={PALETTE.footWarm} intensity={4} distance={5} decay={2} position={[0, 1.6, 0]} />
      </group>

      {/* snack bar along the +X wall */}
      <group position={[X - 1.4, 0, cz + 1]}>
        <mesh material={mats.cherry} position={[0, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 1.1, 4.2]} />
        </mesh>
        <mesh material={mats.chrome} position={[0, 1.16, 0]} castShadow>
          <boxGeometry args={[1.7, 0.08, 4.3]} />
        </mesh>
        {/* popcorn machine */}
        <group position={[-0.1, 1.2, -1.2]}>
          <mesh material={mats.chrome} position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[0.9, 1.0, 0.8]} />
          </mesh>
          <mesh material={mats.glass} position={[0, 0.55, 0.02]}>
            <boxGeometry args={[0.78, 0.7, 0.78]} />
          </mesh>
          <mesh material={mats.popGlow} position={[0, 0.4, 0]}>
            <boxGeometry args={[0.7, 0.35, 0.7]} />
          </mesh>
          <pointLight color={PALETTE.footWarm} intensity={3} distance={3} decay={2} position={[0, 0.6, 0.4]} />
        </group>
        {/* backlit menu board */}
        <mesh material={mats.menu} position={[0.75, 2.2, 0.6]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[2.4, 1.5]} />
        </mesh>
      </group>

      {/* neon: an OPEN sign + marquee board on the lobby wall */}
      <group position={[-X + 0.4, 3.3, cz]}>
        <mesh material={mats.neon} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.5, 0.04, 10, 28]} />
        </mesh>
        <mesh material={mats.neon2} position={[0, -0.9, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[1.6, 0.06, 0.06]} />
        </mesh>
      </group>
      <mesh material={mats.marqueeTex} position={[0, 3.7, FOYER.z0 + 0.1]}>
        <planeGeometry args={[6, 1.5]} />
      </mesh>

      <Storefront glass={mats.glass} />
      <Town />
    </group>
  )
}
