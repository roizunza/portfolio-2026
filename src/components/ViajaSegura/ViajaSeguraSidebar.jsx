import React, { useState } from 'react';
import { COLORS, FONTS, PROJECTS } from '../../config/theme';

// Definimos el color del proyecto para usarlo en los acentos
const PROJECT_COLOR = PROJECTS.viajaSegura.color; // #A020F0

const AccordionSection = ({ title, tag, isOpen, onClick, children }) => {
  const s = {
    container: { marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '4px 0' },
    titleText: { fontFamily: FONTS.body, fontSize: '14px', fontWeight: '700', color: isOpen ? '#FFFFFF' : '#B0B3B8', margin: 0, letterSpacing: '0.3px', transition: 'color 0.3s' },
    // Cambio 1: Flechas de despliegue con el color del proyecto
    arrow: { color: PROJECT_COLOR, fontSize: '10px', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' },
    metaContainer: { display: 'flex', alignItems: 'center', marginTop: '2px' },
    line: { height: '1px', backgroundColor: 'rgba(188, 186, 192, 0.43)', flexGrow: 1, marginRight: '8px' },
    tagText: { fontFamily: FONTS.title, fontSize: '9px', color: '#7c7889ff', whiteSpace: 'nowrap' },
    content: { display: isOpen ? 'block' : 'none', marginTop: '10px', animation: 'fadeIn 0.3s ease-in-out' }
  };
  return (
    <div style={s.container}>
      <div onClick={onClick}>
        <div style={s.header}><h3 style={s.titleText}>{title}</h3><span style={s.arrow}>▼</span></div>
        <div style={s.metaContainer}><div style={s.line} /><span style={s.tagText}>{tag}</span></div>
      </div>
      <div style={s.content}>{children}</div>
    </div>
  );
};

export default function Sidebar({ t }) {
  const [sectionsState, setSectionsState] = useState({ proposito: true, metodologia: false, insights: false, stack: false });
  const toggle = (section) => setSectionsState(prev => ({ ...prev, [section]: !prev[section] }));

  const s = {
    container: { display: 'flex', flexDirection: 'column', height: '100%', color: '#E0E0E0' },
    headerBox: { backgroundColor: '#181d35', padding: '15px 15px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 },
    subHeader: { fontFamily: FONTS.title, fontSize: '13px', fontWeight: '700', color: '#B0B3B8', margin: '0 0 4px 0', letterSpacing: '1px', textTransform: 'uppercase' },
    mainTitle: { 
        fontFamily: FONTS.title, 
        fontSize: '26px', 
        fontWeight: '700', 
        color: PROJECT_COLOR, 
        margin: '0 0 15px 0', 
        lineHeight: '1' 
    },
    // Cambio 2: Línea de acento en la cabecera con el color del proyecto
    authorBox: { borderLeft: `2px solid ${PROJECT_COLOR}`, paddingLeft: '10px', marginTop: '5px' },
    authorRole: { fontFamily: FONTS.body, fontSize: '11px', color: '#B0B3B8', margin: '2px 0 0 0' },
    contentBody: { flex: 1, padding: '15px 15px', overflowY: 'auto', paddingRight: '5px', scrollbarWidth: 'thin', scrollbarColor: '#424242 transparent' },
    bodyText: { fontFamily: FONTS.body, fontSize: '12px', fontWeight: '400', lineHeight: '1.4', color: '#E0E0E0', marginBottom: '8px' },
    listItem: { marginBottom: '8px' },
    listKey: { color: '#FFFFFF', fontWeight: '500' }
  };

  return (
    <div style={s.container}>
      <style>{` @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } } .custom-scrollbar::-webkit-scrollbar { width: 2px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #424242; border-radius: 2px; } `}</style>
      <div style={s.headerBox}>
        <h2 style={s.subHeader}>{t.subtitle}</h2>
        <h1 style={s.mainTitle}>{t.title}</h1>
        <div style={s.authorBox}>
          <p style={s.authorRole}>{t.role}</p>
        </div>
      </div>

      <div style={s.contentBody} className="custom-scrollbar">
        
        <AccordionSection title={t.proposito.title} tag={t.proposito.tag} isOpen={sectionsState.proposito} onClick={() => toggle('proposito')}>
          <p style={s.bodyText}>{t.proposito.content}</p>
        </AccordionSection>

        <AccordionSection title={t.metodologia.title} tag={t.metodologia.tag} isOpen={sectionsState.metodologia} onClick={() => toggle('metodologia')}>
          <div style={s.listItem}>
            <p style={s.bodyText}>
              <span style={s.listKey}>{t.metodologia.etlKey}</span> {t.metodologia.etlText}
            </p>
          </div>
          <div style={s.listItem}>
            <p style={s.bodyText}>
              <span style={s.listKey}>{t.metodologia.spatialKey}</span> {t.metodologia.spatialText}
            </p>
          </div>
        </AccordionSection>

        <AccordionSection title={t.insights.title} tag={t.insights.tag} isOpen={sectionsState.insights} onClick={() => toggle('insights')}>
          <p style={s.bodyText}>{t.insights.intro}</p>
          <div style={{ marginBottom: '8px', borderLeft: '2px solid rgba(255,255,255,0.3)', paddingLeft: '6px' }}>
            <p style={s.bodyText}><span style={s.listKey}>{t.insights.ejeKey}</span> {t.insights.ejeText}</p>
          </div>
          <div style={{ marginBottom: '8px', borderLeft: '2px solid rgba(255,255,255,0.3)', paddingLeft: '6px' }}>
            <p style={s.bodyText}><span style={s.listKey}>{t.insights.valKey}</span> {t.insights.valText}</p>
          </div>
          <div style={{ borderLeft: '2px solid rgba(255,255,255,0.3)', paddingLeft: '6px' }}>
            <p style={s.bodyText}><span style={s.listKey}>{t.insights.visKey}</span> {t.insights.visText}</p>
          </div>
        </AccordionSection>

        <AccordionSection title={t.stack.title} tag={t.stack.tag} isOpen={sectionsState.stack} onClick={() => toggle('stack')}>
          <p style={s.bodyText}>{t.stack.content}</p>
        </AccordionSection>
      </div>
    </div>
  );
}