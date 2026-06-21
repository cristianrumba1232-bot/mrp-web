import { useState } from 'react'
import { HOUSE_ROOMS } from '../data/content'
import mrpImg from '../assets/mrp_skin6.png'

export default function House({ navigate }) {
  const [open, setOpen] = useState(null)

  return (
    <div className="section-page house-page">
      <div className="section-header" style={{ '--col': '#f97316' }}>
        <button className="back-btn" onClick={() => navigate('hub')}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:"5px",verticalAlign:"middle"}}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M9 21V12h6v9"/></svg>Inicio</button>
        <div className="section-header-inner">
          <img src={mrpImg} alt="Mr. Dragonfruit" className="section-mrp" style={{ filter: 'none' }} />
          <div>
            <span className="section-skin-tag" style={{ background: '#f97316' }}>Mr. Dragonfruit</span>
            <h1 className="section-title">Nuestra casa del futuro</h1>
            <p className="section-subtitle">Toca cada rincón para ver la nota.</p>
          </div>
        </div>
      </div>

      <div className="section-body">
        <div className="house-intro">
          <p>
            Todavía no existe físicamente, pero ya la tenemos muy clara.
            Cada cuarto tiene una nota pequeña esperándote.
          </p>
        </div>

        <div className="house-grid">
          {HOUSE_ROOMS.map((room, i) => (
            <button
              key={i}
              className={`room-card ${open === i ? 'room-card--open' : ''}`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className="room-emoji">{room.emoji}</span>
              <strong className="room-name">{room.name}</strong>
              {open === i && (
                <p className="room-note">{room.note}</p>
              )}
              {open !== i && (
                <span className="room-tap">Toca para ver</span>
              )}
            </button>
          ))}
        </div>

        <div className="house-footer-note">
          <p>
            "Donde sea que esté, si estás tú,<br />
            ya es nuestro lugar favorito."
          </p>
          <span>— Christian 💙</span>
        </div>
      </div>
    </div>
  )
}
