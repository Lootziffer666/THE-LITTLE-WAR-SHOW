/**
 * The Barlow Civic Playhouse speaks in signage. This is the engine: canvas-drawn
 * enamel signs, taped notes, laminated procedures, brass plaques, framed photos,
 * newspaper clippings, shelf labels, switch plates, board walls — and the big
 * transparent overlay of tape/spike/chalk marks for the stage deck.
 *
 * Copy is drawn verbatim from the set bible (mocking institutions and the war
 * machine, never victims). Everything is cached by key so repeated signs share
 * one GPU texture.
 */
import type * as THREE from 'three/webgpu'
import { makeCanvasTexture, ageCanvas } from './canvasTexture'

const cache = new Map<string, THREE.CanvasTexture>()
function once(key: string, make: () => THREE.CanvasTexture) {
  let t = cache.get(key)
  if (!t) {
    t = make()
    cache.set(key, t)
  }
  return t
}

function wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number) {
  const words = text.split(' ')
  let line = ''
  let yy = y
  for (const w of words) {
    const test = line + w + ' '
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line.trim(), x, yy)
      line = w + ' '
      yy += lh
    } else line = test
  }
  ctx.fillText(line.trim(), x, yy)
  return yy
}

/** Porcelain-enamel / plastic institutional sign. */
export function enamelSign(text: string, opts: { bg?: string; ink?: string; w?: number; h?: number; sub?: string } = {}) {
  const { bg = '#0f4f57', ink = '#f3efe2', w = 384, h = 160, sub } = opts
  return once(`enamel:${text}:${sub ?? ''}:${bg}`, () =>
    makeCanvasTexture(w, h, (ctx, W, H) => {
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)
      ctx.strokeStyle = ink
      ctx.lineWidth = 6
      ctx.strokeRect(10, 10, W - 20, H - 20)
      ctx.fillStyle = ink
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `800 ${sub ? 46 : 54}px Arial Narrow, Impact, sans-serif`
      ctx.fillText(text, W / 2, sub ? H / 2 - 16 : H / 2)
      if (sub) {
        ctx.font = `600 24px Arial, sans-serif`
        ctx.fillText(sub, W / 2, H / 2 + 34)
      }
      ageCanvas(ctx, W, H, 0.4)
    }),
  )
}

/** A taped/handwritten paper note. `lines[0]` printed, rest handwritten-ish. */
export function noteCard(lines: string[], opts: { paper?: string; ink?: string; hand?: string } = {}) {
  const { paper = '#efe7d2', ink = '#2a2018', hand = '#b3242b' } = opts
  return once(`note:${lines.join('|')}`, () =>
    makeCanvasTexture(384, 288, (ctx, W, H) => {
      ctx.fillStyle = paper
      ctx.fillRect(0, 0, W, H)
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'
      ctx.fillStyle = ink
      ctx.font = `600 30px "Courier New", monospace`
      let y = wrap(ctx, lines[0] ?? '', 28, 40, W - 56, 38) + 26
      ctx.fillStyle = hand
      ctx.font = `italic 30px "Bradley Hand", "Comic Sans MS", cursive`
      for (let i = 1; i < lines.length; i++) y = wrap(ctx, lines[i], 28, y, W - 56, 40) + 8
      // tape corners
      ctx.fillStyle = 'rgba(220,210,180,0.55)'
      ctx.fillRect(W / 2 - 36, -4, 72, 26)
      ageCanvas(ctx, W, H, 0.45)
    }),
  )
}

/** A laminated procedure sheet with a handwritten red addendum. */
export function laminated(title: string, lines: string[], addendum?: string) {
  return once(`lam:${title}`, () =>
    makeCanvasTexture(420, 540, (ctx, W, H) => {
      ctx.fillStyle = '#f6f4ee'
      ctx.fillRect(0, 0, W, H)
      ctx.strokeStyle = '#1c2733'
      ctx.lineWidth = 4
      ctx.strokeRect(16, 16, W - 32, H - 32)
      ctx.fillStyle = '#1c2733'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.font = `800 30px Arial, sans-serif`
      ctx.fillText(title, W / 2, 36)
      ctx.textAlign = 'left'
      ctx.font = `500 22px Arial, sans-serif`
      let y = 100
      for (const l of lines) y = wrap(ctx, '• ' + l, 40, y, W - 80, 30) + 12
      if (addendum) {
        ctx.fillStyle = '#b3242b'
        ctx.font = `italic 26px "Bradley Hand", "Comic Sans MS", cursive`
        wrap(ctx, addendum, 40, y + 14, W - 80, 30)
      }
      // sheen
      const g = ctx.createLinearGradient(0, 0, W, H)
      g.addColorStop(0, 'rgba(255,255,255,0.12)')
      g.addColorStop(0.5, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, W, H)
    }),
  )
}

/** Engraved brass donor plaque (or a blank, brighter rectangle where one fell). */
export function brassPlaque(name: string | null) {
  return once(`plaque:${name ?? '__empty'}`, () =>
    makeCanvasTexture(256, 96, (ctx, W, H) => {
      if (name) {
        ctx.fillStyle = '#b48a3a'
        ctx.fillRect(0, 0, W, H)
        const g = ctx.createLinearGradient(0, 0, 0, H)
        g.addColorStop(0, 'rgba(255,255,255,0.25)')
        g.addColorStop(1, 'rgba(0,0,0,0.25)')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, W, H)
        ctx.fillStyle = '#3a2c10'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = `600 30px Georgia, serif`
        ctx.fillText(name, W / 2, H / 2)
      } else {
        ctx.fillStyle = '#c8b48a' // brighter rectangle = sun-faded gap
        ctx.fillRect(0, 0, W, H)
        ageCanvas(ctx, W, H, 0.3)
      }
    }),
  )
}

/** A faded black-and-white production photo with a caption. */
export function framedPhotoBW(caption: string, kind: 'salute' | 'cast' | 'founder' = 'cast') {
  return once(`photo:${caption}`, () =>
    makeCanvasTexture(360, 440, (ctx, W, H) => {
      const g = ctx.createLinearGradient(0, 0, 0, H)
      g.addColorStop(0, '#cfcabd')
      g.addColorStop(1, '#8f897c')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#3a382f'
      const baseY = H - 120
      if (kind === 'salute') {
        // a lone figure saluting the wrong way (facing offstage)
        ctx.fillRect(W / 2 - 22, baseY - 90, 44, 110)
        ctx.beginPath()
        ctx.arc(W / 2, baseY - 100, 22, 0, Math.PI * 2)
        ctx.fill()
        ctx.save()
        ctx.translate(W / 2 + 18, baseY - 70)
        ctx.rotate(-0.7)
        ctx.fillRect(0, -8, 60, 16) // arm up, pointing away
        ctx.restore()
      } else if (kind === 'founder') {
        ctx.fillRect(W / 2 - 30, baseY - 80, 60, 100)
        ctx.beginPath()
        ctx.arc(W / 2, baseY - 92, 26, 0, Math.PI * 2)
        ctx.fill()
      } else {
        for (let i = -2; i <= 2; i++) {
          ctx.fillRect(W / 2 + i * 56 - 16, baseY - 70 - (i % 2 ? 0 : 10), 32, 90)
          ctx.beginPath()
          ctx.arc(W / 2 + i * 56, baseY - 80 - (i % 2 ? 0 : 10), 16, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      // white border + caption
      ctx.fillStyle = '#f3efe6'
      ctx.fillRect(0, H - 70, W, 70)
      ctx.fillStyle = '#2a2620'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `500 19px Georgia, serif`
      wrap(ctx, caption, W / 2, H - 44, W - 30, 22)
      // water stain on some
      if (kind === 'salute') {
        const rg = ctx.createRadialGradient(W * 0.7, H * 0.3, 8, W * 0.7, H * 0.3, 120)
        rg.addColorStop(0, 'rgba(90,70,40,0.0)')
        rg.addColorStop(1, 'rgba(90,70,40,0.4)')
        ctx.fillStyle = rg
        ctx.fillRect(0, 0, W, H)
      }
    }),
  )
}

/** Yellowed newspaper clipping. */
export function newspaper(headline: string, sub: string) {
  return once(`news:${headline}`, () =>
    makeCanvasTexture(420, 300, (ctx, W, H) => {
      ctx.fillStyle = '#e7e0cb'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#1f1b14'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.font = `900 30px Georgia, serif`
      let y = wrap(ctx, headline, W / 2, 28, W - 40, 34) + 12
      ctx.font = `italic 18px Georgia, serif`
      ctx.fillText(sub, W / 2, y)
      // fake columns
      ctx.textAlign = 'left'
      ctx.fillStyle = '#4a4438'
      for (let i = 0; i < 7; i++) {
        ctx.fillRect(30, y + 50 + i * 14, W - 60, 4)
      }
      ageCanvas(ctx, W, H, 0.7)
    }),
  )
}

/** A small shelf / box label strip. */
export function shelfLabel(text: string) {
  return once(`shelf:${text}`, () =>
    makeCanvasTexture(256, 64, (ctx, W, H) => {
      ctx.fillStyle = '#d8c8a0'
      ctx.fillRect(0, 0, W, H)
      ctx.strokeStyle = '#5a4a28'
      ctx.lineWidth = 3
      ctx.strokeRect(4, 4, W - 8, H - 8)
      ctx.fillStyle = '#2a2012'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `800 30px Arial Narrow, Impact, sans-serif`
      ctx.fillText(text, W / 2, H / 2 + 2)
      ageCanvas(ctx, W, H, 0.4)
    }),
  )
}

/** The three-label light switch plate: HOUSE / STAGE / DO NOT. */
export function switchPlate() {
  return once('switchplate', () =>
    makeCanvasTexture(160, 256, (ctx, W, H) => {
      ctx.fillStyle = '#cfc8b8'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#1c1a16'
      ctx.textAlign = 'center'
      ctx.font = `700 26px Arial, sans-serif`
      ;['HOUSE', 'STAGE', 'DO NOT'].forEach((t, i) => {
        ctx.fillStyle = '#2a2620'
        ctx.fillRect(W / 2 - 22, 36 + i * 74, 44, 30)
        ctx.fillStyle = '#cfc8b8'
        ctx.fillRect(W / 2 - 16, 40 + i * 74 + (i === 2 ? 14 : 0), 32, 14)
        ctx.fillStyle = '#1c1a16'
        ctx.fillText(t, W / 2, 92 + i * 74)
      })
      ageCanvas(ctx, W, H, 0.3)
    }),
  )
}

/** A cork board / wall of notices. */
export function boardWall(title: string, notes: string[]) {
  return once(`board:${title}`, () =>
    makeCanvasTexture(512, 384, (ctx, W, H) => {
      ctx.fillStyle = '#9c6b3a'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#3a2410'
      ctx.fillRect(0, 0, W, 44)
      ctx.fillStyle = '#f3ead0'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `800 26px Arial, sans-serif`
      ctx.fillText(title, W / 2, 24)
      const cols = ['#f3ead0', '#fff7b0', '#ffd9d2', '#d9f0ff', '#e0ffd9']
      notes.forEach((n, i) => {
        const x = 24 + (i % 2) * 246
        const y = 70 + Math.floor(i / 2) * 100
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate((((i * 47) % 10) - 5) / 60)
        ctx.fillStyle = cols[i % cols.length]
        ctx.fillRect(0, 0, 226, 84)
        ctx.fillStyle = '#b3242b'
        ctx.beginPath()
        ctx.arc(113, 8, 5, 0, Math.PI * 2)
        ctx.fill() // pin
        ctx.fillStyle = '#2a2018'
        ctx.textAlign = 'left'
        ctx.font = `500 17px "Bradley Hand", "Comic Sans MS", cursive`
        wrap(ctx, n, 12, 28, 200, 20)
        ctx.restore()
      })
      ageCanvas(ctx, W, H, 0.3)
    }),
  )
}

/** Exterior/interior marquee board with letters of mismatched age. */
export function marqueeBoard(title: string, sub: string) {
  return once(`marquee2:${title}:${sub}`, () =>
    makeCanvasTexture(1024, 320, (ctx, W, H) => {
      ctx.fillStyle = '#15100c'
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#ffd98a'
      for (let x = 26; x < W; x += 40) {
        ctx.beginPath()
        ctx.arc(x, 22, 7, 0, Math.PI * 2)
        ctx.arc(x, H - 22, 7, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      // each letter slightly different tint (different ages)
      ctx.font = `900 110px Arial Narrow, Impact, sans-serif`
      const total = ctx.measureText(title).width
      let x = W / 2 - total / 2
      const tints = ['#fff0c0', '#ffe49a', '#f2d28a', '#fff6d8', '#e9c878']
      for (let i = 0; i < title.length; i++) {
        const ch = title[i]
        const cw = ctx.measureText(ch).width
        ctx.fillStyle = tints[i % tints.length]
        ctx.shadowColor = '#ff8a3a'
        ctx.shadowBlur = 22
        ctx.fillText(ch, x + cw / 2, H / 2 - 20)
        x += cw
      }
      ctx.shadowBlur = 0
      ctx.fillStyle = '#9fe8ff'
      ctx.font = `700 40px Arial Narrow, sans-serif`
      ctx.fillText(sub, W / 2, H - 60)
    }),
  )
}

/**
 * The transparent stage-deck overlay: years of coloured spike tape, chalk
 * crosses, scuff circles where props were shoved, a lighter rectangle where a
 * piano stood, and front-left scorch from old footlights/pyro. Map onto a plane
 * just above the deck with a transparent material.
 */
export function stageMarks() {
  return once('stagemarks', () =>
    makeCanvasTexture(1024, 768, (ctx, W, H) => {
      // (transparent background)
      const tapes = ['#e0d23a', '#3ad0e0', '#e03a6a', '#ffffff', '#7a3ae0']
      for (let i = 0; i < 26; i++) {
        ctx.save()
        ctx.globalAlpha = 0.5
        ctx.fillStyle = tapes[i % tapes.length]
        ctx.translate(80 + Math.random() * (W - 160), 120 + Math.random() * (H - 240))
        ctx.rotate(Math.random() * Math.PI)
        ctx.fillRect(-40, -4, 80, 8) // a strip of spike tape
        ctx.restore()
      }
      // chalk crosses
      ctx.strokeStyle = 'rgba(240,240,230,0.5)'
      ctx.lineWidth = 3
      for (let i = 0; i < 12; i++) {
        const x = 120 + Math.random() * (W - 240)
        const y = 160 + Math.random() * (H - 320)
        ctx.beginPath()
        ctx.moveTo(x - 14, y)
        ctx.lineTo(x + 14, y)
        ctx.moveTo(x, y - 14)
        ctx.lineTo(x, y + 14)
        ctx.stroke()
      }
      // scuff circles
      for (let i = 0; i < 8; i++) {
        ctx.strokeStyle = `rgba(20,16,12,${0.25 + Math.random() * 0.2})`
        ctx.lineWidth = 10
        ctx.beginPath()
        ctx.arc(150 + Math.random() * (W - 300), 200 + Math.random() * (H - 400), 26 + Math.random() * 30, 0, Math.PI * 2)
        ctx.stroke()
      }
      // lighter rectangle where the piano stood (front-right area)
      ctx.fillStyle = 'rgba(150,140,120,0.18)'
      ctx.fillRect(W * 0.6, H * 0.62, W * 0.26, H * 0.22)
      // scorch front-left
      const rg = ctx.createRadialGradient(W * 0.22, H * 0.84, 6, W * 0.22, H * 0.84, 110)
      rg.addColorStop(0, 'rgba(10,8,6,0.5)')
      rg.addColorStop(1, 'rgba(10,8,6,0)')
      ctx.fillStyle = rg
      ctx.fillRect(0, H * 0.6, W * 0.5, H * 0.4)
    }),
  )
}

/** A generic dark wear/grime/stain blob (transparent), for floors & walls. */
export function stainDecal(kind: 'sticky' | 'water' | 'ring' = 'sticky') {
  return once(`stain:${kind}`, () =>
    makeCanvasTexture(256, 256, (ctx, W, H) => {
      const cx = W / 2
      const cy = H / 2
      if (kind === 'ring') {
        ctx.strokeStyle = 'rgba(20,16,10,0.5)'
        ctx.lineWidth = 18
        ctx.beginPath()
        ctx.arc(cx, cy, 92, 0, Math.PI * 2)
        ctx.stroke()
      } else {
        const col = kind === 'water' ? '90,70,40' : '60,45,20'
        const g = ctx.createRadialGradient(cx, cy, 10, cx, cy, 120)
        g.addColorStop(0, `rgba(${col},${kind === 'sticky' ? 0.45 : 0.3})`)
        g.addColorStop(1, `rgba(${col},0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        for (let a = 0; a < Math.PI * 2; a += 0.3) {
          const r = 80 + Math.sin(a * 3) * 18 + Math.random() * 14
          ctx[a ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * r, cy + Math.sin(a) * r)
        }
        ctx.closePath()
        ctx.fill()
      }
    }),
  )
}
