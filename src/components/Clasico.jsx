import mrpImg from '../assets/mrp_skin1.png'
import { CLASICO_MESSAGES } from '../data/content'

export default function Clasico({ navigate }) {
  return (
    <div className="section-page clasico-page">
      <div className="section-header" style={{ '--col': '#f43f5e' }}>
        <button className="back-btn" onClick={() => navigate('hub')}>← Inicio</button>
        <div className="section-header-inner">
          <img src={mrpImg} alt="Mr. P Clásico" className="section-mrp" style={{ filter: 'none' }} />
          <div>
            <span className="section-skin-tag" style={{ background: '#f43f5e' }}>Mr. P Clásico</span>
            <h1 className="section-title">Cuando me extrañes</h1>
            <p className="section-subtitle">Abre uno cuando lo necesites.</p>
          </div>
        </div>
      </div>

      <div className="section-body">
        {CLASICO_MESSAGES.map((msg, i) => (
          <div key={i} className="message-card">
            <p className="message-time">{msg.time}</p>
            <p className="message-text">{msg.text}</p>
          </div>
        ))}

        <div className="message-card message-card--special">
          <p className="message-time">Para siempre y para todo</p>
          <p className="message-text">
            No importa cuánto tiempo pase entre un mensaje y otro, ni cuántos kilómetros
            haya de distancia. Cuando abras esto, significa que estoy pensando en ti.
            Porque siempre lo hago.
          </p>
          <p className="message-sign">— Christian 💙</p>
        </div>
      </div>
    </div>
  )
}
