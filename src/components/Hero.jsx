import React from 'react';
import { FaGithub, FaLinkedin, FaFileDownload, FaPlug } from 'react-icons/fa';

const Hero = ({ alAbrirTerminal, t, idioma }) => {
  
  const manejarClick = (accion, destino) => {
    if (accion === 'modal') {
      if (alAbrirTerminal) alAbrirTerminal();
    } else if (accion === 'link') {
      window.open(destino, '_blank'); 
    } else if (accion === 'descarga') {
      window.open(destino, '_blank'); 
    }
  };

  return (
    <section className="hero-section" id="Sobre_Mi" style={{padding: '40px 0'}}>
      <style>{`
        /* 1. Ventana más grande y aprovechamiento de espacio */
        .profile-container {
          max-width: 1350px; /* Aumentado de 1200px */
          width: 95%;
          margin: 0 auto;
          background: rgba(15, 15, 15, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }

        .profile-window-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-family: monospace;
          font-size: 13px;
        }

        .window-controls {
          display: flex;
          gap: 15px;
          color: rgba(255, 255, 255, 0.5);
        }

        .profile-content {
          display: flex;
          align-items: center;
          gap: 60px;
          padding: 60px; /* Más padding interno para que luzca la ventana */
        }

        .profile-left {
          flex: 0 0 30%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .profile-image {
          width: 320px; /* Imagen un poco más grande para llenar el espacio */
          height: 320px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid rgba(255,255,255,0.05);
          box-shadow: 0 0 30px rgba(0,0,0,0.3);
        }

        .profile-right {
          flex: 1;
        }

        /* 2. DISEÑO RESPONSIVO (MÓVIL) */
        @media (max-width: 992px) {
          .profile-content {
            flex-direction: column;
            padding: 40px 20px;
            gap: 30px;
            text-align: center;
          }
          
          .profile-image {
            width: 200px;
            height: 200px;
          }

          .profile-window-bar {
            padding: 8px 12px;
            font-size: 11px;
          }

          .window-controls {
            gap: 8px;
          }

          .code-block {
            font-size: 13px !important;
            text-align: left; /* El código siempre debe ser alineado a la izquierda */
            width: 100%;
          }

          .profile-buttons {
            justify-content: center !important;
            flex-wrap: wrap;
            gap: 10px;
          }
        }

        @media (max-width: 480px) {
          .profile-window-bar span:first-child {
            max-width: 150px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      `}</style>

      <div className="profile-container">
        {/* Barra superior de la ventana */}
        <div className="profile-window-bar">
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ opacity: 0.5 }}>📂</span> {t.archivoPy}
          </span>
          <div className="window-controls">
            <span>[ _ ] </span>
            <span> [ ▢ ] </span>
            <span> [ X ]</span>
          </div>
        </div>

        <div className="profile-content">
          {/* Columna Izquierda: Foto */}
          <div className="profile-left">
            <img 
              src="/assets/foto_perfil.jpg"
              alt="Rocío Izunza" 
              className="profile-image" 
              onError={(e) => {
                e.target.style.display = 'none'; 
                e.target.parentNode.style.backgroundColor = '#333'; 
              }}
            />
          </div>

          {/* Columna Derecha: Código y Botones */}
          <div className="profile-right">
            <div className="code-block" style={{fontSize: '16px', lineHeight: '1.6'}}>
              <div>
                <span className="ck-key">class</span>{' '}
                <span className="ck-cls">Rocio_Izunza</span>
                <span className="ck-punc">(</span>
                <span className="ck-cls">{t.clase}</span>
                <span className="ck-punc">,</span>{' '}
                <span className="ck-cls">{t.subclase}</span>
                <span className="ck-punc">):</span>
              </div>
              
              <div className="indent-1 ck-com">
                """<br/>
                {t.bio}<br/>
                """
              </div>
              <br/>
              <div className="indent-1">
                <span className="ck-key">def</span>{' '}
                <span className="ck-fn">perfil</span>
                <span className="ck-punc">():</span>
              </div>
              
              <div className="indent-2">
                <span className="ck-key">return</span>{' '}
                <span className="ck-str">"{t.perfilLabel}"</span>
              </div>
            </div>

            <div className="profile-buttons" style={{marginTop: '40px', display: 'flex', gap: '15px'}}>
              <button className="profile-btn" onClick={() => manejarClick('descarga', idioma === 'en' ? '/assets/cv_en.pdf' : '/assets/cv_es.pdf')}>
                <FaFileDownload style={{marginRight: '8px'}}/> {t.cvBtn}
              </button>
              
              <button className="profile-btn" onClick={() => manejarClick('link', 'https://www.linkedin.com/in/rocioizunza/')}>
                <FaLinkedin style={{marginRight: '8px'}}/> LINKEDIN
              </button>
              
              <button className="profile-btn" onClick={() => manejarClick('link', 'https://github.com/roizunza')}>
                <FaGithub style={{marginRight: '8px'}}/> GITHUB
              </button>

              <button className="profile-btn" onClick={() => manejarClick('modal')}>
                <FaPlug style={{marginRight: '8px', transform: 'rotate(90deg)'}}/> {t.cta}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;