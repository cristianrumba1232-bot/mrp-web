import { useState, useEffect } from 'react'
import mrpSecret from '../assets/mrp_skin3.png'
import { SC_KEY, CHALLENGES, PRIZES } from '../data/secret'

export default function SecretLevel({ navigate }) {
  const [unlocked, setUnlocked] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem(SC_KEY) || '[]')) }
    catch { return new Set() }
  })

  const allDoneInitial = unlocked.size >= CHALLENGES.length
  const [subStep,       setSubStep]       = useState(allDoneInitial ? 'challenges' : 'loading')
  const [loadPct,       setLoadPct]       = useState(0)
  const [active,        setActive]        = useState(null)
  const [inputVal,      setInputVal]      = useState('')
  const [codeError,     setCodeError]     = useState(false)
  const [justUnlocked,  setJustUnlocked]  = useState(null)
  const [selectedPrize, setSelectedPrize] = useState(null)

  const allDone = unlocked.size >= CHALLENGES.length

  useEffect(() => {
    if (subStep !== 'loading') return
    let pct = 0
    setLoadPct(0)
    const iv = setInterval(() => {
      pct++
      setLoadPct(pct)
      if (pct >= 100) { clearInterval(iv); setSubStep('challenges') }
    }, 100)
    return () => clearInterval(iv)
  }, [subStep])

  const tryCode = (ch) => {
    if (inputVal.trim().toUpperCase() === ch.code.toUpperCase()) {
      const next = new Set(unlocked)
      next.add(ch.id)
      setUnlocked(next)
      localStorage.setItem(SC_KEY, JSON.stringify([...next]))
      setJustUnlocked(ch.id)
      setActive(null)
      setInputVal('')
      setCodeError(false)
      setTimeout(() => setJustUnlocked(null), 1200)
    } else {
      setCodeError(true)
      setTimeout(() => setCodeError(false), 700)
    }
  }

  /* ── Loading ── */
  if (subStep === 'loading') {
    return (
      <div className="section-page sl-page sl-loading-page">
        <div className="sl-loading-wrap">
          <div className="sc-loading-lock">🔒</div>
          <p className="sc-loading-title">Cargando desafíos ocultos</p>
          <p className="sc-loading-dots"><span>.</span><span>.</span><span>.</span></p>
          <div className="sl-bar-bg">
            <div className="sl-bar-fill" style={{ width: `${loadPct}%` }} />
          </div>
          <p className="sc-loading-pct">{loadPct}%</p>
        </div>
      </div>
    )
  }

  /* ── Challenges ── */
  if (subStep === 'challenges') {
    return (
      <div className="section-page sl-page">
        <div className="section-header" style={{ '--col': '#7c3aed' }}>
          <button className="back-btn" onClick={() => navigate('hub')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'5px',verticalAlign:'middle'}}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M9 21V12h6v9"/></svg>
            Inicio
          </button>
          <div className="section-header-inner">
            <img src={mrpSecret} alt="Nivel Oculto" className="section-mrp" style={{ filter: 'none' }} />
            <div>
              <span className="section-skin-tag" style={{ background: '#7c3aed' }}>Nivel Oculto</span>
              <h1 className="section-title">Los desafíos del amor</h1>
              <p className="section-subtitle">Solo alguien que ama de verdad es capaz de llegar hasta el final.</p>
            </div>
          </div>
        </div>

        <div className="section-body sl-body">
          <div className="sc-progress-row">
            <div className="sc-bar-bg">
              <div className="sc-bar-fill" style={{ width: `${(unlocked.size / CHALLENGES.length) * 100}%` }} />
            </div>
            <span className="sc-bar-text">{unlocked.size} / {CHALLENGES.length}</span>
          </div>

          <div className="sc-list sl-list">
            {CHALLENGES.map((ch) => {
              const done     = unlocked.has(ch.id)
              const isActive = active === ch.id
              const flash    = justUnlocked === ch.id
              return (
                <div key={ch.id} className={`sc-item${done ? ' sc-item--done' : ''}${flash ? ' sc-item--flash' : ''}`}>
                  <button
                    className="sc-item-row"
                    onClick={() => { if (!done) { setActive(isActive ? null : ch.id); setInputVal(''); setCodeError(false) } }}
                    disabled={done}
                  >
                    <span className="sc-item-emoji">{ch.emoji}</span>
                    <div className="sc-item-body">
                      <strong className="sc-item-title">{ch.title}</strong>
                      <p className="sc-item-desc">{ch.desc}</p>
                    </div>
                    <span className="sc-item-icon">{done ? '✅' : isActive ? '🔓' : '🔒'}</span>
                  </button>

                  {isActive && !done && (
                    <div className={`sc-code-row${codeError ? ' sc-code-row--err' : ''}`}>
                      <input
                        className="sc-code-input"
                        type="text"
                        placeholder="Ingresa el código..."
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && tryCode(ch)}
                        autoFocus
                      />
                      <button className="sc-code-submit" onClick={() => tryCode(ch)}>→</button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {allDone && (
            <button className="sc-final-btn sl-final-btn" onClick={() => setSubStep('prizes')}>
              🎁 Desbloquear tu sorpresa
            </button>
          )}
        </div>
      </div>
    )
  }

  /* ── Prizes ── */
  return (
    <div className="section-page sl-page">
      <div className="section-header" style={{ '--col': '#f59e0b' }}>
        <button className="back-btn" onClick={() => setSubStep('challenges')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'5px',verticalAlign:'middle'}}><polyline points="15 18 9 12 15 6"/></svg>
          Retos
        </button>
        <div className="section-header-inner">
          <div>
            <span className="section-skin-tag" style={{ background: '#f59e0b' }}>¡Lo lograste! 🏆</span>
            <h1 className="section-title">Tu sorpresa</h1>
            <p className="section-subtitle">Elige tu regalo con todo el amor.</p>
          </div>
        </div>
      </div>

      <div className="section-body sl-body">
        <div className="sl-prizes-intro">
          <p className="sp-msg">
            Veo que de verdad me amas como para hacer todos estos retos.
            Y sé que los hiciste porque de verdad me amas, no por la sorpresa.
          </p>
          <p className="sp-msg">
            Como realmente me demostraste que me amas mucho, te voy a dar
            con todo amor uno de estos regalos, a tu elección.
          </p>
        </div>

        <div className="sp-grid sl-prizes-grid">
          {PRIZES.map((p, i) => (
            <button
              key={i}
              className={`sp-prize${selectedPrize === i ? ' sp-prize--chosen' : ''}`}
              onClick={() => setSelectedPrize(selectedPrize === i ? null : i)}
            >
              <span className="sp-prize-emoji">{p.emoji}</span>
              <strong className="sp-prize-title">{p.title}</strong>
              <p className="sp-prize-desc">{p.desc}</p>
              {selectedPrize === i && <span className="sp-prize-check">✓ Elegido</span>}
            </button>
          ))}
        </div>

        {selectedPrize !== null && (
          <div className="sp-confirm sl-confirm">
            <p>Has elegido: <strong>{PRIZES[selectedPrize].title}</strong> 🎉</p>
            <p className="sp-confirm-hint">Muéstrale esto a Christian para reclamar tu regalo 💙</p>
          </div>
        )}
      </div>
    </div>
  )
}
