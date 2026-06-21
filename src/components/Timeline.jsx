import { TIMELINE } from '../data/content'
import mrpImg from '../assets/mrp_skin4.png'

export default function Timeline({ navigate }) {
  return (
    <div className="section-page timeline-page">
      <div className="section-header" style={{ '--col': '#a855f7' }}>
        <button className="back-btn" onClick={() => navigate('hub')}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:"5px",verticalAlign:"middle"}}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M9 21V12h6v9"/></svg>Inicio</button>
        <div className="section-header-inner">
          <img src={mrpImg} alt="True Silver" className="section-mrp" style={{ filter: 'none' }} />
          <div>
            <span className="section-skin-tag" style={{ background: '#a855f7' }}>True Silver</span>
            <h1 className="section-title">Línea del tiempo</h1>
            <p className="section-subtitle">Nuestra historia, año a año.</p>
          </div>
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
