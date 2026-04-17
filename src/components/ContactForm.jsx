import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './ContactForm.css';

const ContactForm = ({ isOpen, onClose, t }) => {
  const form = useRef(); 
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState(null); 

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };

  const sendEmail = (e) => {
    e.preventDefault(); 
    setIsSending(true);
    setStatus(null);

    //CREDENCIALES - Intactas
    const SERVICE_ID = 'service_v7bqlj4';
    const TEMPLATE_ID = 'conexion_exitosa';
    const PUBLIC_KEY = 'x4IiQCqiWTLmhyKfR';

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then((result) => {
          console.log("Éxito:", result.text);
          setIsSending(false);
          setStatus('success');
          setTimeout(() => {
            onClose();
            setStatus(null);
          }, 2000);
      }, (error) => {
          console.log("Error:", error.text);
          setIsSending(false);
          setStatus('error');
      });
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="notepad-window">
        
        <div className="notepad-header">
          <span className="window-title">{t.title}</span>
          <button className="close-btn" onClick={onClose}>[ X ]</button>
        </div>

        <form ref={form} onSubmit={sendEmail} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          
          <div className="notepad-body">
            
            <div className="input-group">
              <label className="input-label">{t.destinatario}</label>
              <div className="static-field">
                {t.rolDestinatario}
              </div>
            </div>

            {/* 1. NOMBRE */}
            <div className="input-group">
              <label className="input-label">{t.remitente}</label>
              <input 
                type="text" 
                name="nombre_remitente" 
                className="styled-input" 
                placeholder={t.remitentePlaceholder}
                required 
              />
            </div>

            {/* 2. CORREO */}
            <div className="input-group">
              <label className="input-label">{t.correo}</label>
              <input 
                type="email" 
                name="correo_contacto" 
                className="styled-input" 
                placeholder={t.correoPlaceholder}
                required 
              />
            </div>

            {/* 3. ASUNTO */}
            <div className="input-group">
              <label className="input-label">{t.asunto}</label>
              <input 
                type="text" 
                name="subject" 
                className="styled-input" 
                placeholder={t.asuntoPlaceholder}
                required
              />
            </div>

            {/* 4. MENSAJE */}
            <div className="input-group">
              <label className="input-label">{t.mensaje}</label>
              <textarea 
                name="mensaje" 
                className="message-textarea"
                placeholder={t.mensajePlaceholder}
                required
              />
            </div>

            {status === 'success' && <p style={{color: '#15BE80', fontSize: '12px', marginTop:'10px'}}>{t.exito}</p>}
            {status === 'error' && <p style={{color: '#ff5a60', fontSize: '12px', marginTop:'10px'}}>{t.error}</p>}

          </div>

          <div className="notepad-footer">
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isSending}
            >
              {isSending ? t.btnEnviando : t.btnEnviar}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default ContactForm;