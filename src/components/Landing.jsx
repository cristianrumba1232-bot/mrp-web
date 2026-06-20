import { useState, useEffect } from 'react'
import mrpImg from '../assets/mrp.png'

export default function Landing({ onActivate }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={`landing ${visible ? 'landing--visible' : ''}`}>
      <div className="landing-stars" aria-hidden="true">
        {Array.from({ length: 50 }, (_, i) => (
          <div key={i} className="l-star" style={{
            left: `${(i * 19.7) % 100}%`,
            top: `${(i * 13.1) % 100}%`,
            width: `${1 + (i % 3)}px`,
            height: `${1 + (i % 3)}px`,
            animationDelay: `${(i * 0.4) % 5}s`,
          }} />
        ))}
      </div>

      <div className="landing-inner">
        <div className="landing-mrp-wrap">
          <div className="landing-glow" />
          <img src={mrpImg} alt="Mr. P" className="landing-mrp" />
        </div>

        <div className="landing-text">
          <p className="landing-badge">⬛ PROTOCOLO MR. P · ACCESO PRIVADO</p>
          <h1 className="landing-title">
            Bienvenida,<br />
            <span className="landing-name">Dayana</span>
          </h1>
          <p className="landing-sub">
            Si llegaste hasta aquí,<br />
            probablemente me extrañas.
          </p>
          <button className="activate-btn" onClick={onActivate}>
            Activar Protocolo &nbsp;🐧
          </button>
        </div>
      </div>

      <p className="landing-credit">Solo para Dayana · De Christian con amor 💙</p>
    </div>
  )
}
