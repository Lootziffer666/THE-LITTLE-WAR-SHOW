/**
 * Global theater state (zustand). The "director's desk": which lighting state
 * we're in, how open the curtain is, which stage prop the tech console has
 * selected and where it has travelled it, pyro triggers, and runtime flags.
 *
 * Components subscribe with selectors so a curtain nudge doesn't re-render the
 * vermin, etc.
 */
import { create } from 'zustand'
import { LightMode, STAGE_PROPS } from '../config/theater.config'

export interface PropOverride {
  pos: [number, number, number]
  rotY: number
  visible: boolean
}

function initialOverrides(): Record<string, PropOverride> {
  const o: Record<string, PropOverride> = {}
  for (const p of STAGE_PROPS) {
    o[p.id] = { pos: [...p.home.pos], rotY: p.home.rotY, visible: true }
  }
  return o
}

export interface TheaterState {
  // --- lighting ---------------------------------------------------------
  lightMode: LightMode
  setLightMode: (m: LightMode) => void
  cycleLightMode: () => void

  flicker: boolean
  toggleFlicker: () => void

  /** Post-processing on/off (key P) — for taste, perf, or isolating issues. */
  usePost: boolean
  togglePost: () => void
  setUsePost: (v: boolean) => void

  /** User exposure multiplier (keys [ and ]) — live brightness dial. */
  exposure: number
  nudgeExposure: (d: number) => void

  // --- the great curtain (0 = shut, 1 = wide open) ----------------------
  curtain: number
  setCurtain: (v: number) => void
  toggleCurtain: () => void

  // --- tech console / stage props --------------------------------------
  selectedPropId: string | null
  selectProp: (id: string | null) => void
  propOverrides: Record<string, PropOverride>
  nudgeProp: (id: string, axis: 0 | 1 | 2, delta: number) => void
  togglePropVisible: (id: string) => void
  resetProps: () => void

  // --- pyrotechnics -----------------------------------------------------
  pyroSeq: number
  pyroEmitter: string | null
  firePyro: (emitterId?: string) => void

  // --- runtime flags ----------------------------------------------------
  backend: 'webgpu' | 'webgl' | 'unknown'
  setBackend: (b: 'webgpu' | 'webgl') => void
  reducedMotion: boolean
  setReducedMotion: (v: boolean) => void
  freeLook: boolean
  toggleFreeLook: () => void
  showHelp: boolean
  toggleHelp: () => void
}

const MODES: LightMode[] = ['house', 'show', 'dark']
const PYRO_IDS = ['pyroL', 'pyroC', 'pyroR']

export const useTheaterStore = create<TheaterState>()((set, get) => ({
  lightMode: 'house',
  setLightMode: (m) => set({ lightMode: m }),
  cycleLightMode: () => {
    const i = MODES.indexOf(get().lightMode)
    set({ lightMode: MODES[(i + 1) % MODES.length] })
  },

  flicker: true,
  toggleFlicker: () => set((s) => ({ flicker: !s.flicker })),

  usePost: false,
  togglePost: () => set((s) => ({ usePost: !s.usePost })),
  setUsePost: (v) => set({ usePost: v }),

  exposure: 1,
  nudgeExposure: (d) => set((s) => ({ exposure: Math.min(3, Math.max(0.25, s.exposure + d)) })),

  curtain: 0.0,
  setCurtain: (v) => set({ curtain: Math.min(1, Math.max(0, v)) }),
  toggleCurtain: () => set((s) => ({ curtain: s.curtain > 0.5 ? 0 : 1 })),

  selectedPropId: null,
  selectProp: (id) => set({ selectedPropId: id }),
  propOverrides: initialOverrides(),
  nudgeProp: (id, axis, delta) =>
    set((s) => {
      const cur = s.propOverrides[id]
      if (!cur) return s
      const pos: [number, number, number] = [...cur.pos]
      pos[axis] += delta
      return { propOverrides: { ...s.propOverrides, [id]: { ...cur, pos } } }
    }),
  togglePropVisible: (id) =>
    set((s) => {
      const cur = s.propOverrides[id]
      if (!cur) return s
      return { propOverrides: { ...s.propOverrides, [id]: { ...cur, visible: !cur.visible } } }
    }),
  resetProps: () => set({ propOverrides: initialOverrides(), selectedPropId: null }),

  pyroSeq: 0,
  pyroEmitter: null,
  firePyro: (emitterId) =>
    set((s) => ({
      pyroSeq: s.pyroSeq + 1,
      pyroEmitter: emitterId ?? PYRO_IDS[s.pyroSeq % PYRO_IDS.length],
    })),

  backend: 'unknown',
  setBackend: (b) => set({ backend: b }),
  reducedMotion:
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true,
  setReducedMotion: (v) => set({ reducedMotion: v }),
  freeLook: false,
  toggleFreeLook: () => set((s) => ({ freeLook: !s.freeLook })),
  showHelp: false,
  toggleHelp: () => set((s) => ({ showHelp: !s.showHelp })),
}))
