import { useEffect, useRef, useState, useMemo } from 'react'
import skin1 from '../assets/mrp_skin1.png'
import skin2 from '../assets/mrp_skin2.png'
import skin3 from '../assets/mrp_skin3.png'
import skin4 from '../assets/mrp_skin4.png'
import skin5 from '../assets/mrp_skin5.png'
import skin6 from '../assets/mrp_skin6.png'
import skin7 from '../assets/mrp_skin7.png'
import skin8 from '../assets/mrp_skin8.png'
import fortuneIcon   from '../assets/fortune_cookie.png'
import calendarIcon  from '../assets/streak_calendar.webp'
import bsFlame       from '../assets/bs_flame.svg'
import starrDrop     from '../assets/starr_drop.webp'
import { ANNIVERSARY } from '../data/content'

import { LEAGUES } from '../data/leagues'

function getDays() {
  return Math.floor((Date.now() - ANNIVERSARY) / 86400000)
}

function AnimatedCounter({ target }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let n = 0
    const step = Math.ceil(target / 80)
    const t = setInterval(() => {
      n = Math.min(n + step, target)
      setVal(n)
      if (n >= target) clearInterval(t)
    }, 16)
    return () => clearInterval(t)
  }, [target])
  return <>{val.toLocaleString()}</>
}

function MilestoneBar({ days, navigate }) {
  const tierIndex  = Math.min(Math.floor(days / 200), LEAGUES.length - 1)
  const current    = LEAGUES[tierIndex]
  const next       = LEAGUES[Math.min(tierIndex + 1, LEAGUES.length - 1)]
  const daysInTier = days % 200
  const pct        = tierIndex >= LEAGUES.length - 1 ? 100 : Math.round((daysInTier / 200) * 100)
  const remaining  = tierIndex >= LEAGUES.length - 1 ? 0 : 200 - daysInTier

  return (
    <button className="milestone-wrap" onClick={() => navigate('leagues')}>
      <div className="milestone-header">
        <div className="milestone-current">
          <img src={current.icon} alt={current.name} className="milestone-league-icon" />
          <span className="milestone-label">{current.name}</span>
        </div>
        <span className="milestone-see-all">Ver tiers →</span>
      </div>
      <div className="milestone-bar-bg">
        <div className="milestone-bar-fill" style={{ width: `${pct}%` }} />
        <span className="milestone-bar-pct">{pct}%</span>
      </div>
      {remaining > 0 && (
        <p className="milestone-remaining">
          Faltan <strong>{remaining}</strong> días para {next.name} ✨
        </p>
      )}
      {remaining === 0 && (
        <p className="milestone-remaining">¡Rango máximo alcanzado! 🏆</p>
      )}
    </button>
  )
}

function StreakCounter({ days, navigate }) {
  const calRef = useRef(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })
  const [hovering, setHovering] = useState(false)
  const onMove = (e) => {
    const el = calRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 2
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 2
    setTilt({ rx: -y * 14, ry: x * 14 })
  }

  const onLeave = () => {
    setTilt({ rx: 0, ry: 0 })
    setHovering(false)
  }

  return (
    <div className="streak-wrap">
      <div className="streak-panel">

        <h2 className="streak-title">DÍAS JUNTOS</h2>

        <div className="streak-main">
          {/* Galleta de la fortuna — columna izquierda */}
          <div className="streak-scroll-area streak-scroll-col">
            <img src={fortuneIcon} alt="" className="streak-coin streak-coin-l" />
            <div className="streak-scroll">
              <p className="streak-scroll-text">"Sigues siendo mi persona favorita."</p>
              <span className="streak-scroll-sign">— Christian 💙</span>
            </div>
            <img src={fortuneIcon} alt="" className="streak-coin streak-coin-r" />
          </div>

          <div className="streak-cal-outer">
          <div
            ref={calRef}
            className="streak-cal-wrap"
            onMouseMove={(e) => { setHovering(true); onMove(e) }}
            onMouseLeave={onLeave}
            style={{
              transform: `perspective(500px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${hovering ? 1.07 : 1})`,
              transition: hovering ? 'transform 0.05s linear' : 'transform 0.5s cubic-bezier(.22,.61,.36,1)',
            }}
          >
            <div className="streak-fire" aria-hidden="true">
              <img src={bsFlame} className="streak-flame streak-flame-c" alt="" />
            </div>
            <div className="streak-cal-official">
              <img src={calendarIcon} alt="" className="streak-cal-icon" />
              <div className="streak-cal-overlay">
                <div className="streak-cal-number"><AnimatedCounter target={days} /></div>
              </div>
            </div>
          </div>
          </div>

          <div className="streak-info">
            <p className="streak-info-label">RACHA ACTUAL</p>
            <p className="streak-info-days">
              <AnimatedCounter target={days} />
              <span className="streak-info-unit"> días</span>
            </p>
            <p className="streak-info-date">desde el 24 · mayo · 2022 💙</p>
          </div>

        </div>

        <MilestoneBar days={days} navigate={navigate} />

      </div>

      <button className="streak-timecount-btn" onClick={() => navigate('timecount')}>
        <img src={starrDrop} alt="Starr Drop" className="streak-timecount-icon" />
      </button>

    </div>
  )
}

const SECTIONS = [
  { id: 'clasico', skin: 'Mr. P',       color: '#f43f5e', label: 'Cuando me extrañes',     desc: 'Mensajes para los momentos de silencio', img: skin1 },
  { id: 'agente',  skin: 'Agent P',    color: '#10b981', label: 'Misiones juntos',         desc: 'Planes y citas pendientes por cumplir',  img: skin2 },
  { id: 'rey',     skin: 'True Gold',  color: '#f59e0b', label: 'Cosas que amo de ti',     desc: '50 razones — se desbloquean una por clic', img: skin5 },
  { id: 'nevado',  skin: 'Count Pengula', color: '#c084fc', label: 'Emergencia emocional', desc: 'Para cuando todo esté difícil',          img: skin3 },
]

const SKINS = [
  { img: skin1, name: 'Mr. P'          },
  { img: skin2, name: 'Agent P'        },
  { img: skin3, name: 'Count Pengula'  },
  { img: skin4, name: 'True Silver'    },
  { img: skin5, name: 'True Gold'      },
  { img: skin6, name: 'Mr. Dragonfruit'},
  { img: skin7, name: 'Mr. Fly'        },
  { img: skin8, name: 'Gym Rat'        },
]

export default function Hub({ navigate, skinIdx }) {
  const days = getDays()
  // Shared negative delay so ALL floating images start at the same animation phase
  const floatDelay = useMemo(() => `-${((performance.now() % 3500) / 1000).toFixed(3)}s`, [])

  return (
    <div className="hub">
      <div className="hub-status">
        <button className="hub-back-btn" onClick={() => navigate('landing')}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'6px',verticalAlign:'middle'}}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Cerrar sesión
        </button>

        <div className="hub-skin-selector">
          <button className="hub-skin-btn" onClick={() => navigate('viewer')}>
            <div className="hub-avatar-wrap">
              <img src={SKINS[skinIdx].img} alt={`Mr. P ${SKINS[skinIdx].name}`} className="hub-skin-img" />
              <span className="hub-avatar-edit">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18.5 2.5 3 3L12 15l-4 1 1-4z"/></svg>
              </span>
            </div>
            <div className="hub-skin-info">
              <span className="hub-skin-label">PERFIL</span>
              <span className="hub-skin-name">{SKINS[skinIdx].name}</span>
            </div>
          </button>
        </div>

        <div className="hub-status-right">
          <div className="status-dot" />
          <span className="hub-status-text">Protocolo activo</span>
        </div>
      </div>

      <div className="hub-hero">
        <StreakCounter days={days} navigate={navigate} />
      </div>

      <div className="hub-sections">
        <h2 className="hub-sections-title">Selecciona una sección</h2>
        <div className="hub-cards">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              className="hub-card"
              style={{ '--card-color': s.color }}
              onClick={() => navigate(s.id)}
            >
              <img src={s.img} alt={`Mr. P ${s.skin}`} className="hub-card-mrp" style={{ animationDelay: floatDelay }} />
              <div className="hub-card-body">
                <span className="hub-card-skin">Mr. P {s.skin}</span>
                <h3 className="hub-card-label">{s.label}</h3>
                <p className="hub-card-desc">{s.desc}</p>
              </div>
              <span className="hub-card-arrow">→</span>
            </button>
          ))}
        </div>
      </div>

      <div className="hub-extras">
        <button className="hub-extra-btn" style={{ '--card-color': '#a855f7' }} onClick={() => navigate('timeline')}>
          <img src={skin4} alt="True Silver" className="hub-extra-skin" style={{ animationDelay: floatDelay }} />
          <div>
            <span className="hub-card-skin">True Silver</span>
            <strong>Línea del tiempo</strong>
            <p>Año 1 hasta hoy — y más allá</p>
          </div>
          <span className="hub-card-arrow">→</span>
        </button>
        <button className="hub-extra-btn" style={{ '--card-color': '#f97316' }} onClick={() => navigate('house')}>
          <img src={skin6} alt="Mr. Dragonfruit" className="hub-extra-skin" style={{ animationDelay: floatDelay }} />
          <div>
            <span className="hub-card-skin">Mr. Dragonfruit</span>
            <strong>Nuestra casa del futuro</strong>
            <p>Cada rincón tiene una nota</p>
          </div>
          <span className="hub-card-arrow">→</span>
        </button>
      </div>
    </div>
  )
}
