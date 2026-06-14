/**
 * The tech desk — a diegetic lighting/FX console at front-of-house. Every
 * control is a real, clickable 3D object wired to the show state: lighting
 * buttons, a sprung curtain lever, a prop selector + nudge pad that travels the
 * stage props, a flicker toggle, and a big red pyro plunger. react-spring gives
 * the buttons and lever their physical feel.
 *
 * "UI is a prop. The prop has an operator." — the concept bible, honoured.
 */
import { useMemo, useState } from 'react'
import * as THREE from 'three/webgpu'
import { a, useSpring } from '@react-spring/three'
import { STAGE_PROPS, PALETTE } from '../../config/theater.config'
import {
  steelMaterial,
  blackIronMaterial,
  brassMaterial,
  darkWoodMaterial,
  emissiveMaterial,
  posterMaterial,
} from '../../materials'
import { c } from '../../materials/tsl-helpers'
import { makeCanvasTexture } from '../../textures/canvasTexture'
import { useTheaterStore } from '../../state/useTheaterStore'

type V3 = [number, number, number]

function useConsoleMats() {
  return useMemo(() => {
    const caps = {
      warm: capMat('#e9c06a'),
      cool: capMat('#6ab0e9'),
      dark: capMat('#3a3f46'),
      red: capMat('#c0241f'),
      green: capMat('#3ab06a'),
      grey: capMat('#9aa0a6'),
    }
    return {
      body: steelMaterial({ tone: '#2c2f33', rough: 0.5 }),
      iron: blackIronMaterial(),
      brass: brassMaterial(),
      wood: darkWoodMaterial({ tone: '#241a10' }),
      caps,
      ledOn: emissiveMaterial('#7dff9b', 3),
      pyro: emissiveMaterial('#ff3a26', 1.2),
      label: posterMaterial(
        makeCanvasTexture(512, 128, (ctx, w, h) => {
          ctx.fillStyle = '#15110d'
          ctx.fillRect(0, 0, w, h)
          ctx.strokeStyle = '#c8a24a'
          ctx.lineWidth = 4
          ctx.strokeRect(6, 6, w - 12, h - 12)
          ctx.fillStyle = '#e7d4a6'
          ctx.font = '700 44px Arial Narrow, Impact, sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText('T.L.W.S.  ·  LIGHTING & F/X', w / 2, h / 2 + 16)
        }),
      ),
    }
  }, [])
}

function capMat(hex: string) {
  const m = new THREE.MeshStandardNodeMaterial()
  m.color = c(hex)
  m.roughness = 0.45 as unknown as number
  m.metalness = 0.1 as unknown as number
  return m
}

function Btn({
  position,
  cap,
  base,
  active,
  led,
  onClick,
  size = [0.13, 0.05, 0.13],
}: {
  position: V3
  cap: THREE.Material
  base: THREE.Material
  active?: boolean
  led?: THREE.Material
  onClick: () => void
  size?: V3
}) {
  const [hover, setHover] = useState(false)
  const [pressed, setPressed] = useState(false)
  const { s } = useSpring({ s: pressed ? 0.84 : hover ? 1.14 : 1, config: { tension: 420, friction: 18 } })
  return (
    <a.group
      position={position}
      scale={s as unknown as number}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHover(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHover(false)
        document.body.style.cursor = 'auto'
      }}
      onPointerDown={(e) => {
        e.stopPropagation()
        setPressed(true)
        onClick()
        window.setTimeout(() => setPressed(false), 120)
      }}
    >
      <mesh material={base} castShadow>
        <boxGeometry args={size} />
      </mesh>
      <mesh material={cap} position={[0, size[1] / 2 + 0.006, 0]}>
        <boxGeometry args={[size[0] * 0.78, 0.012, size[2] * 0.78]} />
      </mesh>
      {active && led && (
        <mesh material={led} position={[0, size[1] / 2 + 0.03, 0]} castShadow={false}>
          <sphereGeometry args={[0.016, 10, 8]} />
        </mesh>
      )}
    </a.group>
  )
}

function CurtainLever({ mats }: { mats: ReturnType<typeof useConsoleMats> }) {
  const curtain = useTheaterStore((s) => s.curtain)
  const toggle = useTheaterStore((s) => s.toggleCurtain)
  const { rot } = useSpring({ rot: -0.55 + curtain * 1.1, config: { tension: 90, friction: 18 } })
  return (
    <a.group
      position={[0, 0.02, 0.04]}
      rotation-z={rot as unknown as number}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
      onPointerDown={(e) => {
        e.stopPropagation()
        toggle()
      }}
    >
      <mesh material={mats.iron} position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.24, 8]} />
      </mesh>
      <mesh material={mats.caps.red} position={[0, 0.25, 0]} castShadow>
        <sphereGeometry args={[0.03, 12, 10]} />
      </mesh>
    </a.group>
  )
}

export function TechConsole() {
  const mats = useConsoleMats()
  const lightMode = useTheaterStore((s) => s.lightMode)
  const flicker = useTheaterStore((s) => s.flicker)
  const selected = useTheaterStore((s) => s.selectedPropId)

  const setLightMode = useTheaterStore((s) => s.setLightMode)
  const toggleFlicker = useTheaterStore((s) => s.toggleFlicker)
  const firePyro = useTheaterStore((s) => s.firePyro)
  const selectProp = useTheaterStore((s) => s.selectProp)
  const nudgeProp = useTheaterStore((s) => s.nudgeProp)
  const resetProps = useTheaterStore((s) => s.resetProps)

  const D = 0.16 // nudge step

  return (
    <group name="TechConsole" position={[-5.9, 0, 6.9]} rotation={[0, 0.6, 0]}>
      {/* desk body */}
      <mesh material={mats.wood} position={[0, 0.48, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.96, 0.62]} />
      </mesh>
      <mesh material={mats.body} position={[0, 1.0, 0]} rotation={[-0.32, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.07, 0.64]} />
      </mesh>
      {/* label strip on the front lip */}
      <mesh material={mats.label} position={[0, 0.78, 0.315]} rotation={[0, 0, 0]}>
        <planeGeometry args={[1.1, 0.16]} />
      </mesh>

      {/* control plane (matches the desk tilt) */}
      <group position={[0, 1.05, 0.0]} rotation={[-0.32, 0, 0]}>
        {/* lighting buttons */}
        <Btn position={[-0.6, 0.05, -0.12]} base={mats.body} cap={mats.caps.warm} active={lightMode === 'house'} led={mats.ledOn} onClick={() => setLightMode('house')} />
        <Btn position={[-0.44, 0.05, -0.12]} base={mats.body} cap={mats.caps.cool} active={lightMode === 'show'} led={mats.ledOn} onClick={() => setLightMode('show')} />
        <Btn position={[-0.28, 0.05, -0.12]} base={mats.body} cap={mats.caps.dark} active={lightMode === 'dark'} led={mats.ledOn} onClick={() => setLightMode('dark')} />

        {/* flicker toggle */}
        <Btn position={[-0.44, 0.05, 0.1]} base={mats.body} cap={flicker ? mats.caps.green : mats.caps.grey} active={flicker} led={mats.ledOn} onClick={toggleFlicker} size={[0.11, 0.05, 0.11]} />

        {/* curtain lever */}
        <CurtainLever mats={mats} />

        {/* pyro plunger */}
        <group position={[0.62, 0.06, -0.05]}>
          <mesh material={mats.iron} position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.08, 0.05, 16]} />
          </mesh>
          <Btn position={[0, 0.05, 0]} base={mats.iron} cap={mats.caps.red} led={mats.pyro} active onClick={() => firePyro()} size={[0.1, 0.05, 0.1]} />
        </group>

        {/* prop selector row */}
        {STAGE_PROPS.map((p, i) => (
          <Btn
            key={p.id}
            position={[-0.04 + i * 0.12, 0.04, 0.12]}
            base={mats.body}
            cap={selected === p.id ? mats.caps.green : mats.caps.grey}
            active={selected === p.id}
            led={mats.ledOn}
            onClick={() => selectProp(selected === p.id ? null : p.id)}
            size={[0.1, 0.045, 0.1]}
          />
        ))}

        {/* nudge pad (X∓ Y∓ Z∓) + reset, acts on the selected prop */}
        <group position={[0.5, 0.04, 0.16]}>
          {([
            [-0.12, 0, 0, () => selected && nudgeProp(selected, 0, -D)],
            [0.12, 0, 0, () => selected && nudgeProp(selected, 0, D)],
            [0, 0.12, 0, () => selected && nudgeProp(selected, 1, D)],
            [0, -0.12, 0, () => selected && nudgeProp(selected, 1, -D)],
            [-0.12, -0.12, 0, () => selected && nudgeProp(selected, 2, -D)],
            [0.12, -0.12, 0, () => selected && nudgeProp(selected, 2, D)],
          ] as const).map(([x, z, , fn], i) => (
            <Btn key={i} position={[x, 0.04, z]} base={mats.body} cap={mats.caps.cool} onClick={fn} size={[0.075, 0.04, 0.075]} />
          ))}
          <Btn position={[0, 0.04, 0]} base={mats.body} cap={mats.caps.red} onClick={resetProps} size={[0.07, 0.04, 0.07]} />
        </group>
      </group>

      {/* a gooseneck work lamp */}
      <mesh material={mats.brass} position={[0.6, 1.0, -0.2]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.5, 8]} />
      </mesh>
      <mesh material={mats.iron} position={[0.6, 1.26, -0.12]} rotation={[0.7, 0, 0]} castShadow>
        <coneGeometry args={[0.06, 0.1, 12, 1, true]} />
      </mesh>
    </group>
  )
}
