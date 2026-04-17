const LanguageToggle = ({ idioma, setIdioma }) => {
  return (
    <button 
      onClick={() => setIdioma(idioma === 'es' ? 'en' : 'es')}
      style={{
        backgroundColor: 'var(--bg-portfolio)', // El color de tu fondo
        color: '#FFFFFF',
        border: '1px solid rgba(255,255,255,0.2)',
        padding: '5px 12px',
        fontFamily: 'var(--fuente-codigo)',
        cursor: 'pointer',
        borderRadius: '4px',
        fontSize: '0.8rem'
      }}
    >
      {idioma === 'es' ? 'EN' : 'ES'}
    </button>
  );
};