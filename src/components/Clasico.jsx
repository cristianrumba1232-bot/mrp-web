import { useState, useRef, useEffect } from 'react'
import mrpImg from '../assets/mrp_skin1.png'
import { CLASICO_MESSAGES } from '../data/content'

const SESSION_KEY = 'mrp_scratched'

function getRevealed() {
  try { return new Set(JSON.parse(sessionStorage.getItem(SESSION_KEY) || '[]')) }
  catch { return new Set() }
}

function saveRevealed(id) {
  try {
    const set = getRevealed()
    set.add(id)
    sessionStorage.setItem(SESSION_KEY, JSON.stringify([...set]))
  } catch {}
}

function ScratchCard({ id, children }) {
  const canvasRef = useRef(null)
  const drawing   = useRef(false)
  const [fading,   setFading]   = useState(false)
  const [revealed, setRevealed] = useState(() => getRevealed().has(id))

  useEffect(() => {
    if (revealed) return
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width  = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    draw(canvas)
  }, [revealed])

  const draw = (canvas) => {
    const ctx = canvas.getContext('2d')
    const w = canvas.width, h = canvas.height

    const grad = ctx.createLinearGradient(0, 0, w, h)
    grad.addColorStop(0,    '#b0b0b0')
    grad.addColorStop(0.35, '#e2e2e2')
    grad.addColorStop(0.65, '#d0d0d0')
    grad.addColorStop(1,    '#a8a8a8')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)

    ctx.globalAlpha = 0.07
    ctx.strokeStyle = '#444'
    ctx.lineWidth = 1
    for (let x = 0; x < w; x += 14) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
    }
    for (let y = 0; y < h; y += 14) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
    }
    ctx.globalAlpha = 1

    ctx.fillStyle = '#555'
    ctx.font = `bold 13px 'Nunito', sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('🪙  Rasca para leer', w / 2, h / 2)
  }

  const getPos = (e) => {
    const canvas = canvasRef.current
    const rect   = canvas.getBoundingClientRect()
    const scaleX = canvas.width  / rect.width
    const scaleY = canvas.height / rect.height
    const src    = e.touches ? e.touches[0] : e
    return {
      x: (src.clientX - rect.left) * scaleX,
      y: (src.clientY - rect.top)  * scaleY,
    }
  }

  const scratch = (pos) => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, 28, 0, Math.PI * 2)
    ctx.fill()

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    let cleared = 0, total = 0
    for (let i = 3; i < data.length; i += 32) {
      total++
      if (data[i] < 128) cleared++
    }
    if (cleared / total > 0.65) triggerReveal()
  }

  const triggerReveal = () => {
    if (fading || revealed) return
    saveRevealed(id)
    setFading(true)
    setTimeout(() => setRevealed(true), 650)
  }

  const onStart = (e) => { e.preventDefault(); drawing.current = true;  scratch(getPos(e)) }
  const onMove  = (e) => { e.preventDefault(); if (!drawing.current) return; scratch(getPos(e)) }
  const onEnd   = ()  => { drawing.current = false }

  return (
    <div className="scratch-wrap">
      <div className="scratch-content">{children}</div>
      {!revealed && (
        <canvas
          ref={canvasRef}
          className={`scratch-canvas${fading ? ' scratch-canvas--fade' : ''}`}
          onMouseDown={onStart}
          onMouseMove={onMove}
          onMouseUp={onEnd}
          onMouseLeave={onEnd}
          onTouchStart={onStart}
          onTouchMove={onMove}
          onTouchEnd={onEnd}
        />
      )}
      {revealed && <span className="scratch-done">✓ revelado</span>}
    </div>
  )
}

export default function Clasico({ navigate }) {
  const [resetKey, setResetKey] = useState(0)

  const resetAll = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setResetKey(k => k + 1)
  }

  return (
    <div className="section-page clasico-page">
      <div className="section-header" style={{ '--col': '#f43f5e' }}>
        <button className="back-btn" onClick={() => navigate('hub')}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'5px',verticalAlign:'middle'}}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M9 21V12h6v9"/></svg>Inicio</button>
        <div className="section-header-inner">
          <img src={mrpImg} alt="Mr. P Clásico" className="section-mrp" style={{ filter: 'none' }} />
          <div>
            <span className="section-skin-tag" style={{ background: '#f43f5e' }}>Mr. P Clásico</span>
            <h1 className="section-title">Cuando me extrañes</h1>
            <p className="section-subtitle">Rasca uno cuando lo necesites.</p>
          </div>
        </div>
      </div>

      <div className="section-body">
        <div className="scratch-top-row">
          <p className="scratch-session-hint">🪙 Las notas reveladas se vuelven a tapar al cerrar sesión</p>
          <button className="scratch-reset-btn" onClick={resetAll}>Volver a tapar</button>
        </div>

        {CLASICO_MESSAGES.map((msg, i) => (
          <ScratchCard key={`${resetKey}-${i}`} id={i}>
            <div className="message-card">
              <p className="message-time">{msg.time}</p>
              <p className="message-text">{msg.text}</p>
            </div>
          </ScratchCard>
        ))}

        <ScratchCard key={`${resetKey}-special`} id={CLASICO_MESSAGES.length}>
          <div className="message-card message-card--special">
            <p className="message-time">Para siempre y para todo</p>
            <p className="message-text">
              No importa cuánto tiempo pase entre un mensaje y otro, ni cuántos kilómetros
              haya de distancia. Cuando abras esto, significa que estoy pensando en ti.
              Porque siempre lo hago.
            </p>
            <p className="message-sign">— Christian 💙</p>
          </div>
        </ScratchCard>
      </div>
    </div>
  )
}
