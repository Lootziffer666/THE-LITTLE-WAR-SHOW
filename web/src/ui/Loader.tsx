/**
 * Boot veil. Hides once PostFX has put up its first composited frame (the
 * `theater-ready` event), so we never flash an empty canvas while WGSL shaders
 * compile. A timeout fallback guarantees it always clears.
 */
import { useEffect, useState } from 'react'

export function Loader() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let done = false
    const finish = () => {
      if (done) return
      done = true
      window.setTimeout(() => setHidden(true), 350)
    }
    window.addEventListener('theater-ready', finish)
    const fallback = window.setTimeout(finish, 8000)
    return () => {
      window.removeEventListener('theater-ready', finish)
      window.clearTimeout(fallback)
    }
  }, [])

  return (
    <div className={`boot ${hidden ? 'hidden' : ''}`} aria-hidden={hidden}>
      <div className="boot__title">The Little War Show</div>
      <div className="boot__sub">— bringing up the house —</div>
      <div className="boot__bar">
        <i />
      </div>
    </div>
  )
}
