/**
 * The whole building, assembled. The shell (auditorium, stage, proscenium,
 * curtain, stage props) is authored here; the richly-dressed modules (seating,
 * foyer, backstage rooms, the "alive" dressing layer, the tech console and
 * pyro) are their own components so they can be built and iterated in parallel.
 */
import { Auditorium } from './shell/Auditorium'
import { Stage } from './shell/Stage'
import { Proscenium } from './shell/Proscenium'
import { Curtain } from './shell/Curtain'
import { StageProps } from './shell/StageProps'
import { OrchestraPit } from './shell/OrchestraPit'
import { HouseDetails } from './house/HouseDetails'
import { Seating } from './seating/Seating'
import { Foyer } from './foyer/Foyer'
import { Backstage } from './backstage/Backstage'
import { Crossover } from './backstage/Crossover'
import { ControlBooth } from './backstage/ControlBooth'
import { Dressing } from './dressing/Dressing'
import { Storytelling } from './story/Storytelling'
import { TechConsole } from './console/TechConsole'
import { Pyrotechnics } from './console/Pyrotechnics'

export function Theater() {
  return (
    <group name="Theater">
      {/* --- shell --- */}
      <Auditorium />
      <Stage />
      <Proscenium />
      <Curtain />
      <StageProps />
      <OrchestraPit />
      <HouseDetails />

      {/* --- dressed modules --- */}
      <Seating />
      <Foyer />
      <Backstage />
      <Crossover />
      <ControlBooth />
      <Dressing />
      <Storytelling />

      {/* --- interactive / FX --- */}
      <TechConsole />
      <Pyrotechnics />
    </group>
  )
}
