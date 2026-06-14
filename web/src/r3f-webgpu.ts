/**
 * WebGPU wiring for React-Three-Fiber (R3F v9).
 *
 * Three ships two entry points: the classic WebGL `three` and the node-based
 * `three/webgpu`. We standardise on `three/webgpu` so every material can be a
 * TSL NodeMaterial that compiles to both WGSL (WebGPU) and GLSL (WebGL2).
 *
 * Runtime rule for this prototype:
 * - default = force the safer WebGL backend so first visual inspection does not
 *   die behind an experimental WebGPU/post stack black screen.
 * - add `?webgpu=1` to the URL to re-enable the WebGPU backend.
 *
 * `extend(THREE)` teaches R3F's reconciler about every class in the WebGPU
 * build so they are usable as JSX (`<meshStandardNodeMaterial />`, etc.), and
 * the module augmentation gives those intrinsics full TypeScript types.
 *
 * Verified against three r0.184 + @react-three/fiber 9.6.1.
 */
import * as THREE from 'three/webgpu'
import { extend, type ThreeToJSXElements } from '@react-three/fiber'

declare module '@react-three/fiber' {
  interface ThreeElements extends ThreeToJSXElements<typeof THREE> {}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
extend(THREE as any)

function wantsWebGPU(): boolean {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).has('webgpu')
}

/**
 * Async factory handed to `<Canvas gl={...}>`. R3F awaits the returned promise,
 * which is exactly how a `WebGPURenderer` (which needs `await init()`) wants to
 * be constructed.
 */
export async function createRenderer(props: ConstructorParameters<typeof THREE.WebGPURenderer>[0]) {
  const renderer = new THREE.WebGPURenderer({
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
    forceWebGL: !wantsWebGPU(),
    ...props,
  })
  await renderer.init()

  // Stylised (Hearthstone/Wayfinder) grade — NOT filmic. Neutral tone-mapping
  // keeps colours saturated and punchy instead of the desaturated, "realistic"
  // ACES roll-off. The warm grade + rim live in the materials/post.
  renderer.toneMapping = THREE.NeutralToneMapping
  renderer.toneMappingExposure = 0.66
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  return renderer
}

/** True when the active renderer backend is WebGPU (vs. the WebGL2 fallback). */
export function isWebGPUBackend(renderer: unknown): boolean {
  const r = renderer as { backend?: { isWebGPUBackend?: boolean } } | null
  return Boolean(r?.backend?.isWebGPUBackend)
}

export { THREE }
