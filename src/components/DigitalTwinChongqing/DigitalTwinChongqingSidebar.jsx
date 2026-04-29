import React, { useState } from 'react';
import { PROJECTS } from '../../config/theme';
import { FaGithub } from 'react-icons/fa';

const THEME = PROJECTS.digitaltwin; 

const AccordionSection = ({ title, tag, isOpen, onClick, children }) => {
  const s = {
    container: { marginBottom: '15px', borderBottom: '1px solid var(--borde-sutil)', paddingBottom: '8px' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '4px 0' },
    titleText: {
      fontFamily: 'var(--fuente-ui)', fontSize: '14px', fontWeight: '700',
      color: isOpen ? 'var(--texto-principal)' : 'var(--texto-secundario)', margin: 0,
      letterSpacing: '0.3px', transition: 'color 0.3s'
    },
    arrow: {
      color: THEME.color, 
      fontSize: '10px',
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.3s'
    },
    metaContainer: { display: 'flex', alignItems: 'center', marginTop: '2px' },
    line: { height: '1px', backgroundColor: 'rgba(188, 186, 192, 0.43)', flexGrow: 1, marginRight: '8px' },
    tag: {
      fontFamily: 'var(--fuente-datos)', fontSize: '9px', color: '#FFFFFF',
      letterSpacing: '0.5px', textTransform: 'uppercase'
    },
    content: {
      display: isOpen ? 'block' : 'none', marginTop: '10px', animation: 'fadeIn 0.3s ease-in-out'
    }
  };

  return (
    <div style={s.container}>
      <div onClick={onClick}>
        <div style={s.header}>
          <h3 style={s.titleText}>{title}</h3>
          <span style={s.arrow}>▼</span>
        </div>
        <div style={s.metaContainer}>
          <div style={s.line} />
          <span style={s.tag}>{tag}</span>
        </div>
      </div>
      <div style={s.content}>
        {children}
      </div>
    </div>
  );
};

export default function DigitalTwinChongqingSidebar({ t }) {
  const [sectionsState, setSectionsState] = useState({ proposito: true, metodologia: false, insights: false, stack: false });

  const toggle = (sec) => {
    setSectionsState(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  const handleRepoClick = () => {
    window.open('https://github.com/roizunza/urban-data-pipelines/tree/main/03_DigitaltwinChongqing', '_blank');
  };

  const s = {
    container: { display: 'flex', flexDirection: 'column', height: '100%', color: 'var(--texto-secundario)' },
    headerBox: { backgroundColor: 'var(--fondo-app)', padding: '15px 15px', borderBottom: '1px solid var(--borde-sutil)', flexShrink: 0 },
    subHeader: { fontFamily: 'var(--fuente-datos)', fontSize: '13px', fontWeight: '700', color: 'var(--texto-secundario)', margin: '0 0 4px 0', letterSpacing: '1px', textTransform: 'uppercase' },
    mainTitle: { fontFamily: 'var(--fuente-datos)', fontSize: '24px', fontWeight: '700', color: THEME.color, margin: '0 0 15px 0', lineHeight: '1.1' },
    authorBox: { borderLeft: `2px solid ${THEME.color}`, paddingLeft: '10px', marginTop: '5px' },
    authorRole: { fontFamily: 'var(--fuente-ui)', fontSize: '11px', color: 'var(--texto-secundario)', margin: '2px 0 0 0', fontStyle: 'normal' },
    contentBody: { flex: 1, padding: '15px 15px', overflowY: 'auto', paddingRight: '5px', scrollbarWidth: 'thin', scrollbarColor: '#424242 transparent' },
    bodyText: { fontFamily: 'var(--fuente-ui)', fontSize: '12px', fontWeight: '400', lineHeight: '1.4', color: '#E0E0E0', marginBottom: '8px' },
    ul: { margin: '0', paddingLeft: '15px', color: '#E0E0E0', fontFamily: 'var(--fuente-ui)', fontSize: '12px', lineHeight: '1.6' },
    li: { marginBottom: '8px' },
    highlight: { color: '#FFFFFF', fontWeight: '600' },
    repoBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      backgroundColor: 'var(--azul-electrico)',
      color: '#FFFFFF',
      fontFamily: 'var(--fuente-datos)',
      fontSize: '12px',
      fontWeight: '700',
      padding: '12px 15px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      width: '100%',
      marginTop: '25px',
      marginBottom: '15px',
      transition: 'opacity 0.3s'
    },
    badge: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      padding: '3px 8px',
      borderRadius: '4px',
      fontSize: '10px',
      fontFamily: 'var(--fuente-datos)',
      color: '#A8B2C1',
      display: 'inline-block',
      marginRight: '6px',
      marginBottom: '6px'
    }
  };

  if (!t || !t.proposito) return null;

  return (
    <div style={s.container}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #424242; border-radius: 2px; }
        .btn-repo:hover { opacity: 0.85; }
      `}</style>

      <div style={s.headerBox}>
        <h2 style={s.subHeader}>{t.subtitle}</h2>
        <h1 style={s.mainTitle}>{t.title}</h1>
        <div style={s.authorBox}>
          <p style={s.authorRole}>{t.role}</p>
        </div>
      </div>

      <div style={s.contentBody} className="custom-scrollbar">
        
        <AccordionSection 
          title={t.proposito.title} 
          tag={t.proposito.tag} 
          isOpen={sectionsState.proposito} 
          onClick={() => toggle('proposito')}
        >
          <p style={s.bodyText}>{t.proposito.content}</p>
        </AccordionSection>

        <AccordionSection 
          title={t.metodologia.title} 
          tag={t.metodologia.tag} 
          isOpen={sectionsState.metodologia} 
          onClick={() => toggle('metodologia')}
        >
          <p style={s.bodyText}>{t.metodologia.intro}</p>
          <ul style={s.ul}>
            <li style={s.li}><span style={s.highlight}>{t.metodologia.item1Key}</span> {t.metodologia.item1Text}</li>
            <li style={s.li}><span style={s.highlight}>{t.metodologia.item2Key}</span> {t.metodologia.item2Text}</li>
            <li style={s.li}><span style={s.highlight}>{t.metodologia.item3Key}</span> {t.metodologia.item3Text}</li>
            <li style={s.li}><span style={s.highlight}>{t.metodologia.item4Key}</span> {t.metodologia.item4Text}</li>
            {/* Solo renderiza el item 5 si existe en el JSON, así no rompe nada */}
            {t.metodologia.item5Key && <li style={s.li}><span style={s.highlight}>{t.metodologia.item5Key}</span> {t.metodologia.item5Text}</li>}
          </ul>
        </AccordionSection>

        <AccordionSection 
          title={t.insights.title} 
          tag={t.insights.tag} 
          isOpen={sectionsState.insights} 
          onClick={() => toggle('insights')}
        >
          <p style={s.bodyText}>{t.insights.intro}</p>
          <ul style={s.ul}>
            <li style={s.li}><span style={s.highlight}>{t.insights.item1Key}</span> {t.insights.item1Text}</li>
            <li style={s.li}><span style={s.highlight}>{t.insights.item2Key}</span> {t.insights.item2Text}</li>
            <li style={s.li}><span style={s.highlight}>{t.insights.item3Key}</span> {t.insights.item3Text}</li>
          </ul>
        </AccordionSection>

        <AccordionSection 
          title={t.stack.title} 
          tag={t.stack.tag} 
          isOpen={sectionsState.stack} 
          onClick={() => toggle('stack')}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {t.stack.content.split('|').map((tech, index) => (
              <span key={index} style={s.badge}>{tech.trim()}</span>
            ))}
          </div>
        </AccordionSection>
        
        <button className="btn-repo" style={s.repoBtn} onClick={handleRepoClick}>
          <FaGithub size={16} /> {t.repoBtnLabel || t.repoBtn || "Ver análisis en GitHub"}
        </button>
        
      </div>
    </div>
  );
}