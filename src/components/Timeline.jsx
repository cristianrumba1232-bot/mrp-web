import { TIMELINE } from '../data/content'

export default function Timeline({ navigate }) {
  return (
    <div className="section-page timeline-page">
      <div className="section-header" style={{ '--col': '#a855f7' }}>
        <button className="back-btn" onClick={() => navigate('hub')}>← Inicio</button>
        <div>
          <h1 className="section-title" style={{ marginTop: 8 }}>📅 Línea del tiempo</h1>
          <p className="section-subtitle">Nuestro historia, año a año.</p>
        </div>
      </div>

      <div className="section-body">
        <div className="timeline">
          {TIMELINE.map((yr, i) => (
            <div key={i} className={`tl-item ${yr.isBuilding ? 'tl-item--building' : ''}`}>
              <div className="tl-spine">
                <div className="tl-dot" style={{ background: yr.color, boxShadow: `0 0 12px ${yr.color}80` }} />
                {i < TIMELINE.length - 1 && <div className="tl-line" />}
              </div>
              <div className="tl-card" style={{ '--tl-color': yr.color }}>
                <div className="tl-card-header">
                  <span className="tl-emoji">{yr.emoji}</span>
                  <div>
                    <span className="tl-label">{yr.label}</span>
                    <h3 className="tl-title">{yr.title}</h3>
                  </div>
                </div>
                <ul className="tl-events">
                  {yr.events.map((ev, j) => (
                    <li key={j} className="tl-event">
                      {yr.isBuilding
                        ? <span className="tl-building">{ev}</span>
                        : ev}
                    </li>
                  ))}
                </ul>
                {yr.isBuilding && (
                  <div className="tl-construction">
                    <span>🚧</span> Escribiéndolo juntos...
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
