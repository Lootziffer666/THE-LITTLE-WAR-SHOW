/**
 * The control booth — the raised technical niche at the back of the house.
 * "From here you see everything and hear nothing." An old fader desk, two
 * glowing monitors with a cue list, a gooseneck lamp, a headset, a yellowed
 * plan, and the World's Okayest Stage Manager mug.
 */
import { useMemo } from 'react'
import * as THREE from 'three/webgpu'
import { texture } from '../../materials/tsl'
import { steelMaterial, blackIronMaterial, brassMaterial, darkWoodMaterial, emissiveMaterial } from '../../materials'
import { c } from '../../materials/tsl-helpers'
import { makeCanvasTexture } from '../../textures/canvasTexture'
import { HOUSE } from '../../config/theater.config'

function screenMaterial(lines: string[], tint: string) {
  const tex = makeCanvasTexture(256, 192, (ctx, w, h) => {
    ctx.fillStyle = '#06120e'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = tint
    ctx.font = '600 18px "Courier New", monospace'
    ctx.textBaseline = 'top'
    lines.forEach((l, i) => ctx.fillText(l, 12, 14 + i * 24))
  })
  const m = new THREE.MeshBasicNodeMaterial()
  m.colorNode = texture(tex)
  m.toneMapped = false
  return m
}

export function ControlBooth() {
  const mats = useMemo(
    () => ({
      desk: darkWoodMaterial({ tone: '#2c2014' }),
      steel: steelMaterial({ tone: '#2a2d31' }),
      iron: blackIronMaterial(),
      brass: brassMaterial(),
      fader: emissiveMaterial('#9fe8ff', 1.4),
      mug: (() => {
        const m = new THREE.MeshStandardNodeMaterial()
        m.color = c('#b3242b')
        m.roughness = 0.4 as unknown as number
        return m
      })(),
      screenA: screenMaterial(['CUE 14  GO', 'LX 15   STBY', 'SQ 7    STBY', 'FLY 3   ---', '> house to half'], '#5cf0c0'),
      screenB: screenMaterial(['MAIN DRAPE  IN', 'HOUSE   0%', 'STAGE   78%', 'SPOT    ON', 'pyro armed?  y'], '#ffd27a'),
    }),
    [],
  )

  const z = HOUSE.backZ - 1.3
  const y = 2.2

  return (
    <group name="ControlBooth" position={[0, y, z]}>
      {/* booth floor + low front wall (window sill onto the house) */}
      <mesh material={mats.steel} position={[0, -0.1, 0]} receiveShadow castShadow>
        <boxGeometry args={[4.2, 0.2, 1.8]} />
      </mesh>
      <mesh material={mats.iron} position={[0, 0.45, -0.85]} castShadow>
        <boxGeometry args={[4.2, 1.1, 0.1]} />
      </mesh>

      {/* slanted fader desk */}
      <mesh material={mats.desk} position={[0, 0.55, 0.4]} rotation={[-0.4, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.06, 0.6]} />
      </mesh>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} material={mats.fader} position={[-1.0 + i * 0.18, 0.66, 0.36]} rotation={[-0.4, 0, 0]}>
          <boxGeometry args={[0.03, 0.02, 0.14]} />
        </mesh>
      ))}

      {/* two monitors */}
      <mesh material={mats.iron} position={[-0.7, 1.0, -0.7]} rotation={[0.15, 0.2, 0]} castShadow>
        <boxGeometry args={[0.78, 0.56, 0.06]} />
      </mesh>
      <mesh material={mats.screenA} position={[-0.7, 1.0, -0.66]} rotation={[0.15, 0.2, 0]}>
        <planeGeometry args={[0.68, 0.46]} />
      </mesh>
      <mesh material={mats.iron} position={[0.7, 1.0, -0.7]} rotation={[0.15, -0.2, 0]} castShadow>
        <boxGeometry args={[0.78, 0.56, 0.06]} />
      </mesh>
      <mesh material={mats.screenB} position={[0.7, 1.0, -0.66]} rotation={[0.15, -0.2, 0]}>
        <planeGeometry args={[0.68, 0.46]} />
      </mesh>

      {/* gooseneck lamp */}
      <mesh material={mats.brass} position={[1.4, 0.7, 0.2]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.5, 8]} />
      </mesh>
      <mesh material={mats.iron} position={[1.32, 0.95, 0.3]} rotation={[0.7, 0, 0]} castShadow>
        <coneGeometry args={[0.06, 0.1, 12, 1, true]} />
      </mesh>
      <pointLight color="#ffce85" intensity={2} distance={3} decay={2} position={[1.3, 0.9, 0.35]} />

      {/* the mug + a headset hoop */}
      <mesh material={mats.mug} position={[-1.5, 0.62, 0.1]} castShadow>
        <cylinderGeometry args={[0.05, 0.045, 0.1, 16]} />
      </mesh>
      <mesh material={mats.iron} position={[1.0, 0.66, 0.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.09, 0.015, 8, 20, Math.PI]} />
      </mesh>

      {/* glow from the desk so the booth reads in the dark */}
      <pointLight color="#9fe8ff" intensity={1.5} distance={3.5} decay={2} position={[0, 0.8, 0.2]} />
    </group>
  )
}
