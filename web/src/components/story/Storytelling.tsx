/**
 * The Barlow Civic Playhouse's personality layer: the signs, taped notes,
 * wear-decals and small story objects from the set bible, placed across all
 * four zones. None of it is explained — it's just there, the way a building
 * that's been "rescued too often" accretes meaning. Copy is verbatim.
 */
import { useMemo } from 'react'
import * as THREE from 'three/webgpu'
import { texture } from '../../materials/tsl'
import {
  paintedFlatMaterial,
  darkWoodMaterial,
  brassMaterial,
  steelMaterial,
  fabricMaterial,
  emissiveMaterial,
} from '../../materials'
import { c } from '../../materials/tsl-helpers'
import { STAGE, PROSCENIUM, HOUSE, FOYER, SEATING } from '../../config/theater.config'
import {
  enamelSign,
  noteCard,
  laminated,
  brassPlaque,
  framedPhotoBW,
  newspaper,
  shelfLabel,
  switchPlate,
  boardWall,
  stageMarks,
  stainDecal,
} from '../../textures/signage'

type V3 = [number, number, number]

const FRAME = darkWoodMaterial({ tone: '#241a10' })
const decalCache = new Map<THREE.Texture, THREE.Material>()
function decalMat(tex: THREE.Texture): THREE.Material {
  let m = decalCache.get(tex)
  if (!m) {
    const mm = new THREE.MeshBasicNodeMaterial()
    const t = texture(tex)
    mm.colorNode = t
    mm.opacityNode = t.a
    mm.transparent = true
    mm.depthWrite = false
    mm.polygonOffset = true
    mm.polygonOffsetFactor = -2
    m = mm
    decalCache.set(tex, m)
  }
  return m
}

function Sign({ tex, position, rotation = [0, 0, 0], w = 1, h = 1, frame = false, rough = 0.8 }: { tex: THREE.Texture; position: V3; rotation?: V3; w?: number; h?: number; frame?: boolean; rough?: number }) {
  const mat = useMemo(() => paintedFlatMaterial(tex, { rough, age: 0.12 }), [tex, rough])
  return (
    <group position={position} rotation={rotation}>
      {frame && (
        <mesh position={[0, 0, -0.018]} material={FRAME} castShadow>
          <boxGeometry args={[w + 0.07, h + 0.07, 0.035]} />
        </mesh>
      )}
      <mesh material={mat}>
        <planeGeometry args={[w, h]} />
      </mesh>
    </group>
  )
}

function Decal({ tex, position, rotation, w, h }: { tex: THREE.Texture; position: V3; rotation: V3; w: number; h: number }) {
  const mat = useMemo(() => decalMat(tex), [tex])
  return (
    <mesh material={mat} position={position} rotation={rotation} renderOrder={2}>
      <planeGeometry args={[w, h]} />
    </mesh>
  )
}

/* --------------------------------- stage ---------------------------------- */
function StageStory() {
  const X = STAGE.width / 2 - 0.18
  return (
    <group name="StageStory">
      {/* years of tape, chalk, scuffs, the piano ghost, footlight scorch */}
      <Decal tex={stageMarks()} position={[0, STAGE.deckY + 0.013, 0]} rotation={[-Math.PI / 2, 0, 0]} w={STAGE.width - 0.4} h={STAGE.depth - 0.5} />
      {/* DO NOT STEP – PIT LIP, on the deck at the apron */}
      <Sign tex={enamelSign('DO NOT STEP', { sub: 'PIT LIP', bg: '#161616', ink: '#ffd23a', w: 512, h: 128 })} position={[0, STAGE.deckY + 0.014, STAGE.frontZ - 0.45]} rotation={[-Math.PI / 2, 0, 0]} w={0.95} h={0.24} />
      {/* SL / SR on the stage-house walls (for the crew, not the house) */}
      <Sign tex={enamelSign('SL', { bg: '#101010', ink: '#f3efe2' })} position={[-X, STAGE.deckY + 1.7, -1]} rotation={[0, Math.PI / 2, 0]} w={0.4} h={0.18} />
      <Sign tex={enamelSign('SR', { bg: '#101010', ink: '#f3efe2' })} position={[X, STAGE.deckY + 1.7, -1]} rotation={[0, -Math.PI / 2, 0]} w={0.4} h={0.18} />
      {/* line-set tags hung off the fly bar */}
      {[
        ['LINE SET 3 — MAIN DRAPE', -2.6],
        ['BATTEN 5 STICKS', 0],
        ['SAND BAG TEMP ONLY', 2.6],
      ].map(([t, x], i) => (
        <Sign key={i} tex={enamelSign(t as string, { bg: '#1a1410', ink: '#e9c06a', w: 512, h: 96 })} position={[x as number, PROSCENIUM.fliesBarY - 0.22, PROSCENIUM.z - 0.42]} w={1.1} h={0.2} />
      ))}
    </group>
  )
}

/* --------------------------------- house ---------------------------------- */
function HouseStory() {
  const mats = useMemo(
    () => ({
      shoe: (() => {
        const m = new THREE.MeshStandardNodeMaterial()
        m.color = c('#7a1f12')
        m.roughness = 0.7 as unknown as number
        return m
      })(),
      prog: fabricMaterial({ color: '#d8cba0', foldScale: 14 }),
    }),
    [],
  )
  const wallX = HOUSE.sideWallX - 0.18
  const rowY = (r: number) => r * 0.16
  return (
    <group name="HouseStory">
      {/* the three-label light switch by the proscenium: HOUSE / STAGE / DO NOT */}
      <Sign tex={switchPlate()} position={[5.9, 1.45, STAGE.frontZ + 0.22]} w={0.16} h={0.26} />
      {/* badly over-painted water stain on a side wall */}
      <Decal tex={stainDecal('water')} position={[-wallX, 3.0, 9.5]} rotation={[0, Math.PI / 2, 0]} w={2.4} h={2.4} />
      {/* QUIET PLEASE, with a lipstick kiss, by the rear door */}
      <Sign tex={enamelSign('QUIET', { sub: 'PLEASE', bg: '#5a1518', ink: '#f3efe2' })} position={[2.2, 2.2, HOUSE.backZ - 0.18]} rotation={[0, Math.PI, 0]} w={0.6} h={0.26} />
      {/* a lost child's shoe and a stuck programme under Row H */}
      <mesh material={mats.shoe} position={[-1.5, rowY(6) + 0.05, SEATING.firstRowZ + 6 * SEATING.rowSpacing - 0.3]} rotation={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.18, 0.09, 0.08]} />
      </mesh>
      <mesh material={mats.prog} position={[1.7, rowY(3) + 0.02, SEATING.firstRowZ + 3 * SEATING.rowSpacing - 0.2]} rotation={[-Math.PI / 2, 0, 0.5]}>
        <planeGeometry args={[0.16, 0.22]} />
      </mesh>
    </group>
  )
}

/* --------------------------------- foyer ---------------------------------- */
function FoyerStory() {
  const cz = (FOYER.z0 + FOYER.z1) / 2
  const wallX = HOUSE.sideWallX - 0.18
  const patrons = ['H. BARLOW', 'THE ELKS', 'D. REYES', null, 'V.F.W. 88', 'M. OKafor', null, 'IN MEMORY']
  return (
    <group name="FoyerStory">
      {/* the institution's self-portrait: 1957 poster + the 1976 'revival' lie */}
      <Sign tex={framedPhotoBW('THE LITTLE WAR SHOW — Summer 1957', 'cast')} position={[-wallX, 2.5, FOYER.z0 + 1.8]} rotation={[0, Math.PI / 2, 0]} w={1.0} h={1.25} frame />
      <Sign tex={noteCard(['Revived by popular request,', '1976.'])} position={[-wallX, 1.45, FOYER.z0 + 1.8]} rotation={[0, Math.PI / 2, 0]} w={0.55} h={0.42} />
      {/* the general saluting the wrong way (water-stained) */}
      <Sign tex={framedPhotoBW('Civic Players salute the colours, 1962', 'salute')} position={[-wallX, 2.5, FOYER.z0 + 3.6]} rotation={[0, Math.PI / 2, 0]} w={0.95} h={1.15} frame />
      {/* newspaper */}
      <Sign tex={newspaper('Local Revue Draws Full House, Mixed Response', 'The Barlow Sentinel, July 1957')} position={[-wallX, 1.3, FOYER.z0 + 3.6]} rotation={[0, Math.PI / 2, 0]} w={0.8} h={0.58} frame />
      {/* Wall of Patrons — brass plaques, some missing (brighter rectangles) */}
      <group>
        {patrons.map((name, i) => (
          <Sign key={i} tex={brassPlaque(name)} position={[wallX, 2.8 - Math.floor(i / 4) * 0.45, cz - 1.4 + (i % 4) * 0.7]} rotation={[0, -Math.PI / 2, 0]} w={0.6} h={0.22} rough={0.4} />
        ))}
      </group>
      {/* concession rules + the sticky floor + the ghost of a bin */}
      <Sign tex={noteCard(['No outside food unless', 'medically required.', 'This includes chili.'])} position={[HOUSE.sideWallX - 0.6, 2.2, cz - 1.6]} rotation={[0, -Math.PI / 2, 0]} w={0.6} h={0.46} />
      <Decal tex={stainDecal('sticky')} position={[HOUSE.sideWallX - 2.7, 0.012, cz + 1]} rotation={[-Math.PI / 2, 0, 0]} w={2.2} h={2.2} />
      <Decal tex={stainDecal('ring')} position={[HOUSE.sideWallX - 3.4, 0.012, FOYER.z0 + 1.2]} rotation={[-Math.PI / 2, 0, 0]} w={1.0} h={1.0} />
      {/* box-office notes */}
      <Sign tex={noteCard(['Do not sell Row C Seat 14', 'unless necessary.'])} position={[-2.5, 1.9, FOYER.z0 + 1.65]} rotation={[0, 0, 0.04]} w={0.5} h={0.36} />
      {/* AIR CONDITIONED — the 1954 promise, with a 2026 drip */}
      <Sign tex={enamelSign('AIR CONDITIONED', { bg: '#0e5b8c', ink: '#eaf4ff', w: 512, h: 160 })} position={[0, 3.6, FOYER.glassZ - 0.25]} w={2.4} h={0.75} />
      <mesh position={[-0.9, 2.8, FOYER.glassZ - 0.3]} material={new THREE.MeshStandardNodeMaterial()}>
        <cylinderGeometry args={[0.02, 0.02, 1.4, 8]} />
      </mesh>
      <Decal tex={stainDecal('water')} position={[-0.9, 0.012, FOYER.glassZ - 0.3]} rotation={[-Math.PI / 2, 0, 0]} w={0.9} h={0.9} />
    </group>
  )
}

/* ------------------------------- backstage -------------------------------- */
function BackstageStory() {
  const FY = STAGE.deckY
  const mats = useMemo(
    () => ({
      wood: darkWoodMaterial({ tone: '#4a3320' }),
      steel: steelMaterial({ tone: '#33373c' }),
      brass: brassMaterial(),
      rifle: darkWoodMaterial({ tone: '#3a2614' }),
      mug: (() => {
        const m = new THREE.MeshStandardNodeMaterial()
        m.color = c('#e9e4d8')
        m.roughness = 0.4 as unknown as number
        return m
      })(),
      bouquet: fabricMaterial({ color: '#8a7a4a', foldScale: 10 }),
      applause: emissiveMaterial('#ffe9b0', 0.4),
      box: fabricMaterial({ color: '#b08a52', foldScale: 8 }),
    }),
    [],
  )
  const bx = -HOUSE.sideWallX + 0.25 // -ish; backstage is narrower but reuse wall idea
  return (
    <group name="BackstageStory" position={[0, 0, 0]}>
      {/* admin wall + green room board + emergency procedures */}
      <Sign tex={boardWall('STAGE MANAGEMENT', ['Cast call 6:30. No exceptions.', 'Probentermine — see Carl', 'Feuerwehrabnahme 4/12 ✓', 'Telefon: Booth x2, Kasse x4', 'Missing: Civil War sabre. Not funny.', 'Board meeting moved to basement (smell)'])} position={[bx + 5.4, FY + 2.6, -9.7]} w={2.0} h={1.5} />
      <Sign tex={boardWall('GREEN ROOM', ['Auditions Tuesday', 'Please wash mugs', 'Missing: Civil War sabre. NOT funny.', 'The Little War Show — revival sched.', 'A child drew a tank. We kept it.', 'Do not mention Act II to Donna.'])} position={[bx + 1.0, FY + 2.6, -9.7]} w={2.0} h={1.5} />
      <Sign tex={laminated('EMERGENCY PROCEDURES', ['Call 911.', 'Sound the alarm at SM desk.', 'Open both stage-door bolts.', 'Account for cast at the marquee.'], 'Unless Carl has the key.')} position={[bx + 3.0, FY + 1.5, -9.78]} w={0.8} h={1.05} />
      <Sign tex={enamelSign('NO SMOKING', { sub: 'INCLUDING CHARACTER WORK', bg: '#7c1418', ink: '#f3efe2', w: 512, h: 160 })} position={[-3.5, FY + 2.4, -3.55]} rotation={[0, 0, 0]} w={1.4} h={0.44} />

      {/* prop room: a labelled shelf rack with a few objects */}
      <group position={[HOUSE.sideWallX - 1.4, FY, -8.5]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} material={mats.wood} position={[0, 0.6 + i * 1.0, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.4, 0.06, 0.5]} />
          </mesh>
        ))}
        {[
          ['WAR — FUNNY', 1.6],
          ['RIFLES — WOOD ONLY', 0.6],
          ['CROWNS / MAYORS / JUDGES', 2.6],
        ].map(([t, y], i) => (
          <Sign key={i} tex={shelfLabel(t as string)} position={[0.02, y as number, 0.6 + i * 0.0]} rotation={[0, -Math.PI / 2, 0]} w={0.7} h={0.18} />
        ))}
        {/* a wooden rifle labelled NOT REAL */}
        <mesh material={mats.rifle} position={[0.1, 1.7, 0.4]} rotation={[0, -Math.PI / 2, 0.08]} castShadow>
          <boxGeometry args={[0.9, 0.05, 0.05]} />
        </mesh>
        <Sign tex={shelfLabel('NOT REAL — DO NOT ARGUE')} position={[0.04, 1.5, 0.4]} rotation={[0, -Math.PI / 2, 0]} w={0.7} h={0.14} />
        {/* an APPLAUSE sign, not connected, leaning */}
        <mesh material={mats.applause} position={[0.1, 0.75, -0.6]} rotation={[0, -Math.PI / 2, 0.18]} castShadow>
          <boxGeometry args={[0.7, 0.28, 0.06]} />
        </mesh>
        {/* a box of Emergency Mustaches */}
        <mesh material={mats.box} position={[0.05, 2.78, -0.4]} castShadow>
          <boxGeometry args={[0.4, 0.25, 0.3]} />
        </mesh>
        <Sign tex={shelfLabel('EMERGENCY MUSTACHES')} position={[0.27, 2.78, -0.4]} rotation={[0, -Math.PI / 2, 0]} w={0.36} h={0.1} />
      </group>

      {/* small story objects on a wing table */}
      <group position={[-HOUSE.sideWallX + 1.6, FY + 0.86, -4.6]}>
        {/* World's Okayest Stage Manager mug */}
        <mesh material={mats.mug} position={[0, 0.05, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.045, 0.1, 16]} />
        </mesh>
        {/* ashtray full of screws */}
        <mesh material={mats.steel} position={[0.3, 0.02, 0.1]} castShadow>
          <cylinderGeometry args={[0.08, 0.07, 0.04, 16]} />
        </mesh>
        {/* a dried bouquet with a card: You survived Act II */}
        <mesh material={mats.bouquet} position={[-0.3, 0.12, -0.1]} rotation={[0.3, 0, 0.2]} castShadow>
          <coneGeometry args={[0.07, 0.28, 8, 1, true]} />
        </mesh>
        <Sign tex={noteCard(['You survived Act II'])} position={[-0.3, 0.06, 0.12]} rotation={[-Math.PI / 2, 0, 0]} w={0.18} h={0.12} />
      </group>
    </group>
  )
}

export function Storytelling() {
  return (
    <group name="Storytelling">
      <StageStory />
      <HouseStory />
      <FoyerStory />
      <BackstageStory />
    </group>
  )
}
