import { useState } from 'react'
import mrpImg from '../assets/mrp_skin5.png'
import { REASONS } from '../data/content'

export default function Rey({ navigate, prev, next }) {
  const [unlocked, setUnlocked] = useState(0)
  const [flash, setFlash] = useState(false)

  const unlock = () => {
    if (unlocked >= REASONS.length) return
    setUnlocked((n) => n + 1)
    setFlash(true)
    setTimeout(() => setFlash(false), 400)
  }

  const pct = Math.round((unlocked / REASONS.length) * 100)

  return (
    <div className="section-page rey-page">
      <div className="section-header" style={{ '--col': '#f59e0b' }}>
        <button className="back-btn" onClick={() => navigate('hub')}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:"5px",verticalAlign:"middle"}}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M9 21V12h6v9"/></svg>Inicio</button>
        <div className="section-header-inner">
          <img
            src={mrpImg} alt="Mr. P Rey" className="section-mrp"
            style={{ filter: 'none' }}
          />
          <div>
            <span className="section-skin-tag" style={{ background: '#f59e0b', color: '#1a1a1a' }}>Mr. P Rey</span>
            <h1 className="section-title">Cosas que amo de ti</h1>
            <p className="section-subtitle">{unlocked} de {REASONS.length} razones desbloqueadas</p>
          </div>
        </div>
        <div className="section-nav-btns">
          {prev && <button className="section-nav-btn" onClick={() => navigate(prev)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>}
          {next && <button className="section-nav-btn" onClick={() => navigate(next)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>}
        </div>
      </div>

      <div className="section-body">
        <div className="rey-crown-intro">
          <span className="rey-crown-icon">👑</span>
          <h2 className="rey-crown-title">Esta corona es tuya, mi princesa</h2>
          <p className="rey-crown-text">
            No la estoy entregando — solo te la estoy recordando.<br />
            Siempre fue tuya.
          </p>
        </div>

        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: `${pct}%`, background: '#f59e0b' }} />
        </div>

        {/* Unlock button */}
        {unlocked < REASONS.length && (
          <div className="rey-unlock-area">
            <button className={`rey-unlock-btn ${flash ? 'rey-unlock-btn--flash' : ''}`} onClick={unlock}>
              <span className="rey-unlock-icon">👑</span>
              <span>Desbloquear razón #{unlocked + 1}</span>
            </button>
            <p className="rey-hint">Cada clic revela una nueva razón</p>
          </div>
        )}

        {unlocked === REASONS.length && (
          <div className="rey-complete">
            <span className="rey-complete-icon">👑</span>
            <p>Las {REASONS.length} razones desbloqueadas.</p>
            <p>Y aún me quedo corto.</p>
          </div>
        )}

        {/* Reasons list */}
        <div className="reasons-list">
          {REASONS.slice(0, unlocked).map((r, i) => (
            <div
              key={i}
              className="reason-item"
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <span className="reason-num">#{i + 1}</span>
              <p className="reason-text">{r}</p>
            </div>
          )).reverse()}
        </div>
      </div>
    </div>
  )
}
