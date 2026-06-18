/**
 * Shared emissive-glow uniforms.
 *
 * Emissive fixtures (chandelier bulbs, footlight bulbs, EXIT signs, foyer neon,
 * embers) reference these uniform nodes in their materials; the Lighting system
 * is the single writer, driving them from the active LightMode preset plus the
 * animated flicker. This keeps "which lights are on" in one authoritative place
 * and lets the whole building switch state coherently.
 */
import { uniform } from '../materials/tsl'

export const glow = {
  /** House chandeliers & wall sconces. */
  house: uniform(1.0),
  /** Footlight bulbs along the stage lip. */
  foot: uniform(0.0),
  /** Stage practicals tied to the show spot. */
  show: uniform(0.0),
  /** EXIT signs — almost always lit, brightest when the house is dark. */
  exit: uniform(1.0),
  /** Foyer neon / marquee. */
  neon: uniform(1.0),
  /** Dying embers / pilot lights, only in the dark. */
  ember: uniform(0.0),
  /** Global flicker multiplier (≈1, dips briefly). */
  flicker: uniform(1.0),
}
