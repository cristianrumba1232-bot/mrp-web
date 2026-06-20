import { useEffect, useRef, useState } from 'react'
import skin1 from '../assets/mrp_skin1.png'
import skin2 from '../assets/mrp_skin2.png'
import skin4 from '../assets/mrp_skin4.png'
import skin5 from '../assets/mrp_skin5.png'
import fortuneIcon   from '../assets/fortune_cookie.png'
import calendarIcon  from '../assets/streak_calendar.webp'
import bsFlame       from '../assets/bs_flame.svg'
import { ANNIVERSARY } from '../data/content'

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

function StreakCounter({ days }) {
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
              <img src={bsFlame} className="streak-flame streak-flame-l" alt="" />
              <img src={bsFlame} className="streak-flame streak-flame-c" alt="" />
              <img src={bsFlame} className="streak-flame streak-flame-r" alt="" />
            </div>
            <div className="streak-cal-official">
              <img src={calendarIcon} alt="" className="streak-cal-icon" />
              <div className="streak-cal-overlay">
                <div className="streak-cal-number"><AnimatedCounter target={days} /></div>
                <div className="streak-cal-star">✨</div>
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

        <div className="streak-scroll-area">
          <img src={fortuneIcon} alt="" className="streak-coin streak-coin-l" />
          <div className="streak-scroll">
            <p className="streak-scroll-text">"Sigues siendo mi persona favorita."</p>
            <span className="streak-scroll-sign">— Christian 💙</span>
          </div>
          <img src={fortuneIcon} alt="" className="streak-coin streak-coin-r" />
        </div>

      </div>
    </div>
  )
}

const SECTIONS = [
  { id: 'clasico', skin: 'Clásico',    color: '#f43f5e', label: 'Cuando me extrañes',     desc: 'Mensajes para los momentos de silencio', img: skin1 },
  { id: 'agente',  skin: 'Agente',     color: '#10b981', label: 'Misiones juntos',         desc: 'Planes y citas pendientes por cumplir',  img: skin2 },
  { id: 'rey',     skin: 'True Gold',  color: '#f59e0b', label: 'Cosas que amo de ti',     desc: '50 razones — se desbloquean una por clic', img: skin5 },
  { id: 'nevado',  skin: 'True Silver',color: '#93c5fd', label: 'Emergencia emocional',    desc: 'Para cuando todo esté difícil',          img: skin4 },
]

export default function Hub({ navigate }) {
  const days = getDays()

  return (
    <div className="hub">
      <div className="hub-status">
        <button className="hub-back-btn" onClick={() => navigate('landing')}>← Salir</button>
        <div className="status-dot" />
        <span className="hub-status-text">Protocolo Mr. P activo · Modo: Amor infinito</span>
      </div>

      <div className="hub-hero">
        <StreakCounter days={days} />
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
              <img src={s.img} alt={`Mr. P ${s.skin}`} className="hub-card-mrp" />
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
        <button className="hub-extra-btn hub-extra-btn--3d" onClick={() => navigate('viewer')}>
          <span className="hub-extra-icon">🐧</span>
          <div>
            <strong>Ver Mr. P en 3D</strong>
            <p>Rótalo 360° · Cambia de skin</p>
          </div>
          <span className="hub-card-arrow">→</span>
        </button>
        <button className="hub-extra-btn" onClick={() => navigate('timeline')}>
          <span className="hub-extra-icon">📅</span>
          <div><strong>Línea del tiempo</strong><p>Año 1 hasta hoy — y más allá</p></div>
          <span className="hub-card-arrow">→</span>
        </button>
        <button className="hub-extra-btn" onClick={() => navigate('house')}>
          <span className="hub-extra-icon">🏠</span>
          <div><strong>Nuestra casa del futuro</strong><p>Cada rincón tiene una nota</p></div>
          <span className="hub-card-arrow">→</span>
        </button>
      </div>
    </div>
  )
}
