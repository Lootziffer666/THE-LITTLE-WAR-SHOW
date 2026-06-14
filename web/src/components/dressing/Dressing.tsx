/**
 * The "alive" layer — everything that makes the house feel lived-in and a touch
 * neglected: posters for this and other shows, cobwebs in the corners, mice and
 * roaches on their rounds, spiders on their webs, trash that missed the bin,
 * grime the cleaner skipped, forgotten props, and a few easter eggs.
 *
 * Animation is cheap (CPU path-walking on a handful of critters) and pauses
 * when the user prefers reduced motion.
 */
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three/webgpu'
import { HOUSE, STAGE, PROSCENIUM, PALETTE, WORLD_SEED } from '../../config/theater.config'
import {
  posterMaterial,
  cobwebMaterial,
  darkWoodMaterial,
  fabricMaterial,
  steelMaterial,
  blackIronMaterial,
  emissiveMaterial,
} from '../../materials'
import { c } from '../../materials/tsl-helpers'
import { showPoster, POSTER_KEYS } from '../../textures/posters'
import { makeCanvasTexture } from '../../textures/canvasTexture'
import { useTheaterStore } from '../../state/useTheaterStore'
import { Rng } from '../../utils/rng'

type V3 = [number, number, number]

/* --------------------------------- posters -------------------------------- */

function Poster({ texKey, position, rotation, w = 1.2, h = 1.78, frame }: { texKey: string; position: V3; rotation: V3; w?: number; h?: number; frame: THREE.Material }) {
  const mat = useMemo(() => posterMaterial(showPoster(texKey)), [texKey])
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.02]} material={frame} castShadow>
        <boxGeometry args={[w + 0.1, h + 0.1, 0.04]} />
      </mesh>
      <mesh material={mat}>
        <planeGeometry args={[w, h]} />
      </mesh>
    </group>
  )
}

function Posters({ frame }: { frame: THREE.Material }) {
  const rng = useMemo(() => new Rng(WORLD_SEED ^ 0x9051), [])
  const placements = useMemo(() => {
    const X = HOUSE.sideWallX - 0.22
    const list: { texKey: string; position: V3; rotation: V3 }[] = []
    const leftZ = [6.0, 9.6, 13.2, 16.6]
    const rightZ = [7.6, 11.2, 14.8]
    leftZ.forEach((z, i) => list.push({ texKey: POSTER_KEYS[i % POSTER_KEYS.length], position: [-X, 2.3 + rng.range(-0.2, 0.2), z], rotation: [0, Math.PI / 2, rng.range(-0.05, 0.05)] }))
    rightZ.forEach((z, i) => list.push({ texKey: POSTER_KEYS[(i + 2) % POSTER_KEYS.length], position: [X, 2.3 + rng.range(-0.2, 0.2), z], rotation: [0, -Math.PI / 2, rng.range(-0.05, 0.05)] }))
    // a pair flanking the proscenium
    list.push({ texKey: 'warshow', position: [-6.35, 2.6, STAGE.frontZ + 0.22], rotation: [0, 0, rng.range(-0.03, 0.03)] })
    list.push({ texKey: 'dumbality', position: [6.35, 2.6, STAGE.frontZ + 0.22], rotation: [0, 0, rng.range(-0.03, 0.03)] })
    return list
  }, [rng])
  return (
    <group name="Posters">
      {placements.map((p, i) => (
        <Poster key={i} texKey={p.texKey} position={p.position} rotation={p.rotation} frame={frame} />
      ))}
    </group>
  )
}

/* --------------------------------- cobwebs -------------------------------- */

function cornerWebGeometry() {
  // a right-triangle sheet that tucks into a corner, with a little sag
  const g = new THREE.BufferGeometry()
  g.setAttribute(
    'position',
    new THREE.Float32BufferAttribute([0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0.55, -0.18, 0.55, 0, 0, 1], 3),
  )
  g.computeVertexNormals()
  return g
}

function Cobwebs({ mat }: { mat: THREE.Material }) {
  const geo = useMemo(cornerWebGeometry, [])
  const webs = useMemo(() => {
    const rng = new Rng(WORLD_SEED ^ 0xc0bb)
    const out: { position: V3; rotation: V3; scale: number }[] = []
    // proscenium top corners
    out.push({ position: [-PROSCENIUM.openingWidth / 2 + 0.1, PROSCENIUM.topY - 0.1, PROSCENIUM.z], rotation: [0, 0, 0], scale: 1.1 })
    out.push({ position: [PROSCENIUM.openingWidth / 2 - 0.1, PROSCENIUM.topY - 0.1, PROSCENIUM.z], rotation: [0, Math.PI / 2, 0], scale: 1.1 })
    // high wall/ceiling corners down the house
    for (const side of [-1, 1] as const) {
      for (const z of [5.5, 12, 17.5]) {
        out.push({ position: [side * (HOUSE.sideWallX - 0.2), HOUSE.ceilingY - 0.25, z], rotation: [0, side < 0 ? 0 : Math.PI / 2, side < 0 ? 0 : 0], scale: rng.range(0.8, 1.5) })
      }
    }
    return out
  }, [])
  return (
    <group name="Cobwebs">
      {webs.map((wbb, i) => (
        <mesh key={i} geometry={geo} material={mat} position={wbb.position} rotation={wbb.rotation} scale={wbb.scale} renderOrder={4} />
      ))}
    </group>
  )
}

/* --------------------------------- critters ------------------------------- */

function loopLength(path: V3[]) {
  let L = 0
  for (let i = 0; i < path.length; i++) {
    const a = path[i]
    const b = path[(i + 1) % path.length]
    L += Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])
  }
  return L
}
function sampleLoop(path: V3[], s: number): { pos: V3; head: number } {
  let d = s
  for (let i = 0; i < path.length; i++) {
    const a = path[i]
    const b = path[(i + 1) % path.length]
    const seg = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2])
    if (d <= seg) {
      const t = seg < 1e-5 ? 0 : d / seg
      return {
        pos: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t],
        head: Math.atan2(b[0] - a[0], b[2] - a[2]),
      }
    }
    d -= seg
  }
  return { pos: path[0], head: 0 }
}

function Critter({ path, speed, kind, mat }: { path: V3[]; speed: number; kind: 'mouse' | 'roach'; mat: THREE.Material }) {
  const ref = useRef<THREE.Group>(null)
  const len = useMemo(() => loopLength(path), [path])
  const s = useRef(Math.random() * len)
  const t = useRef(Math.random() * 10)
  useFrame((_, dt) => {
    if (useTheaterStore.getState().reducedMotion) return
    const g = ref.current
    if (!g) return
    const d = Math.min(dt, 0.05)
    t.current += d
    // occasional pause for mice
    const moving = kind === 'roach' || Math.sin(t.current * 0.7) > -0.4
    if (moving) s.current = (s.current + d * speed) % len
    const { pos, head } = sampleLoop(path, s.current)
    const scurry = kind === 'roach' ? Math.sin(t.current * 40) * 0.02 : 0
    g.position.set(pos[0], pos[1] + Math.abs(Math.sin(t.current * 16)) * (kind === 'mouse' ? 0.01 : 0.004), pos[2] + scurry)
    g.rotation.y = head
  })
  if (kind === 'mouse') {
    return (
      <group ref={ref}>
        <mesh material={mat} scale={[1, 0.75, 1.5]} castShadow>
          <sphereGeometry args={[0.05, 10, 8]} />
        </mesh>
        <mesh material={mat} position={[0.02, 0.04, 0.05]}>
          <sphereGeometry args={[0.02, 8, 6]} />
        </mesh>
        <mesh material={mat} position={[-0.02, 0.04, 0.05]}>
          <sphereGeometry args={[0.02, 8, 6]} />
        </mesh>
        <mesh material={mat} position={[0, 0.01, -0.12]} rotation={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.004, 0.002, 0.14, 5]} />
        </mesh>
      </group>
    )
  }
  return (
    <group ref={ref}>
      <mesh material={mat} scale={[1, 0.5, 1.7]} castShadow>
        <sphereGeometry args={[0.02, 8, 6]} />
      </mesh>
    </group>
  )
}

function Spider({ position, mat }: { position: V3; mat: THREE.Material }) {
  const ref = useRef<THREE.Group>(null)
  const t = useRef(Math.random() * 6)
  useFrame((_, dt) => {
    if (useTheaterStore.getState().reducedMotion) return
    const g = ref.current
    if (!g) return
    t.current += dt
    g.position.y = position[1] + Math.sin(t.current * 1.3) * 0.03
  })
  return (
    <group ref={ref} position={position}>
      <mesh material={mat} castShadow>
        <sphereGeometry args={[0.025, 8, 6]} />
      </mesh>
      {[-1, 1].map((sx) =>
        [0.3, 0, -0.3].map((a, j) => (
          <mesh key={`${sx}-${j}`} material={mat} position={[sx * 0.02, 0, 0]} rotation={[0, 0, sx * 0.6 + a]}>
            <cylinderGeometry args={[0.002, 0.002, 0.06, 4]} />
          </mesh>
        )),
      )}
    </group>
  )
}

/* ----------------------------- litter & props ----------------------------- */

function TrashCluster({ position, mats }: { position: V3; mats: ReturnType<typeof useDressMats> }) {
  const rng = useMemo(() => new Rng(WORLD_SEED ^ (Math.round(position[2] * 13) | 0x717)), [position])
  const debris = useMemo(() => {
    const out: { p: V3; s: number; r: number; mat: THREE.Material }[] = []
    const n = rng.int(5, 9)
    for (let i = 0; i < n; i++) {
      const ang = rng.range(0, Math.PI * 2)
      const rad = rng.range(0.35, 0.95) // *beside* the bin, missed
      out.push({
        p: [Math.cos(ang) * rad, 0.04 + rng.range(0, 0.03), Math.sin(ang) * rad],
        s: rng.range(0.04, 0.09),
        r: rng.range(0, Math.PI),
        mat: rng.pick([mats.paper, mats.paper, mats.redbox, mats.cup]),
      })
    }
    return out
  }, [rng, mats])
  return (
    <group position={position}>
      <mesh material={mats.bin} position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.19, 0.6, 16]} />
      </mesh>
      {/* an overflowing wad on top */}
      <mesh material={mats.paper} position={[0.05, 0.62, 0]} scale={[1, 0.7, 1]} castShadow>
        <icosahedronGeometry args={[0.12, 0]} />
      </mesh>
      {debris.map((d, i) => (
        <mesh key={i} material={d.mat} position={d.p} rotation={[d.r, d.r * 1.3, 0]} scale={d.s / 0.06} castShadow>
          <icosahedronGeometry args={[0.06, 0]} />
        </mesh>
      ))}
    </group>
  )
}

function Props({ mats }: { mats: ReturnType<typeof useDressMats> }) {
  return (
    <group name="ForgottenProps">
      {/* a broom leaning in the corner */}
      <group position={[HOUSE.sideWallX - 0.5, 0, 4.4]} rotation={[0, 0, 0.18]}>
        <mesh material={mats.wood} position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 1.6, 8]} />
        </mesh>
        <mesh material={mats.straw} position={[0, 0.05, 0]} castShadow>
          <boxGeometry args={[0.22, 0.14, 0.06]} />
        </mesh>
      </group>
      {/* mop bucket */}
      <group position={[HOUSE.sideWallX - 1.0, 0, 4.9]}>
        <mesh material={mats.bin} position={[0, 0.16, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 0.17, 0.32, 14]} />
        </mesh>
        <mesh material={mats.wood} position={[0.1, 0.7, 0]} rotation={[0, 0, -0.25]} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 1.3, 8]} />
        </mesh>
      </group>
      {/* a stack of spare folding chairs */}
      <group position={[-HOUSE.sideWallX + 0.6, 0, 4.2]} rotation={[0, 0.4, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} material={mats.bin} position={[i * 0.04, 0.5 + i * 0.04, i * 0.02]} rotation={[0.1, 0, 0.02]} castShadow>
            <boxGeometry args={[0.42, 0.9, 0.04]} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function EasterEggs({ mats }: { mats: ReturnType<typeof useDressMats> }) {
  const flyer = useMemo(
    () =>
      posterMaterial(
        makeCanvasTexture(256, 360, (ctx, w, h) => {
          ctx.fillStyle = '#e9dfc6'
          ctx.fillRect(0, 0, w, h)
          ctx.fillStyle = '#7c1418'
          ctx.textAlign = 'center'
          ctx.font = '900 40px Arial Narrow, Impact, sans-serif'
          ctx.fillText('MARCH,', w / 2, 150)
          ctx.fillText('YOU IDIOTS.', w / 2, 200)
          ctx.fillStyle = '#3a2c20'
          ctx.font = '600 16px Georgia, serif'
          ctx.fillText('— the management', w / 2, 260)
        }),
      ),
    [],
  )
  return (
    <group name="EasterEggs">
      {/* dropped flyer on the aisle floor */}
      <mesh material={flyer} position={[0.4, 0.012, 8.2]} rotation={[-Math.PI / 2, 0, 0.7]}>
        <planeGeometry args={[0.3, 0.42]} />
      </mesh>
      {/* a lone child's shoe under a seat (never a victim — just lost) */}
      <mesh material={mats.redbox} position={[-1.9, 0.05, 6.1]} rotation={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.18, 0.1, 0.08]} />
      </mesh>
      {/* a rubber duck in the orchestra pit edge */}
      <mesh material={mats.duck} position={[1.4, 0.05, 4.0]} castShadow>
        <sphereGeometry args={[0.07, 12, 10]} />
      </mesh>
      <mesh material={mats.duck} position={[1.43, 0.12, 3.94]} scale={[1, 1, 1.4]} castShadow>
        <sphereGeometry args={[0.04, 10, 8]} />
      </mesh>
    </group>
  )
}

/* --------------------------------- grime ---------------------------------- */

function Grime({ mat }: { mat: THREE.Material }) {
  const spots = useMemo(() => {
    const rng = new Rng(WORLD_SEED ^ 0x6d11)
    const out: { p: V3; s: number; r: number }[] = []
    // dark patches the cleaner missed: wall bases, under seating, corners
    for (let i = 0; i < 26; i++) {
      const side = rng.sign()
      const nearWall = rng.chance(0.6)
      const x = nearWall ? side * rng.range(6.4, 7.7) : rng.range(-5, 5)
      const z = rng.range(4.2, 18)
      out.push({ p: [x, 0.012, z], s: rng.range(0.4, 1.3), r: rng.range(0, Math.PI) })
    }
    return out
  }, [])
  return (
    <group name="Grime">
      {spots.map((g, i) => (
        <mesh key={i} material={mat} position={g.p} rotation={[-Math.PI / 2, 0, g.r]} scale={g.s} renderOrder={1}>
          <circleGeometry args={[0.5, 12]} />
        </mesh>
      ))}
    </group>
  )
}

/* --------------------------- shared materials ----------------------------- */

function useDressMats() {
  return useMemo(() => {
    const grime = new THREE.MeshBasicNodeMaterial()
    grime.color = c('#140d07')
    grime.transparent = true
    grime.opacity = 0.5
    grime.depthWrite = false
    const duck = emissiveMaterial('#ffd23a', 0.5)
    return {
      frame: darkWoodMaterial({ tone: '#241a10' }),
      cobweb: cobwebMaterial(),
      mouse: (() => {
        const m = new THREE.MeshStandardNodeMaterial()
        m.color = c('#2b2620')
        m.roughness = 0.85 as unknown as number
        return m
      })(),
      bin: steelMaterial({ tone: '#3a3d40', rough: 0.6 }),
      paper: fabricMaterial({ color: '#cabf9f', foldScale: 14 }),
      redbox: fabricMaterial({ color: '#b6332f', foldScale: 12 }),
      cup: fabricMaterial({ color: '#dfe7ea', foldScale: 10 }),
      wood: darkWoodMaterial({ tone: PALETTE.woodTrim }),
      straw: fabricMaterial({ color: '#b9933f', foldScale: 22 }),
      iron: blackIronMaterial(),
      grime,
      duck,
    }
  }, [])
}

export function Dressing() {
  const mats = useDressMats()

  const micePaths: V3[][] = [
    [
      [-7.4, 0.03, 5],
      [-7.4, 0.03, 12],
      [-6.6, 0.03, 12.4],
      [-6.8, 0.03, 5.4],
    ],
    [
      [7.4, 0.03, 14],
      [7.4, 0.03, 7],
      [6.4, 0.03, 6.6],
      [6.6, 0.03, 14.2],
    ],
    [
      [-2, 1.03, -2.2],
      [2, 1.03, -2.2],
      [2.2, 1.03, -2.6],
      [-2.2, 1.03, -2.6],
    ], // one bold mouse on the stage
  ]
  const roachPaths: V3[][] = [
    [
      [6.0, 0.02, 17.2],
      [6.9, 0.02, 17.4],
      [6.6, 0.02, 16.6],
    ],
    [
      [-6.2, 0.02, 16.6],
      [-6.9, 0.02, 17.1],
      [-6.4, 0.02, 17.6],
    ],
    [
      [3.0, 1.02, 2.4],
      [3.6, 1.02, 2.0],
      [3.2, 1.02, 1.6],
    ],
  ]

  return (
    <group name="Dressing">
      <Posters frame={mats.frame} />
      <Cobwebs mat={mats.cobweb} />
      <Grime mat={mats.grime} />

      {micePaths.map((p, i) => (
        <Critter key={`m${i}`} path={p} speed={0.7} kind="mouse" mat={mats.mouse} />
      ))}
      {roachPaths.map((p, i) => (
        <Critter key={`r${i}`} path={p} speed={1.4} kind="roach" mat={mats.iron} />
      ))}
      <Spider position={[-PROSCENIUM.openingWidth / 2 + 0.35, PROSCENIUM.topY - 0.45, PROSCENIUM.z - 0.05]} mat={mats.iron} />
      <Spider position={[HOUSE.sideWallX - 0.4, HOUSE.ceilingY - 0.6, 12]} mat={mats.iron} />

      <TrashCluster position={[6.7, 0, 17.4]} mats={mats} />
      <TrashCluster position={[-6.7, 0, 16.8]} mats={mats} />
      <Props mats={mats} />
      <EasterEggs mats={mats} />
    </group>
  )
}
