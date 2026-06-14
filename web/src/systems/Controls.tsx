/**
 * Camera orbit (constrained to stay inside the house and above the floor) plus
 * the keyboard shortcuts for the whole show: lighting state, curtain, flicker,
 * pyro, prop reset and help.
 */
import { useEffect } from 'react'
import { OrbitControls } from '@react-three/drei'
import { CAMERA } from '../config/theater.config'
import { useTheaterStore } from '../state/useTheaterStore'

export function Controls() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
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

  return (
    <OrbitControls
      makeDefault
      target={CAMERA.target}
      enablePan={false}
      enableDamping
      dampingFactor={0.05}
      minDistance={4}
      maxDistance={28}
      minPolarAngle={0.18}
      maxPolarAngle={Math.PI * 0.495}
      rotateSpeed={0.6}
    />
  )
}
