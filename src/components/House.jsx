import { useState } from 'react'
import { HOUSE_ROOMS } from '../data/content'

export default function House({ navigate }) {
  const [open, setOpen] = useState(null)

  return (
    <div className="section-page house-page">
      <div className="section-header" style={{ '--col': '#f97316' }}>
        <button className="back-btn" onClick={() => navigate('hub')}>← Inicio</button>
        <div>
          <h1 className="section-title" style={{ marginTop: 8 }}>🏠 Nuestra casa del futuro</h1>
          <p className="section-subtitle">Toca cada rincón para ver la nota.</p>
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
