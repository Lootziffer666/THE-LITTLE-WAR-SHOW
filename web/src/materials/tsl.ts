/**
 * Permissive TSL facade.
 *
 * The published `@types/three` node types are *much* stricter than the actual
 * runtime: method chains like `a.mul(b).add(c)` collapse to `never`, and
 * `vec3(floatA, floatB, floatC)` is rejected because the chained args lose
 * their `"float"` brand. Fighting that with per-call casts buys no real safety
 * and wrecks readability.
 *
 * So we re-export every TSL primitive we use through one `any`-typed surface.
 * This is the conventional, sane way to author TSL in TypeScript. Import all
 * node functions/constants from here (`./materials/tsl`) — never directly from
 * `three/tsl` — and chaining/vector construction just works.
 */
import * as TSLraw from 'three/tsl'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TSL = TSLraw as any

export const {
  // literals / constructors
  float,
  int,
  bool,
  vec2,
  vec3,
  vec4,
  mat3,
  mat4,
  color,
  property,
  // attributes / coordinates
  uv,
  attribute,
  varying,
  vertexColor,
  // math
  add,
  sub,
  mul,
  div,
  mix,
  smoothstep,
  step,
  clamp,
  saturate,
  floor,
  ceil,
  round,
  fract,
  abs,
  sign,
  sin,
  cos,
  tan,
  atan,
  pow,
  exp,
  log,
  sqrt,
  min,
  max,
  mod,
  dot,
  cross,
  normalize,
  length,
  distance,
  reflect,
  refract,
  oneMinus,
  negate,
  // remap / rotate
  remap,
  remapClamp,
  rotate,
  rotateUV,
  // textures / bump
  texture,
  cubeTexture,
  bumpMap,
  normalMap,
  // time / oscillators
  time,
  deltaTime,
  oscSine,
  oscSawtooth,
  oscTriangle,
  oscSquare,
  // built-in geometry/camera nodes
  positionLocal,
  positionWorld,
  positionView,
  positionViewDirection,
  positionGeometry,
  normalLocal,
  normalWorld,
  normalView,
  transformedNormalWorld,
  modelWorldMatrix,
  modelScale,
  cameraPosition,
  cameraViewMatrix,
  // screen / viewport
  screenUV,
  screenCoordinate,
  viewportUV,
  screenSize,
  viewportSize,
  // per-instance / control flow
  uniform,
  uniformArray,
  range,
  instanceIndex,
  vertexIndex,
  Fn,
  If,
  Loop,
  Break,
  select,
  // noise
  mx_noise_float,
  mx_noise_vec3,
  mx_fractal_noise_float,
  mx_fractal_noise_vec3,
  mx_cell_noise_float,
  mx_worley_noise_float,
  triNoise3D,
  // postprocessing graph
  pass,
  mrt,
  output,
  emissive,
  // depth helpers
  viewportDepthTexture,
  linearDepth,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} = TSL as Record<string, any>
