/**
 * Authored in-world print: posters for *this* and other shows, plus 1950s foyer
 * signage. Copy mocks the war machine (propaganda, bureaucracy, command
 * culture) — never victims — per the tone bible. All drawn to canvas textures.
 *
 * Cached so repeated use across walls shares one GPU texture.
 */
import type * as THREE from 'three/webgpu'
import { makeCanvasTexture, ageCanvas } from './canvasTexture'

const cache = new Map<string, THREE.CanvasTexture>()
function once(key: string, make: () => THREE.CanvasTexture): THREE.CanvasTexture {
  let t = cache.get(key)
  if (!t) {
    t = make()
    cache.set(key, t)
  }
  return t
}

function fitText(ctx: CanvasRenderingContext2D, text: string, max: number, start: number, font: (px: number) => string) {
  let px = start
  ctx.font = font(px)
  while (ctx.measureText(text).width > max && px > 8) {
    px -= 2
    ctx.font = font(px)
  }
  return px
}

interface PosterSpec {
  key: string
  bg: string
  ink: string
  accent: string
  title: string
  tagline: string
  foot: string
  motif: 'marionette' | 'cannon' | 'star' | 'boot' | 'medal'
}

const SPECS: PosterSpec[] = [
  { key: 'warshow', bg: '#7c1418', ink: '#f3e7d2', accent: '#e7b73c', title: 'THE LITTLE WAR SHOW', tagline: 'March, You Idiots.', foot: 'TWO SHOWS NIGHTLY · NO REFUNDS · NO SURVIVORS (OF DIGNITY)', motif: 'marionette' },
  { key: 'tyrants', bg: '#243a52', ink: '#f3e7d2', accent: '#e7b73c', title: 'TINY TYRANTS', tagline: 'They mean SO well.', foot: 'A COMEDY OF ABSOLUTE AUTHORITY', motif: 'medal' },
  { key: 'disaster', bg: '#33240f', ink: '#f5ead0', accent: '#c9472e', title: 'A VERY BRAVE DISASTER', tagline: 'Heroically mismanaged.', foot: 'BY ORDER OF THE COMMITTEE FOR GLORY', motif: 'boot' },
  { key: 'occupation', bg: '#2f5d57', ink: '#f3e7d2', accent: '#e7b73c', title: 'GOOD MORNING, OCCUPATION', tagline: 'Now with paperwork!', foot: 'THE BUREAU OF CHEERFUL CONQUEST PRESENTS', motif: 'star' },
  { key: 'dumbality', bg: '#1a1a1d', ink: '#f3e7d2', accent: '#39ff88', title: 'DUMBALITY', tagline: 'Pacifism wins.', foot: 'AN EDUCATIONAL FILM ABOUT GRAVITY & GRENADES', motif: 'cannon' },
]

function drawMotif(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, motif: PosterSpec['motif'], color: string) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = s * 0.04
  if (motif === 'marionette') {
    // strings + a stiff little puppet
    ctx.beginPath()
    for (const dx of [-s * 0.22, 0, s * 0.22]) {
      ctx.moveTo(dx, -s * 0.7)
      ctx.lineTo(dx * 0.4, -s * 0.18)
    }
    ctx.stroke()
    ctx.fillRect(-s * 0.12, -s * 0.18, s * 0.24, s * 0.24) // body
    ctx.beginPath()
    ctx.arc(0, -s * 0.28, s * 0.1, 0, Math.PI * 2)
    ctx.fill() // head
    ctx.fillRect(-s * 0.05, s * 0.06, s * 0.04, s * 0.3)
    ctx.fillRect(s * 0.01, s * 0.06, s * 0.04, s * 0.3) // legs
  } else if (motif === 'cannon') {
    ctx.fillRect(-s * 0.35, 0, s * 0.5, s * 0.16)
    ctx.beginPath()
    ctx.arc(-s * 0.3, s * 0.18, s * 0.14, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(s * 0.3, -s * 0.05, s * 0.1, 0, Math.PI * 2)
    ctx.stroke() // a sad little cannonball lobbing up
  } else if (motif === 'star') {
    ctx.beginPath()
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? s * 0.18 : s * 0.42
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2
      ctx[i ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r)
    }
    ctx.closePath()
    ctx.fill()
  } else if (motif === 'boot') {
    ctx.fillRect(-s * 0.18, -s * 0.4, s * 0.22, s * 0.55)
    ctx.fillRect(-s * 0.18, s * 0.1, s * 0.5, s * 0.18)
  } else {
    // medal
    ctx.beginPath()
    ctx.moveTo(-s * 0.18, -s * 0.4)
    ctx.lineTo(s * 0.18, -s * 0.4)
    ctx.lineTo(0, -s * 0.05)
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.arc(0, s * 0.12, s * 0.22, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

function makePoster(spec: PosterSpec): THREE.CanvasTexture {
  return makeCanvasTexture(512, 768, (ctx, w, h) => {
    ctx.fillStyle = spec.bg
    ctx.fillRect(0, 0, w, h)
    // border
    ctx.strokeStyle = spec.accent
    ctx.lineWidth = 10
    ctx.strokeRect(18, 18, w - 36, h - 36)

    drawMotif(ctx, w / 2, h * 0.42, 360, spec.motif, spec.ink)

    ctx.textAlign = 'center'
    ctx.fillStyle = spec.ink
    const tpx = fitText(ctx, spec.title, w - 80, 64, (p) => `900 ${p}px Arial Narrow, Impact, sans-serif`)
    ctx.font = `900 ${tpx}px Arial Narrow, Impact, sans-serif`
    // title may wrap into two lines if very long
    const words = spec.title.split(' ')
    if (ctx.measureText(spec.title).width > w - 80 && words.length > 1) {
      const mid = Math.ceil(words.length / 2)
      ctx.fillText(words.slice(0, mid).join(' '), w / 2, h * 0.66)
      ctx.fillText(words.slice(mid).join(' '), w / 2, h * 0.66 + tpx * 1.05)
    } else {
      ctx.fillText(spec.title, w / 2, h * 0.66)
    }

    ctx.fillStyle = spec.accent
    ctx.font = `italic 700 34px Georgia, serif`
    ctx.fillText(spec.tagline, w / 2, h * 0.8)

    ctx.fillStyle = spec.ink
    ctx.font = `600 15px Arial, sans-serif`
    ctx.fillText(spec.foot, w / 2, h * 0.9)

    ageCanvas(ctx, w, h, 0.6)
  })
}

/** All show posters, keyed. */
export function showPoster(key: string): THREE.CanvasTexture {
  const spec = SPECS.find((s) => s.key === key) ?? SPECS[0]
  return once(`poster-${key}`, () => makePoster(spec))
}
export const POSTER_KEYS = SPECS.map((s) => s.key)

/* --------------------------------- signage -------------------------------- */

/** A glowing marquee strip: dark board, bulb dots, big letters. */
export function marqueeSign(text = 'THE LITTLE WAR SHOW'): THREE.CanvasTexture {
  return once(`marquee-${text}`, () =>
    makeCanvasTexture(1024, 256, (ctx, w, h) => {
      ctx.fillStyle = '#120c0a'
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = '#ffd98a'
      for (let x = 24; x < w; x += 38) {
        ctx.beginPath()
        ctx.arc(x, 24, 7, 0, Math.PI * 2)
        ctx.arc(x, h - 24, 7, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.textAlign = 'center'
      ctx.fillStyle = '#ffe9b0'
      const px = fitText(ctx, text, w - 120, 120, (p) => `900 ${p}px Arial Narrow, Impact, sans-serif`)
      ctx.font = `900 ${px}px Arial Narrow, Impact, sans-serif`
      ctx.shadowColor = '#ff8a3a'
      ctx.shadowBlur = 24
      ctx.fillText(text, w / 2, h / 2 + px * 0.34)
    }),
  )
}

/** Snack-bar menu board (1950s prices). */
export function snackMenu(): THREE.CanvasTexture {
  return once('snackmenu', () =>
    makeCanvasTexture(512, 640, (ctx, w, h) => {
      ctx.fillStyle = '#14201d'
      ctx.fillRect(0, 0, w, h)
      ctx.strokeStyle = '#d9b25a'
      ctx.lineWidth = 8
      ctx.strokeRect(14, 14, w - 28, h - 28)
      ctx.textAlign = 'center'
      ctx.fillStyle = '#ff5d8f'
      ctx.font = `900 52px Arial Narrow, Impact, sans-serif`
      ctx.fillText('REFRESHMENTS', w / 2, 80)
      const items: [string, string][] = [
        ['POPCORN', '15¢'],
        ['JUMBO POPCORN', '25¢'],
        ['SODA POP', '10¢'],
        ['CANDY', '5¢'],
        ['HOT DOG', '20¢'],
        ['ICE CREAM', '10¢'],
        ['COURAGE (OUT)', '—'],
      ]
      ctx.font = `600 34px Georgia, serif`
      ctx.fillStyle = '#efe6cf'
      items.forEach(([name, price], i) => {
        const y = 150 + i * 64
        ctx.textAlign = 'left'
        ctx.fillText(name, 50, y)
        ctx.textAlign = 'right'
        ctx.fillStyle = '#41e8ff'
        ctx.fillText(price, w - 50, y)
        ctx.fillStyle = '#efe6cf'
      })
      ageCanvas(ctx, w, h, 0.3)
    }),
  )
}

/** Box-office "NOW SHOWING / SOLD OUT" card. */
export function boxOfficeCard(): THREE.CanvasTexture {
  return once('boxoffice', () =>
    makeCanvasTexture(512, 384, (ctx, w, h) => {
      ctx.fillStyle = '#0f0c0a'
      ctx.fillRect(0, 0, w, h)
      ctx.textAlign = 'center'
      ctx.fillStyle = '#ffe9b0'
      ctx.font = `700 40px Georgia, serif`
      ctx.fillText('NOW SHOWING', w / 2, 80)
      ctx.fillStyle = '#7c1418'
      ctx.fillRect(40, 120, w - 80, 150)
      ctx.fillStyle = '#f3e7d2'
      ctx.font = `900 60px Arial Narrow, Impact, sans-serif`
      ctx.fillText('SOLD OUT', w / 2, 215)
      ctx.fillStyle = '#b9a98c'
      ctx.font = `600 22px Arial, sans-serif`
      ctx.fillText('ADM. 35¢ · CHILDREN 10¢ · CONSCRIPTS FREE', w / 2, 320)
    }),
  )
}
