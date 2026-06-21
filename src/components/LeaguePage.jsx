import { useEffect, useRef } from 'react'
import { ANNIVERSARY } from '../data/content'
import { LEAGUES } from '../data/leagues'

function getDays() {
  return Math.floor((Date.now() - ANNIVERSARY) / 86400000)
}

export default function LeaguePage({ navigate }) {
  const days = getDays()
  const tierIndex = Math.min(Math.floor(days / 200), LEAGUES.length - 1)
  const currentRef = useRef(null)

  useEffect(() => {
    currentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  return (
    <div className="lp-wrap">
      <div className="lp-card">
        <button className="hub-back-btn lp-back" onClick={() => navigate('hub')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'5px',verticalAlign:'middle'}}><path d="M15 18l-6-6 6-6"/></svg>
          Volver
        </button>

        <h1 className="lp-title">Liga de Trofeos</h1>
        <p className="lp-subtitle">
          Llevan <strong>{days.toLocaleString()}</strong> días juntos
        </p>

        <div className="lp-list">
          {LEAGUES.map((league, i) => {
            const isCompleted = i < tierIndex
            const isCurrent   = i === tierIndex
            const isLocked    = i > tierIndex

            return (
              <div
                key={league.name}
                ref={isCurrent ? currentRef : null}
                className={[
                  'lp-item',
                  isCurrent   ? 'lp-item--current'   : '',
                  isCompleted ? 'lp-item--completed'  : '',
                  isLocked    ? 'lp-item--locked'     : '',
                ].join(' ')}
              >
                {/* connector line */}
                {i < LEAGUES.length - 1 && <div className="lp-connector" />}

                <img
                  src={league.icon}
                  alt={league.name}
                  className="lp-icon"
                />

                <div className="lp-info">
                  <span className="lp-name">{league.name}</span>
                  <span className="lp-days">
                    {league.daysFrom === 0 ? 'Desde el día 1' : `A partir del día ${league.daysFrom.toLocaleString()}`}
                  </span>
                  {isCurrent && (
                    <span className="lp-progress">
                      {(days - league.daysFrom).toLocaleString()} / 200 días en este rango
                    </span>
                  )}
                </div>

                <div className="lp-badge">
                  {isCompleted && <span className="lp-badge--done">✓</span>}
                  {isCurrent   && <span className="lp-badge--here">Aquí</span>}
                  {isLocked    && <span className="lp-badge--lock">🔒</span>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
