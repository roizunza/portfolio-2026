import React, { useState } from 'react';
import { COLORS, FONTS, PROJECTS } from '../../config/theme';
import { FaGithub } from 'react-icons/fa';

const THEME = PROJECTS.factorEsfuerzo;

const AccordionSection = ({ title, tag, isOpen, onClick, children }) => {
  const s = {
    container: { marginBottom: '15px', borderBottom: `1px solid ${COLORS.ui.border}`, paddingBottom: '8px' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '4px 0' },
    titleText: {
      fontFamily: FONTS.body, fontSize: '14px', fontWeight: '700',
      color: isOpen ? COLORS.text.primary : COLORS.text.secondary, margin: 0,
      letterSpacing: '0.3px', transition: 'color 0.3s'
    },
    arrow: {
      color: COLORS.ui.accent, 
      fontSize: '10px',
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.3s'
    },
    metaContainer: { display: 'flex', alignItems: 'center', marginTop: '2px' },
    line: { height: '1px', backgroundColor: 'rgba(188, 186, 192, 0.43)', flexGrow: 1, marginRight: '8px' },
    tagText: { fontFamily: FONTS.main, fontSize: '9px', color: '#7c7889ff', whiteSpace: 'nowrap' },
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

export default function Sidebar() {
  const [sectionsState, setSectionsState] = useState({ proposito: true, metodologia: false, insights: false, stack: false });

  const toggle = (section) => {
    setSectionsState(prevState => ({ ...prevState, [section]: !prevState[section] }));
  };

  const s = {
    container: { display: 'flex', flexDirection: 'column', height: '100%', color: COLORS.text.secondary },
    headerBox: { backgroundColor: COLORS.background.sidebarHeader, padding: '15px 15px', borderBottom: `1px solid ${COLORS.ui.border}`, flexShrink: 0 },
    subHeader: { fontFamily: FONTS.data, fontSize: '13px', fontWeight: '700', color: COLORS.text.secondary, margin: '0 0 4px 0', letterSpacing: '1px', textTransform: 'uppercase' },
    mainTitle: { fontFamily: FONTS.main, fontSize: '24px', fontWeight: '700', color: THEME.color, margin: '0 0 15px 0', lineHeight: '1.1' },
    authorBox: { borderLeft: `2px solid ${THEME.color}`, paddingLeft: '10px', marginTop: '5px' },
    authorName: { fontFamily: FONTS.body, fontSize: '14px', fontWeight: '700', color: COLORS.text.primary, margin: 0 },
    authorRole: { fontFamily: FONTS.body, fontSize: '11px', color: COLORS.text.secondary, margin: '2px 0 0 0' },
    contentBody: { flex: 1, padding: '15px 15px', overflowY: 'auto', paddingRight: '5px', scrollbarWidth: 'thin', scrollbarColor: '#424242 transparent' },
    bodyText: { fontFamily: FONTS.body, fontSize: '12px', fontWeight: '400', lineHeight: '1.4', color: '#E0E0E0', marginBottom: '8px' },
    listItem: { marginBottom: '8px' },
    listKey: { color: '#FFFFFF', fontWeight: '500' },
    btnContainer: { padding: '15px', borderTop: `1px solid ${COLORS.ui.border}`, backgroundColor: COLORS.background.panel, flexShrink: 0, marginTop: 'auto' },
    btnGithub: { display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#333', color: '#FFF', fontFamily: FONTS.main, fontSize: '14px', fontWeight: '700', textAlign: 'center', padding: '10px', textDecoration: 'none', borderRadius: '4px', opacity: 0.7, cursor: 'not-allowed' }
  };

  return (
    <div style={s.container}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        .custom-scrollbar::-webkit-scrollbar { width: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #424242; border-radius: 2px; }
      `}</style>

      <div style={s.headerBox}>
        <h2 style={s.subHeader}>ACCESIBILIDAD EN LA RED FERROVIARIA</h2>
        <h1 style={s.mainTitle}>FACTOR DE ESFUERZO</h1>
        <div style={s.authorBox}>
          <p style={s.authorName}></p>
          <p style={s.authorRole}>Modelado de proximidad y fragmentación territorial mediante minería de datos</p>
        </div>
      </div>

      <div style={s.contentBody} className="custom-scrollbar">
        
        <AccordionSection title="01. El Propósito" tag="#GeospatialAnalysis" isOpen={sectionsState.proposito} onClick={() => toggle('proposito')}>
          <p style={s.bodyText}>El proyecto evalúa la relación espacial entre la red ferroviaria japonesa y los activos culturales regionales. El objetivo es cuantificar la desigualdad de acceso que experimentan los puntos de interés (POI) no integrados a los nodos principales, determinando el Factor de Esfuerzo: la distancia física que un usuario debe invertir desde la estación más cercana hasta el destino cultural.</p>
        </AccordionSection>

        <AccordionSection title="02. Estructura y metodología" tag="#DataMining" isOpen={sectionsState.metodologia} onClick={() => toggle('metodologia')}>
          <div style={s.listItem}>
            <p style={s.bodyText}>
              <span style={s.listKey}>Minería de Datos (POIs):</span> Desarrollo de scripts en Python (BeautifulSoup) para el web scraping de sitios especializados, normalizando coordenadas y atributos de activos estratégicos en un dataset estructurado.
            </p>
          </div>
          <div style={s.listItem}>
            <p style={s.bodyText}>
              <span style={s.listKey}>Extracción de Infraestructura:</span> Captura y filtrado automatizado de la red ferroviaria completa de Japón mediante plugins geoespaciales para su integración en el modelo de accesibilidad.
            </p>
          </div>
          <div style={s.listItem}>
            <p style={s.bodyText}>
              <span style={s.listKey}>Near Analysis:</span> Ejecución de un análisis de proximidad en GIS para categorizar el nivel de dificultad de acceso y el aislamiento relativo de los activos periféricos.
            </p>
          </div>
        </AccordionSection>

        <AccordionSection title="03. Insights y visualización" tag="#IsolationMetrics" isOpen={sectionsState.insights} onClick={() => toggle('insights')}>
          <div style={{ marginBottom: '8px', borderLeft: '2px solid rgba(255,255,255,0.3)', paddingLeft: '6px' }}>
            <p style={s.bodyText}><span style={s.listKey}>Centralización:</span> Se identifica que la infraestructura prioriza nodos comerciales densos, aumentando críticamente el esfuerzo para acceder al patrimonio histórico.</p>
          </div>
          <div style={{ marginBottom: '8px', borderLeft: '2px solid rgba(255,255,255,0.3)', paddingLeft: '6px' }}>
            <p style={s.bodyText}><span style={s.listKey}>Métricas de Última Milla:</span> Detección de clústeres donde el esfuerzo de traslado excede los radios de caminabilidad estándar (1km), evidenciando brechas de conectividad.</p>
          </div>
          <div style={{ borderLeft: '2px solid rgba(255,255,255,0.3)', paddingLeft: '6px' }}>
            <p style={s.bodyText}><span style={s.listKey}>Cartografía:</span> Visualización temática que correlaciona la densidad de estaciones con la ubicación de POIs para la toma de decisiones territoriales.</p>
          </div>
        </AccordionSection>

        <AccordionSection title="Stack Tecnológico" tag="#TechSpecs" isOpen={sectionsState.stack} onClick={() => toggle('stack')}>
          <p style={s.bodyText}>Python (BeautifulSoup, Pandas), QGIS (QuickOSM), Figma.</p>
        </AccordionSection>
      </div>

      {/* <div style={s.btnContainer}>
        <a href="#" style={s.btnGithub}>
          <FaGithub style={{ marginRight: '8px', fontSize: '1.1em' }}/> 
          VER ANÁLISIS TÉCNICO
        </a>
      </div> 
      */}
    </div>
  );
}