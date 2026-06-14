/**
 * The material library. Every factory returns a configured TSL NodeMaterial.
 * Quality is concentrated on the surfaces the brief names explicitly —
 * trodden floorboards, velour seats, the velvet curtain, aged plaster — with
 * sensible procedural treatments for everything else.
 *
 * Reuse these everywhere so the building reads as one coherent place.
 */
import * as THREE from 'three/webgpu'
import {
  float,
  vec2,
  vec3,
  uv,
  positionWorld,
  positionLocal,
  normalWorld,
  time,
  mix,
  smoothstep,
  step,
  clamp,
  fract,
  floor,
  abs,
  sin,
  max,
  texture,
  bumpMap,
} from './tsl'
import { PALETTE } from '../config/theater.config'
import { c, cnode, fbm, unoise, hash11, hash21, worley, facingRatio, type TNode } from './tsl-helpers'

type StdMat = THREE.MeshStandardNodeMaterial
type PhysMat = THREE.MeshPhysicalNodeMaterial

/* ------------------------------------------------------------------ */
/* WOOD                                                               */
/* ------------------------------------------------------------------ */

/**
 * Trodden floorboards. Long planks with staggered end-joints, per-plank tint
 * variation, long grain + fine pores, dark grooves between boards, and most
 * importantly **wear lanes** down the centre aisle and across the front where
 * decades of feet have polished and lightened the wood.
 */
export function woodFloorMaterial(opts: { boardWidth?: number; tone?: [string, string] } = {}): StdMat {
  const m = new THREE.MeshStandardNodeMaterial()
  const boardW = opts.boardWidth ?? 0.2
  const x = positionWorld.x
  const z = positionWorld.z

  const bz = z.div(boardW)
  const boardId = floor(bz)
  const inBoard = fract(bz)

  // staggered planks along X
  const xs = x.div(2.7).add(hash11(boardId).mul(5.0))
  const plankId = floor(xs)
  const inPlank = fract(xs)
  const plankRnd = hash21(vec2(boardId, plankId))

  const light = cnode(opts.tone?.[0] ?? PALETTE.woodFloorLight)
  const dark = cnode(opts.tone?.[1] ?? PALETTE.woodFloorDark)

  let col = mix(dark, light, float(0.45).add(plankRnd.mul(0.55)))
  // long grain streaks (stretched along the board length)
  const grain = fbm(vec3(x.mul(3.2), boardId.mul(2.0), z.mul(55.0)), 4)
  col = mix(col, dark, grain.mul(0.45))
  // fine pores
  const pore = fbm(vec3(x.mul(90.0), boardId, z.mul(240.0)), 2)
  col = col.mul(float(0.86).add(pore.mul(0.28)))

  // grooves: board gaps (Z) + plank end-joints (X)
  const gapZ = smoothstep(0.0, 0.05, inBoard).mul(smoothstep(1.0, 0.95, inBoard))
  const gapX = smoothstep(0.0, 0.014, inPlank).mul(smoothstep(1.0, 0.986, inPlank))
  const board = clamp(gapZ.mul(gapX), 0, 1) // 1 on the board face, 0 in a groove
  col = mix(cnode(PALETTE.woodDark).mul(0.35), col, board)

  // wear lanes: centre aisle (x≈0) and a cross-lane near the front rows
  const aisle = smoothstep(1.7, 0.3, abs(x))
  const cross = smoothstep(4.5, 1.5, abs(z.sub(4.0)))
  const traffic = clamp(max(aisle, cross.mul(0.8)).mul(fbm(vec3(x.mul(0.25), 3.0, z.mul(0.25)), 3).add(0.5)), 0, 1)
  col = mix(col, col.mul(1.18).add(0.015), traffic.mul(0.6)) // polished + lighter

  // grime creeping from the walls / under seating
  const corner = smoothstep(6.0, 8.2, abs(x)).mul(0.6)
  col = mix(col, cnode(PALETTE.grime), corner.mul(fbm(vec3(x.mul(0.6), 1.0, z.mul(0.6)), 3)))

  m.colorNode = col
  m.metalnessNode = float(0)
  // worn wood is smoother & faintly polished; grooves are matte
  m.roughnessNode = clamp(mix(float(0.82), float(0.42), traffic).mul(mix(float(1.0), float(1.25), board.oneMinus())), 0.3, 1.0)
  // height: grain ridges minus the grooves, plus pores
  const height = grain.mul(0.35).add(board.oneMinus().mul(-0.7)).add(pore.mul(0.08))
  m.normalNode = bumpMap(height, float(0.45))
  return m
}

/** Stage boards — redder, less wear than the house, with a scuffed centre. */
export function stageDeckMaterial(): StdMat {
  const m = woodFloorMaterial({ boardWidth: 0.16, tone: [PALETTE.woodStageDeck, PALETTE.woodDark] })
  const x = positionWorld.x
  const z = positionWorld.z
  // central scuff where performers stand: subtle grey rub
  const scuff = smoothstep(2.6, 0.0, abs(x)).mul(smoothstep(2.4, 0.0, abs(z))).mul(0.35)
  m.colorNode = mix(m.colorNode as TNode, cnode('#6a5a48'), scuff.mul(fbm(vec3(x.mul(2.0), 9.0, z.mul(2.0)), 3)))
  return m
}

/** Plain dark stained wood: apron face, skirting, crates, dado. */
export function darkWoodMaterial(opts: { tone?: string; planks?: boolean } = {}): StdMat {
  const m = new THREE.MeshStandardNodeMaterial()
  const lp = positionLocal
  const grain = fbm(vec3(lp.x.mul(6.0), lp.y.mul(60.0), lp.z.mul(6.0)), 4)
  let col = cnode(opts.tone ?? PALETTE.woodDark)
  col = col.mul(float(0.8).add(grain.mul(0.4)))
  if (opts.planks !== false) {
    const seam = fract(lp.y.mul(5.0))
    col = mix(col.mul(0.6), col, smoothstep(0.0, 0.06, seam).mul(smoothstep(1.0, 0.94, seam)))
  }
  m.colorNode = col
  m.roughnessNode = float(0.7).sub(grain.mul(0.15))
  m.metalnessNode = float(0)
  m.normalNode = bumpMap(grain, float(0.25))
  return m
}

/* ------------------------------------------------------------------ */
/* UPHOLSTERY / DRAPERY                                                */
/* ------------------------------------------------------------------ */

/** Velour seat fabric: deep nap, warm retroreflective sheen, rubbed-bright wear. */
export function velourMaterial(opts: { color?: string; worn?: number } = {}): PhysMat {
  const m = new THREE.MeshPhysicalNodeMaterial()
  const base = cnode(opts.color ?? PALETTE.velourSeat)
  const wornCol = cnode(PALETTE.velourSeatWorn)
  const lp = positionLocal

  const nap = fbm(vec3(lp.x.mul(70), lp.y.mul(70), lp.z.mul(70)), 3)
  const rub = clamp(fbm(vec3(lp.x.mul(7), lp.y.mul(7), lp.z.mul(7)), 3).mul(1.5).sub(0.55), 0, 1).mul(opts.worn ?? 0.55)
  let col = mix(base, wornCol, rub)
  col = col.mul(float(0.82).add(nap.mul(0.36)))
  // settled dust catches on the upward nap
  col = mix(col, cnode(PALETTE.dust), normalWorld.y.max(0).mul(0.06))

  m.colorNode = col
  m.roughnessNode = mix(float(0.92), float(0.7), rub)
  m.metalness = 0
  m.sheen = 1.0
  m.sheenRoughness = 0.55
  m.sheenColor = c('#ff9d86')
  m.normalNode = bumpMap(nap, float(0.16))
  return m
}

/** The great house curtain: vertical pleats, weave, dusty hem, velvet sheen. */
export function curtainVelvetMaterial(opts: { color?: string } = {}): PhysMat {
  const m = new THREE.MeshPhysicalNodeMaterial()
  const base = cnode(opts.color ?? PALETTE.curtainRed)
  const shadow = cnode(PALETTE.curtainShadow)
  const lp = positionLocal

  const pleat = sin(lp.x.mul(26.0)).mul(0.5).add(0.5).pow(1.4)
  let col = mix(shadow, base, pleat)
  const weave = fbm(vec3(lp.x.mul(60), lp.y.mul(60), 0), 2)
  col = col.mul(float(0.86).add(weave.mul(0.28)))
  // dusty, faded hem at the bottom
  const hem = clamp(smoothstep(0.0, 1.4, lp.y), 0, 1)
  col = mix(col.mul(0.72).add(cnode(PALETTE.dust).mul(0.05)), col, hem)

  m.colorNode = col
  m.roughnessNode = float(0.86)
  m.metalness = 0
  m.sheen = 1.0
  m.sheenRoughness = 0.4
  m.sheenColor = c('#c14b3f')
  m.normalNode = bumpMap(sin(lp.x.mul(26.0)).mul(0.5).add(weave.mul(0.2)), float(0.5))
  return m
}

/** Generic cloth: dust sheets over stored scenery, drapes, banners. */
export function fabricMaterial(opts: { color?: string; foldScale?: number } = {}): StdMat {
  const m = new THREE.MeshStandardNodeMaterial()
  const lp = positionLocal
  const fs = opts.foldScale ?? 3.0
  const folds = fbm(vec3(lp.x.mul(fs), lp.y.mul(fs), lp.z.mul(fs)), 3)
  let col = cnode(opts.color ?? '#b9ad97')
  col = col.mul(float(0.78).add(folds.mul(0.4)))
  // grey dust gathers on top faces
  col = mix(col, cnode(PALETTE.dust).mul(0.9), clamp(normalWorld.y, 0, 1).mul(0.25).add(fbm(vec3(lp.x.mul(0.5), 2.0, lp.z.mul(0.5)), 2).mul(0.1)))
  m.colorNode = col
  m.roughnessNode = float(0.95)
  m.metalnessNode = float(0)
  m.normalNode = bumpMap(folds, float(0.35))
  return m
}

/* ------------------------------------------------------------------ */
/* ARCHITECTURE                                                       */
/* ------------------------------------------------------------------ */

/** Aged warm plaster for house walls: mottling, hairline cracks, low grime. */
export function plasterMaterial(opts: { color?: string; grime?: number; cracks?: number } = {}): StdMat {
  const m = new THREE.MeshStandardNodeMaterial()
  const lp = positionLocal
  const base = cnode(opts.color ?? PALETTE.plasterWarm)
  const shade = cnode(PALETTE.plasterShadow)

  const mottle = fbm(vec3(lp.x.mul(1.6), lp.y.mul(1.6), lp.z.mul(1.6)), 4)
  let col = mix(base, shade, mottle.mul(0.5))
  const fine = unoise(vec3(lp.x.mul(40), lp.y.mul(40), lp.z.mul(40)))
  col = col.mul(float(0.92).add(fine.mul(0.16)))

  // hairline cracks via thin worley ridges
  const crackAmt = opts.cracks ?? 0.5
  const cr = worley(vec3(lp.x.mul(3.0), lp.y.mul(3.0), lp.z.mul(0.3)), 1.0)
  const crack = smoothstep(0.04, 0.0, cr).mul(crackAmt)
  col = mix(col, shade.mul(0.5), crack)

  // grime + water stains rising from the skirting (low y)
  const grimeAmt = opts.grime ?? 0.4
  const rise = smoothstep(2.2, 0.0, lp.y).mul(grimeAmt)
  col = mix(col, cnode(PALETTE.grime), rise.mul(fbm(vec3(lp.x.mul(1.2), lp.y.mul(0.6), lp.z.mul(1.2)), 3)))

  m.colorNode = col
  m.metalnessNode = float(0)
  m.roughnessNode = clamp(float(0.85).add(crack.mul(0.1)).sub(rise.mul(0.1)), 0.5, 1)
  m.normalNode = bumpMap(mottle.mul(0.3).add(crack.mul(-0.6)).add(fine.mul(0.1)), float(0.3))
  return m
}

/** Dark painted wood wainscot / dado panelling. */
export function wainscotMaterial(opts: { color?: string } = {}): StdMat {
  const m = darkWoodMaterial({ tone: opts.color ?? PALETTE.wainscot, planks: true })
  m.roughnessNode = float(0.5) // painted, a little gloss
  return m
}

/** Deep house ceiling with faint water staining. */
export function ceilingMaterial(): StdMat {
  const m = new THREE.MeshStandardNodeMaterial()
  const lp = positionLocal
  const stain = fbm(vec3(lp.x.mul(0.7), 0.0, lp.z.mul(0.7)), 4)
  let col = cnode(PALETTE.ceiling)
  col = mix(col, cnode('#3a3022'), smoothstep(0.55, 0.8, stain).mul(0.5))
  col = col.mul(float(0.9).add(unoise(vec3(lp.x.mul(20), 0, lp.z.mul(20))).mul(0.16)))
  m.colorNode = col
  m.roughnessNode = float(0.95)
  m.metalnessNode = float(0)
  return m
}

/** Patterned foyer carpet: red/gold deco motif, trodden flat in the lanes. */
export function carpetMaterial(): StdMat {
  const m = new THREE.MeshStandardNodeMaterial()
  const x = positionWorld.x
  const z = positionWorld.z
  // repeating diamond motif
  const cell = vec2(fract(x.mul(0.5)).sub(0.5), fract(z.mul(0.5)).sub(0.5))
  const diamond = abs(cell.x).add(abs(cell.y))
  const motif = smoothstep(0.18, 0.22, diamond).oneMinus()
  let col = mix(cnode(PALETTE.carpetRed), cnode(PALETTE.carpetGold), motif)
  const fuzz = fbm(vec3(x.mul(30), 0, z.mul(30)), 3)
  col = col.mul(float(0.8).add(fuzz.mul(0.4)))
  // trodden lane down the middle, flattened & darkened
  const lane = smoothstep(2.2, 0.4, abs(x))
  col = mix(col, col.mul(0.7), lane.mul(0.5))
  m.colorNode = col
  m.roughnessNode = float(0.95).sub(lane.mul(0.2))
  m.metalnessNode = float(0)
  m.normalNode = bumpMap(fuzz.mul(lane.oneMinus()), float(0.2))
  return m
}

/** Terrazzo: cream ground with red/black/grey chips, polished, matte where trodden. */
export function terrazzoMaterial(): StdMat {
  const m = new THREE.MeshStandardNodeMaterial()
  const x = positionWorld.x
  const z = positionWorld.z
  const p = vec3(x.mul(22), float(0), z.mul(22))
  let col = cnode('#d8cfb8')
  col = mix(col, cnode('#7a1f1c'), step(0.74, fbm(p, 2)))
  col = mix(col, cnode('#2a2620'), step(0.8, fbm(p.add(11.3), 2)))
  col = mix(col, cnode('#8a8a86'), step(0.78, fbm(p.add(5.0), 2)))
  col = col.mul(float(0.9).add(fbm(vec3(x.mul(2), float(0), z.mul(2)), 3).mul(0.18)))
  // worn, matte lane down the entrance axis (x≈0)
  const lane = smoothstep(2.4, 0.3, abs(x))
  m.colorNode = col
  m.metalnessNode = float(0)
  m.roughnessNode = clamp(float(0.32).add(lane.mul(0.4)), 0.25, 0.85)
  return m
}

/** Bare service-area concrete: backstage, storage, plant rooms. */
export function concreteMaterial(opts: { color?: string } = {}): StdMat {
  const m = new THREE.MeshStandardNodeMaterial()
  const wp = positionWorld
  const n = fbm(vec3(wp.x.mul(2.0), wp.y.mul(2.0), wp.z.mul(2.0)), 5)
  let col = cnode(opts.color ?? '#5a5650')
  col = col.mul(float(0.75).add(n.mul(0.45)))
  // oil/grime blotches
  col = mix(col, cnode('#26221d'), smoothstep(0.62, 0.78, fbm(vec3(wp.x.mul(0.4), 4.0, wp.z.mul(0.4)), 3)).mul(0.6))
  m.colorNode = col
  m.roughnessNode = float(0.9)
  m.metalnessNode = float(0)
  m.normalNode = bumpMap(n, float(0.15))
  return m
}

/* ------------------------------------------------------------------ */
/* METALS                                                             */
/* ------------------------------------------------------------------ */

/** Tarnished gilt for the proscenium arch & ornament. */
export function giltMaterial(opts: { tone?: string } = {}): StdMat {
  const m = new THREE.MeshStandardNodeMaterial()
  const lp = positionLocal
  const wear = fbm(vec3(lp.x.mul(4), lp.y.mul(4), lp.z.mul(4)), 4)
  let col = mix(cnode(opts.tone ?? PALETTE.proscenium), cnode(PALETTE.prosceniumDeep), wear.mul(0.7))
  m.colorNode = col
  m.metalnessNode = clamp(float(0.9).sub(wear.mul(0.5)), 0.2, 1) // grime kills the metalness in the recesses
  m.roughnessNode = clamp(float(0.35).add(wear.mul(0.5)), 0.25, 0.95)
  return m
}

export function brassMaterial(opts: { tone?: string } = {}): StdMat {
  const m = new THREE.MeshStandardNodeMaterial()
  const lp = positionLocal
  const wear = fbm(vec3(lp.x.mul(8), lp.y.mul(8), lp.z.mul(8)), 3)
  m.colorNode = mix(cnode(opts.tone ?? PALETTE.brass), cnode(PALETTE.brassDark), wear.mul(0.6))
  m.metalnessNode = float(0.95)
  m.roughnessNode = clamp(float(0.3).add(wear.mul(0.45)), 0.2, 0.9)
  return m
}

export function steelMaterial(opts: { tone?: string; rough?: number } = {}): StdMat {
  const m = new THREE.MeshStandardNodeMaterial()
  const lp = positionLocal
  const wear = fbm(vec3(lp.x.mul(10), lp.y.mul(10), lp.z.mul(10)), 3)
  m.colorNode = cnode(opts.tone ?? PALETTE.steelDark).mul(float(0.8).add(wear.mul(0.3)))
  m.metalnessNode = float(0.85)
  m.roughnessNode = float(opts.rough ?? 0.5).add(wear.mul(0.3))
  return m
}

/** Bright 1950s diner chrome. */
export function chromeMaterial(): StdMat {
  const m = new THREE.MeshStandardNodeMaterial()
  m.colorNode = cnode(PALETTE.chrome)
  m.metalnessNode = float(1.0)
  m.roughnessNode = float(0.12).add(fbm(vec3(positionLocal.mul(20)), 2).mul(0.08))
  return m
}

/** Matte black iron (railings, light fixtures, fire escapes). */
export function blackIronMaterial(): StdMat {
  const m = new THREE.MeshStandardNodeMaterial()
  m.colorNode = cnode(PALETTE.blackIron).mul(float(0.8).add(fbm(vec3(positionLocal.mul(6)), 3).mul(0.4)))
  m.metalnessNode = float(0.6)
  m.roughnessNode = float(0.6)
  return m
}

/* ------------------------------------------------------------------ */
/* GLASS / SCREENS / EMISSIVE                                          */
/* ------------------------------------------------------------------ */

/** Storefront glass: see-through, lightly smudged, brighter at grazing angles. */
export function glassMaterial(opts: { tint?: string; opacity?: number } = {}): PhysMat {
  const m = new THREE.MeshPhysicalNodeMaterial()
  m.color = c(opts.tint ?? PALETTE.glassTint)
  m.metalness = 0
  m.transparent = true
  m.side = THREE.DoubleSide
  const lp = positionLocal
  const smudge = fbm(vec3(lp.x.mul(2.5), lp.y.mul(2.5), 0), 3)
  m.roughnessNode = float(0.04).add(smudge.mul(0.1))
  const rim = facingRatio().oneMinus().pow(2.5)
  m.opacityNode = clamp(float(opts.opacity ?? 0.12).add(rim.mul(0.55)).add(smudge.mul(0.05)), 0.08, 0.85)
  return m
}

/**
 * Unlit-ish emissive for bulbs, exit signs, neon — the things that drive bloom.
 * Pass a `glow` uniform node (see systems/lightUniforms) and the emission
 * scales with the current lighting state and flicker, so a bulb is dark when
 * its circuit is "off".
 */
export function emissiveMaterial(hex: string, intensity = 4, glow?: TNode): StdMat {
  const m = new THREE.MeshStandardNodeMaterial()
  const e = cnode(hex).mul(intensity)
  m.colorNode = cnode(hex).mul(0.06)
  m.emissiveNode = glow ? e.mul(glow) : e
  m.roughnessNode = float(1)
  m.metalnessNode = float(0)
  m.toneMapped = false // let the bulbs blow out and bloom
  return m
}

/** Painted scenery flat / poster: takes a baked texture, ages it a touch. */
export function paintedFlatMaterial(map: THREE.Texture, opts: { rough?: number; age?: number } = {}): StdMat {
  const m = new THREE.MeshStandardNodeMaterial()
  const base = texture(map)
  const age = opts.age ?? 0.15
  const grime = fbm(vec3(uv().mul(6), 0), 3)
  m.colorNode = mix(base, base.mul(0.65), grime.mul(age))
  m.roughnessNode = float(opts.rough ?? 0.7)
  m.metalnessNode = float(0)
  m.normalNode = bumpMap(fbm(vec3(uv().mul(40), 0), 2), float(0.05))
  // surface overlay (sits on a wall/flat) — bias it forward to never z-fight
  m.polygonOffset = true
  m.polygonOffsetFactor = -2
  m.polygonOffsetUnits = -2
  return m
}

/** Glossy paper poster from a baked texture, with a crinkle. */
export function posterMaterial(map: THREE.Texture, opts: { gloss?: number } = {}): StdMat {
  const m = new THREE.MeshStandardNodeMaterial()
  m.colorNode = texture(map)
  m.roughnessNode = float(opts.gloss ?? 0.55).add(fbm(vec3(uv().mul(8), 0), 2).mul(0.2))
  m.metalnessNode = float(0)
  m.normalNode = bumpMap(fbm(vec3(uv().mul(24), 0), 3), float(0.08))
  m.polygonOffset = true
  m.polygonOffsetFactor = -2
  m.polygonOffsetUnits = -2
  return m
}

/* ------------------------------------------------------------------ */
/* ANIMATED — cobweb shimmer, screens                                 */
/* ------------------------------------------------------------------ */

/** Faint, dusty cobweb material — translucent, catches light at the edges. */
export function cobwebMaterial(): StdMat {
  const m = new THREE.MeshStandardNodeMaterial()
  m.colorNode = cnode(PALETTE.cobweb)
  m.transparent = true
  m.side = THREE.DoubleSide
  m.depthWrite = false
  const rim = facingRatio().oneMinus().pow(1.5)
  const dust = fbm(vec3(uv().mul(30), time.mul(0.05)), 3)
  m.opacityNode = clamp(rim.mul(0.5).add(dust.mul(0.08)), 0, 0.6)
  m.roughnessNode = float(1)
  m.metalnessNode = float(0)
  return m
}

export const materials = {
  woodFloorMaterial,
  stageDeckMaterial,
  darkWoodMaterial,
  velourMaterial,
  curtainVelvetMaterial,
  fabricMaterial,
  plasterMaterial,
  wainscotMaterial,
  ceilingMaterial,
  carpetMaterial,
  terrazzoMaterial,
  concreteMaterial,
  giltMaterial,
  brassMaterial,
  steelMaterial,
  chromeMaterial,
  blackIronMaterial,
  glassMaterial,
  emissiveMaterial,
  paintedFlatMaterial,
  posterMaterial,
  cobwebMaterial,
}
