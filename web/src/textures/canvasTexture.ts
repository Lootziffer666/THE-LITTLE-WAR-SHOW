/**
 * Tiny 2D-canvas → THREE.CanvasTexture helper. Crisp text and graphics for
 * posters, signage, menus and ticket stubs without shipping image files. (The
 * brief named PixiJS for this; a 2D canvas is the zero-dependency, zero-risk
 * equivalent — see textures/pixiPoster for the Pixi-backed alternative.)
 */
import * as THREE from 'three/webgpu'

export function makeCanvasTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  opts: { anisotropy?: number; repeat?: [number, number] } = {},
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  draw(ctx, width, height)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = opts.anisotropy ?? 8
  if (opts.repeat) {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(opts.repeat[0], opts.repeat[1])
  }
  tex.needsUpdate = true
  return tex
}

/** Paper grain + age vignette applied over the current canvas content. */
export function ageCanvas(ctx: CanvasRenderingContext2D, w: number, h: number, amount = 0.5) {
  // speckle
  ctx.save()
  ctx.globalAlpha = 0.06 * amount
  for (let i = 0; i < (w * h) / 900; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? '#000' : '#fff'
    ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1)
  }
  ctx.restore()
  // corner vignette / foxing
  const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.25, w / 2, h / 2, Math.max(w, h) * 0.7)
  g.addColorStop(0, 'rgba(0,0,0,0)')
  g.addColorStop(1, `rgba(40,26,12,${0.35 * amount})`)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
}
