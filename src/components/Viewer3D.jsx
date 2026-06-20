import { useState, useEffect, useRef, useCallback } from 'react'
import skin1   from '../assets/mrp_skin1.png'
import skin2   from '../assets/mrp_skin2.png'
import skin3   from '../assets/mrp_skin3.png'
import daruma  from '../assets/mrp_daruma.png'

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
  audio.volume = 0.28
  audio.play().catch(() => {})
}

const SKINS = [
  { img: skin1,  name: 'Clásico',       glow: '#60a5fa', glow2: '#2563eb', label: 'Mr. P · Skin original',   bg: '#0a1628' },
  { img: skin2,  name: 'Agente P',      glow: '#34d399', glow2: '#059669', label: 'Agent P · Skin espía',    bg: '#021a0e' },
  { img: skin3,  name: 'Drácula',       glow: '#c084fc', glow2: '#7c3aed', label: 'Count Pengula · Vampiro', bg: '#1a0527' },
  { img: daruma, name: 'Daruma',        glow: '#f87171', glow2: '#dc2626', label: 'Daruma Mr. P · Japonés',  bg: '#1a0505' },
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

export default function Viewer3D({ navigate }) {
  const [idx, setIdx] = useState(0)
  const [entering, setEntering] = useState(false)
  const skin = SKINS[idx]

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
        <button className="back-btn" onClick={() => navigate('hub')}>← Inicio</button>
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

      {/* Skin selector */}
      <div className="viewer3d-skins">
        {SKINS.map((s, i) => (
          <button
            key={i}
            className={`viewer3d-skin-btn ${i === idx ? 'active' : ''}`}
            style={{ '--sc': s.glow }}
            onClick={() => { setIdx(i); playRandomVoice() }}
          >
            <img src={s.img} alt={s.name} />
            <span>{s.name}</span>
          </button>
        ))}
      </div>

      <p className="viewer3d-credit">Hecho con 💙 por Christian para Dayana</p>
    </div>
  )
}
