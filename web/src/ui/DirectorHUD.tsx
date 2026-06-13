/**
 * The director's control surface — a small, themed overlay for the things the
 * brief asks to be controllable: the three lighting states, the curtain,
 * flicker and pyro. (The in-world lighting desk in TechConsole does the same
 * job diegetically; this is the quick-access version.)
 */
import { useTheaterStore } from '../state/useTheaterStore'

function HelpOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="boot"
      style={{ background: 'rgba(8,6,5,0.82)', cursor: 'pointer' }}
      onClick={onClose}
    >
      <div className="boot__title" style={{ fontSize: '1.2rem' }}>
        The Theater — Controls
      </div>
      <div style={{ lineHeight: 1.9, fontSize: '0.82rem', letterSpacing: '0.06em', color: 'var(--hud-fg)' }}>
        <div>
          <b>1 / 2 / 3</b> — house lights · show spot · lights off
        </div>
        <div>
          <b>L</b> — cycle lighting · <b>C</b> — curtain · <b>F</b> — flicker
        </div>
        <div>
          <b>Space</b> — fire pyro · <b>R</b> — reset stage props
        </div>
        <div>
          <b>drag</b> — orbit · <b>scroll</b> — dolly · <b>H</b> — close this
        </div>
      </div>
      <div className="boot__sub">click anywhere to close</div>
    </div>
  )
}

export function DirectorHUD() {
  const lightMode = useTheaterStore((s) => s.lightMode)
  const setLightMode = useTheaterStore((s) => s.setLightMode)
  const curtain = useTheaterStore((s) => s.curtain)
  const toggleCurtain = useTheaterStore((s) => s.toggleCurtain)
  const flicker = useTheaterStore((s) => s.flicker)
  const toggleFlicker = useTheaterStore((s) => s.toggleFlicker)
  const firePyro = useTheaterStore((s) => s.firePyro)
  const backend = useTheaterStore((s) => s.backend)
  const showHelp = useTheaterStore((s) => s.showHelp)
  const toggleHelp = useTheaterStore((s) => s.toggleHelp)

  return (
    <>
      <div className="hud__title-tag">
        <b>The Little War Show</b>
        <span>The Theater · {backend.toUpperCase()}</span>
      </div>

      <div className="hud hud--bottom">
        <div className="hud__group">
          <span className="hud__label">Lights</span>
          <button className="hud__btn" data-active={lightMode === 'house'} onClick={() => setLightMode('house')}>
            On
          </button>
          <button className="hud__btn" data-active={lightMode === 'show'} onClick={() => setLightMode('show')}>
            Show
          </button>
          <button className="hud__btn" data-active={lightMode === 'dark'} onClick={() => setLightMode('dark')}>
            Off
          </button>
        </div>

        <div className="hud__group">
          <span className="hud__label">Curtain</span>
          <button className="hud__btn" data-active={curtain > 0.5} onClick={toggleCurtain}>
            {curtain > 0.5 ? 'Open' : 'Closed'}
          </button>
        </div>

        <div className="hud__group">
          <button className="hud__btn" data-active={flicker} onClick={toggleFlicker}>
            Flicker
          </button>
          <button className="hud__btn" style={{ color: 'var(--hud-red)' }} onClick={() => firePyro()}>
            Pyro!
          </button>
          <button className="hud__btn" data-active={showHelp} onClick={toggleHelp}>
            ?
          </button>
        </div>
      </div>

      {showHelp && <HelpOverlay onClose={toggleHelp} />}
    </>
  )
}
