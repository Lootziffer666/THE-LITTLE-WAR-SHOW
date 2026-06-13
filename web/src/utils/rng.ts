/**
 * Deterministic pseudo-randomness for "lived-in" placement.
 *
 * Everything that scatters trash, cobwebs, vermin, wear and dirt draws from a
 * seeded stream so the theater looks hand-dressed but renders identically on
 * every reload (and so two machines agree). Mulberry32: tiny, fast, good enough
 * for set-dressing.
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export class Rng {
  private next: () => number
  constructor(seed: number) {
    this.next = mulberry32(seed)
  }
  /** [0,1) */
  float(): number {
    return this.next()
  }
  /** [min,max) */
  range(min: number, max: number): number {
    return min + (max - min) * this.next()
  }
  /** integer in [min,max] inclusive */
  int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1))
  }
  /** true with probability p */
  chance(p: number): boolean {
    return this.next() < p
  }
  /** -1 or +1 */
  sign(): number {
    return this.next() < 0.5 ? -1 : 1
  }
  pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(this.next() * arr.length)]
  }
  /** approx standard-normal via two uniforms (Box–Muller) */
  gauss(mean = 0, sd = 1): number {
    const u = Math.max(1e-6, this.next())
    const v = this.next()
    return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
  }
  /** a fresh, independent sub-stream (so modules don't disturb each other) */
  fork(salt: number): Rng {
    return new Rng((Math.floor(this.next() * 0xffffffff) ^ (salt * 0x9e3779b1)) >>> 0)
  }
}

export const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1)
  return t * t * (3 - 2 * t)
}
export const mapRange = (x: number, a: number, b: number, c: number, d: number) =>
  c + ((x - a) * (d - c)) / (b - a)
