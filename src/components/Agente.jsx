import { useState } from 'react'
import mrpImg from '../assets/mrp_skin2.png'
import { MISSIONS } from '../data/content'

const LS_KEY = 'mrp_missions'

function loadDone() {
  try {
    const saved = localStorage.getItem(LS_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return Array(MISSIONS.length).fill(false)
}

export default function Agente({ navigate }) {
  const [done, setDone] = useState(loadDone)

  const toggle = (i) => setDone((prev) => {
    const next = prev.map((v, j) => (j === i ? !v : v))
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)) } catch {}
    return next
  })
  const count = done.filter(Boolean).length

  return (
    <div className="section-page agente-page">
      <div className="section-header" style={{ '--col': '#10b981' }}>
        <button className="back-btn" onClick={() => navigate('hub')}>← Inicio</button>
        <div className="section-header-inner">
          <img
            src={mrpImg} alt="Mr. P Agente" className="section-mrp"
            style={{ filter: 'none' }}
          />
          <div>
            <span className="section-skin-tag" style={{ background: '#10b981' }}>Mr. P Agente</span>
            <h1 className="section-title">Misiones juntos</h1>
            <p className="section-subtitle">{count} de {MISSIONS.length} misiones completadas</p>
          </div>
        </div>
      </div>

      <div className="section-body">
        <div className="progress-bar-wrap">
          <div
            className="progress-bar-fill"
            style={{ width: `${(count / MISSIONS.length) * 100}%`, background: '#10b981' }}
          />
        </div>

        <div className="mission-list">
          {MISSIONS.map((m, i) => (
            <button
              key={i}
              className={`mission-item ${done[i] ? 'mission-item--done' : ''}`}
              onClick={() => toggle(i)}
            >
              <span className="mission-emoji">{m.emoji}</span>
              <span className="mission-text">{m.text}</span>
              <span className="mission-check">{done[i] ? '✓' : '○'}</span>
            </button>
          ))}
        </div>

        <p className="agente-note">
          Haz clic en cada misión cuando la completen 🕵️
        </p>
      </div>
    </div>
  )
}
