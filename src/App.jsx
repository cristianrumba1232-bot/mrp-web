import { useState, useCallback, useEffect, useRef, lazy, Suspense } from 'react'
import mrpImg    from './assets/mrp_skin1.png'
import mrpSecret from './assets/mrp_skin3.png'
import { CARIÑO_PHRASES } from './data/content'
import bgMusic  from './assets/bg_music.mp3'
import Landing  from './components/Landing'
import Hub      from './components/Hub'
import Clasico  from './components/Clasico'
import Agente   from './components/Agente'
import Rey      from './components/Rey'
import Nevado   from './components/Nevado'
import Timeline  from './components/Timeline'
import TimeCount  from './components/TimeCount'
import LeaguePage from './components/LeaguePage'
import House    from './components/House'
import './App.css'

const Viewer3D = lazy(() => import('./components/Viewer3D'))

/* ── Floating hearts & stars (always on) ── */
function Background() {
  return (
    <>
      <div className="bg-stars" aria-hidden="true">
        {Array.from({ length: 60 }, (_, i) => (
          <div key={i} className="bg-star" style={{
            left: `${(i * 17.3) % 100}%`,
            top: `${(i * 13.7) % 100}%`,
            width: `${1 + (i % 3)}px`,
            height: `${1 + (i % 3)}px`,
            animationDelay: `${(i * 0.3) % 5}s`,
          }} />
        ))}
      </div>
      <div className="bg-hearts" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => (
          <div key={i} className="bg-heart" style={{
            left: `${(i * 7.3 + 2) % 100}%`,
            animationDelay: `${(i * 0.9) % 8}s`,
            animationDuration: `${7 + (i % 4)}s`,
            fontSize: `${12 + (i % 3) * 6}px`,
          }}>
            {i % 3 === 0 ? '💜' : i % 3 === 1 ? '⭐' : '💙'}
          </div>
        ))}
      </div>
    </>
  )
}

/* ── "Necesito cariño" modal ── */
function CarinoModal({ onClose }) {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * CARIÑO_PHRASES.length))

  const next = () => {
    setIdx((i) => {
      let n
      do { n = Math.floor(Math.random() * CARIÑO_PHRASES.length) } while (n === i)
      return n
    })
  }

  const phrase = CARIÑO_PHRASES[idx]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card carino-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <img src={mrpImg} alt="Mr. P" className="modal-mrp" />
        <span className="carino-emoji">{phrase.emoji}</span>
        <p className="carino-text">"{phrase.text}"</p>
        <p className="carino-from">— Christian 💙</p>
        <button className="carino-next-btn" onClick={next}>Otra ✨</button>
      </div>
    </div>
  )
}

/* ── Secret "Nivel Crítico" modal ── */
function SecretModal({ onClose }) {
  return (
    <div className="modal-overlay secret-overlay" onClick={onClose}>
      <div className="modal-card secret-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="secret-header">
          <div className="secret-alert-dot" />
          <span className="secret-tag">NIVEL OCULTO DESBLOQUEADO</span>
        </div>
        <img src={mrpSecret} alt="Mr. P Count Pengula" className="modal-mrp secret-mrp" />
        <h2 className="secret-title">El código<br />más especial</h2>
        <p className="secret-text">
          Sabías que Mr. P es tu brawler favorito.<br />
          Yo también lo sabía. Por eso lo elegí.
        </p>
        <div className="secret-message">
          <p>
            Hice esta página entera para dártela en un momento muy específico:
            cuando me extrañaras tanto que llegaras al código Mr. P.
            No cualquier día — solo ese momento en que ya no aguantabas más
            y me lo dijiste, en persona o por WhatsApp.
          </p>
          <p>
            Ese fue el momento en que yo te mandé esto. Y ahora que estás aquí,
            ya sabes que cada parte de esta página fue hecha pensando en ti. 🐧
          </p>
        </div>
        <p className="secret-sign">— Christian 💙</p>
      </div>
    </div>
  )
}

/* ── Main App ── */
const VIEWS = {
  landing: Landing, hub: Hub, clasico: Clasico, agente: Agente,
  rey: Rey, nevado: Nevado, timeline: Timeline, house: House, viewer: Viewer3D,
  timecount: TimeCount,
  leagues:   LeaguePage,
}

export default function App() {
  const alreadyIn = localStorage.getItem('mrp_activated') === 'true'
  const [view,        setView]        = useState(alreadyIn ? 'hub' : 'landing')
  const [activated,   setActivated]   = useState(alreadyIn)
  const [showCarino,  setShowCarino]  = useState(false)
  const [showSecret,  setShowSecret]  = useState(false)
  const [muted,       setMuted]       = useState(false)
  const [skinIdx,     setSkinIdx]     = useState(0)
  const audioRef    = useRef(null)
  const inactiveRef = useRef(null)

  const logout = useCallback(() => {
    localStorage.removeItem('mrp_activated')
    sessionStorage.removeItem('mrp_scratched')
    setActivated(false)
    setView('landing')
    setShowCarino(false)
    setShowSecret(false)
    audioRef.current?.pause()
    window.history.replaceState({ view: 'landing' }, '')
  }, [])

  /* ── Inactivity timer: 30 min ── */
  useEffect(() => {
    const TIMEOUT = 30 * 60 * 1000

    const reset = () => {
      clearTimeout(inactiveRef.current)
      if (localStorage.getItem('mrp_activated') === 'true') {
        inactiveRef.current = setTimeout(logout, TIMEOUT)
      }
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click']
    events.forEach(e => window.addEventListener(e, reset, { passive: true }))
    reset()

    return () => {
      clearTimeout(inactiveRef.current)
      events.forEach(e => window.removeEventListener(e, reset))
    }
  }, [logout])

  useEffect(() => {
    document.body.style.overflow = (showCarino || showSecret) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [showCarino, showSecret])

  useEffect(() => {
    const audio = new Audio(bgMusic)
    audio.loop = true
    audio.volume = 0.05
    audioRef.current = audio
    if (alreadyIn) {
      audio.play().catch(() => {
        const resume = () => {
          window.removeEventListener('click',      resume)
          window.removeEventListener('touchstart', resume)
          window.removeEventListener('keydown',    resume)
          if (localStorage.getItem('mrp_activated') === 'true') {
            audio.play().catch(() => {})
          }
        }
        window.addEventListener('click',      resume)
        window.addEventListener('touchstart', resume)
        window.addEventListener('keydown',    resume)
      })
    }

    const onSongPlay  = () => audio.pause()
    const onSongPause = () => {
      if (!audio.paused) return
      if (localStorage.getItem('mrp_activated') === 'true') audio.play().catch(() => {})
    }
    window.addEventListener('mrp:song:play',  onSongPlay)
    window.addEventListener('mrp:song:pause', onSongPause)

    return () => {
      audio.pause(); audio.src = ''
      window.removeEventListener('mrp:song:play',  onSongPlay)
      window.removeEventListener('mrp:song:pause', onSongPause)
    }
  }, [])

  /* ── Sync browser history with SPA view ── */
  useEffect(() => {
    window.history.replaceState({ view: alreadyIn ? 'hub' : 'landing' }, '')

    const onPop = (e) => {
      const v = e.state?.view ?? 'landing'
      if (v === 'landing') { setActivated(false); localStorage.removeItem('mrp_activated') }
      setView(v)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigateTo = useCallback((to) => {
    if (to === 'landing') { setActivated(false); localStorage.removeItem('mrp_activated') }
    setView(to)
    window.scrollTo(0, 0)
    window.history.pushState({ view: to }, '')
  }, [])

  const activate = useCallback(() => {
    localStorage.setItem('mrp_activated', 'true')
    setActivated(true)
    setView('hub')
    window.history.pushState({ view: 'hub' }, '')
    audioRef.current?.play().catch(() => {})
    setMuted(false)
  }, [])

  const CurrentView = VIEWS[view] ?? Hub

  return (
    <div className="app">
      <Background />

      <div className={`view-wrap ${view !== 'landing' ? 'view-wrap--in' : ''}`}>
        <Suspense fallback={<div className="viewer-loading">Cargando 3D…</div>}>
          {view === 'landing'
            ? <Landing onActivate={activate} />
            : <CurrentView
                navigate={navigateTo}
                skinIdx={skinIdx}
                setSkinIdx={setSkinIdx}
              />
          }
        </Suspense>
      </div>

      {/* Floating buttons — visible after activation */}
      {activated && (
        <div className="floating-btns">
          <button
            className="float-btn carino-btn"
            onClick={() => setShowCarino(true)}
            title="Necesito cariño"
          >
            🫂<span className="float-label">Necesito cariño</span>
          </button>
          <button
            className="float-btn mute-btn"
            onClick={() => {
              const audio = audioRef.current
              if (!audio) return
              if (muted) { audio.play().catch(() => {}); setMuted(false) }
              else        { audio.pause(); setMuted(true) }
            }}
            title={muted ? 'Activar música' : 'Silenciar música'}
          >
            {muted ? '🔇' : '🔊'}
          </button>
        </div>
      )}

      {/* Secret button — subtle pill, bottom-left */}
      {activated && (
        <button
          className="secret-trigger"
          onClick={() => setShowSecret(true)}
        >
          🔒 NIVEL OCULTO
        </button>
      )}

      {showCarino && <CarinoModal onClose={() => setShowCarino(false)} />}
      {showSecret && <SecretModal onClose={() => setShowSecret(false)} />}
    </div>
  )
}
