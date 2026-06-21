import { useState, useEffect } from 'react'
import mrpImg from '../assets/mrp.png'

const ANNIVERSARY_OK = new Set(['24052022', '2452022', '20220524', '240522'])
const BIRTHDAY_OK    = new Set(['28112000', '281100'])

function norm(v) { return v.trim().replace(/\D/g, '') }

function formatDate(value) {
  const d = value.replace(/\D/g, '').slice(0, 8)
  if (d.length <= 2) return d
  if (d.length <= 4) return `${d.slice(0,2)}/${d.slice(2)}`
  return `${d.slice(0,2)}/${d.slice(2,4)}/${d.slice(4)}`
}

export default function Landing({ onActivate }) {
  const [visible, setVisible] = useState(false)
  const [step,    setStep]    = useState('welcome')
  const [q1, setQ1] = useState('')
  const [q2, setQ2] = useState('')
  const [error,   setError]   = useState('')
  const [shake,   setShake]   = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  const goQuiz = () => { setStep('quiz'); setError(''); setQ1(''); setQ2(''); setSuccess(false) }
  const goBack = () => { setStep('welcome'); setError('') }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!ANNIVERSARY_OK.has(norm(q1))) {
      setError('La fecha de inicio no es correcta. 🐧')
      setShake(true); setTimeout(() => setShake(false), 600)
      return
    }
    if (!BIRTHDAY_OK.has(norm(q2))) {
      setError('Ese no es mi cumpleaños... recuérdame mejor 💙')
      setShake(true); setTimeout(() => setShake(false), 600)
      return
    }
    setError('')
    setSuccess(true)
    setTimeout(onActivate, 900)
  }

  return (
    <div className={`landing ${visible ? 'landing--visible' : ''}`}>
      <div className="landing-stars" aria-hidden="true">
        {Array.from({ length: 50 }, (_, i) => (
          <div key={i} className="l-star" style={{
            left: `${(i * 19.7) % 100}%`,
            top:  `${(i * 13.1) % 100}%`,
            width:  `${1 + (i % 3)}px`,
            height: `${1 + (i % 3)}px`,
            animationDelay: `${(i * 0.4) % 5}s`,
          }} />
        ))}
      </div>

      {step === 'welcome' && (
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
            <button className="activate-btn" onClick={goQuiz}>
              Activar Protocolo &nbsp;🐧
            </button>
          </div>
        </div>
      )}

      {step === 'quiz' && (
        <div className="quiz-wrap">
          <div className={`quiz-card${shake ? ' quiz-shake' : ''}${success ? ' quiz-success' : ''}`}>
            <img src={mrpImg} alt="Mr. P" className="quiz-mrp" />
            <p className="quiz-badge">⬛ VERIFICACIÓN DE ACCESO</p>
            <h2 className="quiz-title">¿Eres tú, Dayana?</h2>
            <p className="quiz-sub">Responde para confirmar tu identidad.</p>

            {success ? (
              <p className="quiz-ok">¡Identidad confirmada! Bienvenida 💙</p>
            ) : (
              <form onSubmit={handleSubmit} className="quiz-form">
                <div className="quiz-field">
                  <label className="quiz-label">¿Cuándo empezamos oficialmente?</label>
                  <input
                    className="quiz-input"
                    type="text"
                    placeholder="dd/mm/aaaa"
                    value={q1}
                    onChange={e => { setQ1(formatDate(e.target.value)); setError('') }}
                    autoComplete="off"
                  />
                </div>
                <div className="quiz-field">
                  <label className="quiz-label">¿Cuándo es el cumpleaños de Christian?</label>
                  <input
                    className="quiz-input"
                    type="text"
                    placeholder="dd/mm/aaaa"
                    value={q2}
                    onChange={e => { setQ2(formatDate(e.target.value)); setError('') }}
                    autoComplete="off"
                  />
                </div>
                {error && <p className="quiz-error">{error}</p>}
                <button type="submit" className="activate-btn quiz-submit">
                  Verificar &nbsp;🔑
                </button>
              </form>
            )}

            {!success && (
              <button className="quiz-back-link" onClick={goBack}>
                ← Volver al inicio
              </button>
            )}
          </div>
        </div>
      )}

      <p className="landing-credit">Solo para Dayana · De Christian con amor 💙</p>
    </div>
  )
}
