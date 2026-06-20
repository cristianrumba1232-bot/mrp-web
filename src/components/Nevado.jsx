import mrpImg from '../assets/mrp_skin4.png'
import { EMERGENCY_MESSAGES } from '../data/content'

export default function Nevado({ navigate }) {
  return (
    <div className="section-page nevado-page">
      <div className="section-header" style={{ '--col': '#3b82f6' }}>
        <button className="back-btn" onClick={() => navigate('hub')}>← Inicio</button>
        <div className="section-header-inner">
          <img
            src={mrpImg} alt="Mr. P Nevado" className="section-mrp"
            style={{ filter: 'none' }}
          />
          <div>
            <span className="section-skin-tag" style={{ background: '#3b82f6' }}>Mr. P Nevado</span>
            <h1 className="section-title">Emergencia emocional</h1>
            <p className="section-subtitle">Para cuando todo esté difícil. Aquí estoy.</p>
          </div>
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
          <div className="audio-card">
            <span className="audio-icon">🎵</span>
            <div>
              <strong>Nuestra canción</strong>
              <p>Próximamente — la que siempre nos lleva al mismo lugar</p>
            </div>
          </div>
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
