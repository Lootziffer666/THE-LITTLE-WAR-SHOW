# Module author guide — The Little War Show / The Theater

Read this in full before implementing a module. It is the contract that keeps
every part of the building coherent.

## What this is

A web3D **diorama** of a faded 1950s American small-town movie-house that stages
*The Little War Show* — a bitter, anti-authoritarian puppet war-show. Look:
**Hearthstone / Wayfinder** — warm, lush, lived-in, cinematic, slightly
miniature. Every scuff, broken seat, cobweb and bit of trash is in-world
storytelling. Workdir: `/home/user/THE-LITTLE-WAR-SHOW/web` (Vite + React 19 +
TypeScript). **Dependencies are already installed — never run `npm install`.**

## Tone (non-negotiable)

Satire targets propaganda, bureaucracy, command-culture, authority — **never**
victims, children, or real suffering. No gore, no realistic weapons-as-threat,
no glorified violence. Everything is theatrical / cardboard / tin. Decay is
faded-grandeur charm, not misery. Copy may be bitter-bureaucratic, never cruel.

## Stack & the one hard rule

Three.js r0.184 `three/webgpu` (WebGPURenderer) + **TSL** node materials, R3F v9,
@react-spring/three, zustand. Materials are procedural TSL — no image files.

**HARD RULE:** import all TSL node functions/constants from the local facade
`../../materials/tsl` (relative to your file), **never** from `three/tsl` — the
published types are too strict and won't compile when chained. Import three
classes from `three/webgpu`. When chaining display/post nodes, cast to `any`.

## Imports you have (use these — don't reinvent)

```ts
// material factories
import {
  woodFloorMaterial, stageDeckMaterial, darkWoodMaterial, velourMaterial,
  curtainVelvetMaterial, fabricMaterial, plasterMaterial, wainscotMaterial,
  ceilingMaterial, carpetMaterial, concreteMaterial, giltMaterial, brassMaterial,
  steelMaterial, chromeMaterial, blackIronMaterial, glassMaterial,
  emissiveMaterial, paintedFlatMaterial, posterMaterial, cobwebMaterial,
} from '../../materials'
//   emissiveMaterial(hex, intensity=4, glowNode?) — pass a glow.* uniform so it
//     dims with the lighting state. velourMaterial({color?,worn?}),
//     plasterMaterial({color?,grime?,cracks?}), fabricMaterial({color?,foldScale?}),
//     glassMaterial({tint?,opacity?}), paintedFlatMaterial(tex,{rough?,age?}),
//     posterMaterial(tex,{gloss?}).

// TSL facade (the common surface; more is exported — read materials/tsl.ts)
import {
  float, vec2, vec3, vec4, color, uv, mix, smoothstep, clamp, floor, fract, abs,
  sin, cos, pow, min, max, mod, dot, time, positionLocal, positionWorld,
  normalWorld, normalView, uniform, range, instanceIndex, mx_noise_float,
  mx_fractal_noise_float, triNoise3D, oscSine,
} from '../../materials/tsl'

import { c, cnode, fbm, unoise, hash11, hash21, worley, fresnel, facingRatio } from '../../materials/tsl-helpers'
//   c(hex)->THREE.Color, cnode(hex)->color node, fbm(posNode, octaves)->[0,1]

import { Box, Plane } from '../primitives'
//   <Box args={[w,h,d]} position rotation material castShadow receiveShadow name/>
//   You may also write raw <mesh material={m}><boxGeometry args={[..]}/></mesh>
//   geometries: box/sphere/cylinder/cone/plane/torus/ring/tube.

import {
  HOUSE, STAGE, PROSCENIUM, SEATING, FOYER, BACKSTAGE, PALETTE,
  STAGE_PROPS, PYRO_EMITTERS, WORLD_SEED,
} from '../../config/theater.config'

import { useTheaterStore } from '../../state/useTheaterStore'
//   render: useTheaterStore(s=>s.x). frame/handlers: useTheaterStore.getState().
//   actions: setLightMode(m) cycleLightMode() setCurtain(0..1) toggleCurtain()
//     toggleFlicker() selectProp(id|null) nudgeProp(id, axis0|1|2, delta)
//     togglePropVisible(id) resetProps() firePyro(emitterId?)
//   state: lightMode 'house'|'show'|'dark', curtain, flicker, selectedPropId,
//     propOverrides{[id]:{pos:[x,y,z],rotY,visible}}, pyroSeq, pyroEmitter,
//     reducedMotion.

import { glow } from '../../systems/lightUniforms'
//   uniform nodes: glow.house/foot/show/exit/neon/ember/flicker — pass to
//   emissiveMaterial so your bulbs/neon track the lighting state.

import { showPoster, POSTER_KEYS, marqueeSign, snackMenu, boxOfficeCard } from '../../textures/posters'
import { makeCanvasTexture, ageCanvas } from '../../textures/canvasTexture'
//   each texture fn returns a THREE.CanvasTexture. makeCanvasTexture(w,h,(ctx,w,h)=>{...}).
//   POSTER_KEYS = ['warshow','tyrants','disaster','occupation','dumbality'].

import { Rng } from '../../utils/rng'
//   new Rng(WORLD_SEED ^ 0xYOURS); .range(a,b) .int(a,b) .chance(p) .pick(arr) .gauss() .fork(salt)

import { Instances, Instance } from '@react-three/drei' // for many repeated meshes
import { a, useSpring } from '@react-spring/three'       // physics; a.group/a.mesh, value.to(fn)
```

## Coordinates

Right-handed. **+X** right, **+Y** up, **+Z** toward the audience; the stage
recedes into −Z. Origin = centre of the stage floor at the house-floor datum.
**House floor is flat at y=0. Stage deck top at y=STAGE.deckY (1.0).**

- `HOUSE` {halfWidth 8, sideWallX 8, frontZ 3.6, backZ 19, ceilingY 8.2, rakePerMetre 0.085, aisleWidth 1.4}
- `STAGE` {width 9, depth 6, deckY 1.0, frontZ 3.0, backZ −3.0}
- `PROSCENIUM` {openingWidth 9.4, openingHeight 5.4, topY 6.4, z 3.2}
- `SEATING` {rows 9, seatsPerBlock 6, rowSpacing 1.05, seatWidth 0.62, seatPitch 0.7, firstRowZ 5.0, seatBaseHeight 0.46}
- `FOYER` {z0 19.4, z1 27.0, width 16, ceilingY 4.3, glassZ 27.0} — beyond the rear doorway
- `BACKSTAGE` {z0 −3.4, z1 −10.0, width 14, ceilingY 5.0, wingX 5.1} — behind the stage; floor at stage-deck level (y≈1.0)
- Rear doorway (house→foyer): gap in the rear wall at z=19, x∈[−1.5,1.5], y∈[0,3].

Interaction: pointer events work (`onPointerDown/Over/Out` on meshes). You may
set `document.body.style.cursor` on hover.

## Constraints

- Create/replace files **only inside your assigned folder**. Do not touch
  package.json, tsconfig, vite.config, or the materials/config/systems/state/
  textures/ folders or other component folders.
- Never run `npm install` / `npm run build` / `vite`. You MAY typecheck only your
  own files: from `web/` run
  `node_modules/.bin/tsc --noEmit -p tsconfig.json 2>&1 | grep <yourFolder>` —
  other modules may be empty stubs; only fix errors in YOUR files.
- No browser is available; you can't see output. Use the existing material
  library as your reference for correct TSL; prefer the factories over custom TSL.
- Respect `reducedMotion` (slow/stop animations when true) where you animate.

## Quality bar

Production-ready. Each file opens with a concise intent comment. Deterministic
placement via `Rng`. Clean, typed, no dead code, no TODOs. Warm, lived-in,
cinematic. Export exactly the component(s) your task names.
