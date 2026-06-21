import { useState, useRef, useEffect } from 'react'
import mrpImg from '../assets/mrp_skin3.png'
import lateporVos from '../assets/late_por_vos.mp3'
import { EMERGENCY_MESSAGES } from '../data/content'

function SongPlayer() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const onTime = () => setProgress(a.currentTime)
    const onMeta = () => setDuration(a.duration)
    const onEnd  = () => {
      setPlaying(false)
      window.dispatchEvent(new Event('mrp:song:pause'))
    }
    a.addEventListener('timeupdate', onTime)
    a.addEventListener('loadedmetadata', onMeta)
    a.addEventListener('ended', onEnd)
    return () => {
      a.removeEventListener('timeupdate', onTime)
      a.removeEventListener('loadedmetadata', onMeta)
      a.removeEventListener('ended', onEnd)
    }
  }, [])

  const toggle = () => {
    const a = audioRef.current
    if (playing) {
      a.pause()
      setPlaying(false)
      window.dispatchEvent(new Event('mrp:song:pause'))
    } else {
      a.volume = 0.05
      a.play()
      setPlaying(true)
      window.dispatchEvent(new Event('mrp:song:play'))
    }
  }

  const seek = (e) => {
    const a = audioRef.current
    const rect = e.currentTarget.getBoundingClientRect()
    const pct  = (e.clientX - rect.left) / rect.width
    a.currentTime = pct * duration
  }

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  const pct = duration ? (progress / duration) * 100 : 0

  return (
    <div className="song-player">
      <audio ref={audioRef} src={lateporVos} preload="metadata" />
      <div className="song-player-top">
        <div className="song-info">
          <span className="song-title">Late Por Vos</span>
          <span className="song-artist">Biper y sus Amigos</span>
        </div>
        <button className="song-play-btn" onClick={toggle}>
          {playing ? '⏸' : '▶'}
        </button>
      </div>
      <div className="song-bar-wrap" onClick={seek}>
        <div className="song-bar-bg">
          <div className="song-bar-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="song-times">
        <span>{fmt(progress)}</span>
        <span>{fmt(duration)}</span>
      </div>
    </div>
  )
}

export default function Nevado({ navigate, prev, next }) {
  return (
    <div className="section-page nevado-page">
      <div className="section-header" style={{ '--col': '#c084fc' }}>
        <button className="back-btn" onClick={() => navigate('hub')}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:"5px",verticalAlign:"middle"}}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M9 21V12h6v9"/></svg>Inicio</button>
        <div className="section-header-inner">
          <img
            src={mrpImg} alt="Count Pengula" className="section-mrp"
            style={{ filter: 'none' }}
          />
          <div>
            <span className="section-skin-tag" style={{ background: '#c084fc' }}>Count Pengula</span>
            <h1 className="section-title">Emergencia emocional</h1>
            <p className="section-subtitle">Para cuando todo esté difícil. Aquí estoy.</p>
          </div>
        </div>
        <div className="section-nav-btns">
          {prev && <button className="section-nav-btn" onClick={() => navigate(prev)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>}
          {next && <button className="section-nav-btn" onClick={() => navigate(next)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>}
        </div>
      </div>

      <div className="section-body">
        <div className="nevado-intro">
          <p>
            Si abriste esta sección, algo se siente pesado hoy. Está bien.
            No tienes que estar bien todo el tiempo. Lee esto con calma.
          </p>
        </div>

        <div className="emergency-cards">
          {EMERGENCY_MESSAGES.map((m, i) => (
            <div key={i} className="emergency-card">
              <h3 className="emergency-title">{m.title}</h3>
              <p className="emergency-text">{m.text}</p>
            </div>
          ))}
        </div>

        <div className="nevado-audio-placeholder">
          <div className="audio-card">
            <span className="audio-icon">🎙️</span>
            <div>
              <strong>Audio de Christian</strong>
              <p>Próximamente — aquí irá un mensaje de voz para ti</p>
            </div>
          </div>
          <SongPlayer />
          <p className="song-dedication">porque realmente late por vos 💙</p>
        </div>

        <div className="nevado-sign">
          <p>
            "No importa qué tan pesado se sienta hoy,<br />
            mañana sigues siendo mi persona favorita.<br />
            Y el día siguiente también."
          </p>
          <span>— Christian 💙</span>
        </div>
      </div>
    </div>
  )
}
