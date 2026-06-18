# The Little War Show — The Theater (WebGPU)

A lived-in, Hearthstone/Wayfinder-styled small-town theater, rebuilt from the
ground up on the modern web 3D stack as a self-contained diorama. This is the
*venue* for The Little War Show: a faded American movie-house where a bitter
anti-authoritarian puppet war-show is staged. Every scuff, broken seat and
cobweb is in-world storytelling, not decoration.

> Built on a new branch alongside (not replacing) the existing Godot prototype.

## Stack

- **Three.js r0.184 `WebGPURenderer` + TSL** — every material is a node graph
  that compiles to WGSL (WebGPU) with an automatic WebGL2 fallback. No binary
  textures: all surfaces are procedural ("high-res" at any zoom).
- **React-Three-Fiber 9** (React 19) — declarative scene graph.
- **TSL post-processing** — bloom, tilt-shift depth-of-field, chromatic
  aberration, warm grade, vignette, film grain (`PostProcessing` pipeline,
  driven each frame by the active lighting state).
- **@react-spring/three** — physics for the curtain, console faders, etc.
- **PixiJS** — optional 2D → texture authoring for posters/signage.
- **zustand** — the "director's desk" state (lighting, curtain, props, pyro).

## Run

```bash
cd web
npm install
npm run dev      # http://localhost:5173  (needs a WebGPU or WebGL2 browser)
npm run build    # typecheck + production bundle
```

## Controls

`1/2/3` house lights · show spot · lights off — `L` cycle — `C` curtain —
`F` flicker — `Space` pyro — `R` reset props — `H` help — `drag/scroll` orbit.

## Architecture

```
src/
  r3f-webgpu.ts          WebGPU renderer factory + R3F extend()
  config/theater.config  the design system: dims, palette, layout, light presets
  materials/             TSL: tsl.ts (facade), tsl-helpers, index.ts (factories)
  systems/               Lighting (3 states), Atmosphere (volumetric air),
                         PostFX (cinematic pipeline), Controls, lightUniforms
  components/
    shell/               Auditorium, Stage, Proscenium, Curtain, StageProps
    seating|foyer|backstage|dressing|console/   the dressed + interactive modules
  state/useTheaterStore  global show state
  ui/                    boot veil + director HUD
```

Surfaces all read from `materials/` and coordinates from `config/`, so the
building stays one coherent place. See each module's header comment for intent.

## Status

Implemented and building green (`npm run build`, tsc + vite):

- **Shell** — auditorium, raised stage, gilded proscenium + footlights, spring
  curtain, console-controllable stage props.
- **Seating** — instanced raked velour rows; some seats stuck half-up / down.
- **Foyer** — box office, chrome-and-cherry snack bar with glowing popcorn,
  neon, glass storefront onto a dusk small-town street (buildings, car, lamp).
- **Backstage** — wings, storage with dust-sheeted scenery, staff/dressing room,
  office, tiled restroom with a flickering tube.
- **Dressing** — posters, cobwebs, scuttling mice/roaches, spiders, trash beside
  the bins, grime in the corners, forgotten props, easter eggs.
- **Console + pyro** — clickable lighting desk (lights/curtain/prop-nudge/
  flicker/pyro) and GPU spark bursts.
- **Systems** — 3-state lighting + flicker, volumetric dust + light shafts,
  cinematic post (bloom, tilt-shift DoF, grade, grain, vignette).

### Known limitations (honest)

- **Not visually verified in a browser** — built in a headless environment, so
  the gate is a green typecheck + production bundle, not a rendered frame.
  Please run `npm run dev` (WebGPU browser) to confirm and to taste-tune.
- **Lighting photometry & DoF focus are tuned blind** — the three states are
  clearly distinct, but exact intensities/focus likely want an eye.
- Bundle is ~1.9 MB (three + WebGPU); fine for a 3D app, could be split later.
