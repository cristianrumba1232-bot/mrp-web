import { useState, useEffect, useRef, useCallback } from 'react'
import skin1 from '../assets/mrp_skin1.png'
import skin2 from '../assets/mrp_skin2.png'
import skin3 from '../assets/mrp_skin3.png'
import skin4 from '../assets/mrp_skin4.png'
import skin5 from '../assets/mrp_skin5.png'
import skin6 from '../assets/mrp_skin6.png'
import skin7 from '../assets/mrp_skin7.png'
import skin8 from '../assets/mrp_skin8.png'

/* ── 26 voces oficiales del juego ── */
const VOICES = [
  '/mrp-voices/mrp_start_01.ogg', '/mrp-voices/mrp_start_02.ogg',
  '/mrp-voices/mrp_start_03.ogg', '/mrp-voices/mrp_start_04.ogg',
  '/mrp-voices/mrp_start_05.ogg', '/mrp-voices/mrp_lead_01.ogg',
  '/mrp-voices/mrp_lead_02.ogg',  '/mrp-voices/mrp_lead_03.ogg',
  '/mrp-voices/mrp_kill_01.ogg',  '/mrp-voices/mrp_kill_02.ogg',
  '/mrp-voices/mrp_kill_03.ogg',  '/mrp-voices/mrp_kill_04.ogg',
  '/mrp-voices/mrp_kill_05.ogg',  '/mrp-voices/mrp_atk_01.ogg',
  '/mrp-voices/mrp_atk_02.ogg',   '/mrp-voices/mrp_atk_03.ogg',
  '/mrp-voices/mrp_atk_04.ogg',   '/mrp-voices/mrp_ulti_01.ogg',
  '/mrp-voices/mrp_ulti_02.ogg',
]

let lastVoiceIdx = -1
function playRandomVoice() {
  let idx
  do { idx = Math.floor(Math.random() * VOICES.length) } while (idx === lastVoiceIdx)
  lastVoiceIdx = idx
  const audio = new Audio(VOICES[idx])
  audio.volume = 0.03
  audio.play().catch(() => {})
}

const SKINS = [
  { img: skin1, name: 'Mr. P',           glow: '#60a5fa', glow2: '#2563eb', label: 'Skin original',       bg: '#0a1628' },
  { img: skin2, name: 'Agent P',         glow: '#34d399', glow2: '#059669', label: 'Skin espía',          bg: '#021a0e' },
  { img: skin3, name: 'Count Pengula',   glow: '#c084fc', glow2: '#7c3aed', label: 'Brawl-o-ween',        bg: '#1a0527' },
  { img: skin4, name: 'True Silver',     glow: '#94a3b8', glow2: '#64748b', label: 'Edición plata',       bg: '#0d1117' },
  { img: skin5, name: 'True Gold',       glow: '#fbbf24', glow2: '#d97706', label: 'Edición oro',         bg: '#1a1005' },
  { img: skin6, name: 'Mr. Dragonfruit', glow: '#f43f5e', glow2: '#be123c', label: 'Biodome',             bg: '#1a0510' },
  { img: skin7, name: 'Mr. Fly',         glow: '#a855f7', glow2: '#6d28d9', label: 'Skin insecto',        bg: '#12052a' },
  { img: skin8, name: 'Gym Rat',         glow: '#22d3ee', glow2: '#0891b2', label: 'Skin gimnasio',       bg: '#051525' },
]

/* Floating sparkle dots */
function Sparks({ color }) {
  const sparks = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: 10 + (i * 37.3) % 80,
    y: 5  + (i * 23.7) % 90,
    size: 2 + (i % 3),
    delay: (i * 0.35) % 3,
    dur: 1.8 + (i % 3) * 0.7,
  }))
  return (
    <div className="sparks-wrap" aria-hidden="true">
      {sparks.map(s => (
        <div
          key={s.id}
          className="spark"
          style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size,
            background: color,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function Viewer3D({ navigate, skinIdx, setSkinIdx }) {
  const [idx, setIdx] = useState(skinIdx ?? 0)
  const [entering, setEntering] = useState(false)
  const skin = SKINS[idx]

  const chooseSkin = () => {
    setSkinIdx(idx)
    navigate('hub')
  }

  /* Voz al cargar la página */
  useEffect(() => { playRandomVoice() }, [])

  /* Trigger enter animation on skin change */
  const prev = useRef(idx)
  useEffect(() => {
    if (prev.current !== idx) {
      setEntering(true)
      const t = setTimeout(() => setEntering(false), 500)
      prev.current = idx
      return () => clearTimeout(t)
    }
  }, [idx])

  return (
    <div className="viewer2d-page" style={{ '--gc': skin.glow, '--gc2': skin.glow2, '--bg': skin.bg }}>

      {/* Header */}
      <div className="viewer2d-header">
        <button className="back-btn" onClick={() => navigate('hub')}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:"5px",verticalAlign:"middle"}}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M9 21V12h6v9"/></svg>Inicio</button>
        <div className="viewer3d-title-block">
          <h1 className="viewer3d-title" style={{ color: skin.glow }}>Mr. P · {skin.name}</h1>
          <p className="viewer3d-sub-label">{skin.label}</p>
        </div>
        <div />
      </div>

      {/* Stage */}
      <div className="viewer2d-stage">
        {/* Animated background rings */}
        <div className="v2-ring v2-ring-1" />
        <div className="v2-ring v2-ring-2" />
        <div className="v2-ring v2-ring-3" />

        {/* Spotlight cone */}
        <div className="v2-spotlight" />

        {/* Ground reflection ellipse */}
        <div className="v2-ground" />

        {/* Sparkles */}
        <Sparks color={skin.glow} />

        {/* The character */}
        <img
          src={skin.img}
          alt={`Mr. P ${skin.name}`}
          className={`viewer2d-img ${entering ? 'viewer2d-img--enter' : ''}`}
        />
      </div>

      {/* Choose button */}
      <div className="viewer3d-choose-row">
        {idx === skinIdx
          ? <span className="viewer3d-chosen-badge">✓ Skin de perfil actual</span>
          : <button className="viewer3d-choose-btn" style={{ '--gc': skin.glow }} onClick={chooseSkin}>
              Usar como perfil
            </button>
        }
      </div>

      {/* Skin selector */}
      <div className="viewer3d-skins">
        {SKINS.map((s, i) => (
          <button
            key={i}
            className={`viewer3d-skin-btn ${i === idx ? 'active' : ''} ${i === skinIdx ? 'profile' : ''}`}
            style={{ '--sc': s.glow }}
            onClick={() => { setIdx(i); playRandomVoice() }}
          >
            <img src={s.img} alt={s.name} />
            {i === skinIdx && <span className="viewer3d-profile-dot" />}
          </button>
        ))}
      </div>

      <p className="viewer3d-credit">Hecho con 💙 por Christian para Dayana</p>
    </div>
  )
}
