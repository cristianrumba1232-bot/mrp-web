import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { ANNIVERSARY } from '../data/content'

function calcTime() {
  const now   = new Date()
  const start = new Date(ANNIVERSARY)

  let years  = now.getFullYear() - start.getFullYear()
  let months = now.getMonth()    - start.getMonth()
  let days   = now.getDate()     - start.getDate()

  if (days < 0) {
    months--
    const prev = new Date(now.getFullYear(), now.getMonth(), 0)
    days += prev.getDate()
  }
  if (months < 0) {
    years--
    months += 12
  }

  return { years, months, days }
}

function AnimatedCount({ target, active }) {
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!active) { setVal(0); return }
    let current = 0
    const duration = 1200
    const steps = 60
    const increment = target / steps
    const interval = duration / steps
    const t = setInterval(() => {
      current += increment
      if (current >= target) {
        setVal(target)
        clearInterval(t)
      } else {
        setVal(Math.floor(current))
      }
    }, interval)
    return () => clearInterval(t)
  }, [active, target])

  return <>{val}</>
}

const STEPS = [
  { key: 'years',  label: 'años'      },
  { key: 'months', label: 'meses más' },
  { key: 'days',   label: 'días más'  },
]

const HINTS = [
  'Toca para descubrir',
  'Toca para continuar',
  'Toca para ver el resto',
]

export default function TimeCount({ navigate }) {
  const [step, setStep] = useState(0)
  const time = calcTime()

  const advance = () => {
    if (step < STEPS.length) setStep(s => s + 1)
  }

  useEffect(() => {
    if (step !== STEPS.length) return
    const colors = ['#f43f5e', '#60a5fa', '#c084fc', '#fbbf24', '#34d399']
    const burst = (opts) => confetti({ spread: 60, ticks: 120, colors, ...opts })

    const t = setTimeout(() => {
      burst({ particleCount: 90, origin: { x: 0.5, y: 0.55 } })
      setTimeout(() => burst({ particleCount: 50, angle:  60, spread: 70, origin: { x: 0,   y: 0.6 } }), 200)
      setTimeout(() => burst({ particleCount: 50, angle: 120, spread: 70, origin: { x: 1,   y: 0.6 } }), 400)
    }, 1250)

    return () => clearTimeout(t)
  }, [step])

  return (
    <div className="tc-wrap" onClick={advance}>
      <div className="tc-card">
        <button
          className="hub-back-btn tc-back"
          onClick={e => { e.stopPropagation(); navigate('hub') }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'5px',verticalAlign:'middle'}}><path d="M15 18l-6-6 6-6"/></svg>
          Volver
        </button>

        <p className="tc-badge">💙 DESDE EL 24 · MAYO · 2022</p>
        <h1 className="tc-title">Tiempo juntos</h1>

        <div className="tc-reveal-list">
          {STEPS.map((s, i) => (
            <div
              key={s.key}
              className={`tc-reveal-item ${i < step ? 'tc-reveal-item--visible' : ''}`}
            >
              <span className="tc-value">
                <AnimatedCount target={time[s.key]} active={i < step} />
              </span>
              <span className="tc-label">{s.label}</span>
            </div>
          ))}
        </div>

        {step < STEPS.length && (
          <p className="tc-hint">{HINTS[step]}</p>
        )}

        {step === STEPS.length && (
          <p className="tc-hint tc-hint--done">
            {time.years} años, {time.months} meses y {time.days} días 💙
          </p>
        )}
      </div>
    </div>
  )
}
