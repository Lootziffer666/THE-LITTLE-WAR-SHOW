/**
 * THE DESIGN SYSTEM for the theater.
 *
 * Every module — geometry, lighting, dressing, sub-agent-authored rooms —
 * reads its dimensions, coordinates and colours from here so the whole
 * building stays coherent. Numbers are in metres; the palette is in sRGB hex.
 *
 * Coordinate convention (right-handed, matches the original Godot diorama):
 *   +X = stage-right→left as seen by audience' nope: +X to the RIGHT of audience
 *   +Y = up
 *   +Z = toward the audience / house (the stage recedes into −Z)
 *   Origin = centre of the stage floor, at house-floor datum (y=0 is house
 *   floor at the very front row; the stage deck sits at STAGE.deckY).
 *
 * The palette and the diorama camera are carried forward from the look the
 * client already approved in StageBootstrap.gd (warm key, bloomed footlights,
 * deep-red velvet, worn warm wood, near-black stage house, tilt-shift DoF).
 */

export type LightMode = 'house' | 'dark' | 'show'

/** Master palette (sRGB hex). Grouped by surface family. */
export const PALETTE = {
  // --- wood -------------------------------------------------------------
  woodFloorLight: '#7a5532', // trodden oak, the lighter worn body
  woodFloorDark: '#4a3019', // grain + the dark of the gaps
  woodStageDeck: '#5d3f24', // stage boards, a touch redder
  woodDark: '#34230f', // apron face, skirting, crates
  woodTrim: '#6b4a28',

  // --- drapery / upholstery --------------------------------------------
  curtainRed: '#7c1418', // the great house curtain (velvet)
  curtainShadow: '#3f0a0d',
  velourSeat: '#6e1a20', // faded crimson velour
  velourSeatWorn: '#8c343a', // rubbed-bright wear on arms/edges
  velourBack: '#581319',

  // --- walls / architecture --------------------------------------------
  plasterWarm: '#b39a6e', // aged cream plaster, house walls
  plasterShadow: '#7c6843',
  wainscot: '#3c2a1a', // dark wood dado below the rail
  ceiling: '#241d26', // deep aubergine-charcoal house ceiling
  proscenium: '#9c7b3c', // gilded proscenium arch
  prosceniumDeep: '#5e4622', // recessed shadow of the gilt mouldings

  // --- foyer (1950s US) -------------------------------------------------
  foyerWall: '#2f5d57', // teal diner wall
  foyerAccent: '#d9b25a', // warm brass/gold
  carpetRed: '#7a1f24',
  carpetGold: '#c89a3e',
  chrome: '#c9ced3',
  cherryRed: '#c1272d', // soda-fountain enamel red
  cream: '#efe6cf',
  neonPink: '#ff5d8f',
  neonCyan: '#41e8ff',

  // --- metal / fixtures -------------------------------------------------
  brass: '#b48a3a',
  brassDark: '#6f5320',
  steelDark: '#23262b',
  blackIron: '#141414',

  // --- glass / town -----------------------------------------------------
  glassTint: '#9fb8bf',
  duskSky: '#243a52',
  duskSkyLow: '#caa06a',

  // --- grime / life -----------------------------------------------------
  dust: '#cdbfa0',
  grime: '#231a12',
  cobweb: '#d8d2c4',

  // --- light colours ----------------------------------------------------
  keyWarm: '#fff2d9',
  fillWarm: '#ffd9b3',
  footWarm: '#ffb366',
  houseWarm: '#ffdaa8',
  exitGreen: '#39ff88',
  moonCool: '#9fc0ff',
  emberOrange: '#ff7a2a',
} as const

/** Stage box — generalised from the Godot diorama (8×5) to a grander 9×6. */
export const STAGE = {
  width: 9,
  depth: 6,
  deckY: 1.0, // stage deck height above the front-row house floor
  deckThickness: 0.25,
  frontZ: 3.0, // apron lip (toward audience)
  backZ: -3.0, // back wall of the stage / cyclorama
  apronHeight: 1.0,
} as const

export const PROSCENIUM = {
  openingWidth: 9.4,
  openingHeight: 5.4,
  frameDepth: 1.0,
  frameThickness: 0.9,
  topY: STAGE.deckY + 5.4, // 6.4
  valanceDrop: 0.9,
  fliesBarY: 6.9,
  z: STAGE.frontZ + 0.2,
} as const

/** Auditorium / house. Floor rakes upward as it recedes from the stage. */
export const HOUSE = {
  width: 16, // inner wall to inner wall
  halfWidth: 8,
  frontZ: 3.6, // where seating begins (after a shallow orchestra strip)
  backZ: 19.0, // rear house wall (with the projection/control booth)
  floorFrontY: 0.0,
  rakePerMetre: 0.085, // rise toward the back
  ceilingY: 8.2,
  sideWallX: 8,
  aisleWidth: 1.4,
} as const

/** Seating grid — split into two blocks by a centre aisle. */
export const SEATING = {
  rows: 9,
  seatsPerBlock: 6, // per side of the centre aisle
  rowSpacing: 1.05,
  seatWidth: 0.62,
  seatPitch: 0.7,
  firstRowZ: 5.0,
  seatBaseHeight: 0.46,
} as const

/** Foyer (1950s American small-town movie-house lobby), beyond the rear wall. */
export const FOYER = {
  z0: HOUSE.backZ + 0.4, // 19.4 — foyer starts here
  z1: HOUSE.backZ + 8.0, // 27.0 — glass storefront onto the street
  width: 16,
  ceilingY: 4.3,
  floorY: HOUSE.floorFrontY + HOUSE.rakePerMetre * (HOUSE.backZ - HOUSE.frontZ), // continues the rake datum
  glassZ: HOUSE.backZ + 8.0,
} as const

/** Backstage & service rooms live behind the stage (−Z) and in the wings. */
export const BACKSTAGE = {
  z0: STAGE.backZ - 0.4, // -3.4
  z1: STAGE.backZ - 7.0, // -10.0 (rear exterior wall)
  width: 14,
  ceilingY: 5.0,
  wingX: STAGE.width / 2 + 0.6, // edge of the wings
} as const

/** Diorama camera — the Octopath/HD-2D angle from the approved Godot look. */
export const CAMERA = {
  position: [3.0, 4.4, 12.5] as [number, number, number],
  target: [0, STAGE.deckY + 1.2, 0] as [number, number, number],
  fov: 42,
  near: 0.1,
  far: 200,
  // Tilt-shift focus band (used by PostFX): world-space focus distance & range.
  dofFocus: 11.0,
  dofRange: 7.0,
  dofStrength: 0.85,
} as const

/**
 * Lighting presets for the three switch states the client asked for:
 * house lights ON, everything OFF, and the show SPOT. Energies are tuned for
 * an ACES-filmic pipeline with bloom; the bulbs/footlights carry the glow.
 */
export const LIGHT_PRESETS: Record<
  LightMode,
  {
    ambient: number
    ambientColor: string
    houseChandeliers: number
    footlights: number
    keySpot: number
    fill: number
    exitSigns: number
    moonThroughGlass: number
    embers: number
    bloomStrength: number
    bloomThreshold: number
    exposure: number
    fogDensity: number
    fogColor: string
  }
> = {
  house: {
    ambient: 0.55,
    ambientColor: PALETTE.houseWarm,
    houseChandeliers: 3.4,
    footlights: 0.4,
    keySpot: 0.0,
    fill: 0.8,
    exitSigns: 1.0,
    moonThroughGlass: 0.4,
    embers: 0.0,
    bloomStrength: 0.45,
    bloomThreshold: 0.9,
    exposure: 1.0,
    fogDensity: 0.012,
    fogColor: '#3a2c20',
  },
  dark: {
    ambient: 0.08,
    ambientColor: '#1a2236',
    houseChandeliers: 0.0,
    footlights: 0.0,
    keySpot: 0.0,
    fill: 0.05,
    exitSigns: 1.6,
    moonThroughGlass: 1.5,
    embers: 0.7,
    bloomStrength: 0.85,
    bloomThreshold: 0.6,
    exposure: 1.25,
    fogDensity: 0.03,
    fogColor: '#10151f',
  },
  show: {
    ambient: 0.12,
    ambientColor: '#241a22',
    houseChandeliers: 0.0,
    footlights: 1.7,
    keySpot: 5.5,
    fill: 0.5,
    exitSigns: 1.2,
    moonThroughGlass: 0.5,
    embers: 0.0,
    bloomStrength: 0.9,
    bloomThreshold: 0.8,
    exposure: 1.1,
    fogDensity: 0.045, // thickest — the show beam needs air to cut through
    fogColor: '#241814',
  },
}

/** Named, controllable stage props the tech console can manipulate. */
export interface StagePropDef {
  id: string
  label: string
  /** Home transform on the stage deck (local to stage centre). */
  home: { pos: [number, number, number]; rotY: number }
  /** How far the console fader can travel the prop on each axis. */
  travel: { x: number; y: number; z: number }
}

export const STAGE_PROPS: StagePropDef[] = [
  { id: 'cannon', label: 'Cardboard Cannon', home: { pos: [-2.2, STAGE.deckY, -0.6], rotY: 0.2 }, travel: { x: 3, y: 0.2, z: 1.5 } },
  { id: 'flag', label: 'Glorious Banner', home: { pos: [2.6, STAGE.deckY, -1.4], rotY: -0.15 }, travel: { x: 2, y: 2.4, z: 1 } },
  { id: 'cloud', label: 'Painted Cloud', home: { pos: [0.0, STAGE.deckY + 3.4, -2.4], rotY: 0 }, travel: { x: 4, y: 1.2, z: 0.5 } },
  { id: 'crate', label: 'Supply Crate', home: { pos: [3.1, STAGE.deckY, 0.8], rotY: 0.5 }, travel: { x: 2, y: 1.5, z: 1.2 } },
  { id: 'moon', label: 'Tin Moon', home: { pos: [-3.0, STAGE.deckY + 3.8, -2.5], rotY: 0 }, travel: { x: 5, y: 1.0, z: 0.4 } },
]

/** Pyrotechnic emitters mounted at the footlight line. */
export const PYRO_EMITTERS: { id: string; pos: [number, number, number] }[] = [
  { id: 'pyroL', pos: [-2.6, STAGE.deckY + 0.05, STAGE.frontZ - 0.4] },
  { id: 'pyroC', pos: [0.0, STAGE.deckY + 0.05, STAGE.frontZ - 0.6] },
  { id: 'pyroR', pos: [2.6, STAGE.deckY + 0.05, STAGE.frontZ - 0.4] },
]

/** A single deterministic seed so the building looks identical every reload. */
export const WORLD_SEED = 0x1ec5

/** Quality knobs (auto-detected at runtime, overridable from the HUD). */
export const QUALITY_DEFAULTS = {
  dustCount: 4200,
  shadowMapSize: 2048,
  maxPixelRatio: 2,
} as const
