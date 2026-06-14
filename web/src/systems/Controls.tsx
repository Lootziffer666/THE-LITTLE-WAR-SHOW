/**
 * Camera + input.
 *
 * A precise fly/walk camera: WASD to move, E/Q up/down, hold Shift to sprint,
 * drag (mouse/touch) to look, wheel to dolly. A click that doesn't drag still
 * passes through to 3D objects (so the tech console stays clickable). Plus the
 * keyboard shortcuts for the show (lighting, curtain, flicker, pyro, FX…).
 */
import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three/webgpu'
import { CAMERA } from '../config/theater.config'
import { useTheaterStore } from '../state/useTheaterStore'

function FlyControls() {
  const camera = useThree((s) => s.camera)
  const gl = useThree((s) => s.gl)
  const keys = useRef<Record<string, boolean>>({})
  const yaw = useRef(0)
  const pitch = useRef(0)
  const pos = useRef(new THREE.Vector3(...CAMERA.position))
  const drag = useRef({ active: false, moved: false, x: 0, y: 0 })

  useEffect(() => {
    camera.position.set(...CAMERA.position)
    camera.lookAt(...CAMERA.target)
    camera.rotation.reorder('YXZ')
    yaw.current = camera.rotation.y
    pitch.current = camera.rotation.x
    pos.current.copy(camera.position)

    const el = (gl as unknown as { domElement: HTMLElement }).domElement
    const sens = 0.0026

    const onDown = (e: PointerEvent) => {
      drag.current = { active: true, moved: false, x: e.clientX, y: e.clientY }
    }
    const onMove = (e: PointerEvent) => {
      const d = drag.current
      if (!d.active) return
      const dx = e.clientX - d.x
      const dy = e.clientY - d.y
      if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true
      if (d.moved) {
        yaw.current -= dx * sens
        pitch.current = Math.max(-1.45, Math.min(1.45, pitch.current - dy * sens))
        d.x = e.clientX
        d.y = e.clientY
        el.style.cursor = 'grabbing'
      }
    }
    const onUp = () => {
      drag.current.active = false
      el.style.cursor = 'grab'
    }
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const fwd = new THREE.Vector3(0, 0, -1).applyEuler(camera.rotation)
      pos.current.addScaledVector(fwd, -e.deltaY * 0.012)
    }
    const onCtx = (e: Event) => e.preventDefault()
    const kd = (e: KeyboardEvent) => {
      keys.current[e.code] = true
    }
    const ku = (e: KeyboardEvent) => {
      keys.current[e.code] = false
    }

    el.style.cursor = 'grab'
    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('contextmenu', onCtx)
    window.addEventListener('keydown', kd)
    window.addEventListener('keyup', ku)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('contextmenu', onCtx)
      window.removeEventListener('keydown', kd)
      window.removeEventListener('keyup', ku)
    }
  }, [camera, gl])

  useFrame((_, dt) => {
    const t = Math.min(dt, 0.05)
    camera.rotation.set(pitch.current, yaw.current, 0, 'YXZ')
    const k = keys.current
    const run = k['ShiftLeft'] || k['ShiftRight'] ? 3.2 : 1
    const speed = 5 * run * t
    const fwd = new THREE.Vector3(0, 0, -1).applyEuler(camera.rotation)
    const right = new THREE.Vector3(1, 0, 0).applyEuler(camera.rotation)
    const p = pos.current
    if (k['KeyW'] || k['ArrowUp']) p.addScaledVector(fwd, speed)
    if (k['KeyS'] || k['ArrowDown']) p.addScaledVector(fwd, -speed)
    if (k['KeyD'] || k['ArrowRight']) p.addScaledVector(right, speed)
    if (k['KeyA'] || k['ArrowLeft']) p.addScaledVector(right, -speed)
    if (k['KeyE']) p.y += speed
    if (k['KeyQ']) p.y -= speed
    // gentle bounds so you can't get lost in the void
    p.x = Math.max(-13, Math.min(13, p.x))
    p.y = Math.max(0.4, Math.min(13, p.y))
    p.z = Math.max(-9.5, Math.min(30, p.z))
    camera.position.copy(p)
  })

  return null
}

export function Controls() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // ignore movement keys here; FlyControls owns them
      const s = useTheaterStore.getState()
      switch (e.key.toLowerCase()) {
        case '1':
          s.setLightMode('house')
          break
        case '2':
          s.setLightMode('show')
          break
        case '3':
          s.setLightMode('dark')
          break
        case 'l':
          s.cycleLightMode()
          break
        case 'c':
          s.toggleCurtain()
          break
        case 'f':
          s.toggleFlicker()
          break
        case 'p':
          s.togglePost()
          break
        case 'r':
          s.resetProps()
          break
        case 'h':
        case '?':
          s.toggleHelp()
          break
        case ' ':
          e.preventDefault()
          s.firePyro()
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return <FlyControls />
}
