/**
 * Shared TSL building blocks. Procedural detail is how we get "high-res
 * textures" without shipping a single binary: every surface is a node graph
 * that compiles to WGSL on WebGPU and GLSL on the WebGL2 fallback.
 *
 * Node primitives come from the permissive `./tsl` facade (never `three/tsl`
 * directly) so chaining and vector construction type-check cleanly.
 */
import * as THREE from 'three/webgpu'
import {
  color,
  float,
  vec2,
  fract,
  sin,
  dot,
  clamp,
  normalView,
  positionViewDirection,
  mx_noise_float,
  mx_fractal_noise_float,
  mx_cell_noise_float,
  mx_worley_noise_float,
} from './tsl'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TNode = any

const colorCache = new Map<string, THREE.Color>()
/** Cached, color-managed THREE.Color from an sRGB hex string. */
export function c(hex: string): THREE.Color {
  let col = colorCache.get(hex)
  if (!col) {
    col = new THREE.Color(hex)
    colorCache.set(hex, col)
  }
  return col
}
/** A TSL color node from an sRGB hex string. */
export const cnode = (hex: string): TNode => color(c(hex))

/** Gradient noise in [-1,1]. */
export const snoise = (p: TNode): TNode => mx_noise_float(p)
/** Gradient noise remapped to [0,1]. */
export const unoise = (p: TNode): TNode => mx_noise_float(p).mul(0.5).add(0.5)
/** fBm in [0,1] (all four MaterialX args supplied — three accepts them). */
export const fbm = (p: TNode, octaves = 4, lacunarity = 2.0, diminish = 0.5): TNode =>
  mx_fractal_noise_float(p, octaves, lacunarity, diminish).mul(0.5).add(0.5)
/** Cellular noise. */
export const cellNoise = (p: TNode): TNode => mx_cell_noise_float(p)
/** Worley/Voronoi distance field (exported TSL form takes position + jitter). */
export const worley = (p: TNode, jitter = 1.0): TNode => mx_worley_noise_float(p, jitter)

/** 1D → [0,1] hash. */
export function hash11(n: TNode): TNode {
  return fract(sin(float(n).mul(127.1)).mul(43758.5453))
}
/** 2D → [0,1] hash (Dave Hoskins style). */
export function hash21(p: TNode): TNode {
  let q = fract(vec2(p).mul(vec2(123.34, 456.21)))
  q = q.add(dot(q, q.add(45.32)))
  return fract(q.x.mul(q.y))
}

/** dot(N, V) clamped to [0,1] — 1 when facing the camera, 0 at the silhouette. */
export function facingRatio(): TNode {
  return clamp(dot(normalView.normalize(), positionViewDirection.normalize()), 0, 1)
}

/** Grazing-angle fresnel term in [0,1] (≈0 face-on, ≈1 at the silhouette). */
export function fresnel(power = 2.5): TNode {
  return facingRatio().oneMinus().pow(power)
}
